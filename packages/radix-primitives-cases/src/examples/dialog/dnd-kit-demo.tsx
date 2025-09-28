import React, { useState } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core';
import {
  CSS,
  Transform
} from '@dnd-kit/utilities';
import "./styles.css";

const DndKitDemo = () => {
  return (
    <div>
      {/* 页面标题 */}
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#333',
          fontSize: '1.8rem'
        }}>
          🎯 @dnd-kit/core 集成示例
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          使用现代化的 @dnd-kit 库实现无障碍友好的拖拽功能，适合现代项目。
        </p>
      </header>

      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>🚀 @dnd-kit 特性</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>✨ 核心优势</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>无障碍友好 (ARIA)</li>
              <li>键盘导航支持</li>
              <li>触摸设备优化</li>
              <li>性能优化</li>
              <li>TypeScript 支持</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>🎯 高级功能</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>多种传感器支持</li>
              <li>碰撞检测算法</li>
              <li>拖拽覆盖层</li>
              <li>自定义动画</li>
              <li>约束和修饰符</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 基础拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🖱️ 1. 基础拖拽示例</h2>
        <BasicDndKitDialog />
      </section>

      {/* 多传感器示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>⌨️ 2. 多传感器支持示例</h2>
        <MultiSensorDialog />
      </section>

      {/* 拖拽覆盖层示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🎭 3. 拖拽覆盖层示例</h2>
        <DragOverlayDialog />
      </section>

      {/* 拖放区域示例 */}
      <section>
        <h2>🎯 4. 拖放区域示例</h2>
        <DropZoneDialog />
      </section>
    </div>
  );
};

// 基础拖拽示例
const BasicDndKitDialog = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 移动距离后才开始拖拽
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setPosition(prev => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y
    }));
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button violet">打开基础 DnD Kit Dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <DraggableDialog position={position} onReset={() => setPosition({ x: 0, y: 0 })} />
          </DndContext>
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#e7f3ff', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <div><strong>💡 实现要点：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>DndContext</code> 提供拖拽上下文</li>
          <li><code>useDraggable</code> Hook 创建可拖拽元素</li>
          <li><code>PointerSensor</code> 处理鼠标和触摸事件</li>
          <li><code>activationConstraint</code> 防止意外拖拽</li>
        </ul>
      </div>
    </div>
  );
};

