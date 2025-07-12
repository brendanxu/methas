# 🚀 South Pole Official Website - 开发计划

> **编码前必读**：本文档包含完整的开发指令集和技术规范，确保项目按照统一标准实施。

---

## 📋 项目概览

**项目名称**：southpole-official  
**技术栈**：Next.js 15 + TypeScript + Tailwind CSS + Ant Design  
**目标**：创建专业的气候解决方案企业官网  

---

## 🎯 开发阶段总览

| 阶段 | 任务 | 状态 | 预估时间 |
|------|------|------|----------|
| 阶段0 | 项目初始化 | ✅ 已完成 | 1天 |
| 阶段1 | 核心组件开发 | ✅ 已完成 | 3天 |
| 阶段2 | 首页开发 | 🔄 进行中 | 2天 |
| 阶段3 | 内页开发 | ⏳ 待开始 | 4天 |
| 阶段4 | 高级功能 | ⏳ 待开始 | 3天 |
| 阶段5 | 性能优化 | ⏳ 待开始 | 2天 |

---

## 🏗️ 阶段0：项目初始化指令 ✅

### 指令1：创建项目基础结构
```markdown
创建一个 Next.js 15 项目，使用 App Router，集成 Tailwind CSS 和 Ant Design。

要求：
1. 项目名称：southpole-official
2. 使用 TypeScript
3. 配置 pnpm 作为包管理器
4. 创建以下目录结构：
   - src/components/ui (Tailwind组件)
   - src/components/ant (Ant Design包装组件)
   - src/components/sections (页面区块)
   - src/components/layouts (布局组件)
   - src/lib (工具函数)
   - src/hooks (自定义Hook)
   - src/types (TypeScript类型)
   - src/styles (样式文件)

5. 安装以下依赖：
   - antd @ant-design/icons
   - framer-motion
   - clsx tailwind-merge
   - @types/node
   - react-intersection-observer

6. 创建基础配置文件：
   - tsconfig.json (配置路径别名 @/*)
   - .prettierrc
   - .eslintrc.json
   - .gitignore
```

### 指令2：配置 Tailwind + Ant Design 主题
```markdown
配置 Tailwind CSS 和 Ant Design 的主题系统，确保两者样式和谐统一。

要求：
1. 在 tailwind.config.ts 中扩展配置：
   - 添加 South Pole 品牌色：
     - primary: #002145 (深蓝)
     - secondary: #00875A (环保绿)
     - warning: #FF8B00 (橙色)
   - 配置字体：-apple-system, BlinkMacSystemFont, 'Segoe UI'
   - 添加自定义动画

2. 创建 src/styles/ant-theme.ts：
   - 配置 Ant Design ConfigProvider 主题
   - 确保颜色与 Tailwind 一致
   - 设置圆角、字体等

3. 创建 src/lib/utils.ts：
   - 实现 cn() 函数用于合并类名
   - 添加其他工具函数

4. 创建 src/app/providers.tsx：
   - 包装 Ant Design ConfigProvider
   - 设置全局样式提供者

5. 更新 src/app/layout.tsx：
   - 应用 providers
   - 设置基础元数据
```

### 指令3：创建基础布局组件
```markdown
基于 Tailwind UI Salient 模板，创建 Header 和 Footer 组件。

Header 组件要求 (src/components/layouts/Header.tsx)：
1. 响应式设计：
   - 桌面端：Logo左侧 + 导航菜单中间 + CTA按钮右侧
   - 移动端：Logo + 汉堡菜单

2. 导航功能：
   - 实现 Mega Menu (What we do, Our work & impact)
   - 普通链接 (About us, News, Resources)
   - 语言切换器（EN/中文）
   - "Book a meeting" CTA按钮

3. 交互效果：
   - 滚动时背景变化（透明变白色）
   - 菜单项 hover 效果
   - 移动端滑出式菜单

4. 使用 Framer Motion 添加动画

Footer 组件要求 (src/components/layouts/Footer.tsx)：
1. 四列布局：
   - Company (About, Careers, Contact)
   - Solutions (列出主要服务)
   - Resources (Reports, News, Blog)
   - Connect (社交媒体图标)

2. 底部信息栏：
   - 版权信息
   - 隐私政策/使用条款链接
   - Newsletter 订阅表单（使用 Ant Design Form）

3. 响应式设计，移动端改为单列
```

