import { ANIMATION_PHASE, CLIMBER_STATE, COLORS } from '../constants';
import { drawSpeechBubble } from './BubbleDrawer';

// 绘制小人
export const drawClimber = (
  ctx: CanvasRenderingContext2D, 
  climberPosition: { x: number, y: number },
  climberState: number,
  animationPhase: number,
  animationProgress: number,
  showBubble: boolean,
  bubbleText: string
) => {
  if (!ctx) return;
  
  const { x, y } = climberPosition;
  
  // 添加阴影效果
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // 时间戳用于各种动画效果
  const timestamp = Date.now();
  
  // 根据小人状态绘制
  switch (climberState) {
    case CLIMBER_STATE.STANDING:
      drawStandingClimber(ctx, x, y, timestamp);
      break;
    case CLIMBER_STATE.CLIMBING_ONE:
      if (animationPhase === ANIMATION_PHASE.PREPARE_TO_CLIMB) {
        // 准备爬楼梯的动作
        drawPreparingClimber(ctx, x, y, 1, timestamp);
      } else {
        // 正在爬楼梯的动作
        drawClimbingClimber(ctx, x, y, 1, animationProgress, timestamp);
      }
      break;
    case CLIMBER_STATE.CLIMBING_TWO:
      if (animationPhase === ANIMATION_PHASE.PREPARE_TO_CLIMB) {
        // 准备爬楼梯的动作
        drawPreparingClimber(ctx, x, y, 2, timestamp);
      } else {
        // 正在爬楼梯的动作
        drawClimbingClimber(ctx, x, y, 2, animationProgress, timestamp);
      }
      break;
    case CLIMBER_STATE.CELEBRATING:
      drawCelebratingClimber(ctx, x, y, timestamp);
      break;
    case CLIMBER_STATE.THINKING:
      drawThinkingClimber(ctx, x, y, timestamp);
      break;
  }
  
  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // 绘制对话气泡
  if (showBubble && bubbleText) {
    drawSpeechBubble(ctx, x + 30, y - 70, bubbleText);
  }
};

// 绘制准备爬楼梯的小人
export const drawPreparingClimber = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 1 | 2,
  timestamp: number
) => {
  // 使用脉动效果表示准备用力
  const pulseScale = 1 + 0.05 * Math.sin(timestamp / 150);
  
  // 设置主体颜色
  ctx.fillStyle = COLORS.CLIMBER;
  
  // 绘制身体
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pulseScale, pulseScale);
  
  // 身体 - 现代动画风格
  drawModernCharacterBody(ctx, type === 1 ? 0.1 : 0.2, timestamp);
  
  ctx.restore();
  
  // 绘制表情 - 专注表情
  drawFace(ctx, x, y - 28, 'focused', timestamp);
  
  // 绘制准备动作的特效
  drawPreparationEffect(ctx, x, y, type, timestamp);
};

// 绘制爬楼梯过程中的小人
export const drawClimbingClimber = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 1 | 2,
  progress: number,
  timestamp: number
) => {
  // 根据进度调整位置和角度
  const movePhase = Math.min(1, progress * 1.5); // 加速移动相位
  const rotatePhase = Math.sin(progress * Math.PI); // 旋转相位
  
  // 设置主体颜色
  ctx.fillStyle = COLORS.CLIMBER;
  
  // 保存上下文
  ctx.save();
  ctx.translate(x, y);
  
  // 添加小幅度晃动表示努力
  const effortShake = Math.sin(timestamp / 50) * 1.5 * Math.sin(progress * Math.PI);
  ctx.translate(effortShake, 0);
  
  // 身体倾斜 - 跟随移动进度
  const leanAngle = type === 1 ? 0.15 : 0.25; // 爬2阶倾斜更大
  ctx.rotate(Math.PI * leanAngle * rotatePhase);
  
  // 绘制身体
  drawModernCharacterBody(ctx, leanAngle * movePhase, timestamp);
  
  // 恢复上下文
  ctx.restore();
  
  // 绘制表情 - 根据进度变化
  if (progress < 0.4) {
    // 初期 - 专注
    drawFace(ctx, x, y - 28, 'focused', timestamp);
  } else if (progress < 0.7) {
    // 中期 - 努力
    drawFace(ctx, x, y - 28, 'effort', timestamp);
  } else {
    // 后期 - 接近成功
    drawFace(ctx, x, y - 28, 'almost', timestamp);
  }
  
  // 绘制攀爬动作的动态效果
  drawClimbingEffect(ctx, x, y, type, progress, timestamp);
};

