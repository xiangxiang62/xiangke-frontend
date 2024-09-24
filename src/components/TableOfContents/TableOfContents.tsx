import React, { useState, useEffect } from 'react';
import { Drawer, List, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons'; // 从 antd 图标库导入图标

const TableOfContents = ({ content, onAnchorClick }) => {
  const [visible, setVisible] = useState(false);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // 解析 MD 内容，提取标题
    const parseHeadings = (markdownContent) => {
      const headingRegex = /^(#{1,6})\s+(.*)$/gm;
      let match;
      const headingsList = [];
      while ((match = headingRegex.exec(markdownContent)) !== null) {
        const level = match[1].length;
        const text = match[2] || ''; // 确保 text 是字符串
        headingsList.push({ level, text, id: text.toLowerCase().replace(/\s+/g, '-') });
      }
      setHeadings(headingsList);
    };
    parseHeadings(content);
  }, [content]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        onClick={showDrawer}
        style={{
          position: 'fixed',
          right: 0,
          top: '75%',
          zIndex: 1000,
          fontSize: '24px',
          background: '#D3D3D3', // 透明背景
        }}
      >
        <MenuOutlined style={{ fontSize: '20px'}} />
      </Button>
      <Drawer
        title="目录"
        placement="right"
        closable
        onClose={onClose}
        visible={visible}
        width={300}
      >
        <List
          dataSource={headings}
          renderItem={(item) => (
            <List.Item
              style={{ paddingLeft: item.level * 10 }}
              onClick={() => onAnchorClick(item.id)}
              key={item.id}
            >
              {item.text}
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};

export default TableOfContents;
