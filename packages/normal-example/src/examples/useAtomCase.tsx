// import { Provider, atom, useAtom } from 'use-atom';
import { Provider, atom, useAtom } from './use-atom';

// 1. 基础 atom
const countAtom = atom(0);
const textAtom = atom('hello');

// 2. 派生 atom：依赖 countAtom 和 textAtom
const summaryAtom = atom((get) => {
  const count = get(countAtom);
  const text = get(textAtom);
  return `Count is ${count}, Text is "${text}"`;
});

// 3. 仅依赖 countAtom 的派生 atom
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// 4. 仅依赖 textAtom 的派生 atom
const textLengthAtom = atom((get) => get(textAtom).length);

const Counter = ({ v: number = 0 }: { v?: number } = {}) => {
  const [count, setCount] = useAtom(countAtom);
  const double = useAtom(doubleCountAtom)[0];
  return (
    <div style={{ border: '1px solid #eee', marginBottom: 8, padding: 8 }}>
      <div>Counter: {Math.random()}</div>
      <div>
        <span>Count: {count}, Double: {double}</span>
        <button type="button" onClick={() => setCount(count + 1)}>+1</button>
        <button type="button" onClick={() => setCount((c) => c - 1)}>-1</button>
      </div>
    </div>
  );
};

const TextBox = () => {
  const [text, setText] = useAtom(textAtom);
  const length = useAtom(textLengthAtom)[0];
  return (
    <div style={{ border: '1px solid #eee', marginBottom: 8, padding: 8 }}>
      <div>TextBox: {Math.random()}</div>
      <div>
        <span>Text: {text} (Length: {length})</span>
        <input value={text} onChange={(event) => setText(event.target.value)} />
      </div>
    </div>
  );
};

// 展示依赖了 countAtom 和 textAtom 的 summaryAtom
const Summary = () => {
  const summary = useAtom(summaryAtom)[0];
  return (
    <div style={{ border: '1px solid green', margin: '16px 0', padding: 8 }}>
      <strong>Summary:</strong> <span>{summary}</span>
    </div>
  );
};

const App = () => (
  <Provider>
    <h1>Counter</h1>
    <Counter v={1}/>
    {/* <Counter v={2}/> */}
    <h1>TextBox</h1>
    <TextBox />
    {/* <TextBox /> */}
    <Summary />
  </Provider>
);

export default App;
