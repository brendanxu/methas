# 🎥 Hero Video Background Setup Guide

本指南说明如何设置和配置新的Hero视频背景功能，完全仿照southpole.com的设计风格。

## 📁 所需文件

### 1. 视频文件
将以下视频文件添加到 `public/videos/` 目录：

```
public/videos/
├── southpole-hero.mp4         # 主视频文件 (推荐)
├── southpole-hero.webm        # WebM格式 (更小体积)
└── hero-poster.jpg            # 视频封面图片
```

### 2. 图片文件
将以下图片文件添加到 `public/images/` 目录：

```
public/images/
├── homepage-main-hero-option-3_640x1036.jpg  # 后备背景图片
├── hero-poster.jpg                            # 视频封面
└── network-test.png                           # 网络测试图片 (已创建)
```

## 🎬 视频规格建议

### 视频格式
- **MP4**: H.264编码，推荐用于兼容性
- **WebM**: VP9编码，更小体积，现代浏览器支持

### 视频规格
- **分辨率**: 1920x1080 (Full HD) 或 1280x720 (HD)
- **帧率**: 30fps
- **码率**: 3-5 Mbps (平衡质量与文件大小)
- **时长**: 15-30秒 (循环播放)
- **音频**: 无音频或静音

### 优化建议
```bash
# 使用FFmpeg优化视频文件
ffmpeg -i input.mp4 -vcodec libx264 -acodec aac -b:v 3M -b:a 128k -vf scale=1920:1080 -r 30 southpole-hero.mp4

# 创建WebM版本
ffmpeg -i input.mp4 -vcodec libvpx-vp9 -acodec libvorbis -b:v 2M -vf scale=1920:1080 -r 30 southpole-hero.webm
```

## 🔧 组件配置

### 基础使用

```tsx
import { DynamicEnhancedHero } from '@/lib/dynamic-imports';

<DynamicEnhancedHero 
  videoConfig={{
    mp4Url: '/videos/southpole-hero.mp4',
    webmUrl: '/videos/southpole-hero.webm',
    posterUrl: '/images/hero-poster.jpg',
    enableVideo: true,
    disableOnMobile: true
  }}
  backgroundImage="/images/homepage-main-hero-option-3_640x1036.jpg"
  content={{
    title: "It's time for a net zero world.",
    subtitle: "Hello, we're South Pole. The Climate Company.",
    description: "We've been helping organisations decarbonise and navigate the complexities of climate since 2006.",
    ctaText: "Learn more",
    ctaLink: "/what-we-do"
  }}
  visual={{
    overlayOpacity: 0.5,
    textAlignment: 'center',
    showScrollHint: true,
    theme: 'dark'
  }}
/>
```

### 高级配置

```tsx
// 视频配置
videoConfig={{
  mp4Url: '/videos/southpole-hero.mp4',      // 主视频文件
  webmUrl: '/videos/southpole-hero.webm',    // WebM格式 (可选)
  posterUrl: '/images/hero-poster.jpg',       // 视频封面
  enableVideo: true,                          // 启用视频
  disableOnMobile: true                       // 移动端禁用视频
}}

// 内容配置
content={{
  title: "自定义标题",
  subtitle: "自定义副标题", 
  description: "自定义描述文字",
  ctaText: "按钮文案",
  ctaLink: "/目标链接"
}}

// 视觉配置
visual={{
  overlayOpacity: 0.5,        // 遮罩透明度 (0-1)
  textAlignment: 'center',    // 文字对齐: 'left' | 'center' | 'right'
  showScrollHint: true,       // 显示滚动提示
  theme: 'dark'               // 主题: 'dark' | 'light'
}}
```

## 🚀 性能优化功能

### 自动优化
- ✅ **网络检测**: 自动检测网络速度，慢网络时禁用视频
- ✅ **移动端优化**: 移动设备自动使用静态图片
- ✅ **懒加载**: 视频仅在进入视口时加载
- ✅ **自动播放检测**: 检测浏览器自动播放支持
- ✅ **错误处理**: 视频加载失败时自动回退到图片

### 网络适配
```typescript
// 网络速度检测
- 慢网络 (2G/3G): 禁用视频，使用图片
- 快网络 (4G/WiFi): 启用视频播放
- 数据节省模式: 自动禁用视频
```

### 设备适配
```typescript
// 设备检测
- 桌面端: 完整视频体验
- 平板端: 降低视频质量
- 移动端: 使用静态图片 (可配置)
```

## 🛠️ 开发调试

### 调试信息
开发环境下，右上角会显示调试信息：
- Video: 视频启用状态
- Loaded: 视频加载状态
- Playing: 视频播放状态
- Error: 错误状态
- Network: 网络速度
- Mobile: 移动设备检测

### 强制启用视频
```tsx
// 强制在移动端启用视频 (不推荐)
<DynamicEnhancedHero 
  videoConfig={{
    disableOnMobile: false  // 移动端也启用视频
  }}
/>
```

## 🎨 视觉定制

### 遮罩效果
```scss
// 自定义遮罩渐变
.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}
```

### 文字样式
```scss
// 标题样式类
.newhome-hero__title {
  font-size: clamp(2rem, 8vw, 8rem);
  line-height: 1.1;
  font-weight: 700;
}

// 副标题样式类
.newhome-hero__subtitle {
  font-size: clamp(1.25rem, 4vw, 4rem);
  line-height: 1.3;
  font-weight: 600;
}
```

## 📱 响应式设计

### 断点配置
```css
/* 移动设备 */
@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .hero-subtitle { font-size: 1.5rem; }
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  .hero-title { font-size: 4rem; }
  .hero-subtitle { font-size: 2rem; }
}

/* 桌面设备 */
@media (min-width: 1025px) {
  .hero-title { font-size: 6rem; }
  .hero-subtitle { font-size: 3rem; }
}
```

## 🔍 SEO 优化

### 结构化数据
```json
{
  "@type": "VideoObject",
  "name": "South Pole Hero Video",
  "description": "Net zero world - South Pole sustainability",
  "thumbnailUrl": "/images/hero-poster.jpg",
  "uploadDate": "2024-01-01T00:00:00Z",
  "duration": "PT30S"
}
```

### 无障碍访问
```html
<video aria-hidden="true" role="presentation">
  <track kind="captions" src="/videos/captions.vtt" srclang="en" label="English" />
</video>
```

## 🚨 故障排除

### 常见问题

1. **视频无法播放**
   - 检查视频文件是否存在
   - 确认视频格式支持
   - 检查浏览器自动播放策略

2. **加载速度慢**
   - 优化视频文件大小
   - 使用CDN托管视频
   - 检查网络连接

3. **移动端显示问题**
   - 确认移动端配置正确
   - 检查后备图片是否存在
   - 验证响应式样式

### 性能监控
```typescript
// 监控视频加载性能
const videoElement = document.querySelector('video');
videoElement.addEventListener('loadstart', () => {
  console.log('Video loading started');
});
videoElement.addEventListener('canplay', () => {
  console.log('Video can start playing');
});
```

## 📈 未来改进

### 计划功能
- [ ] 视频质量自适应
- [ ] 更多视频格式支持
- [ ] 视频字幕支持
- [ ] 视频播放统计
- [ ] A/B测试支持

### 技术债务
- [ ] 视频文件压缩优化
- [ ] 更完善的错误处理
- [ ] 视频播放暂停控制
- [ ] 视频进度指示器

---

需要帮助？请查看项目文档或提交Issue。