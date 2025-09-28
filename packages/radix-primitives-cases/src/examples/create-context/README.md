# createContextScope 示例

这个目录包含了 `createContextScope` 功能的演示示例，展示了 Radix UI 中如何创建独立的上下文作用域来避免组件嵌套时的状态冲突。

## 文件说明

### `scope-example.tsx`
完整的 Accordion 组件示例，展示了：
- 如何使用 `createContextScope` 创建作用域
- 如何在嵌套组件中使用独立的上下文
- 完整的 TypeScript 类型定义
- 实际的 UI 交互功能

### `simple-scope-example.tsx`
简化的计数器示例，更容易理解核心概念：
- 基本的 `createContextScope` 用法
- 多个独立作用域的演示
- 嵌套组件的作用域隔离

### `../../react/context/create-context.tsx`
`createContextScope` 的核心实现，包含：
- 作用域创建逻辑
- Context Provider 和 Hook 的生成
- 完整的 TypeScript 类型定义

## 核心概念

### 什么是 Context Scope？

Context Scope 是 Radix UI 中的一个核心概念，用于解决 React Context 在组件嵌套时可能出现的冲突问题。

### 问题场景

假设你有一个 `Dialog` 组件，它内部使用了 React Context 来管理状态。如果你在一个 Dialog 内部又嵌套了另一个 Dialog，内层的 Dialog 可能会意外地访问到外层 Dialog 的 Context，导致状态混乱。

### 解决方案

`createContextScope` 通过为每个组件实例创建独立的 Context 来解决这个问题：

```typescript
// 创建作用域
const [createMyContext, createMyScope] = createContextScope("MyComponent");

// 使用时创建独立的作用域
<MyComponent scope={createMyScope()}>
  <MyComponent scope={createMyScope()}> {/* 独立的作用域 */}
    {/* 内容 */}
  </MyComponent>
</MyComponent>
```

## 使用步骤

1. **创建作用域**：
   ```typescript
   const [createMyContext, createMyScope] = createContextScope<MyContextType>("MyComponent");
   ```

2. **创建 Context**：
   ```typescript
   const [MyProvider, useMyContext] = createMyContext<MyContextType>("MyComponent", defaultValue);
   ```

3. **在组件中使用**：
   ```typescript
   // 根组件接收 scope 并传递给 Provider
   const MyComponent = ({ scope, ...props }) => {
     return (
       <MyProvider scope={scope} {...contextValue}>
         {children}
       </MyProvider>
     );
   };

   // 子组件传递 undefined 作为 scope，会使用当前作用域的 context
   const MyChildComponent = () => {
     const context = useMyContext("MyChildComponent", undefined);
     return <div>{/* 使用 context */}</div>;
   };
   ```

4. **创建独立实例**：
   ```typescript
   <MyComponent scope={createMyScope()}>
     <MyChildComponent /> {/* 不需要传递 scope */}
   </MyComponent>
   ```

## 运行示例

```bash
# 在项目根目录
npm run dev

# 然后访问相应的示例页面
```

## 类型安全

所有示例都包含完整的 TypeScript 类型定义，确保：
- Context 值的类型安全
- Props 的类型检查
- 作用域的正确使用

## 最佳实践

1. **只在根组件传递 scope**：只有根组件（Provider 的直接父组件）需要传递 `scope` 属性，子组件会自动继承
2. **创建独立作用域**：为每个组件实例调用 `createMyScope()` 创建独立作用域
3. **避免重复传递**：不要在每个子组件都传递 scope，这是不必要的且违反了设计原则
4. **类型定义**：为 Context 值定义明确的 TypeScript 接口
5. **错误处理**：在 Hook 中包含适当的错误处理逻辑

## 常见误区

❌ **错误做法**：每个子组件都创建新的 scope
```typescript
<MyComponent scope={createMyScope()}>
  <MyChild scope={createMyScope()} />  {/* 错误：创建了新的作用域！ */}
  <MyOtherChild scope={createMyScope()} />  {/* 错误：创建了新的作用域！ */}
</MyComponent>
```

✅ **正确做法**：只在根组件传递 scope，子组件使用 undefined
```typescript
<MyComponent scope={createMyScope()}>
  <MyChild />  {/* 内部使用 useMyContext("MyChild", undefined) */}
  <MyOtherChild />  {/* 内部使用 useMyContext("MyOtherChild", undefined) */}
</MyComponent>
```

**关键点：**
- 根组件：传递 `scope={createMyScope()}` 创建新的作用域
- 子组件：在 useContext 中传递 `undefined` 作为 scope 参数，会自动使用当前作用域的 context