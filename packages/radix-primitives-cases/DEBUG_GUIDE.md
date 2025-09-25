# React JSX Runtime 调试优化指南

## 重要说明：是否需要导入 React？

### 🎯 简短回答：**不需要！**

在当前的项目配置下（React 17+ 新 JSX 转换），你**不需要**在组件头部导入 React。

### 📋 详细说明

#### 当前配置分析：

1. **TypeScript 配置** (`tsconfig.json`):
   ```json
   {
     "jsx": "react-jsx"  // 使用新的 JSX 转换
   }
   ```

2. **Babel 配置** (`webpack.config.js`):
   ```javascript
   '@babel/preset-react', {
     runtime: 'automatic'  // 自动导入 JSX 运行时
   }
   ```

#### ✅ 正确的写法（推荐）：
```tsx
// ❌ 不需要这行
// import React from 'react';

import { useState } from 'react'; // 只导入需要的 hooks

function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

#### ❌ 旧的写法（不推荐）：
```tsx
import React from 'react'; // 在新配置下不需要

function MyComponent() {
  return <div>Hello World</div>;
}
```

### 🔄 转换过程

**你写的代码：**
```tsx
function App() {
  return <div>Hello World</div>;
}
```

**自动转换后：**
```javascript
import { jsx as _jsx } from 'react/jsx-runtime';

function App() {
  return _jsx('div', { children: 'Hello World' });
}
```

### 🎯 什么时候需要导入 React？

只有在以下情况下才需要导入：

1. **使用 React 的 API**：
   ```tsx
   import React from 'react';
   
   // 使用 React.memo
   const MemoComponent = React.memo(MyComponent);
   
   // 使用 React.forwardRef
   const ForwardedComponent = React.forwardRef((props, ref) => {
     return <div ref={ref}>...</div>;
   });
   ```

2. **使用 React 的类型**：
   ```tsx
   import React from 'react';
   
   const ref: React.RefObject<HTMLDivElement> = React.createRef();
   ```

### 🚀 迁移建议

如果你的项目中还有很多 `import React from 'react'`，可以：

1. **保持现状**：不会有问题，只是多余的导入
2. **逐步移除**：在修改组件时移除不必要的 React 导入
3. **批量移除**：使用工具自动移除（需要谨慎）

---

## 调试问题描述

在调试 React 17+ 应用时，经常会遇到 `react/jsx-runtime` 中的 `_jsxs` 代码显示为一行，不方便调试的问题。

## 解决方案

### 1. Webpack 配置优化

我们已经配置了以下优化：

```javascript
// webpack.config.js
module.exports = {
  devtool: 'eval-source-map', // 最佳的开发调试体验
  output: {
    pathinfo: true, // 保持路径信息
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic',
                    development: true, // 开发模式优化
                  }
                ]
              ],
              sourceMaps: true,
              inputSourceMap: true,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
                inlineSourceMap: false,
                inlineSources: false,
              },
            },
          },
        ],
      },
    ],
  },
};
```

### 2. TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSourceMap": false,
    "inlineSources": false
  }
}
```

### 3. 调试器配置

#### Chrome DevTools
1. 打开 DevTools
2. 进入 Sources 面板
3. 在设置中启用：
   - ✅ "Enable JavaScript source maps"
   - ✅ "Enable CSS source maps"
   - ✅ "Automatically reveal files in sidebar"

#### VS Code 调试
创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3001",
      "webRoot": "${workspaceFolder}/packages/radix-primitives-cases/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*",
        "webpack:///./*": "${webRoot}/*",
        "webpack:///./~/*": "${webRoot}/node_modules/*"
      }
    }
  ]
}
```

## 调试技巧

### 1. 使用 React DevTools
安装 React DevTools 浏览器扩展，可以更好地调试 React 组件。

### 2. 断点设置
- 在你的源代码中设置断点，而不是在编译后的代码中
- 使用 `debugger;` 语句进行快速断点

### 3. 源码映射验证
检查 Network 面板，确保 `.map` 文件正确加载。

### 4. 过滤不相关代码
在 DevTools 中可以设置忽略列表：
- 右键点击调用栈中的文件
- 选择 "Add script to ignore list"
- 或在设置中添加模式：`/node_modules/`

## 常见问题

### Q: 为什么还是看到 `_jsxs` 一行代码？
A: 这是正常的，`_jsxs` 是 React 17+ 的 JSX 转换函数。重要的是你的源代码应该正确映射。

### Q: 如何完全避免看到 jsx-runtime？
A: 可以在调试器中过滤掉 `react/jsx-runtime` 模块，或者使用经典的 JSX 转换（不推荐）。

### Q: 源码映射不工作怎么办？
A: 
1. 检查 webpack devtool 配置
2. 确保 TypeScript 生成源码映射
3. 清除浏览器缓存重试
4. 检查网络面板确保 .map 文件加载

## 推荐的调试流程

1. **设置断点**：在你的 `.tsx` 源文件中设置断点
2. **使用 React DevTools**：查看组件状态和 props
3. **检查调用栈**：忽略 jsx-runtime 相关的栈帧
4. **专注业务逻辑**：调试你的组件逻辑而不是 JSX 转换

## 性能优化

当前配置还包含了以下性能优化：

- **代码分割**：自动分离 vendor 和 React 代码
- **热更新**：支持快速开发迭代
- **错误覆盖**：只显示错误，隐藏警告

通过这些配置，你应该能获得更好的调试体验！