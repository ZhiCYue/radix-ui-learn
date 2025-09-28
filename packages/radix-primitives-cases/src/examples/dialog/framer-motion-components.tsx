import React, { useState } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';

// 惯性拖拽示例
export const InertiaDragDialog = () => {
  const [open, setOpen] = useState(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  // 基于拖拽位置的旋转效果
  const rotate = useTransform(dragX, [-200, 200], [-10, 10]);
  const scale = useTransform(dragX, [-200, 0, 200], [0.9, 1, 0.9]);

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#28a745', color: 'white' }}>
            打开惯性拖拽 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <AnimatePresence>
            {open && (
              <Dialog.Content asChild>
                <motion.div
                  className="DialogContent"
                  drag
                  dragMomentum={true}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                  dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    rotate: rotate,
                    scale: scale,
                    maxWidth: '400px',
                    margin: 0,
                    border: '2px solid #28a745'
                  }}
                  initial={{ opacity: 0, x: '-50%', y: '-50%', rotateX: -90 }}
                  animate={{ opacity: 1, x: '-50%', y: '-50%', rotateX: 0 }}
                  exit={{ opacity: 0, x: '-50%', y: '-50%', rotateX: -90 }}
                  onDrag={(event, info) => {
                    dragX.set(info.offset.x);
                    dragY.set(info.offset.y);
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  whileDrag={{ 
                    cursor: 'grabbing',
                    boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
                  }}
                >
                  <motion.div 
                    style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.div
                        animate={{ 
                          x: [0, 5, -5, 0],
                          y: [0, -2, 2, 0]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        <DragHandleDots2Icon />
                      </motion.div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>惯性拖拽 Dialog</span>
                    </div>
                    <Dialog.Close asChild>
                      <motion.button 
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          border: 'none',
                          color: 'white',
                          padding: '4px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: 180,
                          backgroundColor: 'rgba(255,255,255,0.3)' 
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Cross2Icon />
                      </motion.button>
                    </Dialog.Close>
                  </motion.div>

                  <Dialog.Title className="DialogTitle">惯性拖拽效果</Dialog.Title>
                  <Dialog.Description className="DialogDescription">
                    这个 Dialog 具有惯性拖拽效果，快速拖拽后会继续滑行一段距离。
                  </Dialog.Description>
                  
                  <div style={{ marginTop: '16px' }}>
                    <strong>🚀 惯性功能：</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      <li><strong>惯性滑行：</strong> dragMomentum=true 启用惯性</li>
                      <li><strong>弹跳效果：</strong> 碰到边界时的弹跳动画</li>
                      <li><strong>动态变换：</strong> 基于位置的旋转和缩放</li>
                      <li><strong>3D 动画：</strong> rotateX 实现翻转效果</li>
                    </ul>
                  </div>

                  <motion.div 
                    style={{ 
                      marginTop: '16px',
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    animate={{ 
                      borderColor: ['#dee2e6', '#28a745', '#dee2e6'],
                      borderWidth: ['1px', '2px', '1px']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div><strong>Motion Values:</strong></div>
                    <div>拖拽 X: {Math.round(dragX.get())}, Y: {Math.round(dragY.get())}</div>
                    <div>旋转: {Math.round(rotate.get())}°, 缩放: {scale.get().toFixed(2)}</div>
                  </motion.div>

                  <div style={{ 
                    display: "flex", 
                    marginTop: 20, 
                    justifyContent: "flex-end"
                  }}>
                    <Dialog.Close asChild>
                      <motion.button 
                        className="Button green"
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                          boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)"
                        }}
                        whileTap={{ scale: 0.95, y: 0 }}
                      >
                        关闭
                      </motion.button>
                    </Dialog.Close>
                  </div>
                </motion.div>
              </Dialog.Content>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#d4edda', 
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #c3e6cb'
      }}>
        <div><strong>🚀 惯性配置：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>dragMomentum=true</code> 启用惯性滑行</li>
          <li><code>useMotionValue</code> 创建动画值</li>
          <li><code>useTransform</code> 基于位置计算变换</li>
          <li>支持自定义弹跳参数和阻尼</li>
        </ul>
      </div>
    </div>
  );
};

// 高级动画示例
export const AdvancedAnimationDialog = () => {
  const [open, setOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const themeColors = {
    light: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: 'white',
      border: '#667eea'
    },
    dark: {
      bg: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      text: 'white',
      border: '#2c3e50'
    }
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#dc3545', color: 'white' }}>
            打开高级动画 Dialog
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <AnimatePresence>
            {open && (
              <Dialog.Content asChild>
                <motion.div
                  className="DialogContent"
                  drag
                  dragConstraints={{ left: -250, right: 250, top: -180, bottom: 180 }}
                  layout
                  initial={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    rotateY: -90,
                    z: -1000,
                    x: '-50%',
                    y: '-50%'
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotateY: 0,
                    z: 0,
                    x: '-50%',
                    y: '-50%'
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    rotateY: 90,
                    z: -1000,
                    x: '-50%',
                    y: '-50%'
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20,
                    duration: 0.6
                  }}
                  whileDrag={{ 
                    scale: 1.02,
                    rotateZ: 5,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.3)"
                  }}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    maxWidth: '500px',
                    height: isMinimized ? '60px' : 'auto',
                    overflow: isMinimized ? 'hidden' : 'visible',
                    margin: 0,
                    border: `2px solid ${themeColors[theme].border}`,
                    perspective: '1000px'
                  }}
                >
                  {/* 动态标题栏 */}
                  <motion.div 
                    style={{
                      padding: '12px',
                      background: themeColors[theme].bg,
                      color: themeColors[theme].text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: isMinimized ? 0 : '16px'
                    }}
                    animate={{ 
                      background: themeColors[theme].bg
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <DragHandleDots2Icon />
                      </motion.div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>高级动画 Dialog</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* 主题切换按钮 */}
                      <motion.button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          border: 'none',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: 'rgba(255,255,255,0.3)'
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {theme === 'light' ? '🌙' : '☀️'}
                      </motion.button>
                      
                      {/* 最小化按钮 */}
                      <motion.button 
                        onClick={() => setIsMinimized(!isMinimized)}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          border: 'none',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: 'rgba(255,255,255,0.3)'
                        }}
                        whileTap={{ scale: 0.9 }}
                        animate={{ rotate: isMinimized ? 180 : 0 }}
                      >
                        {isMinimized ? '📈' : '📉'}
                      </motion.button>
                      
                      <Dialog.Close asChild>
                        <motion.button 
                          style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            padding: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 90,
                            backgroundColor: 'rgba(255,0,0,0.3)' 
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Cross2Icon />
                        </motion.button>
                      </Dialog.Close>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {!isMinimized && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ padding: '0 16px' }}
                      >
                        <Dialog.Title className="DialogTitle">高级动画效果</Dialog.Title>
                        <Dialog.Description className="DialogDescription">
                          这个 Dialog 展示了 Framer Motion 的高级动画功能，包括 3D 变换、布局动画等。
                        </Dialog.Description>
                        
                        <div style={{ marginTop: '16px' }}>
                          <strong>✨ 高级功能：</strong>
                          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                            <li><strong>3D 变换：</strong> rotateY 和 perspective 实现 3D 效果</li>
                            <li><strong>布局动画：</strong> layout 属性自动处理尺寸变化</li>
                            <li><strong>主题切换：</strong> 动态颜色过渡动画</li>
                            <li><strong>最小化：</strong> 高度和透明度的联合动画</li>
                          </ul>
                        </div>

                        {/* 动画演示区域 */}
                        <motion.div 
                          style={{ 
                            marginTop: '16px',
                            padding: '16px',
                            background: theme === 'light' ? '#f8f9fa' : '#2c3e50',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          animate={{ 
                            backgroundColor: theme === 'light' ? '#f8f9fa' : '#2c3e50',
                            color: theme === 'light' ? '#333' : '#ecf0f1'
                          }}
                          layout
                        >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                            <motion.div
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
                              }}
                              animate={{ 
                                rotate: 360,
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                              }}
                            />
                            <motion.div
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                background: 'linear-gradient(45deg, #a8e6cf, #ffd93d)'
                              }}
                              animate={{ 
                                x: [0, 20, 0],
                                rotateZ: [0, 180, 360]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                            />
                            <motion.div
                              style={{
                                width: '20px',
                                height: '20px',
                                background: 'linear-gradient(45deg, #ff9a9e, #fecfef)'
                              }}
                              animate={{ 
                                borderRadius: ['0%', '50%', '0%'],
                                y: [0, -10, 0]
                              }}
                              transition={{ 
                                duration: 1.8, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                            />
                          </div>
                          
                          <div><strong>当前主题：</strong> {theme === 'light' ? '浅色' : '深色'}</div>
                          <div><strong>状态：</strong> {isMinimized ? '最小化' : '正常'}</div>
                        </motion.div>

                        <div style={{ 
                          display: "flex", 
                          marginTop: 20, 
                          justifyContent: "flex-end",
                          paddingBottom: '16px'
                        }}>
                          <Dialog.Close asChild>
                            <motion.button 
                              className="Button green"
                              whileHover={{ 
                                scale: 1.05,
                                y: -3,
                                boxShadow: "0 10px 25px rgba(40, 167, 69, 0.4)"
                              }}
                              whileTap={{ 
                                scale: 0.95, 
                                y: 0 
                              }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              关闭
                            </motion.button>
                          </Dialog.Close>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Dialog.Content>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#f8d7da', 
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #f5c6cb'
      }}>
        <div><strong>✨ 高级特性：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>layout</code> 属性自动处理布局变化动画</li>
          <li><code>AnimatePresence</code> 处理条件渲染的动画</li>
          <li>3D 变换和透视效果</li>
          <li>复杂的组合动画和状态管理</li>
        </ul>
      </div>
    </div>
  );
};