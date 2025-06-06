# 动态规划算法步骤动画 - 第二部分

## 步骤5：递推计算过程动画

### 第2阶计算详细动画（36-42秒）
- **聚焦转移动画**：
  - 镜头移动：平滑移动到第2阶位置
  - 时间：500ms，使用ease-in-out缓动
  - 视角调整：同时保证能看到第0阶、第1阶和第2阶
  - 聚焦效果：第2阶高亮，brightness值增加10%
  - 背景效果：其他区域亮度略微降低，增强对比

- **问题提出动画**：
  - 文本框：在第2阶上方出现问题气泡
  - 内容："要到达第2阶，有几种方法？"
  - 出现方式：气泡从小到大展开(scale: 0 → 1)，使用弹性缓动
  - 强调效果：问号闪烁或放大
  - 指示箭头：从气泡指向第2阶

- **依赖分析动画**：
  - 文本："我们可以从第0阶爬2阶或从第1阶爬1阶到达"
  - 显示方式：文本平滑淡入，使用打字机效果，每字符20ms
  - 依赖指示：在提到第0阶和第1阶时，对应阶梯短暂高亮
  - 小型图示：在文本旁显示简化的依赖关系图
  - 强调：关键词"第0阶"和"第1阶"使用不同颜色标识

- **箭头出现动画顺序**：
  1. **从第0阶到第2阶的橙色箭头**（爬2阶）：
     - 出现时间：依赖分析后立即开始
     - 绘制方式：从起点向终点"生长"，持续400ms
     - 路径形状：弯曲的贝塞尔曲线，控制点在两阶梯中间偏上
     - 标签："爬2阶"，位于箭头中间位置
     - 出现效果：标签在箭头完成后淡入显示
     - 高亮动画：箭头完成后短暂发光，然后恢复正常亮度
   
  2. **从第1阶到第2阶的蓝色箭头**（爬1阶）：
     - 出现时间：在第一条箭头完成后延迟200ms
     - 绘制方式：同样从起点向终点"生长"
     - 路径形状：较短的贝塞尔曲线
     - 标签："爬1阶"，位于箭头中间
     - 错开放置：确保两个箭头和标签不重叠
     - 高亮效果：同样短暂发光后恢复

- **贡献值标注动画**：
  - 第一个贡献标注：
    * 内容：在橙色箭头起点处标注"dp[0]=1"
    * 出现方式：标注淡入显示，同时有轻微放大效果
    * 连接线：从标注到第0阶方法数的虚线连接
    * 高亮联动：标注出现时，第0阶方法数短暂高亮
  
  - 第二个贡献标注：
    * 内容：在蓝色箭头起点处标注"dp[1]=1"
    * 出现时机：在第一个贡献标注完成后延迟300ms
    * 效果：与第一个贡献标注相同
    * 高亮联动：标注出现时，第1阶方法数短暂高亮

- **公式应用动画**：
  - 公式构建：
    * 阶段1：显示"dp[2] = ?"（300ms）
    * 阶段2：更新为"dp[2] = dp[1] + dp[0]"（400ms）
    * 阶段3：替换为"dp[2] = 1 + 1"（300ms）
    * 阶段4：最终显示"dp[2] = 2"（300ms）
  
  - 视觉效果：
    * 每次更新使用翻转或滑动转换动画
    * 过渡时长200ms，使用ease-in-out缓动
    * 最终结果短暂放大并高亮
    * 背景色从浅黄变为浅绿，表示计算完成
  
  - 位置：右侧公式面板或第2阶旁边
  - 关联效果：计算时依赖方法数分别高亮，计算完成后结果高亮

- **方法数计算动画**：
  - 初始状态：第2阶方法数显示器显示"?"，闪烁效果
  - 计算过程：
    * 显示器问号停止闪烁，准备更新
    * 数值从0快速递增到2，每步100ms
    * 数字颜色从灰色变为深色
    * 背景色从灰色过渡到绿色
  - 完成效果：
    * 最终数字短暂放大(scale: 1 → 1.2 → 1)
    * 短暂闪光效果
    * 显示器边缘发光，持续500ms然后淡出
  - 时长：更新动画总计约600ms

