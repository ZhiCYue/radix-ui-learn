import React, { useState } from "react";
import "./styles.css";

// 导入各个子组件
import BasicDialogDemo from "./basic-dialog-demo";
import AdvancedDialogDemo from "./advanced-dialog-demo";
import TriggerPortalDemo from "./trigger-portal-demo";
import DraggableDialogDemo from "./draggable-dialog-demo";

// 导航配置
const DIALOG_DEMOS = [
  {
    id: 'basic',
    title: '📝 基础 Dialog',
    description: '基本的 Dialog 使用和表单数据处理',
    component: BasicDialogDemo
  },
  {
    id: 'advanced',
    title: '🚀 高级 Dialog',
    description: '带验证、异步提交和错误处理的 Dialog',
    component: AdvancedDialogDemo
  },
  {
    id: 'trigger-portal',
    title: '🔧 Trigger & Portal',
    description: 'Dialog.Trigger 作用域和 Portal 挂载机制',
    component: TriggerPortalDemo
  },
  {
    id: 'draggable',
    title: '🎯 拖拽功能',
    description: 'Dialog 拖拽功能的多种实现方案',
    component: DraggableDialogDemo
  }
];

const DialogDemo = () => {
  const [activeDemo, setActiveDemo] = useState('basic');
  
  const ActiveComponent = DIALOG_DEMOS.find(demo => demo.id === activeDemo)?.component || BasicDialogDemo;

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* 页面标题 */}
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ 
          margin: '0 0 12px 0', 
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Dialog 组件演示
        </h1>
        <p style={{ 
          margin: '0 auto', 
          color: '#666', 
          fontSize: '1.1rem',
          maxWidth: '600px'
        }}>
          探索 Radix UI Dialog 组件的各种功能和使用场景
        </p>
      </header>

      {/* 导航栏 */}
      <nav style={{ 
        marginBottom: '40px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {DIALOG_DEMOS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              style={{
                padding: '16px 20px',
                background: activeDemo === demo.id 
                  ? 'rgba(255, 255, 255, 0.95)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: activeDemo === demo.id ? '#333' : 'white',
                border: activeDemo === demo.id 
                  ? '2px solid rgba(255, 255, 255, 0.3)' 
                  : '2px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: activeDemo === demo.id ? 'bold' : 'normal',
                transform: activeDemo === demo.id ? 'translateY(-2px)' : 'none',
                boxShadow: activeDemo === demo.id 
                  ? '0 4px 12px rgba(0,0,0,0.15)' 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeDemo !== demo.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeDemo !== demo.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'none';
                }
              }}
            >
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginBottom: '4px' 
              }}>
                {demo.title}
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.9,
                lineHeight: '1.4'
              }}>
                {demo.description}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* 当前演示内容 */}
      <main style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        minHeight: '500px'
      }}>
        <ActiveComponent />
      </main>

      {/* 页脚信息 */}
      <footer style={{
        marginTop: '40px',
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        borderTop: '1px solid #e9ecef'
      }}>
        <p style={{ margin: 0 }}>
          基于 <strong>Radix UI</strong> 构建 • 
          <a 
            href="https://www.radix-ui.com/primitives/docs/components/dialog" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              marginLeft: '8px'
            }}
          >
            查看官方文档 →
          </a>
        </p>
      </footer>
    </div>
  );
};

export default DialogDemo;