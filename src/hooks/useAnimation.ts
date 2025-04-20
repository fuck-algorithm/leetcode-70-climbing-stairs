import { useEffect, useRef } from 'react';
import { AnimationState, setCurrentStep, playPause, resetAnimation } from '../state/animationSlice';
import { generateDPSolution } from '../algorithms/dpAlgorithm';
import { generateMatrixSolution } from '../algorithms/matrixAlgorithm';
import { generateFormulaSolution } from '../algorithms/formulaAlgorithm';

/**
 * 动画钩子函数，控制爬楼梯算法动画
 * @param state 当前状态
 * @param dispatch Redux dispatch函数
 * @param n 楼梯阶数，默认为5
 */
export function useAnimation(
  state: AnimationState,
  dispatch: (action: any) => void,
  n: number = 5
) {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeStampRef = useRef<number>(0);
  const stepStartTimeRef = useRef<number>(0); // 用于记录当前步骤开始的时间戳

  // 初始化算法解决方案和时间线
  useEffect(() => {
    // 重置任何正在进行的动画
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    lastTimeStampRef.current = 0;
    stepStartTimeRef.current = 0;
    
    let solution;
    
    // 根据当前选择的算法生成解决方案
    switch (state.currentAlgorithm) {
      case 'dp':
        solution = generateDPSolution(n);
        break;
      case 'matrix':
        solution = generateMatrixSolution(n);
        break;
      case 'formula':
        solution = generateFormulaSolution(n);
        break;
      default:
        solution = generateDPSolution(n);
    }
    
    const { timeline } = solution;
    console.log(`生成时间线，长度: ${timeline.length}`); // 添加日志
    
    // 准备数据结构
    const nodes = [];
    const links = [];
    
    // 初始化楼梯节点（当使用DP或矩阵时）
    if (state.currentAlgorithm !== 'formula') {
      for (let i = 0; i <= n; i++) {
        nodes.push({
          id: i,
          x: 50 + i * 80,
          y: 300 - Math.min(i * 40, 200),
          value: i <= 1 ? 1 : 0
        });
        
        // 添加连接（从每个节点到前两个节点）
        if (i >= 2) {
          links.push({ source: i - 1, target: i });
          links.push({ source: i - 2, target: i });
        }
      }
    }
    
    // 使用单一action更新所有状态
    dispatch({ 
      type: 'animation/initialize', 
      payload: { 
        timeline: timeline,
        staircase: { nodes, links },
        matrix: state.currentAlgorithm === 'matrix' ? [[1, 1], [1, 0]] : [],
        formula: ''
      }
    });
    
  }, [state.currentAlgorithm, n, dispatch]);
  
  // 处理动画播放和暂停
  useEffect(() => {
    const cleanup = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    // 条件：正在播放，总步数大于0，并且当前步数小于总步数
    if (state.isPlaying && state.totalSteps > 0 && state.currentStep < state.totalSteps) {
      
      const animate = (timestamp: number) => {
        // 初始化时间戳
        if (!stepStartTimeRef.current) {
           stepStartTimeRef.current = timestamp;
           lastTimeStampRef.current = timestamp; 
        }
        
        const elapsedSinceLastStep = timestamp - lastTimeStampRef.current;
        const stepDuration = 1000 / state.playbackSpeed; // 每步持续时间

        // 检查是否到达下一步的时间
        if (elapsedSinceLastStep >= stepDuration) {
          const nextStep = state.currentStep + 1;
          
          // 如果还有下一步
          if (nextStep < state.totalSteps) {
            dispatch(setCurrentStep(nextStep));
            lastTimeStampRef.current = timestamp; // 更新时间戳
            stepStartTimeRef.current = timestamp; // 重置步开始时间
             // 请求下一帧 (放在这里确保更新step后继续)
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            // 到达最后一步，停止播放
            dispatch(playPause()); 
            cleanup(); // 清理动画帧
          }
        } else {
          // 时间未到，继续请求下一帧
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      
      // 启动动画循环前先清理
      cleanup(); 
      animationFrameRef.current = requestAnimationFrame(animate);
      
    } else {
        // 如果不是播放状态或动画结束，确保清理
        cleanup();
    }
    
    // 组件卸载或依赖变化时清理
    return cleanup;

  }, [state.isPlaying, state.currentStep, state.totalSteps, state.playbackSpeed, dispatch]); // 移除 state.timeline 依赖，因为它在初始化时设置

  // 更新每一步的可视化 (这部分逻辑应保持不变，响应 currentStep 的变化)
  useEffect(() => {
    if (state.currentStep >= 0 && state.currentStep < state.timeline.length) {
      const { visualChanges } = state.timeline[state.currentStep];
      
      // 更新节点
      if (visualChanges.nodeUpdates?.length > 0) {
        const updatedNodes = [...state.staircase.nodes];
        visualChanges.nodeUpdates.forEach(update => {
          const { index, props } = update;
          if (index >= 0 && index < updatedNodes.length) {
            updatedNodes[index] = { ...updatedNodes[index], ...props };
          }
        });
        dispatch({ 
          type: 'animation/updateStaircase', 
          payload: { ...state.staircase, nodes: updatedNodes } 
        });
      }
      
      // 更新矩阵
      if (visualChanges.matrixUpdates?.length > 0) {
        let matrix = state.matrix.length > 0 
          ? state.matrix.map(row => [...row]) // 深拷贝
          : []; 
          
        // 如果是初始化矩阵且当前矩阵为空，则创建
        if (matrix.length === 0 && visualChanges.matrixUpdates.some(u => u.row === 0 && u.col === 0)) {
            const maxRow = Math.max(...visualChanges.matrixUpdates.map(u => u.row));
            const maxCol = Math.max(...visualChanges.matrixUpdates.map(u => u.col));
            matrix = Array(maxRow + 1).fill(0).map(() => Array(maxCol + 1).fill(0));
        }
        
        visualChanges.matrixUpdates.forEach(update => {
          const { row, col, value } = update;
          if (matrix[row] && matrix[row][col] !== undefined) {
            matrix[row][col] = value;
          }
        });
        dispatch({ type: 'animation/updateMatrix', payload: matrix });
      }
      
      // 更新公式
      if (visualChanges.formulaUpdate !== undefined) { // 检查 undefined 而不是 null
        dispatch({ type: 'animation/updateFormula', payload: visualChanges.formulaUpdate ?? '' });
      }
    } else if (state.totalSteps === 0) {
        // 处理 timeline 为空或初始化的情况
        dispatch({ type: 'animation/updateFormula', payload: '' });
        dispatch({ type: 'animation/updateMatrix', payload: [] });
    }
  }, [state.currentStep, state.timeline, dispatch]); // 移除其他依赖，只依赖 currentStep 和 timeline
  
  return {
    restartAnimation: () => {
      cleanup(); 
      lastTimeStampRef.current = 0;
      stepStartTimeRef.current = 0;
      dispatch(resetAnimation()); // 现在可以正确调用
    }
  };

  function cleanup() {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }
} 