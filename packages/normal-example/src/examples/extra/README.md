# useContextSelectorCase

“渲染阶段评估”、“提交阶段更新”

## 如何实现执行了“渲染阶段”，但是没有到“提交阶段”?

#### 1. 使用 React.memo 或 PureComponent
这是最直接的方式，通过浅比较 props 来避免不必要的重新提交：

[React.memo](./memoCase.tsx)

在这个例子中，点击"计数"按钮时：

✅ 父组件 App 执行完整的渲染阶段
✅ ExpensiveComponent 也会执行渲染阶段
❌ 但由于 props 浅比较相同，不会进入提交阶段
❌ 真实DOM不会更新

#### 2. 使用 useMemo 优化子组件
通过 useMemo 记忆化子组件，避免子组件重新渲染：

[useMemoCase](./useMemoCase)

#### 3. 在类组件中使用 shouldComponentUpdate

#### 4. 使用 useReducer 的 bailout 机制
关键特性说明
这个示例展示了以下 bailout 场景：

1. 相同值 bailout
UPDATE_NAME 与当前名字相同时返回原状态

UPDATE_AGE 与当前年龄相同时返回原状态

2. 深度对象 bailout
DEEP_UPDATE 深度比较对象内容

3. 强制渲染对比
父组件状态更新触发渲染阶段，但 useReducer 可能 bailout

4. 观察点
渲染阶段: 组件函数每次都会执行

Reducer: 每次 dispatch 都会执行

提交阶段: 只有状态真正改变时才执行

控制台输出示例
当点击"更新为相同名字"时：

text
📤 动作：更新为相同名字
🔄 reducer 执行: UPDATE_NAME 张三
🎯 名字相同，触发 bailout
🔵 渲染阶段：第 X 次渲染 {name: "张三", age: 25}
// 注意：没有 🟢 提交阶段 的日志！
当点击"更新为不同名字"时：

text
📤 动作：更新为不同名字
🔄 reducer 执行: UPDATE_NAME 张三!
🔵 渲染阶段：第 X 次渲染 {name: "张三!", age: 25}
🟡 提交阶段：useLayoutEffect 执行 - DOM 已更新
🟢 提交阶段：useEffect 执行 - DOM 已更新
这个示例清晰地展示了 React 如何在渲染阶段执行计算，但通过 bailout 机制避免不必要的提交阶段，从而优化性能。

