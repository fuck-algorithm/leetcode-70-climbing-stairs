// 小人控制器类 - 统一管理小人的行为和状态
import { ANIMATION_PHASE, CLIMBER_STATE } from '../constants';
import { ShadiaoCharacter } from '../characters/ShadiaoCharacter';
import { StairPosition } from '../types';

// 小人控制器接口
export interface ClimberAnimationOptions {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  animationPhase: number;
  animationProgress: number;
  climberState: number;
  currentPosition: { x: number, y: number };
  targetPosition: { x: number, y: number };
  isMoving: boolean;
  movementProgress: number;
  stairPositions: StairPosition[];
  currentStairIndex: number;
  pathPoints: Array<{ x: number, y: number }>;
  showBubble: boolean;
  bubbleText: string;
}

// 小人控制器类
export class ClimberController {
  private character: ShadiaoCharacter;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationPhase: number = ANIMATION_PHASE.NONE;
  private animationProgress: number = 0;
  private climberState: number = CLIMBER_STATE.STANDING;
  private currentPosition: { x: number, y: number } = { x: 0, y: 0 };
  private targetPosition: { x: number, y: number } = { x: 0, y: 0 };
  private isMoving: boolean = false;
  private movementProgress: number = 0;
  private stairPositions: StairPosition[] = [];
  private currentStairIndex: number = 0;
  private pathPoints: Array<{ x: number, y: number }> = [];
  private showBubble: boolean = false;
  private bubbleText: string = '';
  
  constructor(options: Partial<ClimberAnimationOptions>) {
    this.character = new ShadiaoCharacter();
    
    if (options.canvas) this.canvas = options.canvas;
    if (options.ctx) this.ctx = options.ctx;
    
    // 初始化其他属性
    if (options.animationPhase !== undefined) this.animationPhase = options.animationPhase;
    if (options.animationProgress !== undefined) this.animationProgress = options.animationProgress;
    if (options.climberState !== undefined) this.climberState = options.climberState;
    if (options.currentPosition) this.currentPosition = { ...options.currentPosition };
    if (options.targetPosition) this.targetPosition = { ...options.targetPosition };
    if (options.isMoving !== undefined) this.isMoving = options.isMoving;
    if (options.movementProgress !== undefined) this.movementProgress = options.movementProgress;
    if (options.stairPositions) this.stairPositions = [...options.stairPositions];
    if (options.currentStairIndex !== undefined) this.currentStairIndex = options.currentStairIndex;
    if (options.pathPoints) this.pathPoints = [...options.pathPoints];
    if (options.showBubble !== undefined) this.showBubble = options.showBubble;
    if (options.bubbleText !== undefined) this.bubbleText = options.bubbleText;
  }
  
  // 更新动画阶段
  public updateAnimationPhase(phase: number, progress: number): void {
    this.animationPhase = phase;
    this.animationProgress = progress;
    this.updateState();
  }
  
  // 更新小人状态
  public updateClimberState(state: number): void {
    this.climberState = state;
    this.updateState();
  }
  
  // 更新当前位置
  public updatePosition(position: { x: number, y: number }): void {
    this.currentPosition = { ...position };
    this.updateState();
  }
  
  // 设置目标位置
  public setTargetPosition(position: { x: number, y: number }): void {
    this.targetPosition = { ...position };
  }
  
  // 设置移动状态
  public setMoving(isMoving: boolean, progress: number = 0): void {
    this.isMoving = isMoving;
    this.movementProgress = progress;
    this.updateState();
  }
  
  // 设置楼梯位置
  public setStairPositions(positions: StairPosition[]): void {
    this.stairPositions = [...positions];
  }
  
  // 设置当前楼梯索引
  public setCurrentStairIndex(index: number): void {
    this.currentStairIndex = index;
  }
  
  // 设置路径点
  public setPathPoints(points: Array<{ x: number, y: number }>): void {
    this.pathPoints = [...points];
  }
  
  // 设置气泡显示
  public showSpeechBubble(text: string, show: boolean = true): void {
    this.showBubble = show;
    this.bubbleText = text;
    this.updateState();
  }
  
  // 隐藏气泡
  public hideSpeechBubble(): void {
    this.showBubble = false;
    this.updateState();
  }
  
  // 更新小人状态
  private updateState(): void {
    // 更新字符状态
    this.character.updateState(
      this.climberState,
      this.currentPosition,
      this.animationPhase,
      this.animationProgress,
      this.showBubble,
      this.bubbleText
    );
  }
  
