import React, { useState } from 'react';

type ExpensiveProps = {
  data: { value: string }
}

// 使用 React.memo 包装组件
const ExpensiveComponent = React.memo(({ data } : ExpensiveProps) => {
  console.log('渲染阶段执行了！计算虚拟DOM...');
  
  // 这里会执行渲染阶段，计算虚拟DOM
  return (
    <div>
      <h3>昂贵的组件</h3>
      <p>数据: {data.value}</p>
      <p>渲染时间: {new Date().toLocaleTimeString()}</p>
    </div>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({ value: 'initial' });

  React.useEffect(() => {
    console.log('组件提交阶段');
  })

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        {/* 增加计数 */}
        计数: {count} (这会触发父组件重新渲染)
      </button>
      
      <button onClick={() => setData({ value: 'same value' })}>
        设置相同的数据
      </button>
      
      <ExpensiveComponent data={data} />
    </div>
  );
}

export default App;
