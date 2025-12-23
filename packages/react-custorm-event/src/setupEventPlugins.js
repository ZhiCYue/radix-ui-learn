/**
 * React 事件插件注册器
 * 注：这需要 hack React 内部，只适用于开发学习
 */

import LongPressEventPlugin from './LongPressEventPlugin';

// 存储原始插件
let originalPlugins = null;
let originalPluginOrder = null;

// 简化版的 React 事件插件注册表
const EventPluginRegistry = {
  plugins: [],
  eventNameDispatchConfigs: {},
  registrationNameModules: {},
  
  injectEventPluginsByName(injectedNamesToPlugins) {
    for (const pluginName in injectedNamesToPlugins) {
      const pluginModule = injectedNamesToPlugins[pluginName];
      this.plugins.push(pluginModule);
      
      // 注册事件类型
      if (pluginModule.eventTypes) {
        for (const eventType in pluginModule.eventTypes) {
          const config = pluginModule.eventTypes[eventType];
          const phasedRegistrationNames = config.phasedRegistrationNames;
          
          // 注册冒泡和捕获阶段
          this.registrationNameModules[phasedRegistrationNames.bubbled] = pluginModule;
          this.registrationNameModules[phasedRegistrationNames.captured] = pluginModule;
          
          // 存储事件配置
          this.eventNameDispatchConfigs[eventType] = config;
        }
      }
    }
  },
};

// 尝试注入到 React 中（开发环境）
export function setupLongPressPlugin() {
  if (process.env.NODE_ENV === 'development') {
    try {
      // 方法1：通过全局对象注入
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const reactInternals = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
        if (reactInternals && reactInternals.eventPlugins) {
          reactInternals.eventPlugins.push(LongPressEventPlugin);
          console.log('LongPressEventPlugin 已注入到 React DevTools');
        }
      }
      
      // 方法2：直接修改 ReactDOM
      if (window.ReactDOM && window.ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
        const internals = window.ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        if (internals.Events && Array.isArray(internals.Events.plugins)) {
          internals.Events.plugins.push(LongPressEventPlugin);
          console.log('LongPressEventPlugin 已注入到 ReactDOM');
        }
      }
      
      // 方法3：使用我们的简化注册表
      EventPluginRegistry.injectEventPluginsByName({
        LongPressEventPlugin,
      });
      
      // 将注册表暴露到全局，供组件使用
      window.ReactEventPluginRegistry = EventPluginRegistry;
      
      console.log('长按事件插件已设置完成');
      return true;
    } catch (error) {
      console.warn('无法注入事件插件，使用模拟模式:', error);
      return false;
    }
  }
  return false;
}

// 模拟 React Fiber 节点（用于演示）
// 修改 createMockFiber 函数
export function createMockFiber(element, props = {}) {
  // 确保有有效的 _debugID
  const debugId = props._debugID || Math.random().toString(36).substr(2, 9);
  
  return {
    _debugID: debugId,
    type: element?.type || 'div',
    props: {
      ...props,
      children: element?.props?.children,
    },
    return: null,
    memoizedProps: props,
    // 添加 stateNode 引用到实际的 DOM 元素
    stateNode: element?.current || element,
  };
}


// 手动绑定事件的函数
export function bindLongPressEvents(element, props) {
  // 确保 element 是有效的 DOM 元素
  let domElement;
  
  if (element && element.current) {
    // 如果是 React ref 对象
    domElement = element.current;
  } else if (element && element.addEventListener) {
    // 如果是 DOM 元素
    domElement = element;
  } else {
    console.warn('bindLongPressEvents: 无效的元素', element);
    return () => {}; // 返回空的清理函数
  }
  
  if (!domElement || !domElement.addEventListener) {
    console.warn('bindLongPressEvents: 无法绑定事件到元素', domElement);
    return () => {};
  }
  
  const { 
    onLongPress, 
    onLongPressStart, 
    onLongPressEnd,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  } = props;
  
  // 创建模拟的 Fiber 节点，传入 element 和 props
  const fiber = createMockFiber(
    { type: domElement.tagName.toLowerCase(), current: domElement },
    { 
      ...props,
      _debugID: `element-${domElement.id || domElement.className || 'unknown'}`,
    }
  );
  
  // 手动绑定原生事件
  const handleMouseDown = (e) => {
    if (onMouseDown) onMouseDown(e);
    LongPressEventPlugin.extractEvents(
      'topMouseDown',
      fiber,
      e,
      e.currentTarget
    );
  };
  
  const handleMouseUp = (e) => {
    if (onMouseUp) onMouseUp(e);
    LongPressEventPlugin.extractEvents(
      'topMouseUp',
      fiber,
      e,
      e.currentTarget
    );
  };
  
  const handleMouseMove = (e) => {
    if (onMouseMove) onMouseMove(e);
    LongPressEventPlugin.extractEvents(
      'topMouseMove',
      fiber,
      e,
      e.currentTarget
    );
  };
  
  const handleTouchStart = (e) => {
    if (onTouchStart) onTouchStart(e);
    LongPressEventPlugin.extractEvents(
      'topTouchStart',
      fiber,
      e,
      e.currentTarget
    );
  };
  
  const handleTouchEnd = (e) => {
    if (onTouchEnd) onTouchEnd(e);
    LongPressEventPlugin.extractEvents(
      'topTouchEnd',
      fiber,
      e,
      e.currentTarget
    );
  };
  
  const handleTouchMove = (e) => {
    if (onTouchMove) onTouchMove(e);
    LongPressEventPlugin.extractEvents(
      'topTouchMove',
      fiber,
      e,
      e.currentTarget
    );
  };
  
  // 绑定事件
  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('mouseup', handleMouseUp);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchend', handleTouchEnd);
  element.addEventListener('touchmove', handleTouchMove);
  
  // 返回清理函数
  return () => {
    element.removeEventListener('mousedown', handleMouseDown);
    element.removeEventListener('mouseup', handleMouseUp);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
    element.removeEventListener('touchmove', handleTouchMove);
  };
}