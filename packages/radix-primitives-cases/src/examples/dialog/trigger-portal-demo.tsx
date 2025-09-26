import React, { useState, useRef } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

const TriggerPortalDemo = () => {
  const [customContainer, setCustomContainer] = useState<HTMLElement | null>(null);
  const customContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCustomContainer(customContainerRef.current);
  }, []);

  return (
    <div>
      {/* 页面标题 */}
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#333',
          fontSize: '1.8rem'
        }}>
          🔧 Trigger & Portal 机制
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          深入了解 Dialog.Trigger 的作用域限制和 Portal 的 DOM 挂载机制。
        </p>
      </header>

      {/* 1. Dialog.Trigger 必须在 Dialog.Root 内部 */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '2px solid #e9ecef', borderRadius: '8px' }}>
        <h2>🎯 1. Dialog.Trigger 的作用域限制</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#28a745' }}>✅ 正确用法：Trigger 在 Dialog.Root 内部</h3>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="Button violet">正确的 Trigger</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="DialogOverlay" />
              <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">正确的 Dialog</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  这个 Trigger 在 Dialog.Root 内部，可以正常工作。
                </Dialog.Description>
                <Dialog.Close asChild>
                  <button className="Button">关闭</button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#dc3545' }}>❌ 错误用法演示</h3>
          <div style={{ 
            padding: '16px', 
            background: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: '4px',
            marginBottom: '12px'
          }}>
            <strong>以下代码会报错：</strong>
            <pre style={{ 
              background: '#fff', 
              padding: '12px', 
              borderRadius: '4px', 
              margin: '8px 0',
              fontSize: '14px',
              overflow: 'auto'
            }}>
{`// ❌ 这样写会报错
<button>外部按钮</button>  {/* 在 Dialog.Root 外部 */}
<Dialog.Root>
  <Dialog.Portal>
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`}
            </pre>
            <p style={{ margin: '8px 0', color: '#721c24' }}>
              <strong>错误原因：</strong> Dialog.Trigger 需要访问 Dialog.Root 提供的 Context，
              包括 open 状态、onOpenChange 回调等。在外部无法访问这些数据。
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ color: '#0066cc' }}>🔧 如果需要外部控制怎么办？</h3>
          <ExternalControlExample />
        </div>
      </section>

      {/* 2. Dialog.Portal 的挂载机制 */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '2px solid #e9ecef', borderRadius: '8px' }}>
        <h2>🌐 2. Dialog.Portal 的 DOM 挂载机制</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>📋 Portal 挂载规则</h3>
          <div style={{ 
            padding: '16px', 
            background: '#e7f3ff', 
            border: '1px solid #b3d9ff', 
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>优先级1：</strong> 如果指定了 <code>container</code> 属性，挂载到指定容器</li>
              <li><strong>优先级2：</strong> 如果没有指定 container，挂载到 <code>document.body</code></li>
              <li><strong>SSR 兼容：</strong> 在服务端渲染时返回 null，客户端挂载后才渲染</li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🎯 默认挂载：挂载到 document.body</h3>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="Button">默认 Portal (挂载到 body)</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="DialogOverlay" />
              <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">默认 Portal</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  这个 Dialog 挂载到 document.body。
                  <br />
                  打开开发者工具，你会看到内容在 &lt;body&gt; 的最后。
                </Dialog.Description>
                <div style={{ marginTop: '20px' }}>
                  <button 
                    onClick={() => {
                      const dialogs = document.querySelectorAll('[role="dialog"]');
                      alert(`当前页面有 ${dialogs.length} 个 dialog 元素挂载在 DOM 中`);
                    }}
                    className="Button"
                    style={{ marginRight: '12px' }}
                  >
                    检查 DOM 结构
                  </button>
                  <Dialog.Close asChild>
                    <button className="Button">关闭</button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🎯 自定义容器：挂载到指定元素</h3>
          <div 
            ref={customContainerRef}
            style={{ 
              border: '2px dashed #007bff', 
              padding: '20px', 
              borderRadius: '8px',
              background: '#f8f9fa',
              position: 'relative',
              minHeight: '100px'
            }}
          >
            <strong>自定义容器 (Portal 会挂载到这里)</strong>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              这个虚线框就是自定义容器，Dialog 内容会渲染在这里面
            </div>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="Button green">自定义 Portal (挂载到上面的容器)</button>
              </Dialog.Trigger>
              <Dialog.Portal container={customContainer}>
                <Dialog.Overlay 
                  className="DialogOverlay" 
                  style={{ 
                    position: 'absolute',  // 相对于容器定位
                    background: 'rgba(0, 123, 255, 0.3)'  // 蓝色背景便于区分
                  }} 
                />
                <Dialog.Content 
                  className="DialogContent"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '300px'
                  }}
                >
                  <Dialog.Title className="DialogTitle">自定义容器 Portal</Dialog.Title>
                  <Dialog.Description className="DialogDescription">
                    这个 Dialog 挂载到上面的蓝色虚线容器中，而不是 document.body。
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <button className="Button" style={{ marginTop: '16px' }}>关闭</button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

        <div>
          <h3>🔍 Portal 源码分析</h3>
          <div style={{ 
            padding: '16px', 
            background: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`// Portal 组件的核心逻辑
const Portal = ({ container: containerProp, ...props }) => {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  
  // 挂载容器的判断逻辑
  const container = containerProp || (mounted && document?.body);
  
  return container
    ? ReactDOM.createPortal(<div {...props} />, container)
    : null;  // SSR 时返回 null
};`}
            </pre>
          </div>
        </div>
      </section>

      {/* 3. 实际应用场景 */}
      <section style={{ padding: '20px', border: '2px solid #e9ecef', borderRadius: '8px' }}>
        <h2>🚀 3. 实际应用场景</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>📱 场景1：移动端全屏 Dialog</h3>
          <MobileFullscreenExample />
        </div>

        <div>
          <h3>🎨 场景2：嵌套在特定区域的 Dialog</h3>
          <NestedContainerExample />
        </div>
      </section>
    </div>
  );
};

