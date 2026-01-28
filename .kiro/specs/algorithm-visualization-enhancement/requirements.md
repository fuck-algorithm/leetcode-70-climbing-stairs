# Requirements Document

## Introduction

本功能旨在完善和增强 LeetCode 第70题「爬楼梯」的算法可视化演示系统。系统需要支持三种解法（动态规划、矩阵快速幂、通项公式）的分步动画演示，提供教学目的的算法可视化体验。系统是一个单屏幕应用，包含数据输入、算法选择、代码展示（支持多语言语法高亮和调试效果）、画布可视化、播放控制等核心功能。

## Glossary

- **Algorithm Visualizer（算法可视化器）**: 用于以动画形式展示算法执行过程的系统
- **Timeline（时间线）**: 算法执行过程中生成的步骤序列，每个步骤包含描述、代码行号、可视化状态等信息
- **Current Step（当前步骤）**: 动画时间线中的当前步骤索引
- **Playback Speed（播放速度）**: 动画播放的速率倍数
- **Code Highlighting（代码高亮）**: 在代码面板中高亮显示当前执行的代码行
- **Variable Watch（变量监视）**: 在代码行旁边显示变量的当前内存值
- **Canvas（画布）**: 用于绘制算法可视化动画的区域，支持拖动和缩放
- **DP Array（动态规划数组）**: 动态规划解法中用于存储中间结果的数组
- **Matrix（矩阵）**: 矩阵快速幂解法中使用的2x2矩阵
- **IndexedDB**: 浏览器本地数据库，用于缓存用户偏好设置
- **GitHub API**: 用于获取仓库 Star 数的接口

## Requirements

### Requirement 1: 页面标题与导航

**User Story:** 作为用户，我希望页面标题与 LeetCode 题目保持一致，并能快速跳转到相关页面，以便我能方便地在可视化演示和原题之间切换。

#### Acceptance Criteria

1. THE System SHALL 在页面顶部居中显示标题「70. 爬楼梯」
2. WHEN 用户单击标题 THEN THE System SHALL 在新标签页打开 LeetCode 题目页面 https://leetcode.cn/problems/climbing-stairs/
3. THE System SHALL 在页面左上角显示「返回 LeetCode Hot 100」链接
4. WHEN 用户单击「返回 LeetCode Hot 100」链接 THEN THE System SHALL 在新标签页打开 https://fuck-algorithm.github.io/leetcode-hot-100/

### Requirement 2: GitHub 徽标与 Star 数

**User Story:** 作为用户，我希望能看到项目的 GitHub 仓库信息并方便地给项目 Star，以便我能支持这个开源项目。

#### Acceptance Criteria

1. THE System SHALL 在页面右上角显示 GitHub 徽标
2. WHEN 用户单击 GitHub 徽标 THEN THE System SHALL 在新标签页打开项目的 GitHub 仓库 URL
3. THE System SHALL 在 GitHub 徽标旁边显示仓库的 Star 数
4. THE System SHALL 使用 GitHub API 获取 Star 数，并使用 IndexedDB 缓存结果，缓存有效期为1小时
5. IF GitHub API 请求失败 THEN THE System SHALL 显示 IndexedDB 中缓存的上次 Star 数
6. IF IndexedDB 中无缓存数据 THEN THE System SHALL 显示默认值 0
7. WHEN 用户将鼠标悬停在 GitHub 徽标上 THEN THE System SHALL 显示提示「点击去 GitHub 仓库 Star 支持一下」

### Requirement 3: 数据输入

**User Story:** 作为用户，我希望能输入自定义的楼梯阶数或选择预设样例，以便我能观察不同输入下的算法执行过程。

#### Acceptance Criteria

