import React, { useState } from 'react';
import * as AlertDialog from '../../react/alert-dialog';
import { createAlertDialogScope } from '../../react/alert-dialog';
import type { Scope } from '../../react/context';

// 创建作用域钩子
const useAlertDialogScope = createAlertDialogScope();

function Demo2Comparison() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Scope 使用对比示例</h2>
      
      <div style={{ marginBottom: '40px' }}>
        <h3>❌ 不使用 Scope（可能出现问题）</h3>
        <p>多个 AlertDialog 共享同一个上下文，可能会相互干扰</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <WithoutScopeExample title="对话框 A" />
          <WithoutScopeExample title="对话框 B" />
        </div>
      </div>

      <div>
        <h3>✅ 使用 Scope（推荐）</h3>
        <p>每个 AlertDialog 都有独立的作用域，完全隔离</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <WithScopeExample title="对话框 A" />
          <WithScopeExample title="对话框 B" />
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>🔍 主要区别</h3>
        <ul>
          <li><strong>上下文隔离</strong>：使用 scope 可以确保每个 AlertDialog 实例有独立的上下文</li>
          <li><strong>状态管理</strong>：避免多个对话框之间的状态冲突</li>
          <li><strong>嵌套支持</strong>：支持在复杂组件树中嵌套多个 AlertDialog</li>
          <li><strong>可预测性</strong>：每个实例的行为完全独立，更容易调试和维护</li>
        </ul>
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
        
        .trigger-button.without-scope {
          background-color: #dc3545;
        }
        
        .trigger-button.without-scope:hover {
          background-color: #c82333;
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

// 不使用 Scope 的示例
function WithoutScopeExample({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button className="trigger-button without-scope">
          {title} (无 Scope)
        </button>
      </AlertDialog.Trigger>
      
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="alert-overlay" />
        <AlertDialog.Content className="alert-content">
          <AlertDialog.Title className="alert-title">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="alert-description">
            这个对话框没有使用独立的 scope。在复杂场景下可能会与其他对话框产生冲突。
          </AlertDialog.Description>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <button className="alert-button secondary">
                取消
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button 
                className="alert-button primary"
                onClick={() => {
                  console.log(`${title} (无 Scope) 被确认了！`);
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

// 使用 Scope 的示例
function WithScopeExample({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const scope = useAlertDialogScope(undefined);
  
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen} {...scope}>
      <AlertDialog.Trigger asChild {...scope}>
        <button className="trigger-button">
          {title} (有 Scope)
        </button>
      </AlertDialog.Trigger>
      
      <AlertDialog.Portal {...scope}>
        <AlertDialog.Overlay className="alert-overlay" {...scope} />
        <AlertDialog.Content className="alert-content" {...scope}>
          <AlertDialog.Title className="alert-title" {...scope}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="alert-description" {...scope}>
            这个对话框使用了独立的 scope，确保与其他对话框完全隔离，不会产生冲突。
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
                  console.log(`${title} (有 Scope) 被确认了！`);
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

export default Demo2Comparison;