---

## 🧩 阶段1：核心组件开发指令 ✅

### 指令4：创建 Button 组件系列
```markdown
创建一个统一的 Button 组件，结合 Tailwind 样式和 Ant Design 功能。

文件：src/components/ui/Button.tsx

要求：
1. 支持多种变体：
   - primary: 蓝色背景白字
   - secondary: 白色背景蓝色边框
   - ghost: 透明背景
   - success: 绿色主题

2. 支持尺寸：
   - small: 高度32px
   - medium: 高度40px (默认)
   - large: 高度48px

3. 功能特性：
   - loading 状态（使用 Ant Spin）
   - disabled 状态
   - icon 支持（左右位置）
   - fullWidth 选项

4. 添加 hover/active 动画效果
5. TypeScript 类型定义完整
```

### 指令5：创建 Card 组件系列
```markdown
创建多种类型的 Card 组件用于不同场景。

需要创建以下组件：

1. BaseCard (src/components/ui/BaseCard.tsx)：
   - 基础卡片容器
   - 支持 hover 效果（上移+阴影）
   - 可配置 padding、圆角

2. ServiceCard (src/components/ui/ServiceCard.tsx)：
   - 图标 + 标题 + 描述
   - hover 时图标动画
   - 底部"Learn more"链接

3. CaseCard (src/components/ui/CaseCard.tsx)：
   - 顶部图片（16:9 比例）
   - 客户 Logo
   - 标题 + 摘要
   - 标签（行业/服务类型）
   - 使用 Ant Tag 组件

4. NewsCard (src/components/ui/NewsCard.tsx)：
   - 左图右文布局（桌面端）
   - 上图下文（移动端）
   - 发布日期 + 分类
   - 阅读时间估算

5. StatCard (src/components/ui/StatCard.tsx)：
   - 使用 Ant Statistic 组件
   - 支持动画数字
   - 图标 + 单位显示
   - 趋势指示器（可选）

所有卡片需要：
- 完整的 TypeScript 类型
- 响应式设计
- Loading 骨架屏状态
- 无障碍支持（proper ARIA labels）
```

### 指令6：创建 Section 包装组件
```markdown
创建通用的 Section 组件用于页面区块布局。

文件：src/components/ui/Section.tsx

功能要求：
1. 预设的 padding 方案：
   - compact: py-8 md:py-12
   - normal: py-12 md:py-20 (默认)
   - large: py-20 md:py-32

2. 背景选项：
   - white (默认)
   - gray (bg-gray-50)
   - dark (bg-gray-900 + 白色文字)
   - gradient (自定义渐变)

3. 容器宽度控制：
   - full: 全宽
   - container: max-w-7xl + 自动居中
   - narrow: max-w-4xl

4. 装饰元素：
   - 顶部/底部分割线选项
   - 背景图案（dots, grid）
   - 视差滚动效果（可选）

5. 标题区域（可选）：
   - 副标题（小号彩色文字）
   - 主标题（大号粗体）
   - 描述文字
   - 居中/左对齐选项
```

---

## 🏠 阶段2：首页开发指令 🔄

### 指令7：创建 Hero 区域 ✅
```markdown
基于 Tailwind UI Salient 的 Hero 设计，创建首页 Hero 组件。

文件：src/components/sections/home/Hero.tsx

设计要求：
1. 全屏高度设计（min-h-screen）
2. 左侧文字内容：
   - 小标题："Leading Climate Solutions"
   - 主标题："推动企业可持续发展" (使用渐变色文字)
   - 描述段落
   - 两个 CTA 按钮（Primary + Secondary）

3. 右侧视觉元素：
   - 大幅环保主题图片
   - 或视频背景选项
   - 装饰性几何图形

4. 动画效果（使用 Framer Motion）：
   - 文字逐行淡入
   - 按钮从下方滑入
   - 图片缩放淡入
   - 滚动指示器动画

5. 集成 Ant Design Statistic：
   - 底部显示3个关键数据
   - "1000+ 项目" "50M+ 减排量" "100+ 国家"
   - 数字滚动动画效果

6. 响应式设计：
   - 移动端改为上下布局
   - 文字大小自适应
   - 保持视觉层次
```

