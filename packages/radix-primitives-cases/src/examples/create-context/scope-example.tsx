import React, { useState, ReactNode } from "react";
import { createContextScope } from "../../react/context";

// 定义 Accordion 的类型
interface AccordionContextValue {
  value: string | null;
  onValueChange: (value: string) => void;
  collapsible: boolean;
}

// 创建作用域
const [createAccordionContext, createAccordionScope] =
  createContextScope("Accordion");

// 创建 Context
const [AccordionProvider, useAccordionContext] = createAccordionContext<AccordionContextValue>(
  "Accordion",
  {
    value: null,
    onValueChange: () => {},
    collapsible: false,
  }
);

// 定义组件 Props 类型
interface AccordionProps {
  value?: string | null;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
  children: ReactNode;
  __scopeAccordion?: any;
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  __scopeAccordion?: any;
}

interface AccordionTriggerProps {
  children: ReactNode;
}

interface AccordionContentProps {
  children: ReactNode;
}

// AccordionItem Context - 用于向子组件传递当前项的信息
const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
  toggle: () => void;
} | null>(null);

// 根组件
const Accordion: React.FC<AccordionProps> = ({
  value = null,
  onValueChange = () => {},
  collapsible = false,
  children,
  __scopeAccordion,
}) => {
  return (
    <AccordionProvider
      scope={__scopeAccordion}
      value={value}
      onValueChange={onValueChange}
      collapsible={collapsible}
    >
      <div className="accordion" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
        {React.Children.map(children, child => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { __scopeAccordion } as any)
            : child
        )}
      </div>
    </AccordionProvider>
  );
};

// 子组件使用 Context - 传递正确的 scope 参数
const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, __scopeAccordion }) => {
  const context = useAccordionContext("AccordionItem", __scopeAccordion);
  const isOpen = context.value === value;
  
  // 调试信息：验证是否使用了正确的 scope
  React.useEffect(() => {
    console.log(`AccordionItem ${value} - Context:`, context);
  }, [value, context]);

  const handleToggle = () => {
    // 如果当前项已经打开，则关闭；否则打开当前项
    const newValue = isOpen ? null : value;
    context.onValueChange(newValue || '');
  };

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, toggle: handleToggle }}>
      <div 
        className="accordion-item" 
        data-state={isOpen ? "open" : "closed"}
        style={{ 
          border: '1px solid #ddd', 
          margin: '5px 0',
          backgroundColor: isOpen ? '#f0f8ff' : '#fff'
        }}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// 触发器组件
