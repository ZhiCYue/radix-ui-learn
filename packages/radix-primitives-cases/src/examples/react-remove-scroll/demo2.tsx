import React from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { useRef } from 'react';

function App() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [demoType, setDemoType] = React.useState<'broken' | 'fixed' | 'alternative'>('broken');

  // 方案1：原始的有问题的版本
  const BrokenDemo = () => (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 侧边栏 - 在 RemoveScroll 外部 */}
      <aside 
        ref={sidebarRef}
        style={{
          width: '300px',
          background: '#ffebee',
          overflow: 'auto',
          height: '100%',
          border: '2px solid #f44336'
        }}
      >
        <div style={{ padding: '16px' }}>
          <h3>❌ 侧边栏（有问题）</h3>
          <p style={{ fontSize: '12px', color: '#666' }}>
            这个版本中，即使使用了 shards，侧边栏仍然无法滚动
          </p>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              侧边栏内容 {i + 1}
            </div>
          ))}
        </div>
      </aside>

      {/* 主内容区 */}
      <main style={{ flex: 1, padding: '20px', background: '#fff' }}>
        <h2>❌ 有问题的实现</h2>
        <p>点击按钮打开模态框，你会发现侧边栏无法滚动</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          打开模态框（有问题的版本）
        </button>
        
        <div style={{ marginTop: '20px' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>主页内容 {i + 1}</p>
          ))}
        </div>

        {/* 模态框 */}
        {isModalOpen && (
          <RemoveScroll shards={[sidebarRef]}>
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '400px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                <h3>❌ 有问题的模态框</h3>
                <p>理论上侧边栏应该可以滚动，但实际上不行</p>
                <div style={{ background: '#ffebee', padding: '12px', borderRadius: '4px', margin: '12px 0' }}>
                  <strong>问题原因：</strong>
                  <br />• RemoveScroll 在全局层面禁用了滚动
                  <br />• shards 对外部独立元素的支持有限
                  <br />• 浏览器的滚动锁定机制影响了所有区域
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#666', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  关闭
                </button>
              </div>
            </div>
          </RemoveScroll>
        )}
      </main>
    </div>
  );

  // 方案2：修复版本 - 将侧边栏包含在 RemoveScroll 内部
  const FixedDemo = () => (
    <div>
      {isModalOpen && (
        <RemoveScroll shards={[sidebarRef]}>
          <div style={{ display: 'flex', height: '100vh' }}>
            {/* 侧边栏 - 现在在 RemoveScroll 内部 */}
            <aside 
              ref={sidebarRef}
              style={{
                width: '300px',
                background: '#e8f5e8',
                overflow: 'auto',
                height: '100%',
                border: '2px solid #4caf50'
              }}
            >
              <div style={{ padding: '16px' }}>
                <h3>✅ 侧边栏（修复版）</h3>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  现在侧边栏在 RemoveScroll 内部，可以正常滚动
                </p>
                {Array.from({ length: 50 }, (_, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    侧边栏内容 {i + 1}
                  </div>
                ))}
              </div>
            </aside>

            {/* 主内容区 */}
            <main style={{ flex: 1, padding: '20px', background: '#fff', overflow: 'hidden' }}>
              <h2>✅ 修复后的实现</h2>
              <p>主内容区滚动被禁用，但侧边栏可以滚动</p>
              
              <div style={{ marginTop: '20px', height: '400px', overflow: 'hidden' }}>
                {Array.from({ length: 30 }, (_, i) => (
                  <p key={i}>主页内容 {i + 1} - 无法滚动查看</p>
                ))}
              </div>
            </main>

            {/* 模态框覆盖层 */}
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '400px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                <h3>✅ 修复后的模态框</h3>
                <p>现在侧边栏可以正常滚动了！</p>
                <div style={{ background: '#e8f5e8', padding: '12px', borderRadius: '4px', margin: '12px 0' }}>
                  <strong>解决方案：</strong>
                  <br />• 将整个布局包含在 RemoveScroll 内部
                  <br />• 使用 shards 指定允许滚动的区域
                  <br />• 主内容区设置 overflow: hidden
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </RemoveScroll>
      )}
      
      {!isModalOpen && (
        <div style={{ display: 'flex', height: '100vh' }}>
          <aside style={{ width: '300px', background: '#e8f5e8', overflow: 'auto', height: '100%', border: '2px solid #4caf50' }}>
            <div style={{ padding: '16px' }}>
              <h3>✅ 侧边栏（正常状态）</h3>
              {Array.from({ length: 50 }, (_, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  侧边栏内容 {i + 1}
                </div>
              ))}
            </div>
          </aside>
          
          <main style={{ flex: 1, padding: '20px', background: '#fff' }}>
            <h2>✅ 修复后的实现</h2>
            <p>这个版本将整个布局包含在 RemoveScroll 内部</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{ padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              打开模态框（修复版）
            </button>
            
            <div style={{ marginTop: '20px' }}>
              {Array.from({ length: 30 }, (_, i) => (
                <p key={i}>主页内容 {i + 1}</p>
              ))}
            </div>
          </main>
        </div>
      )}
    </div>
  );

  // 方案3：替代方案 - 使用条件渲染
  const AlternativeDemo = () => {
    // 使用 useEffect 来管理 body 的滚动状态
    React.useEffect(() => {
      if (isModalOpen) {
        // 保存当前滚动位置
        const scrollY = window.scrollY;
        
        // 禁用 body 滚动，但保持侧边栏滚动
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        
        return () => {
          // 恢复滚动
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          window.scrollTo(0, scrollY);
        };
      }
    }, [isModalOpen]);

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <aside 
          style={{
            width: '300px',
            background: '#fff3e0',
            overflow: 'auto',
            height: '100%',
            border: '2px solid #ff9800',
            position: 'relative',
            zIndex: isModalOpen ? 1001 : 1 // 提高层级
          }}
        >
          <div style={{ padding: '16px' }}>
            <h3>🔄 侧边栏（替代方案）</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>
              通过提高 z-index 和特殊处理保持滚动
            </p>
            {Array.from({ length: 50 }, (_, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                侧边栏内容 {i + 1}
              </div>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, padding: '20px', background: '#fff' }}>
          <h2>🔄 替代方案</h2>
          <p>通过 CSS position: fixed 和 z-index 让侧边栏保持可滚动</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '10px 20px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            打开模态框（替代方案）
          </button>
          
          <div style={{ marginTop: '20px' }}>
            {Array.from({ length: 30 }, (_, i) => (
              <p key={i}>主页内容 {i + 1}</p>
            ))}
          </div>

          {/* 模态框 - 不使用 RemoveScroll，手动处理 */}
          {isModalOpen && (
            <div 
              style={{
                position: 'fixed',
                top: 0, left: '300px', right: 0, bottom: 0, // 从侧边栏右侧开始
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                touchAction: 'none', // 禁用触摸滚动
                overscrollBehavior: 'contain' // 防止滚动传播
              }}
            >
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '400px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                <h3>🔄 替代方案模态框</h3>
                <p>侧边栏区域不被覆盖，保持可滚动</p>
                <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '4px', margin: '12px 0' }}>
                  <strong>替代方案：</strong>
                  <br />• 使用 CSS position: fixed 禁用 body 滚动
                  <br />• 模态框只覆盖主内容区
                  <br />• 侧边栏通过 z-index 保持独立和可滚动
                  <br />• 使用 touchAction 和 overscrollBehavior 增强兼容性
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* 切换按钮 */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        zIndex: 2000,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #ddd'
      }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          选择演示版本：
        </div>
        <button 
          onClick={() => setDemoType('broken')}
          style={{ 
            padding: '6px 12px', 
            margin: '2px',
            background: demoType === 'broken' ? '#f44336' : '#fff',
            color: demoType === 'broken' ? 'white' : '#f44336',
            border: '1px solid #f44336',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ❌ 有问题版本
        </button>
        <button 
          onClick={() => setDemoType('fixed')}
          style={{ 
            padding: '6px 12px', 
            margin: '2px',
            background: demoType === 'fixed' ? '#4caf50' : '#fff',
            color: demoType === 'fixed' ? 'white' : '#4caf50',
            border: '1px solid #4caf50',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ✅ 修复版本
        </button>
        <button 
          onClick={() => setDemoType('alternative')}
          style={{ 
            padding: '6px 12px', 
            margin: '2px',
            background: demoType === 'alternative' ? '#ff9800' : '#fff',
            color: demoType === 'alternative' ? 'white' : '#ff9800',
            border: '1px solid #ff9800',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔄 替代方案
        </button>
      </div>

      {/* 渲染对应的演示 */}
      {demoType === 'broken' && <BrokenDemo />}
      {demoType === 'fixed' && <FixedDemo />}
      {demoType === 'alternative' && <AlternativeDemo />}
    </div>
  );
}

export default App;