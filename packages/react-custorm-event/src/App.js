import React, { useState, useRef, useEffect } from 'react';
import { useLongPress } from './useLongPress';  // 导入自定义 Hook
import { bindLongPressEvents } from './setupEventPlugins';
import './style.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [pressTime, setPressTime] = useState(500);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pressCount, setPressCount] = useState(0);
  const [isPressing, setIsPressing] = useState(false);

  const buttonRef = useRef(null);
  const areaRef = useRef(null);
  const listRef = useRef(null);

  // 添加日志
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      { id: Date.now(), message, type, timestamp },
      ...prev.slice(0, 19) // 最多保留20条
    ]);
  };

  // 为按钮创建长按 ref
  const buttonLongPressRef = useLongPress({
    onLongPress: handleLongPress,
    onLongPressStart: handleLongPressStart,
    onLongPressEnd: handleLongPressEnd,
  });

  // 为区域创建长按 ref
  const areaLongPressRef = useLongPress({
    onLongPress: (e) => {
      addLog(`🎯 区域长按: (${Math.round(e.position.x)}, ${Math.round(e.position.y)})`, 'info');
    },
    onLongPressStart: (e) => {
      addLog(`📍 开始在区域按压`, 'warning');
    },
    onLongPressEnd: (e) => {
      const reason = e.reason === 'end' ? '释放' : '取消';
      addLog(`📍 区域长按结束: ${reason}`, 'info');
    },
  });

  // 长按事件处理器
  const handleLongPress = (e) => {
    addLog(`🔵 长按触发！持续了 ${e.duration}ms`, 'success');
    setPressCount(prev => prev + 1);
    setPosition({ x: e.position.x, y: e.position.y });

    // 显示一个波纹效果
    showRipple(e.position.x, e.position.y);
  };

  const handleLongPressStart = (e) => {
    addLog(`🟡 开始长按，位置: (${Math.round(e.position.x)}, ${Math.round(e.position.y)})`, 'warning');
    setIsPressing(true);
  };

  const handleLongPressEnd = (e) => {
    const reason = e.reason === 'end' ? '释放' : '取消';
    const result = e.wasLongPress ? '成功长按' : '未达到长按时间';
    addLog(`🔴 长按结束: ${reason}，${result}`, 'error');
    setIsPressing(false);
  };

  // 显示波纹效果
  const showRipple = (x, y) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x - 50}px`;
    ripple.style.top = `${y - 50}px`;

    document.getElementById('ripple-container').appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // 列表项的长按
  const handleListItemLongPress = (index) => (e) => {
    addLog(`📝 列表项 ${index + 1} 被长按`, 'info');
    e.persist(); // 模拟 React 的事件持久化

    // 可以在这里执行菜单操作
    setTimeout(() => {
      addLog(`✅ 对列表项 ${index + 1} 执行了操作`, 'success');
    }, 300);
  };

  // 使用 ref 手动绑定事件（模拟插件工作）
  useEffect(() => {
    if (buttonRef.current) {
      const cleanup = bindLongPressEvents(buttonRef.current, {
        onLongPress: handleLongPress,
        onLongPressStart: handleLongPressStart,
        onLongPressEnd: handleLongPressEnd,
      });

      return cleanup;
    }
  }, []);

  // 绑定区域事件
  useEffect(() => {
    if (areaRef.current) {
      const cleanup = bindLongPressEvents(areaRef.current, {
        onLongPress: (e) => {
          addLog(`🎯 区域长按: (${Math.round(e.position.x)}, ${Math.round(e.position.y)})`, 'info');
        },
        onLongPressStart: (e) => {
          addLog(`📍 开始在区域按压`, 'warning');
        },
      });

      return cleanup;
    }
  }, []);

  // 清空日志
  const clearLogs = () => {
    setLogs([]);
    setPressCount(0);
  };

  // 更新长按时间
  const updatePressTime = (e) => {
    const time = parseInt(e.target.value);
    setPressTime(time);

    // 在实际 React 插件中，可以这样配置
    if (window.LongPressEventPlugin) {
      window.LongPressEventPlugin.setLongPressThreshold(time);
    }

    addLog(`⚙️ 长按时间调整为 ${time}ms`, 'info');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔘 React 自定义长按事件插件</h1>
        <p>这是一个自定义 React 事件插件的完整示例</p>
      </header>

      <div className="container">
        <div className="demo-section">
          <h2>🎮 演示区域</h2>

          <div className="controls">
            <div className="control-group">
              <label>长按触发时间 (ms):</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={pressTime}
                onChange={updatePressTime}
              />
              <span>{pressTime}ms</span>
            </div>

            <div className="stats">
              <div className="stat">
                <span className="stat-label">长按次数:</span>
                <span className="stat-value">{pressCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">状态:</span>
                <span className={`stat-value ${isPressing ? 'pressing' : ''}`}>
                  {isPressing ? '按压中...' : '等待中'}
                </span>
              </div>
            </div>
          </div>

          <div className="demo-areas">
            <div className="demo-area">
              <h3>按钮长按</h3>
              <button
                ref={buttonRef}
                className={`demo-button ${isPressing ? 'pressing' : ''}`}
              >
                {isPressing ? '🟡 长按中...' : '🔵 长按我试试'}
              </button>
              <p className="demo-hint">按住鼠标或触摸 500ms 以上触发</p>
            </div>

            <div className="demo-area">
              <h3>区域长按</h3>
              <div
                ref={areaRef}
                className="press-area"
              >
                <div className="area-grid">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="grid-cell"></div>
                  ))}
                </div>
                <p className="area-text">在此区域任意位置长按</p>
              </div>
            </div>

            <div className="demo-area">
              <h3>列表项长按</h3>
              <div className="list-container" ref={listRef}>
                {['待办事项', '会议记录', '项目计划', '购物清单', '学习笔记'].map((item, index) => {
                  // 为每个列表项创建独立的长按 ref
                  const ListItem = React.memo(({ item, index }) => {
                    const listItemRef = useLongPress({
                      onLongPress: handleListItemLongPress(index),
                      onLongPressStart: () => {
                        addLog(`📌 开始长按列表项: ${item}`, 'warning');
                      },
                      onLongPressEnd: (e) => {
                        const reason = e.reason === 'end' ? '释放' : '取消';
                        addLog(`📌 列表项 "${item}" 长按结束: ${reason}`, 'info');
                      },
                    });

                    return (
                      <div
                        ref={listItemRef}
                        className="list-item"
                      >
                        <span className="list-icon">📋</span>
                        <span className="list-text">{item}</span>
                        <span className="list-hint">(长按操作)</span>
                      </div>
                    );
                  });

                  return <ListItem key={index} item={item} index={index} />;
                })}
              </div>
            </div>
          </div>

          <div className="position-display">
            <h3>最后长按位置</h3>
            <div className="position-coords">
              X: {position.x}, Y: {position.y}
            </div>
            <div
              className="position-marker"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                display: position.x > 0 ? 'block' : 'none'
              }}
            />
          </div>
        </div>

        <div className="log-section">
          <div className="log-header">
            <h2>📋 事件日志</h2>
            <button onClick={clearLogs} className="clear-button">
              清空日志
            </button>
          </div>

          <div className="log-container">
            {logs.length === 0 ? (
              <div className="empty-log">
                <p>👆 尝试长按上面的元素来查看事件日志</p>
                <p>事件流: onLongPressStart → onLongPress → onLongPressEnd</p>
              </div>
            ) : (
              <div className="log-list">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className={`log-item log-${log.type}`}
                  >
                    <span className="log-time">{log.timestamp}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-box">
            <h3>ℹ️ 插件工作原理</h3>
            <ul>
              <li>1. 监听 <code>mousedown</code> 和 <code>touchstart</code> 事件</li>
              <li>2. 启动计时器（默认 500ms）</li>
              <li>3. 跟踪指针移动，移动过大则取消</li>
              <li>4. 触发 <code>onLongPressStart</code> 事件</li>
              <li>5. 计时器到期触发 <code>onLongPress</code> 事件</li>
              <li>6. 释放时触发 <code>onLongPressEnd</code> 事件</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 波纹效果容器 */}
      <div id="ripple-container" className="ripple-container"></div>

      <footer className="app-footer">
        <p>React 自定义事件插件示例 | 长按事件实现</p>
        <p className="footer-note">
          注：这是一个教学示例，实际 React 插件需要集成到 React 事件系统中
        </p>
      </footer>
    </div>
  );
}

export default App;