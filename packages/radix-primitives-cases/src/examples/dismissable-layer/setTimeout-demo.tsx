import { useState, useEffect, useRef } from 'react';
import './styles.css';

// 模拟没有 setTimeout 的版本（有问题的）
function BrokenDismissableLayer({ 
  children, 
  onDismiss, 
  isOpen 
}: { 
  children: React.ReactNode; 
  onDismiss: () => void;
  isOpen: boolean;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      
      // 检查是否点击了触发按钮（模拟真实场景）
      if (buttonRef.current && buttonRef.current.contains(target)) {
        console.log('🔴 Broken: 点击了触发按钮，但监听器已经存在，立即关闭！');
        onDismiss();
        return;
      }
      
      if (layerRef.current && !layerRef.current.contains(target)) {
        console.log('🔴 Broken: 点击外部关闭');
        onDismiss();
      }
    };

    // ❌ 问题：立即添加监听器，会捕获到当前正在进行的点击事件
    document.addEventListener('pointerdown', handlePointerDown, true); // 使用捕获阶段
    console.log('🔴 Broken: 立即添加了 pointerdown 监听器（捕获阶段）');

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      console.log('🔴 Broken: 移除了 pointerdown 监听器');
    };
  }, [isOpen, onDismiss]);

  // 将按钮引用传递给父组件
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      // 找到触发按钮并保存引用
      const triggerButton = document.querySelector('.broken-trigger-button') as HTMLButtonElement;
      if (triggerButton) {
        buttonRef.current = triggerButton;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="dismissable-overlay">
      <div ref={layerRef} className="dismissable-content broken">
        <h3>❌ 有问题的版本</h3>
        <p>立即添加监听器，在某些情况下会被同一个点击事件触发</p>
        <p><small>注意：这个问题在某些浏览器和事件处理方式下更明显</small></p>
        {children}
      </div>
    </div>
  );
}

// 正确的版本（使用 setTimeout）
function CorrectDismissableLayer({ 
  children, 
  onDismiss, 
  isOpen 
}: { 
  children: React.ReactNode; 
  onDismiss: () => void;
  isOpen: boolean;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (layerRef.current && !layerRef.current.contains(target)) {
        console.log('✅ Correct: 正确关闭 - 下一次点击才触发关闭');
        onDismiss();
      }
    };

    // ✅ 正确：延迟到下一个事件循环再添加监听器
    const timerId = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown);
      console.log('✅ Correct: 延迟添加了 pointerdown 监听器');
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      document.removeEventListener('pointerdown', handlePointerDown);
      console.log('✅ Correct: 移除了 pointerdown 监听器');
    };
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div className="dismissable-overlay">
      <div ref={layerRef} className="dismissable-content correct">
        <h3>✅ 正确的版本</h3>
        <p>延迟添加监听器，避免被同一个点击事件触发</p>
        {children}
      </div>
    </div>
  );
}