- **数据流动画**：
  - 从第0阶沿橙色箭头流向第2阶：
    * 5-8个小圆点，直径3px，橙色
    * 沿箭头路径均匀分布
    * 流动速度每秒100px
    * 到达终点时有小闪光效果
  
  - 从第1阶沿蓝色箭头流向第2阶：
    * 同样的动画效果，但使用蓝色圆点
    * 在第一组完成后启动
    * 流动完成后，第2阶方法数短暂高亮
  
  - 粒子效果：粒子在移动中有轻微的尾迹效果
  - 循环设置：流动动画可循环1-2次

- **阶梯状态更新动画**：
  - 第2阶状态：从未计算(灰色)变为已计算(绿色)
  - 颜色转换：平滑过渡，持续500ms
  - 透明度：从50%增加到100%
  - 光泽效果：添加轻微反光效果
  - 发光边缘：完成时短暂的绿色边缘发光

- **路径解释动画**：
  - 文本："有2种方法到达第2阶：直接从第0阶爬2阶，或者先到第1阶再爬1阶"
  - 位置：右侧说明面板或第2阶上方
  - 显示方式：平滑淡入，打字机效果
  - 路径示意：简化图示显示两条路径
  - 动画效果：提到每条路径时，对应箭头短暂高亮

- **视觉总结动画**：
  - 方法数强调：第2阶的计数器再次短暂放大
  - 结果框：在画面中添加"第2阶方法数：2"的结果卡片
  - 出现方式：卡片从右侧滑入，停留2秒，然后淡出
  - 小人动作：小人可选做出"2"的手势
  - 进度更新：底部进度条更新，标示当前计算进度

### 第3阶计算详细动画（42-48秒）
- **聚焦转移动画**：
  - 镜头移动：从第2阶平滑移动到第3阶
  - 时间：500ms，使用ease-in-out缓动
  - 视角调整：同时显示第1阶、第2阶和第3阶
  - 聚焦效果：第3阶变亮，其他阶梯稍微变暗
  - 指示标记：在第3阶添加"当前计算"标记

- **依赖高亮动画**：
  - 目标：第1阶和第2阶同时高亮
  - 效果：边缘发光，亮度增加
  - 标注：在两个阶梯上方添加"依赖项"标记
  - 连接线：从依赖阶梯到当前阶梯的虚线连接
  - 文本说明："第3阶依赖于第1阶和第2阶的结果"

- **箭头出现动画**：
  1. **从第1阶到第3阶的橙色箭头**（爬2阶）：
     - 绘制方式：同上，从起点向终点"生长"
     - 路径形状：较长的贝塞尔曲线，明确表示跨越了一级
     - 标签："爬2阶"，位于箭头中间
     - 出现时间：依赖高亮后立即开始
     - 特殊标识：可添加"跳过第2阶"的说明标签
  
  2. **从第2阶到第3阶的蓝色箭头**（爬1阶）：
     - 绘制方式：从起点向终点"生长"
     - 路径形状：较短的贝塞尔曲线
     - 标签："爬1阶"，位于箭头中间
     - 出现时间：在第一条箭头完成后延迟200ms
     - 布局考虑：确保两条箭头不相互覆盖

- **贡献值标注动画**：
  - 第一个贡献标注：
    * 内容："dp[1]=1"（从第1阶爬2阶）
    * 位置：橙色箭头起点附近
    * 出现方式：淡入显示(opacity: 0 → 1)，300ms
    * 高亮效果：出现时第1阶方法数短暂高亮
    * 连接：细虚线连接标注和第1阶方法数
  
  - 第二个贡献标注：
    * 内容："dp[2]=2"（从第2阶爬1阶）
    * 位置：蓝色箭头起点附近
    * 出现时机：在第一个标注完成后延迟300ms
    * 高亮效果：出现时第2阶方法数短暂高亮
    * 视觉强调：由于值较大，可稍微放大标注

