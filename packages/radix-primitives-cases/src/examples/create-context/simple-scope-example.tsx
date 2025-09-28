import React, { useState } from "react";
import { createContextScope } from "../../react/context/create-context";

// 简单的计数器上下文示例
interface CounterContextValue {
  count: number;
  increment: () => void;
  decrement: () => void;
}

// 创建作用域
const [createCounterContext, createCounterScope] = 
  createContextScope("Counter");

// 创建 Context
const [CounterProvider, useCounterContext] = createCounterContext<CounterContextValue>(
  "Counter",
  {
    count: 0,
    increment: () => {},
    decrement: () => {},
  }
);

// 计数器组件
const Counter: React.FC<{ 
  initialCount?: number; 
  children: React.ReactNode; 
  scope?: any;
  title?: string;
}> = ({ initialCount = 0, children, scope, title = "计数器" }) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);

  return (
    <CounterProvider
      scope={scope}
      count={count}
      increment={increment}
      decrement={decrement}
    >
      <div style={{ 
        border: '2px solid #007bff', 
        margin: '10px', 
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{title}</h3>
        {children}
      </div>
    </CounterProvider>
  );
};

// 显示计数的组件 - 传递 undefined 作为 scope，会使用当前作用域的 context
const CounterDisplay: React.FC = () => {
  const { count } = useCounterContext("CounterDisplay", undefined);
  
  return (
    <div style={{ 
      fontSize: '24px', 
      fontWeight: 'bold', 
      textAlign: 'center',
      margin: '10px 0',
      color: '#28a745'
    }}>
      当前计数: {count}
    </div>
  );
};

// 控制按钮组件 - 传递 undefined 作为 scope，会使用当前作用域的 context
const CounterControls: React.FC = () => {
  const { increment, decrement } = useCounterContext("CounterControls", undefined);
  
  return (
    <div style={{ textAlign: 'center', margin: '10px 0' }}>
      <button 
        onClick={decrement}
        style={{ 
          margin: '0 5px', 
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        -1
      </button>
      <button 
        onClick={increment}
        style={{ 
          margin: '0 5px', 
          padding: '8px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        +1
      </button>
    </div>
  );
};

// 主应用组件
const SimpleScopeExample: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>createContextScope 简单示例</h1>
      <p>这个示例展示了如何使用 createContextScope 创建独立的上下文作用域。</p>
      
      {/* 第一个计数器 */}
      <Counter 
        initialCount={0} 
        scope={createCounterScope()} 
        title="计数器 A (独立作用域)"
      >
        <CounterDisplay />
        <CounterControls />
      </Counter>

      {/* 第二个计数器 */}
      <Counter 
        initialCount={10} 
        scope={createCounterScope()} 
        title="计数器 B (独立作用域)"
      >
        <CounterDisplay />
        <CounterControls />
        
        {/* 嵌套的第三个计数器 */}
        <Counter 
          initialCount={100} 
          scope={createCounterScope()} 
          title="嵌套计数器 C (独立作用域)"
        >
          <CounterDisplay />
          <CounterControls />
        </Counter>
      </Counter>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>关键特性说明：</h3>
        <ul>
          <li><strong>独立作用域</strong>：每个计数器都有自己的状态，互不影响</li>
          <li><strong>嵌套支持</strong>：可以在一个计数器内嵌套另一个计数器</li>
          <li><strong>类型安全</strong>：完整的 TypeScript 类型支持</li>
          <li><strong>避免冲突</strong>：通过 createCounterScope() 创建独立的上下文实例</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleScopeExample;