import React, { useEffect, useReducer } from 'react';

type State = {
  count: number;
};

type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number };

function countReducer(state: State, action: Action): State {
  console.log(`🔄 reducer 执行: ${action.type}`, action.payload);

  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + action.payload };
    case 'DECREMENT':
      if (action.payload === state.count) {
        console.log('🎯 相同，触发 bailout');
        // return state;
        return { ...state };  // 只要这里返回的对象发生了变化，组件的提交阶段就会触发
      }
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
}

function useCounter(initValue: number): [number, React.Dispatch<Action>] {
  const [state, dispatch] = useReducer(countReducer, { count: initValue });

  useEffect(() => {
    console.log('hello.');
  });

  return [state.count, dispatch];
}

const HookCase: React.FC = () => {
  const [count, dispatch] = useCounter(0);

  return (
    <>
      <p>count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT', payload: 1 })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT', payload: 1 })}>-1</button>
    </>
  );
};

export default HookCase;