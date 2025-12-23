import { useRef, useEffect } from 'react';
import { bindLongPressEvents } from './setupEventPlugins';

export function useLongPress(handlers = {}) {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const cleanup = bindLongPressEvents(element, handlers);
    return cleanup;
  }, [handlers.onLongPress, handlers.onLongPressStart, handlers.onLongPressEnd]);
  
  return elementRef;
}