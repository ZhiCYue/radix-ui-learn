/**
 * 简化修复版本 - 长按事件插件
 */

// 事件常量
const EventConstants = {
  topMouseDown: 'topMouseDown',
  topMouseUp: 'topMouseUp',
  topMouseMove: 'topMouseMove',
  topTouchStart: 'topTouchStart',
  topTouchEnd: 'topTouchEnd',
  topTouchMove: 'topTouchMove',
};

// 事件类型定义
const eventTypes = {
  longPress: {
    phasedRegistrationNames: {
      bubbled: 'onLongPress',
      captured: 'onLongPressCapture',
    },
    dependencies: [
      EventConstants.topMouseDown,
      EventConstants.topMouseUp,
      EventConstants.topMouseMove,
      EventConstants.topTouchStart,
      EventConstants.topTouchEnd,
      EventConstants.topTouchMove,
    ],
  },
  longPressStart: {
    phasedRegistrationNames: {
      bubbled: 'onLongPressStart',
      captured: 'onLongPressStartCapture',
    },
    dependencies: [
      EventConstants.topMouseDown,
      EventConstants.topTouchStart,
    ],
  },
  longPressEnd: {
    phasedRegistrationNames: {
      bubbled: 'onLongPressEnd',
      captured: 'onLongPressEndCapture',
    },
    dependencies: [
      EventConstants.topMouseUp,
      EventConstants.topMouseMove,
      EventConstants.topTouchEnd,
      EventConstants.topTouchMove,
    ],
  },
};

// 长按管理器
class LongPressManager {
  constructor() {
    this.presses = new Map();  // 使用普通 Map
    this.timers = new Map();   // 使用普通 Map
    this.counter = 0;
    this.threshold = 500;
    this.moveThreshold = 10;
  }

  // 开始长按
  start(targetInst, nativeEvent) {
    const id = this.generateId(targetInst, nativeEvent);
    
    const pressData = {
      id,
      targetInst,
      nativeEvent,
      startTime: Date.now(),
      startPos: this.getPosition(nativeEvent),
      hasMoved: false,
      hasFired: false,
      listeners: targetInst?.props || {},
    };
    
    this.presses.set(id, pressData);
    
    // 立即触发开始事件
    this.dispatch('longPressStart', pressData);
    
    // 设置计时器
    const timer = setTimeout(() => {
      if (!pressData.hasMoved && !pressData.hasFired) {
        this.dispatch('longPress', pressData);
        pressData.hasFired = true;
      }
    }, this.threshold);
    
    this.timers.set(id, timer);
    
    return id;
  }

  // 更新位置
  update(id, nativeEvent) {
    const pressData = this.presses.get(id);
    if (!pressData || pressData.hasMoved) return;
    
    const currentPos = this.getPosition(nativeEvent);
    const startPos = pressData.startPos;
    
    const dx = currentPos.x - startPos.x;
    const dy = currentPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > this.moveThreshold) {
      pressData.hasMoved = true;
      this.cancel(id);
    }
  }

  // 结束长按
  end(id, nativeEvent) {
    const pressData = this.presses.get(id);
    if (!pressData) return;
    
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    
    if (!pressData.hasFired && !pressData.hasMoved) {
      this.dispatch('longPress', pressData);
      pressData.hasFired = true;
    }
    
    this.dispatch('longPressEnd', { ...pressData, nativeEvent, reason: 'end' });
    this.presses.delete(id);
  }

  // 取消长按
  cancel(id) {
    const pressData = this.presses.get(id);
    if (!pressData) return;
    
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    
    this.dispatch('longPressEnd', { ...pressData, reason: 'cancel' });
    this.presses.delete(id);
  }

  // 获取当前活动的 press
  getActiveId(targetInst, nativeEvent) {
    const targetId = this.getTargetId(targetInst, nativeEvent);
    
    for (const [id, pressData] of this.presses.entries()) {
      if (pressData.targetInst === targetInst && 
          this.getEventKey(pressData.nativeEvent) === this.getEventKey(nativeEvent)) {
        return id;
      }
    }
    
    return null;
  }

  // 工具方法
  generateId(targetInst, nativeEvent) {
    return `${targetInst?._debugID || 'unknown'}-${this.getEventKey(nativeEvent)}-${this.counter++}`;
  }

  getEventKey(nativeEvent) {
    if (nativeEvent.type.includes('touch')) {
      return nativeEvent.touches?.[0]?.identifier || 'touch';
    }
    return 'mouse';
  }

  getTargetId(targetInst, nativeEvent) {
    return `${targetInst?._debugID || 'unknown'}-${this.getEventKey(nativeEvent)}`;
  }

  getPosition(event) {
    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  // 分发事件
  dispatch(eventType, pressData) {
    const { targetInst, listeners, startTime, startPos, nativeEvent } = pressData;
    
    const event = {
      type: eventType,
      nativeEvent,
      target: nativeEvent.target,
      currentTarget: nativeEvent.currentTarget,
      pressId: pressData.id,
      duration: Date.now() - startTime,
      position: this.getPosition(nativeEvent),
      startPos,
      reason: pressData.reason,
      wasLongPress: eventType === 'longPress' || pressData.hasFired,
    };
    
    // 调用相应的监听器
    const handlerName = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;
    const handler = listeners[handlerName];
    
    if (handler) {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in ${handlerName}:`, error);
      }
    }
  }
}

// 创建管理器实例
const manager = new LongPressManager();

// 主插件对象
const LongPressEventPlugin = {
  eventTypes,
  
  extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    switch (topLevelType) {
      case EventConstants.topMouseDown:
      case EventConstants.topTouchStart:
        manager.start(targetInst, nativeEvent);
        break;
        
      case EventConstants.topMouseMove:
      case EventConstants.topTouchMove:
        const activeId = manager.getActiveId(targetInst, nativeEvent);
        if (activeId) {
          manager.update(activeId, nativeEvent);
        }
        break;
        
      case EventConstants.topMouseUp:
      case EventConstants.topTouchEnd:
        const endId = manager.getActiveId(targetInst, nativeEvent);
        if (endId) {
          manager.end(endId, nativeEvent);
        }
        break;
    }
    
    return null; // 我们不返回合成事件，而是直接分发
  },
  
  // 配置方法
  setThreshold(ms) {
    manager.threshold = ms;
  },
  
  setMoveThreshold(pixels) {
    manager.moveThreshold = pixels;
  },
};

export default LongPressEventPlugin;