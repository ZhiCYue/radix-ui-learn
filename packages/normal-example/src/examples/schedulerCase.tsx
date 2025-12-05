import React from "react";
import {
  unstable_NormalPriority as NormalPriority,
  unstable_runWithPriority as runWithPriority,
  unstable_UserBlockingPriority as UserBlockingPriority,
  unstable_ImmediatePriority as ImmediatePriority,
  unstable_scheduleCallback as scheduleCallback,
  unstable_LowPriority as LowPriority, // 低优先级任务
  unstable_IdlePriority as IdlePriority, // 空闲优先级任务
  unstable_getCurrentPriorityLevel as getCurrentPriorityLevel,
} from "scheduler";

// 为 runWithNormalPriority 指定函数参数类型
const runWithNormalPriority: (fn: () => void) => void = runWithPriority
  ? (fn) => {
      try {
        runWithPriority(NormalPriority, fn);
      } catch (e) {
        // e 是 unknown, 需要类型断言
        if (e instanceof Error && e.message === "Not implemented.") {
          fn();
        } else {
          throw e;
        }
      }
    }
  : (fn) => fn();

const SchedulerCase: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleClick = () => {
    setMessage("正在处理耗时任务...");
    runWithNormalPriority(() => {
      setCount((count) => count + 1);
      // 模拟一个耗时任务
      let i = 0;
      while (i < 1000000000) {
        i++;
      }
      setMessage(null);
    });
    runWithPriority(ImmediatePriority, () => {
      setMessage("正在处理耗时任务...");
    });

    runWithPriority(IdlePriority, () => {
      // 模拟一个耗时任务
      let i = 0;
      while (i < 1000000000) {
        i++;
      }
      setCount((count) => count + 1);
      setMessage(null);
    });
  };

  const handleClick2 = () => {
    // 1. 使用 NormalPriority 作为参数
    scheduleCallback(NormalPriority, () => {
      console.log("这个任务以正常优先级执行");
    });

    // 更新注释：这里的 runWithPriority 在本click处理中，没卵用
    runWithPriority(ImmediatePriority, () => {
      scheduleCallback(NormalPriority, () => {
        // 即使在外层是 ImmediatePriority，这里仍然明确指定 NormalPriority
        console.log("明确指定优先级");
      });

      scheduleCallback(ImmediatePriority, () => {
        // 没有指定优先级，会使用当前上下文的 ImmediatePriority
        console.log("使用当前上下文优先级");
      });
    });
  };

  // 假设的函数：内部进行调度但没有明确优先级参数
  function scheduleUrgentUpdate() {
    // 注意：这里调用的是 scheduleCallback 但可能使用当前上下文优先级
    // 或者调用其他内部API，这些API会读取 currentPriorityLevel

    // 方式A：使用不指定优先级的旧API（如果存在）
    // unstable_scheduleCallback(() => {
    //   console.log('紧急更新任务');
    // });

    // 方式B：React内部常见的模式
    const currentPriority = getCurrentPriorityLevel();
    // 根据当前优先级做决策
    if (currentPriority === ImmediatePriority) {
      // 立即执行某些操作
      console.log("检测到立即优先级上下文，执行特殊逻辑");
    }

    // 方式C：传递当前优先级给 scheduleCallback
    scheduleCallback(currentPriority, () => {
      console.log("4 任务X: 使用当前上下文优先级 (ImmediatePriority)");
    });
  }

  const handleClick3 = () => {
    console.log("1. 初始优先级:", getCurrentPriorityLevel()); // NormalPriority (3)

    // 创建第一个任务（明确指定 LowPriority）
    scheduleCallback(LowPriority, () => {
      console.log("7. 任务A: 低优先级任务");
    });

    // 使用 runWithPriority 创建高优先级上下文
    runWithPriority(ImmediatePriority, () => {
      console.log("2. runWithPriority 内部优先级:", getCurrentPriorityLevel()); // ImmediatePriority (1)

      // 场景A：调用没有优先级参数的函数（内部会 scheduleCallback）
      scheduleUrgentUpdate(); // 这个函数内部使用当前上下文优先级

      // 场景B：明确指定不同优先级
      scheduleCallback(UserBlockingPriority, () => {
        console.log("5. 任务B: 用户阻塞优先级任务");
      });
    });

    console.log("3. 恢复后优先级:", getCurrentPriorityLevel()); // NormalPriority (3)

    // 创建最后一个任务
    scheduleCallback(NormalPriority, () => {
      console.log("6. 任务C: 普通优先级任务");
    });
  };

  return (
    <>
      <p>count: {count}</p>
      <button onClick={handleClick}>点击</button>
      {message && <p>{message}</p>}
      <button onClick={handleClick2}>点击2</button>
      <button onClick={handleClick3}>点击3</button>
    </>
  );
};

export default SchedulerCase;
