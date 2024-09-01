import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card,Input, theme } from 'antd';
import { MdViewer } from '@/components/MdEditor/ReactMdEditorByView';
import MarkdownEditor from '@/components/MdEditor/ReactMdEditor';
import MarkdownEditorComponent from '@/components/MdEditor/ReactMdEditor';
import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';

const Welcome: React.FC = () => {
  const markdownContent = `大家好，我是香香。

今天我们接着来说 RocketMQ，没看前面 3 章的可以先看看前面的 3 章，有个大体的了解之后，可以再来看今天的内容。

[一：能够抵挡多次双十一的中间件 到底是怎么设计的？](https://mp.weixin.qq.com/s?__biz=Mzg3OTQ0NzI3OA==&mid=2247485294&idx=1&sn=9f048c7c61d9afb4d6ff12cdc1b8d069&chksm=cf051aeff87293f9576b89a94875f6d2b954f76ef8a9edc72c2b23727882c31e3b8016d74e76&token=364393184&lang=zh_CN#rd)

[二：消息队列都有什么模型？RocketMQ 又采用的哪种？](https://mp.weixin.qq.com/s?__biz=Mzg3OTQ0NzI3OA==&mid=2247485427&idx=1&sn=b28d2a12195b15f67fe05a4d848d47e2&chksm=cf051a72f872936423601531ccf585a4cc007ced4440cd96a0b9e60cfc4c1192f1483934c85d&token=364393184&lang=zh_CN#rd)

[三：RocketMQ 高性能从何谈起？数据又存放在哪？](https://mp.weixin.qq.com/s?__biz=Mzg3OTQ0NzI3OA==&mid=2247485488&idx=1&sn=06721c5482f58fe9e8ce4cdc8e7aa3ae&chksm=cf0515b1f8729ca72cab2d68ba780bdab618d083bd67f1456b131e3ed203c702fce4d0e1ac74&token=364393184&lang=zh_CN#rd)

经过前面的学习，我们了解到 RocketMQ 其实是将消息存放在 commitLog 文件中，并且是以 Topic 顺序写的方式。


![](https://files.mdnice.com/user/56758/e4c19f59-55e7-42a6-82bc-0e94c2008329.png)

可以看到的是，将所有 Topic 顺序写入到了 commitLog 文件中，那么就会存在一个问题，就是写入是写入了，我应该怎么样快速定位到这条消息并且消费呢？

## ConsumeQueue

这个消费者队列其实对应的就是我们前面所说的队列。

那 ConsumeQueue 和 commitLog 又有什么关系呢？

在生产者发送消息之后，一旦写入 commitLog 也就代表着这条消息已经被持久化到硬盘中了。那么我们就可以开启一个定时分发任务，将写入 commitLog 的消息根据不同 Topic 发送给对应的 ConsumeQueue 就好了，然后消费者去 ConsumeQueue 去取消息进行消费。文字可能不是很好理解，我画张图。


![](https://files.mdnice.com/user/56758/e27cca45-4716-45ba-ac67-664541907da1.png)

那么问题又来了，这个定时分发会不会有延迟啊？如果有延迟的话，那消费肯定就不及时了。

答案是延迟其实可以忽略不计，因为每次分发之后，线程都 sleep 1 ms。也就是 1 ms 分发一次，基本上可以算是实时分发。

如果有细心的小伙伴可能这个时候就意识到问题了，我们的消息已经持久化到 commitLog 了，那 ConsumeQueue 中存放的是什么呢？是全量的消息嘛？

当然不是了，如果存储全量消息的话。虽然查询消息的速度变快了，但是又增加了存储空间的负载，也就还是将消息存放了 2 次，这样的话，消息所占用的空间就 * 2 了，显然并不是很好的方案。

那么，ConsumeQueue 中到底存放的是什么呢？

我就不兜圈子了，ConsumeQueue 中存储的其实是 commitLog 的**偏移量**。


![](https://files.mdnice.com/user/56758/61498813-dd01-416b-8be9-b6819ccc9cde.png)


也就是如果 commitLog 中存放了消息：“xiang”，从下标 0 开始读 2 位，读到的内容就是 “xi”；从 2 开始读 3 位，读到的内容就是 “ang”。

那么按照上面的逻辑，ConsumeQueue 只需要存储消息在 commitLog 文件中的偏移量以及消息对应的长度就行了。

![](https://files.mdnice.com/user/56758/72a31607-4fdc-4c8c-85c1-494bea3dd99f.png)

这样的话就解决了我们上面所说的矛盾点：**ConsumeQueue 中存放全量消息导致的存储占用。通过消息偏移量和 size 就可以大幅度减少 ConsumeQueue 的体积，从而减少占用。**

所以消费消息的时候，应该是先从 ConsumeQueue 中获取消息的偏移量再去 commitLog 中进行查询。这两步的查询其实也是在时间和空间上做了平衡的，毕竟想要换取空间上的优势，那就需要在时间上舍去一些了。

## consumeOffset

这个 consumeOffset 其实就是消费者在队列中消费消息的下标。

在一个队列被多个消费者消费的情况下，就需要维护每个消费者消费消息的位置，每消费一条消息，offset 就 +1,然后消费者就可以根据 offset 来查找消息进行对应的消费了。

其实也就可以理解为数组中的下标就行。这个下标也就称为 consumeOffset。

千万不要和之前 commitLog 中的 offset 搞混了！

- commitLog offset：消息在 commitLog 文件中的偏移位置，通过 consumeOffset 中的偏移量去定位到 commitLog 中消息的所处位置，然后利用 size 去拿到具体的消息。

- consumeOffset：消费者在队列中消费消息的位置。如果消费者消息到第三条消息，consumeOffset 就为 3，如果是从 0 开始的，那就为 2。

## indexFile

indexFile 其实就是消息的索引。

通过前面的介绍，我们对于 commitLog、consumeQueue、consumeOffset 都有了一定的理解，那么 indexFile 又是什么东西呢？

除了可以根据 Topic 进行消费消息外，RocketMQ 还提供了可以根据 key 来进行查询消息的功能。

indexFile 提供了一种可以根据 key 或者时间区间来进行查询消息的方法。每个 indexFile 的命名其实就是这个 indexFile 被创建的时间戳。

其实 indexFile 的使用场景就是：想要快速的定位到某一条消息。

如果是和订单有关的消息，那么我们就可以将 key 设置为订单的编号，想要快速定位到某一个订单消息的信息的时候，就可以通过这个 key 快速的查找到。
（当然如果没有 key，也就不会有 indexFile）

每个 Broker 中包含了一组 indexFile，每个 indexFile 由 3 部分组成：header、solt、indexs（index item）。


![](https://files.mdnice.com/user/56758/0380a954-100b-4a14-9afd-66b92780a336.png)

我们先来介绍一下 header，header 中包含 6 个元数据：

- beginTimestamp：记录该 indexFIle 中第一条消息的存放时间；
- endTimestamp：记录该 indexFile 中最后一条消息的存放时间；
- beginPhyoffset：记录该 indexFile 中第一条消息在 commitLog 中的偏移量 commitLogOffset；
- endPhyoffset：记录该 indexFile 中最后一条消息在 commitLog 中的偏移量 commitLogOffset；
- hashSlotCount：记录已经填充有 index 的solt 的数量；
- indexCount：记录已用 index 的个数。

其次就是 solt（500w 槽），每个槽的固定大小为 4 字节，一个 indexFile 中共有 500w 个槽。

存储消息的时候，会先根据 key 进行 hash 运算，再通过运算出来的 hashKey % 500w 得到一个值，这个值就代表应该存放在第几个槽位上。



![](https://files.mdnice.com/user/56758/c86daf0e-b185-4a44-8b80-8d14faf429ed.png)

通过上图可以看出来，经过 hashKey % 500w 之后得到 1，则将存入下标为 1 的位置上，现在存储的位置已经知道了，那么，存储什么东西呢？

存储的其实就是 indexItem 的下标，每个 indexItem 是 20 个字节，并且一个 indexFile 中存在 2000w 个 indexFile，存储的内容为消息在 commitLog 中的偏移量。


![](https://files.mdnice.com/user/56758/2c00c821-3652-40d1-a8da-86d4e704f1c2.png)

既然存储的是 commitLog 的偏移量，那消息在 commitLog 中是顺序存储的，也就是说第二条消息的偏移量是 1，第三条消息的偏移量是 2...

所以对应到 solt 中，其实也是依次递增的存储：0、1、2、3...也就是说下一个 solt 中存储的消息即为 1。

那既然在 solt 槽中存储的位置是需要进行 hash 的，说到这里，大家有没有想到什么？对呀！hash 是会冲突的，那如果 hash 冲突了，又该怎么办呢？

还是用上面的图来举例子：


![](https://files.mdnice.com/user/56758/74b695f5-9678-4996-82b8-d83cb851e74e.png)

我来解释一下，如果第 2 条消息的 solt 槽也是 1，那就将 solt 槽中的值更新为最新的 indexItem 的下标，再在这个下标中记录前一个 indexItem 的下标，并且还需要添加 hashKey，通过 hashKey 来判断当前 indexItem 的消息是否为对应的消息。

如果通过 hashKey 判断发现是一只的，就说明要找的值就是当前这个，如果不一致的话，就需要根据 preIndex（也就是上图中的 0）所记录的 indexItem 去接着查找。

简单举个例子，如果现在查找的是 key 为 123，通过到 solt 为 1，然后拿着 1 去 indexs 中去找下标为 1 的 indexItem，对比 hashKey 之后发现 hashKey 和 123 计算出来的不一样，则获取 preIndex 再去定位查找，直至查找到一致的 hashKey。

可以再通过下图理解一下：


![1](https://t8.baidu.com/it/u=854240145,3454298067&fm=190&app=131&size=f242,150&n=0&f=PNG?s=A1D183660DECAF720EFCCD090000F0C3&sec=1725296400&t=1ab44ac7ffeaa31556939d8a58b4e6b9)



indexItem 中同样存储了 4 个元数据：
- keyHash：记录消息中指定 key 的 hash 值；
- phyOffset：记录当前 key 对应消息在 commitLog 中的偏移量 commitLogOffset；
- timeDiff：记录当前 key 对应消息的存储时间与当前 indexFile 创建时间的时间差（根据这个时间还有 header 中的时间就可以进行时间范围的查询）；
- preIndex：记录当前 solt 下的前一个 indexItem 的下标；

值得一提的是，indexFile 和 consumeQueue 都是从 commitLog 中分发过来的；

我是香香，我们今天就先分享到这里。



  `;

  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { TextArea } = Input;
  return (
    <PageContainer>



      <Card>
        <div>
          <h1>Java 基础篇</h1>
          <MdViewer content={markdownContent} />
        </div>
        {/*<h1>新建文章</h1>*/}
        {/*文章标题：*/}
        {/*<br/><br/>*/}
        {/*<Input style={{width:"500px"}} placeholder="Basic usage" />*/}
        {/*<br/><br/>*/}
        {/*文章描述：*/}
        {/*<br/><br/>*/}
        {/*<TextArea style={{width:"700px"}} rows={2} />*/}
        {/*<br/><br/>*/}
        {/*<MarkdownEditorComponent />*/}
        <FloatingActionPanel />
      </Card>


    </PageContainer>
  );
};

export default Welcome;
