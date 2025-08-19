import { forwardRef } from 'react';
import { createSlottable } from '../../react/slot';

import type { ButtonHTMLAttributes, ReactNode, ForwardedRef } from 'react';

const Slottable = createSlottable('TooltipContent');

// Use Slottable when your component has multiple children to pass the props to the correct element:
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

// 子组件（如图标）
const Icon = () => <span>🎯</span>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref: ForwardedRef<HTMLButtonElement>) => (
    <button {...props} ref={ref}>
      <Slottable>{children}</Slottable>  {/* 这里是关键 */}
    </button>
  )
);

export default () => {
  return <>
    <section>
      <Button className={'Button blue'}>Click me</Button>               {/** 纯文本按钮 */}
      <Button><Icon /> Click me</Button>                                {/** 图标 + 文本按钮 */}
    </section>
  </>
}