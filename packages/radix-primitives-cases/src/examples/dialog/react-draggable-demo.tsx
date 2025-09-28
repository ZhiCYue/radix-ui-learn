import React, { useState } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import "./styles.css";

const ReactDraggableDemo = () => {
  return (
    <div>
      {/* 页面标题 */}
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#333',
          fontSize: '1.8rem'
        }}>
          📦 React-Draggable 集成示例
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          使用 react-draggable 库实现专业级拖拽功能，适合复杂拖拽需求。
        </p>
      </header>

      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>🚀 React-Draggable 特性</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>✨ 核心功能</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>拖拽手柄指定</li>
              <li>拖拽边界限制</li>
              <li>拖拽轴向限制</li>
              <li>网格对齐</li>
              <li>拖拽事件回调</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>🎯 高级特性</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>受控/非受控模式</li>
              <li>拖拽禁用状态</li>
              <li>默认位置设置</li>
              <li>拖拽取消功能</li>
              <li>触摸设备支持</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 基础拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🖱️ 1. 基础拖拽示例</h2>
        <BasicReactDraggableDialog />
      </section>

      {/* 带约束的拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🎯 2. 带约束的拖拽示例</h2>
        <ConstrainedDraggableDialog />
      </section>

      {/* 网格对齐拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>📐 3. 网格对齐拖拽示例</h2>
        <GridDraggableDialog />
      </section>

      {/* 受控拖拽示例 */}
      <section>
        <h2>🎮 4. 受控拖拽示例</h2>
        <ControlledDraggableDialog />
      </section>
    </div>
  );
};

// 基础拖拽示例
const BasicReactDraggableDialog = () => {
  const [open, setOpen] = useState(false);
  const [dragData, setDragData] = useState({ x: 0, y: 0 });

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setDragData({ x: data.x, y: data.y });
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button violet">打开基础拖拽 Dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Draggable
            handle=".drag-handle"
            onDrag={handleDrag}
            onStart={() => console.log('拖拽开始')}
            onStop={() => console.log('拖拽结束')}
          >
            <Dialog.Content 
              className="DialogContent"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '400px',
                margin: 0
              }}
            >
              {/* 拖拽手柄 */}
              <div 
                className="drag-handle"
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  borderRadius: '6px 6px 0 0'
                }}
              >
                <DragHandleDots2Icon />
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>拖拽手柄 - React Draggable</span>
              </div>

              <Dialog.Title className="DialogTitle">React-Draggable 基础示例</Dialog.Title>
              <Dialog.Description className="DialogDescription">
                这个 Dialog 使用 react-draggable 库实现拖拽功能。只能通过顶部的拖拽手柄进行拖拽。
              </Dialog.Description>
              
              <div style={{ marginTop: '16px' }}>
                <strong>🎯 功能特点：</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li><strong>指定拖拽手柄：</strong> 只有标题栏可以拖拽</li>
                  <li><strong>事件回调：</strong> 监听拖拽开始、进行中、结束事件</li>
                  <li><strong>位置追踪：</strong> 实时显示拖拽位置</li>
                  <li><strong>简单集成：</strong> 只需包装 Dialog.Content</li>
                </ul>
              </div>

              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>当前位置：</strong> x: {Math.round(dragData.x)}, y: {Math.round(dragData.y)}
              </div>

              <div style={{ 
                display: "flex", 
                marginTop: 25, 
                justifyContent: "flex-end",
                gap: "12px"
              }}>
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
          </Draggable>
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
          <li><code>handle=".drag-handle"</code> 指定拖拽手柄</li>
          <li><code>onDrag</code> 监听拖拽过程中的位置变化</li>
          <li><code>onStart/onStop</code> 监听拖拽开始和结束</li>
          <li>使用 Draggable 组件包装 Dialog.Content</li>
        </ul>
      </div>
    </div>
  );
};

