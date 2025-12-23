/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

window.Schedule = {}

let exports = window.Schedule;

if ('process.env.NODE_ENV' !== 'production') {
  (function() {
    // 全局变量定义
    var taskQueue = [];           // 立即执行的任务队列（最小堆）
    var timerQueue = [];          // 延迟执行的任务队列（最小堆）
    var taskIdCounter = 1;        // 任务ID计数器
    var currentTask = null;       // 当前正在执行的任务
    var currentPriorityLevel = NormalPriority; // 当前优先级
    var isPerformingWork = false; // 是否正在执行工作
    var isHostCallbackScheduled = false; // 是否已调度主机回调
    var isHostTimeoutScheduled = false; // 是否已调度超时
    var needsPaint = false;       // 是否需要绘制
    var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
    var localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : null;
    var localSetImmediate = typeof setImmediate !== 'undefined' ? setImmediate : null;
    var isMessageLoopRunning = false; // 消息循环是否正在运行
    var taskTimeoutID = -1;       // 超时任务ID
    var frameInterval = 5;        // 每帧时间间隔（ms），默认5ms
    var startTime = -1;           // 当前任务批次开始时间

    // 优先级常量
    var ImmediatePriority = 1;     // 立即执行优先级
    var UserBlockingPriority = 2;  // 用户阻塞优先级
    var NormalPriority = 3;        // 普通优先级
    var LowPriority = 4;           // 低优先级
    var IdlePriority = 5;          // 空闲优先级

    // 超时时间常量
    var IMMEDIATE_PRIORITY_TIMEOUT = -1;       // 立即执行（永不等待）
    var USER_BLOCKING_PRIORITY_TIMEOUT = 250;  // 用户阻塞：250ms
    var NORMAL_PRIORITY_TIMEOUT = 5000;        // 普通：5s
    var LOW_PRIORITY_TIMEOUT = 10000;          // 低：10s
    var IDLE_PRIORITY_TIMEOUT = 1073741823;    // 空闲：最大31位整数（几乎永不过期）

    // ==================== 最小堆操作 ====================

    /**
     * 向堆中插入节点
     * @param {Array} heap 堆数组
     * @param {*} node 要插入的节点
     */
    function push(heap, node) {
      var index = heap.length;
      heap.push(node);
      siftUp(heap, node, index);
    }

    /**
     * 查看堆顶元素（不移除）
     * @param {Array} heap 堆数组
     * @return {*} 堆顶元素或null
     */
    function peek(heap) {
      return heap.length === 0 ? null : heap[0];
    }

    /**
     * 移除并返回堆顶元素
     * @param {Array} heap 堆数组
     * @return {*} 堆顶元素或null
     */
    function pop(heap) {
      if (heap.length === 0) {
        return null;
      }
      
      var first = heap[0];
      var last = heap.pop();
      
      if (last !== first) {
        heap[0] = last;
        siftDown(heap, last, 0);
      }
      
      return first;
    }

    /**
     * 比较两个节点
     * @param {*} a 节点A
     * @param {*} b 节点B
     * @return {number} 比较结果：负数表示a<b，0表示相等，正数表示a>b
     */
    function compare(a, b) {
      // 首先按sortIndex排序，然后按id排序
      var diff = a.sortIndex - b.sortIndex;
      return diff !== 0 ? diff : a.id - b.id;
    }

    /**
     * 节点上浮操作（插入后调整堆）
     * @param {Array} heap 堆数组
     * @param {*} node 节点
     * @param {number} i 节点索引
     */
    function siftUp(heap, node, i) {
      while (i > 0) {
        var parentIndex = (i - 1) >>> 1;  // 无符号右移1位，相当于 Math.floor((i-1)/2)
        var parent = heap[parentIndex];
        
        if (compare(parent, node) > 0) {
          // 父节点更大，交换
          heap[parentIndex] = node;
          heap[i] = parent;
          i = parentIndex;
        } else {
          break;
        }
      }
    }

    /**
     * 节点下沉操作（移除堆顶后调整堆）
     * @param {Array} heap 堆数组
     * @param {*} node 节点
     * @param {number} i 节点索引
     */
    function siftDown(heap, node, i) {
      var length = heap.length;
      var halfLength = length >>> 1; // 一半长度
      
      while (i < halfLength) {
        var leftIndex = 2 * i + 1;
        var left = heap[leftIndex];
        var rightIndex = leftIndex + 1;
        var right = heap[rightIndex];
        
        // 比较左子节点
        if (compare(left, node) < 0) {
          // 左子节点更小
          if (rightIndex < length && compare(right, left) < 0) {
            // 右子节点比左子节点更小
            heap[i] = right;
            heap[rightIndex] = node;
            i = rightIndex;
          } else {
            // 左子节点最小
            heap[i] = left;
            heap[leftIndex] = node;
            i = leftIndex;
          }
        } else if (rightIndex < length && compare(right, node) < 0) {
          // 右子节点更小
          heap[i] = right;
          heap[rightIndex] = node;
          i = rightIndex;
        } else {
          // 当前节点已经是最小的
          break;
        }
      }
    }

    // ==================== 核心调度逻辑 ====================

    /**
     * 将到期的定时器任务移到执行队列
     * @param {number} currentTime 当前时间
     */
    function advanceTimers(currentTime) {
      var timer = peek(timerQueue);
      
      while (timer !== null) {
        if (timer.callback === null) {
          // 任务被取消
          pop(timerQueue);
        } else if (timer.startTime <= currentTime) {
          // 定时器已到期，移到执行队列
          pop(timerQueue);
          timer.sortIndex = timer.expirationTime;
          push(taskQueue, timer);
        } else {
          // 定时器还未到期
          break;
        }
        timer = peek(timerQueue);
      }
    }

    /**
     * 处理超时回调
     * @param {number} currentTime 当前时间
     */
    function handleTimeout(currentTime) {
      isHostTimeoutScheduled = false;
      advanceTimers(currentTime);
      
      if (!isHostCallbackScheduled) {
        if (peek(taskQueue) !== null) {
          // 有任务需要执行
          isHostCallbackScheduled = true;
          if (!isMessageLoopRunning) {
            isMessageLoopRunning = true;
            schedulePerformWorkUntilDeadline();
          }
        } else {
          // 没有立即执行的任务，检查定时器
          var firstTimer = peek(timerQueue);
          if (firstTimer !== null) {
            requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
          }
        }
      }
    }

    /**
     * 判断是否应该让出主线程给浏览器
     * @return {boolean} 是否需要让出
     */
    function shouldYieldToHost() {
      if (needsPaint) {
        // 浏览器需要绘制，立即让出
        return true;
      }
      
      // 计算已执行的时间
      var timeElapsed = exports.unstable_now() - startTime;
      
      // 如果执行时间小于帧间隔，继续执行
      // 否则让出主线程
      return timeElapsed >= frameInterval;
    }

    /**
     * 请求主机超时回调
     * @param {Function} callback 回调函数
     * @param {number} ms 毫秒数
     */
    function requestHostTimeout(callback, ms) {
      taskTimeoutID = localSetTimeout(function() {
        callback(exports.unstable_now());
      }, ms);
    }

    /**
     * 核心工作循环：执行任务直到期限
     */
    function performWorkUntilDeadline() {
      needsPaint = false;
      
      if (isMessageLoopRunning) {
        var currentTime = exports.unstable_now();
        startTime = currentTime;
        var hasMoreWork = true;
        
        try {
          // 工作循环开始
          isHostCallbackScheduled = false;
          
          // 如果有超时调度，取消它
          if (isHostTimeoutScheduled) {
            isHostTimeoutScheduled = false;
            localClearTimeout(taskTimeoutID);
            taskTimeoutID = -1;
          }
          
          isPerformingWork = true;
          var previousPriorityLevel = currentPriorityLevel;
          
          try {
            // 将到期的定时器移到执行队列
            advanceTimers(currentTime);
            
            // 获取当前最高优先级任务
            currentTask = peek(taskQueue);
            
            // 执行任务循环
            while (
              currentTask !== null &&
              !(
                currentTask.expirationTime > currentTime &&
                shouldYieldToHost()
              )
            ) {
              var callback = currentTask.callback;
              
              if (typeof callback === 'function') {
                currentTask.callback = null;
                currentPriorityLevel = currentTask.priorityLevel;
                
                // 执行回调，传入是否超时标志
                var didTimeout = currentTask.expirationTime <= currentTime;
                var continuationCallback = callback(didTimeout);
                currentTime = exports.unstable_now();
                
                if (typeof continuationCallback === 'function') {
                  // 任务返回了延续回调（如并发渲染被中断）
                  currentTask.callback = continuationCallback;
                  advanceTimers(currentTime);
                  hasMoreWork = true;
                  break; // 跳出循环，让出主线程
                } else {
                  // 任务完成，从队列移除
                  if (currentTask === peek(taskQueue)) {
                    pop(taskQueue);
                  }
                  advanceTimers(currentTime);
                }
              } else {
                // 任务被取消
                pop(taskQueue);
              }
              
              // 获取下一个任务
              currentTask = peek(taskQueue);
            }
            
            if (currentTask !== null) {
              // 还有任务需要执行
              hasMoreWork = true;
            } else {
              // 所有任务执行完毕，检查定时器
              var firstTimer = peek(timerQueue);
              if (firstTimer !== null) {
                requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
              }
              hasMoreWork = false;
            }
          } finally {
            // 清理工作状态
            currentTask = null;
            currentPriorityLevel = previousPriorityLevel;
            isPerformingWork = false;
          }
        } finally {
          if (hasMoreWork) {
            // 还有更多工作，继续调度
            schedulePerformWorkUntilDeadline();
          } else {
            // 工作完成，停止消息循环
            isMessageLoopRunning = false;
          }
        }
      }
    }

    // ==================== 时间函数 ====================

    // 初始化时间函数
    if (typeof performance === 'object' && typeof performance.now === 'function') {
      var localPerformance = performance;
      exports.unstable_now = function() {
        return localPerformance.now();
      };
    } else {
      var localDate = Date;
      var initialTime = localDate.now();
      exports.unstable_now = function() {
        return localDate.now() - initialTime;
      };
    }

    // ==================== 调度器设置 ====================

    // 设置调度执行函数（使用最佳的API）
    var schedulePerformWorkUntilDeadline;
    
    if (typeof localSetImmediate === 'function') {
      // Node.js 环境：使用 setImmediate
      schedulePerformWorkUntilDeadline = function() {
        localSetImmediate(performWorkUntilDeadline);
      };
    } else if (typeof MessageChannel !== 'undefined') {
      // 现代浏览器：使用 MessageChannel（宏任务）
      var channel = new MessageChannel();
      var port = channel.port2;
      channel.port1.onmessage = performWorkUntilDeadline;
      schedulePerformWorkUntilDeadline = function() {
        port.postMessage(null);
      };
    } else {
      // 降级方案：使用 setTimeout
      schedulePerformWorkUntilDeadline = function() {
        localSetTimeout(performWorkUntilDeadline, 0);
      };
    }

    // ==================== 公共API ====================

    // 优先级常量导出
    exports.unstable_IdlePriority = IdlePriority;
    exports.unstable_ImmediatePriority = ImmediatePriority;
    exports.unstable_LowPriority = LowPriority;
    exports.unstable_NormalPriority = NormalPriority;
    exports.unstable_UserBlockingPriority = UserBlockingPriority;
    exports.unstable_Profiling = null; // 性能分析支持

    /**
     * 取消已调度的回调
     * @param {Object} task 任务对象
     */
    exports.unstable_cancelCallback = function(task) {
      task.callback = null;
    };

    /**
     * 强制设置帧率
     * @param {number} fps 帧率（0-125）
     */
    exports.unstable_forceFrameRate = function(fps) {
      if (fps < 0 || fps > 125) {
        console.error(
          'forceFrameRate takes a positive int between 0 and 125, ' +
          'forcing frame rates higher than 125 fps is not supported'
        );
      } else {
        frameInterval = fps > 0 ? Math.floor(1000 / fps) : 5;
      }
    };

    /**
     * 获取当前优先级
     * @return {number} 当前优先级
     */
    exports.unstable_getCurrentPriorityLevel = function() {
      return currentPriorityLevel;
    };

    /**
     * 以"下一个"优先级执行回调（通常比当前优先级低）
     * @param {Function} eventHandler 事件处理器
     * @return {*} 返回值
     */
    exports.unstable_next = function(eventHandler) {
      var priorityLevel;
      
      switch (currentPriorityLevel) {
        case ImmediatePriority:
        case UserBlockingPriority:
        case NormalPriority:
          priorityLevel = NormalPriority;
          break;
        default:
          priorityLevel = currentPriorityLevel;
      }
      
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };

    /**
     * 请求浏览器绘制（标记需要让出主线程）
     */
    exports.unstable_requestPaint = function() {
      needsPaint = true;
    };

    /**
     * 以指定优先级执行回调
     * @param {number} priorityLevel 优先级
     * @param {Function} eventHandler 事件处理器
     * @return {*} 返回值
     */
    exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
      // 验证优先级值
      switch (priorityLevel) {
        case ImmediatePriority:
        case UserBlockingPriority:
        case NormalPriority:
        case LowPriority:
        case IdlePriority:
          break;
        default:
          priorityLevel = NormalPriority;
      }
      
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };

    /**
     * 调度回调函数
     * @param {number} priorityLevel 优先级
     * @param {Function} callback 回调函数
     * @param {Object} [options] 选项
     * @param {number} [options.delay] 延迟时间（ms）
     * @return {Object} 任务对象
     */
    exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
      var currentTime = exports.unstable_now();
      var startTime;
      
      if (typeof options === 'object' && options !== null) {
        var delay = options.delay;
        if (typeof delay === 'number' && delay > 0) {
          startTime = currentTime + delay;
        } else {
          startTime = currentTime;
        }
      } else {
        startTime = currentTime;
      }
      
      // 根据优先级计算超时时间
      var timeout;
      switch (priorityLevel) {
        case ImmediatePriority:
          timeout = IMMEDIATE_PRIORITY_TIMEOUT;
          break;
        case UserBlockingPriority:
          timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
          break;
        case IdlePriority:
          timeout = IDLE_PRIORITY_TIMEOUT;
          break;
        case LowPriority:
          timeout = LOW_PRIORITY_TIMEOUT;
          break;
        default:
          timeout = NORMAL_PRIORITY_TIMEOUT;
      }
      
      var expirationTime = startTime + timeout;
      
      // 创建任务对象
      var newTask = {
        id: taskIdCounter++,
        callback: callback,
        priorityLevel: priorityLevel,
        startTime: startTime,
        expirationTime: expirationTime,
        sortIndex: -1
      };
      
      if (startTime > currentTime) {
        // 延迟任务：插入定时器队列
        newTask.sortIndex = startTime;
        push(timerQueue, newTask);
        
        // 如果执行队列为空，且这是第一个定时器
        if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
          if (isHostTimeoutScheduled) {
            // 取消现有超时
            localClearTimeout(taskTimeoutID);
            taskTimeoutID = -1;
          } else {
            isHostTimeoutScheduled = true;
          }
          // 调度超时回调
          requestHostTimeout(handleTimeout, startTime - currentTime);
        }
      } else {
        // 立即执行任务：插入执行队列
        newTask.sortIndex = expirationTime;
        push(taskQueue, newTask);
        
        // 如果没有调度，开始调度
        if (!isHostCallbackScheduled && !isPerformingWork) {
          isHostCallbackScheduled = true;
          if (!isMessageLoopRunning) {
            isMessageLoopRunning = true;
            schedulePerformWorkUntilDeadline();
          }
        }
      }
      
      return newTask;
    };

    /**
     * 判断是否应该让出主线程
     * @return {boolean} 是否应该让出
     */
    exports.unstable_shouldYield = shouldYieldToHost;

    /**
     * 包装回调函数以保持优先级
     * @param {Function} callback 回调函数
     * @return {Function} 包装后的函数
     */
    exports.unstable_wrapCallback = function(callback) {
      var parentPriorityLevel = currentPriorityLevel;
      
      return function() {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        
        try {
          return callback.apply(this, arguments);
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
    };

    // DevTools 集成
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === 'function'
    ) {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    }
    
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === 'function'
    ) {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }
  })();
}