- **公式应用动画**：
  - 公式构建过程：
    * 阶段1：显示"dp[3] = ?"
    * 阶段2：更新为"dp[3] = dp[2] + dp[1]"
    * 阶段3：替换为"dp[3] = 2 + 1"
    * 阶段4：最终显示"dp[3] = 3"
  - 每阶段过渡动画：300ms翻转或滑动效果
  - 强调：最终结果短暂放大并高亮
  - 位置：右侧公式面板或第3阶旁边
  - 动画节奏：每阶段之间有200ms的停顿，便于理解

- **计算过程动画**：
  - 数值更新：第3阶方法数从"?"变为"3"
  - 计数动画：数值从0逐步递增到3，每步100ms
  - 背景变化：显示器背景从灰色变为绿色
  - 强调效果：最终值"3"短暂放大并高亮
  - 完成动画：计算完成后显示器有短暂的轻微跳动

- **数据流动画**：
  - 第一组流动：从第1阶沿橙色箭头流向第3阶
    * 橙色粒子，直径3px，5-8个均匀分布
    * 速度每秒100px，流动平滑
    * 路径：沿箭头精确流动
    * 到达效果：到达终点时有小闪光
  
  - 第二组流动：从第2阶沿蓝色箭头流向第3阶
    * 蓝色粒子，其他参数相同
    * 时机：第一组完成后立即开始
    * 合并效果：两组数据流在终点合并
  
  - 数据量指示：第二组流动的粒子数量是第一组的两倍（表示2个方法）
  - 视觉反馈：流动结束时，计数器显示相应变化

