import React, { useState } from "react";
import * as Dialog from "../../react/dialog";
import { Cross2Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { InertiaDragDialog, AdvancedAnimationDialog } from './framer-motion-components';
import "./styles.css";

const FramerMotionDemo = () => {
  return (
    <div>
      {/* 页面标题 */}
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#333',
          fontSize: '1.8rem'
        }}>
          🎬 Framer Motion 集成示例
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          使用 Framer Motion 实现丰富的动画效果和拖拽功能，适合需要动画的项目。
        </p>
      </header>

      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>🚀 Framer Motion 特性</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>✨ 动画功能</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>声明式动画</li>
              <li>手势识别</li>
              <li>布局动画</li>
              <li>SVG 路径动画</li>
              <li>弹簧物理引擎</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>🎯 拖拽特性</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>内置拖拽支持</li>
              <li>拖拽约束</li>
              <li>弹性效果</li>
              <li>惯性滚动</li>
              <li>拖拽事件回调</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 基础拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🖱️ 1. 基础拖拽动画</h2>
        <BasicFramerMotionDialog />
      </section>

      {/* 弹性拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🎈 2. 弹性拖拽效果</h2>
        <ElasticDragDialog />
      </section>

      {/* 惯性拖拽示例 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>🚀 3. 惯性拖拽效果</h2>
        <InertiaDragDialog />
      </section>

      {/* 高级动画示例 */}
      <section>
        <h2>✨ 4. 高级动画效果</h2>
        <AdvancedAnimationDialog />
      </section>
    </div>
  );
};

// 基础拖拽动画示例
const BasicFramerMotionDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button violet">打开基础动画 Dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <AnimatePresence>
            {open && (
              <Dialog.Content asChild>
                <motion.div
                  className="DialogContent"
                  drag
                  dragMomentum={false}
                  initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
                  animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  whileDrag={{ 
                    scale: 1.05,
                    rotate: 2,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    maxWidth: '400px',
                    margin: 0,
                    cursor: 'grab'
                  }}
                >
                  {/* 拖拽指示器 */}
                  <div style={{
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                    borderRadius: '6px 6px 0 0'
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <DragHandleDots2Icon />
                    </motion.div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>拖拽我 - Framer Motion</span>
                  </div>

                  <Dialog.Title className="DialogTitle">Framer Motion 基础示例</Dialog.Title>
                  <Dialog.Description className="DialogDescription">
                    这个 Dialog 使用 Framer Motion 实现拖拽和动画效果。整个 Dialog 都可以拖拽。
                  </Dialog.Description>
                  
                  <div style={{ marginTop: '16px' }}>
                    <strong>🎬 动画特点：</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      <li><strong>入场动画：</strong> 缩放 + 透明度 + 位移</li>
                      <li><strong>拖拽反馈：</strong> 缩放 + 旋转 + 阴影</li>
                      <li><strong>弹簧动画：</strong> 自然的物理效果</li>
                      <li><strong>旋转图标：</strong> 持续旋转的拖拽图标</li>
                    </ul>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    marginTop: 25, 
                    justifyContent: "flex-end"
                  }}>
                    <Dialog.Close asChild>
                      <motion.button 
                        className="Button green"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        关闭
                      </motion.button>
                    </Dialog.Close>
                  </div>

                  <Dialog.Close asChild>
                    <motion.button 
                      className="IconButton" 
                      aria-label="Close"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Cross2Icon />
                    </motion.button>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#e7f3ff', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <div><strong>💡 实现要点：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>drag</code> 属性启用拖拽功能</li>
          <li><code>whileDrag</code> 定义拖拽时的样式</li>
          <li><code>AnimatePresence</code> 处理进入/退出动画</li>
          <li><code>motion.div</code> 替换普通 div 元素</li>
        </ul>
      </div>
    </div>
  );
};

// 弹性拖拽示例
const ElasticDragDialog = () => {
  const [open, setOpen] = useState(false);
  const [dragInfo, setDragInfo] = useState({ x: 0, y: 0 });

  const handleDrag = (event: any, info: PanInfo) => {
    setDragInfo({ x: Math.round(info.point.x), y: Math.round(info.point.y) });
  };

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="Button" style={{ background: '#17a2b8', color: 'white' }}>
            打开弹性拖拽 Dialog
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
                  dragElastic={0.2}
                  dragConstraints={{ left: -200, right: 200, top: -150, bottom: 150 }}
                  onDrag={handleDrag}
                  initial={{ opacity: 0, scale: 0.5, rotate: -10, x: '-50%', y: '-50%' }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 10, x: '-50%', y: '-50%' }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                  whileDrag={{ 
                    scale: 1.1,
                    rotate: [0, -2, 2, -2, 0],
                    transition: { rotate: { repeat: Infinity, duration: 0.2 } }
                  }}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    maxWidth: '450px',
                    margin: 0,
                    border: '2px solid #17a2b8'
                  }}
                >
                  <motion.div 
                    style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}
                    whileHover={{ backgroundColor: '#138496' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        <DragHandleDots2Icon />
                      </motion.div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>弹性拖拽 Dialog</span>
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
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Cross2Icon />
                      </motion.button>
                    </Dialog.Close>
                  </motion.div>

                  <Dialog.Title className="DialogTitle">弹性拖拽效果</Dialog.Title>
                  <Dialog.Description className="DialogDescription">
                    这个 Dialog 具有弹性拖拽效果，到达边界时会有弹性反弹。
                  </Dialog.Description>
                  
                  <div style={{ marginTop: '16px' }}>
                    <strong>🎈 弹性功能：</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      <li><strong>弹性约束：</strong> dragElastic=0.2 设置弹性系数</li>
                      <li><strong>边界限制：</strong> dragConstraints 设置拖拽边界</li>
                      <li><strong>摆动效果：</strong> 拖拽时的左右摆动动画</li>
                      <li><strong>弹簧回弹：</strong> 释放时的弹性回弹效果</li>
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
                    animate={{ backgroundColor: ['#f8f9fa', '#e3f2fd', '#f8f9fa'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div><strong>鼠标位置：</strong> x: {dragInfo.x}, y: {dragInfo.y}</div>
                    <div><strong>约束范围：</strong> x: [-200, 200], y: [-150, 150]</div>
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
                          boxShadow: "0 5px 15px rgba(40, 167, 69, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
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
        background: '#fff3cd', 
        borderRadius: '4px',
        fontSize: '14px',
        border: '1px solid #ffeaa7'
      }}>
        <div><strong>🎈 弹性配置：</strong></div>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>dragElastic=0.2</code> 设置弹性系数 (0-1)</li>
          <li><code>dragConstraints</code> 设置拖拽边界</li>
          <li>弹性系数越大，超出边界时拖拽距离越远</li>
          <li>释放时会自动弹回边界内</li>
        </ul>
      </div>
    </div>
  );
};

export default FramerMotionDemo;