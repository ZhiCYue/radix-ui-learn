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
  
  // ✅ 正确使用 createContextScope 的完整流程
  // 1. 创建 useScope 函数
  const useOuterScope = React.useMemo(() => createAccordionScope(), []);
  const useInnerScope = React.useMemo(() => createAccordionScope(), []);
  
  // 2. 调用 useScope 函数获取作用域对象
  const outerScopeProps = useOuterScope(undefined); // 顶层作用域，传入 undefined
  const innerScopeProps = useInnerScope(outerScopeProps.__scopeAccordion); // 嵌套作用域，传入父作用域

  // 调试信息：验证 useScope 的调用结果
  React.useEffect(() => {
    console.log('🔍 Scope Debug Info:');
    console.log('outerScopeProps:', outerScopeProps);
    console.log('innerScopeProps:', innerScopeProps);
    console.log('outerScope contexts:', outerScopeProps.__scopeAccordion?.Accordion);
    console.log('innerScope contexts:', innerScopeProps.__scopeAccordion?.Accordion);
  }, [outerScopeProps, innerScopeProps]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>createContextScope 功能演示</h2>
      <p>这个示例展示了如何使用 createContextScope 创建独立的上下文作用域，避免嵌套组件间的状态冲突。</p>
      
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
            通过 createContextScope 和正确的 useScope 调用，每个 Accordion 实例都有自己独立的上下文，
            不会相互影响。这是 Radix UI 中避免组件嵌套冲突的核心机制。
          </small>
        </p>
      </div>
    </div>
  );
};

export default App;