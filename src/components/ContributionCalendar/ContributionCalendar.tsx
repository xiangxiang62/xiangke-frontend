// src/components/ContributionCalendar.tsx
import React, { useEffect } from 'react';

interface ContributionCalendarProps {
  data: Record<string, number>; // 贡献数据，格式为 { 日期: 贡献量 }
}

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({ data }) => {
  useEffect(() => {
    const container = document.getElementById('calendar');
    const tooltip = document.getElementById('tooltip');

    if (!container || !tooltip) return;

    // 根据贡献量获取颜色
    const getColor = (contribution: number) => {
      if (contribution === 0) return '#e0e0e0'; // 无贡献时显示灰色
      if (contribution <= 5) return '#c8e6c9'; // 轻绿色
      if (contribution <= 10) return '#a5d6a7'; // 中等绿色
      return '#66bb6a'; // 深绿色
    };

    // 填充日历
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      const key = currentDate.toISOString().split('T')[0];
      const day = document.createElement('div');
      day.className = 'day';
      day.style.backgroundColor = getColor(data[key] || 0);
      day.title = `日期: ${key}\n贡献量: ${data[key] || 0}`; // 贡献量的提示信息

      // 添加提示信息功能
      day.addEventListener('mouseover', function(event) {
        tooltip.style.display = 'block';
        tooltip.textContent = `日期: ${key}\n贡献量: ${data[key] || 0}`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.left = `${event.clientX + 10}px`;
      });
      day.addEventListener('mouseout', function() {
        tooltip.style.display = 'none';
      });

      container.appendChild(day);
    }

    // 清理事件监听
    return () => {
      container.innerHTML = '';
    };
  }, [data]);

  return (
    <div style={{
        backgroundColor: '#fff',
      position: 'relative',
      overflowX: 'auto', // 允许水平滚动
      padding: '0 10px', // 适应不同的移动端宽度
      width: '100%', // 占满父容器宽度
    }}>
      <div id="calendar" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(52, 20px)', // 52周
        gridAutoRows: '20px',
        gap: '2px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        whiteSpace: 'nowrap', // 防止换行
      }}></div>
      <div className="tooltip" id="tooltip" style={{
        position: 'absolute',
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px',
        borderRadius: '3px',
        fontSize: '12px',
        display: 'none',
        whiteSpace: 'nowrap',
        zIndex: 1000 // 确保提示框在最上层
      }}></div>
    </div>
  );
};

export default ContributionCalendar;
