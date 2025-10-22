import React, { useState, useEffect, memo } from 'react';

// 类型定义
type User = { id: number; name: string };
type Settings = { theme: string };
type RenderLog = {
  MemoizedUser?: number;
  MemoizedUserCustom?: number;
  RegularUser?: number;
};
type OnRender = (component: keyof RenderLog) => void;

interface UserProps {
  user: User;
  settings: Settings;
  onRender: OnRender;
}

// 自定义比较函数
const customCompare = (prevProps: UserProps, nextProps: UserProps) => {
  console.log('🔍 自定义比较执行:', {
    prev: prevProps.user,
    next: nextProps.user
  });
  // 只比较 user.id，忽略其他变化
  return prevProps.user.id === nextProps.user.id;
};

// 使用 React.memo 的组件
const MemoizedUser = memo(
  ({ user, settings, onRender }: UserProps) => {
    useEffect(() => {
      console.log('🟢 MemoizedUser 提交阶段');
      onRender('MemoizedUser');
    });

    console.log('🔵 MemoizedUser 渲染阶段');
    return (
      <div style={{ padding: '10px', background: '#e3f2fd', margin: '5px' }}>
        <h3>Memoized User</h3>
        <p>ID: {user.id}</p>
        <p>Name: {user.name}</p>
        <p>Settings: {settings.theme}</p>
      </div>
    );
  }
); // 默认使用浅比较

// 使用自定义比较的组件
const MemoizedUserCustom = memo(
  ({ user, settings, onRender }: UserProps) => {
    useEffect(() => {
      console.log('🟢 MemoizedUserCustom 提交阶段');
      onRender('MemoizedUserCustom');
    });

    console.log('🔵 MemoizedUserCustom 渲染阶段');
    return (
      <div style={{ padding: '10px', background: '#ffebee', margin: '5px' }}>
        <h3>Memoized User (自定义比较)</h3>
        <p>ID: {user.id}</p>
        <p>Name: {user.name}</p>
        <p>Settings: {settings.theme}</p>
      </div>
    );
  },
  customCompare
); // 使用自定义比较函数

// 普通组件（未优化）
const RegularUser = ({ user, settings, onRender }: UserProps) => {
  useEffect(() => {
    console.log('🟢 RegularUser 提交阶段');
    onRender('RegularUser');
  });

  console.log('🔵 RegularUser 渲染阶段');
  return (
    <div style={{ padding: '10px', background: '#e8f5e8', margin: '5px' }}>
      <h3>Regular User</h3>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Settings: {settings.theme}</p>
    </div>
  );
};

function ParentComponent() {
  const [user, setUser] = useState<User>({ id: 1, name: 'John' });
  const [settings, setSettings] = useState<Settings>({ theme: 'light' });
  const [count, setCount] = useState<number>(0);
  const [renderLog, setRenderLog] = useState<RenderLog>({});

  const updateRenderLog = (component: keyof RenderLog) => {
    // setRenderLog(prev => ({
    //   ...prev,
    //   [component]: (prev[component] || 0) + 1
    // }));
  };

  const updateUserName = () => {
    setUser(prev => ({ ...prev, name: prev.name + '!' }));
  };

  const updateUserWithNewObject = () => {
    setUser(prev => ({ id: prev.id, name: prev.name })); // 相同内容，新对象
  };

  const updateSettings = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const updateCount = () => {
    setCount(prev => prev + 1);
  };

  console.log('🔵 ParentComponent 渲染阶段');

  return (
    <div style={{ padding: '20px' }}>
      <h1>React.memo 原理演示</h1>
      
      <div style={{ background: '#f5f5f5', padding: '15px', margin: '10px 0' }}>
        <h2>控制面板</h2>
        <p>User: {JSON.stringify(user)}</p>
        <p>Settings: {JSON.stringify(settings)}</p>
        <p>Count: {count}</p>
        
        <button onClick={updateUserName} style={buttonStyle}>
          更新用户名
        </button>
        <button onClick={updateUserWithNewObject} style={buttonStyle}>
          更新为相同内容的新对象
        </button>
        <button onClick={updateSettings} style={buttonStyle}>
          更新设置
        </button>
        <button onClick={updateCount} style={buttonStyle}>
          更新计数（父组件状态）
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <MemoizedUser 
          user={user} 
          settings={settings}
          onRender={updateRenderLog}
        />
        
        <MemoizedUserCustom 
          user={user} 
          settings={settings}
          onRender={updateRenderLog}
        />
        
        <RegularUser 
          user={user} 
          settings={settings}
          onRender={updateRenderLog}
        />
      </div>

      <div style={{ background: '#fff8e1', padding: '15px', margin: '10px 0' }}>
        <h3>渲染统计</h3>
        <ul>
          <li>MemoizedUser (浅比较): {renderLog.MemoizedUser || 0} 次</li>
          <li>MemoizedUserCustom (自定义比较): {renderLog.MemoizedUserCustom || 0} 次</li>
          <li>RegularUser (无优化): {renderLog.RegularUser || 0} 次</li>
        </ul>
      </div>

      <div style={{ background: '#e3f2fd', padding: '15px', margin: '10px 0' }}>
        <h3>React.memo 原理总结</h3>
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>操作</th>
              <th>MemoizedUser (浅比较)</th>
              <th>MemoizedUserCustom (自定义)</th>
              <th>RegularUser (无优化)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>更新用户名</td>
              <td>✅ 重新渲染</td>
              <td>❌ 不渲染 (只比较id)</td>
              <td>✅ 重新渲染</td>
            </tr>
            <tr>
              <td>相同内容新对象</td>
              <td>✅ 重新渲染 (引用不同)</td>
              <td>❌ 不渲染 (内容相同)</td>
              <td>✅ 重新渲染</td>
            </tr>
            <tr>
              <td>更新设置</td>
              <td>✅ 重新渲染</td>
              <td>✅ 重新渲染</td>
              <td>✅ 重新渲染</td>
            </tr>
            <tr>
              <td>更新父组件状态</td>
              <td>❌ 不渲染</td>
              <td>❌ 不渲染</td>
              <td>✅ 重新渲染</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  margin: '5px',
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default ParentComponent;
