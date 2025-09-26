import React, { useState, useRef, useCallback } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import "./styles.css";

// 拖拽 Hook
const useDraggable = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    
    const rect = dragRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    // 防止文本选择
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // 边界检查
    const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 0);
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 添加全局事件监听器
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // 防止拖拽时选择文本
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    dragRef,
    position,
    isDragging,
    handleMouseDown,
    resetPosition: () => setPosition({ x: 0, y: 0 })
  };
};

const DraggableDialogDemo = () => {
  return (
    <div>
      {/* 页面标题 */}
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#333',
          fontSize: '1.8rem'
        }}>
          🎯 Dialog 拖拽功能
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          探索 Dialog 拖拽功能的多种实现方案，从基础到高级应用。
        </p>
      </header>
      
      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>📋 Radix UI Dialog 拖拽支持说明</h2>
        <div style={{ marginBottom: '16px' }}>
          <p><strong>❌ 原生不支持：</strong> Radix UI Dialog 组件本身不提供拖拽功能</p>
          <p><strong>✅ 可以扩展：</strong> 通过自定义 Hook 或第三方库可以轻松添加拖拽功能</p>
          <p><strong>🎯 实现方式：</strong> 监听鼠标事件，动态修改 Dialog 的 transform 或 position</p>
        </div>
      </div>

      {/* 基础拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🖱️ 1. 基础拖拽 Dialog</h2>
        <BasicDraggableDialog />
      </section>

      {/* 高级拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🚀 2. 高级拖拽 Dialog（带约束和动画）</h2>
        <AdvancedDraggableDialog />
      </section>

      {/* 多个拖拽 Dialog */}
      <section style={{ marginBottom: '40px' }}>
        <h2>📱 3. 多个拖拽 Dialog</h2>
        <MultipleDraggableDialogs />
      </section>

      {/* 使用第三方库的示例 */}
      <section>
        <h2>📦 4. 第三方库集成示例</h2>
        <ThirdPartyLibraryExample />
      </section>
    </div>
  );
};