const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children }) => {
  const itemContext = React.useContext(AccordionItemContext);

  const handleClick = () => {
    if (itemContext) {
      itemContext.toggle();
    }
  };

  return (
    <button 
      onClick={handleClick}
      style={{ 
        width: '100%', 
        padding: '10px', 
        textAlign: 'left',
        backgroundColor: '#f5f5f5',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
};

// 内容组件
const AccordionContent: React.FC<AccordionContentProps> = ({ children }) => {
  const itemContext = React.useContext(AccordionItemContext);
  
  if (!itemContext || !itemContext.isOpen) return null;

  return (
    <div 
      className="accordion-content"
      style={{ 
        padding: '10px',
        backgroundColor: '#fafafa'
      }}
    >
      {children}
    </div>
  );
};

// 演示组件
const App: React.FC = () => {
  const [outerValue, setOuterValue] = useState<string | null>(null);
  const [innerValue, setInnerValue] = useState<string | null>(null);
  
  // ✅ 正确使用 createContextScope 的完整流程 - 创建完全独立的作用域
  // 1. 创建 useScope 函数
  const useOuterScope = React.useMemo(() => createAccordionScope(), []);
  const useInnerScope = React.useMemo(() => createAccordionScope(), []);
  
  // 2. 调用 useScope 函数获取作用域对象
  const outerScopeProps = useOuterScope(undefined); // 外层作用域，传入 undefined
  const innerScopeProps = useInnerScope(undefined); // 🔥 内层作用域也传入 undefined，创建完全独立的 scope！

  // 调试信息：验证 scope 隔离效果
  React.useEffect(() => {
    console.log('🔍 Scope 隔离验证:');
    console.log('外层 scope 对象:', outerScopeProps);
    console.log('内层 scope 对象:', innerScopeProps);
    console.log('外层 Context 实例:', outerScopeProps.__scopeAccordion?.Accordion);
    console.log('内层 Context 实例:', innerScopeProps.__scopeAccordion?.Accordion);
    console.log('两个 Context 实例是否相同:', 
      outerScopeProps.__scopeAccordion?.Accordion === innerScopeProps.__scopeAccordion?.Accordion ? 
      '❌ 相同 (隔离失败)' : '✅ 不同 (隔离成功)'
    );
  }, [outerScopeProps, innerScopeProps]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>createContextScope 作用域隔离演示</h2>
      <p>
        这个示例展示了 createContextScope 的核心功能：<strong>作用域隔离</strong>。
        即使 Accordion 组件嵌套，每个实例都有完全独立的 Context，互不干扰。
      </p>
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#e8f4fd', 
        borderRadius: '5px', 
        marginBottom: '15px',
        fontSize: '14px'
      }}>
        <strong>🎯 关键点：</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>外层 Accordion 使用 <code>useOuterScope(undefined)</code> 创建独立作用域</li>
          <li>内层 Accordion 使用 <code>useInnerScope(undefined)</code> 创建另一个独立作用域</li>
          <li>两个作用域完全隔离，各自维护独立的 Context 实例和状态</li>
        </ul>
      </div>
      
      {/* 外层 Accordion - 有自己的作用域 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>外层 Accordion (独立作用域)</h3>
        <Accordion 
          value={outerValue} 
          onValueChange={setOuterValue}
          collapsible={true}
          {...outerScopeProps}
        >
          <AccordionItem value="outer-item1">
            <AccordionTrigger>
              点击展开外层内容 1
            </AccordionTrigger>
            <AccordionContent>
              <p>这是外层 Accordion 的内容 1</p>
              <p>当前外层值: {outerValue || '无'}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="outer-item2">
            <AccordionTrigger>
              点击展开外层内容 2 (包含嵌套 Accordion)
            </AccordionTrigger>
            <AccordionContent>
              <p>这里嵌套了另一个 Accordion，它有自己独立的作用域：</p>
              
              {/* 内层 Accordion - 有自己独立的作用域 */}
              <Accordion 
                value={innerValue} 
                onValueChange={setInnerValue}
                collapsible={true}
                {...innerScopeProps}
              >
                <AccordionItem value="inner-item1">
                  <AccordionTrigger>
                    内层项目 1
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>这是内层 Accordion 的内容 1</p>
                    <p>当前内层值: {innerValue || '无'}</p>
                    <p>注意：内层和外层的状态是完全独立的！</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inner-item2">
                  <AccordionTrigger>
                    内层项目 2
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>这是内层 Accordion 的内容 2</p>
                    <p>每个作用域都有自己的 Context 实例</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* 状态显示 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f0f0f0',
        borderRadius: '5px'
      }}>
        <h4>当前状态：</h4>
        <p>外层 Accordion 值: <strong>{outerValue || '无'}</strong></p>
        <p>内层 Accordion 值: <strong>{innerValue || '无'}</strong></p>
        <p>
          <small>
            <strong>🔥 作用域隔离验证：</strong><br/>
            • 外层和内层 Accordion 使用完全不同的 Context 实例<br/>
            • 每个 scope 都调用 <code>useScope(undefined)</code> 创建独立作用域<br/>
            • 状态变化互不影响，这就是 createContextScope 的核心价值！<br/>
            • 打开浏览器控制台查看详细的隔离验证信息
          </small>
        </p>
      </div>
    </div>
  );
};

export default App;