1. THE System SHALL 在标题下方显示数据输入区域
2. THE System SHALL 提供输入框让用户输入自定义楼梯阶数 n
3. THE System SHALL 内置至少3个数据样例（如 n=3, n=5, n=10），以平铺按钮形式展示
4. WHEN 用户单击样例按钮 THEN THE System SHALL 将对应的值填入输入框并触发算法重新计算
5. THE System SHALL 提供「随机生成」按钮
6. WHEN 用户单击「随机生成」按钮 THEN THE System SHALL 生成1到45之间的随机整数作为输入
7. WHEN 用户输入数据 THEN THE System SHALL 验证输入值在1到45的范围内
8. IF 用户输入的数据不合法 THEN THE System SHALL 显示错误提示并阻止算法执行

### Requirement 4: 算法选择与切换

**User Story:** 作为用户，我希望能在多种解法之间切换，以便我能比较不同算法的执行过程和效率。

#### Acceptance Criteria

1. THE System SHALL 提供算法选择器，包含「动态规划」「矩阵快速幂」「通项公式」三个选项
2. WHEN 用户选择不同算法 THEN THE System SHALL 切换到对应算法的可视化页面
3. WHEN 用户切换算法 THEN THE System SHALL 重置动画状态到初始步骤
4. THE System SHALL 为每种算法提供独立的画布、代码面板、控制面板和步骤说明

### Requirement 5: 代码面板

**User Story:** 作为用户，我希望能查看算法代码并看到当前执行到哪一行，以便我能理解算法的具体实现。

#### Acceptance Criteria

1. THE System SHALL 显示当前算法的代码，支持 Java、Python、Golang、JavaScript 四种语言
2. THE System SHALL 为代码提供语法高亮
3. THE System SHALL 为代码显示行号
4. WHEN 动画播放到某一步骤 THEN THE System SHALL 高亮显示该步骤对应的代码行
5. THE System SHALL 在代码行旁边显示当前变量的内存值
6. WHEN 用户切换编程语言 THEN THE System SHALL 使用 IndexedDB 保存用户的语言选择
7. WHEN 用户下次访问页面 THEN THE System SHALL 自动恢复用户上次选择的编程语言
8. THE System SHALL 确保代码框的宽度和高度适中，避免出现水平或垂直滚动条

### Requirement 6: 画布可视化

**User Story:** 作为用户，我希望通过动画直观地看到算法的执行过程，以便我能更好地理解算法原理。

#### Acceptance Criteria

1. THE System SHALL 将页面的主要空间分配给画布区域
2. THE System SHALL 支持画布的拖动和缩放操作
3. THE System SHALL 将画布内容居中显示
4. WHEN 算法状态发生变化 THEN THE System SHALL 在画布上使用箭头和文字说明展示数据流向
5. THE System SHALL 使用颜色和动画高亮显示当前操作的元素
6. THE System SHALL 在节点或元素上方显示状态变更和数值变更的标签文本
7. IF 算法使用数据结构（如数组、矩阵）THEN THE System SHALL 在画布上清晰绘制该数据结构及其变化过程

### Requirement 7: 动态规划可视化

**User Story:** 作为用户，我希望看到动态规划解法的详细执行过程，包括 DP 数组的填充和小人爬楼梯的动画。

#### Acceptance Criteria

1. THE System SHALL 绘制楼梯图形，每个台阶显示对应的 DP 值
2. THE System SHALL 绘制小人角色，随算法步骤在楼梯上移动
3. WHEN 算法计算 dp[i] 时 THEN THE System SHALL 显示 dp[i-1] + dp[i-2] 的计算过程
4. THE System SHALL 使用不同颜色区分「未计算」「计算中」「已计算」三种状态
5. WHEN 小人移动到新位置 THEN THE System SHALL 播放平滑的过渡动画

### Requirement 8: 矩阵快速幂可视化

**User Story:** 作为用户，我希望看到矩阵快速幂解法的详细执行过程，包括矩阵乘法和幂运算。

#### Acceptance Criteria

