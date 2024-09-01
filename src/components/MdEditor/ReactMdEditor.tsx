import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // 编辑器样式
import ReactMarkdown from 'react-markdown'; // Markdown 渲染器
import remarkGfm from 'remark-gfm'; // 支持 GitHub 风格的 Markdown 扩展
import markdownIt from 'markdown-it';
import highlightjs from 'highlight.js'; // 高亮库
import 'highlight.js/styles/github.css'; // 高亮样式
import { Card } from 'antd';

// 创建 markdown-it 实例并配置代码高亮
const mdParser = new markdownIt({
  highlight: (str, lang) => {
    try {
      return `<pre><code class="hljs ${lang}">${highlightjs.highlightAuto(str, [lang]).value}</code></pre>`;
    } catch (error) {
      return `<pre><code class="hljs">${mdParser.utils.escapeHtml(str)}</code></pre>`;
    }
  }
});

const MarkdownEditorComponent: React.FC = () => {
  const [content, setContent] = useState('**Hello world!!!**'); // 初始 Markdown 内容

  // 编辑器内容变化处理函数
  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
  };

  // 将 Markdown 转换为 HTML 的函数
  const renderHTML = (text: string) => {
    return mdParser.render(text);
  };

  return (
    <div>
      <div>
        <MarkdownEditor
          style={{ height: '600px', maxHeight: '600px', overflowY: 'auto' }}
          value={content}
          onChange={handleEditorChange}
          renderHTML={renderHTML} // 提供 renderHTML 函数
        />
      </div>
    </div>
  );
};

export default MarkdownEditorComponent;
