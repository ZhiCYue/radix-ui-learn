##

https://github.com/dai-shi/use-atom.git

## use-atom

### 安装

```bash
npm install use-atom
```

### 使用

```tsx
import { useAtom } from 'use-atom';

const [count, setCount] = useAtom(0);

function App() {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### API

#### useAtom(initialValue: any)