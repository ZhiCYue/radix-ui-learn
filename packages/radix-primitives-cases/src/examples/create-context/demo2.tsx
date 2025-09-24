import React, { useState } from 'react';
import * as AlertDialog from '../../react/alert-dialog';
import { createAlertDialogScope } from '../../react/alert-dialog';
import type { Scope } from '../../react/context';
// import { createAlertDialogScope, AlertDialog } from "@radix-ui/react-alert-dialog";

// 创建作用域 - 这允许我们创建多个独立的 AlertDialog 实例
const useAlertDialogScope = createAlertDialogScope();

// 主组件 - 演示如何使用 createAlertDialogScope
function Demo2() {
  // 创建两个独立的作用域
  const scope1 = useAlertDialogScope(undefined);
  const scope2 = useAlertDialogScope(undefined);

  return (
    <div style={{ padding: '20px' }}>
      <h2>createAlertDialogScope 示例</h2>
      <p>这个示例展示了如何使用 createAlertDialogScope 创建独立的 AlertDialog 作用域</p>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>🎯 为什么要使用 Scope？</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>上下文隔离</strong>：每个 AlertDialog 实例都有独立的 React Context</li>
          <li><strong>避免冲突</strong>：防止多个对话框之间的状态和事件处理冲突</li>
          <li><strong>嵌套支持</strong>：支持在复杂组件树中安全地嵌套多个对话框</li>
          <li><strong>可预测性</strong>：每个实例的行为完全独立，更容易调试和维护</li>
        </ul>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* 第一个独立的 AlertDialog */}
        <MyAlertDialogComponent 
          title="第一个对话框" 
          description="这是第一个独立作用域的对话框"
          triggerText="打开对话框 1"
          scope={scope1}
        />
        
        {/* 第二个独立的 AlertDialog */}
        <MyAlertDialogComponent 
          title="第二个对话框" 
          description="这是第二个独立作用域的对话框"
          triggerText="打开对话框 2"
          scope={scope2}
        />
      </div>
      
      <style>{`
        .alert-overlay {
          background-color: rgba(0, 0, 0, 0.5);
          position: fixed;
          inset: 0;
          animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .alert-content {
          background-color: white;
          border-radius: 6px;
          box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: 500px;
          max-height: 85vh;
          padding: 25px;
          animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .alert-title {
          margin: 0;
          color: #1a1a1a;
          font-size: 17px;
          font-weight: 500;
        }
        
        .alert-description {
          margin: 10px 0 20px;
          color: #666;
          font-size: 15px;
          line-height: 1.5;
        }
        
        .alert-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          padding: 0 15px;
          font-size: 15px;
          line-height: 1;
          font-weight: 500;
          height: 35px;
          margin-right: 10px;
          cursor: pointer;
          border: none;
        }
        
        .alert-button.primary {
          background-color: #007bff;
          color: white;
        }
        
        .alert-button.secondary {
          background-color: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }
        
        .alert-button:hover.primary {
          background-color: #0056b3;
        }
        
        .alert-button:hover.secondary {
          background-color: #e9ecef;
        }
        
        .trigger-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .trigger-button:hover {
          background-color: #0056b3;
        }
        
        @keyframes overlayShow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes contentShow {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// 可复用的 AlertDialog 组件，每个实例都有独立的作用域
function MyAlertDialogComponent({ 
  title, 
  description, 
  triggerText,
  scope
}: {
  title: string;
  description: string;
  triggerText: string;
  scope: { __scopeAlertDialog?: Scope };
}) {
  const [open, setOpen] = useState(false);
  
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen} {...scope}>
      <AlertDialog.Trigger asChild {...scope}>
        <button className="trigger-button">
          {triggerText}
        </button>
      </AlertDialog.Trigger>
      
      <AlertDialog.Portal {...scope}>
        <AlertDialog.Overlay className="alert-overlay" {...scope} />
        <AlertDialog.Content className="alert-content" {...scope}>
          <AlertDialog.Title className="alert-title" {...scope}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="alert-description" {...scope}>
            {description}
          </AlertDialog.Description>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild {...scope}>
              <button className="alert-button secondary">
                取消
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild {...scope}>
              <button 
                className="alert-button primary"
                onClick={() => {
                  console.log(`${title} 被确认了！`);
                  setOpen(false);
                }}
              >
                确认
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default Demo2;