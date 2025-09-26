import React, { useState, useRef } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import './styles.css';

// import App from './demo2';
// export default App;

// 主示例组件
function ReactRemoveScrollDemo() {
  return (
    <div className="remove-scroll-demo-container">
      <h2>React Remove Scroll 示例</h2>
      <p>react-remove-scroll 是一个用于防止背景滚动的库，常用于模态框、抽屉等组件</p>
      
      <div className="feature-explanation">
        <h3>🎯 主要功能</h3>
        <ul>
          <li><strong>防止背景滚动</strong>：当模态框打开时，阻止页面背景滚动</li>
          <li><strong>保持滚动位置</strong>：关闭模态框后恢复原来的滚动位置</li>
          <li><strong>支持嵌套</strong>：多个 RemoveScroll 组件可以嵌套使用</li>
          <li><strong>允许特定区域滚动</strong>：可以指定某些区域仍然可以滚动</li>
          <li><strong>移动端优化</strong>：处理移动端的滚动问题</li>
        </ul>
      </div>

      {/* 创建长内容以便测试滚动 */}
      <div className="long-content">
        <h3>📜 页面内容（用于测试背景滚动）</h3>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="content-block">
            <h4>内容块 {i + 1}</h4>
            <p>
              这是第 {i + 1} 个内容块。当模态框打开时，这些内容应该无法滚动。
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </div>

      <div className="demo-section">
        {/* 基础模态框示例 */}
        <div>
          <h3>🪟 基础模态框</h3>
          <BasicModalDemo />
        </div>

        {/* 嵌套模态框示例 */}
        <div>
          <h3>🔗 嵌套模态框</h3>
          <NestedModalDemo />
        </div>

        {/* 侧边抽屉示例 */}
        <div>
          <h3>📱 侧边抽屉</h3>
          <SideDrawerDemo />
        </div>

        {/* 允许特定区域滚动示例 */}
        <div>
          <h3>🎯 允许特定区域滚动</h3>
          <AllowScrollDemo />
        </div>

        {/* 对比示例 */}
        <div>
          <h3>⚖️ 对比示例（有/无 RemoveScroll）</h3>
          <ComparisonDemo />
        </div>
      </div>
    </div>
  );
}

// 基础模态框示例
function BasicModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOpen(true)}>
        打开基础模态框
      </button>
      
      {open && (
        <RemoveScroll>
          <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h4>基础模态框</h4>
              <p>背景滚动已被禁用</p>
              <p>尝试滚动页面，你会发现背景无法滚动</p>
              
              <div className="scrollable-content">
                <h5>模态框内的可滚动内容：</h5>
                {Array.from({ length: 10 }, (_, i) => (
                  <p key={i}>模态框内容行 {i + 1}</p>
                ))}
              </div>
              
              <button className="close-button" onClick={() => setOpen(false)}>
                关闭
              </button>
            </div>
          </div>
        </RemoveScroll>
      )}
    </div>
  );
}

// 嵌套模态框示例
function NestedModalDemo() {
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOuterOpen(true)}>
        打开嵌套模态框
      </button>
      
      {outerOpen && (
        <RemoveScroll>
          <div className="modal-overlay" onClick={() => setOuterOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h4>外层模态框</h4>
              <p>这是外层模态框的内容</p>
              
              <button 
                className="nested-button" 
                onClick={() => setInnerOpen(true)}
              >
                打开内层模态框
              </button>
              
              <button className="close-button" onClick={() => setOuterOpen(false)}>
                关闭外层
              </button>
            </div>
          </div>
          
          {innerOpen && (
            <RemoveScroll>
              <div className="modal-overlay nested" onClick={() => setInnerOpen(false)}>
                <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
                  <h4>内层模态框</h4>
                  <p>嵌套的 RemoveScroll 组件</p>
                  <button className="close-button" onClick={() => setInnerOpen(false)}>
                    关闭内层
                  </button>
                </div>
              </div>
            </RemoveScroll>
          )}
        </RemoveScroll>
      )}
    </div>
  );
}

// 侧边抽屉示例
function SideDrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOpen(true)}>
        打开侧边抽屉
      </button>
      
      {open && (
        <RemoveScroll>
          <div className="drawer-overlay" onClick={() => setOpen(false)}>
            <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <h4>侧边抽屉</h4>
                <button className="close-icon" onClick={() => setOpen(false)}>
                  ✕
                </button>
              </div>
              
              <div className="drawer-body">
                <p>这是侧边抽屉的内容</p>
                <p>背景滚动已被禁用</p>
                
                <div className="drawer-menu">
                  <h5>菜单项：</h5>
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="menu-item">
                      菜单项 {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RemoveScroll>
      )}
    </div>
  );
}