// 带约束的拖拽示例
const ConstrainedDraggableDialog = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 计算拖拽边界
  const bounds = {
    left: -200,
    top: -150,
    right: 200,
    bottom: 150
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#17a2b8', color: 'white' }}>
            打开约束拖拽 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Draggable
            handle=".drag-handle"
            bounds={bounds}
            position={position}
            onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
            onStop={(e, data) => {
              console.log('拖拽结束，最终位置：', { x: data.x, y: data.y });
            }}
          >
            <Dialog.Content 
              className="DialogContent"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '450px',
                margin: 0,
                border: '2px solid #17a2b8'
              }}
            >
              <div 
                className="drag-handle"
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                  color: 'white',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DragHandleDots2Icon />
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>约束拖拽 Dialog</span>
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

              <Dialog.Title className="DialogTitle">带约束的拖拽</Dialog.Title>
              <Dialog.Description className="DialogDescription">
                这个 Dialog 的拖拽范围被限制在一个矩形区域内，不能拖出边界。
              </Dialog.Description>
              
              <div style={{ marginTop: '16px' }}>
                <strong>🎯 约束功能：</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li><strong>边界限制：</strong> 左右各 200px，上下各 150px</li>
                  <li><strong>受控位置：</strong> 通过 position 属性控制位置</li>
                  <li><strong>边界反馈：</strong> 到达边界时停止移动</li>
                  <li><strong>位置重置：</strong> 可以程序化重置位置</li>
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
                <div><strong>约束范围：</strong> x: [{bounds.left}, {bounds.right}], y: [{bounds.top}, {bounds.bottom}]</div>
              </div>

              <div style={{ 
                display: "flex", 
                marginTop: 20, 
                justifyContent: "flex-end",
                gap: "12px"
              }}>
                <button 
                  className="Button" 
                  onClick={() => setPosition({ x: 0, y: 0 })}
                  style={{ background: '#6c757d', color: 'white' }}
                >
                  重置位置
                </button>
                <Dialog.Close asChild>
                  <button className="Button green">关闭</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Draggable>
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
        <div><strong>🔧 约束配置：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>bounds</code> 属性设置拖拽边界</li>
          <li><code>position</code> 属性实现受控拖拽</li>
          <li>可以设置字符串边界如 <code>"parent"</code> 或 <code>"body"</code></li>
          <li>支持动态计算边界函数</li>
        </ul>
      </div>
    </div>
  );
};

// 网格对齐拖拽示例
const GridDraggableDialog = () => {
  const [open, setOpen] = useState(false);
  const [snapData, setSnapData] = useState({ x: 0, y: 0, deltaX: 0, deltaY: 0 });

  const gridSize = 25; // 网格大小

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#28a745', color: 'white' }}>
            打开网格拖拽 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Draggable
            handle=".drag-handle"
            grid={[gridSize, gridSize]}
            onDrag={(e, data) => {
              setSnapData({
                x: data.x,
                y: data.y,
                deltaX: data.deltaX,
                deltaY: data.deltaY
              });
            }}
          >
            <Dialog.Content 
              className="DialogContent"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '400px',
                margin: 0,
                border: '2px solid #28a745'
              }}
            >
              <div 
                className="drag-handle"
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DragHandleDots2Icon />
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>网格拖拽 Dialog</span>
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

              <Dialog.Title className="DialogTitle">网格对齐拖拽</Dialog.Title>
              <Dialog.Description className="DialogDescription">
                这个 Dialog 会自动对齐到 {gridSize}px × {gridSize}px 的网格上，拖拽时会有吸附效果。
              </Dialog.Description>
              
              <div style={{ marginTop: '16px' }}>
                <strong>📐 网格功能：</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li><strong>网格对齐：</strong> 自动吸附到 {gridSize}px 网格</li>
                  <li><strong>精确定位：</strong> 确保位置始终对齐</li>
                  <li><strong>视觉反馈：</strong> 拖拽时可以感受到吸附效果</li>
                  <li><strong>可配置：</strong> 可以设置不同的网格大小</li>
                </ul>
              </div>

              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <div><strong>网格位置：</strong> x: {Math.round(snapData.x)}, y: {Math.round(snapData.y)}</div>
                <div><strong>移动距离：</strong> Δx: {Math.round(snapData.deltaX)}, Δy: {Math.round(snapData.deltaY)}</div>
                <div><strong>网格大小：</strong> {gridSize}px × {gridSize}px</div>
              </div>

              <div style={{ 
                display: "flex", 
                marginTop: 20, 
                justifyContent: "flex-end"
              }}>
                <Dialog.Close asChild>
                  <button className="Button green">关闭</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Draggable>
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
        <div><strong>📐 网格配置：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>grid={`[${gridSize}, ${gridSize}]`}</code> 设置网格大小</li>
          <li>支持不同的 x、y 轴网格大小</li>
          <li>拖拽时自动计算最近的网格点</li>
          <li>适合需要精确对齐的场景</li>
        </ul>
      </div>
    </div>
  );
};

