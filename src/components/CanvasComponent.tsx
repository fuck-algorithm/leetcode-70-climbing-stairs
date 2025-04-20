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
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;
    
    // 创建根容器
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // 创建图层
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const linkGroup = g.append('g').attr('class', 'links');
    const textGroup = g.append('g').attr('class', 'texts');
    const formulaGroup = g.append('g').attr('class', 'formula');
    
    // 计算节点的缩放比例
    const maxX = Math.max(...state.staircase.nodes.map(n => n.x)) || 100;
    const maxY = Math.max(...state.staircase.nodes.map(n => n.y)) || 100;
    const scaleX = innerWidth / (maxX + 100);
    const scaleY = innerHeight / (maxY + 60);
    
    // 计算节点位置的映射函数
    const mapX = (x: number) => x * scaleX;
    const mapY = (y: number) => y * scaleY;
    
    // 绘制连接线
    linkGroup.selectAll('line')
      .data(state.staircase.links)
      .enter()
      .append('line')
      .attr('x1', (d: LinkData) => mapX(state.staircase.nodes[d.source].x))
      .attr('y1', (d: LinkData) => mapY(state.staircase.nodes[d.source].y))
      .attr('x2', (d: LinkData) => mapX(state.staircase.nodes[d.target].x))
      .attr('y2', (d: LinkData) => mapY(state.staircase.nodes[d.target].y))
      .attr('stroke', '#666')
      .attr('stroke-width', 2);
    
    // 绘制节点
    const nodeColor = getColorByAlgorithm(state.currentAlgorithm);
    const nodeRadius = Math.min(20, Math.max(15, Math.min(innerWidth, innerHeight) / 30));
    
    nodeGroup.selectAll('circle')
      .data(state.staircase.nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: NodeData) => mapX(d.x))
      .attr('cy', (d: NodeData) => mapY(d.y))
      .attr('r', nodeRadius)
      .attr('fill', nodeColor)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);
    
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
    
    // 渲染公式
    if (state.formula) {
      formulaGroup.append('text')
        .attr('x', innerWidth - 20)
        .attr('y', 20)
        .attr('text-anchor', 'end')
        .attr('font-family', 'serif')
        .attr('font-size', `${Math.min(14, Math.max(10, innerWidth / 40))}px`)
        .text(state.formula);
    }
    
    // 渲染矩阵（仅当使用矩阵算法时）
    if (state.currentAlgorithm === 'matrix' && state.matrix.length > 0) {
      renderMatrix(g, state.matrix, innerWidth, innerHeight);
    }
    
  }, [state.staircase, state.currentAlgorithm, state.formula, state.matrix, dimensions]);
  
  // 根据算法类型获取颜色
  const getColorByAlgorithm = (algorithm: AnimationState['currentAlgorithm']): string => {
    switch (algorithm) {
      case 'dp':
        return '#4CAF50'; // 绿色
      case 'matrix':
        return '#2196F3'; // 蓝色
      case 'formula':
        return '#9C27B0'; // 紫色
      default:
        return '#4CAF50';
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
      .attr('transform', `translate(${width - 100}, 50)`);
    
    const cellSize = Math.min(30, Math.max(20, width / 20));
    
    // 绘制矩阵单元格
    matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        matrixGroup.append('rect')
          .attr('x', j * cellSize)
          .attr('y', i * cellSize)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', '#f5f5f5')
          .attr('stroke', '#333');
        
        matrixGroup.append('text')
          .attr('x', j * cellSize + cellSize / 2)
          .attr('y', i * cellSize + cellSize / 2 + 5)
          .attr('text-anchor', 'middle')
          .text(value);
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
  );
};

export default CanvasComponent; 