### 指令8：创建服务展示区 ✅
```markdown
创建 Services 展示区域，使用网格布局展示核心服务。

文件：src/components/sections/home/Services.tsx

要求：
1. 使用前面创建的 Section 组件包装
2. 标题区域：
   - "Our Solutions" 副标题
   - "全方位的气候解决方案" 主标题

3. 服务网格（3列，响应式）：
   使用 ServiceCard 展示以下服务：
   - 碳足迹测算（Calculator图标）
   - 减排项目投资（Globe图标）
   - 战略咨询（Strategy图标）
   - 碳中和认证（Certificate图标）
   - 可持续供应链（Link图标）
   - ESG报告（Report图标）

4. 交互效果：
   - 卡片淡入动画（使用 react-intersection-observer）
   - 错开的动画延迟
   - Hover 时图标旋转

5. 底部 CTA：
   - "查看所有服务" 按钮
   - 箭头图标动画
```

### 指令9：创建案例展示轮播 ⏳
```markdown
创建案例研究展示区，使用轮播形式展示客户案例。

文件：src/components/sections/home/CaseStudies.tsx

功能要求：
1. 标题区域：
   - "Success Stories"
   - "看看我们如何帮助企业实现可持续发展"

2. 轮播功能（使用 Ant Carousel + 自定义样式）：
   - 一次显示3个案例（桌面端）
   - 自动播放（5秒间隔）
   - 前后导航按钮
   - 底部指示点

3. 案例卡片内容：
   - 客户Logo
   - 项目图片
   - 项目标题
   - 减排成果数据（使用 Ant Statistic）
   - 简短描述
   - "查看详情"链接

4. 筛选标签（使用 Ant Tag）：
   - 全部 / 能源 / 制造业 / 零售 / 金融
   - 点击筛选对应行业案例

5. 移动端适配：
   - 改为单个卡片显示
   - 支持触摸滑动

6. 加载状态：
   - 使用 Skeleton 组件
   - 平滑过渡

整合模拟数据，展示5-6个案例。
```

---

## 📄 阶段3：内页开发指令 ⏳

### 指令10：创建新闻列表页
```markdown
创建新闻中心列表页，包含筛选和搜索功能。

文件：src/app/news/page.tsx

页面结构：
1. 页面 Hero（简化版）：
   - 标题："新闻中心"
   - 副标题："了解最新的行业动态和公司新闻"
   - 背景使用渐变色

2. 筛选工具栏：
   - 分类筛选（Ant Select）：全部/公司新闻/行业洞察/活动报道
   - 时间筛选（Ant DatePicker）：最近一周/一月/三月/自定义
   - 搜索框（Ant Input.Search）：标题和内容搜索
   - 排序（Ant Radio.Group）：最新/最热门

3. 文章列表：
   - 使用 NewsCard 组件
   - 2列网格布局（桌面端）
   - 首篇文章占据全宽（特色文章）

4. 分页（Ant Pagination）：
   - 每页12篇
   - 显示总数
   - 快速跳转

5. 侧边栏（桌面端）：
   - 热门标签云（Ant Tag）
   - 订阅 Newsletter（Ant Form）
   - 相关资源下载

6. 加载和空状态处理
```