// 受控拖拽示例
const ControlledDraggableDialog = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [disabled, setDisabled] = useState(false);
  const [axis, setAxis] = useState<'both' | 'x' | 'y' | 'none'>('both');

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  const presetPositions = [
    { name: '中心', x: 0, y: 0 },
    { name: '左上', x: -150, y: -100 },
    { name: '右上', x: 150, y: -100 },
    { name: '左下', x: -150, y: 100 },
    { name: '右下', x: 150, y: 100 }
  ];

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#dc3545', color: 'white' }}>
            打开受控拖拽 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Draggable
            handle=".drag-handle"
            position={position}
            onDrag={handleDrag}
            disabled={disabled}
            axis={axis}
            bounds={{ left: -200, top: -150, right: 200, bottom: 150 }}
          >
            <Dialog.Content 
              className="DialogContent"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '500px',
                margin: 0,
                border: '2px solid #dc3545',
                opacity: disabled ? 0.7 : 1
              }}
            >
              <div 
                className="drag-handle"
                style={{
                  padding: '12px',
                  background: disabled 
                    ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                    : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                  color: 'white',
                  cursor: disabled ? 'not-allowed' : 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DragHandleDots2Icon />
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    受控拖拽 Dialog {disabled && '(已禁用)'}
                  </span>
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

              <Dialog.Title className="DialogTitle">受控拖拽示例</Dialog.Title>
              <Dialog.Description className="DialogDescription">
                这个 Dialog 演示了受控拖拽的各种功能：禁用拖拽、轴向限制、程序化定位等。
              </Dialog.Description>
              
              {/* 控制面板 */}
              <div style={{ 
                marginTop: '16px',
                padding: '16px',
                background: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🎮 控制面板</h4>
                
                {/* 拖拽开关 */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={!disabled}
                      onChange={(e) => setDisabled(!e.target.checked)}
                    />
                    <span>启用拖拽</span>
                  </label>
                </div>

                {/* 轴向选择 */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                    拖拽轴向：
                  </label>
                  <select 
                    value={axis} 
                    onChange={(e) => setAxis(e.target.value as any)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="both">双向 (x + y)</option>
                    <option value="x">仅水平 (x)</option>
                    <option value="y">仅垂直 (y)</option>
                    <option value="none">禁用</option>
                  </select>
                </div>

                {/* 预设位置 */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    快速定位：
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {presetPositions.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setPosition({ x: preset.x, y: preset.y })}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                background: '#fff5f5',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <div><strong>当前状态：</strong></div>
                <div>位置: x: {Math.round(position.x)}, y: {Math.round(position.y)}</div>
                <div>拖拽: {disabled ? '禁用' : '启用'}</div>
                <div>轴向: {axis === 'both' ? '双向' : axis === 'x' ? '仅水平' : axis === 'y' ? '仅垂直' : '禁用'}</div>
              </div>

              <div style={{ 
                display: "flex", 
                marginTop: 20, 
                justifyContent: "flex-end"
              }}>
                <Dialog.Close asChild>
                  <button className="Button green">关闭</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Draggable>
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
        <div><strong>🎮 受控功能：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>position</code> 属性完全控制位置</li>
          <li><code>disabled</code> 属性禁用/启用拖拽</li>
          <li><code>axis</code> 属性限制拖拽方向</li>
          <li>支持程序化设置位置</li>
        </ul>
      </div>
    </div>
  );
};

export default ReactDraggableDemo;