// 可拖拽的 Dialog 组件
const DraggableDialog = ({ position, onReset }: { position: { x: number; y: number }; onReset: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: 'draggable-dialog',
  });

  const style = {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: CSS.Translate.toString(transform) 
      ? `translate(-50%, -50%) ${CSS.Translate.toString(transform)}`
      : `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
    maxWidth: '400px',
    margin: 0,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 9999 : 'auto'
  };

  return (
    <Dialog.Content 
      ref={setNodeRef}
      className="DialogContent"
      style={style}
    >
      {/* 拖拽手柄 */}
      <div 
        {...listeners}
        {...attributes}
        style={{
          padding: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          borderRadius: '6px 6px 0 0'
        }}
      >
        <DragHandleDots2Icon />
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>拖拽手柄 - DnD Kit</span>
      </div>

      <Dialog.Title className="DialogTitle">@dnd-kit 基础示例</Dialog.Title>
      <Dialog.Description className="DialogDescription">
        这个 Dialog 使用 @dnd-kit 库实现拖拽功能。支持鼠标、触摸和键盘操作。
      </Dialog.Description>
      
      <div style={{ marginTop: '16px' }}>
        <strong>🎯 功能特点：</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>无障碍支持：</strong> 支持键盘导航和屏幕阅读器</li>
          <li><strong>触摸优化：</strong> 在移动设备上表现良好</li>
          <li><strong>防误触：</strong> 需要移动 8px 才开始拖拽</li>
          <li><strong>性能优化：</strong> 使用 transform 而非重新布局</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>当前位置：</strong> x: {Math.round(position.x)}, y: {Math.round(position.y)}
        <br />
        <strong>拖拽状态：</strong> {isDragging ? '拖拽中' : '静止'}
      </div>

      <div style={{ 
        display: "flex", 
        marginTop: 25, 
        justifyContent: "flex-end",
        gap: "12px"
      }}>
        <button 
          className="Button" 
          onClick={onReset}
          style={{ background: '#6c757d', color: 'white' }}
        >
          重置位置
        </button>
        <Dialog.Close asChild>
          <button className="Button green">关闭</button>
        </Dialog.Close>
      </div>

      <Dialog.Close asChild>
        <button className="IconButton" aria-label="Close">
          <Cross2Icon />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  );
};

// 多传感器支持示例
const MultiSensorDialog = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragInfo, setDragInfo] = useState<string>('');

  // 配置多种传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, { context: { active, droppableRects, droppableContainers, collisionRect } }) => {
        // 自定义键盘导航逻辑
        const { code } = event;
        if (!active) return undefined;
        
        const rect = active.rect.current.translated;
        // 类型守卫：确保 rect 存在且有 x 和 y 属性，并明确类型
        let x: number = 0;
        let y: number = 0;
        
        if (rect && 'x' in rect && 'y' in rect) {
          x = typeof rect.x === 'number' ? rect.x : 0;
          y = typeof rect.y === 'number' ? rect.y : 0;
        }
        
        switch (code) {
          case 'ArrowRight':
            return { x: x + 20, y };
          case 'ArrowLeft':
            return { x: x - 20, y };
          case 'ArrowDown':
            return { x, y: y + 20 };
          case 'ArrowUp':
            return { x, y: y - 20 };
        }
        
        return undefined;
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDragInfo('拖拽开始');
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { delta } = event;
    setDragInfo(`拖拽中: Δx=${Math.round(delta.x)}, Δy=${Math.round(delta.y)}`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setPosition(prev => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y
    }));
    setDragInfo('拖拽结束');
    
    // 3秒后清除信息
    setTimeout(() => setDragInfo(''), 3000);
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#17a2b8', color: 'white' }}>
            打开多传感器 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <MultiSensorDraggableDialog 
              position={position} 
              dragInfo={dragInfo}
              onReset={() => setPosition({ x: 0, y: 0 })} 
            />
          </DndContext>
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#fff3cd', 
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #ffeaa7'
      }}>
        <div><strong>⌨️ 键盘操作：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><kbd>Tab</kbd> 键聚焦到拖拽手柄</li>
          <li><kbd>Space</kbd> 或 <kbd>Enter</kbd> 激活拖拽模式</li>
          <li><kbd>方向键</kbd> 移动 Dialog (每次 20px)</li>
          <li><kbd>Escape</kbd> 取消拖拽</li>
        </ul>
      </div>
    </div>
  );
};

// 多传感器可拖拽 Dialog
const MultiSensorDraggableDialog = ({ 
  position, 
  dragInfo, 
  onReset 
}: { 
  position: { x: number; y: number }; 
  dragInfo: string;
  onReset: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: 'multi-sensor-dialog',
  });

  const style = {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: CSS.Translate.toString(transform) 
      ? `translate(-50%, -50%) ${CSS.Translate.toString(transform)}`
      : `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
    maxWidth: '450px',
    margin: 0,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 9999 : 'auto',
    border: '2px solid #17a2b8'
  };

  return (
    <Dialog.Content 
      ref={setNodeRef}
      className="DialogContent"
      style={style}
    >
      <div 
        {...listeners}
        {...attributes}
        tabIndex={0}
        style={{
          padding: '12px',
          background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
          color: 'white',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          outline: 'none',
          borderRadius: '4px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DragHandleDots2Icon />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>多传感器 Dialog</span>
        </div>
        <Dialog.Close asChild>
          <button 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </div>

      <Dialog.Title className="DialogTitle">多传感器支持</Dialog.Title>
      <Dialog.Description className="DialogDescription">
        这个 Dialog 支持鼠标、触摸和键盘操作。点击拖拽手柄后可以使用方向键移动。
      </Dialog.Description>
      
      <div style={{ marginTop: '16px' }}>
        <strong>🎯 传感器功能：</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>指针传感器：</strong> 鼠标和触摸事件</li>
          <li><strong>键盘传感器：</strong> 方向键导航</li>
          <li><strong>激活约束：</strong> 防止意外拖拽</li>
          <li><strong>自定义坐标：</strong> 键盘移动步长可配置</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <div><strong>当前位置：</strong> x: {Math.round(position.x)}, y: {Math.round(position.y)}</div>
        <div><strong>拖拽状态：</strong> {isDragging ? '拖拽中' : '静止'}</div>
        {dragInfo && <div><strong>操作信息：</strong> {dragInfo}</div>}
      </div>

      <div style={{ 
        display: "flex", 
        marginTop: 20, 
        justifyContent: "flex-end",
        gap: "12px"
      }}>
        <button 
          className="Button" 
          onClick={onReset}
          style={{ background: '#6c757d', color: 'white' }}
        >
          重置位置
        </button>
        <Dialog.Close asChild>
          <button className="Button green">关闭</button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
};

// 拖拽覆盖层示例
const DragOverlayDialog = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setPosition(prev => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y
    }));
    setActiveId(null);
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#28a745', color: 'white' }}>
            打开覆盖层 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <DragOverlayDraggableDialog 
              position={position} 
              onReset={() => setPosition({ x: 0, y: 0 })} 
            />
            <DragOverlay dropAnimation={dropAnimation}>
              {activeId ? (
                <div style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  transform: 'rotate(5deg) scale(1.05)'
                }}>
                  <DragHandleDots2Icon />
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>拖拽中...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#d4edda', 
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #c3e6cb'
      }}>
        <div><strong>🎭 覆盖层特性：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>DragOverlay</code> 提供拖拽时的视觉反馈</li>
          <li>原始元素保持在原位，覆盖层跟随鼠标</li>
          <li>支持自定义拖拽样式和动画</li>
          <li>提供更好的用户体验</li>
        </ul>
      </div>
    </div>
  );
};

