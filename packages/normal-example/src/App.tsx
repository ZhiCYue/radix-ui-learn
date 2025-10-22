// import UseAtomCase from './examples/useAtomCase';
import UseUpdateCase from './examples/useUpdateCase';
import UseContextSelectorCase from './examples/useContextSelectorCase';

import {
  UseMemoCase,
  MemoCase,
  MemoCase2,
  BailoutCase,
} from './examples/extra/index';

export default function App() {
  return (
    <div className="App">
      {/* <UseAtomCase /> */}
      {/* <UseUpdateCase /> */}
      {/* <UseContextSelectorCase /> */}
      <MemoCase />
      <MemoCase2 />
      {/* <UseMemoCase /> */}
      {/* <BailoutCase /> */}
    </div>
  );
}