// 外部控制示例
const ExternalControlExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ 
      padding: '16px', 
      background: '#e7f3ff', 
      border: '1px solid #b3d9ff', 
      borderRadius: '4px' 
    }}>
      <p><strong>解决方案：使用受控模式</strong></p>
      
      {/* 外部按钮 */}
      <button 
        className="Button" 
        onClick={() => setOpen(true)}
        style={{ marginRight: '12px' }}
      >
        外部控制按钮
      </button>
      
      {/* Dialog 组件 */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">外部控制的 Dialog</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              这个 Dialog 通过外部按钮控制，使用 open 和 onOpenChange 属性。
            </Dialog.Description>
            <button 
              className="Button" 
              onClick={() => setOpen(false)}
              style={{ marginTop: '16px' }}
            >
              关闭
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      
      <div style={{ fontSize: '12px', color: '#0066cc', marginTop: '8px' }}>
        当前状态：{open ? '打开' : '关闭'}
      </div>
    </div>
  );
};

// 移动端全屏示例
const MobileFullscreenExample = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="Button">移动端全屏 Dialog</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content 
          className="DialogContent"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            maxHeight: 'none',
            borderRadius: 0,
            background: 'white'
          }}
        >
          <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Dialog.Title className="DialogTitle">全屏 Dialog</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              这是一个全屏的 Dialog，适合移动端使用。
            </Dialog.Description>
            <div style={{ flex: 1, padding: '20px 0' }}>
              <p>内容区域...</p>
            </div>
            <Dialog.Close asChild>
              <button className="Button" style={{ alignSelf: 'flex-start' }}>关闭</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// 嵌套容器示例
const NestedContainerExample = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setContainer(containerRef.current);
  }, []);

  return (
    <div>
      <div 
        ref={containerRef}
        style={{ 
          border: '2px solid #28a745', 
          padding: '20px', 
          borderRadius: '8px',
          background: '#f8fff9',
          position: 'relative',
          height: '200px',
          overflow: 'hidden'
        }}
      >
        <strong>受限容器 (高度: 200px)</strong>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          Dialog 会在这个绿色容器内显示，受容器大小限制
        </div>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="Button green">在受限容器中打开</button>
          </Dialog.Trigger>
          <Dialog.Portal container={container}>
            <Dialog.Overlay 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(40, 167, 69, 0.3)'
              }} 
            />
            <Dialog.Content 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                maxWidth: '250px'
              }}
            >
              <Dialog.Title style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                受限 Dialog
              </Dialog.Title>
              <Dialog.Description style={{ margin: '0 0 16px 0', fontSize: '14px' }}>
                这个 Dialog 只能在绿色容器内显示。
              </Dialog.Description>
              <Dialog.Close asChild>
                <button className="Button" style={{ fontSize: '12px', padding: '4px 8px' }}>
                  关闭
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default TriggerPortalDemo;