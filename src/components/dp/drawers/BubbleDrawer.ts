// 常量导入（保留以备将来使用）
// import { COLORS } from '../constants';

// 绘制对话气泡 - 沙雕风格版本
export const drawSpeechBubble = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  text: string
) => {
  // 获取当前时间戳用于动画效果
  const timestamp = Date.now();
  
  // 创建脉动效果
  const pulse = 1 + 0.05 * Math.sin(timestamp / 200);
  
  // 气泡背景 - 使用渐变效果
  const gradient = ctx.createLinearGradient(x - 70, y - 90, x + 70, y - 30);
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(1, '#F5F5F5');
  
  ctx.fillStyle = gradient;
  ctx.strokeStyle = '#9E9E9E';
  ctx.lineWidth = 2;
  
  // 基础参数（pulse用于动画效果）
  void pulse; // 保留pulse变量以备将来使用
  const cornerRadius = 15;
  
  // 绘制更有趣的气泡形状 - 云朵风格
  ctx.beginPath();
  
  // 左上角圆形
  ctx.arc(x - 50, y - 75, cornerRadius, Math.PI, 1.5 * Math.PI, false);
  
  // 顶部曲线
  ctx.arc(x - 25, y - 85, cornerRadius, Math.PI, 2 * Math.PI, true);
  ctx.arc(x, y - 80, cornerRadius, Math.PI, 2 * Math.PI, false);
  ctx.arc(x + 25, y - 85, cornerRadius, 0, Math.PI, true);
  
  // 右上角圆形
  ctx.arc(x + 50, y - 75, cornerRadius, 1.5 * Math.PI, 0, false);
  
  // 右侧曲线
  ctx.arc(x + 60, y - 50, cornerRadius, 1.5 * Math.PI, 0.5 * Math.PI, false);
  
  // 底部曲线
  ctx.arc(x + 25, y - 35, cornerRadius, 0, Math.PI, false);
  ctx.arc(x, y - 30, cornerRadius, 0, Math.PI, true);
  ctx.arc(x - 25, y - 35, cornerRadius, 0, Math.PI, false);
  
  // 左侧曲线
  ctx.arc(x - 60, y - 50, cornerRadius, 0.5 * Math.PI, 1.5 * Math.PI, false);
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 气泡小尾巴 - 更加卡通的弯曲尾巴
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.quadraticCurveTo(x - 15, y - 20, x - 20, y);
  ctx.quadraticCurveTo(x - 10, y - 15, x + 5, y - 25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 添加气泡高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.ellipse(x - 30, y - 70, 25, 10, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  
  // 气泡文字 - 更活泼的字体和颜色
  ctx.fillStyle = '#333333';
  ctx.font = `${16 * pulse}px Comic Sans MS, Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 文字阴影效果
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  
  // 文字换行处理
  const words = text.split(' ');
  let line = '';
  let y0 = y - 65;
  const lineHeight = 18;
  const maxWidth = 100;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && i > 0) {
      // 为文本添加轻微的波浪效果
      drawWavyText(ctx, line, x, y0, timestamp);
      line = words[i] + ' ';
      y0 += lineHeight;
    } else {
      line = testLine;
    }
  }
  
  // 绘制最后一行
  drawWavyText(ctx, line, x, y0, timestamp);
  
  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // 添加一些装饰性的小气泡
  for (let i = 0; i < 3; i++) {
    const bubbleSize = 3 + i * 2;
    const bubbleX = x - 30 + i * 10;
    const bubbleY = y - 10 - i * 8;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = '#9E9E9E';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
};

/**
 * 绘制波浪效果的文字
 */
function drawWavyText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  timestamp: number
) {
  const characters = text.split('');
  let currentX = x - ctx.measureText(text).width / 2;
  
  characters.forEach((char, i) => {
    // 每个字符有不同的波浪偏移
    const charWidth = ctx.measureText(char).width;
    const waveOffset = Math.sin((timestamp / 500) + (i * 0.5)) * 2;
    
    ctx.fillText(char, currentX + charWidth / 2, y + waveOffset);
    currentX += charWidth;
  });
}

/**
 * 绘制圆角矩形（保留以备将来使用）
 */
function _roundRect(
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

// 导出以供其他模块使用
export { _roundRect as roundRect }; 