### 指令11：创建文章详情页
```markdown
创建新闻/博客文章详情页模板。

文件：src/app/news/[slug]/page.tsx

页面组成：
1. 文章头部：
   - 分类标签（Ant Tag）
   - 标题（大字号）
   - 元信息：作者、日期、阅读时间
   - 社交分享按钮（Ant Tooltip包装）

2. 特色图片：
   - 全宽大图
   - 图片说明文字
   - 使用 Next/Image 优化

3. 文章内容：
   - 使用 Tailwind Typography 样式
   - 支持的元素：
     - 段落、标题（h2-h4）
     - 列表（有序/无序）
     - 引用块
     - 图片（带说明）
     - 表格（使用 Ant Table）
     - 代码块（如果需要）

4. 文章导航（固定侧边栏）：
   - 目录（自动生成）
   - 当前阅读位置指示
   - 返回顶部按钮

5. 底部区域：
   - 作者简介卡片
   - 相关文章推荐（3篇）
   - 评论区（预留接口）

6. SEO优化：
   - 动态 meta 标签
   - 结构化数据
   - Open Graph 标签

实现服务端渲染，从API获取文章内容。
```

### 指令12：创建服务介绍页
```markdown
创建服务详情页，展示具体服务内容。

文件：src/app/services/[service]/page.tsx

页面设计：
1. Hero 区域：
   - 服务名称（大标题）
   - 简短描述
   - CTA按钮："立即咨询"
   - 背景使用相关图片+遮罩

2. 服务概述（使用图标+文字）：
   - 3-4个核心价值点
   - 使用 grid 布局
   - 图标动画效果

3. 详细介绍（分Tab展示）：
   使用 Ant Tabs 组件：
   - 服务内容
   - 实施流程
   - 成功案例
   - 常见问题

4. 数据展示：
   - 使用 Ant Statistic 展示成果
   - 简单的图表（Ant Charts）
   - 认证标志展示

5. 案例展示：
   - 相关案例轮播
   - 使用之前的 CaseCard

6. CTA 区域：
   - 背景使用渐变色
   - "准备开始？"标题
   - 联系表单（Ant Form）
   - 或预约会议按钮

7. 相关服务推荐

响应式设计，确保移动端体验。
```

---

## ⚡ 阶段4：高级功能指令 ⏳

### 指令13：实现全站搜索
```markdown
实现全站搜索功能，包括搜索界面和结果展示。

需要创建的文件：
1. src/components/ui/SearchModal.tsx（搜索弹窗）
2. src/app/search/page.tsx（搜索结果页）
3. src/hooks/useSearch.ts（搜索逻辑）

搜索弹窗要求：
1. 快捷键触发（Cmd/Ctrl + K）
2. 全屏模态框（使用 Ant Modal）
3. 搜索输入框：
   - 自动聚焦
   - 实时搜索（适当防抖）
   - 清除按钮

4. 搜索建议：
   - 按类型分组（页面/新闻/案例/资源）
   - 高亮匹配关键词
   - 键盘导航支持

5. 快速跳转：
   - 回车跳转到结果页
   - 点击建议直接跳转

搜索结果页要求：
1. 搜索框保持在顶部
2. 结果统计（找到 X 条结果）
3. 结果分类展示：
   - 使用 Ant Tabs
   - 全部/页面/新闻/案例/资源

4. 结果卡片：
   - 标题（高亮关键词）
   - 内容摘要（高亮关键词）
   - 面包屑路径
   - 发布时间

5. 高级筛选：
   - 时间范围
   - 内容类型
   - 排序方式

6. 分页功能

实现模糊搜索算法，支持中英文。
```

### 指令14：创建联系表单系统
```markdown
创建完整的联系表单系统，包括多种表单类型。

需要创建：
1. src/components/forms/ContactForm.tsx（通用联系表单）
2. src/components/forms/NewsletterForm.tsx（订阅表单）
3. src/components/forms/DownloadForm.tsx（下载资源表单）
4. src/lib/form-validation.ts（验证规则）

通用联系表单要求：
1. 字段设计：
   - 姓名*（First Name, Last Name）
   - 公司*
   - 职位
   - 邮箱*
   - 电话
   - 国家/地区（Ant Select）
   - 咨询类型（Ant Select）
   - 详细信息（Ant TextArea）
   - 验证码（预留）

2. 验证规则：
   - 必填字段验证
   - 邮箱格式验证
   - 电话格式验证（国际化）
   - 字符长度限制

3. 交互体验：
   - 实时验证反馈
   - 提交时 loading 状态
   - 成功/失败消息（Ant Message）
   - 表单重置选项

4. 样式设计：
   - 两列布局（桌面端）
   - 清晰的错误提示
   - 焦点状态优化

Newsletter 订阅表单：
1. 简化版本（邮箱 + 订阅按钮）
2. 支持内联和弹窗两种形式
3. 邮箱验证
4. 订阅成功提示

下载资源表单：
1. 收集基本信息（姓名、公司、邮箱）
2. 选择下载资源类型
3. 同意接收营销信息（Checkbox）
4. 提交后自动下载

所有表单需要：
- 防重复提交
- 数据加密传输
- 错误日志记录
```

