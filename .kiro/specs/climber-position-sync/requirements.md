# Requirements Document

## Introduction

本功能旨在修复爬楼梯动画中小人位置与算法步骤不同步的问题。当前小人始终停留在第一阶，而不是随着动态规划算法的推进而移动到相应的楼梯位置。正确的行为应该是：小人的位置应该反映当前算法步骤中"已经到达"的最高阶梯，而不是"正在计算"的阶梯。

## Glossary

- **Climber（小人）**: 动画中的角色，用于可视化爬楼梯的过程
- **Stair Index（阶梯索引）**: 楼梯的编号，从0开始，0表示起点，n表示终点
- **Current Step（当前步骤）**: 动画时间线中的当前步骤索引
- **Timeline（时间线）**: 算法执行过程中生成的步骤序列，每个步骤包含描述、可视化变化等信息
- **Node Status（节点状态）**: 阶梯的计算状态，包括 'uncalculated'（未计算）、'calculating'（计算中）、'calculated'（已计算）
- **Animation Progress（动画进度）**: 用户通过进度条或播放按钮控制的当前动画位置

## Requirements

### Requirement 1

**User Story:** 作为用户，我希望小人的位置能够反映当前算法已经计算到的阶梯，以便我能直观地理解动态规划的推进过程。

#### Acceptance Criteria

1. WHEN 算法步骤显示"初始化"阶段（设置 dp[0]=1, dp[1]=1）THEN 系统 SHALL 将小人放置在第0阶（起点）位置
2. WHEN 算法步骤显示"准备计算第i阶"THEN 系统 SHALL 将小人放置在第(i-1)阶位置，表示小人准备从该位置向上爬
3. WHEN 算法步骤显示"计算完成第i阶"THEN 系统 SHALL 将小人放置在第i阶位置，表示小人已经到达该阶梯
4. WHEN 用户拖动进度条到任意步骤 THEN 系统 SHALL 立即更新小人位置到该步骤对应的阶梯位置

### Requirement 2

**User Story:** 作为用户，我希望小人在移动到新位置时有平滑的过渡动画，以便动画看起来更加自然流畅。

#### Acceptance Criteria

1. WHEN 小人从一个阶梯移动到相邻阶梯 THEN 系统 SHALL 播放爬楼梯动画，持续时间在0.5秒到1.5秒之间
2. WHEN 用户快速拖动进度条跳过多个步骤 THEN 系统 SHALL 直接将小人放置到目标位置，不播放中间动画
3. WHEN 动画正在播放时用户改变步骤 THEN 系统 SHALL 立即停止当前动画并将小人移动到新位置

### Requirement 3

**User Story:** 作为用户，我希望小人的状态（表情、姿势）能够反映当前的算法状态，以便我能更好地理解算法的执行过程。

#### Acceptance Criteria

1. WHEN 算法处于"准备计算"状态 THEN 系统 SHALL 将小人设置为"思考"状态，显示思考表情
2. WHEN 算法处于"计算完成"状态 THEN 系统 SHALL 将小人设置为"站立"状态，显示平静表情
3. WHEN 算法到达最终结果步骤 THEN 系统 SHALL 将小人设置为"庆祝"状态，显示开心表情
4. WHEN 小人处于思考状态 THEN 系统 SHALL 显示包含当前计算信息的对话气泡
