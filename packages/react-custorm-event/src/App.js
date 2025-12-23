import React, { useState, useRef, useEffect, useCallback } from 'react';
import { bindLongPressEvents } from './setupEventPlugins';
import './styles.css';

function useLongPress(elementRef, handlers = {}) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = bindLongPressEvents(element, handlers);
    return cleanup;
  }, [elementRef, handlers]);
}

const ListItem = React.memo(({ item, index, onLongPress, onLongPressStart, onLongPressEnd }) => {
  const itemRef = useRef(null);

  useLongPress(itemRef, {
    onLongPress,
    onLongPressStart,
    onLongPressEnd,
  });

  return (
    <div ref={itemRef} className="list-item">
      <span className="list-icon">📋</span>
      <span className="list-text">{item}</span>
      <span className="list-hint">(长按操作)</span>
    </div>
  );
});

ListItem.displayName = 'ListItem';

function App() {
  const [logs, setLogs] = useState([]);
  const [pressTime, setPressTime] = useState(500);
  const [moveThreshold, setMoveThreshold] = useState(15);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pressCount, setPressCount] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [currentPressTime, setCurrentPressTime] = useState(0);
  const [pluginReady, setPluginReady] = useState(false);

  const buttonRef = useRef(null);
  const areaRef = useRef(null);
  const rippleContainerRef = useRef(null);
  const pressTimerRef = useRef(null);
  const pluginCheckRef = useRef(null);
  const logIdCounterRef = useRef(0);

  useEffect(() => {
    if (pluginCheckRef.current) {
      clearInterval(pluginCheckRef.current);
    }

    pluginCheckRef.current = setInterval(() => {
      if (window.LongPressEventPlugin) {
        setPluginReady(true);
        clearInterval(pluginCheckRef.current);
      }
    }, 100);

    return () => {
      if (pluginCheckRef.current) {
        clearInterval(pluginCheckRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (pluginReady && window.LongPressEventPlugin) {
      if (window.LongPressEventPlugin.setPressThreshold) {
        window.LongPressEventPlugin.setPressThreshold(pressTime);
      }
      if (window.LongPressEventPlugin.setMoveThreshold) {
        window.LongPressEventPlugin.setMoveThreshold(moveThreshold);
      }
      if (window.LongPressEventPlugin.setMaxTapTime) {
        window.LongPressEventPlugin.setMaxTapTime(200); // 设置为200ms
      }
      if (window.LongPressEventPlugin.setStartDelay) {
        window.LongPressEventPlugin.setStartDelay(100); // 设置开始事件延迟
      }
    }
  }, [pressTime, moveThreshold, pluginReady]);

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    logIdCounterRef.current += 1;
    const newId = logIdCounterRef.current;

    setLogs(prev => [
      { id: newId, message, type, timestamp },
      ...prev.slice(0, 19)
    ]);
  }, []);

  const handleLongPress = useCallback((e) => {
    const duration = e.duration || 0;
    addLog(`🔵 长按触发！持续了 ${duration}ms`, 'success');
    setPressCount(prev => prev + 1);
    setPosition({ x: e.position.x, y: e.position.y });
  }, [addLog]);

  const handleLongPressStart = useCallback((e) => {
    addLog(`🟡 开始长按，位置: (${Math.round(e.position.x)}, ${Math.round(e.position.y)})`, 'warning');
    setIsPressing(true);

    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
    }

    const startTime = Date.now();
    pressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setCurrentPressTime(elapsed);
    }, 50);
  }, [addLog]);

  const handleLongPressEnd = useCallback((e) => {
    const reason = e.reason === 'end' ? '释放' : e.reason || '未知';
    const result = e.wasLongPress ? '成功长按' : '未达到长按时间';
    const duration = e.duration || 0;

    let logMessage = `🔴 长按结束: ${reason}，${result}`;
    if (duration > 0) {
      logMessage += `，持续 ${duration}ms`;
    }

    addLog(logMessage, e.wasLongPress ? 'success' : 'error');
    setIsPressing(false);
    setCurrentPressTime(0);

    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, [addLog]);

  const handleAreaLongPress = useCallback((e) => {
    const duration = e.duration || 0;
    addLog(`🎯 区域长按: (${Math.round(e.position.x)}, ${Math.round(e.position.y)})，持续 ${duration}ms`, 'info');
  }, [addLog]);

  const handleAreaLongPressStart = useCallback((e) => {
    addLog(`📍 开始在区域按压`, 'warning');
  }, [addLog]);

  const handleAreaLongPressEnd = useCallback((e) => {
    const reason = e.reason === 'end' ? '释放' : '取消';
    const result = e.wasLongPress ? '长按成功' : '未长按';
    addLog(`📍 区域长按结束: ${reason}，${result}`, 'info');
  }, [addLog]);

  const handleListItemLongPress = useCallback((index) => (e) => {
    const itemName = ['待办事项', '会议记录', '项目计划', '购物清单', '学习笔记'][index];
    const duration = e.duration || 0;
    addLog(`📝 列表项 "${itemName}" 被长按，持续 ${duration}ms`, 'info');

    setTimeout(() => {
      addLog(`✅ 对列表项 "${itemName}" 执行了操作`, 'success');
    }, 300);
  }, [addLog]);

  const handleListItemLongPressStart = useCallback((index) => {
    const itemName = ['待办事项', '会议记录', '项目计划', '购物清单', '学习笔记'][index];
    addLog(`📌 开始长按列表项: ${itemName}`, 'warning');
  }, [addLog]);

  const handleListItemLongPressEnd = useCallback((index) => (e) => {
    const itemName = ['待办事项', '会议记录', '项目计划', '购物清单', '学习笔记'][index];
    const reason = e.reason === 'end' ? '释放' : '取消';
    const result = e.wasLongPress ? '长按成功' : '快速点击';
    addLog(`📌 列表项 "${itemName}" ${reason}: ${result}`, 'info');
  }, [addLog]);

  useEffect(() => {
    if (buttonRef.current) {
      const cleanup = bindLongPressEvents(buttonRef.current, {
        onLongPress: handleLongPress,
        onLongPressStart: handleLongPressStart,
        onLongPressEnd: handleLongPressEnd,
      });

      return cleanup;
    }
  }, [handleLongPress, handleLongPressStart, handleLongPressEnd]);

  useEffect(() => {
    if (areaRef.current) {
      const cleanup = bindLongPressEvents(areaRef.current, {
        onLongPress: handleAreaLongPress,
        onLongPressStart: handleAreaLongPressStart,
        onLongPressEnd: handleAreaLongPressEnd,
      });

      return cleanup;
    }
  }, [handleAreaLongPress, handleAreaLongPressStart, handleAreaLongPressEnd]);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearInterval(pressTimerRef.current);
      }
      if (pluginCheckRef.current) {
        clearInterval(pluginCheckRef.current);
      }
    };
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setPressCount(0);
    addLog('📋 日志已清空', 'info');
  }, [addLog]);

  const updatePressTime = useCallback((e) => {
    const time = parseInt(e.target.value);
    setPressTime(time);

    if (pluginReady && window.LongPressEventPlugin?.setPressThreshold) {
      window.LongPressEventPlugin.setPressThreshold(time);
    }

    addLog(`⚙️ 长按时间调整为 ${time}ms`, 'info');
  }, [addLog, pluginReady]);

  const updateMoveThreshold = useCallback((e) => {
    const threshold = parseInt(e.target.value);
    setMoveThreshold(threshold);

    if (pluginReady && window.LongPressEventPlugin?.setMoveThreshold) {
      window.LongPressEventPlugin.setMoveThreshold(threshold);
    }

    addLog(`⚙️ 移动阈值调整为 ${threshold}px`, 'info');
  }, [addLog, pluginReady]);

  const testQuickTap = useCallback(() => {
    addLog('👆 测试：请快速点击按钮（短于300ms）', 'warning');
    addLog('💡 快速点击应该不会触发长按事件', 'info');
  }, [addLog]);

  const testMoveCancel = useCallback(() => {
    addLog('🔄 测试：请按住按钮并移动鼠标/手指', 'warning');
    addLog('💡 移动超过阈值应该会取消长按', 'info');
  }, [addLog]);

  const resetState = useCallback(() => {
    setIsPressing(false);
    setCurrentPressTime(0);
    setPosition({ x: 0, y: 0 });

    if (window.LongPressEventPlugin?.reset) {
      window.LongPressEventPlugin.reset();
      addLog('🔄 长按插件状态已重置', 'info');
    }
  }, [addLog]);

  const showRipple = useCallback((x, y) => {
    if (!rippleContainerRef.current) return;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x - 50}px`;
    ripple.style.top = `${y - 50}px`;

    rippleContainerRef.current.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 600);
  }, []);

  // 在 App.js 中添加调试方法
  const debugPlugin = useCallback(() => {
    if (window.LongPressEventPlugin) {
      const state = window.LongPressEventPlugin.getState();
      const debug = window.LongPressEventPlugin.debug?.();
      console.log('插件状态:', state);
      console.log('调试信息:', debug);

      addLog(`🔍 插件调试: ${state.activePresses.length} 个活动按压`, 'info');
      addLog(`⚙️ 配置: 长按${state.config.pressThreshold}ms, 点击${state.config.maxTapTime}ms`, 'info');
    } else {
      addLog('❌ 插件未加载', 'error');
    }
  }, [addLog]);

  const listItems = ['待办事项', '会议记录', '项目计划', '购物清单', '学习笔记'];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔘 React 自定义长按事件插件</h1>
        <p>修复版 - 插件状态: {pluginReady ? '✅ 已就绪' : '🔄 加载中...'}</p>
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
                disabled={!pluginReady}
              />
              <span className="control-value">{pressTime}ms</span>
            </div>

            <div className="control-group">
              <label>移动取消阈值 (px):</label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={moveThreshold}
                onChange={updateMoveThreshold}
                disabled={!pluginReady}
              />
              <span className="control-value">{moveThreshold}px</span>
            </div>

            <div className="stats">
              <div className="stat">
                <span className="stat-label">长按次数:</span>
                <span className="stat-value">{pressCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">按压时间:</span>
                <span className={`stat-value ${isPressing ? 'pressing' : ''}`}>
                  {isPressing ? `${currentPressTime}ms` : '0ms'}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">插件状态:</span>
                <span className={`stat-value ${pluginReady ? 'ready' : 'loading'}`}>
                  {pluginReady ? '✅ 就绪' : '🔄 加载'}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={testQuickTap} className="action-button secondary">
                测试快速点击
              </button>
              <button onClick={testMoveCancel} className="action-button secondary">
                测试移动取消
              </button>
              <button onClick={debugPlugin} className="action-button secondary">
                插件调试
              </button>
              <button onClick={resetState} className="action-button warning">
                重置状态
              </button>
            </div>
          </div>

          <div className="demo-areas">
            <div className="demo-area">
              <h3>按钮长按测试</h3>
              <button
                ref={buttonRef}
                className={`demo-button ${isPressing ? 'pressing' : ''}`}
              >
                {isPressing ? (
                  <>
                    <span className="pressing-icon">🟡</span>
                    <span>长按中... ({currentPressTime}ms/{pressTime}ms)</span>
                  </>
                ) : (
                  <>
                    <span className="button-icon">🔵</span>
                    <span>长按我试试</span>
                  </>
                )}
              </button>
              <p className="demo-hint">
                按住鼠标或触摸 {pressTime}ms 以上触发长按，{moveThreshold}px 内移动有效
              </p>
            </div>

            <div className="demo-area">
              <h3>区域长按测试</h3>
              <div
                ref={areaRef}
                className="press-area"
              >
                <div className="area-grid">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={`grid-${Date.now()}-${i}`} className="grid-cell"></div>
                  ))}
                </div>
                <p className="area-text">在此区域任意位置长按</p>
                <div className="area-threshold-indicator">
                  移动阈值: {moveThreshold}px
                </div>
              </div>
              <p className="demo-hint">
                网格区域内任意位置长按，移动超过阈值会取消
              </p>
            </div>

            <div className="demo-area">
              <h3>列表项长按测试</h3>
              <div className="list-container">
                {listItems.map((item, index) => (
                  <ListItem
                    key={`list-item-${index}`}
                    item={item}
                    index={index}
                    onLongPress={handleListItemLongPress(index)}
                    onLongPressStart={() => handleListItemLongPressStart(index)}
                    onLongPressEnd={handleListItemLongPressEnd(index)}
                  />
                ))}
              </div>
              <p className="demo-hint">
                长按列表项进行操作，快速点击不会触发长按
              </p>
            </div>
          </div>

          <div className="position-display">
            <h3>最后长按位置</h3>
            <div className="position-coords">
              X: {Math.round(position.x)}, Y: {Math.round(position.y)}
            </div>
            <div className="position-info">
              距离触发: {pressTime}ms | 移动限制: {moveThreshold}px
            </div>
            <div
              className="position-marker"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                display: position.x > 0 && position.y > 0 ? 'block' : 'none'
              }}
            />
          </div>
        </div>

        <div className="log-section">
          <div className="log-header">
            <h2>📋 事件日志</h2>
            <div className="log-actions">
              <button onClick={clearLogs} className="clear-button">
                清空日志
              </button>
              <span className="log-count">
                共 {logs.length} 条记录
              </span>
            </div>
          </div>

          <div className="log-container">
            {logs.length === 0 ? (
              <div className="empty-log">
                <div className="empty-icon">📋</div>
                <p className="empty-title">👆 开始测试长按事件</p>
                <p className="empty-subtitle">事件流: onLongPressStart → onLongPress → onLongPressEnd</p>
                <div className="empty-tips">
                  <p>💡 提示：</p>
                  <ul>
                    <li>快速点击（小于300ms）不会触发长按</li>
                    <li>移动超过阈值会取消长按</li>
                    <li>长按时间可在上方调整</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="log-list">
                {logs.map(log => (
                  <div
                    key={`log-${log.id}-${log.timestamp}`}
                    className={`log-item log-${log.type}`}
                  >
                    <span className="log-time">{log.timestamp}</span>
                    <span className="log-message">{log.message}</span>
                    {log.type === 'success' && <span className="log-badge">✓</span>}
                    {log.type === 'warning' && <span className="log-badge">⚠</span>}
                    {log.type === 'error' && <span className="log-badge">✗</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-box">
            <h3>ℹ️ 修复说明</h3>
            <div className="fix-list">
              <div className="fix-item success">
                <span className="fix-icon">✓</span>
                <span className="fix-text">修复了短时间点击误触发长按的问题</span>
              </div>
              <div className="fix-item success">
                <span className="fix-icon">✓</span>
                <span className="fix-text">添加了点击检测（300ms内算点击）</span>
              </div>
              <div className="fix-item success">
                <span className="fix-icon">✓</span>
                <span className="fix-text">优化了防抖机制（150ms防抖）</span>
              </div>
              <div className="fix-item success">
                <span className="fix-icon">✓</span>
                <span className="fix-text">修复了 WeakMap 键类型错误</span>
              </div>
              <div className="fix-item">
                <span className="fix-icon">⚙️</span>
                <span className="fix-text">当前配置：长按 {pressTime}ms，移动 {moveThreshold}px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={rippleContainerRef}
        id="ripple-container"
        className="ripple-container"
      ></div>

      <footer className="app-footer">
        <p>React 自定义长按事件插件 - 修复版本 | 长按时间: {pressTime}ms | 移动阈值: {moveThreshold}px</p>
        <p className="footer-note">
          注：已修复短时间点击误触发的问题，快速点击（小于300ms）不会触发长按事件
        </p>
      </footer>
    </div>
  );
}

export default App;