### 指令15：实现多语言支持
```markdown
为网站添加中英文切换功能。

需要实现：
1. 配置 next-i18next
2. 创建语言文件结构
3. 修改组件支持多语言
4. 实现语言切换器

文件结构：
/public/locales
  /en
    - common.json
    - home.json
    - nav.json
  /zh
    - common.json
    - home.json  
    - nav.json

实现步骤：
1. 在 src/lib/i18n.ts 配置：
   - 默认语言：en
   - 支持语言：en, zh
   - 加载策略

2. 修改 Header 组件：
   - 添加语言切换下拉菜单
   - 使用 Ant Dropdown
   - 显示当前语言

3. 翻译关键内容：
   - 导航菜单
   - 页面标题
   - CTA 按钮
   - 表单标签

4. 处理特殊情况：
   - 日期格式化
   - 数字格式化
   - RTL支持（预留）

5. SEO处理：
   - hreflang 标签
   - 语言相关的 URL

确保语言切换平滑，无页面刷新。
```

---

## 🚀 阶段5：性能优化指令 ⏳

### 指令16：图片优化系统
```markdown
实现全站图片优化策略。

任务清单：
1. 创建图片组件 (src/components/ui/OptimizedImage.tsx)：
   - 基于 Next/Image 封装
   - 自动生成 blur placeholder
   - 支持 WebP/AVIF 格式
   - 响应式图片加载

2. 实现图片处理脚本 (scripts/optimize-images.js)：
   - 批量转换为 WebP/AVIF
   - 生成多种尺寸
   - 创建 blur data URL
   - 压缩优化

3. 配置图片 CDN：
   - 配置 next.config.js
   - 图片域名白名单
   - 图片加载器

4. 实现懒加载策略：
   - 使用 Intersection Observer
   - 渐进式加载效果
   - Loading 占位符

5. 优化 Hero 图片：
   - 使用 priority 属性
   - 预加载关键图片
   - 响应式图片集

性能目标：
- 优化图片加载性能
- 提升 LCP 分数
- 减少图片总大小
```

### 指令17：实现代码分割和懒加载
```markdown
优化 JavaScript bundle 大小，实现智能代码分割。

优化任务：
1. 分析当前 bundle (创建分析脚本)

2. 实现路由级代码分割：
   - 将 Ant Design 组件按路由分割
   - CMS 管理页面独立 chunk
   - 图表组件按需加载

3. 优化第三方库：
   - lodash → lodash-es
   - moment → dayjs
   - 移除未使用的 imports

4. 创建动态导入包装器

5. 优化 Ant Design 导入：
   - 使用 modularizeImports
   - 按需加载样式
   - Tree-shaking 配置

6. 实现预加载策略：
   - 关键路由预加载
   - 空闲时间预加载
   - 基于用户行为预测

目标指标：
- 优化首屏 JS 大小
- 减少总 bundle 体积
- 加快路由切换速度
```

