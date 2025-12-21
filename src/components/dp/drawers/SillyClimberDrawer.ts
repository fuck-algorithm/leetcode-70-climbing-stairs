import { ANIMATION_PHASE, CLIMBER_STATE } from '../constants';
import { drawSpeechBubble } from './BubbleDrawer';

/**
 * SillyClimberDrawer类 - 负责绘制沙雕风格的小人动画
 */
export class SillyClimberDrawer {
  private ctx: CanvasRenderingContext2D;
  
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  
  /**
   * 绘制小人
   */
  drawClimber(
    position: { x: number, y: number },
    state: number,
    animationPhase: number,
    animationProgress: number,
    showBubble: boolean,
    bubbleText: string
  ): void {
    const { x, y } = position;
    
    // 添加阴影效果
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = 5;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    
    // 时间戳用于各种动画效果
    const timestamp = Date.now();
    
    // 根据小人状态绘制
    switch (state) {
      case CLIMBER_STATE.STANDING:
        this.drawStandingClimber(x, y, timestamp);
        break;
      case CLIMBER_STATE.CLIMBING_ONE:
        if (animationPhase === ANIMATION_PHASE.PREPARE_TO_CLIMB) {
          // 准备爬楼梯的动作
          this.drawPreparingClimber(x, y, 1, timestamp);
        } else {
          // 正在爬楼梯的动作
          this.drawClimbingClimber(x, y, 1, animationProgress, timestamp);
        }
        break;
      case CLIMBER_STATE.CLIMBING_TWO:
        if (animationPhase === ANIMATION_PHASE.PREPARE_TO_CLIMB) {
          // 准备爬楼梯的动作
          this.drawPreparingClimber(x, y, 2, timestamp);
        } else {
          // 正在爬楼梯的动作
          this.drawClimbingClimber(x, y, 2, animationProgress, timestamp);
        }
        break;
      case CLIMBER_STATE.CELEBRATING:
        this.drawCelebratingClimber(x, y, timestamp);
        break;
      case CLIMBER_STATE.THINKING:
        this.drawThinkingClimber(x, y, timestamp);
        break;
    }
    
    // 重置阴影
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    
    // 绘制对话气泡
    if (showBubble && bubbleText) {
      drawSpeechBubble(this.ctx, x + 30, y - 70, bubbleText);
    }
  }
  