// 更直观的原生 DOM 演示
function NativeDOMDemo() {
  const [log, setLog] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLog = () => setLog([]);

  const createBrokenExample = () => {
    const container = document.createElement('div');
    container.className = 'native-demo-container broken';
    container.innerHTML = `
      <div class="native-demo-content">
        <h4>❌ 原生 DOM - 有问题的版本</h4>
        <p>点击这里会立即关闭</p>
        <button class="close-btn">关闭</button>
      </div>
    `;

    const handleClick = (e: Event) => {
      const target = e.target as Element;
      if (!container.querySelector('.native-demo-content')?.contains(target)) {
        addLog('🔴 原生DOM: 立即关闭 - 同一个点击事件触发');
        document.body.removeChild(container);
        document.removeEventListener('click', handleClick);
      }
    };

    // ❌ 立即添加监听器
    document.addEventListener('click', handleClick);
    addLog('🔴 原生DOM: 立即添加了点击监听器');

    container.querySelector('.close-btn')?.addEventListener('click', () => {
      document.body.removeChild(container);
      document.removeEventListener('click', handleClick);
      addLog('🔴 原生DOM: 手动关闭');
    });

    document.body.appendChild(container);
  };

  const createCorrectExample = () => {
    const container = document.createElement('div');
    container.className = 'native-demo-container correct';
    container.innerHTML = `
      <div class="native-demo-content">
        <h4>✅ 原生 DOM - 正确的版本</h4>
        <p>点击外部才会关闭</p>
        <button class="close-btn">关闭</button>
      </div>
    `;

    const handleClick = (e: Event) => {
      const target = e.target as Element;
      if (!container.querySelector('.native-demo-content')?.contains(target)) {
        addLog('✅ 原生DOM: 正确关闭 - 延迟添加的监听器');
        document.body.removeChild(container);
        document.removeEventListener('click', handleClick);
      }
    };

    // ✅ 延迟添加监听器
    setTimeout(() => {
      document.addEventListener('click', handleClick);
      addLog('✅ 原生DOM: 延迟添加了点击监听器');
    }, 0);

    container.querySelector('.close-btn')?.addEventListener('click', () => {
      document.body.removeChild(container);
      document.removeEventListener('click', handleClick);
      addLog('✅ 原生DOM: 手动关闭');
    });

    document.body.appendChild(container);
  };

  return (
    <div className="native-dom-demo">
      <h4>🔬 原生 DOM 演示</h4>
      <p>这个演示使用原生 DOM 操作，更容易看出 setTimeout 的作用</p>
      
      <div className="native-demo-buttons">
        <button 
          className="demo-button broken-button"
          onClick={createBrokenExample}
        >
          创建有问题的弹层
        </button>
        <button 
          className="demo-button correct-button"
          onClick={createCorrectExample}
        >
          创建正确的弹层
        </button>
        <button 
          className="demo-button"
          onClick={clearLog}
          style={{ background: '#6c757d' }}
        >
          清空日志
        </button>
      </div>

      <div className="event-log">
        <h5>📋 事件日志</h5>
        <div className="log-content">
          {log.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>暂无日志</p>
          ) : (
            log.map((entry, index) => (
              <div key={index} className="log-entry">
                {entry}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 主演示组件
function SetTimeoutDemo() {
  const [brokenOpen, setBrokenOpen] = useState(false);
  const [correctOpen, setCorrectOpen] = useState(false);

  const handleBrokenOpen = () => {
    console.log('🔴 点击打开有问题的版本');
    setBrokenOpen(true);
  };

  const handleCorrectOpen = () => {
    console.log('✅ 点击打开正确的版本');
    setCorrectOpen(true);
  };

  return (
    <div className="setTimeout-demo">
      <h2>setTimeout 在 DismissableLayer 中的作用</h2>
      
      <div className="demo-explanation">
        <h3>🎯 问题说明</h3>
        <p>
          当用户点击按钮打开 DismissableLayer 时，如果立即添加 pointerdown 监听器，
          在某些情况下（特别是使用原生 DOM 事件时），同一个点击事件可能会触发刚添加的监听器。
        </p>
        
        <h3>🔍 解决方案</h3>
        <p>
          使用 <code>setTimeout(fn, 0)</code> 将监听器的添加延迟到下一个事件循环，
          确保当前点击事件完全处理完毕后再添加监听器。
        </p>

        <div className="important-note">
          <h4>⚠️ 重要说明</h4>
          <p>
            在现代 React 中，由于合成事件系统的存在，这个问题可能不太明显。
            但在使用原生 DOM 事件或某些特殊情况下，这个问题仍然存在。
            Radix UI 使用 setTimeout 是为了确保在所有情况下都能正常工作。
          </p>
        </div>
      </div>

      {/* 原生 DOM 演示 - 更容易看出问题 */}
      <NativeDOMDemo />

      <div className="demo-buttons">
        <div className="demo-section">
          <h4>❌ React 版本（问题不明显）</h4>
          <p>在 React 中问题可能不太明显</p>
          <button 
            onClick={handleBrokenOpen}
            className="demo-button broken-button broken-trigger-button"
          >
            打开有问题的弹层
          </button>
        </div>

        <div className="demo-section">
          <h4>✅ 正确的版本</h4>
          <p>使用 setTimeout 延迟添加监听器</p>
          <button 
            onClick={handleCorrectOpen}
            className="demo-button correct-button"
          >
            打开正确的弹层
          </button>
        </div>
      </div>

      {/* 有问题的弹层 */}
      <BrokenDismissableLayer 
        isOpen={brokenOpen} 
        onDismiss={() => setBrokenOpen(false)}
      >
        <p>这个版本没有使用 setTimeout</p>
        <button onClick={() => setBrokenOpen(false)}>手动关闭</button>
      </BrokenDismissableLayer>

      {/* 正确的弹层 */}
      <CorrectDismissableLayer 
        isOpen={correctOpen} 
        onDismiss={() => setCorrectOpen(false)}
      >
        <p>这个版本使用了 setTimeout 延迟添加监听器</p>
        <button onClick={() => setCorrectOpen(false)}>手动关闭</button>
      </CorrectDismissableLayer>
</div>

)};

export default SetTimeoutDemo;