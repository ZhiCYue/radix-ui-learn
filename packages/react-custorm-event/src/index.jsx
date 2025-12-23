import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { setupLongPressPlugin } from './setupEventPlugins';
import App from './App';
import './style.css';

// 初始化长按事件插件
console.log('🚀 初始化长按事件插件...');
const pluginInjected = setupLongPressPlugin();

if (pluginInjected) {
  console.log('✅ 长按事件插件已成功注入');
} else {
  console.log('⚠️  使用模拟模式运行长按事件插件');
}

// 将插件暴露到全局，供调试使用
window.LongPressEventPlugin = {
  setLongPressThreshold: (threshold) => {
    console.log(`设置长按时间为: ${threshold}ms`);
  },
  setMoveThreshold: (threshold) => {
    console.log(`设置移动阈值为: ${threshold}px`);
  },
};

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
  <App />
</React.StrictMode>);