  // 计算移动路径
  public calculatePath(
    startPosition: { x: number, y: number },
    targetPosition: { x: number, y: number },
    includeArc: boolean = true
  ): Array<{ x: number, y: number }> {
    const points: Array<{ x: number, y: number }> = [];
    const pointCount = 30; // 路径点数量
    
    if (includeArc) {
      // 创建一个弧形路径 - 从起点跳跃到终点
      const midX = (startPosition.x + targetPosition.x) / 2;
      const highestY = Math.min(startPosition.y, targetPosition.y) - 50; // 弧顶高度
      
      for (let i = 0; i <= pointCount; i++) {
        const progress = i / pointCount;
        
        // 水平位置线性插值
        const x = startPosition.x + (targetPosition.x - startPosition.x) * progress;
        
        // 垂直位置使用二次贝塞尔曲线创建弧形
        let y;
        if (progress < 0.5) {
          // 上升阶段 - 从起点到最高点
          const subProgress = progress * 2; // 重新映射到0-1
          y = startPosition.y + (highestY - startPosition.y) * (1 - Math.pow(1 - subProgress, 2));
        } else {
          // 下降阶段 - 从最高点到终点
          const subProgress = (progress - 0.5) * 2; // 重新映射到0-1
          y = highestY + (targetPosition.y - highestY) * Math.pow(subProgress, 2);
        }
        
        points.push({ x, y });
      }
    } else {
      // 简单的线性路径
      for (let i = 0; i <= pointCount; i++) {
        const progress = i / pointCount;
        const x = startPosition.x + (targetPosition.x - startPosition.x) * progress;
        const y = startPosition.y + (targetPosition.y - startPosition.y) * progress;
        points.push({ x, y });
      }
    }
    
    return points;
  }
  
  // 移动到指定楼梯
  public moveToStair(stairIndex: number, includeArc: boolean = true): void {
    if (stairIndex >= 0 && stairIndex < this.stairPositions.length) {
      const targetStair = this.stairPositions[stairIndex];
      const targetPosition = {
        x: targetStair.centerX,
        y: targetStair.centerY - 20 // 小人站在楼梯上的位置
      };
      
      this.setTargetPosition(targetPosition);
      this.setCurrentStairIndex(stairIndex);
      
      // 计算移动路径
      const pathPoints = this.calculatePath(this.currentPosition, targetPosition, includeArc);
      this.setPathPoints(pathPoints);
      
      // 设置移动状态
      this.setMoving(true, 0);
      
      // 根据是否是上楼设置适当的状态
      if (stairIndex > this.currentStairIndex) {
        this.updateClimberState(CLIMBER_STATE.CLIMBING_ONE);
      } else {
        this.updateClimberState(CLIMBER_STATE.STANDING);
      }
    }
  }
  
  // 更新移动进度
  public updateMovement(deltaProgress: number): void {
    if (!this.isMoving || this.pathPoints.length === 0) return;
    
    // 更新移动进度
    this.movementProgress += deltaProgress;
    
    // 确保进度在0-1之间
    if (this.movementProgress > 1) {
      this.movementProgress = 1;
      this.isMoving = false;
      this.climberState = CLIMBER_STATE.STANDING; // 移动完成后回到站立状态
    }
    
    // 根据进度计算当前位置
    const pointIndex = Math.floor(this.movementProgress * (this.pathPoints.length - 1));
    const nextPointIndex = Math.min(pointIndex + 1, this.pathPoints.length - 1);
    const pointProgress = this.movementProgress * (this.pathPoints.length - 1) - pointIndex;
    
    const currentPoint = this.pathPoints[pointIndex];
    const nextPoint = this.pathPoints[nextPointIndex];
    
    // 线性插值计算当前位置
    this.currentPosition = {
      x: currentPoint.x + (nextPoint.x - currentPoint.x) * pointProgress,
      y: currentPoint.y + (nextPoint.y - currentPoint.y) * pointProgress
    };
    
    // 在不同阶段调整小人状态
    if (this.movementProgress < 0.4) {
      this.climberState = CLIMBER_STATE.CLIMBING_ONE;
    } else if (this.movementProgress < 0.8) {
      this.climberState = CLIMBER_STATE.CLIMBING_TWO;
    } else {
      this.climberState = CLIMBER_STATE.STANDING;
    }
    
    this.updateState();
  }
  
  // 在指定位置显示思考状态
  public showThinking(position: { x: number, y: number }, text: string = ""): void {
    this.updatePosition(position);
    this.updateClimberState(CLIMBER_STATE.THINKING);
    if (text) {
      this.showSpeechBubble(text);
    }
  }
  
  // 显示庆祝状态
  public showCelebrating(position: { x: number, y: number }, text: string = ""): void {
    this.updatePosition(position);
    this.updateClimberState(CLIMBER_STATE.CELEBRATING);
    if (text) {
      this.showSpeechBubble(text);
    }
  }
  
  // 绘制小人
  public draw(): void {
    if (!this.ctx) return;
    
    // 清除画布 (通常在绘制前完成)
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制小人
    this.character.draw(this.ctx);
  }
} 