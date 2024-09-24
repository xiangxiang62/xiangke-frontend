import React from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown-light.css';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const MdViewer = ({ content }) => {
  return (
    <div style={{ minHeight: '10rem', width: '100%' }}>
      <ReactMarkdown
        className="markdown-body"
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1({ node, ...props }) {
            const text = React.Children.toArray(props.children).join('');
            const id = text ? text.toLowerCase().replace(/\s+/g, '-') : '';
            return (
              <h1 id={id} style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                {props.children}
              </h1>
            );
          },
          h2({ node, ...props }) {
            const text = React.Children.toArray(props.children).join('');
            const id = text ? text.toLowerCase().replace(/\s+/g, '-') : '';
            return (
              <h2 id={id} style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                {props.children}
              </h2>
            );
          },
          h3({ node, ...props }) {
            const text = React.Children.toArray(props.children).join('');
            const id = text ? text.toLowerCase().replace(/\s+/g, '-') : '';
            return (
              <h3 id={id} style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                {props.children}
              </h3>
            );
          },
          ul({ children }) {
            return <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>{children}</ul>;
          },
          ol({ children }) {
            return <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>{children}</ol>;
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter language={match[1]} style={oneLight} {...props}>
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
