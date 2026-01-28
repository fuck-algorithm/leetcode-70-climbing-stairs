// 路由配置常量

export interface NavItem {
  id: string;
  path: string;
  name: string;
  color: string;
}

// 导航项配置
export const NAV_ITEMS: NavItem[] = [
  { id: 'dp', path: '/dp', name: '动态规划', color: '#4CAF50' },
  { id: 'matrix', path: '/matrix', name: '矩阵快速幂', color: '#2196F3' },
  { id: 'formula', path: '/formula', name: '通项公式', color: '#FF9800' }
];

// 有效路径集合
export const VALID_PATHS = ['/dp', '/matrix', '/formula'];

// 默认路径
export const DEFAULT_PATH = '/dp';

// LeetCode题目链接
export const LEETCODE_URL = 'https://leetcode.cn/problems/climbing-stairs/';
