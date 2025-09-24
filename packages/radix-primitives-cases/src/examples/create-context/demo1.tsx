import React from 'react';
// import { createContext } from '@radix-ui/react-context';
import { createContext } from '../../react/context';

// 1. 创建上下文
const [MyContextProvider, useMyContext] = createContext<{
  count: number;
  increment: () => void;
  decrement: () => void;
}>('MyContext');

// 2. 创建提供者组件
const CounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [count, setCount] = React.useState(0);

  const contextValue = React.useMemo(() => {
    return {
      count,
      increment: () => setCount((c) => c + 1),
      decrement: () => setCount((c) => c - 1),
    };
  }, [count]);

  return <MyContextProvider {...contextValue}>{children}</MyContextProvider>;
};

// 3. 创建消费者组件
const CounterDisplay = () => {
  const { count } = useMyContext('counter');
  return <div>当前计数: {count}</div>;
};

const CounterControls = () => {
  const { increment, decrement } = useMyContext('controls');
  return (
    <div>
      <button onClick={decrement}>减少</button>
      <button onClick={increment}>增加</button>
    </div>
  );
};

// 4. 组合使用
const App = () => {
  return (
    <CounterProvider>
      <CounterDisplay />
      <CounterControls />
    </CounterProvider>
  );
};

export default App;