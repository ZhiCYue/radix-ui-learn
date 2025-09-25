import React, { useState } from 'react';
import { DismissableLayer } from '../../react/dismissable-layer';
import './styles.css';

// 主示例组件
function DismissableLayerDemo() {
  return (
    <div className="dismissable-demo-container">
      <h2>DismissableLayer 示例</h2>
      <p>DismissableLayer 是一个用于处理"点击外部关闭"和"按 ESC 键关闭"行为的组件</p>
      
      <div className="feature-explanation">
        <h3>🎯 主要功能</h3>
        <ul>
          <li><strong>点击外部关闭</strong>：点击组件外部区域时触发关闭</li>
          <li><strong>ESC 键关闭</strong>：按下 ESC 键时触发关闭</li>
          <li><strong>内部点击保护</strong>：点击组件内部不会触发关闭</li>
          <li><strong>嵌套支持</strong>：支持多层嵌套的 DismissableLayer</li>
          <li><strong>事件控制</strong>：可以自定义是否响应特定的关闭事件</li>
        </ul>
      </div>

      <div className="demo-section">
        {/* 基础 Popover 示例 */}
        <div>
          <h3>📋 基础 Popover</h3>
          <BasicPopover 
            trigger="打开基础 Popover" 
          >
            <div>
              <h4>这是一个基础 Popover</h4>
              <p>点击外部或按 ESC 键可以关闭</p>
              <input placeholder="输入一些内容..." style={{ width: '200px', padding: '5px' }} />
            </div>
          </BasicPopover>
        </div>

        {/* 嵌套示例 */}
        <div>
          <h3>🔗 嵌套 DismissableLayer</h3>
          <NestedPopover />
        </div>

        {/* 自定义行为示例 */}
        <div>
          <h3>⚙️ 自定义行为</h3>
          <CustomBehaviorPopover />
        </div>

        {/* 模态框示例 */}
        <div>
          <h3>🪟 模态框示例</h3>
          <ModalExample />
        </div>

        {/* 表单示例 */}
        <div>
          <h3>📝 表单 Popover</h3>
          <FormPopoverExample />
        </div>

        {/* 菜单示例 */}
        <div>
          <h3>📋 下拉菜单</h3>
          <DropdownMenuExample />
        </div>
      </div>
    </div>
  );
}

