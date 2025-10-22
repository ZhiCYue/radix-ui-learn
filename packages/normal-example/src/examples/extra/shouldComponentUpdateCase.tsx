import React from 'react';

type MyComponentProps = {
  importantValue: string;
};

class MyComponent extends React.Component<MyComponentProps> {
  shouldComponentUpdate(nextProps: MyComponentProps, nextState: unknown) {
    // 返回 false 阻止进入提交阶段
    if (this.props.importantValue === nextProps.importantValue) {
      console.log('渲染阶段执行了，但被 shouldComponentUpdate 阻止提交');
      return false;
    }
    return true;
  }
  
  render() {
    console.log('渲染阶段：计算虚拟DOM');
    return <div>{this.props.importantValue}</div>;
  }
}

export default MyComponent;
