// 沙雕风格小人绘制模块
import { ANIMATION_PHASE, CLIMBER_STATE } from '../constants';

// 沙雕小人类
export class ShadiaoCharacter {
  // 小人属性
  private position: { x: number, y: number } = { x: 0, y: 0 };
  private state: number = CLIMBER_STATE.STANDING;
  private animationPhase: number = ANIMATION_PHASE.NONE;
  private animationProgress: number = 0;
  private showBubble: boolean = false;
  private bubbleText: string = '';
  private eyeOffset: number = 0;
  private mouthOffset: number = 0;
  private bodyRotation: number = 0;
  private bodyScale: number = 1;
  private randomSeed: number = Math.random() * 1000;
  private lastBlink: number = 0;
  private blinking: boolean = false;
  
  constructor() {
    this.randomSeed = Math.random() * 1000;
  }
  
  // 更新小人状态
  public updateState(
    state: number,
    position: { x: number, y: number },
    animationPhase: number,
    animationProgress: number,
    showBubble: boolean,
    bubbleText: string
  ): void {
    this.state = state;
    this.position = position;
    this.animationPhase = animationPhase;
    this.animationProgress = animationProgress;
    this.showBubble = showBubble;
    this.bubbleText = bubbleText;
    
    // 基于状态更新一些随机属性
    const timestamp = Date.now();
    
    // 随机眼睛偏移，让小人看起来很呆
    this.eyeOffset = Math.sin(timestamp / 1000 + this.randomSeed) * 2;
    
    // 随机嘴巴偏移
    this.mouthOffset = Math.sin(timestamp / 1300 + this.randomSeed) * 3;
    
    // 随机身体旋转
    this.bodyRotation = Math.sin(timestamp / 2000 + this.randomSeed) * 0.05;
    
    // 随机身体缩放 - 微小的呼吸效果
    this.bodyScale = 1 + Math.sin(timestamp / 800) * 0.03;
    
    // 随机眨眼
    if (timestamp - this.lastBlink > 2000 + Math.random() * 3000) {
      this.blinking = true;
      this.lastBlink = timestamp;
      
      // 眨眼持续时间
      setTimeout(() => {
        this.blinking = false;
      }, 200);
    }
  }
  
  // 绘制小人方法
  public draw(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.position;
    
    // 准备绘制区域
    ctx.save();
    
    // 根据状态选择绘制方法
    switch (this.state) {
      case CLIMBER_STATE.STANDING:
        this.drawStanding(ctx, x, y);
        break;
      case CLIMBER_STATE.CLIMBING_ONE:
      case CLIMBER_STATE.CLIMBING_TWO:
        this.drawClimbing(ctx, x, y);
        break;
      case CLIMBER_STATE.CELEBRATING:
        this.drawCelebrating(ctx, x, y);
        break;
      case CLIMBER_STATE.THINKING:
        this.drawThinking(ctx, x, y);
        break;
    }
    
    // 绘制气泡
    if (this.showBubble && this.bubbleText) {
      this.drawBubble(ctx, x, y, this.bubbleText);
    }
    
    ctx.restore();
  }
  
  // 绘制站立状态的沙雕小人
  private drawStanding(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // 保存上下文以便应用变形
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.bodyRotation);
    ctx.scale(this.bodyScale, this.bodyScale);
    
    // 绘制头部 - 沙雕大头
    this.drawHead(ctx, 0, -25, 'standing');
    
    // 绘制身体 - 简单矮胖身体
    this.drawBody(ctx, 0, 0, 'standing');
    
    // 绘制四肢 - 短小的四肢
    this.drawLimbs(ctx, 0, 0, 'standing');
    
    // 绘制阴影
    this.drawShadow(ctx, 0, 25);
    