// 绘制站立的小人
export const drawStandingClimber = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestamp: number
) => {
  // 轻微的呼吸效果
  const breatheScale = 1 + 0.01 * Math.sin(timestamp / 1000);
  
  // 设置主体颜色
  ctx.fillStyle = COLORS.CLIMBER;
  
  // 绘制身体
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(breatheScale, breatheScale);
  
  // 绘制现代风格的角色身体
  drawModernCharacterBody(ctx, 0, timestamp);
  
  ctx.restore();
  
  // 绘制表情 - 平静表情
  drawFace(ctx, x, y - 28, 'calm', timestamp);
  
  // 添加轻微的站立动画效果
  const slightMove = Math.sin(timestamp / 1500) * 2;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.ellipse(x, y + 25 + slightMove/3, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();
};

// 绘制庆祝的小人
export const drawCelebratingClimber = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestamp: number
) => {
  // 欢跃的脉动效果
  const jumpScale = 1 + 0.05 * Math.sin(timestamp / 200);
  const jumpHeight = 3 * Math.sin(timestamp / 200);
  
  // 设置主体颜色
  ctx.fillStyle = COLORS.CLIMBER;
  
  // 绘制身体
  ctx.save();
  ctx.translate(x, y - jumpHeight);
  ctx.scale(jumpScale, jumpScale);
  
  // 身体稍微后仰
  ctx.rotate(Math.PI * -0.05);
  
  // 绘制现代风格的角色身体
  drawModernCharacterBody(ctx, -0.1, timestamp);
  
  ctx.restore();
  
  // 绘制表情 - 开心表情
  drawFace(ctx, x, y - 28 - jumpHeight, 'happy', timestamp);
  
  // 绘制庆祝特效
  for (let i = 0; i < 5; i++) {
    const starTime = (timestamp / 300 + i * 50) % 1000;
    const starSize = Math.max(0, 10 - starTime / 100);
    if (starSize > 0) {
      const angle = (i / 5) * Math.PI * 2 + timestamp / 2000;
      const distance = 30 + starTime / 20;
      const starX = x + Math.cos(angle) * distance;
      const starY = y - 20 + Math.sin(angle) * distance;
      drawStar(ctx, starX, starY, starSize, 5);
    }
  }
  
  // 添加彩色粒子效果
  drawCelebrationParticles(ctx, x, y, timestamp);
};

// 绘制彩色粒子
function drawCelebrationParticles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestamp: number
) {
  const particles = 15;
  const colors = ['#FF5252', '#FFEB3B', '#2196F3', '#4CAF50', '#E040FB'];
  
  for (let i = 0; i < particles; i++) {
    const particlePhase = (timestamp / 50 + i * 100) % 1500;
    const particleLife = particlePhase / 1500;
    
    if (particleLife < 1) {
      const angle = (i / particles) * Math.PI * 2 + timestamp / 3000;
      const distance = 20 + particleLife * 40;
      const size = 4 * (1 - particleLife);
      
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y - 20 + Math.sin(angle) * distance - particleLife * 30;
      
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 1 - particleLife;
      ctx.beginPath();
      ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 重置透明度
  ctx.globalAlpha = 1;
}

// 绘制星星
export const drawStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  spikes: number
) => {
  let rotation = Math.PI / 2 * 3;
  let step = Math.PI / spikes;
  
  ctx.fillStyle = '#FFEB3B';
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  
  for (let i = 0; i < spikes; i++) {
    x = x + Math.cos(rotation) * radius;
    y = y + Math.sin(rotation) * radius;
    ctx.lineTo(x, y);
    rotation += step;
    
    x = x + Math.cos(rotation) * (radius * 0.4);
    y = y + Math.sin(rotation) * (radius * 0.4);
    ctx.lineTo(x, y);
    rotation += step;
  }
  
  ctx.lineTo(x, y - radius);
  ctx.closePath();
  ctx.fill();
};

// 绘制思考的小人
export const drawThinkingClimber = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestamp: number
) => {
  // 设置主体颜色
  ctx.fillStyle = COLORS.CLIMBER;
  
  // 绘制身体
  ctx.save();
  ctx.translate(x, y);
  
  // 身体略微左右摇晃
  const swayAngle = Math.sin(timestamp / 800) * 0.03;
  ctx.rotate(swayAngle);
  
  // 绘制现代风格的角色身体
  drawModernCharacterBody(ctx, 0, timestamp);
  
  ctx.restore();
  
  // 绘制表情 - 思考表情
  drawFace(ctx, x, y - 28, 'thinking', timestamp);
  
  // 绘制思考的气泡
  drawThoughtBubbles(ctx, x + 15, y - 45, timestamp);
};

