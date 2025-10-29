import UseAtomCase from './examples/useAtomCase';
import UseUpdateCase from './examples/useUpdateCase';
import UseUpdateCase2 from './examples/useUpdateCase2';
import UseContextSelectorCase from './examples/useContextSelectorCase';

import SchedulerCase from './examples/schedulerCase';
import HookCase from './examples/hookCase';

import {
  UseMemoCase,
  MemoCase,
  MemoCase2,
  BailoutCase,
} from './examples/extra/index';

export default function App() {
  return (
    <div className="App">
      <UseAtomCase />
      {/* <HookCase /> */}
      {/* <UseUpdateCase /> */}
      {/* <UseUpdateCase2 /> */}
      {/* <UseContextSelectorCase /> */}
      {/* <MemoCase /> */}
      {/* <MemoCase2 /> */}
      {/* <UseMemoCase /> */}
      {/* <BailoutCase /> */}
      {/* <SchedulerCase /> */}
    </div>
  );
}