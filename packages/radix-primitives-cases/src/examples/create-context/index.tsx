import React, { useState } from 'react';
import ScopeExample from './scope-example';
import SimpleScopeExample from './simple-scope-example';
// import Demo1 from './demo1';
// import Demo2 from './demo2';
// import Demo2Comparison from './demo2-comparison';

// 示例列表配置
const examples = [
  {
    id: 'scope-example',
    title: 'Accordion 作用域示例',
    description: '完整的 Accordion 组件，演示 createContextScope 的实际应用',
    component: ScopeExample
  },
  {
    id: 'simple-scope-example',
    title: '简单计数器示例',
    description: '简化的计数器示例，更容易理解作用域概念',
    component: SimpleScopeExample
  },
  // {
  //   id: 'demo1',
  //   title: 'Demo1 - 基础示例',
  //   description: '基础的 createContext 使用示例',
  //   component: Demo1
  // },
  // {
  //   id: 'demo2',
  //   title: 'Demo2 - 作用域演示',
  //   description: '展示作用域功能的演示',
  //   component: Demo2
  // },
  // {
  //   id: 'demo2-comparison',
  //   title: 'Demo2 对比示例',
  //   description: '对比有无作用域的差异',
  //   component: Demo2Comparison
  // }
];

const CreateContextExamples: React.FC = () => {
  const [activeExample, setActiveExample] = useState('scope-example');
  
  const currentExample = examples.find(ex => ex.id === activeExample);
  const CurrentComponent = currentExample?.component;

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 侧边栏 */}
      <div style={{
        width: '300px',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: '#495057',
          fontSize: '18px'
        }}>
          createContextScope 示例
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#6c757d', 
            lineHeight: '1.5',
            margin: '0 0 15px 0'
          }}>
            选择不同的示例来了解 createContextScope 的各种用法和场景。
          </p>
        </div>

        {examples.map((example) => (
          <div
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: activeExample === example.id ? '#007bff' : '#fff',
              color: activeExample === example.id ? '#fff' : '#495057',
              border: '1px solid',
              borderColor: activeExample === example.id ? '#007bff' : '#dee2e6',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (activeExample !== example.id) {
                e.currentTarget.style.backgroundColor = '#e9ecef';
              }
            }}
            onMouseLeave={(e) => {
              if (activeExample !== example.id) {
                e.currentTarget.style.backgroundColor = '#fff';
              }
            }}
          >
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '14px',
              marginBottom: '4px'
            }}>
              {example.title}
            </div>
            <div style={{ 
              fontSize: '12px', 
              opacity: 0.8,
              lineHeight: '1.3'
            }}>
              {example.description}
            </div>
          </div>
        ))}

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          borderRadius: '6px',
          border: '1px solid #b3d9ff'
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: '#0056b3',
            fontSize: '14px'
          }}>
            💡 学习提示
          </h4>
          <p style={{ 
            fontSize: '12px', 
            color: '#0056b3', 
            margin: 0,
            lineHeight: '1.4'
          }}>
            建议按顺序查看示例：先看简单示例理解概念，再看复杂示例了解实际应用。
          </p>
        </div>
      </div>

      {/* 主内容区 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#fff'
      }}>
        {CurrentComponent && <CurrentComponent />}
      </div>
    </div>
  );
};

export default CreateContextExamples;
