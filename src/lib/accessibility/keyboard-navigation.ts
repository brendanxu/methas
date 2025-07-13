'use client';

interface NavigableElement extends HTMLElement {
  dataset: DOMStringMap & {
    tabOrder?: string;
    skipNavigation?: string;
    navigationGroup?: string;
  };
}

interface KeyboardNavigationConfig {
  enableTabTrap?: boolean;
  enableArrowKeys?: boolean;
  enableHomeEnd?: boolean;
  enableEscape?: boolean;
  customKeyHandlers?: Record<string, (event: KeyboardEvent, element: HTMLElement) => void>;
  focusableSelectors?: string[];
  skipSelectors?: string[];
}

class KeyboardNavigationManager {
  private config: KeyboardNavigationConfig;
  private activeContainer: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = -1;
  private tabTrapActive = false;

  constructor(config: KeyboardNavigationConfig = {}) {
    this.config = {
      enableTabTrap: true,
      enableArrowKeys: true,
      enableHomeEnd: true,
      enableEscape: true,
      focusableSelectors: [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[data-focusable="true"]',
      ],
      skipSelectors: [
        '[data-skip-navigation="true"]',
        '[aria-hidden="true"]',
        '.sr-only',
      ],
      ...config,
    };

    this.initialize();
  }

  private initialize() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    
    // 监听DOM变化，更新可聚焦元素
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'disabled', 'aria-hidden'],
    });
  }

  // 设置导航容器
  setNavigationContainer(container: HTMLElement | string) {
    const element = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container;
    
    if (!element) {
      console.warn('Navigation container not found');
      return;
    }

    this.activeContainer = element;
    this.updateFocusableElements();
  }

  // 更新可聚焦元素列表
  private updateFocusableElements() {
    if (!this.activeContainer) {
      this.activeContainer = document.body;
    }

    const selectors = this.config.focusableSelectors!.join(',');
    const elements = Array.from(this.activeContainer.querySelectorAll(selectors)) as HTMLElement[];
    
    this.focusableElements = elements.filter(element => {
      // 跳过不可见或被跳过的元素
      if (!this.isVisible(element) || this.shouldSkip(element)) {
        return false;
      }
      
      return true;
    });

    // 按tab-order排序
    this.focusableElements.sort((a, b) => {
      const aOrder = parseInt((a as NavigableElement).dataset.tabOrder || '0');
      const bOrder = parseInt((b as NavigableElement).dataset.tabOrder || '0');
      return aOrder - bOrder;
    });
  }

  // 检查元素是否可见
  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetParent !== null
    );
  }

  // 检查是否应该跳过元素
  private shouldSkip(element: HTMLElement): boolean {
    return this.config.skipSelectors!.some(selector => {
      try {
        return element.matches(selector);
      } catch {
        return false;
      }
    });
  }

  // 主键盘事件处理器
  private handleKeyDown(event: KeyboardEvent) {
    const { key, ctrlKey, altKey, shiftKey } = event;
    
    // 检查自定义键处理器
    if (this.config.customKeyHandlers) {
      const handler = this.config.customKeyHandlers[key];
      if (handler) {
        handler(event, event.target as HTMLElement);
        return;
      }
    }

    switch (key) {
      case 'Tab':
        if (this.config.enableTabTrap && this.tabTrapActive) {
          this.handleTabTrap(event);
        }
        break;
        
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (this.config.enableArrowKeys) {
          this.handleArrowKeys(event);
        }
        break;
        
      case 'Home':
      case 'End':
        if (this.config.enableHomeEnd) {
          this.handleHomeEnd(event);
        }
        break;
        
      case 'Escape':
        if (this.config.enableEscape) {
          this.handleEscape(event);
        }
        break;
        
      case 'Enter':
      case ' ':
        this.handleActivation(event);
        break;
    }
  }

  // 处理焦点进入事件
  private handleFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement;
    this.currentFocusIndex = this.focusableElements.indexOf(target);
    
    // 触发自定义焦点事件
    this.triggerFocusEvent(target, 'focus-enter');
  }

  // Tab陷阱处理
  private handleTabTrap(event: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;

    event.preventDefault();
    
    const isShiftTab = event.shiftKey;
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    if (isShiftTab) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
      } else {
        this.focusPreviousElement();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
      } else {
        this.focusNextElement();
      }
    }
  }

  // 箭头键处理
  private handleArrowKeys(event: KeyboardEvent) {
    const target = event.target as NavigableElement;
    const navigationGroup = target.dataset.navigationGroup;
    
    // 如果元素属于导航组，只在组内导航
    if (navigationGroup) {
      this.handleGroupNavigation(event, navigationGroup);
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.focusPreviousElement();
        break;
        
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.focusNextElement();
        break;
    }
  }

  // 组内导航处理
  private handleGroupNavigation(event: KeyboardEvent, groupName: string) {
    const groupElements = this.focusableElements.filter(el => 
      (el as NavigableElement).dataset.navigationGroup === groupName
    );
    
    if (groupElements.length === 0) return;

    const currentIndex = groupElements.indexOf(event.target as HTMLElement);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : groupElements.length - 1;
        break;
        
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = currentIndex < groupElements.length - 1 ? currentIndex + 1 : 0;
        break;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      groupElements[nextIndex].focus();
    }
  }

  // Home/End键处理
  private handleHomeEnd(event: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;

    event.preventDefault();
    
    if (event.key === 'Home') {
      this.focusableElements[0].focus();
    } else {
      this.focusableElements[this.focusableElements.length - 1].focus();
    }
  }

  // Escape键处理
  private handleEscape(event: KeyboardEvent) {
    // 关闭模态框或下拉菜单
    const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement;
    if (activeModal) {
      this.triggerCustomEvent(activeModal, 'keyboard-escape');
      return;
    }

    // 返回上级焦点
    const parentFocusable = this.findParentFocusable(event.target as HTMLElement);
    if (parentFocusable) {
      parentFocusable.focus();
    }
  }

  // 激活处理（Enter/Space）
  private handleActivation(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    
    // 如果是按钮或链接，触发点击
    if (target.tagName === 'BUTTON' || target.tagName === 'A') {
      if (event.key === ' ') {
        event.preventDefault();
        target.click();
      }
    }
    
    // 如果有自定义激活行为
    if (target.hasAttribute('data-keyboard-activate')) {
      event.preventDefault();
      this.triggerCustomEvent(target, 'keyboard-activate');
    }
  }

  // 聚焦下一个元素
  private focusNextElement() {
    if (this.currentFocusIndex < this.focusableElements.length - 1) {
      this.focusableElements[this.currentFocusIndex + 1].focus();
    } else if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  // 聚焦上一个元素
  private focusPreviousElement() {
    if (this.currentFocusIndex > 0) {
      this.focusableElements[this.currentFocusIndex - 1].focus();
    } else if (this.focusableElements.length > 0) {
      this.focusableElements[this.focusableElements.length - 1].focus();
    }
  }

  // 查找父级可聚焦元素
  private findParentFocusable(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;
    
    while (parent) {
      if (this.focusableElements.includes(parent)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    
    return null;
  }

  // 触发自定义事件
  private triggerCustomEvent(element: HTMLElement, eventType: string, detail?: any) {
    const event = new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
      detail,
    });
    element.dispatchEvent(event);
  }

  // 触发焦点事件
  private triggerFocusEvent(element: HTMLElement, eventType: string) {
    this.triggerCustomEvent(element, eventType, {
      element,
      focusIndex: this.currentFocusIndex,
      totalElements: this.focusableElements.length,
    });
  }

  // 公共API方法
  
  // 启用Tab陷阱
  enableTabTrap(container?: HTMLElement | string) {
    if (container) {
      this.setNavigationContainer(container);
    }
    this.tabTrapActive = true;
    this.updateFocusableElements();
  }

  // 禁用Tab陷阱
  disableTabTrap() {
    this.tabTrapActive = false;
  }

  // 聚焦第一个元素
  focusFirst() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  // 聚焦最后一个元素
  focusLast() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[this.focusableElements.length - 1].focus();
    }
  }

  // 聚焦指定索引的元素
  focusElementAt(index: number) {
    if (index >= 0 && index < this.focusableElements.length) {
      this.focusableElements[index].focus();
    }
  }

  // 获取当前焦点索引
  getCurrentFocusIndex(): number {
    return this.currentFocusIndex;
  }

  // 获取可聚焦元素总数
  getFocusableElementsCount(): number {
    return this.focusableElements.length;
  }

  // 销毁实例
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('focusin', this.handleFocusIn.bind(this));
  }
}

// 创建全局键盘导航实例
export const keyboardNavigation = new KeyboardNavigationManager();

// 导出类和相关类型
export { KeyboardNavigationManager, type KeyboardNavigationConfig, type NavigableElement };