    ctx.restore();
  }
  
  // 绘制爬楼梯状态的沙雕小人
  private drawClimbing(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // 额外晃动和变形
    const wobble = Math.sin(Date.now() / 100) * 3 * this.animationProgress;
    const stretch = 1 + Math.sin(this.animationProgress * Math.PI) * 0.2;
    
    // 保存上下文以便应用变形
    ctx.save();
    ctx.translate(x + wobble, y);
    ctx.rotate(this.bodyRotation + wobble * 0.02);
    ctx.scale(this.bodyScale * 0.9, this.bodyScale * stretch);
    
    // 绘制头部 - 沙雕大头，表情努力
    this.drawHead(ctx, 0, -25, 'climbing');
    
    // 绘制身体 - 变形的身体
    this.drawBody(ctx, 0, 0, 'climbing');
    
    // 绘制四肢 - 扭曲的四肢
    this.drawLimbs(ctx, 0, 0, 'climbing');
    
    // 加入一些滑稽的特效
    this.drawClimbingEffects(ctx, 0, 0);
    
    ctx.restore();
  }
  
  // 绘制庆祝状态的沙雕小人
  private drawCelebrating(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // 跳跃效果
    const jumpHeight = Math.sin(Date.now() / 150) * 10;
    const spinRotation = Math.sin(Date.now() / 300) * 0.2;
    
    // 保存上下文以便应用变形
    ctx.save();
    ctx.translate(x, y - jumpHeight);
    ctx.rotate(this.bodyRotation + spinRotation);
    ctx.scale(this.bodyScale * 1.1, this.bodyScale * 0.9);
    
    // 绘制头部 - 兴奋表情
    this.drawHead(ctx, 0, -25, 'celebrating');
    
    // 绘制身体 - 欢呼的身体
    this.drawBody(ctx, 0, 0, 'celebrating');
    
    // 绘制四肢 - 欢呼的四肢
    this.drawLimbs(ctx, 0, 0, 'celebrating');
    
    // 绘制庆祝特效
    this.drawCelebrationEffects(ctx, 0, 0);
    
    ctx.restore();
  }
  
  // 绘制思考状态的沙雕小人
  private drawThinking(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // 头部摇晃
    const headTilt = Math.sin(Date.now() / 500) * 0.1;
    
    // 保存上下文以便应用变形
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.bodyRotation);
    ctx.scale(this.bodyScale, this.bodyScale);
    
    // 绘制头部 - 困惑表情
    ctx.save();
    ctx.rotate(headTilt);
    this.drawHead(ctx, 0, -25, 'thinking');
    ctx.restore();
    
    // 绘制身体 - 标准身体
    this.drawBody(ctx, 0, 0, 'thinking');
    
    // 绘制四肢 - 思考姿势
    this.drawLimbs(ctx, 0, 0, 'thinking');
    
    // 绘制思考气泡
    this.drawThinkingBubbles(ctx, 15, -40);
    
    // 绘制阴影
    this.drawShadow(ctx, 0, 25);
    
    ctx.restore();
  }
  
  // 绘制沙雕头部
  private drawHead(ctx: CanvasRenderingContext2D, x: number, y: number, mode: string): void {
    // 头部 - 椭圆形
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.ellipse(x, y, 20, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 眼睛 - 沙雕大眼睛，可能交叉
    if (!this.blinking) {
      // 左眼
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(x - 8 + this.eyeOffset, y - 5, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 右眼
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(x + 8 - this.eyeOffset, y - 5, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // 瞳孔 - 大小不一，位置随机
      ctx.fillStyle = 'black';
      ctx.beginPath();
      
      // 根据模式设置瞳孔位置
      let leftPupilX = x - 8 + this.eyeOffset;
      let rightPupilX = x + 8 - this.eyeOffset;
      let pupilY = y - 5;
      
      // 根据不同状态调整瞳孔
      switch (mode) {
        case 'climbing':
          leftPupilX += 2;
          rightPupilX += 2;
          pupilY += 3;
          break;
        case 'celebrating':
          // 开心的星星眼
          this.drawStarEyes(ctx, x - 8 + this.eyeOffset, y - 5, x + 8 - this.eyeOffset, y - 5);
          return; // 跳过普通瞳孔绘制
        case 'thinking':
          leftPupilX += Math.sin(Date.now() / 500) * 3;
          rightPupilX += Math.sin(Date.now() / 500) * 3;
          pupilY += Math.cos(Date.now() / 500) * 3;
          break;
      }
      
      // 左瞳孔
      ctx.beginPath();
      ctx.arc(leftPupilX, pupilY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 右瞳孔
      ctx.beginPath();
      ctx.arc(rightPupilX, pupilY, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 眨眼状态 - 只画线条
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      
      // 左眼
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 5);
      ctx.lineTo(x - 4, y - 5);
      ctx.stroke();
      
      // 右眼
      ctx.beginPath();
      ctx.moveTo(x + 4, y - 5);
      ctx.lineTo(x + 12, y - 5);
      ctx.stroke();
    }
    
    // 根据不同状态绘制嘴巴
    switch (mode) {
      case 'standing':
        // 傻笑
        ctx.beginPath();
        ctx.arc(x, y + 8 + this.mouthOffset, 10, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
        
      case 'climbing':
        // 用力咬牙
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 10 + this.mouthOffset);
        ctx.lineTo(x + 8, y + 10 + this.mouthOffset);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 额外添加汗珠
        ctx.fillStyle = '#81D4FA';
        ctx.beginPath();
        ctx.arc(x - 15, y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'celebrating':
        // 大笑
        ctx.beginPath();
        ctx.arc(x, y + 10 + this.mouthOffset, 12, 0, Math.PI, false);
        ctx.fillStyle = '#B71C1C';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 舌头
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.ellipse(x, y + 15, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'thinking':
        // 歪嘴思考
        ctx.beginPath();
        ctx.moveTo(x - 7, y + 8 + this.mouthOffset);
        ctx.quadraticCurveTo(x, y + 15 + this.mouthOffset, x + 10, y + 8 + this.mouthOffset);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 问号气泡
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText('?', x + 15, y - 15);
        break;
    }
  }
  
  // 绘制星星眼睛
  private drawStarEyes(ctx: CanvasRenderingContext2D, leftX: number, leftY: number, rightX: number, rightY: number): void {
    const starSize = 6;
    ctx.fillStyle = '#FFD700';
    
    // 左眼星星
    this.drawStar(ctx, leftX, leftY, starSize, 5);
    
    // 右眼星星
    this.drawStar(ctx, rightX, rightY, starSize, 5);
  }
  
  // 绘制星星
  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, spikes: number): void {
    let rot = Math.PI / 2 * 3;
    const stepAngle = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * size;
      let y = cy + Math.sin(rot) * size;
      ctx.lineTo(x, y);
      rot += stepAngle;
      
      x = cx + Math.cos(rot) * size * 0.4;
      y = cy + Math.sin(rot) * size * 0.4;
      ctx.lineTo(x, y);
      rot += stepAngle;
    }
    
    ctx.lineTo(cx, cy - size);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // 绘制沙雕身体
  private drawBody(ctx: CanvasRenderingContext2D, x: number, y: number, mode: string): void {
    // 根据状态调整身体形状
    let bodyWidth = 25;
    let bodyHeight = 30;
    let skew = 0;
    
    switch (mode) {
      case 'climbing':
        // 努力爬楼梯时身体变形
        bodyWidth = 25 * (1 - this.animationProgress * 0.2);
        bodyHeight = 30 * (1 + this.animationProgress * 0.1);
        skew = 0.3 * this.animationProgress;
        break;
      case 'celebrating':
        // 庆祝时身体膨胀
        bodyWidth = 25 * (1 + Math.sin(Date.now() / 200) * 0.1);
        bodyHeight = 30 * (1 - Math.sin(Date.now() / 200) * 0.1);
        break;
      case 'thinking':
        // 思考时身体微微倾斜
        skew = Math.sin(Date.now() / 800) * 0.1;
        break;
    }
    
    // 绘制一个矮胖的圆角矩形身体
    ctx.save();
    ctx.transform(1, 0, skew, 1, 0, 0); // 添加倾斜变换
    
    // 身体渐变
    const gradient = ctx.createLinearGradient(x - bodyWidth/2, y, x + bodyWidth/2, y + bodyHeight);
    gradient.addColorStop(0, '#2196F3');
    gradient.addColorStop(1, '#0D47A1');
    ctx.fillStyle = gradient;
    
    // 圆角矩形身体
    this.roundRect(ctx, x - bodyWidth/2, y, bodyWidth, bodyHeight, 8);
    ctx.fill();
    ctx.strokeStyle = '#1A237E';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 加一些衣服细节
    if (mode === 'celebrating') {
      // 彩色纽扣
      const buttonColors = ['#F44336', '#FFEB3B', '#4CAF50'];
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = buttonColors[i];
        ctx.beginPath();
        ctx.arc(x, y + 10 + i * 7, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // 普通纽扣
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y + 10 + i * 10, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }
  
  // 绘制沙雕四肢
  private drawLimbs(ctx: CanvasRenderingContext2D, x: number, y: number, mode: string): void {
    ctx.strokeStyle = '#1565C0';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    let leftArmAngle = -Math.PI/6;
    let rightArmAngle = Math.PI/6;
    let leftLegAngle = -Math.PI/12;
    let rightLegAngle = Math.PI/12;
    
    // 根据状态调整四肢
    switch (mode) {
      case 'climbing': {
        // 爬楼梯时手脚乱动
        const progress = this.animationProgress;
        leftArmAngle = -Math.PI/3 - Math.sin(progress * Math.PI) * Math.PI/4;
        rightArmAngle = Math.PI/3 + Math.sin(progress * Math.PI) * Math.PI/4;
        leftLegAngle = -Math.PI/6 - Math.cos(progress * Math.PI) * Math.PI/6;
        rightLegAngle = Math.PI/6 + Math.cos(progress * Math.PI) * Math.PI/6;
        break;
      }
      case 'celebrating': {
        // 庆祝时手臂挥舞
        const time = Date.now() / 150;
        leftArmAngle = -Math.PI/2 + Math.sin(time) * Math.PI/4;
        rightArmAngle = Math.PI/2 - Math.sin(time + Math.PI) * Math.PI/4;
        leftLegAngle = -Math.PI/12 + Math.sin(time) * Math.PI/8;
        rightLegAngle = Math.PI/12 - Math.sin(time) * Math.PI/8;
        break;
      }
      case 'thinking':
        // 思考时一只手摸下巴
        leftArmAngle = -Math.PI/2;
        rightArmAngle = 3 * Math.PI/4;
        break;
    }
    
    // 绘制手臂
    // 左手臂
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 5);
    ctx.lineTo(x - 10 + Math.cos(leftArmAngle) * 20, y + 5 + Math.sin(leftArmAngle) * 20);
    ctx.stroke();
    
    // 右手臂
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 5);
    ctx.lineTo(x + 10 + Math.cos(rightArmAngle) * 20, y + 5 + Math.sin(rightArmAngle) * 20);
    ctx.stroke();
    
    // 绘制腿
    // 左腿
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 30);
    ctx.lineTo(x - 7 + Math.cos(leftLegAngle) * 15, y + 30 + Math.sin(leftLegAngle) * 15);
    ctx.stroke();
    
    // 右腿
    ctx.beginPath();
    ctx.moveTo(x + 7, y + 30);
    ctx.lineTo(x + 7 + Math.cos(rightLegAngle) * 15, y + 30 + Math.sin(rightLegAngle) * 15);
    ctx.stroke();
  }
  
  // 绘制阴影
  private drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.ellipse(x, y, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 绘制爬楼梯特效
  private drawClimbingEffects(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (this.animationProgress > 0.3 && this.animationProgress < 0.7) {
      // 动态线条表示用力
      ctx.strokeStyle = 'rgba(255, 87, 34, 0.7)';
      ctx.lineWidth = 2;
      
      const effortLevel = Math.sin(this.animationProgress * Math.PI);
      const lineCount = 6;
      
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const length = 10 + effortLevel * 10;
        
        ctx.globalAlpha = effortLevel * 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + Math.cos(angle + Date.now() / 500) * length,
          y + Math.sin(angle + Date.now() / 500) * length
        );
        ctx.stroke();
      }
      
      // 汗滴
      const sweatCount = 3;
      ctx.fillStyle = '#81D4FA';
      
      for (let i = 0; i < sweatCount; i++) {
        const sweatAngle = -Math.PI/2 + (i / sweatCount - 0.5) * Math.PI/2;
        const sweatDist = 25 + Math.random() * 5;
        const sweatSize = 2 + Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(
          x + Math.cos(sweatAngle) * sweatDist,
          y + Math.sin(sweatAngle) * sweatDist,
          sweatSize,
          0, Math.PI * 2
        );
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
    }
  }
  
  // 绘制庆祝特效
  private drawCelebrationEffects(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // 庆祝星星
    const starCount = 8;
    
    for (let i = 0; i < starCount; i++) {
      const time = Date.now() / 1000 + i;
      const angle = (i / starCount) * Math.PI * 2;
      const distance = 30 + Math.sin(time * 3) * 10;
      const size = 3 + Math.cos(time * 5) * 2;
      
      ctx.fillStyle = `hsl(${(i * 50) % 360}, 100%, 50%)`;
      this.drawStar(
        ctx,
        x + Math.cos(angle + time) * distance,
        y + Math.sin(angle + time) * distance,
        size,
        5
      );
    }
    
    // 彩色线条
    const lineCount = 12;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < lineCount; i++) {
      const time = Date.now() / 500 + i;
      const angle = (i / lineCount) * Math.PI * 2;
      const innerRadius = 20 + Math.sin(time) * 5;
      const outerRadius = innerRadius + 10 + Math.cos(time) * 5;
      
      ctx.strokeStyle = `hsl(${(i * 30) % 360}, 100%, 50%)`;
      ctx.beginPath();
      ctx.moveTo(
        x + Math.cos(angle) * innerRadius,
        y + Math.sin(angle) * innerRadius
      );
      ctx.lineTo(
        x + Math.cos(angle) * outerRadius,
        y + Math.sin(angle) * outerRadius
      );
      ctx.stroke();
    }
  }
  
  // 绘制思考泡泡
  private drawThinkingBubbles(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const time = Date.now() / 1000;
    const bubbleSizes = [4, 7, 12];
    const bubbleOffsets = [
      { x: 0, y: 0 },
      { x: 8, y: -10 },
      { x: 18, y: -25 }
    ];
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // 绘制三个逐渐变大的思考泡泡
    for (let i = 0; i < 3; i++) {
      const size = bubbleSizes[i];
      const offset = bubbleOffsets[i];
      const pulse = Math.sin(time * 2 + i) * 0.2 + 1;
      
      // 漂浮效果
      const floatX = Math.sin(time * 1.5 + i * 1.2) * 2;
      const floatY = Math.cos(time * 1.3 + i * 0.8) * 2;
      
      ctx.beginPath();
      ctx.arc(
        x + offset.x + floatX, 
        y + offset.y + floatY, 
        size * pulse, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // 泡泡高光
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      ctx.arc(
        x + offset.x + floatX - size * 0.3, 
        y + offset.y + floatY - size * 0.3, 
        size * 0.3, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    }
  }
  
  // 绘制对话气泡
  private drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string): void {
    const bubbleWidth = Math.min(200, text.length * 9 + 20);
    const bubbleHeight = 40;
    const bubbleX = x + 30;
    const bubbleY = y - 80;
    
    // 气泡背景
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // 绘制圆角矩形
    this.roundRect(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
    ctx.fill();
    ctx.stroke();
    
    // 绘制气泡尾部指向小人
    ctx.beginPath();
    ctx.moveTo(bubbleX + 20, bubbleY + bubbleHeight);
    ctx.lineTo(x + 15, y - 20);
    ctx.lineTo(bubbleX + 40, bubbleY + bubbleHeight);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // 绘制文本
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 如果文本太长，需要截断或换行显示
    if (text.length > 25) {
      // 简单换行处理
      const firstHalf = text.substring(0, 25);
      const secondHalf = text.substring(25);
      ctx.fillText(firstHalf, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2 - 10);
      ctx.fillText(secondHalf, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2 + 10);
    } else {
      ctx.fillText(text, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2);
    }
  }
  
  // 绘制圆角矩形辅助函数
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
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
} 