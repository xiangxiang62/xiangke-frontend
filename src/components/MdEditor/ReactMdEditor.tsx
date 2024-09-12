import React, { useEffect, useRef, useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // 编辑器样式
import markdownIt from 'markdown-it'; // 默认导入 markdown-it
import highlightjs from 'highlight.js'; // 高亮库
import 'highlight.js/styles/github.css'; // 高亮样式

// 上传图片到对象存储的函数
const uploadImageToStorage = async (file: File): Promise<string> => {
  // 模拟上传逻辑，替换为实际对象存储接口调用
  // 这里使用 File API 来模拟上传后返回的 URL
  const formData = new FormData();
  formData.append('file', file);

  // 模拟上传并返回一个链接，可以替换为实际的存储服务接口
  const response = await fetch('https://your-object-storage-api.com/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result.url; // 假设返回的 JSON 数据中有图片的 URL 字段
};

// 创建 markdown-it 实例并配置代码高亮
const mdParser = markdownIt({
  highlight: (str: string, lang?: string) => {
    try {
      const code = lang
        ? highlightjs.highlight(str, { language: lang }).value
        : highlightjs.highlightAuto(str).value;
      return `<pre><code class="hljs ${lang}">${code}</code></pre>`;
    } catch (error) {
      return `<pre><code class="hljs">${mdParser.utils.escapeHtml(str)}</code></pre>`;
    }
  }
});

interface MarkdownEditorComponentProps {
  onChange?: (text: string) => void; // 允许 onChange 属性
}

const MarkdownEditorComponent: React.FC<MarkdownEditorComponentProps> = ({ onChange }) => {
  const [content, setContent] = useState<string>('## 文章标题'); // 初始 Markdown 内容
  const editorRef = useRef<any>(null); // 创建 ref 来引用 Markdown 编辑器实例

  // 编辑器内容变化处理函数
  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
    if (onChange) {
      onChange(text); // 调用 onChange 属性
    }
  };

  // 处理粘贴事件
  const handlePaste = async (event: ClipboardEvent) => {
    console.log('Paste event detected'); // 检查事件是否触发

    const clipboardData = event.clipboardData;
    const items = clipboardData?.items;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          console.log('Image found in paste event'); // 确认有图片粘贴
          const file = item.getAsFile();
          if (file) {
            // 上传图片并获取存储的 URL
            const imageUrl = await uploadImageToStorage(file);
            if (editorRef.current) {
              // 插入 Markdown 图片语法
              editorRef.current.insertText(`![image](${imageUrl})`);
            }
          }
        }
      }
    }
  };

  // 在组件挂载时绑定粘贴事件监听器，并在卸载时移除
  useEffect(() => {
    const editorElement = editorRef.current?.mdEditor?.current?.root; // 获取编辑器的根元素

    if (editorElement) {
      console.log('Binding paste event listener'); // 确认事件监听器绑定
      editorElement.addEventListener('paste', handlePaste);
    }

    return () => {
      if (editorElement) {
        console.log('Removing paste event listener'); // 确认事件监听器解绑
        editorElement.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  // 将 Markdown 转换为 HTML 的函数，并处理有序和无序列表样式
  const renderHTML = (text: string): string => {
    const renderedHtml = mdParser.render(text);

    // 添加自定义样式的逻辑
    const styledHtml = renderedHtml
      .replace(/<ul>/g, '<ul style="list-style-type: disc; padding-left: 20px;">')  // 自定义无序列表样式
      .replace(/<ol>/g, '<ol style="list-style-type: decimal; padding-left: 20px;">'); // 自定义有序列表样式

    return styledHtml;
  };

  return (
    <div>
      <MarkdownEditor
        ref={editorRef} // 绑定 ref
        style={{ height: '700px', minHeight: '100%', overflowY: 'auto' }}
        value={content}
        onChange={handleEditorChange}
        renderHTML={renderHTML} // 提供 renderHTML 函数
      />
    </div>
  );
};

export default MarkdownEditorComponent;
