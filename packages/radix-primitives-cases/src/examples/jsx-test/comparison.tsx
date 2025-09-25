// JSX 转换对比示例

import { useState } from 'react'; // 只导入需要的 hooks
// import React from 'react'; // ❌ 在新 JSX 转换下不需要

// ✅ 推荐写法：不导入 React，只导入需要的功能
function ModernComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>现代 JSX 写法</h3>
      <p>不需要导入 React，只导入需要的 hooks</p>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}

// ✅ 也可以这样写（如果不需要任何 React 功能）
function PureComponent() {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px' }}>
      <h3>纯组件</h3>
      <p>完全不需要导入任何 React 相关内容</p>
      <p>JSX 会自动转换为 jsx() 函数调用</p>
    </div>
  );
}

// 主组件
function JSXComparisonDemo() {
  return (
    <div>
      <h2>JSX 转换对比示例</h2>
      <p>以下两个组件都没有手动导入 React，但能正常工作：</p>
      
      <ModernComponent />
      <PureComponent />
      
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '10px' }}>
        <h4>💡 关键点：</h4>
        <ul>
          <li>✅ 不需要 <code>import React from 'react'</code></li>
          <li>✅ 只导入实际使用的功能（如 useState, useEffect 等）</li>
          <li>✅ JSX 会自动转换为 jsx() 函数调用</li>
          <li>✅ 更小的包体积，更好的性能</li>
        </ul>
      </div>
    </div>
  );
}

export default JSXComparisonDemo;