// 基础 Popover 组件
function BasicPopover({ children, trigger }: { children: React.ReactNode; trigger: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOpen(true)}>
        {trigger}
      </button>
      
      {open && (
        <DismissableLayer
          onPointerDownOutside={() => {
            console.log('点击外部，关闭 Popover');
            setOpen(false);
          }}
          onEscapeKeyDown={() => {
            console.log('按下 ESC 键，关闭 Popover');
            setOpen(false);
          }}
        >
          <div className="popover-content">
            {children}
            <button className="close-button" onClick={() => setOpen(false)}>
              关闭
            </button>
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}

// 嵌套 Popover 示例
function NestedPopover() {
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOuterOpen(true)}>
        打开外层 Popover
      </button>
      
      {outerOpen && (
        <DismissableLayer
          onPointerDownOutside={() => {
            console.log('关闭外层 Popover');
            setOuterOpen(false);
            setInnerOpen(false); // 同时关闭内层
          }}
          onEscapeKeyDown={() => {
            console.log('ESC 关闭外层 Popover');
            setOuterOpen(false);
            setInnerOpen(false);
          }}
        >
          <div className="popover-content">
            <h4>外层 Popover</h4>
            <p>这是外层的内容</p>
            
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button className="nested-button" onClick={() => setInnerOpen(true)}>
                打开内层
              </button>
              
              {innerOpen && (
                <DismissableLayer
                  onPointerDownOutside={(event) => {
                    console.log('关闭内层 Popover');
                    setInnerOpen(false);
                    // 阻止事件冒泡，避免同时关闭外层
                    event.preventDefault();
                  }}
                  onEscapeKeyDown={() => {
                    console.log('ESC 关闭内层 Popover');
                    setInnerOpen(false);
                  }}
                >
                  <div className="nested-popover-content">
                    <h5>内层 Popover</h5>
                    <p>这是嵌套的内容</p>
                    <button className="close-button" onClick={() => setInnerOpen(false)}>
                      关闭内层
                    </button>
                  </div>
                </DismissableLayer>
              )}
            </div>
            
            <button className="close-button" onClick={() => setOuterOpen(false)}>
              关闭外层
            </button>
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}

// 自定义行为示例
function CustomBehaviorPopover() {
  const [open, setOpen] = useState(false);
  const [preventOutsideClick, setPreventOutsideClick] = useState(false);
  const [preventEscapeKey, setPreventEscapeKey] = useState(false);

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOpen(true)}>
        自定义行为 Popover
      </button>
      
      {open && (
        <DismissableLayer
          onPointerDownOutside={preventOutsideClick ? undefined : () => {
            console.log('外部点击关闭');
            setOpen(false);
          }}
          onEscapeKeyDown={preventEscapeKey ? undefined : () => {
            console.log('ESC 键关闭');
            setOpen(false);
          }}
        >
          <div className="popover-content">
            <h4>自定义行为控制</h4>
            
            <div style={{ margin: '12px 0' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={preventOutsideClick}
                  onChange={(e) => setPreventOutsideClick(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                禁用外部点击关闭
              </label>
              
              <label style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  checked={preventEscapeKey}
                  onChange={(e) => setPreventEscapeKey(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                禁用 ESC 键关闭
              </label>
            </div>
            
            {(preventOutsideClick || preventEscapeKey) && (
              <div className="warning-text">
                ⚠️ 某些关闭方式已被禁用，请使用关闭按钮
              </div>
            )}
            
            <button className="close-button" onClick={() => setOpen(false)}>
              关闭
            </button>
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}

// 模态框示例
function ModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="trigger-button" onClick={() => setOpen(true)}>
        打开模态框
      </button>
      
      {open && (
        <DismissableLayer
          onPointerDownOutside={() => {
            console.log('点击遮罩关闭模态框');
            setOpen(false);
          }}
          onEscapeKeyDown={() => {
            console.log('ESC 键关闭模态框');
            setOpen(false);
          }}
        >
          <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>模态框标题</h3>
              <p>这是一个使用 DismissableLayer 实现的模态框。</p>
              <p>点击遮罩区域或按 ESC 键可以关闭。</p>
              
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button className="close-button" onClick={() => setOpen(false)}>
                  关闭
                </button>
              </div>
            </div>
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}

// 表单 Popover 示例
function FormPopoverExample() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提交表单:', formData);
    alert(`提交成功！姓名: ${formData.name}, 邮箱: ${formData.email}`);
    setOpen(false);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOpen(true)}>
        打开表单
      </button>
      
      {open && (
        <DismissableLayer
          onPointerDownOutside={() => {
            console.log('点击外部关闭表单');
            setOpen(false);
          }}
          onEscapeKeyDown={() => {
            console.log('ESC 键关闭表单');
            setOpen(false);
          }}
        >
          <div className="popover-content">
            <h4>用户信息表单</h4>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                  姓名:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入姓名"
                  required
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                  邮箱:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="close-button" 
                  onClick={() => setOpen(false)}
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="trigger-button"
                  style={{ margin: 0, padding: '6px 12px', fontSize: '12px' }}
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}

// 下拉菜单示例
function DropdownMenuExample() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: '编辑', action: () => console.log('编辑') },
    { label: '复制', action: () => console.log('复制') },
    { label: '删除', action: () => console.log('删除'), danger: true },
  ];

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    item.action();
    setOpen(false);
  };

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOpen(true)}>
        操作菜单 ▼
      </button>
      
      {open && (
        <DismissableLayer
          onPointerDownOutside={() => {
            console.log('点击外部关闭菜单');
            setOpen(false);
          }}
          onEscapeKeyDown={() => {
            console.log('ESC 键关闭菜单');
            setOpen(false);
          }}
        >
          <div className="popover-content" style={{ padding: '8px', minWidth: '150px' }}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: item.danger ? '#dc3545' : '#333',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = item.danger ? '#f8d7da' : '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </DismissableLayer>
      )}
    </div>
  );
}

export default DismissableLayerDemo;
