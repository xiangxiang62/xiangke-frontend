import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // 编辑器样式
import markdownIt from 'markdown-it'; // 默认导入 markdown-it
import highlightjs from 'highlight.js'; // 高亮库
import 'highlight.js/styles/github.css'; // 高亮样式

// 创建 markdown-it 实例并配置代码高亮
const mdParser = markdownIt({
  highlight: (str: string, lang?: string) => {
    try {
      const code = lang ? highlightjs.highlight(str, { language: lang }).value : highlightjs.highlightAuto(str).value;
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
  const [content, setContent] = useState<string>('**Hello world!!!**'); // 初始 Markdown 内容

  // 编辑器内容变化处理函数
  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
    console.log(text + "www")
    if (onChange) {
      onChange(text); // 调用 onChange 属性
    }
  };

  // 将 Markdown 转换为 HTML 的函数
  const renderHTML = (text: string): string => {
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
