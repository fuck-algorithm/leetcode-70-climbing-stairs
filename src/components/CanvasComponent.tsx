import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AnimationState } from '../state/animationSlice';

interface LinkData {
  source: number;
  target: number;
}

interface NodeData {
  x: number;
  y: number;
  value: number;
  id: number;
}

interface CanvasComponentProps {
  state: AnimationState;
  width: number;
  height: number;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ state, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  
  // 监听窗口尺寸变化
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const newWidth = window.innerWidth * 0.65;
        const newHeight = window.innerHeight * 0.7;
        setDimensions({ width: newWidth, height: newHeight });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 更新尺寸
  useEffect(() => {
    setDimensions({ width, height });
  }, [width, height]);
  
  // 渲染楼梯节点图
  useEffect(() => {
    if (!svgRef.current || !state.staircase.nodes.length) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // 清空画布
    
    // 设置预留边距
    const margin = { top: 80, right: 30, bottom: 30, left: 30 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;
    
    // 创建根容器
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // 创建图层
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const linkGroup = g.append('g').attr('class', 'links');
    const textGroup = g.append('g').attr('class', 'texts');
    const labelGroup = g.append('g').attr('class', 'labels'); // 新增：节点标签图层
    const formulaGroup = g.append('g').attr('class', 'formula');
    const stepDescGroup = svg.append('g').attr('class', 'step-description'); // 新增：步骤说明图层
    
    // 计算节点的缩放比例
    const maxX = Math.max(...state.staircase.nodes.map(n => n.x)) || 100;
    const maxY = Math.max(...state.staircase.nodes.map(n => n.y)) || 100;
    const scaleX = innerWidth / (maxX + 100);
    const scaleY = innerHeight / (maxY + 60);
    
    // 计算节点位置的映射函数
    const mapX = (x: number) => x * scaleX;
    const mapY = (y: number) => y * scaleY;
    
    // 添加步骤描述背景和文本 - 新增内容
    const stepDesc = state.timeline[state.currentStep]?.description || "";
    const stepBackground = stepDescGroup.append('rect')
      .attr('x', 0)
      .attr('y', 10)
      .attr('width', dimensions.width)
      .attr('height', 50)
      .attr('fill', '#f0f8ff')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('stroke', '#2196F3')
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);
    
    // 添加步骤计数器 - 新增内容
    stepDescGroup.append('text')
      .attr('x', 20)
      .attr('y', 35)
      .attr('font-weight', 'bold')
      .attr('fill', '#2196F3')
      .text(`步骤 ${state.currentStep + 1}/${state.totalSteps}`);
    
    // 添加步骤描述文本 - 新增内容
    stepDescGroup.append('text')
      .attr('x', 120)
      .attr('y', 35)
      .attr('fill', '#333')
      .attr('font-size', '14px')
      .text(stepDesc);
    
    // 绘制连接线 - 修改为箭头
    linkGroup.selectAll('path')
      .data(state.staircase.links)
      .enter()
      .append('path')
      .attr('d', (d: LinkData) => {
        const sourceX = mapX(state.staircase.nodes[d.source].x);
        const sourceY = mapY(state.staircase.nodes[d.source].y);
        const targetX = mapX(state.staircase.nodes[d.target].x);
        const targetY = mapY(state.staircase.nodes[d.target].y);
        
        // 计算箭头方向和弯曲度
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // 弯曲程度
        
        // 使用弧线路径
        return `M${sourceX},${sourceY}A${dr},${dr} 0 0,1 ${targetX},${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)'); // 使用箭头标记
    
    // 添加箭头标记定义 - 新增内容
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#666');
    
    // 绘制节点
    const nodeColor = getNodeColor; // 修改为根据节点状态返回颜色的函数
    const nodeRadius = Math.min(20, Math.max(15, Math.min(innerWidth, innerHeight) / 30));
    
    nodeGroup.selectAll('circle')
      .data(state.staircase.nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: NodeData) => mapX(d.x))
      .attr('cy', (d: NodeData) => mapY(d.y))
      .attr('r', nodeRadius)
      .attr('fill', (d: NodeData, i: number) => {
        // 当前步骤相关节点高亮
        if (state.timeline[state.currentStep]?.visualChanges.nodeUpdates.some(update => update.index === i)) {
          return '#FF5722'; // 高亮颜色 - 橙色
        }
        return nodeColor(state.currentAlgorithm, i, state.currentStep);
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('class', (d: NodeData, i: number) => {
        // 为当前更新的节点添加类名，便于添加动画效果
        if (state.timeline[state.currentStep]?.visualChanges.nodeUpdates.some(update => update.index === i)) {
          return 'node-highlight';
        }
        return '';
      });
    
    // 添加节点值文本
    textGroup.selectAll('text')
      .data(state.staircase.nodes)
      .enter()
      .append('text')
      .attr('x', (d: NodeData) => mapX(d.x))
      .attr('y', (d: NodeData) => mapY(d.y) + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .text((d: NodeData) => d.value);
    
    // 添加节点标签 - 新增内容
    labelGroup.selectAll('text')
      .data(state.staircase.nodes)
      .enter()
      .append('text')
      .attr('x', (d: NodeData) => mapX(d.x))
      .attr('y', (d: NodeData) => mapY(d.y) - nodeRadius - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', '12px')
      .text((d: NodeData, i: number) => `f(${i})`);
    
    // 添加当前计算节点的说明气泡 - 新增内容
    state.timeline[state.currentStep]?.visualChanges.nodeUpdates.forEach(update => {
      if (update.index >= 0 && update.index < state.staircase.nodes.length) {
        const node = state.staircase.nodes[update.index];
        const bubbleWidth = 120;
        const bubbleHeight = 30;
        
        // 绘制说明气泡背景
        g.append('rect')
          .attr('x', mapX(node.x) - bubbleWidth/2)
          .attr('y', mapY(node.y) - nodeRadius - bubbleHeight - 15)
          .attr('width', bubbleWidth)
          .attr('height', bubbleHeight)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('fill', '#FFECB3')
          .attr('stroke', '#FFC107')
          .attr('stroke-width', 1)
          .attr('opacity', 0.9);
        
        // 绘制连接线
        g.append('path')
          .attr('d', `M${mapX(node.x)},${mapY(node.y) - nodeRadius - 15} L${mapX(node.x)},${mapY(node.y) - nodeRadius - 5}`)
          .attr('stroke', '#FFC107')
          .attr('stroke-width', 1);
        
        // 添加说明文字
        g.append('text')
          .attr('x', mapX(node.x))
          .attr('y', mapY(node.y) - nodeRadius - 30)
          .attr('text-anchor', 'middle')
          .attr('fill', '#333')
          .attr('font-size', '11px')
          .text(`计算第 ${update.index} 阶方法数`);
      }
    });
    
    // 渲染公式 - 增强显示
    if (state.formula) {
      const formulaBackground = formulaGroup.append('rect')
        .attr('x', innerWidth - 220)
        .attr('y', -20)
        .attr('width', 200)
        .attr('height', 40)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', '#E3F2FD')
        .attr('stroke', '#64B5F6')
        .attr('stroke-width', 1);
      
      formulaGroup.append('text')
        .attr('x', innerWidth - 120)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'serif')
        .attr('font-size', `${Math.min(16, Math.max(12, innerWidth / 40))}px`)
        .attr('font-weight', 'bold')
        .text(state.formula);
      
      // 添加公式说明
      formulaGroup.append('text')
        .attr('x', innerWidth - 120)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#666')
        .text('状态转移方程');
    }
    
    // 为动画添加CSS动画效果
    svg.selectAll('.node-highlight')
      .style('animation', 'pulse 1.5s infinite');
    
    // 渲染矩阵（仅当使用矩阵算法时）
    if (state.currentAlgorithm === 'matrix' && state.matrix.length > 0) {
      renderMatrix(g, state.matrix, innerWidth, innerHeight);
    }
    
  }, [state.staircase, state.currentAlgorithm, state.formula, state.matrix, dimensions, state.currentStep, state.timeline, state.totalSteps]);
  
  // 根据算法类型和节点索引获取颜色
  const getNodeColor = (algorithm: AnimationState['currentAlgorithm'], nodeIndex: number, currentStep: number): string => {
    // 检查节点是否已经计算过
    const isCalculated = currentStep > 0 && 
      Array.from({length: currentStep}).some((_, stepIdx) => 
        state.timeline[stepIdx]?.visualChanges.nodeUpdates.some(update => update.index === nodeIndex)
      );
    
    if (isCalculated) {
      switch (algorithm) {
        case 'dp':
          return '#81C784'; // 浅绿色 - 已计算的DP节点
        case 'matrix':
          return '#64B5F6'; // 浅蓝色 - 已计算的矩阵节点
        case 'formula':
          return '#BA68C8'; // 浅紫色 - 已计算的公式节点
        default:
          return '#81C784';
      }
    } else {
      // 未计算的节点使用较暗的颜色
    switch (algorithm) {
      case 'dp':
          return '#4CAF50'; // 绿色 - 未计算的DP节点
      case 'matrix':
          return '#2196F3'; // 蓝色 - 未计算的矩阵节点
      case 'formula':
          return '#9C27B0'; // 紫色 - 未计算的公式节点
      default:
        return '#4CAF50';
      }
    }
  };
  
  // 渲染矩阵
  const renderMatrix = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>, 
    matrix: number[][], 
    width: number, 
    height: number
  ) => {
    const matrixGroup = g.append('g')
      .attr('class', 'matrix')
      .attr('transform', `translate(${width - 120}, 50)`);
    
    const cellSize = Math.min(30, Math.max(20, width / 20));
    
    // 添加矩阵标题
    matrixGroup.append('text')
      .attr('x', cellSize * matrix[0].length / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px')
      .text('状态矩阵');
    
    // 绘制矩阵单元格
    matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        // 绘制单元格背景
        matrixGroup.append('rect')
          .attr('x', j * cellSize)
          .attr('y', i * cellSize)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', (state.timeline[state.currentStep]?.visualChanges.matrixUpdates.some(
            update => update.row === i && update.col === j
          )) ? '#FFCC80' : '#f5f5f5') // 当前更新的单元格高亮
          .attr('stroke', '#333');
        
        // 绘制单元格文本
        matrixGroup.append('text')
          .attr('x', j * cellSize + cellSize / 2)
          .attr('y', i * cellSize + cellSize / 2 + 5)
          .attr('text-anchor', 'middle')
          .text(value);
        
        // 添加单元格标签
        if (i === 0) {
          matrixGroup.append('text')
            .attr('x', j * cellSize + cellSize / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .text(`f(${j})`);
        }
      });
    });
    
    // 添加矩阵括号
    matrixGroup.append('path')
      .attr('d', `M0,0 L-5,0 L-5,${matrix.length * cellSize} L0,${matrix.length * cellSize}`)
      .attr('stroke', '#333')
      .attr('fill', 'none');
    
    matrixGroup.append('path')
      .attr('d', `M${matrix[0].length * cellSize},0 L${matrix[0].length * cellSize + 5},0 L${matrix[0].length * cellSize + 5},${matrix.length * cellSize} L${matrix[0].length * cellSize},${matrix.length * cellSize}`)
      .attr('stroke', '#333')
      .attr('fill', 'none');
  };
  
  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
          .node-highlight {
            filter: drop-shadow(0 0 5px #FF5722);
          }
        `}
      </style>
    <svg 
      ref={svgRef} 
      width={dimensions.width}
      height={dimensions.height}
      style={{ 
        border: '1px solid #ccc', 
        borderRadius: '4px',
        width: '100%',
        height: '100%'
      }}
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
    />
    </>
  );
};

export default CanvasComponent; 