// 绘制思考泡泡
function drawThoughtBubbles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestamp: number
) {
  const bubbleSizes = [3, 5, 8];
  const bubbleOffsets = [0, 8, 18];
  
  // 泡泡上升动画
  const floatOffset = Math.sin(timestamp / 500) * 2;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  
  // 绘制三个逐渐变大的思考泡泡
  for (let i = 0; i < 3; i++) {
    const size = bubbleSizes[i];
    const offset = bubbleOffsets[i];
    const bubbleX = x + offset;
    const bubbleY = y - offset - floatOffset * (i * 0.5 + 0.5);
    
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(bubbleX - size * 0.3, bubbleY - size * 0.3, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  }
}

// 绘制现代风格的角色身体
function drawModernCharacterBody(
  ctx: CanvasRenderingContext2D,
  leanFactor: number,
  timestamp: number
) {
  // 添加微小的呼吸效果
  const breathe = Math.sin(timestamp / 800) * 0.02;
  
  // 绘制头部 - 使用渐变效果
  const headGradient = ctx.createRadialGradient(0, -28, 0, 0, -28, 12);
  headGradient.addColorStop(0, '#FF9800');
  headGradient.addColorStop(1, '#F57C00');
  ctx.fillStyle = headGradient;
  
  ctx.beginPath();
  ctx.arc(0, -28, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // 绘制身体 - 使用圆角和渐变
  const bodyGradient = ctx.createLinearGradient(-8, -15, 8, 10);
  bodyGradient.addColorStop(0, '#2196F3');
  bodyGradient.addColorStop(1, '#1565C0');
  ctx.fillStyle = bodyGradient;
  
  // 身体 - 圆角矩形
  roundRect(ctx, -8, -15, 16, 30, 5);
  ctx.fill();
  
  // 绘制胳膊
  ctx.fillStyle = '#1976D2';
  
  // 左胳膊
  ctx.save();
  ctx.translate(-8, -8);
  ctx.rotate(Math.PI / 4 + breathe + leanFactor);
  roundRect(ctx, -5, -3, 15, 6, 3);
  ctx.fill();
  ctx.restore();
  
  // 右胳膊
  ctx.save();
  ctx.translate(8, -8);
  ctx.rotate(-Math.PI / 4 - breathe - leanFactor);
  roundRect(ctx, -10, -3, 15, 6, 3);
  ctx.fill();
  ctx.restore();
  
  // 绘制腿部
  ctx.fillStyle = '#0D47A1';
  
  // 左腿
  ctx.save();
  ctx.translate(-5, 15);
  ctx.rotate(-Math.PI / 16 + breathe * 2 + leanFactor);
  roundRect(ctx, -3, 0, 6, 18, 3);
  ctx.fill();
  ctx.restore();
  
  // 右腿
  ctx.save();
  ctx.translate(5, 15);
  ctx.rotate(Math.PI / 16 - breathe * 2 - leanFactor);
  roundRect(ctx, -3, 0, 6, 18, 3);
  ctx.fill();
  ctx.restore();
}

// 绘制圆角矩形
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 绘制不同的表情
function drawFace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  expression: 'calm' | 'focused' | 'effort' | 'almost' | 'happy' | 'thinking',
  timestamp: number
) {
  // 表情动画参数
  const blinkInterval = 3000; // 眨眼间隔
  const isBlinking = (timestamp % blinkInterval) < 150; // 眨眼持续时间
  
  // 绘制眼睛
  ctx.fillStyle = 'white';
  
  if (isBlinking) {
    // 眨眼状态
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x - 1, y);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 1, y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    // 绘制眼白
    ctx.beginPath();
    ctx.arc(x - 3, y, 3, 0, Math.PI * 2);
    ctx.arc(x + 3, y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制眼珠 - 根据表情移动
    ctx.fillStyle = 'black';
    
    let eyeXOffset = 0;
    let eyeYOffset = 0;
    
    switch (expression) {
      case 'thinking':
        eyeXOffset = 1;
        eyeYOffset = -1;
        break;
      case 'focused':
        eyeXOffset = 0.5;
        eyeYOffset = 0;
        break;
      case 'effort':
        eyeXOffset = 0.8;
        eyeYOffset = 0.5;
        break;
      case 'almost':
        eyeXOffset = 1;
        eyeYOffset = -0.5;
        break;
      case 'happy':
        eyeXOffset = 0;
        eyeYOffset = 0;
        break;
    }
    
    ctx.beginPath();
    ctx.arc(x - 3 + eyeXOffset, y + eyeYOffset, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 3 + eyeXOffset, y + eyeYOffset, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 绘制嘴巴 - 根据表情变化
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1.5;
  
  switch (expression) {
    case 'calm':
      // 平静的微笑
      ctx.beginPath();
      ctx.arc(x, y + 6, 3, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.stroke();
      break;
    
    case 'focused':
      // 专注的表情 - 直线嘴
      ctx.beginPath();
      ctx.moveTo(x - 3, y + 5);
      ctx.lineTo(x + 3, y + 5);
      ctx.stroke();
      break;
    
    case 'effort':
      // 用力的表情
      ctx.beginPath();
      ctx.arc(x, y + 6, 3, 0.8 * Math.PI, 0.2 * Math.PI, true);
      ctx.stroke();
      break;
    
    case 'almost':
      // 即将成功的表情 - 微张嘴
      ctx.beginPath();
      ctx.arc(x, y + 6, 2, 0, Math.PI, false);
      ctx.stroke();
      break;
    
    case 'happy':
      // 开心的表情 - 大笑
      ctx.beginPath();
      ctx.arc(x, y + 5, 4, 0, Math.PI, false);
      ctx.stroke();
      break;
    
    case 'thinking':
      // 思考的表情 - 嘴角一边上扬
      ctx.beginPath();
      ctx.moveTo(x - 3, y + 5);
      ctx.quadraticCurveTo(x, y + 4, x + 3, y + 6);
      ctx.stroke();
      break;
  }
}

// 绘制准备动作的特效
function drawPreparationEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 1 | 2,
  timestamp: number
) {
  // 动态线条表示蓄力
  ctx.strokeStyle = 'rgba(255, 193, 7, 0.7)';
  ctx.lineWidth = 2;
  
  const lineCount = type === 1 ? 3 : 5; // 爬2阶显示更多线条
  
  for (let i = 0; i < lineCount; i++) {
    const timeOffset = timestamp / 300 + i * 100;
    const alpha = 0.7 * Math.max(0, 1 - (timeOffset % 1000) / 1000);
    
    if (alpha > 0) {
      const angle = (i / lineCount) * Math.PI - Math.PI / 2;
      const distance = 20 + (timeOffset % 1000) / 50;
      
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(
        x + Math.cos(angle) * 15,
        y + Math.sin(angle) * 15
      );
      ctx.lineTo(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance
      );
      ctx.stroke();
    }
  }
  
  // 恢复透明度
  ctx.globalAlpha = 1;
}

// 绘制攀爬动作的动态效果
function drawClimbingEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 1 | 2,
  progress: number,
  timestamp: number
) {
  // 动态显示力量线条
  if (progress > 0.2 && progress < 0.8) {
    ctx.strokeStyle = 'rgba(255, 152, 0, 0.7)';
    ctx.lineWidth = 3;
    
    const effortIntensity = Math.sin(progress * Math.PI); // 中间最强
    const lineCount = type === 1 ? 4 : 6; // 爬2阶显示更多线条
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2 + timestamp / 500;
      const distance = 12 + 8 * effortIntensity;
      
      ctx.globalAlpha = effortIntensity * 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance
      );
      ctx.stroke();
    }
    
    // 恢复透明度
    ctx.globalAlpha = 1;
  }
  
  // 添加运动线条
  if (progress > 0.1) {
    ctx.strokeStyle = 'rgba(33, 150, 243, 0.5)';
    ctx.lineWidth = 2;
    
    const direction = type === 1 ? 1 : 1.5; // 爬2阶的线条更长
    const moveLines = 3;
    
    for (let i = 0; i < moveLines; i++) {
      const lineProgress = (progress + i / moveLines) % 1;
      if (lineProgress < 0.8) {
        const alpha = 0.5 * (1 - lineProgress / 0.8);
        const length = 20 * direction * (1 - lineProgress / 0.8);
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(
          x - 10 + lineProgress * 20,
          y + 20 - lineProgress * 40 * direction
        );
        ctx.lineTo(
          x - 10 + lineProgress * 20 - length,
          y + 20 - lineProgress * 40 * direction + length / 2
        );
        ctx.stroke();
      }
    }
    
    // 恢复透明度
    ctx.globalAlpha = 1;
  }
} 