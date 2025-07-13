'use client';

interface AnnouncementOptions {
  priority?: 'polite' | 'assertive';
  delay?: number;
  clear?: boolean;
}

interface LiveRegionOptions {
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  busy?: boolean;
}

class ScreenReaderManager {
  private liveRegions: Map<string, HTMLElement> = new Map();
  private announceQueue: Array<{ message: string; options: AnnouncementOptions }> = [];
  private isProcessingQueue = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // 创建默认的实时区域
    this.createLiveRegion('polite', { 
      atomic: false, 
      relevant: 'all' 
    });
    this.createLiveRegion('assertive', { 
      atomic: true, 
      relevant: 'all' 
    });

    // 监听路由变化，宣布页面标题
    this.setupRouteChangeAnnouncements();
    
    // 监听焦点变化
    this.setupFocusAnnouncements();
  }

  // 创建实时区域
  createLiveRegion(
    id: string, 
    options: LiveRegionOptions = {},
    priority: 'polite' | 'assertive' = 'polite'
  ): HTMLElement {
    // 检查是否已存在
    if (this.liveRegions.has(id)) {
      return this.liveRegions.get(id)!;
    }

    const liveRegion = document.createElement('div');
    liveRegion.id = `live-region-${id}`;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', String(options.atomic || false));
    liveRegion.setAttribute('aria-relevant', options.relevant || 'all');
    
    if (options.busy) {
      liveRegion.setAttribute('aria-busy', 'true');
    }

    // 隐藏但保持可访问性
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.className = 'sr-only';

    document.body.appendChild(liveRegion);
    this.liveRegions.set(id, liveRegion);

    return liveRegion;
  }

  // 宣布消息
  announce(message: string, options: AnnouncementOptions = {}) {
    if (!message.trim()) return;

    const announcement = {
      message: message.trim(),
      options: {
        priority: 'polite',
        delay: 100,
        clear: false,
        ...options,
      },
    };

    this.announceQueue.push(announcement);
    this.processQueue();
  }

  // 处理宣布队列
  private async processQueue() {
    if (this.isProcessingQueue || this.announceQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.announceQueue.length > 0) {
      const { message, options } = this.announceQueue.shift()!;
      await this.performAnnouncement(message, options);
    }

    this.isProcessingQueue = false;
  }

  // 执行宣布
  private async performAnnouncement(message: string, options: AnnouncementOptions) {
    const regionId = options.priority || 'polite';
    const liveRegion = this.liveRegions.get(regionId);

    if (!liveRegion) {
      console.warn(`Live region "${regionId}" not found`);
      return;
    }

    // 清空区域（如果需要）
    if (options.clear) {
      liveRegion.textContent = '';
      await this.delay(50); // 短暂延迟确保清空被读取
    }

    // 延迟（确保屏幕阅读器准备好）
    if (options.delay && options.delay > 0) {
      await this.delay(options.delay);
    }

    // 设置消息
    liveRegion.textContent = message;

    // 记录到控制台（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Screen Reader] ${options.priority?.toUpperCase()}: ${message}`);
    }
  }

  // 宣布页面加载完成
  announcePageLoad(title: string, description?: string) {
    let message = `页面已加载: ${title}`;
    if (description) {
      message += `. ${description}`;
    }
    this.announce(message, { priority: 'polite', delay: 500 });
  }

  // 宣布导航变化
  announceNavigation(from: string, to: string) {
    this.announce(`已从 ${from} 导航到 ${to}`, { 
      priority: 'polite',
      clear: true 
    });
  }

  // 宣布表单错误
  announceFormError(fieldName: string, errorMessage: string) {
    this.announce(`${fieldName} 字段错误: ${errorMessage}`, { 
      priority: 'assertive',
      clear: true 
    });
  }

  // 宣布表单成功
  announceFormSuccess(message: string) {
    this.announce(`成功: ${message}`, { 
      priority: 'polite',
      delay: 200 
    });
  }

  // 宣布加载状态
  announceLoading(message: string = '正在加载') {
    this.announce(message, { priority: 'polite' });
  }

  // 宣布加载完成
  announceLoadingComplete(message: string = '加载完成') {
    this.announce(message, { priority: 'polite', delay: 300 });
  }

  // 宣布搜索结果
  announceSearchResults(count: number, query?: string) {
    let message = `找到 ${count} 个结果`;
    if (query) {
      message += ` 关于 "${query}"`;
    }
    this.announce(message, { priority: 'polite' });
  }

  // 宣布模态框打开
  announceModalOpen(title: string) {
    this.announce(`对话框已打开: ${title}`, { 
      priority: 'assertive',
      delay: 100 
    });
  }

  // 宣布模态框关闭
  announceModalClose() {
    this.announce('对话框已关闭', { 
      priority: 'polite',
      delay: 100 
    });
  }

  // 宣布表格信息
  announceTableInfo(rows: number, columns: number, caption?: string) {
    let message = `表格包含 ${rows} 行 ${columns} 列`;
    if (caption) {
      message = `${caption}. ${message}`;
    }
    this.announce(message, { priority: 'polite' });
  }

  // 宣布列表信息
  announceListInfo(itemCount: number, listType: 'ordered' | 'unordered' = 'unordered') {
    const typeText = listType === 'ordered' ? '有序' : '无序';
    this.announce(`${typeText}列表包含 ${itemCount} 项`, { priority: 'polite' });
  }

  // 设置元素的无障碍标签
  setAccessibleLabel(element: HTMLElement, label: string, description?: string) {
    // 设置aria-label
    element.setAttribute('aria-label', label);
    
    // 如果有描述，创建描述元素
    if (description) {
      const descId = `desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      let descElement = document.getElementById(descId);
      if (!descElement) {
        descElement = document.createElement('div');
        descElement.id = descId;
        descElement.className = 'sr-only';
        descElement.textContent = description;
        document.body.appendChild(descElement);
      }
      
      element.setAttribute('aria-describedby', descId);
    }
  }

  // 设置元素的扩展状态
  setExpandedState(element: HTMLElement, expanded: boolean) {
    element.setAttribute('aria-expanded', String(expanded));
    
    // 宣布状态变化
    const elementLabel = element.getAttribute('aria-label') || 
                        element.textContent?.trim() || 
                        '元素';
    
    const stateText = expanded ? '已展开' : '已折叠';
    this.announce(`${elementLabel} ${stateText}`, { priority: 'polite' });
  }

  // 设置元素的选中状态
  setSelectedState(element: HTMLElement, selected: boolean) {
    element.setAttribute('aria-selected', String(selected));
    
    if (selected) {
      const elementLabel = element.getAttribute('aria-label') || 
                          element.textContent?.trim() || 
                          '项目';
      this.announce(`已选择 ${elementLabel}`, { priority: 'polite' });
    }
  }

  // 设置元素的忙碌状态
  setBusyState(element: HTMLElement, busy: boolean, message?: string) {
    element.setAttribute('aria-busy', String(busy));
    
    if (busy && message) {
      this.announceLoading(message);
    } else if (!busy) {
      this.announceLoadingComplete();
    }
  }

  // 设置路由变化宣布
  private setupRouteChangeAnnouncements() {
    if (typeof window === 'undefined') return;

    // 监听popstate事件（浏览器前进后退）
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        const title = document.title || '未知页面';
        this.announcePageLoad(title);
      }, 100);
    });

    // 监听URL变化（单页应用路由）
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        setTimeout(() => {
          const title = document.title || '未知页面';
          this.announcePageLoad(title);
        }, 100);
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });
  }

  // 设置焦点变化宣布
  private setupFocusAnnouncements() {
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      
      // 检查是否有自定义焦点宣布
      const customAnnouncement = target.getAttribute('data-focus-announce');
      if (customAnnouncement) {
        this.announce(customAnnouncement, { priority: 'polite', delay: 100 });
      }
      
      // 检查是否是表单字段，宣布验证状态
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const isInvalid = target.getAttribute('aria-invalid') === 'true';
        if (isInvalid) {
          const errorMessage = target.getAttribute('aria-describedby');
          if (errorMessage) {
            const errorElement = document.getElementById(errorMessage);
            if (errorElement) {
              this.announce(`错误: ${errorElement.textContent}`, { 
                priority: 'assertive',
                delay: 200 
              });
            }
          }
        }
      }
    });
  }

  // 工具方法：延迟
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 清空所有实时区域
  clearAllRegions() {
    this.liveRegions.forEach(region => {
      region.textContent = '';
    });
  }

  // 销毁实例
  destroy() {
    // 移除实时区域
    this.liveRegions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });
    this.liveRegions.clear();
    
    // 清空队列
    this.announceQueue = [];
    this.isProcessingQueue = false;
  }
}

// 创建全局屏幕阅读器管理实例
export const screenReader = new ScreenReaderManager();

// 导出类和相关类型
export { ScreenReaderManager, type AnnouncementOptions, type LiveRegionOptions };