// 允许特定区域滚动示例
function AllowScrollDemo() {
  const [open, setOpen] = useState(false);
  const allowedRef = useRef<HTMLDivElement>(null);

  return (
    <div className="demo-container">
      <button className="trigger-button" onClick={() => setOpen(true)}>
        打开允许滚动示例
      </button>
      
      {open && (
        <RemoveScroll shards={[allowedRef]}>
          <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <h4>允许特定区域滚动</h4>
              <p>左侧区域滚动被禁用，右侧区域可以滚动</p>
              
              <div className="split-content">
                <div className="left-panel" style={{ overflow: 'hidden' }}>
                  <h5>❌ 禁用滚动区域</h5>
                  <p>这个区域无法滚动（overflow: hidden + RemoveScroll）</p>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    {Array.from({ length: 15 }, (_, i) => (
                      <p key={i} style={{ margin: '8px 0', fontSize: '14px' }}>
                        禁用滚动内容 {i + 1} - 这些内容被隐藏了
                      </p>
                    ))}
                  </div>
                  <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '12px' }}>
                    ⚠️ 内容超出但无法滚动查看
                  </p>
                </div>
                
                <div className="right-panel" ref={allowedRef}>
                  <h5>✅ 允许滚动区域</h5>
                  <p>这个区域可以滚动（通过 shards 属性指定）</p>
                  {Array.from({ length: 20 }, (_, i) => (
                    <p key={i} style={{ margin: '8px 0', fontSize: '14px' }}>
                      允许滚动内容 {i + 1}
                    </p>
                  ))}
                  <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '12px' }}>
                    ✅ 可以滚动查看所有内容
                  </p>
                </div>
              </div>
              
              <div style={{ marginTop: '16px', padding: '12px', background: '#e7f3ff', borderRadius: '4px', fontSize: '14px' }}>
                <strong>💡 技术说明：</strong>
                <br />
                • 右侧区域通过 <code>shards={`[allowedRef]`}</code> 被排除在滚动禁用之外
                <br />
                • 左侧区域受到 RemoveScroll 影响，同时设置了 overflow: hidden 确保无法滚动
                <br />
                • 这样可以实现精确的滚动控制
              </div>
              
              <button className="close-button" onClick={() => setOpen(false)}>
                关闭
              </button>
            </div>
          </div>
        </RemoveScroll>
      )}
    </div>
  );
}

// 对比示例（有/无 RemoveScroll）
function ComparisonDemo() {
  const [withRemoveScroll, setWithRemoveScroll] = useState(false);
  const [withoutRemoveScroll, setWithoutRemoveScroll] = useState(false);

  return (
    <div className="demo-container">
      <div className="comparison-buttons">
        <button 
          className="trigger-button with-remove-scroll" 
          onClick={() => setWithRemoveScroll(true)}
        >
          使用 RemoveScroll
        </button>
        <button 
          className="trigger-button without-remove-scroll" 
          onClick={() => setWithoutRemoveScroll(true)}
        >
          不使用 RemoveScroll
        </button>
      </div>
      
      <p className="comparison-note">
        💡 对比两个按钮的效果：使用 RemoveScroll 的版本会阻止背景滚动，
        不使用的版本背景仍然可以滚动
      </p>
      
      {/* 使用 RemoveScroll 的模态框 */}
      {withRemoveScroll && (
        <RemoveScroll>
          <div className="modal-overlay" onClick={() => setWithRemoveScroll(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h4>✅ 使用了 RemoveScroll</h4>
              <p>背景滚动已被禁用</p>
              <p>尝试滚动页面，背景不会移动</p>
              <button className="close-button" onClick={() => setWithRemoveScroll(false)}>
                关闭
              </button>
            </div>
          </div>
        </RemoveScroll>
      )}
      
      {/* 不使用 RemoveScroll 的模态框 */}
      {withoutRemoveScroll && (
        <div className="modal-overlay" onScroll={(e) => e.stopPropagation} onClick={() => setWithoutRemoveScroll(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>❌ 没有使用 RemoveScroll</h4>
            <p>背景滚动没有被禁用</p>
            <p>尝试滚动页面，背景会跟着移动</p>
            <button className="close-button" onClick={() => setWithoutRemoveScroll(false)}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReactRemoveScrollDemo;