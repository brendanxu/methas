import { useState, useEffect } from 'react';

export const useBackgroundDetection = () => {
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkBackground = () => {
      // 检测滚动
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);

      // 获取Header高度
      const header = document.querySelector('header');
      if (!header) return;

      const headerRect = header.getBoundingClientRect();
      
      // 在Header下方多个点采样
      const samplePoints = [
        { x: headerRect.width * 0.25, y: headerRect.bottom + 10 },
        { x: headerRect.width * 0.5, y: headerRect.bottom + 10 },
        { x: headerRect.width * 0.75, y: headerRect.bottom + 10 }
      ];

      let darkCount = 0;
      
      samplePoints.forEach(point => {
        const element = document.elementFromPoint(point.x, point.y);
        if (element && element !== document.body && element !== document.documentElement) {
          const styles = window.getComputedStyle(element);
          const bgColor = styles.backgroundColor;
          
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            if (isColorDark(bgColor)) {
              darkCount++;
            }
          } else {
            // 检查父元素
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
              const parentBg = window.getComputedStyle(parent).backgroundColor;
              if (parentBg && parentBg !== 'rgba(0, 0, 0, 0)') {
                if (isColorDark(parentBg)) {
                  darkCount++;
                }
                break;
              }
              parent = parent.parentElement;
            }
          }
        }
      });

      setIsDarkBackground(darkCount >= 2);
    };

    // 颜色亮度计算
    const isColorDark = (color: string): boolean => {
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return false;
      
      const [r, g, b] = rgb.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    };

    // 节流处理
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkBackground();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkBackground);
    
    // 初始检查
    setTimeout(checkBackground, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkBackground);
    };
  }, []);

  return { isDarkBackground, isScrolled };
};