import { useAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';

const counter = atomWithReset(1);

export default function Counter() {
  const [count, setCount] = useAtom(counter);
  const reset = useResetAtom(counter);

  const inc = () => setCount(c => c * 2);

  return (
    <div className="counter">
      <p className="util">1. atomWithReset</p>
      <p>{count}</p>
      <div>
        <button onClick={inc}>Inc</button>
        <button onClick={reset}>Reset Count</button>
      </div>
    </div>
  );
}
