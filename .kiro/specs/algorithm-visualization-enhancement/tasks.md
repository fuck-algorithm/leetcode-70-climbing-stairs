# Implementation Plan

- [x] 1. 项目基础设施配置
  - [x] 1.1 配置 Vite 使用随机大端口（30000-65535）
    - 修改 vite.config.ts，设置 server.port 为随机大端口
    - _Requirements: 15.1, 15.2_
  - [x] 1.2 配置 GitHub Actions 自动部署
    - 创建 .github/workflows/deploy.yml 文件
    - 配置构建和部署到 GitHub Pages
    - _Requirements: 14.1, 14.2, 14.3_
  - [x] 1.3 安装测试依赖
    - 安装 vitest 和 fast-check
    - 配置 vitest.config.ts
    - _Requirements: Testing Strategy_

- [x] 2. IndexedDB 服务层实现
  - [x] 2.1 创建统一的 IndexedDB 服务模块
    - 创建 src/services/indexedDBService.ts
    - 实现数据库初始化和版本管理
    - 实现语言偏好、播放速度、Star缓存的 CRUD 操作
    - _Requirements: 2.4, 5.6, 10.6_
  - [x] 2.2 编写 IndexedDB 服务属性测试
    - **Property 7: Language Preference Round-Trip**
    - **Property 11: Playback Speed Persistence Round-Trip**
    - **Validates: Requirements 5.6, 5.7, 10.6**
  - [x] 2.3 编写 GitHub Star 缓存属性测试
    - **Property 1: GitHub Star Cache Validity**
    - **Validates: Requirements 2.4**

- [x] 3. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. 数据输入组件增强
  - [x] 4.1 增强 DataInput 组件的输入验证
    - 添加更严格的输入验证逻辑
    - 实现错误消息显示
    - _Requirements: 3.7, 3.8_
  - [x] 4.2 编写输入验证属性测试
    - **Property 3: Input Validation Correctness**
    - **Validates: Requirements 3.7, 3.8**
  - [x] 4.3 实现随机数生成功能
    - 确保生成的随机数在 [1, 45] 范围内
    - _Requirements: 3.6_
  - [x] 4.4 编写随机数生成属性测试
    - **Property 2: Random Number Generation Range**
    - **Validates: Requirements 3.6**

- [x] 5. 代码面板增强
  - [x] 5.1 实现代码行高亮与步骤同步
    - 为每个算法的每种语言创建代码行映射
    - 实现根据当前步骤高亮对应代码行
    - _Requirements: 5.4_
  - [x] 5.2 编写代码行高亮属性测试
    - **Property 5: Code Line Highlighting Consistency**
    - **Validates: Requirements 5.4**
  - [x] 5.3 实现变量值显示功能
    - 在代码行旁边显示当前变量的内存值
    - _Requirements: 5.5_
  - [x] 5.4 编写变量显示属性测试
    - **Property 6: Variable Display State Consistency**
    - **Validates: Requirements 5.5**
  - [x] 5.5 集成 IndexedDB 语言偏好持久化
    - 切换语言时保存到 IndexedDB
    - 页面加载时恢复上次选择的语言
    - _Requirements: 5.6, 5.7_

- [x] 6. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. 控制面板增强
  - [x] 7.1 实现键盘快捷键绑定
    - 左方向键：上一步
    - 右方向键：下一步
    - 空格键：播放/暂停
    - R键：重置
    - 在按钮上显示快捷键提示
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [x] 7.2 实现可拖动进度条
    - 创建自定义进度条组件
    - 支持鼠标拖动跳转到任意步骤
    - 已播放部分显示绿色，未播放部分显示灰色
    - _Requirements: 10.7, 10.8, 10.9_
  - [x] 7.3 编写进度条映射属性测试
    - **Property 12: Progress Bar Step Mapping**
    - **Validates: Requirements 10.8**
  - [x] 7.4 实现播放速度调节器
    - 创建自定义速度选择器（非原生组件）
    - 集成 IndexedDB 持久化
    - _Requirements: 10.5, 10.6_

