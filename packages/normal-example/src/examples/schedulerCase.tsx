import React from "react";
import {
  unstable_NormalPriority as NormalPriority,
  unstable_runWithPriority as runWithPriority,
  unstable_UserBlockingPriority as UserBlockingPriority,
  unstable_ImmediatePriority as ImmediatePriority,
  unstable_scheduleCallback as scheduleCallback,
  unstable_LowPriority as LowPriority,            // 低优先级任务
  unstable_IdlePriority as IdlePriority,      // 空闲优先级任务
} from "scheduler";

// 为 runWithNormalPriority 指定函数参数类型
const runWithNormalPriority: (fn: () => void) => void = runWithPriority
  ? (fn) => {
      try {
        runWithPriority(
          NormalPriority,
          fn
        );
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
    // runWithPriority(ImmediatePriority, () => {
    //   setMessage("正在处理耗时任务...");
    // });

    // runWithPriority(IdlePriority, () => {
    //   // 模拟一个耗时任务
    //   let i = 0;
    //   while (i < 1000000000) {
    //     i++;
    //   }
    //   setCount((count) => count + 1);
    //   setMessage(null);
    // });
  };

  const handleClick2 = () => {
    // 1. 使用 NormalPriority 作为参数
    scheduleCallback(NormalPriority, () => {
      console.log('这个任务以正常优先级执行');
    });

    // 2. 使用 runWithPriority 创建优先级上下文
    runWithPriority(ImmediatePriority, () => {
      // 在这个块内，所有调度操作默认使用 ImmediatePriority
      scheduleCallback(NormalPriority, () => {
        // 即使在外层是 ImmediatePriority，这里仍然明确指定 NormalPriority
        console.log('明确指定优先级');
      });
      
      scheduleCallback(ImmediatePriority, () => {
        // 没有指定优先级，会使用当前上下文的 ImmediatePriority
        console.log('使用当前上下文优先级');
      });
    });
  }

  return (
    <>
      <p>count: {count}</p>
      <button onClick={handleClick}>点击</button>
      {message && <p>{message}</p>}
      <button onClick={handleClick2}>点击2</button>
    </>
  );
};

export default SchedulerCase;
