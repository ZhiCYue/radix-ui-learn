import { useRef, useEffect } from 'react';
import { bindLongPressEvents } from './setupEventPlugins';

/**
 * 自定义 Hook：为元素添加长按事件支持
 * @param {Object} handlers - 事件处理器
 * @param {Function} handlers.onLongPress - 长按触发
 * @param {Function} handlers.onLongPressStart - 长按开始
 * @param {Function} handlers.onLongPressEnd - 长按结束
 * @returns {Object} ref - 需要绑定到元素的 ref
 */
export function useLongPress(handlers = {}) {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // 绑定长按事件
    const cleanup = bindLongPressEvents(element, handlers);
    
    return cleanup;
  }, [handlers.onLongPress, handlers.onLongPressStart, handlers.onLongPressEnd]);
  
  return elementRef;
}