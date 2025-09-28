import React, { useState } from "react";
import { createContextScope } from "../../react/context";

// 最简单的调试 - 不使用 createContextScope，直接使用 React.createContext
interface SimpleContextValue {
  count: number;
  increment: () => void;
}

// 直接使用 React.createContext 作为对比
const SimpleContext = React.createContext<SimpleContextValue>({
  count: 0,
  increment: () => console.log('默认 increment 被调用'),
});

const SimpleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);
  
  const increment = React.useCallback(() => {
    console.log('🚀 SimpleProvider increment 被调用，当前 count:', count);
    setCount(prev => {
      console.log('🔄 SimpleProvider setCount 被调用，prev:', prev, 'new:', prev + 1);
      return prev + 1;
    });
  }, [count]);

  const value = React.useMemo(() => ({
    count,
    increment
  }), [count, increment]);

  console.log('🏗️ SimpleProvider 渲染:', { count, increment: increment.toString() });

  return (
    <SimpleContext.Provider value={value}>
      <div style={{ 
        border: '2px solid #28a745', 
        padding: '20px', 
        margin: '10px',
        backgroundColor: count > 0 ? '#d4edda' : '#fff'
      }}>
        <h3>Simple Provider (Count: {count})</h3>
        {children}
      </div>
    </SimpleContext.Provider>
  );
};

const SimpleButton: React.FC = () => {
  const context = React.useContext(SimpleContext);
  
  console.log('🔍 SimpleButton context:', context);

  const handleClick = () => {
    console.log('🖱️ SimpleButton 被点击');
    console.log('🔍 context.increment:', context.increment.toString());
    context.increment();
  };

  return (
    <button 
      onClick={handleClick}
      style={{ 
        padding: '10px 20px', 
        backgroundColor: '#28a745', 
        color: 'white', 
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Simple 点击增加 (当前: {context.count})
    </button>
  );
};

// 现在使用 createContextScope 的版本
const [createScopeContext, createScopeScope] = createContextScope("Scope");
const [ScopeProvider, useScopeContext] = createScopeContext<SimpleContextValue>(
  "Scope",
  {
    count: 0,
    increment: () => console.log('默认 scope increment 被调用'),
  }
);

const ScopeContainer: React.FC<{ __scopeScope?: any }> = ({ 
  __scopeScope
}) => {
  const [count, setCount] = useState(0);
  
  const increment = React.useCallback(() => {
    console.log('🚀 ScopeContainer increment 被调用，当前 count:', count);
    setCount(prev => {
      console.log('🔄 ScopeContainer setCount 被调用，prev:', prev, 'new:', prev + 1);
      return prev + 1;
    });
  }, [count]);

  console.log('🏗️ ScopeContainer 渲染:', { count, __scopeScope });
  console.log('🔍 ScopeContainer __scopeScope 详细信息:');
  console.log('  - __scopeScope:', __scopeScope);
  console.log('  - __scopeScope 类型:', typeof __scopeScope);
  console.log('  - __scopeScope 键:', __scopeScope ? Object.keys(__scopeScope) : 'null');
  if (__scopeScope && __scopeScope.Scope) {
    console.log('  - __scopeScope.Scope:', __scopeScope.Scope);
    console.log('  - __scopeScope.Scope 长度:', __scopeScope.Scope.length);
  }

  return (
    <ScopeProvider
      scope={__scopeScope}
      count={count}
      increment={increment}
    >
      <div style={{ 
        border: '2px solid #007bff', 
        padding: '20px', 
        margin: '10px',
        backgroundColor: count > 0 ? '#e7f3ff' : '#fff'
      }}>
        <h3>Scope Container (Count: {count})</h3>
        <ScopeButton __scopeScope={__scopeScope} />
      </div>
    </ScopeProvider>
  );
};

const ScopeButton: React.FC<{ __scopeScope?: any }> = ({ __scopeScope }) => {
  console.log('🔍 ScopeButton 开始渲染');
  console.log('🔍 ScopeButton 接收到的 __scopeScope:', __scopeScope);
  console.log('🔍 调用 useScopeContext("ScopeButton", __scopeScope)');
  
  const context = useScopeContext("ScopeButton", __scopeScope);
  
  console.log('🔍 ScopeButton 获取到的 context:', context);
  console.log('  - context.count:', context.count);
  console.log('  - context.increment:', context.increment.toString());

  const handleClick = () => {
    console.log('🖱️ ScopeButton 被点击');
    console.log('🔍 context.increment:', context.increment.toString());
    context.increment();
  };

  return (
    <button 
      onClick={handleClick}
      style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Scope 点击增加 (当前: {context.count})
    </button>
  );
};

const SimpleDebug: React.FC = () => {
  const useScopeScope = React.useMemo(() => createScopeScope(), []);
  const scopeProps = useScopeScope(undefined);

  return (
    <div style={{ padding: '20px' }}>
      <h2>对比调试 - React.createContext vs createContextScope</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>1. 直接使用 React.createContext (应该正常工作)</h3>
        <SimpleProvider>
          <SimpleButton />
        </SimpleProvider>
      </div>

      <div>
        <h3>2. 使用 createContextScope (目前有问题)</h3>
        <ScopeContainer {...scopeProps} />
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd',
        borderRadius: '5px'
      }}>
        <h4>测试说明：</h4>
        <p>如果第一个按钮能正常工作，但第二个不能，说明问题出在 createContextScope 的实现上</p>
      </div>
    </div>
  );
};

export default SimpleDebug;