// 基础拖拽 Dialog
const BasicDraggableDialog = () => {
  const { dragRef, position, isDragging, handleMouseDown, resetPosition } = useDraggable();
  const [open, setOpen] = useState(false);

  // 当 Dialog 打开时重置位置
  React.useEffect(() => {
    if (open) {
      resetPosition();
    }
  }, [open, resetPosition]);

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button violet">打开基础拖拽 Dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content 
            ref={dragRef}
            className="DialogContent"
            style={{
              position: 'fixed',
              top: 'auto',
              left: 'auto',
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'default',
              userSelect: 'none',
              maxWidth: '400px'
            }}
          >
            {/* 拖拽手柄 */}
            <div 
              onMouseDown={handleMouseDown}
              style={{
                padding: '12px',
                background: '#f8f9fa',
                borderBottom: '1px solid #dee2e6',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <DragHandleDots2Icon />
              <span style={{ fontSize: '14px', color: '#666' }}>拖拽我移动 Dialog</span>
            </div>

            <Dialog.Title className="DialogTitle">基础拖拽 Dialog</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              这个 Dialog 可以通过顶部的拖拽手柄进行拖拽移动。
              <br />
              <br />
              <strong>功能特点：</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>点击顶部拖拽手柄可以移动</li>
                <li>自动边界检查，不会拖出屏幕</li>
                <li>拖拽时改变鼠标样式</li>
                <li>重新打开时重置位置</li>
              </ul>
            </Dialog.Description>

            <div style={{ 
              display: "flex", 
              marginTop: 25, 
              justifyContent: "flex-end",
              gap: "12px"
            }}>
              <button 
                className="Button" 
                onClick={resetPosition}
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
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#e7f3ff', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>💡 实现要点：</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>使用自定义 <code>useDraggable</code> Hook</li>
          <li>监听 <code>mousedown</code>、<code>mousemove</code>、<code>mouseup</code> 事件</li>
          <li>通过 <code>transform: translate()</code> 改变位置</li>
          <li>添加边界检查防止拖出屏幕</li>
        </ul>
      </div>
    </div>
  );
};

// 高级拖拽 Dialog（带约束和动画）
const AdvancedDraggableDialog = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    
    const rect = dragRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: rect.left,
      elementY: rect.top
    };
    
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    const newX = dragStartRef.current.elementX + deltaX;
    const newY = dragStartRef.current.elementY + deltaY;
    
    // 磁性吸附到边缘
    const snapDistance = 20;
    const finalX = newX < snapDistance ? 0 : 
                   newX > window.innerWidth - dragRef.current.offsetWidth - snapDistance ? 
                   window.innerWidth - dragRef.current.offsetWidth : newX;
    
    const finalY = newY < snapDistance ? 0 : 
                   newY > window.innerHeight - dragRef.current.offsetHeight - snapDistance ? 
                   window.innerHeight - dragRef.current.offsetHeight : newY;
    
    setPosition({ x: finalX, y: finalY });
  }, [isDragging]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 重置位置
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setIsMinimized(false);
  };

  React.useEffect(() => {
    if (open) {
      resetPosition();
    }
  }, [open]);

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#17a2b8', color: 'white' }}>
            打开高级拖拽 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content 
            ref={dragRef}
            className="DialogContent"
            style={{
              position: 'fixed',
              top: position.y,
              left: position.x,
              transform: 'none',
              transition: isDragging ? 'none' : 'all 0.2s ease',
              cursor: isDragging ? 'grabbing' : 'default',
              userSelect: 'none',
              maxWidth: '450px',
              height: isMinimized ? '60px' : 'auto',
              overflow: isMinimized ? 'hidden' : 'visible',
              boxShadow: isDragging ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            {/* 标题栏 */}
            <div 
              onMouseDown={handleMouseDown}
              style={{
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: isMinimized ? 0 : '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DragHandleDots2Icon />
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>高级拖拽 Dialog</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {isMinimized ? '📈' : '📉'}
                </button>
                <Dialog.Close asChild>
                  <button 
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div style={{ padding: '0 16px' }}>
                  <Dialog.Description className="DialogDescription">
                    这是一个高级拖拽 Dialog，具有以下功能：
                    <br />
                    <br />
                    <strong>🚀 高级功能：</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      <li><strong>磁性吸附：</strong> 靠近边缘时自动吸附</li>
                      <li><strong>最小化：</strong> 点击 📉 按钮最小化窗口</li>
                      <li><strong>平滑动画：</strong> 拖拽结束后的平滑过渡</li>
                      <li><strong>阴影效果：</strong> 拖拽时增强阴影</li>
                      <li><strong>渐变标题栏：</strong> 美观的视觉效果</li>
                    </ul>
                  </Dialog.Description>

                  <div style={{ 
                    marginTop: '20px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    <strong>当前位置：</strong> x: {Math.round(position.x)}, y: {Math.round(position.y)}
                    <br />
                    <strong>状态：</strong> {isDragging ? '拖拽中' : '静止'} | {isMinimized ? '最小化' : '正常'}
                  </div>

                  <div style={{ 
                    display: "flex", 
                    marginTop: 20, 
                    justifyContent: "flex-end",
                    gap: "12px",
                    paddingBottom: '16px'
                  }}>
                    <button 
                      className="Button" 
                      onClick={resetPosition}
                      style={{ background: '#6c757d', color: 'white' }}
                    >
                      重置位置
                    </button>
                    <Dialog.Close asChild>
                      <button className="Button green">关闭</button>
                    </Dialog.Close>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
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
        <strong>✨ 高级特性：</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>磁性吸附：</strong> 距离边缘 20px 内自动吸附</li>
          <li><strong>最小化功能：</strong> 可以折叠到标题栏</li>
          <li><strong>平滑过渡：</strong> 非拖拽状态下的 CSS 过渡动画</li>
          <li><strong>视觉反馈：</strong> 拖拽时改变阴影和鼠标样式</li>
        </ul>
      </div>
    </div>
  );
};

// 多个拖拽 Dialog
const MultipleDraggableDialogs = () => {
  const [dialogs, setDialogs] = useState<Array<{ id: number; open: boolean }>>([]);
  const [nextId, setNextId] = useState(1);

  const openNewDialog = () => {
    setDialogs(prev => [...prev, { id: nextId, open: true }]);
    setNextId(prev => prev + 1);
  };

  const closeDialog = (id: number) => {
    setDialogs(prev => prev.filter(dialog => dialog.id !== id));
  };

  return (
    <div>
      <button 
        className="Button" 
        onClick={openNewDialog}
        style={{ background: '#28a745', color: 'white' }}
      >
        打开新的拖拽 Dialog
      </button>
      
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#d4edda', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>当前打开的 Dialog 数量：</strong> {dialogs.length}
        {dialogs.length > 0 && (
          <button 
            onClick={() => setDialogs([])}
            style={{
              marginLeft: '12px',
              padding: '4px 8px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            关闭所有
          </button>
        )}
      </div>

      {dialogs.map((dialog) => (
        <SingleDraggableDialog 
          key={dialog.id} 
          id={dialog.id} 
          onClose={() => closeDialog(dialog.id)}
        />
      ))}
    </div>
  );
};

// 单个拖拽 Dialog 组件
const SingleDraggableDialog = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const { dragRef, position, isDragging, handleMouseDown } = useDraggable();

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Content 
          ref={dragRef}
          className="DialogContent"
          style={{
            position: 'fixed',
            top: 'auto',
            left: 'auto',
            transform: `translate(${position.x + id * 30}px, ${position.y + id * 30}px)`,
            cursor: isDragging ? 'grabbing' : 'default',
            userSelect: 'none',
            maxWidth: '350px',
            zIndex: 1000 + id
          }}
        >
          <div 
            onMouseDown={handleMouseDown}
            style={{
              padding: '8px 12px',
              background: `hsl(${(id * 60) % 360}, 70%, 85%)`,
              borderBottom: '1px solid #dee2e6',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DragHandleDots2Icon />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Dialog #{id}</span>
            </div>
            <Dialog.Close asChild>
              <button 
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Title className="DialogTitle">拖拽 Dialog #{id}</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            这是第 {id} 个 Dialog。每个 Dialog 都可以独立拖拽，
            并且会自动错开初始位置避免重叠。
          </Dialog.Description>

          <div style={{ 
            marginTop: '16px',
            padding: '8px',
            background: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <strong>位置：</strong> x: {Math.round(position.x + id * 30)}, y: {Math.round(position.y + id * 30)}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// 第三方库集成示例
const ThirdPartyLibraryExample = () => {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f8f9fa', 
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>📦 推荐的第三方拖拽库</h3>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ padding: '12px', background: 'white', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>1. react-draggable</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            最流行的 React 拖拽库，功能完善，API 简单。
          </p>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '8px', 
            borderRadius: '4px', 
            fontSize: '12px',
            margin: 0
          }}>
{`npm install react-draggable

import Draggable from 'react-draggable';

<Dialog.Content>
  <Draggable handle=".drag-handle">
    <div>
      <div className="drag-handle">拖拽手柄</div>
      {/* Dialog 内容 */}
    </div>
  </Draggable>
</Dialog.Content>`}
          </pre>
        </div>

        <div style={{ padding: '12px', background: 'white', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>2. @dnd-kit/core</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            现代化的拖拽库，支持触摸设备，无障碍友好。
          </p>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '8px', 
            borderRadius: '4px', 
            fontSize: '12px',
            margin: 0
          }}>
{`npm install @dnd-kit/core

import { DndContext, useDraggable } from '@dnd-kit/core';

const DraggableDialog = () => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'dialog'
  });
  
  return (
    <Dialog.Content 
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
    >
      {/* Dialog 内容 */}
    </Dialog.Content>
  );
};`}
          </pre>
        </div>

        <div style={{ padding: '12px', background: 'white', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#dc3545' }}>3. framer-motion</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            强大的动画库，内置拖拽功能，动画效果丰富。
          </p>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '8px', 
            borderRadius: '4px', 
            fontSize: '12px',
            margin: 0
          }}>
{`npm install framer-motion

import { motion } from 'framer-motion';

<Dialog.Content asChild>
  <motion.div
    drag
    dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
    dragElastic={0.1}
    whileDrag={{ scale: 1.05 }}
  >
    {/* Dialog 内容 */}
  </motion.div>
</Dialog.Content>`}
          </pre>
        </div>
      </div>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#fff3cd', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>💡 选择建议：</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>简单需求：</strong> 使用自定义 Hook（如本示例）</li>
          <li><strong>复杂拖拽：</strong> 推荐 react-draggable</li>
          <li><strong>现代项目：</strong> 推荐 @dnd-kit/core</li>
          <li><strong>需要动画：</strong> 推荐 framer-motion</li>
        </ul>
      </div>
    </div>
  );
};

export default DraggableDialogDemo;