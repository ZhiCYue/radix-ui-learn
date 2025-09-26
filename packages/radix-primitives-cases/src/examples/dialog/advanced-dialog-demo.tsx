import React, { useState } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

const AdvancedDialogDemo = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
    dueDate: '',
    assignee: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<Array<any>>([]);

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    } else if (formData.title.length > 50) {
      newErrors.title = '标题不能超过50个字符';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '描述不能为空';
    } else if (formData.description.length > 200) {
      newErrors.description = '描述不能超过200个字符';
    }

    if (!formData.category.trim()) {
      newErrors.category = '请选择分类';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = '请选择截止日期';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = '截止日期不能早于今天';
      }
    }

    if (!formData.assignee.trim()) {
      newErrors.assignee = '请选择负责人';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 模拟 API 调用
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // 模拟 API 调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟随机失败（20% 概率）
      if (Math.random() < 0.2) {
        throw new Error('服务器错误，请稍后重试');
      }
      
      console.log('🚀 提交数据到服务器:', formData);
      
      // 添加到任务列表
      const newTask = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      setTasks(prev => [newTask, ...prev]);
      
      alert(`✅ 创建成功！\n标题: ${formData.title}\n描述: ${formData.description}\n优先级: ${formData.priority}`);
      
      // 重置表单
      setFormData({ 
        title: '', 
        description: '', 
        priority: 'medium',
        category: '',
        dueDate: '',
        assignee: ''
      });
      setErrors({});
      setOpen(false);
      
    } catch (error) {
      console.error('❌ 提交失败:', error);
      alert(`提交失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'medium',
      category: '',
      dueDate: '',
      assignee: ''
    });
    setErrors({});
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          🚀 高级 Dialog 功能
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          演示带验证、异步提交、错误处理和加载状态的高级 Dialog 功能。
        </p>
      </header>

      {/* 任务列表 */}
      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ 
            margin: 0, 
            color: '#333',
            fontSize: '1.2rem'
          }}>
            任务列表 ({tasks.length})
          </h3>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="Button" style={{ background: '#17a2b8', color: 'white' }}>
                + 创建新任务
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="DialogOverlay" />
              <Dialog.Content className="DialogContent" style={{ maxWidth: '500px' }}>
                <Dialog.Title className="DialogTitle">创建新任务</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  填写任务详情，所有字段都是必填的。
                </Dialog.Description>
                
                {/* 表单字段 */}
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="task-title">
                    任务标题 *
                  </label>
                  <input 
                    className={`Input ${errors.title ? 'error' : ''}`}
                    id="task-title" 
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="请输入任务标题（最多50字符）"
                    disabled={loading}
                    maxLength={50}
                  />
                  {errors.title && (
                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                      {errors.title}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '2px' }}>
                    {formData.title.length}/50
                  </div>
                </fieldset>
                
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="task-description">
                    任务描述 *
                  </label>
                  <textarea 
                    className={`Input ${errors.description ? 'error' : ''}`}
                    id="task-description" 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="请详细描述任务内容（最多200字符）"
                    rows={4}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                    disabled={loading}
                    maxLength={200}
                  />
                  {errors.description && (
                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                      {errors.description}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '2px' }}>
                    {formData.description.length}/200
                  </div>
                </fieldset>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <fieldset className="Fieldset">
                    <label className="Label" htmlFor="task-priority">
                      优先级 *
                    </label>
                    <select 
                      className="Input"
                      id="task-priority" 
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      disabled={loading}
                    >
                      <option value="low">🟢 低优先级</option>
                      <option value="medium">🟡 中优先级</option>
                      <option value="high">🔴 高优先级</option>
                    </select>
                  </fieldset>

                  <fieldset className="Fieldset">
                    <label className="Label" htmlFor="task-category">
                      分类 *
                    </label>
                    <select 
                      className={`Input ${errors.category ? 'error' : ''}`}
                      id="task-category" 
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={loading}
                    >
                      <option value="">请选择分类</option>
                      <option value="development">开发</option>
                      <option value="design">设计</option>
                      <option value="testing">测试</option>
                      <option value="documentation">文档</option>
                      <option value="meeting">会议</option>
                    </select>
                    {errors.category && (
                      <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                        {errors.category}
                      </div>
                    )}
                  </fieldset>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <fieldset className="Fieldset">
                    <label className="Label" htmlFor="task-dueDate">
                      截止日期 *
                    </label>
                    <input 
                      className={`Input ${errors.dueDate ? 'error' : ''}`}
                      id="task-dueDate" 
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dueDate && (
                      <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                        {errors.dueDate}
                      </div>
                    )}
                  </fieldset>

                  <fieldset className="Fieldset">
                    <label className="Label" htmlFor="task-assignee">
                      负责人 *
                    </label>
                    <select 
                      className={`Input ${errors.assignee ? 'error' : ''}`}
                      id="task-assignee" 
                      value={formData.assignee}
                      onChange={(e) => handleInputChange('assignee', e.target.value)}
                      disabled={loading}
                    >
                      <option value="">请选择负责人</option>
                      <option value="张三">张三</option>
                      <option value="李四">李四</option>
                      <option value="王五">王五</option>
                      <option value="赵六">赵六</option>
                    </select>
                    {errors.assignee && (
                      <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                        {errors.assignee}
                      </div>
                    )}
                  </fieldset>
                </div>

                {/* 提交按钮 */}
                <div style={{ 
                  display: "flex", 
                  marginTop: 25, 
                  justifyContent: "flex-end",
                  gap: "12px"
                }}>
                  <button 
                    className="Button" 
                    onClick={handleCancel}
                    disabled={loading}
                    style={{ 
                      background: '#6c757d',
                      color: 'white',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    取消
                  </button>
                  <button 
                    className="Button" 
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ 
                      background: loading ? '#ccc' : '#28a745',
                      color: 'white',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      position: 'relative'
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{ opacity: 0.7 }}>创建中</span>
                        <span style={{ 
                          marginLeft: '8px',
                          display: 'inline-block',
                          animation: 'spin 1s linear infinite'
                        }}>
                          ⏳
                        </span>
                      </>
                    ) : (
                      '✅ 创建任务'
                    )}
                  </button>
                </div>
                
                <button 
                  className="IconButton" 
                  aria-label="Close"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  <Cross2Icon />
                </button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* 任务列表展示 */}
        <div style={{ 
          background: '#f8f9fa', 
          borderRadius: '8px', 
          border: '1px solid #e9ecef',
          minHeight: '200px'
        }}>
          {tasks.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6c757d' 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ margin: 0, fontSize: '16px' }}>暂无任务，点击上方按钮创建第一个任务</p>
            </div>
          ) : (
            <div style={{ padding: '20px' }}>
              {tasks.map((task, index) => (
                <div 
                  key={task.id}
                  style={{ 
                    background: 'white',
                    padding: '16px',
                    borderRadius: '6px',
                    marginBottom: index < tasks.length - 1 ? '12px' : 0,
                    border: '1px solid #dee2e6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: '#333', fontSize: '16px' }}>{task.title}</h4>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      background: task.priority === 'high' ? '#fee' : task.priority === 'medium' ? '#fff3cd' : '#d4edda',
                      color: task.priority === 'high' ? '#721c24' : task.priority === 'medium' ? '#856404' : '#155724'
                    }}>
                      {task.priority === 'high' ? '🔴 高' : task.priority === 'medium' ? '🟡 中' : '🟢 低'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{task.description}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6c757d' }}>
                    <span>📂 {task.category}</span>
                    <span>👤 {task.assignee}</span>
                    <span>📅 {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 功能说明 */}
      <section style={{ marginTop: '40px' }}>
        <div style={{ 
          padding: '20px', 
          background: '#fff3cd', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#856404' }}>✨ 高级特性</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            <li><strong>表单验证：</strong> 实时验证和错误提示</li>
            <li><strong>异步提交：</strong> 模拟 API 调用和加载状态</li>
            <li><strong>错误处理：</strong> 网络错误和业务错误处理</li>
            <li><strong>字符计数：</strong> 实时显示输入字符数</li>
            <li><strong>日期验证：</strong> 防止选择过去的日期</li>
            <li><strong>随机失败：</strong> 20% 概率模拟服务器错误</li>
          </ul>
        </div>
      </section>

      {/* 添加旋转动画 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .Input.error {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AdvancedDialogDemo;