- [x] 8. 算法状态管理增强
  - [x] 8.1 实现算法切换时的状态重置
    - 切换算法时重置 currentStep 为 0
    - 重置 isPlaying 为 false
    - _Requirements: 4.3_
  - [x] 8.2 编写算法切换状态重置属性测试
    - **Property 4: Algorithm Switch State Reset**
    - **Validates: Requirements 4.3**

- [x] 9. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. DP 可视化增强
  - [x] 10.1 增强楼梯渲染
    - 确保渲染 n+1 个台阶（包括第0阶）
    - 每个台阶显示正确的 DP 值
    - _Requirements: 7.1_
  - [x] 10.2 编写 DP 楼梯渲染属性测试
    - **Property 8: DP Stair Rendering Correctness**
    - **Validates: Requirements 7.1**
  - [x] 10.3 增强 DP 计算过程显示
    - 显示 dp[i] = dp[i-1] + dp[i-2] 的计算公式
    - 使用箭头和文字说明数据流向
    - _Requirements: 7.3, 6.4_
  - [x] 10.4 编写 DP 计算显示属性测试
    - **Property 9: DP Calculation Display Correctness**
    - **Validates: Requirements 7.3**
  - [x] 10.5 实现状态颜色区分
    - 未计算：灰色
    - 计算中：黄色
    - 已计算：绿色
    - _Requirements: 7.4_

- [x] 11. 矩阵快速幂可视化增强
  - [x] 11.1 增强二进制分解显示
    - 正确显示 n 的二进制表示
    - 高亮当前处理的位
    - _Requirements: 8.3_
  - [x] 11.2 编写二进制分解属性测试
    - **Property 10: Binary Decomposition Correctness**
    - **Validates: Requirements 8.3**
  - [x] 11.3 增强矩阵乘法动画
    - 动画展示矩阵乘法计算过程
    - 显示中间结果
    - _Requirements: 8.2, 8.4_

- [x] 12. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. 算法思路弹窗实现
  - [x] 13.1 创建算法思路弹窗组件
    - 在 GitHub 徽标左侧添加「算法思路」按钮
    - 实现模态框显示解题思路
    - 根据当前算法显示对应内容
    - _Requirements: 11.1, 11.2, 11.3_
  - [x] 13.2 编写算法思路显示属性测试
    - **Property 13: Algorithm-Specific Thoughts Display**
    - **Validates: Requirements 11.3**

- [x] 14. 配色规范实施
  - [x] 14.1 审查并修复所有紫色使用
    - 检查所有组件的颜色定义
    - 将紫色替换为其他颜色
    - _Requirements: 13.2_
  - [x] 14.2 编写颜色属性测试
    - **Property 14: No Purple Color Usage**
    - **Validates: Requirements 13.2**
  - [x] 14.3 统一算法主题色
    - DP：绿色 (#4CAF50)
    - 矩阵：蓝色 (#2196F3)
    - 公式：橙色 (#FF9800)
    - _Requirements: 13.3_

- [x] 15. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. GitHub 徽标增强
  - [x] 16.1 增强 Star 数显示
    - 使用 IndexedDB 缓存 Star 数
    - 实现1小时缓存过期逻辑
    - API 失败时使用缓存值
    - _Requirements: 2.3, 2.4, 2.5, 2.6_
  - [x] 16.2 添加悬停提示
    - 鼠标悬停时显示「点击去 GitHub 仓库 Star 支持一下」
    - _Requirements: 2.7_

- [x] 17. 微信交流群悬浮球
  - [x] 17.1 增强悬浮球组件
    - 确保显示微信群图标和「交流群」字样
    - 悬停时显示二维码图片
    - 保持图片原始比例
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 18. 页面标题与导航
  - [x] 18.1 确保标题正确显示
    - 标题居中显示「70. 爬楼梯」
    - 点击跳转到 LeetCode 题目页面（新标签页）
    - _Requirements: 1.1, 1.2_
  - [x] 18.2 确保返回链接正确
    - 左上角显示「返回 LeetCode Hot 100」
    - 点击在新标签页打开指定 URL
    - _Requirements: 1.3, 1.4_

- [x] 19. Final Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.
