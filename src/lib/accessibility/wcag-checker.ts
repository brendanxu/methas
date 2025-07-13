'use client';

interface AccessibilityRule {
  id: string;
  name: string;
  level: 'A' | 'AA' | 'AAA';
  category: 'perceivable' | 'operable' | 'understandable' | 'robust';
  check: (element: Element) => AccessibilityIssue[];
}

interface AccessibilityIssue {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  element: Element;
  suggestion?: string;
  wcagReference?: string;
}

interface AccessibilityReport {
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
    infos: number;
    score: number; // 0-100
  };
  issues: AccessibilityIssue[];
  timestamp: Date;
  url: string;
}

class WCAGChecker {
  private rules: AccessibilityRule[] = [];

  constructor() {
    this.initializeRules();
  }

  // 初始化WCAG规则
  private initializeRules(): void {
    this.rules = [
      // 感知性 (Perceivable) 规则
      {
        id: 'images-alt-text',
        name: '图片替代文本',
        level: 'A',
        category: 'perceivable',
        check: this.checkImageAltText,
      },
      {
        id: 'color-contrast',
        name: '颜色对比度',
        level: 'AA',
        category: 'perceivable',
        check: this.checkColorContrast,
      },
      {
        id: 'heading-structure',
        name: '标题结构',
        level: 'A',
        category: 'perceivable',
        check: this.checkHeadingStructure,
      },
      {
        id: 'form-labels',
        name: '表单标签',
        level: 'A',
        category: 'perceivable',
        check: this.checkFormLabels,
      },
      {
        id: 'video-captions',
        name: '视频字幕',
        level: 'A',
        category: 'perceivable',
        check: this.checkVideoCaptions,
      },

      // 可操作性 (Operable) 规则
      {
        id: 'keyboard-navigation',
        name: '键盘导航',
        level: 'A',
        category: 'operable',
        check: this.checkKeyboardNavigation,
      },
      {
        id: 'focus-indicators',
        name: '焦点指示器',
        level: 'AA',
        category: 'operable',
        check: this.checkFocusIndicators,
      },
      {
        id: 'skip-links',
        name: '跳过链接',
        level: 'A',
        category: 'operable',
        check: this.checkSkipLinks,
      },
      {
        id: 'link-purpose',
        name: '链接目的',
        level: 'A',
        category: 'operable',
        check: this.checkLinkPurpose,
      },

      // 可理解性 (Understandable) 规则
      {
        id: 'page-language',
        name: '页面语言',
        level: 'A',
        category: 'understandable',
        check: this.checkPageLanguage,
      },
      {
        id: 'form-instructions',
        name: '表单说明',
        level: 'A',
        category: 'understandable',
        check: this.checkFormInstructions,
      },
      {
        id: 'error-identification',
        name: '错误识别',
        level: 'A',
        category: 'understandable',
        check: this.checkErrorIdentification,
      },

      // 健壮性 (Robust) 规则
      {
        id: 'valid-html',
        name: '有效HTML',
        level: 'A',
        category: 'robust',
        check: this.checkValidHTML,
      },
      {
        id: 'aria-usage',
        name: 'ARIA使用',
        level: 'A',
        category: 'robust',
        check: this.checkAriaUsage,
      },
      {
        id: 'landmarks',
        name: '页面地标',
        level: 'AA',
        category: 'robust',
        check: this.checkLandmarks,
      },
    ];
  }

  // 检查图片替代文本
  private checkImageAltText = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (element.tagName !== 'IMG') return issues;
    
    const img = element as HTMLImageElement;
    const alt = img.getAttribute('alt');
    const src = img.src;
    
