import React from 'react';
import styled from 'styled-components';

const BackLink = styled.a`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

export default function BackToHot100() {
  return (
    <BackLink 
      href="https://fuck-algorithm.github.io/leetcode-hot-100/"
      target="_blank"
      rel="noopener noreferrer"
    >
      ← 返回LeetCode Hot 100
    </BackLink>
  );
} 