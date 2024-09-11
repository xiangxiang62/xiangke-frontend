import React from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown-light.css';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 使用 GitHub 风格的高亮样式

export const MdViewer = ({ content }) => {
  return (
    <div style={{ minHeight: '10rem', width: '100%' }}> {/* 确保外层 div 宽度为 100% */}
      <ReactMarkdown
        className="markdown-body"
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          ul({ children }) {
            return <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>{children}</ul>;  // 设置无序列表样式
          },
          ol({ children }) {
            return <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>{children}</ol>;  // 设置有序列表样式
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={oneLight}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// 测试数据
const markdownContent = `
# Markdown 示例

1. First item
2. Second item
3. Third item

\`\`\`js
console.log("Hello, world!");
\`\`\`
`;

const App = () => {
  return <MdViewer content={markdownContent} />;
};

export default App;
