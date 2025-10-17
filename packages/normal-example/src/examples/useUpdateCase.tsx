import { memo, useState, useContext, useEffect, createContext as originCreateContext } from 'react';
import { createContext, useContextSelector, useContextUpdate } from 'use-context-selector';

const CounterContext = createContext({ count: 0 });
// const CounterContext = originCreateContext({ count: 0 });

// 传统方式 - 会重新渲染
function TraditionalListener() {
  // @ts-ignore
  const { count } = useContext(CounterContext);
  console.log('🔴 TraditionalListener 渲染了, count:', count);
  return <div>传统组件 - 渲染次数: {Math.random()}</div>;
}

// useContextUpdate 方式 - 不会重新渲染
const UpdateListener = memo(function UpdateListener() {
  const update = useContextUpdate(CounterContext);
  
  useEffect(() => {
    console.log('🟢 UpdateListener: Context 更新了，但组件没有重新渲染');
  }, [update]);
  
  console.log('🟢 UpdateListener 渲染了 - 这应该只出现一次');
  return <div>智能组件 - 渲染次数: {Math.random()}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <CounterContext.Provider value={{ count }}>
      <div>
        <button onClick={() => setCount(c => c + 1)}>
          增加 Count: {count}
        </button>
        <TraditionalListener />
        <UpdateListener />
      </div>
    </CounterContext.Provider>
  );
}

export default App;
