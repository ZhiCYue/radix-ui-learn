const EventConstants = {
  topMouseDown: 'topMouseDown',
  topMouseUp: 'topMouseUp',
  topMouseMove: 'topMouseMove',
  topTouchStart: 'topTouchStart',
  topTouchEnd: 'topTouchEnd',
  topTouchMove: 'topTouchMove',
};

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

class LongPressManager {
  constructor() {
    this.presses = new Map();
    this.timers = new Map();
    this.counter = 0;
    this.config = {
      pressThreshold: 500,     // 长按阈值：500ms
      moveThreshold: 15,       // 移动阈值：15px
      maxTapTime: 200,         // 最大点击时间：200ms（短于这个算点击）
      debounceTime: 50,        // 防抖时间：50ms
      startDelay: 150,         // 开始事件延迟：150ms（避免快速点击触发开始事件）
    };
    this.lastEndTime = 0;      // 上次结束时间，用于防抖
  }

  handleEvent(type, targetInst, nativeEvent) {
    const pressId = this.getPressId(targetInst, nativeEvent);
    
    switch (type) {
      case 'start':
        return this.handleStart(pressId, targetInst, nativeEvent);
      case 'move':
        return this.handleMove(pressId, nativeEvent);
      case 'end':
        return this.handleEnd(pressId, nativeEvent);
      case 'cancel':
        return this.handleCancel(pressId, 'external');
      default:
        return null;
    }
  }

  handleStart(pressId, targetInst, nativeEvent) {
    const now = Date.now();
    
    // 防抖：避免快速连续点击
    if (now - this.lastEndTime < this.config.debounceTime) {
      console.log('防抖：忽略快速连续点击');
      return null;
    }
    
    this.cleanupPress(pressId);
    
    const pressData = {
      id: pressId,
      targetInst,
      startEvent: nativeEvent,
      startTime: now,
      startPos: this.getEventPosition(nativeEvent),
      lastPos: this.getEventPosition(nativeEvent),
      hasMoved: false,
      hasTriggeredLongPress: false,
      hasTriggeredStart: false,
      isLongPressCandidate: false, // 标记是否是长按候选
      state: 'pressing',
      listeners: targetInst?.props || {},
    };
    
    this.presses.set(pressId, pressData);
    
    // 关键修复：使用两个阶段检测
    // 阶段1：延迟触发开始事件（避免快速点击）
    const startDelayTimer = setTimeout(() => {
      const currentData = this.presses.get(pressId);
      if (currentData && currentData.state === 'pressing' && !currentData.hasMoved) {
        this.triggerLongPressStart(currentData);
        currentData.hasTriggeredStart = true;
        currentData.isLongPressCandidate = true; // 标记为可能的长按
      }
    }, this.config.startDelay);
    
    this.timers.set(`${pressId}-startDelay`, startDelayTimer);
    
    // 阶段2：长按检测（真正的长按阈值）
    const longPressTimer = setTimeout(() => {
      const currentData = this.presses.get(pressId);
      if (currentData && 
          currentData.state === 'pressing' && 
          !currentData.hasMoved &&
          currentData.isLongPressCandidate) { // 必须是通过了第一阶段检测
        // 只有真正长按了才触发长按事件
        this.triggerLongPress(currentData);
        currentData.hasTriggeredLongPress = true;
        currentData.state = 'longpressed';
      }
    }, this.config.pressThreshold);
    
    this.timers.set(`${pressId}-longpress`, longPressTimer);
    
    console.log(`开始按压检测: ID=${pressId}, 阈值=${this.config.pressThreshold}ms`);
    
    return pressId;
  }

  handleMove(pressId, nativeEvent) {
    const pressData = this.presses.get(pressId);
    if (!pressData) return false;
    
    const currentPos = this.getEventPosition(nativeEvent);
    const lastPos = pressData.lastPos;
    
    const dx = currentPos.x - lastPos.x;
    const dy = currentPos.y - lastPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    pressData.lastPos = currentPos;
    
    if (distance > this.config.moveThreshold) {
      pressData.hasMoved = true;
      pressData.isLongPressCandidate = false;
      this.cancelPress(pressId, 'movement');
      console.log(`按压取消: 移动了 ${distance.toFixed(1)}px > ${this.config.moveThreshold}px`);
      return true;
    }
    
    return false;
  }

