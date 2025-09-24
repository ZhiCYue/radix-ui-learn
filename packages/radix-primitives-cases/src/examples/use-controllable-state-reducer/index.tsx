import React from 'react';
import { useControllableStateReducer } from '../../react/use-controllable-state';

interface CounterProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}

function Counter({ value, defaultValue, onValueChange }: CounterProps) {
  const [state, dispatch] = useControllableStateReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'increment':
          return { ...prevState, state: prevState.state + 1 };
        case 'decrement':
          return { ...prevState, state: prevState.state - 1 };
        default:
          return prevState;
      }
    },
    {
      prop: value,
      defaultProp: defaultValue ?? 0,
      onChange: onValueChange,
      caller: 'Counter',
    },
    { state: defaultValue ?? 0 }
  );

  const increment = () => {
    dispatch({ type: 'increment' });
  };

  const decrement = () => {
    dispatch({ type: 'decrement' });
  };

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{state.state}</span> 
      <button onClick={increment}>+</button>
    </div>
  );
}

// 使用示例：
// <Counter /> - 不可控，使用内部状态
// <Counter defaultValue={5} /> - 不可控，但有初始值
// <Counter value={count} onValueChange={setCount} /> - 完全受控
export default () => {
  const [count, setCount] = React.useState(0);
  return <>
    {/* <Counter /> */}
    {/* <Counter defaultValue={5} /> */}
    <Counter value={count} onValueChange={setCount} />
  </>
};
