# DismissableLayer 组件详解

## 概述

`DismissableLayer` 是 Radix UI 中的一个核心组件，用于处理"点击外部关闭"和"按 ESC 键关闭"的交互行为。它是许多弹出式组件（如 Dialog、Popover、DropdownMenu 等）的基础。

## 主要功能

### 1. 点击外部关闭 (onPointerDownOutside)
- 当用户点击组件外部区域时触发
- 常用于关闭弹出层、下拉菜单等
- 可以通过 `event.preventDefault()` 阻止默认行为

### 2. ESC 键关闭 (onEscapeKeyDown)
- 当用户按下 ESC 键时触发
- 提供键盘导航支持
- 符合无障碍访问标准

### 3. 内部点击保护
- 点击组件内部不会触发关闭事件
- 通过事件冒泡机制实现
- 可以使用 `event.stopPropagation()` 进一步控制

## 使用场景

### 基础 Popover
```tsx
function BasicPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>打开</button>
      {open && (
        <DismissableLayer
          onPointerDownOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          <div className="popover-content">
            内容区域
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}
```

### 嵌套层级
```tsx
function NestedLayers() {
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <div>
      {outerOpen && (
        <DismissableLayer
          onPointerDownOutside={() => {
            setOuterOpen(false);
            setInnerOpen(false); // 同时关闭内层
          }}
          onEscapeKeyDown={() => setOuterOpen(false)}
        >
          <div>
            外层内容
            {innerOpen && (
              <DismissableLayer
                onPointerDownOutside={(event) => {
                  setInnerOpen(false);
                  event.preventDefault(); // 阻止冒泡到外层
                }}
                onEscapeKeyDown={() => setInnerOpen(false)}
              >
                <div>内层内容</div>
              </DismissableLayer>
            )}
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}
```

### 模态框
```tsx
function Modal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <DismissableLayer
          onPointerDownOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          <div className="modal-overlay">
            <div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()} // 防止点击内容区域关闭
            >
              模态框内容
            </div>
          </div>
        </DismissableLayer>
      )}
    </>
  );
}
```

## 事件处理

### onPointerDownOutside
- **触发时机**: 在组件外部按下鼠标时
- **参数**: `PointerEvent`
- **用途**: 实现点击外部关闭功能

### onEscapeKeyDown
- **触发时机**: 按下 ESC 键时
- **参数**: `KeyboardEvent`
- **用途**: 提供键盘关闭功能

## 最佳实践

### 1. 事件处理
```tsx
<DismissableLayer
  onPointerDownOutside={(event) => {
    // 可以根据条件决定是否关闭
    if (shouldClose) {
      setOpen(false);
    } else {
      event.preventDefault();
    }
  }}
  onEscapeKeyDown={(event) => {
    console.log('ESC 键被按下');
    setOpen(false);
  }}
>
```

### 2. 嵌套处理
```tsx
// 内层阻止事件冒泡
<DismissableLayer
  onPointerDownOutside={(event) => {
    setInnerOpen(false);
    event.preventDefault(); // 阻止触发外层的关闭
  }}
>
```

### 3. 条件关闭
```tsx
const [preventClose, setPreventClose] = useState(false);

<DismissableLayer
  onPointerDownOutside={preventClose ? undefined : () => setOpen(false)}
  onEscapeKeyDown={preventClose ? undefined : () => setOpen(false)}
>
```

## 无障碍访问

### 键盘导航
- 支持 ESC 键关闭
- 符合 ARIA 规范
- 提供键盘用户友好的交互

### 焦点管理
- 通常与 FocusScope 组件配合使用
- 确保焦点在正确的元素上
- 关闭时恢复焦点到触发元素

## 常见问题

### Q: 为什么点击内部也会关闭？
A: 检查是否正确阻止了事件冒泡：
```tsx
<div onClick={(e) => e.stopPropagation()}>
  内容区域
</div>
```

### Q: 如何实现嵌套层级？
A: 在内层使用 `event.preventDefault()` 阻止外层关闭：
```tsx
onPointerDownOutside={(event) => {
  setInnerOpen(false);
  event.preventDefault();
}}
```

### Q: 如何禁用某些关闭方式？
A: 将对应的事件处理器设为 `undefined`：
```tsx
<DismissableLayer
  onPointerDownOutside={disabled ? undefined : handleClose}
  onEscapeKeyDown={disabled ? undefined : handleClose}
>
```

## 技术实现

DismissableLayer 的核心实现包括：

1. **事件监听**: 监听全局的 `pointerdown` 和 `keydown` 事件
2. **边界检测**: 判断点击是否在组件外部
3. **事件管理**: 正确处理事件的添加和移除
4. **层级管理**: 支持多层嵌套的正确行为

这个组件是构建复杂 UI 组件的重要基础，理解其工作原理对于开发高质量的用户界面非常重要。