### 指令18：SEO 优化实施
```markdown
实现完整的 SEO 优化策略。

需要创建/修改：
1. src/components/seo/SEOHead.tsx：
   - 动态 meta 标签
   - Open Graph 标签
   - Twitter Card 标签
   - 结构化数据 (JSON-LD)

2. 为每个页面配置 metadata

3. 实现 sitemap.xml 生成：
   - src/app/sitemap.ts
   - 动态生成所有页面
   - 包含更新频率和优先级

4. 实现 robots.txt：
   - src/app/robots.ts
   - 正确的爬虫规则
   - Sitemap 引用

5. 结构化数据实现：
   - 组织信息 (Organization)
   - 面包屑 (BreadcrumbList)
   - 文章 (Article)
   - 常见问题 (FAQPage)

6. 性能相关 SEO：
   - 实现正确的标题层级
   - 图片 alt 标签
   - 内部链接优化
   - 页面加载速度

7. 创建 SEO 检查清单组件（开发模式）：
   - 检查 meta 标签
   - 验证结构化数据
   - 标题层级检查
   - 图片 alt 检查

目标：
- 高 Google PageSpeed Insights 分数
- 所有页面都有唯一的 title/description
- 正确的结构化数据
```

---

## 🚀 部署和维护指令

### 指令19：配置 CI/CD 流程
```markdown
设置 GitHub Actions 自动化部署流程。

创建 .github/workflows/deploy.yml：

1. 构建和测试流程：
   - 代码检查 (ESLint)
   - 类型检查 (TypeScript)
   - 单元测试运行
   - 构建测试

2. 部署流程：
   - 开发环境自动部署 (dev branch)
   - 预览环境部署 (PR)
   - 生产环境部署 (main branch)

3. 性能检查：
   - Lighthouse CI
   - Bundle 大小检查
   - 图片优化检查

4. 通知配置：
   - Slack 通知
   - 部署状态更新
   - 错误告警

配置环境变量：
- VERCEL_TOKEN
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_GA_ID
等

实现版本标签和回滚机制。
```

### 指令20：创建管理员文档
```markdown
创建完整的网站管理员操作手册。

文件：/docs/admin-guide.md

包含内容：
1. CMS 使用指南：
   - 登录方法
   - 内容创建流程
   - 图片上传规范
   - SEO 设置指导

2. 常见操作：
   - 发布新闻文章
   - 更新案例研究
   - 修改首页内容
   - 管理团队信息

3. 注意事项：
   - 图片尺寸要求
   - 文字长度建议
   - SEO 最佳实践
   - 多语言内容管理

4. 故障排除：
   - 常见问题解答
   - 错误信息说明
   - 联系技术支持

5. 附录：
   - 快捷键列表
   - 术语解释
   - 更新日志

使用 Markdown 格式，包含截图说明。
```

---

## 💡 关于改进空间的建议

基于当前 Services 组件的评估，**建议暂时不执行以下改进**：

### ❌ 不建议现在执行：
1. **数据配置化** - 等所有组件完成后统一重构
2. **图标组件化** - 等图标使用场景明确后统一处理
3. **国际化支持** - 属于阶段4的高级功能
4. **单元测试扩展** - 等核心功能完成后统一添加

### ✅ 可以考虑：
1. **增加JSDoc注释** - 不影响开发进度，有助于团队协作
2. **优化动画配置** - 在下个组件开发时一并优化

---

## 📏 质量标准

### 编码前检查清单：
- [ ] 阅读本开发计划相关指令
- [ ] 确认技术栈要求
- [ ] 检查依赖项是否安装
- [ ] 确认文件路径符合规范

### 编码后检查清单：
- [ ] TypeScript 类型完整
- [ ] 响应式设计适配
- [ ] 可访问性支持
- [ ] 动画效果流畅
- [ ] 构建无错误
- [ ] ESLint 通过

---

## 📞 使用说明

1. **按顺序执行**：指令按照项目开发流程排序，建议按顺序执行
2. **适当调整**：根据实际情况调整指令中的具体要求
3. **保存输出**：每个指令执行后，保存生成的代码便于后续引用
4. **测试验证**：每完成一个模块，进行测试确保功能正常
5. **版本控制**：定期提交代码到 Git，保持良好的提交历史

---

**📅 最后更新：** 2025-01-12  
**🎯 当前阶段：** 阶段2 - 首页开发（指令8已完成，准备执行指令9）

---

> 💡 **提示**：这套指令集覆盖了整个项目的开发过程，确保每次编码前都参考相关指令，保持代码质量和一致性。