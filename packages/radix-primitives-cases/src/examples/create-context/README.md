# createContextScope 示例

这个目录包含了 Radix UI `createContextScope` 功能的核心示例，帮助理解作用域隔离和嵌套上下文管理的概念。

## 📁 文件结构

```
create-context/
├── README.md                 # 本说明文档
├── index.tsx                 # 示例导航界面
├── scope-example.tsx         # 主要示例：Accordion 作用域隔离
└── simple-debug.tsx          # 对比示例：React.createContext vs createContextScope
```

## 🎯 核心示例

### 1. Accordion 作用域示例 (`scope-example.tsx`)

演示 `createContextScope` 的核心功能：

- **嵌套作用域隔离**：外层和内层 Accordion 各自维护独立的状态
- **正确的 scope 传递**：展示如何在嵌套组件中正确传递和使用 scope
- **实际应用场景**：模拟真实的 UI 组件库中的使用情况

**关键概念：**
```typescript
// 创建 scope
const [createAccordionContext, createAccordionScope] = createContextScope("Accordion");

// 使用 scope
const useOuterScope = React.useMemo(() => createAccordionScope(), []);
const useInnerScope = React.useMemo(() => createAccordionScope(), []);

const outerScopeProps = useOuterScope(undefined);
const innerScopeProps = useInnerScope(outerScopeProps.__scopeAccordion);
```

### 2. 对比调试示例 (`simple-debug.tsx`)

对比标准 `React.createContext` 和 `createContextScope` 的区别：

- **功能对比**：两种方式的实现差异
- **使用场景**：什么时候使用哪种方式
- **调试信息**：详细的控制台输出帮助理解内部机制

## 🔧 技术要点

### createContextScope 的优势

1. **作用域隔离**：支持同一组件的多个实例各自维护独立状态
2. **嵌套支持**：支持复杂的嵌套场景，子作用域可以继承父作用域
3. **类型安全**：完整的 TypeScript 支持
4. **组合性**：可以与其他 Radix 原语无缝组合

### 关键实现细节

1. **Scope 稳定性**：使用 `React.useMemo` 确保 scope 实例在渲染间保持稳定
2. **正确的参数传递**：`useContext(consumerName, scope)` 必须传递正确的 scope 参数
3. **Provider 值传递**：确保 Provider 的 `value` 正确计算和传递

## 🚀 运行示例

1. 启动开发服务器：
   ```bash
   cd packages/radix-primitives-cases
   npm start
   ```

2. 在浏览器中访问示例页面

3. 使用左侧导航切换不同示例

4. 打开浏览器控制台查看详细的调试信息

## 📚 学习路径

1. **先看对比示例**：理解 `createContextScope` 与标准 Context 的区别
2. **再看作用域示例**：掌握嵌套作用域的实际应用
3. **查看控制台输出**：理解内部工作机制
4. **尝试修改代码**：加深理解

## 🐛 常见问题

### Q: 为什么我的 Context 值总是默认值？
A: 检查是否正确传递了 scope 参数给 `useContext` 函数。

### Q: 嵌套的 Context 如何正确设置？
A: 子 scope 应该继承父 scope：`useInnerScope(outerScopeProps.__scopeAccordion)`

### Q: 为什么每次渲染都重新创建 Context？
A: 使用 `React.useMemo` 确保 scope 实例稳定：`React.useMemo(() => createScope(), [])`

## 🔗 相关资源

- [Radix UI 官方文档](https://www.radix-ui.com/)
- [React Context 官方文档](https://react.dev/reference/react/createContext)
- [TypeScript 官方文档](https://www.typescriptlang.org/)