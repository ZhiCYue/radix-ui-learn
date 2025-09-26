import React, { useState } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

// 用户数据类型
interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
}

const BasicDialogDemo = () => {
  // 用户数据状态
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Pedro Duarte",
    username: "@peduarte", 
    email: "pedro@example.com",
    bio: "Frontend Developer"
  });

  // Dialog 开关状态
  const [open, setOpen] = useState(false);

  // 表单数据状态（用于编辑时的临时数据）
  const [formData, setFormData] = useState<UserProfile>(userProfile);

  // 处理输入变化
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理保存
  const handleSave = () => {
    console.log('💾 保存用户数据:', formData);
    
    // 更新用户数据
    setUserProfile(formData);
    
    // 显示保存成功提示
    alert(`✅ 保存成功！\n姓名: ${formData.name}\n用户名: ${formData.username}\n邮箱: ${formData.email}\n简介: ${formData.bio}`);
    
    // 关闭 Dialog
    setOpen(false);
  };

  // 处理取消
  const handleCancel = () => {
    console.log('❌ 取消编辑，恢复原始数据');
    
    // 恢复原始数据
    setFormData(userProfile);
    
    // 关闭 Dialog
    setOpen(false);
  };

  // 当 Dialog 打开时，重置表单数据为当前用户数据
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      console.log('📝 打开编辑对话框，加载当前数据');
      setFormData(userProfile);
    }
  };

  return (
    <div>
      {/* 页面标题 */}
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#333',
          fontSize: '1.8rem'
        }}>
          📝 基础 Dialog 使用
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          演示基本的 Dialog 组件使用，包括表单数据处理、状态管理和用户交互。
        </p>
      </header>

      {/* 当前用户信息展示 */}
      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#333',
          fontSize: '1.2rem'
        }}>
          当前用户信息
        </h3>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <strong style={{ minWidth: '80px', color: '#495057' }}>姓名:</strong> 
              <span style={{ color: '#333' }}>{userProfile.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <strong style={{ minWidth: '80px', color: '#495057' }}>用户名:</strong> 
              <span style={{ color: '#333' }}>{userProfile.username}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <strong style={{ minWidth: '80px', color: '#495057' }}>邮箱:</strong> 
              <span style={{ color: '#333' }}>{userProfile.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <strong style={{ minWidth: '80px', color: '#495057' }}>简介:</strong> 
              <span style={{ color: '#333' }}>{userProfile.bio}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dialog 组件 */}
      <section>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#333',
          fontSize: '1.2rem'
        }}>
          编辑用户信息
        </h3>
        
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
          <Dialog.Trigger asChild>
            <button className="Button violet">Edit profile</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
              <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>
              <Dialog.Description className="DialogDescription">
                Make changes to your profile here. Click save when you're done.
              </Dialog.Description>
              
              {/* 表单字段 */}
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="name">
                  Name
                </label>
                <input 
                  className="Input" 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入姓名"
                />
              </fieldset>
              
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="username">
                  Username
                </label>
                <input 
                  className="Input" 
                  id="username" 
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="请输入用户名"
                />
              </fieldset>

              <fieldset className="Fieldset">
                <label className="Label" htmlFor="email">
                  Email
                </label>
                <input 
                  className="Input" 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="请输入邮箱"
                />
              </fieldset>

              <fieldset className="Fieldset">
                <label className="Label" htmlFor="bio">
                  Bio
                </label>
                <textarea 
                  className="Input" 
                  id="bio" 
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="请输入个人简介"
                  rows={3}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </fieldset>

              {/* 按钮组 */}
              <div style={{ 
                display: "flex", 
                marginTop: 25, 
                justifyContent: "flex-end",
                gap: "12px"
              }}>
                <button 
                  className="Button" 
                  onClick={handleCancel}
                  style={{ 
                    background: '#6c757d',
                    color: 'white'
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="Button green" 
                  onClick={handleSave}
                >
                  Save changes
                </button>
              </div>
              
              {/* 关闭按钮 */}
              <button 
                className="IconButton" 
                aria-label="Close"
                onClick={handleCancel}
              >
                <Cross2Icon />
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      {/* 功能说明 */}
      <section style={{ marginTop: '40px' }}>
        <div style={{ 
          padding: '20px', 
          background: '#e7f3ff', 
          borderRadius: '8px',
          border: '1px solid #b3d9ff'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#0066cc' }}>💡 功能说明</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#004080' }}>
            <li><strong>数据获取</strong>：点击 Save changes 时，通过 handleSave 函数获取表单数据</li>
            <li><strong>状态管理</strong>：使用 useState 管理用户数据和表单数据</li>
            <li><strong>数据同步</strong>：打开 Dialog 时加载当前数据，取消时恢复原始数据</li>
            <li><strong>表单验证</strong>：可以在 handleSave 中添加验证逻辑</li>
            <li><strong>API 调用</strong>：可以在 handleSave 中调用 API 保存到服务器</li>
          </ul>
        </div>
      </section>

      {/* 代码示例 */}
      <section style={{ marginTop: '30px' }}>
        <details style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <summary style={{ 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '16px'
          }}>
            📋 查看核心代码
          </summary>
          <pre style={{ 
            background: '#fff', 
            padding: '16px', 
            borderRadius: '4px', 
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.4',
            border: '1px solid #e9ecef'
          }}>
{`// 核心状态管理
const [userProfile, setUserProfile] = useState<UserProfile>({...});
const [formData, setFormData] = useState<UserProfile>(userProfile);

// 数据处理函数
const handleSave = () => {
  console.log('💾 保存用户数据:', formData);
  setUserProfile(formData);  // 更新主数据
  setOpen(false);           // 关闭弹框
};

// Dialog 组件结构
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <button>Edit profile</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>...</Dialog.Description>
      {/* 表单内容 */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`}
          </pre>
        </details>
      </section>
    </div>
  );
};

export default BasicDialogDemo;