  /**
   * 绘制站立状态的沙雕小人
   */
  private drawStandingClimber(x: number, y: number, timestamp: number): void {
    // 轻微的呼吸效果
    const breatheScale = 1 + 0.02 * Math.sin(timestamp / 800);
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(breatheScale, breatheScale);
    
    // 绘制身体
    this.drawSillyBody(0, timestamp);
    
    this.ctx.restore();
    
    // 绘制表情 - 沙雕的表情
    this.drawSillyFace(x, y - 25, 'calm', timestamp);
    
    // 添加轻微的站立动画效果 - 脚下小阴影
    const slightMove = Math.sin(timestamp / 1000) * 2;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + 30 + slightMove/3, 20, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * 绘制准备爬楼梯的沙雕小人
   */
  private drawPreparingClimber(x: number, y: number, type: 1 | 2, timestamp: number): void {
    // 使用脉动效果表示准备用力
    const pulseScale = 1 + 0.08 * Math.sin(timestamp / 120);
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(pulseScale, pulseScale);
    
    // 绘制身体
    this.drawSillyBody(type === 1 ? 0.1 : 0.2, timestamp);
    
    this.ctx.restore();
    
    // 绘制专注的表情
    this.drawSillyFace(x, y - 25, 'focused', timestamp);
    
    // 绘制准备动作的特效 - 汗滴和能量线
    this.drawPreparationEffect(x, y, type, timestamp);
  }
  
  /**
   * 绘制爬楼梯中的沙雕小人
   */
  private drawClimbingClimber(x: number, y: number, type: 1 | 2, progress: number, timestamp: number): void {
    // 根据进度调整位置和角度
    const rotatePhase = Math.sin(progress * Math.PI);
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // 添加晃动表示努力
    const effortShake = Math.sin(timestamp / 40) * 2.5 * Math.sin(progress * Math.PI);
    this.ctx.translate(effortShake, 0);
    
    // 身体倾斜 - 爬2阶倾斜更大
    const leanAngle = type === 1 ? 0.2 : 0.3;
    this.ctx.rotate(Math.PI * leanAngle * rotatePhase);
    
    // 绘制身体
    this.drawSillyBody(leanAngle * progress, timestamp);
    
    this.ctx.restore();
    
    // 根据进度绘制不同表情
    if (progress < 0.4) {
      // 初期 - 专注
      this.drawSillyFace(x, y - 25, 'focused', timestamp);
    } else if (progress < 0.7) {
      // 中期 - 努力
      this.drawSillyFace(x, y - 25, 'effort', timestamp);
    } else {
      // 后期 - 接近成功
      this.drawSillyFace(x, y - 25, 'almost', timestamp);
    }
    
    // 绘制攀爬动作的动态效果
    this.drawClimbingEffect(x, y, type, progress, timestamp);
  }
  
  /**
   * 绘制庆祝状态的沙雕小人
   */
  private drawCelebratingClimber(x: number, y: number, timestamp: number): void {
    // 欢跃的脉动效果
    const jumpScale = 1 + 0.1 * Math.sin(timestamp / 150);
    const jumpHeight = 5 * Math.sin(timestamp / 150);
    
    this.ctx.save();
    this.ctx.translate(x, y - jumpHeight);
    this.ctx.scale(jumpScale, jumpScale);
    
    // 绘制身体
    this.drawSillyBody(0, timestamp, true);
    
    this.ctx.restore();
    
    // 绘制开心的表情
    this.drawSillyFace(x, y - 25 - jumpHeight, 'happy', timestamp);
    
    // 绘制庆祝特效 - 星星和彩带
    this.drawCelebrationParticles(x, y, timestamp);
  }
  
  /**
   * 绘制思考状态的沙雕小人
   */
  private drawThinkingClimber(x: number, y: number, timestamp: number): void {
    // 思考时的小幅度移动
    const thinkMove = Math.sin(timestamp / 600) * 2;
    
    this.ctx.save();
    this.ctx.translate(x, y + thinkMove);
    
    // 绘制身体
    this.drawSillyBody(0, timestamp);
    
    this.ctx.restore();
    
    // 绘制思考的表情
    this.drawSillyFace(x, y - 25 + thinkMove, 'thinking', timestamp);
    
    // 绘制思考特效 - 思考泡泡
    this.drawThoughtBubbles(x, y, timestamp);
  }
  
  /**
   * 绘制沙雕小人的身体
   */
  private drawSillyBody(leanFactor: number, timestamp: number, isCelebrating: boolean = false): void {
    const ctx = this.ctx;
    
    // 随机颜色变化 - 更有趣的效果
    const hueShift = Math.sin(timestamp / 2000) * 20;
    const baseHue = 16; // 基于橙色的色调
    ctx.fillStyle = `hsl(${baseHue + hueShift}, 100%, 50%)`; // 动态变化的主体颜色
    
    // 身体呼吸效果
    const breathe = 1 + Math.sin(timestamp / 500) * 0.05;
    
    // 绘制椭圆形身体 - 更沙雕的比例
    ctx.beginPath();
    ctx.ellipse(0, 0, 22 * breathe, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制四肢 - 更加夸张、弯曲的线条
    ctx.strokeStyle = ctx.fillStyle; // 与身体同色
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    
    // 手臂抖动效果 - 更加夸张
    const armWave = Math.sin(timestamp / 150) * 0.3;
    const armWave2 = Math.cos(timestamp / 130) * 0.3;
    
    // 左手臂 (更夸张的姿势)
    ctx.beginPath();
    if (isCelebrating) {
      // 庆祝时手臂上举并做出挥舞动作
      ctx.moveTo(-12, -5);
      ctx.quadraticCurveTo(-25, -20 + armWave * 15, -15, -40 + armWave * 10);
    } else {
      ctx.moveTo(-12, -5);
      ctx.quadraticCurveTo(-25 + armWave * 15, 5, -35, 20 + leanFactor * 15);
    }
    ctx.stroke();
    
    // 右手臂
    ctx.beginPath();
    if (isCelebrating) {
      // 庆祝时右手也上举
      ctx.moveTo(12, -5);
      ctx.quadraticCurveTo(25, -20 + armWave2 * 15, 15, -40 + armWave2 * 10);
    } else {
      ctx.moveTo(12, -5);
      ctx.quadraticCurveTo(25 + armWave2 * 15, 5, 35, 20 + leanFactor * 15);
    }
    ctx.stroke();
    
    // 腿部
    const legWave = Math.sin(timestamp / 180) * 0.2;
    const legWave2 = Math.cos(timestamp / 160) * 0.2;
    
    // 左腿
    ctx.beginPath();
    ctx.moveTo(-10, 20);
    ctx.quadraticCurveTo(-10 + legWave * 10, 35, -15 + leanFactor * 20, 45 + leanFactor * 5);
    ctx.stroke();
    
    // 右腿
    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.quadraticCurveTo(10 + legWave2 * 10, 35, 15 + leanFactor * 20, 45 + leanFactor * 5);
    ctx.stroke();
    
    // 添加小装饰 - 小配件或标志性特征
    if (isCelebrating) {
      // 庆祝时添加派对帽
      ctx.fillStyle = '#4CAF50'; // 绿色帽子
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(-15, -25);
      ctx.lineTo(15, -25);
      ctx.closePath();
      ctx.fill();
      
      // 帽子装饰
      ctx.fillStyle = '#FF9800';
      ctx.beginPath();
      ctx.arc(0, -30, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 普通状态下的小头饰
      const headbandColor = isCelebrating ? '#FFEB3B' : '#2196F3';
      ctx.fillStyle = headbandColor;
      ctx.beginPath();
      ctx.ellipse(0, -22, 15, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  /**
   * 绘制沙雕小人的表情
   */
  private drawSillyFace(x: number, y: number, expression: 'calm' | 'focused' | 'effort' | 'almost' | 'happy' | 'thinking', timestamp: number): void {
    const ctx = this.ctx;
    
    // 设置眼睛大小和位置 - 更大的眼睛更有喜剧效果
    const eyeSize = 7; // 更大的眼睛
    const eyeSpacing = 15; // 间距
    
    // 眼睛眨眼动画
    const blinkCycle = 4000; // 眨眼周期
    const blinkDuration = 150; // 眨眼持续时间
    const blinkPhase = timestamp % blinkCycle;
    const isBlinking = blinkPhase < blinkDuration;
    
    // 绘制眼睛
    ctx.fillStyle = '#FFFFFF';
    
    // 左眼
    ctx.beginPath();
    if (isBlinking) {
      // 眨眼中
      ctx.ellipse(x - eyeSpacing, y, eyeSize, 1, 0, 0, Math.PI * 2);
    } else {
      // 正常睁眼
      ctx.arc(x - eyeSpacing, y, eyeSize, 0, Math.PI * 2);
    }
    ctx.fill();
    
    // 右眼
    ctx.beginPath();
    if (isBlinking) {
      // 眨眼中
      ctx.ellipse(x + eyeSpacing, y, eyeSize, 1, 0, 0, Math.PI * 2);
    } else {
      // 正常睁眼
      ctx.arc(x + eyeSpacing, y, eyeSize, 0, Math.PI * 2);
    }
    ctx.fill();
    
    // 根据表情设置瞳孔位置 - 更加夸张
    if (expression === 'thinking') {
      // 思考时眼睛向上看
      this.drawPupil(x - eyeSpacing, y - 3, eyeSize * 0.6);
      this.drawPupil(x + eyeSpacing, y - 3, eyeSize * 0.6);
    } else if (expression === 'focused' || expression === 'effort') {
      // 专注和努力时眼睛更集中
      const wobble = Math.sin(timestamp / 100) * 1.5;
      this.drawPupil(x - eyeSpacing, y + wobble, eyeSize * 0.8);
      this.drawPupil(x + eyeSpacing, y + wobble, eyeSize * 0.8);
    } else if (expression === 'almost') {
      // 即将成功时眼睛瞪大
      this.drawPupil(x - eyeSpacing, y, eyeSize * 0.7);
      this.drawPupil(x + eyeSpacing, y, eyeSize * 0.7);
    } else if (expression === 'happy') {
      // 开心时眼睛弯曲成弧形
      ctx.fillStyle = '#000000';
      
      // 左眼变成弯曲的线
      ctx.beginPath();
      ctx.arc(x - eyeSpacing, y, eyeSize, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
      
      // 右眼变成弯曲的线
      ctx.beginPath();
      ctx.arc(x + eyeSpacing, y, eyeSize, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
    } else {
      // 平静时正常瞳孔
      this.drawPupil(x - eyeSpacing, y, eyeSize * 0.6);
      this.drawPupil(x + eyeSpacing, y, eyeSize * 0.6);
    }
    
    // 根据表情绘制嘴巴 - 更夸张
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    if (expression === 'happy') {
      // 大大的笑容
      ctx.beginPath();
      ctx.arc(x, y + 15, 12, 0, Math.PI, false);
      ctx.stroke();
      
      // 添加舌头
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.ellipse(x, y + 18, 5, 8, 0, 0, Math.PI, false);
      ctx.fill();
    } else if (expression === 'effort') {
      // 努力的表情 - 咬牙
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 15);
      ctx.lineTo(x + 10, y + 15);
      ctx.stroke();
      
      // 冒汗效果
      const sweatY = Math.sin(timestamp / 200) * 3;
      ctx.fillStyle = '#81D4FA';
      ctx.beginPath();
      ctx.arc(x - 20, y + 5 + sweatY, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (expression === 'thinking') {
      // 思考的表情 - 嘴巴撅起
      ctx.beginPath();
      ctx.arc(x, y + 18, 5, 0, Math.PI, true);
      ctx.stroke();
    } else if (expression === 'focused') {
      // 专注的表情 - 嘴巴紧闭成一条线
      ctx.beginPath();
      ctx.moveTo(x - 8, y + 15);
      ctx.lineTo(x + 8, y + 15);
      ctx.stroke();
    } else if (expression === 'almost') {
      // 即将成功的表情 - "O"形嘴
      ctx.beginPath();
      ctx.arc(x, y + 15, 8, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // 平静的表情 - 小微笑
      ctx.beginPath();
      ctx.arc(x, y + 12, 8, 0.1, Math.PI - 0.1, false);
      ctx.stroke();
    }
    
    // 添加眉毛 - 更加夸张
    ctx.lineWidth = 3;
    
    if (expression === 'thinking') {
      // 思考时皱眉
      ctx.beginPath();
      ctx.moveTo(x - eyeSpacing - 8, y - 12);
      ctx.quadraticCurveTo(x - eyeSpacing, y - 15, x - eyeSpacing + 8, y - 12);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + eyeSpacing - 8, y - 12);
      ctx.quadraticCurveTo(x + eyeSpacing, y - 15, x + eyeSpacing + 8, y - 12);
      ctx.stroke();
    } else if (expression === 'focused' || expression === 'effort') {
      // 专注和努力时眉毛紧缩
      const effortWobble = Math.sin(timestamp / 80) * 2;
      
      ctx.beginPath();
      ctx.moveTo(x - eyeSpacing - 10, y - 12 + effortWobble);
      ctx.lineTo(x - eyeSpacing + 5, y - 15 - effortWobble);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + eyeSpacing + 10, y - 12 + effortWobble);
      ctx.lineTo(x + eyeSpacing - 5, y - 15 - effortWobble);
      ctx.stroke();
    } else if (expression === 'happy') {
      // 开心时眉毛上扬
      ctx.beginPath();
      ctx.moveTo(x - eyeSpacing - 8, y - 12);
      ctx.quadraticCurveTo(x - eyeSpacing, y - 8, x - eyeSpacing + 8, y - 12);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + eyeSpacing - 8, y - 12);
      ctx.quadraticCurveTo(x + eyeSpacing, y - 8, x + eyeSpacing + 8, y - 12);
      ctx.stroke();
    } else {
      // 平静时的眉毛
      ctx.beginPath();
      ctx.moveTo(x - eyeSpacing - 8, y - 10);
      ctx.lineTo(x - eyeSpacing + 8, y - 10);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + eyeSpacing - 8, y - 10);
      ctx.lineTo(x + eyeSpacing + 8, y - 10);
      ctx.stroke();
    }
  }
  
  /**
   * 绘制瞳孔
   */
  private drawPupil(x: number, y: number, size: number): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 添加高光
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x + size / 3, y - size / 3, size / 3, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * 绘制庆祝特效
   */
  private drawCelebrationParticles(x: number, y: number, timestamp: number): void {
    const ctx = this.ctx;
    const particles = 20; // 更多粒子
    const colors = ['#FF5252', '#FFEB3B', '#2196F3', '#4CAF50', '#E040FB', '#FF9800'];
    
    for (let i = 0; i < particles; i++) {
      const particlePhase = (timestamp / 50 + i * 100) % 2000;
      const particleLife = particlePhase / 2000;
      
      if (particleLife < 1) {
        const angle = (i / particles) * Math.PI * 2 + timestamp / 3000;
        const distance = 20 + particleLife * 60; // 更大的扩散范围
        const size = 6 * (1 - particleLife); // 更大的粒子
        
        const particleX = x + Math.cos(angle) * distance;
        const particleY = y + Math.sin(angle) * distance - 20; // 向上偏移
        
        // 随机形状粒子
        if (i % 3 === 0) {
          // 星形
          ctx.fillStyle = colors[i % colors.length];
          this.drawStar(particleX, particleY, size, 5);
        } else if (i % 3 === 1) {
          // 圆形
          ctx.fillStyle = colors[(i + 1) % colors.length];
          ctx.beginPath();
          ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 心形
          ctx.fillStyle = colors[(i + 2) % colors.length];
          this.drawHeart(particleX, particleY, size);
        }
      }
    }
    
    // 添加彩带效果
    for (let i = 0; i < 6; i++) {
      const ribbon = (timestamp / 100 + i * 300) % 3000;
      const ribbonLife = ribbon / 3000;
      
      if (ribbonLife < 1) {
        const angle = (i / 6) * Math.PI * 2;
        const length = 40 + ribbonLife * 80;
        const width = 10 * (1 - ribbonLife);
        
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = width;
        
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        
        // 蜿蜒的彩带
        const cp1x = x + Math.cos(angle) * length * 0.3;
        const cp1y = y + Math.sin(angle) * length * 0.3 - 20;
        const cp2x = x + Math.cos(angle) * length * 0.6;
        const cp2y = y + Math.sin(angle) * length * 0.6 - 10;
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
      }
    }
  }
  
  /**
   * 绘制心形
   */
  private drawHeart(x: number, y: number, size: number): void {
    const ctx = this.ctx;
    
    ctx.beginPath();
    ctx.moveTo(x, y + size / 2);
    
    // 左半边
    ctx.bezierCurveTo(
      x - size, y, 
      x - size, y - size, 
      x, y - size
    );
    
    // 右半边
    ctx.bezierCurveTo(
      x + size, y - size, 
      x + size, y, 
      x, y + size / 2
    );
    
    ctx.fill();
  }
  
  /**
   * 绘制星星
   */
  private drawStar(x: number, y: number, radius: number, spikes: number): void {
    const ctx = this.ctx;
    let rotation = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(
        x + Math.cos(rotation) * radius,
        y + Math.sin(rotation) * radius
      );
      rotation += step;
      
      ctx.lineTo(
        x + Math.cos(rotation) * radius * 0.4,
        y + Math.sin(rotation) * radius * 0.4
      );
      rotation += step;
    }
    
    ctx.lineTo(x, y - radius);
    ctx.closePath();
    ctx.fill();
  }
  
  /**
   * 绘制思考泡泡
   */
  private drawThoughtBubbles(x: number, y: number, timestamp: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // 思考泡泡动画
    const bobble1Size = 4 + Math.sin(timestamp / 300) * 1;
    const bobble2Size = 6 + Math.cos(timestamp / 400) * 1;
    const bobble3Size = 8 + Math.sin(timestamp / 500) * 2;
    
    // 小泡泡1
    ctx.beginPath();
    ctx.arc(x + 15, y - 35, bobble1Size, 0, Math.PI * 2);
    ctx.fill();
    
    // 小泡泡2
    ctx.beginPath();
    ctx.arc(x + 22, y - 45, bobble2Size, 0, Math.PI * 2);
    ctx.fill();
    
    // 小泡泡3
    ctx.beginPath();
    ctx.arc(x + 30, y - 55, bobble3Size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  /**
   * 绘制准备动作特效
   */
  private drawPreparationEffect(x: number, y: number, type: 1 | 2, timestamp: number): void {
    const ctx = this.ctx;
    
    // 绘制汗滴
    ctx.strokeStyle = '#6EB5FF';
    ctx.lineWidth = 2;
    
    // 随时间变化的汗滴位置
    const dropOffset = Math.sin(timestamp / 200) * 3;
    
    // 汗滴1
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 10);
    ctx.quadraticCurveTo(x - 18, y - 5 + dropOffset, x - 15, y);
    ctx.stroke();
    
    // 汗滴2
    ctx.beginPath();
    ctx.moveTo(x + 15, y - 8);
    ctx.quadraticCurveTo(x + 18, y - 3 + dropOffset, x + 15, y + 2);
    ctx.stroke();
    
    // 绘制能量线 (根据爬楼梯类型不同)
    ctx.strokeStyle = type === 1 ? '#FFD700' : '#FF6347';
    ctx.lineWidth = 1.5;
    
    // 能量线数量
    const lineCount = type === 1 ? 5 : 8;
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const length = 8 + Math.sin(timestamp / 150 + i) * 5;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  }
  
  /**
   * 绘制攀爬动作特效
   */
  private drawClimbingEffect(x: number, y: number, type: 1 | 2, progress: number, _timestamp: number): void {
    const ctx = this.ctx;
    // 保留_timestamp以备将来使用
    void _timestamp;
    void progress;
    
    // 绘制动作线 - 表示速度和方向
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
    ctx.lineWidth = 2;
    
    // 根据爬楼梯类型不同，线的长度和数量不同
    const lineCount = type === 1 ? 3 : 5;
    const lineLength = type === 1 ? 15 : 25;
    
    // 在小人周围绘制动作线
    for (let i = 0; i < lineCount; i++) {
      const offset = (i / lineCount) * Math.PI;
      const moveAngle = Math.PI * 0.7 + offset; // 向左上方
      
      const startX = x + Math.cos(moveAngle) * 5;
      const startY = y + Math.sin(moveAngle) * 5;
      
      const endX = startX + Math.cos(moveAngle) * lineLength * (0.5 + progress * 0.5);
      const endY = startY + Math.sin(moveAngle) * lineLength * (0.5 + progress * 0.5);
      
      ctx.globalAlpha = 0.7 - (i / lineCount) * 0.5;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    
    // 如果是爬2阶，添加额外的效果
    if (type === 2 && progress > 0.4 && progress < 0.8) {
      // 添加"加油"文字
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FF6347';
      ctx.fillText('加油!', x + 15, y - 15);
    }
  }
} 