  handleEnd(pressId, nativeEvent) {
    const pressData = this.presses.get(pressId);
    if (!pressData) {
      console.log('结束: 未找到按压数据');
      return null;
    }
    
    const endTime = Date.now();
    const duration = endTime - pressData.startTime;
    
    // 清理所有计时器
    this.cleanupTimers(pressId);
    
    // 更新最后结束时间
    this.lastEndTime = endTime;
    
    // 关键判断逻辑
    const isLongPress = pressData.hasTriggeredLongPress;
    const isTap = duration < this.config.maxTapTime && !pressData.hasMoved;
    
    console.log(`按压结束: 持续${duration}ms, 长按=${isLongPress}, 点击=${isTap}, 移动=${pressData.hasMoved}`);
    
    let eventType = 'release';
    
    if (isLongPress) {
      eventType = 'longpress';
      console.log('✅ 触发长按事件');
    } else if (isTap) {
      eventType = 'tap';
      console.log('👆 识别为点击，不触发长按');
    } else {
      console.log('⚠️  未达到长按阈值且不是点击');
    }
    
    // 触发长按结束事件
    this.triggerLongPressEnd(pressData, duration, nativeEvent, {
      wasLongPress: isLongPress,
      wasTap: isTap,
      reason: 'end',
      eventType,
    });
    
    this.presses.delete(pressId);
    
    return eventType;
  }

  handleCancel(pressId, reason = 'unknown') {
    const pressData = this.presses.get(pressId);
    if (!pressData) return;
    
    const duration = Date.now() - pressData.startTime;
    
    this.cleanupTimers(pressId);
    
    console.log(`按压取消: 原因=${reason}, 持续${duration}ms`);
    
    this.triggerLongPressEnd(pressData, duration, null, {
      wasLongPress: false,
      wasTap: false,
      reason,
      eventType: 'cancel',
    });
    
    this.presses.delete(pressId);
  }

  triggerLongPress(pressData) {
    if (pressData.hasTriggeredLongPress) return;
    
    const duration = Date.now() - pressData.startTime;
    
    // 额外安全检查
    if (duration < this.config.pressThreshold) {
      console.warn(`⚠️  长按事件被阻止: 持续时间${duration}ms < 阈值${this.config.pressThreshold}ms`);
      return;
    }
    
    const event = this.createSyntheticEvent(
      'longPress',
      pressData.targetInst,
      pressData.startEvent,
      {
        pressId: pressData.id,
        duration,
        position: pressData.lastPos,
        startPos: pressData.startPos,
        startTime: pressData.startTime,
      }
    );
    
    console.log(`🎯 触发长按: 持续${duration}ms`);
    
    this.dispatchToListeners(pressData.targetInst, event, 'onLongPress');
  }

  triggerLongPressStart(pressData) {
    const duration = Date.now() - pressData.startTime;
    
    // 防止太早触发开始事件
    if (duration < this.config.startDelay - 10) {
      console.log(`跳过开始事件: 太早了 ${duration}ms`);
      return;
    }
    
    const event = this.createSyntheticEvent(
      'longPressStart',
      pressData.targetInst,
      pressData.startEvent,
      {
        pressId: pressData.id,
        startTime: pressData.startTime,
        position: pressData.startPos,
      }
    );
    
    console.log(`🟡 触发长按开始: 持续${duration}ms`);
    
    this.dispatchToListeners(pressData.targetInst, event, 'onLongPressStart');
  }

  triggerLongPressEnd(pressData, duration, nativeEvent, options = {}) {
    const event = this.createSyntheticEvent(
      'longPressEnd',
      pressData.targetInst,
      nativeEvent || pressData.startEvent,
      {
        pressId: pressData.id,
        duration,
        position: this.getEventPosition(nativeEvent || pressData.startEvent),
        startPos: pressData.startPos,
        startTime: pressData.startTime,
        wasLongPress: options.wasLongPress || false,
        wasTap: options.wasTap || false,
        reason: options.reason || 'unknown',
        eventType: options.eventType || 'end',
      }
    );
    
    console.log(`🔴 触发长按结束: 持续${duration}ms, 类型=${options.eventType}`);
    
    this.dispatchToListeners(pressData.targetInst, event, 'onLongPressEnd');
  }

