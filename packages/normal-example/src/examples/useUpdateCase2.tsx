import React, { useState, ReactNode } from 'react';
import { createContext, useContextSelector, useContextUpdate } from 'use-context-selector';

// 类型定义
type UserProfile = {
  avatar: string;
  bio: string;
};

type User = {
  id: number;
  name: string;
  age: number;
  profile: UserProfile;
};

type Settings = {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
};

type UserContextType = {
  user: User;
  settings: Settings;
  updateUser: React.Dispatch<React.SetStateAction<User>>;
  updateSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

type UserProviderProps = {
  children: ReactNode;
};

// 创建 Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider 组件
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: '张三',
    age: 25,
    profile: {
      avatar: '👤',
      bio: '前端开发者'
    }
  });
  
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    language: 'zh-CN',
    notifications: true
  });

  const value: UserContextType = {
    user,
    settings,
    updateUser: setUser,
    updateSettings: setSettings
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 使用 useContextUpdate 的组件
const UserProfileUpdater: React.FC = () => {
  // useContextUpdate 返回一个更新函数，用于触发重新渲染
  const update = useContextUpdate(UserContext);
  
  // 获取更新函数，但不订阅状态
  const updateUser = useContextSelector(UserContext, (state) => state?.updateUser);
  const updateSettings = useContextSelector(UserContext, (state) => state?.updateSettings);

  const handleUpdateProfile = () => {
    if (updateUser) {
      updateUser(prev => ({
        ...prev,
        age: prev.age + 1,
        profile: {
          ...prev.profile,
          bio: `更新于 ${new Date().toLocaleTimeString()}`
        }
      }));
      // 使用 useContextUpdate 强制触发重新渲染
      update(() => {});
    }
  };

  const handleToggleTheme = () => {
    if (updateSettings) {
      updateSettings(prev => ({
        ...prev,
        theme: prev.theme === 'light' ? 'dark' : 'light'
      }));
      // 使用 useContextUpdate 强制触发重新渲染
      update(() => {});
    }
  };

  console.log('UserProfileUpdater 渲染了');

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #4CAF50',
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h3>更新控制器 (useContextUpdate)</h3>
      <p>这个组件只负责更新，不订阅任何状态</p>
      <button onClick={handleUpdateProfile}>更新用户信息</button>
      <button onClick={handleToggleTheme}>切换主题</button>
    </div>
  );
};

// 使用 useContextSelector 的组件 - 只订阅用户名称
const UserNameDisplay: React.FC = () => {
  const name = useContextSelector(
    UserContext,
    (state) => state?.user.name
  ) as string | undefined;
  
  console.log('UserNameDisplay 渲染了');

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #2196F3',
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h3>用户名显示</h3>
      <p>姓名: <strong>{name}</strong></p>
      <p>⏰ 最后渲染: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// 只订阅用户年龄的组件
const UserAgeDisplay: React.FC = () => {
  const age = useContextSelector(
    UserContext,
    (state) => state?.user.age
  ) as number | undefined;
  
  console.log('UserAgeDisplay 渲染了');

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #FF9800',
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h3>用户年龄</h3>
      <p>年龄: <strong>{age}</strong></p>
      <p>⏰ 最后渲染: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// 只订阅主题设置的组件
const ThemeDisplay: React.FC = () => {
  const theme = useContextSelector(
    UserContext,
    (state) => state?.settings.theme
  ) as 'light' | 'dark' | undefined;
  
  console.log('ThemeDisplay 渲染了');

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #9C27B0',
      margin: '10px',
      borderRadius: '8px',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000'
    }}>
      <h3>主题设置</h3>
      <p>当前主题: <strong>{theme}</strong></p>
      <p>⏰ 最后渲染: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// 订阅用户完整信息的组件
const UserProfileDisplay: React.FC = () => {
  const user = useContextSelector(
    UserContext,
    (state) => state?.user
  ) as User | undefined;
  
  console.log('UserProfileDisplay 渲染了');

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #F44336',
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h3>完整用户信息</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>⏰ 最后渲染: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// 使用 useContextUpdate 但不订阅状态的组件
const ForceUpdateComponent: React.FC = () => {
  const update = useContextUpdate(UserContext);
  const renderCount = React.useRef(0);
  renderCount.current++;

  const handleForceUpdate = () => {
    console.log('🔄 强制触发所有订阅组件重新渲染');
    update(() => {}); // 这会强制所有使用 useContextSelector 的组件重新渲染
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #FF5722',
      margin: '10px',
      borderRadius: '8px',
      backgroundColor: '#fff3e0'
    }}>
      <h3>强制更新组件 (useContextUpdate)</h3>
      <p>这个组件不订阅任何状态，但可以强制触发其他组件重新渲染</p>
      <p>渲染次数: {renderCount.current}</p>
      <button onClick={handleForceUpdate}>强制更新所有组件</button>
      <p>⏰ 最后渲染: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// 性能监控组件
const PerformanceMonitor: React.FC = () => {
  const renderCount = React.useRef(0);
  renderCount.current++;

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #607D8B',
      margin: '10px',
      borderRadius: '8px',
      backgroundColor: '#f5f5f5'
    }}>
      <h3>性能监控</h3>
      <p>监控组件渲染次数: {renderCount.current}</p>
      <p>⏰ 当前时间: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

// 主应用组件
const App: React.FC = () => {
  return (
    <UserProvider>
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1>use-context-selector 示例</h1>
        <p>演示 useContextUpdate 和 useContextSelector 的用法</p>
        
        <UserProfileUpdater />
        <ForceUpdateComponent />
        <UserNameDisplay />
        <UserAgeDisplay />
        <ThemeDisplay />
        <UserProfileDisplay />
        <PerformanceMonitor />
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e8f5e8',
          borderRadius: '8px'
        }}>
          <h4>🎯 核心特性:</h4>
          <ul>
            <li><strong>useContextUpdate</strong>: 用于强制触发 Context 重新渲染的函数，不订阅状态</li>
            <li><strong>useContextSelector</strong>: 选择性订阅 Context 中的特定部分</li>
            <li><strong>细粒度更新</strong>: 只有订阅了变化数据的组件才会重新渲染</li>
            <li><strong>性能优化</strong>: 避免不必要的组件渲染</li>
          </ul>
          
          <h4>🔍 观察要点:</h4>
          <ul>
            <li>点击"更新用户信息"时，只有 UserAgeDisplay 和 UserProfileDisplay 会重新渲染</li>
            <li>点击"切换主题"时，只有 ThemeDisplay 会重新渲染</li>
            <li>点击"强制更新所有组件"时，所有使用 useContextSelector 的组件都会重新渲染</li>
            <li>UserProfileUpdater 和 ForceUpdateComponent 本身不会因为状态变化而重新渲染</li>
            <li>查看控制台日志了解各组件的渲染情况</li>
          </ul>
          
          <h4>💡 useContextUpdate 的作用:</h4>
          <ul>
            <li><strong>强制重新渲染</strong>: 不订阅状态但可以强制触发其他组件重新渲染</li>
            <li><strong>性能控制</strong>: 在需要时手动触发更新，而不是依赖状态变化</li>
            <li><strong>调试工具</strong>: 可以用于调试和测试组件的重新渲染行为</li>
          </ul>
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
