/**
 * SouthPole风格动画配置
 * 基于对southpole.com的深度分析，实现高质量动画效果
 */

export const southPoleAnimations = {
  // ===== 基础动画时序 =====
  timing: {
    // 快速响应的微交互
    micro: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1], // Material Design standard easing
    },
    
    // 标准UI过渡
    standard: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
    },
    
    // 优雅的内容动画
    elegant: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1], // ease-out-quart
    },
    
    // 大型布局变化
    layout: {
      duration: 0.8,
      ease: [0.175, 0.885, 0.32, 1.275], // ease-out-back
    },
    
    // Spring物理动画
    spring: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
      duration: 0.6,
    },
    
    // 精确控制的spring
    preciseSpring: {
      type: "spring" as const,
      damping: 30,
      stiffness: 400,
      duration: 0.4,
    }
  },

  // ===== 导航动画 =====
  navigation: {
    // 导航栏进入动画
    headerEntry: {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.6,
      }
    },
    
    // 下拉菜单动画
    dropdown: {
      initial: {
        opacity: 0,
        y: -10,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.3,
          staggerChildren: 0.05,
          delayChildren: 0.1,
        }
      },
      exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
          duration: 0.2,
          ease: [0.23, 1, 0.32, 1],
        }
      }
    },
    
    // 下拉菜单项动画
    dropdownItem: {
      initial: {
        opacity: 0,
        x: -20,
      },
      animate: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 400,
          duration: 0.3,
        }
      }
    },
    
    // Hover效果
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.2,
      }
    },
    
    // 点击效果
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.1,
      }
    }
  },

  // ===== 页面内容动画 =====
  content: {
    // 英雄区域进入
    heroEntry: {
      initial: { opacity: 0, y: 40 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
          staggerChildren: 0.2,
          delayChildren: 0.3,
        }
      }
    },
    
    // 标题动画
    titleReveal: {
      initial: { opacity: 0, y: 30 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
        }
      }
    },
    
    // 文本淡入
    textFadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }
      }
    },
    
    // 卡片进入动画
    cardEntry: {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.6,
        }
      }
    },
    
    // 图片加载动画
    imageLoad: {
      initial: { opacity: 0, scale: 1.1 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
        }
      }
    },
    
    // 滑动进入（从左）
    slideInLeft: {
      initial: { opacity: 0, x: -40 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
        }
      }
    },
    
    // 滑动进入（从右）
    slideInRight: {
      initial: { opacity: 0, x: 40 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
        }
      }
    },
    
    // 缩放进入
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.6,
        }
      }
    },
    
    // 上升动画
    riseUp: {
      initial: { opacity: 0, y: 50 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.175, 0.885, 0.32, 1.275],
        }
      }
    }
  },

  // ===== 滚动触发动画 =====
  scroll: {
    // 基础滚动进入
    fadeInOnScroll: {
      initial: { opacity: 0, y: 30 },
      whileInView: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.23, 1, 0.32, 1],
        }
      },
      viewport: { 
        once: true, 
        margin: "0px 0px -100px 0px" 
      }
    },
    
    // 卡片网格动画
    cardGrid: {
      initial: "hidden",
      whileInView: "visible",
      viewport: { 
        once: true, 
        margin: "0px 0px -50px 0px" 
      },
      variants: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          }
        }
      }
    },
    
    // 交替布局动画
    alternatingLayout: {
      initial: "hidden",
      whileInView: "visible",
      viewport: { 
        once: true, 
        margin: "0px 0px -150px 0px" 
      },
      variants: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
          }
        }
      }
    }
  },

  // ===== 高级交互动画 =====
  interactions: {
    // 按钮悬停
    buttonHover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.2,
      }
    },
    
    // 卡片悬停
    cardHover: {
      y: -4,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.3,
      }
    },
    
    // 图片悬停
    imageHover: {
      scale: 1.05,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.4,
      }
    },
    
    // 链接悬停
    linkHover: {
      x: 4,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.2,
      }
    },
    
    // 图标旋转
    iconRotate: {
      rotate: 5,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.3,
      }
    }
  },

  // ===== 页面转场动画 =====
  pageTransitions: {
    // 淡入淡出
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      }
    },
    
    // 滑动转场
    slide: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 },
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }
    },
    
    // 缩放转场
    scale: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.1, opacity: 0 },
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      }
    }
  },

  // ===== Viewport配置 =====
  viewports: {
    // 标准进入点
    standard: { 
      once: true, 
      margin: "0px 0px -100px 0px" 
    },
    
    // 早期触发
    early: { 
      once: true, 
      margin: "0px 0px -200px 0px" 
    },
    
    // 延迟触发
    delayed: { 
      once: true, 
      margin: "0px 0px -50px 0px" 
    },
    
    // 重复触发
    repeat: { 
      once: false, 
      margin: "0px 0px -100px 0px" 
    }
  }
};

// ===== 工具函数 =====

/**
 * 创建带延迟的动画变体
 */
export const createStaggeredVariants = (
  baseVariant: any,
  staggerDelay: number = 0.1,
  childrenDelay: number = 0.2
) => ({
  hidden: {},
  visible: {
    ...baseVariant.visible,
    transition: {
      ...baseVariant.visible?.transition,
      staggerChildren: staggerDelay,
      delayChildren: childrenDelay,
    }
  }
});

/**
 * 创建响应式动画配置
 */
export const createResponsiveAnimation = (
  baseAnimation: any,
  mobileOverrides: any = {}
) => {
  if (typeof window === 'undefined') return baseAnimation;
  
  const isMobile = window.innerWidth < 768;
  
  return isMobile 
    ? { ...baseAnimation, ...mobileOverrides }
    : baseAnimation;
};

/**
 * 根据性能等级调整动画
 */
export const optimizeAnimationForPerformance = (
  animation: any,
  performanceLevel: 'high' | 'medium' | 'low' = 'high'
) => {
  switch (performanceLevel) {
    case 'low':
      return {
        ...animation,
        transition: {
          ...animation.transition,
          duration: (animation.transition?.duration || 0.3) * 0.5,
          ease: 'linear',
        }
      };
    case 'medium':
      return {
        ...animation,
        transition: {
          ...animation.transition,
          duration: (animation.transition?.duration || 0.3) * 0.75,
        }
      };
    default:
      return animation;
  }
};

export default southPoleAnimations;