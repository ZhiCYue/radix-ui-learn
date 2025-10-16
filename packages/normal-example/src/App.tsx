import { useState, Dispatch, SetStateAction } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

type State = { count1: number; count2: number };
type ContextType = [State, Dispatch<SetStateAction<State>>];

const context = createContext<ContextType | null>(null);

const Counter1 = () => {
  const count1 = useContextSelector(context, (v) => v ? v[0].count1 : 0);
  const setState = useContextSelector(context, (v) => (v ? v[1] : undefined));
  const increment = () => {
    if (setState) {
      setState((s) => ({
        ...s,
        count1: s.count1 + 1,
      }));
    }
  };
  return (
    <div>
      <span>Count1: {count1}</span>
      <button type="button" onClick={increment}>
        +1
      </button>
      {Math.random()}
    </div>
  );
};

const Counter2 = () => {
  const count2 = useContextSelector(context, (v) => v ? v[0].count2 : 0);
  const setState = useContextSelector(context, (v) => (v ? v[1] : undefined));
  const increment = () => {
    if (setState) {
      setState((s) => ({
        ...s,
        count2: s.count2 + 1,
      }));
    }
  };
  return (
    <div>
      <span>Count2: {count2}</span>
      <button type="button" onClick={increment}>
        +1
      </button>
      {Math.random()}
    </div>
  );
};

type StateProviderProps = {
  children: React.ReactNode;
};

const StateProvider = ({ children }: StateProviderProps) => {
  const value = useState<State>({ count1: 0, count2: 0 });
  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  );
};

const App = () => (
  <StateProvider>
    <Counter1 />
    <Counter2 />
  </StateProvider>
);

export default App;