    // 检查是否有alt属性
    if (alt === null) {
      issues.push({
        ruleId: 'images-alt-text',
        severity: 'error',
        message: '图片缺少alt属性',
        element,
        suggestion: '为图片添加描述性的alt属性',
        wcagReference: 'WCAG 1.1.1',
      });
    }
    // 检查装饰性图片
    else if (alt === '' && !img.hasAttribute('role')) {
      // 空alt可能表示装饰性图片，但需要确认
      if (src && !src.includes('decoration') && !src.includes('bg-')) {
        issues.push({
          ruleId: 'images-alt-text',
          severity: 'warning',
          message: '图片alt为空，请确认是否为装饰性图片',
          element,
          suggestion: '如果是装饰性图片，添加role="presentation"；否则提供描述性文本',
          wcagReference: 'WCAG 1.1.1',
        });
      }
    }
    // 检查alt文本质量
    else if (alt && (alt.length < 3 || alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture'))) {
      issues.push({
        ruleId: 'images-alt-text',
        severity: 'warning',
        message: 'alt文本质量可能不佳',
        element,
        suggestion: '提供更有意义的alt文本，避免使用"图片"、"图像"等词汇',
        wcagReference: 'WCAG 1.1.1',
      });
    }
    
    return issues;
  };

  // 检查颜色对比度
  private checkColorContrast = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (element.nodeType !== Node.ELEMENT_NODE) return issues;
    
    const computedStyle = window.getComputedStyle(element as HTMLElement);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    // 简化的对比度检查（实际实现需要更复杂的算法）
    if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const contrast = this.calculateContrastRatio(color, backgroundColor);
      