1. THE System SHALL 绘制2x2矩阵，清晰显示矩阵元素
2. WHEN 执行矩阵乘法 THEN THE System SHALL 动画展示乘法计算过程
3. THE System SHALL 显示当前的幂次数和二进制分解过程
4. WHEN 矩阵元素更新 THEN THE System SHALL 使用动画展示数值变化

### Requirement 9: 通项公式可视化

**User Story:** 作为用户，我希望看到通项公式解法的计算过程，包括公式的各个部分。

#### Acceptance Criteria

1. THE System SHALL 显示斐波那契数列的通项公式（比内公式）
2. THE System SHALL 分步展示公式中各部分的计算过程
3. WHEN 计算 φ^n 和 ψ^n 时 THEN THE System SHALL 动画展示幂运算过程
4. THE System SHALL 显示最终结果的取整过程

### Requirement 10: 播放控制面板

**User Story:** 作为用户，我希望能控制动画的播放，包括播放、暂停、单步执行和进度调整。

#### Acceptance Criteria

1. THE System SHALL 提供「上一步」按钮，绑定键盘左方向键，按钮上显示「←」
2. THE System SHALL 提供「下一步」按钮，绑定键盘右方向键，按钮上显示「→」
3. THE System SHALL 提供「播放/暂停」按钮，绑定键盘空格键，按钮上显示「Space」
4. THE System SHALL 提供「重置」按钮，绑定键盘 R 键，按钮上显示「R」
5. THE System SHALL 提供播放速度调节器，默认速度为 1x
6. THE System SHALL 使用 IndexedDB 保存用户选择的播放速度，下次访问时自动恢复
7. THE System SHALL 在控制面板底部显示进度条，占用100%宽度
8. THE System SHALL 支持用户拖动进度条跳转到任意步骤
9. THE System SHALL 将已播放部分显示为绿色，未播放部分显示为灰色

### Requirement 11: 算法思路弹窗

**User Story:** 作为用户，我希望能查看当前算法的解题思路，以便我能理解算法的核心原理。

#### Acceptance Criteria

1. THE System SHALL 在 GitHub 徽标左侧显示「算法思路」按钮
2. WHEN 用户单击「算法思路」按钮 THEN THE System SHALL 弹出模态框显示当前算法的解题思路
3. THE System SHALL 根据当前选择的算法显示对应的思路说明

### Requirement 12: 微信交流群

**User Story:** 作为用户，我希望能加入算法交流群与其他学习者交流。

#### Acceptance Criteria

1. THE System SHALL 在页面右下角显示「加入算法交流群」悬浮球
2. THE System SHALL 在悬浮球上显示微信群图标和「交流群」字样
3. WHEN 用户将鼠标悬停在悬浮球上 THEN THE System SHALL 显示微信群二维码图片
4. THE System SHALL 提示用户「使用微信扫码发送 leetcode 加入算法交流群」
5. THE System SHALL 保持二维码图片的原始比例，避免变形

### Requirement 13: 配色与样式

**User Story:** 作为用户，我希望页面配色协调美观，以便获得良好的视觉体验。

#### Acceptance Criteria

1. THE System SHALL 使用协调的配色方案
2. THE System SHALL 严禁在任何元素中使用紫色
3. THE System SHALL 为不同算法使用不同的主题色进行区分

### Requirement 14: 部署与构建

**User Story:** 作为开发者，我希望项目能自动部署到 GitHub Pages，以便用户能访问在线演示。

#### Acceptance Criteria

1. THE System SHALL 提供 GitHub Action 配置文件，在代码提交时自动部署到 GitHub Pages
2. THE System SHALL 使用 GitHub Action 部署方式而非分支部署
3. THE System SHALL 在部署前确保无编译错误和 linter 错误

### Requirement 15: 服务端口配置

**User Story:** 作为开发者，我希望开发服务器使用非默认端口，以避免与其他服务冲突。

#### Acceptance Criteria

1. THE System SHALL 使用30000到65535之间的随机端口作为开发服务器端口
2. THE System SHALL 避免使用3000、5173等默认端口
