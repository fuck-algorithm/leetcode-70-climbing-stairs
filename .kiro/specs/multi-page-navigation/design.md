# Design Document: Multi-Page Navigation

## Overview

本设计将爬楼梯问题的三种算法解法从单页面切换模式重构为多页面独立展示模式。使用 React Router 实现客户端路由，每种解法拥有独立的 URL 路径，用户通过导航栏菜单在不同页面之间切换。

## Architecture

### 路由架构

```
/                    → 重定向到 /dp
/dp                  → 动态规划页面
/matrix              → 矩阵快速幂页面
/formula             → 通项公式页面
/*                   → 重定向到 /dp (404 处理)
```

### 组件层次结构

```
BrowserRouter
└── Routes
    └── Route path="/" element={<Layout />}
        ├── Route index → Navigate to /dp
        ├── Route path="dp" element={<DPPage />}
        ├── Route path="matrix" element={<MatrixPage />}
        ├── Route path="formula" element={<FormulaPage />}
        └── Route path="*" → Navigate to /dp
```

## Components and Interfaces

### 新增组件

#### 1. Layout 组件
共享布局组件，包含导航栏和公共元素。

```typescript
interface LayoutProps {
  // 无需 props，使用 Outlet 渲染子路由
}
```

#### 2. NavigationBar 组件
导航栏组件，使用 NavLink 实现路由切换和活动状态。

```typescript
interface NavItem {
  id: string;
  path: string;
  name: string;
  color: string;
}

interface NavigationBarProps {
  items: NavItem[];
}
```

#### 3. 算法页面组件
每个算法解法的独立页面组件。

```typescript
// DPPage - 动态规划页面
// MatrixPage - 矩阵快速幂页面  
// FormulaPage - 通项公式页面

interface AlgorithmPageProps {
  // 页面内部管理状态，无需外部 props
}
```

### 路由配置

```typescript
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dp" replace /> },
      { path: 'dp', element: <DPPage /> },
      { path: 'matrix', element: <MatrixPage /> },
      { path: 'formula', element: <FormulaPage /> },
      { path: '*', element: <Navigate to="/dp" replace /> }
    ]
  }
];
```

## Data Models

### 导航项配置

```typescript
const NAV_ITEMS: NavItem[] = [
  { id: 'dp', path: '/dp', name: '动态规划', color: '#4CAF50' },
  { id: 'matrix', path: '/matrix', name: '矩阵快速幂', color: '#2196F3' },
  { id: 'formula', path: '/formula', name: '通项公式', color: '#FF9800' }
];
```

### 有效路径集合

```typescript
const VALID_PATHS = ['/dp', '/matrix', '/formula'];
const DEFAULT_PATH = '/dp';
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Route-URL Synchronization
*For any* navigation action to a valid algorithm path, the browser URL SHALL update to match the target path exactly.

**Validates: Requirements 1.2, 3.1**

### Property 2: Active State Synchronization
*For any* valid algorithm URL path, the navigation bar SHALL mark exactly one menu item as active, and that item SHALL correspond to the current URL path.

**Validates: Requirements 1.3**

### Property 3: Direct URL Access
*For any* valid algorithm URL path accessed directly, the system SHALL render the corresponding algorithm page component.

**Validates: Requirements 3.2**

### Property 4: Invalid URL Redirect
*For any* URL path that is not in the set of valid paths, the system SHALL redirect to the default path (/dp).

**Validates: Requirements 3.3**

## Error Handling

### 无效路由处理
- 使用 catch-all 路由 (`path="*"`) 捕获所有未匹配的路径
- 自动重定向到默认页面 `/dp`
- 使用 `replace` 属性避免在浏览器历史中留下无效记录

### 组件加载错误
- 各页面组件独立管理自身状态和错误
- 保持现有的错误处理逻辑不变

## Testing Strategy

### 单元测试
使用 Vitest 和 React Testing Library 进行组件测试：

1. **NavigationBar 组件测试**
   - 验证所有导航项正确渲染
   - 验证颜色样式正确应用

2. **路由配置测试**
   - 验证各路径渲染正确组件
   - 验证根路径重定向
   - 验证无效路径重定向

### 属性测试
使用 fast-check 进行属性测试：

1. **Route-URL Synchronization Property Test**
   - 生成随机有效路径，验证导航后 URL 正确更新

2. **Active State Synchronization Property Test**
   - 生成随机有效路径，验证活动状态与 URL 匹配

3. **Invalid URL Redirect Property Test**
   - 生成随机无效路径字符串，验证重定向到默认路径

### 测试框架配置
- 测试框架: Vitest (已配置)
- 属性测试库: fast-check (已安装)
- DOM 测试: @testing-library/react (已安装)
- 路由测试: 使用 MemoryRouter 进行隔离测试