      if (contrast < 4.5) {
        issues.push({
          ruleId: 'color-contrast',
          severity: 'error',
          message: `颜色对比度不足 (${contrast.toFixed(2)}:1)`,
          element,
          suggestion: '调整前景色或背景色以达到4.5:1的对比度',
          wcagReference: 'WCAG 1.4.3',
        });
      } else if (contrast < 7) {
        issues.push({
          ruleId: 'color-contrast',
          severity: 'info',
          message: `颜色对比度可以进一步提升 (${contrast.toFixed(2)}:1)`,
          element,
          suggestion: '考虑提高到7:1以达到AAA级别',
          wcagReference: 'WCAG 1.4.6',
        });
      }
    }
    
    return issues;
  };

  // 计算对比度比例（简化版）
  private calculateContrastRatio(color1: string, color2: string): number {
    // 这是一个简化的实现，实际应该使用完整的WCAG算法
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    if (!rgb1 || !rgb2) return 21; // 假设对比度足够
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  // 解析颜色值
  private parseColor(color: string): { r: number; g: number; b: number } | null {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    }
    return null;
  }

  // 计算亮度
  private getLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;
    
    const r2 = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const g2 = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const b2 = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
    
    return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  }

  // 检查标题结构
  private checkHeadingStructure = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (!/^H[1-6]$/i.test(element.tagName)) return issues;
    
    const currentLevel = parseInt(element.tagName.charAt(1));
    const previousHeading = this.findPreviousHeading(element);
    
    if (previousHeading) {
      const previousLevel = parseInt(previousHeading.tagName.charAt(1));
      
      if (currentLevel > previousLevel + 1) {
        issues.push({
          ruleId: 'heading-structure',
          severity: 'error',
          message: `标题级别跳跃：从H${previousLevel}跳到H${currentLevel}`,
          element,
          suggestion: '标题应该按顺序使用，不要跳级',
          wcagReference: 'WCAG 1.3.1',
        });
      }
    } else if (currentLevel !== 1) {
      issues.push({
        ruleId: 'heading-structure',
        severity: 'warning',
        message: '页面第一个标题不是H1',
        element,
        suggestion: '页面应该从H1开始',
        wcagReference: 'WCAG 1.3.1',
      });
    }
    
    return issues;
  };

  // 查找前一个标题
  private findPreviousHeading(element: Element): Element | null {
    let current = element.previousElementSibling;
    
    while (current) {
      if (/^H[1-6]$/i.test(current.tagName)) {
        return current;
      }
      current = current.previousElementSibling;
    }
    
    return null;
  }

  // 检查表单标签
  private checkFormLabels = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) return issues;
    
    const input = element as HTMLInputElement;
    const id = input.id;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    
    // 查找关联的label
    let hasLabel = false;
    
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) hasLabel = true;
    }
    
    // 检查父级label
    const parentLabel = input.closest('label');
    if (parentLabel) hasLabel = true;
    
    // 检查ARIA标签
    if (ariaLabel || ariaLabelledby) hasLabel = true;
    
    if (!hasLabel) {
      issues.push({
        ruleId: 'form-labels',
        severity: 'error',
        message: '表单控件缺少标签',
        element,
        suggestion: '为表单控件添加label元素或aria-label属性',
        wcagReference: 'WCAG 1.3.1',
      });
    }
    
    return issues;
  };

  // 检查视频字幕
  private checkVideoCaptions = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (element.tagName !== 'VIDEO') return issues;
    
    const video = element as HTMLVideoElement;
    const tracks = video.querySelectorAll('track[kind="captions"], track[kind="subtitles"]');
    
    if (tracks.length === 0) {
      issues.push({
        ruleId: 'video-captions',
        severity: 'error',
        message: '视频缺少字幕',
        element,
        suggestion: '为视频添加字幕轨道',
        wcagReference: 'WCAG 1.2.2',
      });
    }
    
    return issues;
  };

  // 检查键盘导航
  private checkKeyboardNavigation = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    
    if (!interactiveElements.includes(element.tagName)) return issues;
    
    const tabIndex = element.getAttribute('tabindex');
    
    if (tabIndex && parseInt(tabIndex) > 0) {
      issues.push({
        ruleId: 'keyboard-navigation',
        severity: 'warning',
        message: '使用了正数tabindex',
        element,
        suggestion: '避免使用正数tabindex，使用0或-1',
        wcagReference: 'WCAG 2.1.1',
      });
    }
    
    return issues;
  };

  // 检查焦点指示器
  private checkFocusIndicators = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const focusableElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    
    if (!focusableElements.includes(element.tagName)) return issues;
    
    const computedStyle = window.getComputedStyle(element as HTMLElement, ':focus');
    const outline = computedStyle.outline;
    const outlineWidth = computedStyle.outlineWidth;
    
    if (outline === 'none' || outlineWidth === '0px') {
      issues.push({
        ruleId: 'focus-indicators',
        severity: 'error',
        message: '缺少焦点指示器',
        element,
        suggestion: '确保可聚焦元素有可见的焦点指示器',
        wcagReference: 'WCAG 2.4.7',
      });
    }
    
    return issues;
  };

  // 检查跳过链接
  private checkSkipLinks = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    const hasSkipToContent = Array.from(skipLinks).some(link => 
      link.textContent?.toLowerCase().includes('skip') ||
      link.textContent?.toLowerCase().includes('跳过')
    );
    
    if (!hasSkipToContent) {
      issues.push({
        ruleId: 'skip-links',
        severity: 'warning',
        message: '页面缺少跳过导航链接',
        element: document.body,
        suggestion: '在页面顶部添加跳过导航的链接',
        wcagReference: 'WCAG 2.4.1',
      });
    }
    
    return issues;
  };

  // 检查链接目的
  private checkLinkPurpose = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (element.tagName !== 'A') return issues;
    
    const link = element as HTMLAnchorElement;
    const text = link.textContent?.trim() || '';
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.title;
    
    const meaninglessTexts = ['click here', 'read more', '更多', '点击这里', 'here', '这里'];
    
    if (!ariaLabel && !title && meaninglessTexts.some(phrase => text.toLowerCase().includes(phrase))) {
      issues.push({
        ruleId: 'link-purpose',
        severity: 'warning',
        message: '链接文本不够描述性',
        element,
        suggestion: '使用更具描述性的链接文本或添加aria-label',
        wcagReference: 'WCAG 2.4.4',
      });
    }
    
    return issues;
  };

  // 检查页面语言
  private checkPageLanguage = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const html = document.documentElement;
    const lang = html.getAttribute('lang');
    
    if (!lang) {
      issues.push({
        ruleId: 'page-language',
        severity: 'error',
        message: 'HTML元素缺少lang属性',
        element: html,
        suggestion: '为html元素添加适当的lang属性',
        wcagReference: 'WCAG 3.1.1',
      });
    }
    
    return issues;
  };

  // 检查表单说明
  private checkFormInstructions = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) return issues;
    
    const input = element as HTMLInputElement;
    const required = input.hasAttribute('required');
    const type = input.type;
    
    if (required && !input.getAttribute('aria-describedby')) {
      const hasVisualIndicator = input.closest('label')?.textContent?.includes('*') ||
                                 input.nextElementSibling?.textContent?.includes('必填');
      
      if (!hasVisualIndicator) {
        issues.push({
          ruleId: 'form-instructions',
          severity: 'warning',
          message: '必填字段缺少明确指示',
          element,
          suggestion: '为必填字段添加可见的指示器和说明',
          wcagReference: 'WCAG 3.3.2',
        });
      }
    }
    
    return issues;
  };

  // 检查错误识别
  private checkErrorIdentification = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) return issues;
    
    const input = element as HTMLInputElement;
    const isInvalid = input.getAttribute('aria-invalid') === 'true';
    
    if (isInvalid) {
      const errorId = input.getAttribute('aria-describedby');
      const hasErrorMessage = errorId && document.getElementById(errorId);
      
      if (!hasErrorMessage) {
        issues.push({
          ruleId: 'error-identification',
          severity: 'error',
          message: '错误字段缺少错误消息',
          element,
          suggestion: '为无效字段提供具体的错误消息',
          wcagReference: 'WCAG 3.3.1',
        });
      }
    }
    
    return issues;
  };

  // 检查有效HTML
  private checkValidHTML = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    // 检查重复ID
    const id = element.id;
    if (id) {
      const elementsWithSameId = document.querySelectorAll(`#${id}`);
      if (elementsWithSameId.length > 1) {
        issues.push({
          ruleId: 'valid-html',
          severity: 'error',
          message: `重复的ID: ${id}`,
          element,
          suggestion: '确保页面中每个ID都是唯一的',
          wcagReference: 'WCAG 4.1.1',
        });
      }
    }
    
    return issues;
  };

  // 检查ARIA使用
  private checkAriaUsage = (element: Element): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const ariaAttributes = Array.from(element.attributes).filter(attr => 
      attr.name.startsWith('aria-')
    );
    
    ariaAttributes.forEach(attr => {
      // 检查aria-labelledby引用
      if (attr.name === 'aria-labelledby') {
        const ids = attr.value.split(' ');
        ids.forEach(id => {
          if (!document.getElementById(id)) {
            issues.push({
              ruleId: 'aria-usage',
              severity: 'error',
              message: `aria-labelledby引用了不存在的ID: ${id}`,
              element,
              suggestion: '确保aria-labelledby引用的元素存在',
              wcagReference: 'WCAG 4.1.2',
            });
          }
        });
      }
      
      // 检查aria-describedby引用
      if (attr.name === 'aria-describedby') {
        const ids = attr.value.split(' ');
        ids.forEach(id => {
          if (!document.getElementById(id)) {
            issues.push({
              ruleId: 'aria-usage',
              severity: 'error',
              message: `aria-describedby引用了不存在的ID: ${id}`,
              element,
              suggestion: '确保aria-describedby引用的元素存在',
              wcagReference: 'WCAG 4.1.2',
            });
          }
        });
      }
    });
    
    return issues;
  };

  // 检查页面地标
  private checkLandmarks = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const landmarks = {
      main: document.querySelector('main, [role="main"]'),
      navigation: document.querySelector('nav, [role="navigation"]'),
      banner: document.querySelector('header, [role="banner"]'),
      contentinfo: document.querySelector('footer, [role="contentinfo"]'),
    };
    
    Object.entries(landmarks).forEach(([landmark, element]) => {
      if (!element) {
        issues.push({
          ruleId: 'landmarks',
          severity: 'warning',
          message: `页面缺少${landmark}地标`,
          element: document.body,
          suggestion: `添加适当的${landmark}元素或role属性`,
          wcagReference: 'WCAG 1.3.1',
        });
      }
    });
    
    return issues;
  };

  // 执行可访问性检查
  public async checkAccessibility(container: Element = document.body): Promise<AccessibilityReport> {
    const allIssues: AccessibilityIssue[] = [];
    
    // 检查页面级规则
    const pageRules = ['skip-links', 'page-language', 'landmarks'];
    pageRules.forEach(ruleId => {
      const rule = this.rules.find(r => r.id === ruleId);
      if (rule) {
        allIssues.push(...rule.check(container));
      }
    });
    
    // 检查所有元素
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_ELEMENT,
      null
    );
    
    const elements: Element[] = [];
    let currentNode = walker.currentNode as Element;
    
    while (currentNode) {
      elements.push(currentNode);
      currentNode = walker.nextNode() as Element;
    }
    
    for (const element of elements) {
      for (const rule of this.rules) {
        if (!pageRules.includes(rule.id)) {
          const issues = rule.check(element);
          allIssues.push(...issues);
        }
      }
    }
    
    // 计算分数
    const errorCount = allIssues.filter(issue => issue.severity === 'error').length;
    const warningCount = allIssues.filter(issue => issue.severity === 'warning').length;
    const infoCount = allIssues.filter(issue => issue.severity === 'info').length;
    
    const score = Math.max(0, 100 - (errorCount * 10) - (warningCount * 5) - (infoCount * 1));
    
    return {
      summary: {
        totalIssues: allIssues.length,
        errors: errorCount,
        warnings: warningCount,
        infos: infoCount,
        score: Math.round(score),
      },
      issues: allIssues,
      timestamp: new Date(),
      url: window.location.href,
    };
  }

  // 生成报告
  public generateReport(report: AccessibilityReport): string {
    const { summary, issues } = report;
    
    let reportText = `可访问性检查报告\n`;
    reportText += `时间: ${report.timestamp.toLocaleString()}\n`;
    reportText += `URL: ${report.url}\n\n`;
    
    reportText += `总览:\n`;
    reportText += `- 总问题数: ${summary.totalIssues}\n`;
    reportText += `- 错误: ${summary.errors}\n`;
    reportText += `- 警告: ${summary.warnings}\n`;
    reportText += `- 信息: ${summary.infos}\n`;
    reportText += `- 得分: ${summary.score}/100\n\n`;
    
    if (issues.length > 0) {
      reportText += `问题详情:\n\n`;
      
      issues.forEach((issue, index) => {
        reportText += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.message}\n`;
        reportText += `   规则: ${issue.ruleId}\n`;
        if (issue.suggestion) {
          reportText += `   建议: ${issue.suggestion}\n`;
        }
        if (issue.wcagReference) {
          reportText += `   参考: ${issue.wcagReference}\n`;
        }
        reportText += `\n`;
      });
    }
    
    return reportText;
  }

  // 实时监控模式
  public startMonitoring(callback: (issues: AccessibilityIssue[]) => void): () => void {
    const observer = new MutationObserver(async (mutations) => {
      let hasChanges = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        const report = await this.checkAccessibility();
        callback(report.issues);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['alt', 'aria-label', 'aria-labelledby', 'aria-describedby', 'tabindex', 'lang'],
    });
    
    return () => observer.disconnect();
  }
}

// 创建全局WCAG检查器实例
export const wcagChecker = new WCAGChecker();

// 导出类和相关类型
export { WCAGChecker, type AccessibilityRule, type AccessibilityIssue, type AccessibilityReport };