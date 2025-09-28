import React, { useState, ReactNode } from "react";
import { createContextScope } from "../../react/context/create-context";

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
  scope?: any;
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

interface AccordionTriggerProps {
  children: ReactNode;
}

interface AccordionContentProps {
  children: ReactNode;
}

// 根组件
const Accordion: React.FC<AccordionProps> = ({
  value = null,
  onValueChange = () => {},
  collapsible = false,
  children,
  scope,
}) => {
  return (
    <AccordionProvider
      scope={scope}
      value={value}
      onValueChange={onValueChange}
      collapsible={collapsible}
    >
      <div className="accordion" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
        {children}
      </div>
    </AccordionProvider>
  );
};

// 子组件使用 Context - 传递 undefined 作为 scope，会使用当前作用域的 context
const AccordionItem: React.FC<AccordionItemProps> = ({ value, children }) => {
  const context = useAccordionContext("AccordionItem", undefined);
  const isOpen = context.value === value;

  return (
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
  );
};

// 触发器组件
const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children }) => {
  const context = useAccordionContext("AccordionTrigger", undefined);

  const handleClick = () => {
    // 简单的切换逻辑
    const currentValue = context.value;
    context.onValueChange(currentValue ? '' : 'item1');
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
  const context = useAccordionContext("AccordionContent", undefined);
  const isOpen = context.value !== null && context.value !== '';

  if (!isOpen) return null;

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
          scope={createAccordionScope()}
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
                scope={createAccordionScope()} // 创建新的作用域
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
            通过 createContextScope，每个 Accordion 实例都有自己独立的上下文，
            不会相互影响。这是 Radix UI 中避免组件嵌套冲突的核心机制。
          </small>
        </p>
      </div>
    </div>
  );
};

export default App;