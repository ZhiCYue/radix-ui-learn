# createAlertDialogScope 详解

## 什么是 Scope？

在 Radix UI 中，Scope（作用域）是一种机制，用于创建独立的 React Context 实例，确保组件之间不会相互干扰。

## 为什么需要 Scope？

### 1. 上下文隔离

```tsx
// 不使用 Scope - 所有 AlertDialog 共享同一个 Context
<AlertDialog.Root>
  <AlertDialog.Trigger>按钮 1</AlertDialog.Trigger>
  <AlertDialog.Content>内容 1</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root>
  <AlertDialog.Trigger>按钮 2</AlertDialog.Trigger>
  <AlertDialog.Content>内容 2</AlertDialog.Content>
</AlertDialog.Root>

// 使用 Scope - 每个 AlertDialog 都有独立的 Context
const scope1 = useAlertDialogScope(undefined);
const scope2 = useAlertDialogScope(undefined);

<AlertDialog.Root {...scope1}>
  <AlertDialog.Trigger {...scope1}>按钮 1</AlertDialog.Trigger>
  <AlertDialog.Content {...scope1}>内容 1</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root {...scope2}>
  <AlertDialog.Trigger {...scope2}>按钮 2</AlertDialog.Trigger>
  <AlertDialog.Content {...scope2}>内容 2</AlertDialog.Content>
</AlertDialog.Root>
```

### 2. 避免状态冲突

当页面中有多个 AlertDialog 时，不使用 Scope 可能导致：
- 一个对话框的状态影响另一个对话框
- 事件处理器被错误地绑定到错误的对话框
- 焦点管理出现问题

### 3. 支持复杂嵌套

```tsx
// 支持在表格中为每一行创建独立的删除确认对话框
function DataTable({ items }) {
  return (
    <table>
      {items.map(item => (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>
            <DeleteConfirmDialog 
              itemId={item.id} 
              scope={useAlertDialogScope(undefined)} 
            />
          </td>
        </tr>
      ))}
    </table>
  );
}
```

## 工作原理

### createContextScope 的实现

```tsx
function createContextScope(scopeName: string) {
  // 创建一个函数，返回独立的 Context 实例
  const createScope = () => {
    return function useScope(scope: Scope) {
      // 为当前作用域创建独立的 Context
      return { [`__scope${scopeName}`]: scope };
    };
  };
  
  return createScope;
}
```

### AlertDialog 中的使用

```tsx
const [createAlertDialogContext, createAlertDialogScope] = createContextScope('AlertDialog');

const AlertDialog = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  // 使用作用域特定的 Context
  return <DialogPrimitive.Root {...alertDialogProps} />;
};
```

## 实际应用场景

### 1. 数据表格中的操作确认

```tsx
function UserTable({ users }) {
  return (
    <table>
      {users.map(user => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>
            <DeleteUserDialog 
              user={user} 
              scope={useAlertDialogScope(undefined)} 
            />
          </td>
        </tr>
      ))}
    </table>
  );
}
```

### 2. 嵌套对话框

```tsx
function NestedDialogs() {
  const outerScope = useAlertDialogScope(undefined);
  const innerScope = useAlertDialogScope(undefined);
  
  return (
    <AlertDialog.Root {...outerScope}>
      <AlertDialog.Trigger {...outerScope}>打开外层对话框</AlertDialog.Trigger>
      <AlertDialog.Content {...outerScope}>
        <p>这是外层对话框</p>
        
        <AlertDialog.Root {...innerScope}>
          <AlertDialog.Trigger {...innerScope}>打开内层对话框</AlertDialog.Trigger>
          <AlertDialog.Content {...innerScope}>
            <p>这是内层对话框</p>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
```

### 3. 动态创建的对话框

```tsx
function DynamicDialogs() {
  const [dialogs, setDialogs] = useState([]);
  
  const addDialog = () => {
    const newDialog = {
      id: Date.now(),
      scope: useAlertDialogScope(undefined),
      title: `对话框 ${dialogs.length + 1}`
    };
    setDialogs([...dialogs, newDialog]);
  };
  
  return (
    <div>
      <button onClick={addDialog}>添加对话框</button>
      {dialogs.map(dialog => (
        <AlertDialog.Root key={dialog.id} {...dialog.scope}>
          <AlertDialog.Trigger {...dialog.scope}>
            {dialog.title}
          </AlertDialog.Trigger>
          <AlertDialog.Content {...dialog.scope}>
            <p>{dialog.title} 的内容</p>
          </AlertDialog.Content>
        </AlertDialog.Root>
      ))}
    </div>
  );
}
```

## 总结

使用 `createAlertDialogScope` 的主要好处：

1. **隔离性**：每个对话框实例完全独立
2. **可预测性**：行为一致，易于调试
3. **可扩展性**：支持复杂的嵌套和动态场景
4. **安全性**：避免意外的状态共享和冲突

在构建复杂的用户界面时，特别是涉及多个相同类型组件的场景，使用 Scope 是一个最佳实践。