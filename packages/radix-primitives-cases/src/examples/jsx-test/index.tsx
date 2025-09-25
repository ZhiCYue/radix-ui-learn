// 测试：不导入 React 的情况
// import React from 'react'; // 注释掉这行

function TestComponentWithoutReactImport() {
  return (
    <div>
      <h1>测试组件 - 没有导入 React</h1>
      <p>如果这个组件能正常渲染，说明不需要手动导入 React</p>
    </div>
  );
}

export default TestComponentWithoutReactImport;