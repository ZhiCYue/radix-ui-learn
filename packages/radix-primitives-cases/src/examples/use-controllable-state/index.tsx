import React from 'react';
import { useControllableState } from '../../react/use-controllable-state';

import './styles.css';

const Switch = ({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  ...props
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });

  const handleToggle = () => {
    if (!disabled) {
      setChecked(!checked);
    }
  };

  return (
    <button
      className={`switch ${checked ? 'switch--checked' : ''} ${
        disabled ? 'switch--disabled' : ''
      }`}
      onClick={handleToggle}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      {...props}
    >
      <span className="switch__thumb" />
    </button>
  );
};

const SwitchDemo = () => {
  const [controlledChecked, setControlledChecked] = React.useState(false);
  
  return (
    <div className="container">
      <h1>useControllableState 示例</h1>
      
      <section>
        <h2>非受控模式（使用默认值）</h2>
        <Switch defaultChecked={true} />
        <p>这个开关有自己的内部状态，初始为开启状态</p>
      </section>
      
      <section>
        <h2>受控模式</h2>
        <Switch 
          checked={controlledChecked} 
          onCheckedChange={setControlledChecked} 
        />
        <p>当前状态: {controlledChecked ? '开启' : '关闭'}</p>
        <button onClick={() => setControlledChecked(!controlledChecked)}>
          切换状态
        </button>
      </section>
      
      <section>
        <h2>禁用状态</h2>
        <Switch disabled defaultChecked={true} />
        <Switch disabled />
      </section>
    </div>
  );
};

export default SwitchDemo;