  cleanupTimers(pressId) {
    ['startDelay', 'longpress'].forEach(type => {
      const timerKey = `${pressId}-${type}`;
      const timer = this.timers.get(timerKey);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(timerKey);
      }
    });
  }

  cleanupPress(pressId) {
    this.cleanupTimers(pressId);
    this.presses.delete(pressId);
  }

  getPressId(targetInst, nativeEvent) {
    const identifier = this.getEventIdentifier(nativeEvent);
    const targetId = targetInst?._debugID || 'unknown';
    return `${targetId}-${identifier}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getEventIdentifier(nativeEvent) {
    if (nativeEvent.type.includes('touch')) {
      return nativeEvent.touches?.[0]?.identifier || `touch-${Date.now()}`;
    }
    return 'mouse';
  }

  getEventPosition(event) {
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

  createSyntheticEvent(eventType, targetInst, nativeEvent, extraData = {}) {
    return {
      type: eventType,
      nativeEvent,
      target: nativeEvent?.target || null,
      currentTarget: nativeEvent?.currentTarget || null,
      ...extraData,
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {},
      preventDefault() {
        if (nativeEvent?.preventDefault) {
          nativeEvent.preventDefault();
        }
        this.defaultPrevented = true;
      },
      stopPropagation() {
        if (nativeEvent?.stopPropagation) {
          nativeEvent.stopPropagation();
        }
        this.isPropagationStopped = () => true;
      },
      timestamp: Date.now(),
    };
  }

  dispatchToListeners(targetInst, event, handlerName) {
    if (!targetInst || !targetInst.props) return;
    
    const handler = targetInst.props[handlerName];
    
    if (handler && typeof handler === 'function') {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in ${handlerName}:`, error);
      }
    }
  }

  setPressThreshold(ms) {
    this.config.pressThreshold = Math.max(100, ms);
    console.log(`长按阈值设置为: ${ms}ms`);
  }

  setMoveThreshold(pixels) {
    this.config.moveThreshold = Math.max(1, pixels);
    console.log(`移动阈值设置为: ${pixels}px`);
  }

  setMaxTapTime(ms) {
    this.config.maxTapTime = Math.max(50, ms);
    console.log(`最大点击时间设置为: ${ms}ms`);
  }

  setDebounceTime(ms) {
    this.config.debounceTime = Math.max(0, ms);
    console.log(`防抖时间设置为: ${ms}ms`);
  }

  setStartDelay(ms) {
    this.config.startDelay = Math.max(0, ms);
    console.log(`开始延迟设置为: ${ms}ms`);
  }
}

const longPressManager = new LongPressManager();

const LongPressEventPlugin = {
  eventTypes,
  
  extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    const eventMap = {
      [EventConstants.topMouseDown]: 'mousedown',
      [EventConstants.topMouseUp]: 'mouseup',
      [EventConstants.topMouseMove]: 'mousemove',
      [EventConstants.topTouchStart]: 'touchstart',
      [EventConstants.topTouchEnd]: 'touchend',
      [EventConstants.topTouchMove]: 'touchmove',
    };
    
    const eventType = eventMap[topLevelType];
    if (!eventType) return null;
    
    let managerEventType;
    
    switch (topLevelType) {
      case EventConstants.topMouseDown:
      case EventConstants.topTouchStart:
        managerEventType = 'start';
        break;
      case EventConstants.topMouseMove:
      case EventConstants.topTouchMove:
        managerEventType = 'move';
        break;
      case EventConstants.topMouseUp:
      case EventConstants.topTouchEnd:
        managerEventType = 'end';
        break;
      default:
        return null;
    }
    
    const result = longPressManager.handleEvent(managerEventType, targetInst, nativeEvent);
    
    return null;
  },
  
  setPressThreshold(ms) {
    longPressManager.setPressThreshold(ms);
  },
  
  setMoveThreshold(pixels) {
    longPressManager.setMoveThreshold(pixels);
  },
  
  setMaxTapTime(ms) {
    longPressManager.setMaxTapTime(ms);
  },
  
  setDebounceTime(ms) {
    longPressManager.setDebounceTime(ms);
  },
  
  setStartDelay(ms) {
    longPressManager.setStartDelay(ms);
  },
  
  getState() {
    return {
      activePresses: Array.from(longPressManager.presses.entries()).map(([id, data]) => ({
        id,
        duration: Date.now() - data.startTime,
        hasMoved: data.hasMoved,
        hasTriggeredLongPress: data.hasTriggeredLongPress,
        isLongPressCandidate: data.isLongPressCandidate,
        state: data.state,
      })),
      config: { ...longPressManager.config },
    };
  },
  
  reset() {
    for (const pressId of longPressManager.presses.keys()) {
      longPressManager.cleanupPress(pressId);
    }
    
    longPressManager.counter = 0;
    longPressManager.lastEndTime = 0;
  },
  
  // 调试方法
  debug() {
    return {
      config: longPressManager.config,
      activePresses: Array.from(longPressManager.presses.entries()).length,
      lastEndTime: longPressManager.lastEndTime,
    };
  },
};

export default LongPressEventPlugin;