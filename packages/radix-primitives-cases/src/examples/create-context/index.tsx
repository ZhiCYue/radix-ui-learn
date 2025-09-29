import React, { useState, lazy } from 'react';

interface Example {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
}

const ScopeExample = lazy(() => import('./scope-example'))
const SimpleDebug = lazy(() => import('./simple-debug'))

const examples: Example[] = [
  {
    id: 'scope-example',
    title: 'Accordion 作用域示例',
    description: '演示 createContextScope 的核心功能 - 嵌套作用域隔离',
    component: ScopeExample
  },
  {
    id: 'simple-debug',
    title: '对比调试',
    description: 'React.createContext vs createContextScope 功能对比',
    component: SimpleDebug
  },
];

const CreateContextExamples: React.FC = () => {
  const [activeExample, setActiveExample] = useState<string>('scope-example');

  const ActiveComponent = examples.find(ex => ex.id === activeExample)?.component || ScopeExample;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 侧边栏 */}
      <div style={{
        width: '300px',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#495057' }}>
          createContextScope 示例
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.5' }}>
            这些示例演示了 Radix UI 的 createContextScope 功能，
            包括作用域隔离、嵌套上下文管理等核心概念。
          </p>
        </div>

        {examples.map((example) => (
          <div
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: activeExample === example.id ? '#007bff' : '#fff',
              color: activeExample === example.id ? '#fff' : '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
              {example.title}
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              opacity: 0.8,
              lineHeight: '1.4'
            }}>
              {example.description}
            </p>
          </div>
        ))}

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px'
        }}>
          <h5 style={{ margin: '0 0 10px 0', color: '#495057' }}>
            💡 学习要点
          </h5>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '20px', 
            fontSize: '13px', 
            color: '#6c757d',
            lineHeight: '1.5'
          }}>
            <li>理解 createContextScope 的作用域隔离机制</li>
            <li>掌握嵌套 Context 的正确使用方式</li>
            <li>对比标准 React Context 与 Radix Context Scope</li>
          </ul>
        </div>
      </div>

      {/* 主内容区 */}
      <div style={{ 
        flex: 1, 
        padding: '20px', 
        overflowY: 'auto',
        backgroundColor: '#fff'
      }}>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default CreateContextExamples;