// 拖拽覆盖层 Dialog
const DragOverlayDraggableDialog = ({ 
  position, 
  onReset 
}: { 
  position: { x: number; y: number }; 
  onReset: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: 'overlay-dialog',
  });

  const style = {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: CSS.Translate.toString(transform) 
      ? `translate(-50%, -50%) ${CSS.Translate.toString(transform)}`
      : `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
    maxWidth: '400px',
    margin: 0,
    opacity: isDragging ? 0.5 : 1, // 拖拽时原始元素变透明
    border: '2px solid #28a745'
  };

  return (
    <Dialog.Content 
      ref={setNodeRef}
      className="DialogContent"
      style={style}
    >
      <div 
        {...listeners}
        {...attributes}
        style={{
          padding: '12px',
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DragHandleDots2Icon />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>覆盖层 Dialog</span>
        </div>
        <Dialog.Close asChild>
          <button 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </div>

      <Dialog.Title className="DialogTitle">拖拽覆盖层示例</Dialog.Title>
      <Dialog.Description className="DialogDescription">
        拖拽时会显示一个覆盖层，提供更好的视觉反馈。原始 Dialog 会变透明。
      </Dialog.Description>
      
      <div style={{ marginTop: '16px' }}>
        <strong>🎭 覆盖层功能：</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>视觉分离：</strong> 拖拽元素与原始元素分离</li>
          <li><strong>自定义样式：</strong> 拖拽时的特殊样式</li>
          <li><strong>动画效果：</strong> 放下时的过渡动画</li>
          <li><strong>性能优化：</strong> 避免频繁重绘原始元素</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>当前位置：</strong> x: {Math.round(position.x)}, y: {Math.round(position.y)}
        <br />
        <strong>拖拽状态：</strong> {isDragging ? '拖拽中 (覆盖层激活)' : '静止'}
      </div>

      <div style={{ 
        display: "flex", 
        marginTop: 20, 
        justifyContent: "flex-end",
        gap: "12px"
      }}>
        <button 
          className="Button" 
          onClick={onReset}
          style={{ background: '#6c757d', color: 'white' }}
        >
          重置位置
        </button>
        <Dialog.Close asChild>
          <button className="Button green">关闭</button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
};

// 拖放区域示例
const DropZoneDialog = () => {
  const [open, setOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState('center');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedItem(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id === 'mini-dialog') {
      setDialogPosition(over.id as string);
    }
    
    setDraggedItem(null);
  };

  const getPositionStyle = (position: string) => {
    const baseStyle = {
      position: 'fixed' as const,
      maxWidth: '300px',
      margin: 0,
      transition: 'all 0.3s ease'
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px', transform: 'none' };
      case 'top-right':
        return { ...baseStyle, top: '20px', right: '20px', transform: 'none' };
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px', transform: 'none' };
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px', transform: 'none' };
      default:
        return { ...baseStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#dc3545', color: 'white' }}>
            打开拖放区域 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* 拖放区域 */}
            <DropZone id="top-left" position="左上角" active={draggedItem === 'mini-dialog'} />
            <DropZone id="top-right" position="右上角" active={draggedItem === 'mini-dialog'} />
            <DropZone id="bottom-left" position="左下角" active={draggedItem === 'mini-dialog'} />
            <DropZone id="bottom-right" position="右下角" active={draggedItem === 'mini-dialog'} />
            <DropZone id="center" position="中心" active={draggedItem === 'mini-dialog'} />

            {/* 可拖拽的 Dialog */}
            <DropZoneDialogContent 
              position={dialogPosition}
              style={getPositionStyle(dialogPosition)}
            />
          </DndContext>
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#f8d7da', 
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #f5c6cb'
      }}>
        <div><strong>🎯 拖放区域功能：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>将 Dialog 拖拽到不同的屏幕角落</li>
          <li><code>useDroppable</code> 创建放置区域</li>
          <li>碰撞检测自动判断放置位置</li>
          <li>支持视觉反馈和动画过渡</li>
        </ul>
      </div>
    </div>
  );
};

// 拖放区域组件
const DropZone = ({ id, position, active }: { id: string; position: string; active: boolean }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const getZoneStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      width: '100px',
      height: '60px',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
      zIndex: 1000,
      pointerEvents: active ? ('auto' as const) : ('none' as const),
      opacity: active ? 1 : 0.3
    };

    const activeStyle = {
      borderColor: isOver ? '#28a745' : '#007bff',
      backgroundColor: isOver ? 'rgba(40, 167, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)',
      color: isOver ? '#28a745' : '#007bff'
    } as React.CSSProperties;

    switch (id) {
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px', ...(active ? activeStyle : {}) };
      case 'top-right':
        return { ...baseStyle, top: '20px', right: '20px', ...(active ? activeStyle : {}) };
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px', ...(active ? activeStyle : {}) };
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px', ...(active ? activeStyle : {}) };
      case 'center':
        return { 
          ...baseStyle, 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          marginTop: '150px',
          ...(active ? activeStyle : {}) 
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div ref={setNodeRef} style={getZoneStyle()}>
      {position}
    </div>
  );
};

// 拖放区域 Dialog 内容
const DropZoneDialogContent = ({ 
  position, 
  style 
}: { 
  position: string; 
  style: React.CSSProperties;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: 'mini-dialog',
  });

  const finalStyle = {
    ...style,
    transform: CSS.Translate.toString(transform) 
      ? `${style.transform || ''} ${CSS.Translate.toString(transform)}`
      : style.transform,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 9999 : 'auto',
    border: '2px solid #dc3545'
  };

  return (
    <Dialog.Content 
      ref={setNodeRef}
      className="DialogContent"
      style={finalStyle}
    >
      <div 
        {...listeners}
        {...attributes}
        style={{
          padding: '8px 12px',
          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
          color: 'white',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DragHandleDots2Icon />
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>拖放 Dialog</span>
        </div>
        <Dialog.Close asChild>
          <button 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '2px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </div>

      <Dialog.Title className="DialogTitle" style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
        拖放区域示例
      </Dialog.Title>
      <Dialog.Description className="DialogDescription" style={{ fontSize: '14px' }}>
        拖拽我到屏幕的不同角落！
      </Dialog.Description>
      
      <div style={{ 
        marginTop: '12px',
        padding: '8px',
        background: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>当前位置：</strong> {position === 'center' ? '中心' : position}
        <br />
        <strong>拖拽状态：</strong> {isDragging ? '拖拽中' : '静止'}
      </div>
    </Dialog.Content>
  );
};

export default DndKitDemo;