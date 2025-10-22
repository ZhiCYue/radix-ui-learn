import React, { useLayoutEffect, useReducer, useState, useEffect, useRef } from 'react';

// 用户状态 reducer
function userReducer(state: typeof initialState, action: { type: string; payload?: any }) {
  console.log(`🔄 reducer 执行: ${action.type}`, action.payload);
  
  switch (action.type) {
    case 'UPDATE_NAME':
      // 如果新名字和当前名字相同，返回原状态（触发 bailout）
      if (action.payload === state.name) {
        console.log('🎯 名字相同，触发 bailout');
        return state;
      }
      return { ...state, name: action.payload };
    
    case 'UPDATE_AGE':
      // 如果新年龄和当前年龄相同，返回原状态（触发 bailout）
      if (action.payload === state.age) {
        console.log('🎯 年龄相同，触发 bailout');
        return state;
      }
      return { ...state, age: action.payload };
    
    case 'INCREMENT_AGE':
      // 总是返回新状态（不会 bailout）
      return { ...state, age: state.age + 1 };
    
    case 'RESET':
      // 重置到初始状态
      return { ...initialState };
    
    case 'DEEP_UPDATE':
      // 深度更新测试
      if (action.payload.id === state.profile.id) {
        console.log('🎯 深度对象相同，触发 bailout');
        return state;
      }
      return { ...state, profile: action.payload };
    
    default:
      return state;
  }
}

const initialState = {
  name: '张三',
  age: 25,
  profile: {
    id: 1,
    level: '初级'
  }
};

function UserProfile() {
  const [user, dispatch] = useReducer(userReducer, initialState);
  const [inputName, setInputName] = useState(user.name);
  const [inputAge, setInputAge] = useState(user.age.toString());
  const [forceRenderCount, setForceRenderCount] = useState(0);
  
  const renderCount = useRef(0);
  renderCount.current++;

  // 用于检测提交阶段的 effect
  useEffect(() => {
    console.log('🟢 提交阶段：useEffect 执行 - DOM 已更新');
    console.log('----------------------------------------');
  });

  // 用于检测提交阶段的 layout effect
  useLayoutEffect(() => {
    console.log('🟡 提交阶段：useLayoutEffect 执行 - DOM 已更新');
  });

  console.log(`🔵 渲染阶段：第 ${renderCount.current} 次渲染`, {
    name: user.name,
    age: user.age,
    profile: user.profile
  });

  const handleUpdateSameName = () => {
    console.log('\n📤 动作：更新为相同名字');
    dispatch({ type: 'UPDATE_NAME', payload: user.name });
  };

  const handleUpdateDifferentName = () => {
    console.log('\n📤 动作：更新为不同名字');
    dispatch({ type: 'UPDATE_NAME', payload: user.name + '!' });
  };

  const handleUpdateSameAge = () => {
    console.log('\n📤 动作：更新为相同年龄');
    dispatch({ type: 'UPDATE_AGE', payload: user.age });
  };

  const handleIncrementAge = () => {
    console.log('\n📤 动作：增加年龄');
    dispatch({ type: 'INCREMENT_AGE' });
  };

  const handleCustomUpdate = () => {
    const newName = inputName.trim();
    const newAge = parseInt(inputAge) || user.age;
    
    console.log('\n📤 动作：自定义更新');
    dispatch({ type: 'UPDATE_NAME', payload: newName });
    dispatch({ type: 'UPDATE_AGE', payload: newAge });
  };

  const handleReset = () => {
    console.log('\n📤 动作：重置');
    dispatch({ type: 'RESET' });
    setInputName(initialState.name);
    setInputAge(initialState.age.toString());
  };

  const handleDeepUpdate = () => {
    console.log('\n📤 动作：深度更新');
    dispatch({ 
      type: 'DEEP_UPDATE', 
      payload: { id: 1, level: '初级' } // 相同对象
    });
  };

  const handleForceRender = () => {
    console.log('\n📤 动作：强制渲染');
    setForceRenderCount(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>useReducer Bailout 机制演示</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        margin: '10px 0', 
        borderRadius: '5px' 
      }}>
        <h2>当前用户状态</h2>
        <p><strong>名字:</strong> {user.name}</p>
        <p><strong>年龄:</strong> {user.age}</p>
        <p><strong>个人资料:</strong> ID: {user.profile.id}, 等级: {user.profile.level}</p>
        <p><strong>渲染次数:</strong> {renderCount.current}</p>
        <p><strong>强制渲染计数:</strong> {forceRenderCount}</p>
        {Math.random()}
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>Bailout 测试操作</h3>
        
        <div style={{ margin: '10px 0' }}>
          <button onClick={handleUpdateSameName} style={buttonStyle}>
            更新为相同名字 → bailout
          </button>
          <button onClick={handleUpdateDifferentName} style={buttonStyle}>
            更新为不同名字 → 提交
          </button>
        </div>

        <div style={{ margin: '10px 0' }}>
          <button onClick={handleUpdateSameAge} style={buttonStyle}>
            更新为相同年龄 → bailout
          </button>
          <button onClick={handleIncrementAge} style={buttonStyle}>
            增加年龄 → 提交
          </button>
        </div>

        <div style={{ margin: '10px 0' }}>
          <button onClick={handleDeepUpdate} style={buttonStyle}>
            深度相同更新 → bailout
          </button>
          <button onClick={handleReset} style={buttonStyle}>
            重置状态 → 提交
          </button>
        </div>

        <div style={{ margin: '10px 0' }}>
          <button onClick={handleForceRender} style={buttonStyle}>
            强制渲染父组件
          </button>
        </div>
      </div>

      <div style={{ 
        background: '#e8f4fd', 
        padding: '15px', 
        margin: '10px 0', 
        borderRadius: '5px' 
      }}>
        <h3>自定义更新</h3>
        <div style={{ margin: '10px 0' }}>
          <input
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="输入新名字"
            style={{ margin: '5px', padding: '5px' }}
          />
          <input
            type="number"
            value={inputAge}
            onChange={(e) => setInputAge(e.target.value)}
            placeholder="输入新年龄"
            style={{ margin: '5px', padding: '5px' }}
          />
          <button onClick={handleCustomUpdate} style={buttonStyle}>
            自定义更新
          </button>
        </div>
      </div>

      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        margin: '10px 0', 
        borderRadius: '5px' 
      }}>
        <h3>Bailout 机制说明</h3>
        <ul>
          <li>🔵 <strong>渲染阶段</strong>: 组件函数执行，计算虚拟DOM</li>
          <li>🎯 <strong>Bailout</strong>: reducer 返回相同状态对象时触发</li>
          <li>🟢 <strong>提交阶段</strong>: 只有状态真正改变时才执行</li>
          <li>📤 <strong>动作</strong>: 每次点击按钮都会触发渲染阶段</li>
        </ul>
        <p>
          <strong>观察控制台输出：</strong><br/>
          - bailout 时只有 "渲染阶段" 和 "reducer 执行" 日志<br/>
          - 真正更新时会有 "提交阶段" 日志
        </p>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: '5px',
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#fff',
  cursor: 'pointer'
};

export default UserProfile;
