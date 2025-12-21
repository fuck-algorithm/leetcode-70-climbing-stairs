import { COLORS } from '../constants';

// 绘制楼梯 - 沙雕风格版本
export const drawStairs = (
  ctx: CanvasRenderingContext2D,
  stairsPositions: { x: number, y: number }[],
  width: number,
  height: number,
  stepStatuses: ('uncalculated' | 'calculating' | 'calculated')[] | undefined,
  values: number[] | undefined,
  calculatingStep: number | null,
  currentStep: number,
  climberState: number,
  animationPhase: number,
  currentStairIndex: number,
  _animationInProgress: boolean
) => {
  // 保留_animationInProgress以备将来使用
  void _animationInProgress;
  if (!stairsPositions || stairsPositions.length === 0) {
    console.warn("楼梯位置数组为空");
    return;
  }
  
  // 获取当前时间戳用于动画效果
  const timestamp = Date.now();
  
  // 绘制沙雕背景 - 添加渐变色背景
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#E1F5FE'); // 顶部浅蓝色
  gradient.addColorStop(1, '#B3E5FC'); // 底部稍深蓝色
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 绘制卡通云朵
  drawClouds(ctx, width, height, timestamp);
  
  // 绘制基础楼梯 
  stairsPositions.forEach((pos, i) => {
    // 楼梯阶梯 - 随着高度增加，宽度略微变小，并有轻微左右摆动
    const wobble = Math.sin(timestamp / 2000 + i * 0.5) * 5; // 摆动效果
    const stepWidth = Math.min(width * 0.6, 120) - (i * 4);
    
    // 绘制阶梯阴影 - 更立体的效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.rect(pos.x - stepWidth / 2 + wobble + 5, pos.y + 5, stepWidth, 30);
    ctx.fill();
    
    // 根据阶梯状态设置颜色
    if (stepStatuses && i < stepStatuses.length) {
      if (stepStatuses[i] === 'calculated') {
        // 已计算的阶梯 - 添加脉动效果
        const pulseVal = Math.sin(timestamp / 500 + i) * 15;
        ctx.fillStyle = `hsl(122, ${60 + pulseVal}%, ${45 + pulseVal/2}%)`; // 动态绿色
      } else if (stepStatuses[i] === 'calculating') {
        // 正在计算的阶梯 - 添加闪烁效果
        const flashVal = Math.sin(timestamp / 200) * 20;
        ctx.fillStyle = `hsl(40, ${80 + flashVal}%, ${65 + flashVal/3}%)`; // 动态黄色
      } else {
        // 未计算阶梯 - 柔和的灰色
        ctx.fillStyle = COLORS.UNCALCULATED;
      }
    } else {
      ctx.fillStyle = COLORS.UNCALCULATED;
    }
    
    // 绘制阶梯 - 圆角矩形更卡通
    roundRect(
      ctx, 
      pos.x - stepWidth / 2 + wobble, 
      pos.y, 
      stepWidth, 
      30, 
      8 // 圆角半径
    );
    ctx.fill();
    
    // 当前计算的阶梯有特殊效果
    if (i === calculatingStep) {
      // 正在计算的阶梯突出显示 - 光晕效果
      ctx.strokeStyle = COLORS.CURRENT;
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // 添加闪烁光晕
      const alpha = Math.abs(Math.sin(timestamp / 200)); // 0-1之间变化
      ctx.shadowColor = `rgba(255, 165, 0, ${alpha})`;
      ctx.shadowBlur = 15;
      
      // 在阶梯上方绘制亮点，使其看起来像在闪烁
      for (let j = 0; j < 5; j++) {
        const sparkleSize = 2 + Math.random() * 3;
        const sparkleX = pos.x - stepWidth / 4 + Math.random() * stepWidth / 2 + wobble;
        const sparkleY = pos.y + 5 + Math.random() * 20;
        
        ctx.fillStyle = `rgba(255, 255, 100, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } else {
      // 其他阶梯普通描边 - 更厚实的边框更卡通
      ctx.strokeStyle = '#9E9E9E';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // 阶梯当前状态指示器 - 更可爱的设计
    if (stepStatuses && i < stepStatuses.length) {
      const status = stepStatuses[i];
      const statusIndicatorSize = 12;
      const indicatorX = pos.x - stepWidth / 2 + 15 + wobble;
      const indicatorY = pos.y + 5;
      
      // 为指示器添加白色背景底色
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, statusIndicatorSize + 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 状态指示器
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, statusIndicatorSize, 0, Math.PI * 2);
      
      if (status === 'calculated') {
        // 已计算 - 笑脸图标
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
        
        // 绘制白色笑脸
        ctx.fillStyle = '#FFFFFF';
        // 微笑
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY + 2, statusIndicatorSize / 2, 0, Math.PI, false);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 眼睛
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(indicatorX - 3, indicatorY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(indicatorX + 3, indicatorY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
      } else if (status === 'calculating') {
        // 计算中 - 思考表情（使用timestamp产生动画效果）
        void timestamp; // 保留timestamp以备将来使用
        ctx.fillStyle = '#FFC107';
        ctx.fill();
        
        // 思考的眼睛
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(indicatorX - 3, indicatorY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(indicatorX + 3, indicatorY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 思考的嘴
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY + 3, 3, 0.1, Math.PI - 0.1, true);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
      } else {
        // 未计算 - 空白表情
        ctx.fillStyle = '#9E9E9E';
        ctx.fill();
        
        // 中性表情
        ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
        
        // 直线嘴
        ctx.beginPath();
        ctx.moveTo(indicatorX - 3, indicatorY + 2);
        ctx.lineTo(indicatorX + 3, indicatorY + 2);
        ctx.stroke();
        
        // 闭眼
        ctx.beginPath();
        ctx.moveTo(indicatorX - 4, indicatorY - 2);
        ctx.lineTo(indicatorX - 2, indicatorY - 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(indicatorX + 2, indicatorY - 2);
        ctx.lineTo(indicatorX + 4, indicatorY - 2);
        ctx.stroke();
      }
    }
    
    // 添加阶梯编号 - 更好看的字体和阴影
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Comic Sans MS, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(`${i}阶`, pos.x + wobble, pos.y + 15);
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // 显示已计算的阶梯值
    if (stepStatuses && values && i < stepStatuses.length) {
      const status = stepStatuses[i];
      const value = values[i];
      
      if (status === 'calculated' && value !== undefined) {
        // 在楼梯右侧显示值 - 更卡通的气泡样式
        const valueBoxSize = 16;
        const valueBoxX = pos.x + stepWidth / 2 - valueBoxSize - 5 + wobble;
        const valueBoxY = pos.y + 15;
        
        // 绘制值气泡背景
        ctx.fillStyle = '#4CAF50';
        
        // 椭圆形气泡
        ctx.beginPath();
        ctx.ellipse(valueBoxX, valueBoxY, valueBoxSize + 10, valueBoxSize, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 气泡尖角
        ctx.beginPath();
        ctx.moveTo(valueBoxX - 5, valueBoxY - 5);
        ctx.lineTo(valueBoxX - 15, valueBoxY - 15);
        ctx.lineTo(valueBoxX - 10, valueBoxY + 5);
        ctx.closePath();
        ctx.fill();
        
        // 气泡高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(valueBoxX - 5, valueBoxY - 5, valueBoxSize / 2, valueBoxSize / 4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制方法数值
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Comic Sans MS, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(value.toString(), valueBoxX, valueBoxY);
        
        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    }
  });
  
  // 绘制连接线 - 表示状态转移关系
  if (stairsPositions.length > 2) {
    // 修改连线策略 - 只绘制当前计算节点的连线，避免画面混乱
    
    // 只处理当前正在计算的节点或与进度相关的节点
    const activeNodeIndex = calculatingStep !== null ? calculatingStep : 
                            (currentStairIndex !== undefined ? currentStairIndex : -1);
    
    if (activeNodeIndex !== null && activeNodeIndex >= 2) {
      const i = activeNodeIndex;
      
      // 获取当前时间用于动画效果
      const timestamp = Date.now();
      
      // 设置箭头的偏移，使箭头不重叠
      const arrowOffset = 35; // 增加偏移使箭头更分散
      
      if (i - 1 >= 0 && stepStatuses && stepStatuses[i-1] === 'calculated') {
        // 箭头脉动效果
        const pulseScale = 1 + 0.3 * Math.sin(timestamp / 200);
        
        // 连接到前一阶的箭头 - 蓝色
        ctx.strokeStyle = COLORS.PATH_ONE; // 明亮的蓝色
        ctx.lineWidth = 4 * pulseScale;
        
        const startX = stairsPositions[i-1].x;
        const startY = stairsPositions[i-1].y + 15 - arrowOffset;
        const endX = stairsPositions[i].x;
        const endY = stairsPositions[i].y + 15 - arrowOffset;
        
        // 使用曲线绘制动态箭头
        drawCurvedArrow(
          ctx,
          startX, startY,
          endX, endY,
          20, 20, // 更大的箭头头部
          -50, // 增加曲线控制点偏移
          true // 绘制箭头阴影
        );
        
        // 添加转移说明 - 更卡通的气泡设计
        if (values && values[i-1] !== undefined) {
          const controlPointOffset = -50;
          // 计算贝塞尔曲线上的一个点作为标签位置
          const t = 0.5; // 曲线中点
          const midX = startX + (endX - startX) * t;
          const midY = startY + (endY - startY) * t + controlPointOffset * Math.sin(Math.PI * t);
          
          // 绘制说明气泡
          drawFunnyValueBubble(ctx, midX, midY, `+${values[i-1]}`, '#2196F3', timestamp);
        }
      }
      
      if (i - 2 >= 0 && stepStatuses && stepStatuses[i-2] === 'calculated') {
        // 箭头脉动效果
        const pulseScale = 1 + 0.3 * Math.sin(timestamp / 200 + Math.PI/2); // 相位差使两个箭头交替脉动
        
        // 连接到前两阶的箭头 - 紫色
        ctx.strokeStyle = COLORS.PATH_TWO; // 明亮的紫色
        ctx.lineWidth = 4 * pulseScale;
        
        const startX = stairsPositions[i-2].x;
        const startY = stairsPositions[i-2].y + 15 + arrowOffset;
        const endX = stairsPositions[i].x;
        const endY = stairsPositions[i].y + 15 + arrowOffset;
        
        // 使用曲线绘制动态箭头
        drawCurvedArrow(
          ctx,
          startX, startY,
          endX, endY,
          20, 20, // 更大的箭头头部
          50, // 增加曲线控制点偏移
          true // 绘制箭头阴影
        );
        
        // 添加转移说明 - 更卡通的气泡设计
        if (values && values[i-2] !== undefined) {
          const controlPointOffset = 50;
          // 计算贝塞尔曲线上的一个点作为标签位置
          const t = 0.5; // 曲线中点
          const midX = startX + (endX - startX) * t;
          const midY = startY + (endY - startY) * t + controlPointOffset * Math.sin(Math.PI * t);
          
          // 绘制说明气泡
          drawFunnyValueBubble(ctx, midX, midY, `+${values[i-2]}`, '#9C27B0', timestamp);
        }
      }
    }
  }
  
  // 在合适的位置绘制当前状态下的公式说明
  if (stepStatuses && values && calculatingStep !== null) {
    drawFormulaStatus(ctx, width, height, calculatingStep, values, timestamp);
  }
  
  // 返回楼梯位置数组供其他组件使用
  return stairsPositions;
};

/**
 * 绘制卡通风格的气泡
 */
function drawFunnyValueBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number, 
  text: string,
  color: string,
  timestamp: number
) {
  // 脉动效果
  const pulse = 1 + 0.1 * Math.sin(timestamp / 150);
  
  // 绘制气泡主体
  ctx.fillStyle = color;
  ctx.beginPath();
  // 使用椭圆形气泡
  ctx.ellipse(x, y, 30 * pulse, 20 * pulse, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 添加小尖角
  ctx.beginPath();
  ctx.moveTo(x, y + 15 * pulse);
  ctx.lineTo(x - 10 * pulse, y + 30 * pulse);
  ctx.lineTo(x + 10 * pulse, y + 25 * pulse);
  ctx.closePath();
  ctx.fill();
  
  // 添加高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(x - 8 * pulse, y - 5 * pulse, 15 * pulse, 8 * pulse, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  
  // 绘制文本
  ctx.fillStyle = 'white';
  ctx.font = `bold ${16 * pulse}px Comic Sans MS, Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillText(text, x, y);
  
  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * 绘制卡通云朵
 */
function drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number, timestamp: number) {
  const cloudCount = 3;
  
  for (let i = 0; i < cloudCount; i++) {
    // 动态位置
    const speed = 0.01 + i * 0.005; // 不同的云移动速度不同
    const x = (width * (i + 1) / (cloudCount + 1) + timestamp * speed) % (width + 200) - 100;
    const y = height * 0.2 + i * 30;
    const scale = 0.6 + i * 0.2; // 不同的云大小不同
    
    // 绘制云朵
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // 绘制主体
    ctx.beginPath();
    ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y - 10 * scale, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 50 * scale, y, 20 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y + 10 * scale, 25 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(x + 15 * scale, y - 10 * scale, 10 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 绘制公式状态 - 沙雕风格版本
 */
function drawFormulaStatus(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentStairIndex: number,
  values: number[] | undefined,
  timestamp: number
) {
  if (!values) return;
  
  // 确保当前索引有效且前面的值已计算
  if (currentStairIndex < 2 || values[currentStairIndex - 1] === undefined || values[currentStairIndex - 2] === undefined) {
    return;
  }
  
  // 底部公式区域
  const formulaBoxWidth = width * 0.8;
  const formulaBoxHeight = 70;
  const formulaBoxX = width / 2 - formulaBoxWidth / 2;
  const formulaBoxY = height - formulaBoxHeight - 20;
  
  // 绘制搞笑的思考气泡背景
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  
  // 绘制主气泡
  roundRect(ctx, formulaBoxX, formulaBoxY, formulaBoxWidth, formulaBoxHeight, 20);
  ctx.fill();
  
  // 气泡尖角
  ctx.beginPath();
  ctx.moveTo(formulaBoxX + formulaBoxWidth * 0.3, formulaBoxY);
  ctx.lineTo(formulaBoxX + formulaBoxWidth * 0.35, formulaBoxY - 20);
  ctx.lineTo(formulaBoxX + formulaBoxWidth * 0.4, formulaBoxY);
  ctx.closePath();
  ctx.fill();
  
  // 气泡边框
  ctx.strokeStyle = '#9E9E9E';
  ctx.lineWidth = 2;
  roundRect(ctx, formulaBoxX, formulaBoxY, formulaBoxWidth, formulaBoxHeight, 20);
  ctx.stroke();
  
  // 添加有趣的装饰
  const bobbleSize = 8;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI;
    const x = formulaBoxX + formulaBoxWidth * 0.7 + Math.cos(angle) * 30;
    const y = formulaBoxY - 5 + Math.sin(angle) * 10;
    
    ctx.fillStyle = `hsl(${(i * 60) % 360}, 80%, 70%)`;
    ctx.beginPath();
    ctx.arc(x, y, bobbleSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 绘制公式内容 - 更生动的展示
  ctx.font = 'bold 20px Comic Sans MS, Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 准备公式文本
  const val1 = values[currentStairIndex - 1];
  const val2 = values[currentStairIndex - 2];
  
  // 动态脉动的文本大小
  const textPulse = Math.sin(timestamp / 200) * 0.1 + 1;
  
  // 绘制公式符号 - 使用不同颜色
  // 第一部分：dp[n-1]
  ctx.fillStyle = COLORS.PATH_ONE;
  ctx.font = `bold ${20 * textPulse}px Comic Sans MS, Arial`;
  const text1 = `dp[${currentStairIndex-1}] = ${val1}`;
  ctx.fillText(text1, formulaBoxX + formulaBoxWidth * 0.25, formulaBoxY + formulaBoxHeight * 0.35);
  
  // 加号
  ctx.fillStyle = '#FF5722';
  ctx.font = `bold ${24 * textPulse}px Comic Sans MS, Arial`;
  ctx.fillText("+", formulaBoxX + formulaBoxWidth * 0.5, formulaBoxY + formulaBoxHeight * 0.35);
  
  // 第二部分：dp[n-2]
  ctx.fillStyle = COLORS.PATH_TWO;
  ctx.font = `bold ${20 * textPulse}px Comic Sans MS, Arial`;
  const text2 = `dp[${currentStairIndex-2}] = ${val2}`;
  ctx.fillText(text2, formulaBoxX + formulaBoxWidth * 0.75, formulaBoxY + formulaBoxHeight * 0.35);
  
  // 等于符号
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${24 * textPulse}px Comic Sans MS, Arial`;
  ctx.fillText("=", formulaBoxX + formulaBoxWidth * 0.5, formulaBoxY + formulaBoxHeight * 0.7);
  
  // 结果 - 有趣的脉动效果
  if (values[currentStairIndex] !== undefined) {
    const resultPulse = 1 + Math.sin(timestamp / 150) * 0.2;
    ctx.fillStyle = '#4CAF50';
    ctx.font = `bold ${28 * resultPulse}px Comic Sans MS, Arial`;
    ctx.fillText(`${val1 + val2}`, formulaBoxX + formulaBoxWidth * 0.5, formulaBoxY + formulaBoxHeight * 0.7);
    
    // 添加光晕效果
    ctx.shadowColor = 'rgba(76, 175, 80, 0.6)';
    ctx.shadowBlur = 10 * resultPulse;
    ctx.fillText(`${val1 + val2}`, formulaBoxX + formulaBoxWidth * 0.5, formulaBoxY + formulaBoxHeight * 0.7);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  } else {
    // 计算中的动画效果
    const dots = Math.floor((timestamp / 300) % 4);
    let calculating = "计算中";
    for (let i = 0; i < dots; i++) {
      calculating += ".";
    }
    ctx.fillStyle = '#FFC107';
    ctx.font = `bold ${20 * textPulse}px Comic Sans MS, Arial`;
    ctx.fillText(calculating, formulaBoxX + formulaBoxWidth * 0.5, formulaBoxY + formulaBoxHeight * 0.7);
  }
}

/**
 * 绘制弯曲箭头 - 沙雕风格版本
 */
function drawCurvedArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number, fromY: number, 
  toX: number, toY: number,
  headLength: number, headAngle: number,
  controlPointOffset: number = 0, // 贝塞尔曲线控制点偏移量
  withShadow: boolean = false // 是否添加阴影
) {
  // 计算贝塞尔曲线控制点
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2 + controlPointOffset;
  
  // 添加阴影效果
  if (withShadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  
  // 绘制主曲线
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.quadraticCurveTo(midX, midY, toX, toY);
  ctx.stroke();
  
  // 重置阴影
  if (withShadow) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  // 计算箭头方向
  const dx = toX - midX;
  const dy = toY - midY;
  const angle = Math.atan2(dy, dx);
  
  // 绘制箭头头部 - 更加沙雕的心形箭头
  if (withShadow) {
    // 只有活跃的箭头才绘制更有趣的形状
    ctx.fillStyle = ctx.strokeStyle;
    
    // 计算心形箭头的位置
    const heartX = toX - headLength * 0.5 * Math.cos(angle);
    const heartY = toY - headLength * 0.5 * Math.sin(angle);
    
    // 绘制心形箭头
    const heartSize = headLength * 0.8;
    ctx.beginPath();
    ctx.moveTo(heartX, heartY + heartSize / 2);
    
    // 左半边
    ctx.bezierCurveTo(
      heartX - heartSize, heartY, 
      heartX - heartSize, heartY - heartSize, 
      heartX, heartY - heartSize / 2
    );
    
    // 右半边
    ctx.bezierCurveTo(
      heartX + heartSize, heartY - heartSize, 
      heartX + heartSize, heartY, 
      heartX, heartY + heartSize / 2
    );
    
    ctx.fill();
    
    // 添加闪烁效果
    const timestamp = Date.now();
    const sparkle = Math.sin(timestamp / 150) * 0.5 + 0.5;
    
    if (sparkle > 0.7) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(heartX, heartY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // 普通箭头使用三角形
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / headAngle),
      toY - headLength * Math.sin(angle - Math.PI / headAngle)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / headAngle),
      toY - headLength * Math.sin(angle + Math.PI / headAngle)
    );
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  }
}

/**
 * 绘制圆角矩形
 */
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
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

// 返回楼梯位置 - 沙雕版本
export function drawStairsPositions(width: number, height: number, n: number) {
  const positions: {x: number, y: number}[] = [];
  
  // 计算每个阶梯的位置
  for (let i = 0; i < n; i++) {
    // x从左到右均匀分布，y从下到上均匀分布
    // 加入轻微的左右摆动
    const wobbleOffset = Math.sin(i * 0.5) * 15; // 左右摆动
    const x = width * 0.2 + (width * 0.6) * (i / (n - 1)) + wobbleOffset;
    const y = height * 0.8 - (height * 0.6) * (i / (n - 1));
    
    positions.push({x, y});
  }
  
  return positions;
} 