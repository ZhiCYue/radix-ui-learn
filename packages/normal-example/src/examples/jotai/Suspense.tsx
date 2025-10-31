import { atom, useAtom } from 'jotai';
import { Suspense } from 'react'

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const todo: Todo = {
    id: 0,
    title: 'learn jotai',
    completed: true
};

// 请求函数返回 Promise<Todo>
const request = async (): Promise<Todo> => (
    fetch('https://jsonplaceholder.typicode.com/todos/5')
        .then((res) => res.json())
)

// 用于异步请求的atom
const todoAtom = atom<Todo>(todo);

// 由于 setGoal 不能直接赋值Promise，需要Suspense集成
const asyncTodoAtom = atom(
    async (get) => {
        // 这里读取todoAtom即可，初始为todo
        return get(todoAtom);
    },
    async (_get, set) => {
        // 调用request获取新todo，并更新 todoAtom
        const newTodo = await request();
        set(todoAtom, newTodo);
    }
);

function Component() {
  const [todoGoal, triggerNewGoal] = useAtom(asyncTodoAtom);

  const handleClick = () => {
    triggerNewGoal();
  };

  return (
    <div className="app">
      <p>Todays Goal: {todoGoal.title}</p>
      <button onClick={handleClick}>New Goal</button>
    </div>
  );
}

export default function AsyncSuspense() {
   return (
    <div className="app">
      <Suspense fallback={<span>loading...</span>}>
        <Component />
      </Suspense>
    </div>
  )
}
