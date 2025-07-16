# 🎥 视频文件目录

此目录用于存放Hero背景视频文件。

## 📁 所需文件

请添加以下视频文件到此目录：

### 主要视频文件
- `southpole-hero.mp4` - 主视频文件 (H.264编码)
- `southpole-hero.webm` - WebM格式视频 (VP9编码，可选)
- `hero-poster.jpg` - 视频封面图片

### 视频规格建议
- **分辨率**: 1920x1080 (Full HD)
- **格式**: MP4 (H.264) + WebM (VP9)
- **帧率**: 30fps
- **码率**: 3-5 Mbps
- **时长**: 15-30秒 (循环播放)
- **音频**: 静音

### 文件大小建议
- MP4: 5-10MB
- WebM: 3-8MB
- 封面图片: < 500KB

## 📖 详细说明

请参考项目根目录的 `VIDEO_SETUP.md` 文件获取完整的设置指南。

## 🔗 视频内容建议

视频内容应该：
- 展示可持续发展、环保主题
- 与 South Pole 品牌形象一致
- 适合作为网站背景（不会分散注意力）
- 色调较暗，以确保白色文字可读性

## 🛠️ 视频制作工具

推荐使用以下工具创建和优化视频：

### FFmpeg (命令行)
```bash
# 创建MP4版本
ffmpeg -i input.mp4 -vcodec libx264 -acodec aac -b:v 3M -vf scale=1920:1080 -r 30 southpole-hero.mp4

# 创建WebM版本
ffmpeg -i input.mp4 -vcodec libvpx-vp9 -acodec libvorbis -b:v 2M -vf scale=1920:1080 -r 30 southpole-hero.webm
```

### 在线工具
- CloudConvert
- Online Video Converter
- Handbrake

---

没有合适的视频？系统会自动回退到静态图片背景。