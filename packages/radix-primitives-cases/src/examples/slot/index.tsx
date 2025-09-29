import './styles.css';

import React, { useState, Suspense } from 'react';

// 懒加载示例组件
const Demo1 = React.lazy(() => import('./demo1'));
const Demo2 = React.lazy(() => import('./demo2'));

// 示例配置
const examples = [
  {
    id: 'demo1',
    title: 'Slot.Root 基础用法',
    description: '演示 asChild 属性如何改变组件的渲染行为',
    component: Demo1,
  },
  {
    id: 'demo2', 
    title: 'Slottable 高级用法',
    description: '演示 Slottable 如何处理多个子元素的渲染',
    component: Demo2,
  },
];

const App: React.FC = () => {
  const [activeExample, setActiveExample] = useState(examples[0].id);

  const currentExample = examples.find(example => example.id === activeExample);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* 侧边栏 */}
      <div style={{
        width: '300px',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #e9ecef',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          color: '#495057',
          borderBottom: '2px solid #007bff',
          paddingBottom: '10px'
        }}>
          Slot 示例集合
        </h2>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#6c757d', 
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          探索 Radix UI Slot 的核心功能：asChild 属性和 Slottable 组件的使用方法。
        </p>

        <div style={{ marginBottom: '20px' }}>
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: activeExample === example.id ? '#007bff' : '#ffffff',
                color: activeExample === example.id ? '#ffffff' : '#495057',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: activeExample === example.id ? '600' : '400',
                transition: 'all 0.2s ease',
                boxShadow: activeExample === example.id 
                  ? '0 2px 4px rgba(0,123,255,0.3)' 
                  : '0 1px 3px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => {
                if (activeExample !== example.id) {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (activeExample !== example.id) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {example.title}
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: activeExample === example.id ? 0.9 : 0.7,
                lineHeight: '1.3'
              }}>
                {example.description}
              </div>
            </button>
          ))}
        </div>

        {/* 说明文档 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#e8f4fd',
          borderRadius: '6px',
          fontSize: '13px',
          lineHeight: '1.4'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#0056b3' }}>
            💡 Slot 核心概念
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#495057' }}>
            <li><strong>asChild</strong>: 将组件渲染为其子元素</li>
            <li><strong>Slottable</strong>: 处理多个子元素的渲染逻辑</li>
            <li><strong>组合模式</strong>: 实现灵活的组件组合</li>
          </ul>
        </div>
      </div>

      {/* 主内容区域 */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#ffffff'
      }}>
        {currentExample && (
          <>
            {/* 示例标题和描述 */}
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{ 
                margin: '0 0 10px 0', 
                fontSize: '24px', 
                color: '#212529',
                fontWeight: '700'
              }}>
                {currentExample.title}
              </h1>
              <p style={{ 
                margin: '0 0 20px 0', 
                fontSize: '16px', 
                color: '#6c757d',
                lineHeight: '1.5'
              }}>
                {currentExample.description}
              </p>
              
              {/* 示例标签 */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#e7f3ff',
                  color: '#0066cc',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Slot API
                </span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  组合模式
                </span>
              </div>
            </div>

            {/* 示例内容 */}
            <div style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '24px',
              backgroundColor: '#fafbfc',
              minHeight: '400px'
            }}>
              <Suspense fallback={
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '200px',
                  color: '#6c757d'
                }}>
                  加载中...
                </div>
              }>
                <currentExample.component />
              </Suspense>
            </div>

            {/* 使用提示 */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: '4px solid #28a745'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#155724', fontSize: '14px' }}>
                🚀 使用提示
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#495057', lineHeight: '1.4' }}>
                {activeExample === 'demo1' && 
                  '切换 asChild 复选框，观察按钮如何从 <button> 元素变为 <span> 元素，同时保持所有属性和事件处理。'
                }
                {activeExample === 'demo2' && 
                  'Slottable 组件会智能处理子元素：纯文本直接渲染，包含元素时保持原始结构。这是实现灵活组件组合的关键。'
                }
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;