- **阶梯状态更新动画**：
  - 状态变化：第3阶从未计算状态变为已计算状态
  - 颜色过渡：从灰色(#E0E0E0)变为绿色(#81C784)，持续500ms
  - 透明度：从50%变为100%
  - 发光效果：完成时短暂的边缘发光
  - 指示移除：移除"当前计算"标记

- **路径解释动画**：
  - 文本："有3种方法到达第3阶：从第1阶爬2阶(1种)或从第2阶爬1阶(2种)"
  - 补充说明："具体路径为：0→1→3、0→2→3、0→1→2→3"
  - 显示方式：主要说明使用正常大小字体，具体路径使用小号字体
  - 展示位置：文本面板或第3阶上方气泡
  - 路径可视化：可选创建小型图示显示三条具体路径

- **完成总结动画**：
  - 结果卡片：显示"第3阶方法数：3"的结果卡片
  - 出现方式：从右侧滑入，持续2秒，然后淡出
  - 方法数强调：最终结果"3"再次短暂放大
  - 阶段标记：在进度条上标记当前计算阶段
  - 过渡提示：短暂停顿后，显示即将进入下一阶计算的提示

### 第4-n阶计算过程动画（48-60秒）
- **通用计算流程模板**（适用于第4阶及后续）：
  1. **聚焦和依赖高亮**（~1秒）：
     - 镜头移动到当前阶梯
     - 高亮显示依赖阶梯（当前阶-1和当前阶-2）
     - 添加依赖标记或连接线
     - 缩放调整以适应当前视角

  2. **箭头生成和标注**（~1.5秒）：
     - 绘制两条箭头（爬1阶和爬2阶）
     - 添加对应标签
     - 标注依赖值（前两阶的方法数）
     - 确保视觉清晰和布局合理

  3. **公式计算过程**（~1.5秒）：
     - 显示公式：dp[i] = dp[i-1] + dp[i-2]
     - 代入具体值计算
     - 展示结果
     - 计算过程中相应高亮和动画

  4. **方法数更新**（~0.5秒）：
     - 当前阶方法数从"?"变为计算结果
     - 使用计数动画或直接更新
     - 结果高亮和强调
     - 状态更新为已计算

  5. **状态完成和简要说明**（~0.5秒）：
     - 当前阶变为已计算状态（绿色）
     - 简短文字总结当前阶结果
     - 方法数显示最终确认动画
     - 准备进入下一阶计算

- **速度和细节调整策略**（根据n值）：
  - **n值较小**（n≤8）情况：
    * 每阶使用完整动画，时长约5秒
    * 详细展示每一步计算过程
    * 包含完整的文字解释
    * 添加具体路径说明（适用于n≤5）
    * 设置舒适的节奏，动画间有明确停顿
  
  - **n值中等**（8<n≤15）情况：
    * 前5阶和最后2阶使用完整动画
    * 中间阶使用简化动画，每阶约3秒
    * 减少文字说明，只保留关键信息
    * 加快计算节奏，减少停顿时间
    * 关键阶（如斐波那契特征值8,13）略微减速并强调
  
  - **n值较大**（n>15）情况：
    * 详细展示前5阶和最后3阶
    * 中间阶进入"快速计算模式"，每阶约1-2秒
    * 可合并多个计算步骤为一组，使用加速动画
    * 关键节点处添加暂停点或减速
    * 提供"减速"和"跳过"控制选项

- **视觉指引和控制选项**：
  - 进度条：底部显示当前计算进度
  - 当前位置指示：在进度条上标记当前计算阶梯
  - 速度控制：添加"-"、"+"按钮调整动画速度
  - 暂停/播放：提供暂停和继续按钮
  - 跳转选项：允许跳至结果或下一关键点

- **第4阶计算重点**（48-54秒，n≥4时）：
  - 计算式：dp[4] = dp[3] + dp[2] = 3 + 2 = 5
  - 关键强调：结果"5"是第5个斐波那契数
  - 路径数量：强调5种不同路径到第4阶
  - 可选展示：简要列举5种具体路径（仅n较小时）
  - 模式确认：确认递推模式已经稳定建立

- **第5阶及后续计算**（54-60秒，根据n值调整）：
  - 继续使用上述模板和策略
  - 随着阶数增加，可通过视觉设计展示数值增长趋势
  - 对于关键斐波那契数值（如8,13,21等），可添加特殊标记
  - 大n值时，确保界面不会因结果数字过大而变形
  - 保持愉悦的视觉节奏和清晰的计算过程

## 步骤6：模式识别动画

### 斐波那契关系发现动画（计算完成后4秒）
- **序列显示动画**：
  - 位置：画布底部或右侧专门区域
  - 内容：显示已计算的所有方法数：1,1,2,3,5,8...
  - 出现方式：依次从左到右淡入，每个数字间隔100ms
  - 布局：数字间使用逗号分隔，使用等宽字体对齐
  - 标题："计算结果序列"，位于序列上方

- **数字闪烁动画**：
  - 效果：序列中的数字依次闪烁高亮
  - 顺序：从1开始到最后一个计算结果
  - 时长：每个数字高亮300ms，间隔200ms
  - 高亮样式：数字放大20%，背景变为亮黄色
  - 阶梯联动：数字高亮时，对应阶梯也短暂高亮

- **发现文本动画**：
  - 内容："你注意到了吗？计算结果形成了斐波那契数列: 1,1,2,3,5,8,13..."
  - 位置：序列上方或右侧面板
  - 出现方式：平滑淡入，使用打字机效果
  - 强调：关键词"斐波那契数列"使用特殊色彩和字体粗细
  - 图标：可选添加灯泡或发现图标，增强"发现"的感觉

- **斐波那契标识添加**：
  - 效果：在序列和阶梯上添加斐波那契标记
  - 标记内容：F₁, F₂, F₃...或F(1), F(2), F(3)...
  - 出现方式：标记从上方滑入到对应数字上方
  - 间隔时间：每个标记间隔100ms依次出现
  - 视觉效果：轻微的弹跳效果(cubic-bezier)

- **对比展示动画**：
  - 内容：楼梯方法数和斐波那契数列并排显示
  - 布局：两行对齐的数字序列
  - 连接线：垂直虚线连接对应的数字
  - 标注："楼梯方法数"和"斐波那契数列"标签
  - 强调：完全匹配的视觉强调（如绿色对勾标记）

- **通项公式展示**：
  - 内容：显示斐波那契数列通项公式F(n) = F(n-1) + F(n-2)
  - 位置：序列下方或右侧面板
  - 出现方式：渐变显示，使用LaTeX或数学公式格式
  - 对比：在旁边显示我们的递推公式dp[i] = dp[i-1] + dp[i-2]
  - 关联：使用连接线或相同颜色强调两个公式的一致性

### 规律总结动画（4秒）
- **文字说明动画**：
  - 内容："爬楼梯问题的解实际上是斐波那契数列的第(n+1)项"
  - 位置：画布上方或右侧面板
  - 出现方式：平滑淡入，使用打字机效果
  - 强调：关键信息使用加粗和颜色突出
  - 字体：主文本Roboto 16px，关键词18px加粗

- **数学公式动画**：
  - 内容：根据斐波那契序列起始定义不同，显示：
    * "dp[n] = Fib(n+1)"（斐波那契从F₀=0, F₁=1开始计算时）
    * 或"dp[n] = Fib(n+2)"（斐波那契从F₁=1, F₂=1开始计算时）
  - 出现方式：公式构建动画，分步显示等号两边
  - 位置：文字说明下方
  - 样式：使用LaTeX或数学公式格式，字体大小20px
  - 视觉效果：完成后短暂放大并高亮

- **视觉映射动画**：
  - 效果：使用动画线条连接楼梯问题和斐波那契数列
  - 形式：从各阶梯方法数到对应斐波那契数值的弧形连线
  - 生成方式：线条从左侧向右侧"生长"，持续300ms
  - 颜色：渐变色线条，增强视觉吸引力
  - 标注：连线上添加简短说明"对应关系"

- **公式生成规律**：
  - 文本框：显示"每增加一阶，方法数等于前两阶方法数之和"
  - 公式展示："F(n) = F(n-1) + F(n-2)，初始条件F(0)=F(1)=1"
  - 递归特性：强调斐波那契数列的递归定义
  - 视觉演示：使用小型动画展示计算F(5)的过程
  - 树形图：可选展示斐波那契计算的递归树

- **自然界例子提示**：
  - 内容：简短提示"斐波那契数列在自然界中广泛存在"
  - 图标：添加几个自然界斐波那契现象的小图标（如贝壳、向日葵）
  - 位置：画面右下角或信息栏
  - 显示方式：淡入显示，持续到下一步骤
  - 交互提示：可选添加"了解更多"按钮，链接到详细解释

## 步骤7：结果展示动画

### 最终结果强调动画（4秒）
- **视觉聚焦动画**：
  - 镜头移动：平滑移动到第n阶
  - 时间：800ms，使用ease-in-out缓动
  - 缩放效果：轻微放大第n阶(scale: 1 → 1.15)
  - 失焦效果：其他阶梯变得模糊和暗淡
  - 光线效果：添加聚光灯效果，突出第n阶

- **结果框动画**：
  - 样式：大型圆角矩形框，浅绿色背景(#E8F5E9)，细边框(#81C784)
  - 位置：画布中央或第n阶上方
  - 出现方式：从中心向外扩展(scale: 0 → 1)，使用弹性缓动
  - 内容："到达第n阶的方法数: X"（将n和X替换为实际值）
  - 字体：标题22px加粗，结果值36px加粗，颜色#2E7D32

- **文字总结动画**：
  - 内容："总共有X种不同的方法爬到第n阶"
  - 位置：结果框下方
  - 出现方式：在结果框显示后平滑淡入
  - 字体：Roboto 18px，颜色#424242
  - 强调：数值X使用与主题相同的颜色，并略微放大

- **成功特效动画**：
  - 星星闪烁：目标阶上的星星图标放大并闪烁
  - 发光强度：星星发光效果增强(box-shadow扩大)
  - 粒子效果：从底部向上喷发的彩色粒子
    * 形状：小圆点或星形，大小2-5px
    * 数量：30-50个粒子
    * 运动路径：从底部沿抛物线向上，然后落下
    * 消失方式：粒子逐渐变小并淡出
  - 闪光效果：第n阶周围出现短暂的闪光环
  - 音效提示：可选的成功音效（如果启用音频）

- **小人动画**：
  - 移动：小人平滑移动到顶部（第n阶）
  - 路径：遵循楼梯路径，每阶停留很短时间
  - 速度：较快但可见的移动速度（约200ms每阶）
  - 到达动作：到达顶部后做庆祝动作
    * 跳跃：向上跳跃，手臂上举
    * 旋转：360度旋转
    * 表情：显示笑脸或胜利表情
  - 持续时间：庆祝动作持续1-2秒

- **颜色变化**：
  - 效果：所有已计算阶梯颜色变深，表示完成
  - 过渡：颜色从#81C784变为#4CAF50，持续500ms
  - 波动效果：变化从底部向顶部依次进行，每阶延迟50ms
  - 最终强调：第n阶颜色最深，并有持续的轻微光晕效果
  - 星星变化：目标星星变为金色，并持续发光

### 路径示例展示动画（6秒，可选）
- **路径列表展示**（仅n≤5时详细显示）：
  - 位置：右侧专门区域或模态窗口
  - 标题："所有可能的路径"
  - 出现方式：列表从上到下依次淡入
  - 内容：列出所有可能路径，例如：
    * 路径1：0→1→2→...→n（全部爬1阶）
    * 路径2：0→2→...→n（先爬2阶，然后...）
    * ...
  - 格式：路径使用箭头连接，每个节点使用圆圈表示
  - 高亮：当前查看的路径高亮显示

- **路径可视化**（n较小时）：
  - 类型：简化的楼梯微型图，显示几条典型路径
  - 大小：每个微型图宽度100px，高度根据n值调整
  - 路径颜色：不同路径使用不同颜色线条
  - 动画效果：路径从起点向终点"生长"
  - 排列：并排或网格排列多个路径图

- **路径动画演示**（n≤5时）：
  - 内容：动画展示几个代表性路径的爬法
  - 效果：小型小人沿不同路径爬行
  - 速度：快速演示，每条路径约1-2秒
  - 标注：每条路径旁标明"路径X"
  - 对比：不同路径使用不同颜色和动画效果

- **n值较大时的简化处理**：
  - 展示方式：只显示几条典型路径（如最短路径、最多1阶路径等）
  - 摘要说明："共X种路径，包括Y次爬1阶和Z次爬2阶的组合"
  - 分类统计：按1阶和2阶的使用次数分类汇总
  - 示例说明："例如：全部爬1阶(1种)、使用一次爬2阶(n-1种)..."
  - 数学解释：提供简单的组合数学解释

- **路径统计视图**：
  - 图表类型：条形图或饼图
  - 数据：显示不同爬法组合的分布
  - 标签："爬1阶和爬2阶的使用统计"
  - 颜色：使用与箭头一致的颜色编码（蓝色和橙色）
  - 动画：图表从零开始"增长"到最终值

- **后续引导**：
  - 提示文本："这些路径形成了斐波那契组合模式"
  - 转场提示：指示即将进入算法优化阶段
  - 按钮：提供"继续"按钮，进入下一步骤
  - 交互选项：允许用户探索不同路径（如果实现交互功能）
  - 知识链接：提供关于路径组合的延伸阅读链接 