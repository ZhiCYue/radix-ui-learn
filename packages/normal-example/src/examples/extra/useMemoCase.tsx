import { useState, useMemo } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const memoizedChild = useMemo(() => {
    console.log('子组件的渲染阶段执行了！');
    return <ChildComponent text={text} />;
  }, [text]); // 只有 text 变化时才重新创建

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        计数: {count}
      </button>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="输入文字才会更新子组件"
      />
      {memoizedChild}
    </div>
  );
}

function ChildComponent({ text } : { text: string }) {
  console.log('ChildComponent 渲染阶段');
  return <div>子组件: {text}</div>;
}

export default App;
