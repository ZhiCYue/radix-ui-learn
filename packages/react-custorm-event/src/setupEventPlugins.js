import LongPressEventPlugin from './LongPressEventPlugin';

export function createMockFiber(element, props = {}) {
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
    stateNode: element?.current || element,
  };
}

export function bindLongPressEvents(element, props) {
  let domElement;
  
  if (element && element.current) {
    domElement = element.current;
  } else if (element && element.addEventListener) {
    domElement = element;
  } else {
    console.warn('bindLongPressEvents: 无效的元素', element);
    return () => {};
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
  
  const fiber = createMockFiber(
    { type: domElement.tagName.toLowerCase(), current: domElement },
    { 
      ...props,
      _debugID: `element-${domElement.id || domElement.className || 'unknown'}`,
    }
  );
  
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
  
  domElement.addEventListener('mousedown', handleMouseDown);
  domElement.addEventListener('mouseup', handleMouseUp);
  domElement.addEventListener('mousemove', handleMouseMove);
  domElement.addEventListener('touchstart', handleTouchStart);
  domElement.addEventListener('touchend', handleTouchEnd);
  domElement.addEventListener('touchmove', handleTouchMove);
  
  return () => {
    domElement.removeEventListener('mousedown', handleMouseDown);
    domElement.removeEventListener('mouseup', handleMouseUp);
    domElement.removeEventListener('mousemove', handleMouseMove);
    domElement.removeEventListener('touchstart', handleTouchStart);
    domElement.removeEventListener('touchend', handleTouchEnd);
    domElement.removeEventListener('touchmove', handleTouchMove);
  };
}

if (typeof window !== 'undefined') {
  window.LongPressEventPlugin = LongPressEventPlugin;
  console.log('LongPressEventPlugin 已加载到全局');
}