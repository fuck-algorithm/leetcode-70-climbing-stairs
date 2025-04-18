import React, { useEffect, useRef } from 'react';
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
  
  // 渲染楼梯节点图
  useEffect(() => {
    if (!svgRef.current || !state.staircase.nodes.length) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // 清空画布
    
    // 创建图层
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    const linkGroup = svg.append('g').attr('class', 'links');
    const textGroup = svg.append('g').attr('class', 'texts');
    const formulaGroup = svg.append('g').attr('class', 'formula');
    
    // 绘制连接线
    linkGroup.selectAll('line')
      .data(state.staircase.links)
      .enter()
      .append('line')
      .attr('x1', (d: LinkData) => state.staircase.nodes[d.source].x)
      .attr('y1', (d: LinkData) => state.staircase.nodes[d.source].y)
      .attr('x2', (d: LinkData) => state.staircase.nodes[d.target].x)
      .attr('y2', (d: LinkData) => state.staircase.nodes[d.target].y)
      .attr('stroke', '#666')
      .attr('stroke-width', 2);
    
    // 绘制节点
    const nodeColor = getColorByAlgorithm(state.currentAlgorithm);
    
    nodeGroup.selectAll('circle')
      .data(state.staircase.nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: NodeData) => d.x)
      .attr('cy', (d: NodeData) => d.y)
      .attr('r', 20)
      .attr('fill', nodeColor)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);
    
    // 添加节点值文本
    textGroup.selectAll('text')
      .data(state.staircase.nodes)
      .enter()
      .append('text')
      .attr('x', (d: NodeData) => d.x)
      .attr('y', (d: NodeData) => d.y + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .text((d: NodeData) => d.value);
    
    // 渲染公式
    if (state.formula) {
      formulaGroup.append('text')
        .attr('x', width - 50)
        .attr('y', 30)
        .attr('text-anchor', 'end')
        .attr('font-family', 'serif')
        .attr('font-size', '14px')
        .text(state.formula);
    }
    
    // 渲染矩阵（仅当使用矩阵算法时）
    if (state.currentAlgorithm === 'matrix' && state.matrix.length > 0) {
      renderMatrix(svg, state.matrix);
    }
    
  }, [state.staircase, state.currentAlgorithm, state.formula, state.matrix, width, height]);
  
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
  const renderMatrix = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, matrix: number[][]) => {
    const matrixGroup = svg.append('g')
      .attr('class', 'matrix')
      .attr('transform', `translate(${width - 100}, 50)`);
    
    const cellSize = 30;
    
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
      width={width} 
      height={height}
      style={{ border: '1px solid #ccc', borderRadius: '4px' }}
    />
  );
};

export default CanvasComponent; 