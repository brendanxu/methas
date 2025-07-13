'use client';

interface FocusableElement extends HTMLElement {
  focus(): void;
}

interface FocusTrapOptions {
  initialFocus?: HTMLElement | string;
  returnFocus?: boolean;
  allowClickOutside?: boolean;
  escapeDeactivates?: boolean;
}

interface FocusStack {
  element: HTMLElement;
  previousFocus?: Element | null;
  restoreFocus?: boolean;
}

class FocusManager {
  private focusStack: FocusStack[] = [];
  private activeTrap: FocusTrap | null = null;
  private observers: Map<Element, MutationObserver> = new Map();

  // 保存当前焦点
  saveFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  }

  // 恢复焦点
  restoreFocus(element?: HTMLElement | null): boolean {
    const targetElement = element || this.getLastSavedFocus();
    
    if (targetElement && this.isFocusable(targetElement)) {
      try {
        targetElement.focus();
        return true;
      } catch (error) {
        console.warn('Failed to restore focus:', error);
      }
    }
    
    return false;
  }

  // 获取最后保存的焦点
  private getLastSavedFocus(): HTMLElement | null {
    if (this.focusStack.length > 0) {
      const lastItem = this.focusStack[this.focusStack.length - 1];
      return lastItem.previousFocus as HTMLElement;
    }
    return null;
  }

  // 推入焦点栈
  pushFocus(element: HTMLElement, options: { restoreFocus?: boolean } = {}): void {
    const previousFocus = this.saveFocus();
    
    this.focusStack.push({
      element,
      previousFocus,
      restoreFocus: options.restoreFocus !== false,
    });
  }

  // 弹出焦点栈
  popFocus(): boolean {
    const item = this.focusStack.pop();
    
    if (item && item.restoreFocus && item.previousFocus) {
      return this.restoreFocus(item.previousFocus as HTMLElement);
    }
    
    return false;
  }

  // 检查元素是否可聚焦
  isFocusable(element: HTMLElement): boolean {
    if (!element || element.getAttribute('tabindex') === '-1') {
      return false;
    }

    // 检查元素是否可见
    if (!this.isVisible(element)) {
      return false;
    }

    // 检查元素是否被禁用
    if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
      return false;
    }

    // 检查常见的可聚焦元素
    const focusableSelectors = [
      'a[href]',
      'button',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];

    return focusableSelectors.some(selector => {
      try {
        return element.matches(selector);
      } catch {
        return false;
      }
    });
  }

  // 检查元素是否可见
  private isVisible(element: HTMLElement): boolean {
    if (!element.offsetParent && element.tagName !== 'BODY') {
      return false;
    }

    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity) > 0
    );
  }

  // 获取容器内所有可聚焦元素
  getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'object',
      'embed',
      'area[href]',
      'summary',
    ].join(',');

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
    
    return elements.filter(element => this.isFocusable(element));
  }

  // 聚焦到第一个可聚焦元素
  focusFirst(container?: HTMLElement): boolean {
    const elements = this.getFocusableElements(container);
    if (elements.length > 0) {
      elements[0].focus();
      return true;
    }
    return false;
  }

  // 聚焦到最后一个可聚焦元素
  focusLast(container?: HTMLElement): boolean {
    const elements = this.getFocusableElements(container);
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
      return true;
    }
    return false;
  }

  // 创建焦点陷阱
  createTrap(container: HTMLElement, options: FocusTrapOptions = {}): FocusTrap {
    if (this.activeTrap) {
      this.activeTrap.deactivate();
    }

    this.activeTrap = new FocusTrap(container, options, this);
    return this.activeTrap;
  }

  // 移除焦点陷阱
  removeTrap(): void {
    if (this.activeTrap) {
      this.activeTrap.deactivate();
      this.activeTrap = null;
    }
  }

  // 监听元素的焦点变化
  observeFocus(element: Element, callback: (hasFocus: boolean) => void): () => void {
    let hasFocus = element.contains(document.activeElement);

    const checkFocus = () => {
      const newHasFocus = element.contains(document.activeElement);
      if (newHasFocus !== hasFocus) {
        hasFocus = newHasFocus;
        callback(hasFocus);
      }
    };

    document.addEventListener('focusin', checkFocus);
    document.addEventListener('focusout', checkFocus);

    // 返回清理函数
    return () => {
      document.removeEventListener('focusin', checkFocus);
      document.removeEventListener('focusout', checkFocus);
    };
  }

  // 智能聚焦（尝试多种聚焦策略）
  smartFocus(element: HTMLElement | string): boolean {
    const targetElement = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element;

    if (!targetElement) {
      return false;
    }

    // 策略1：直接聚焦
    if (this.isFocusable(targetElement)) {
      targetElement.focus();
      return document.activeElement === targetElement;
    }

    // 策略2：聚焦第一个子元素
    const firstFocusable = this.getFocusableElements(targetElement)[0];
    if (firstFocusable) {
      firstFocusable.focus();
      return document.activeElement === firstFocusable;
    }

    // 策略3：添加tabindex并聚焦
    if (!targetElement.hasAttribute('tabindex')) {
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();
      return document.activeElement === targetElement;
    }

    return false;
  }

  // 设置焦点指示器样式
  setupFocusIndicator(): void {
    // 添加全局CSS样式
    const style = document.createElement('style');
    style.textContent = `
      /* 高对比度焦点指示器 */
      :focus {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }

      /* 自定义焦点样式 */
      .focus-visible:focus,
      .focus-within:focus-within {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(0, 95, 204, 0.1) !important;
      }

      /* 跳过链接 */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        z-index: 100000;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
      }

      .skip-link:focus {
        top: 0;
      }
    `;
    
    document.head.appendChild(style);
  }

  // 创建跳过导航链接
  createSkipLinks(): void {
    const skipLinks = [
      { href: '#main-content', text: '跳到主要内容' },
      { href: '#navigation', text: '跳到导航菜单' },
      { href: '#footer', text: '跳到页脚' },
    ];

    const container = document.createElement('div');
    container.setAttribute('aria-label', '快速导航');

    skipLinks.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      a.className = 'skip-link';
      container.appendChild(a);
    });

    document.body.insertBefore(container, document.body.firstChild);
  }

  // 销毁管理器
  destroy(): void {
    this.removeTrap();
    this.focusStack = [];
    
    // 清理观察器
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// 焦点陷阱类
class FocusTrap {
  private container: HTMLElement;
  private options: FocusTrapOptions;
  private focusManager: FocusManager;
  private focusableElements: HTMLElement[] = [];
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;
  private previousFocus: Element | null = null;
  private isActive = false;

  constructor(container: HTMLElement, options: FocusTrapOptions, focusManager: FocusManager) {
    this.container = container;
    this.options = { escapeDeactivates: true, ...options };
    this.focusManager = focusManager;
    
    this.activate();
  }

  activate(): void {
    if (this.isActive) return;

    this.previousFocus = document.activeElement;
    this.updateFocusableElements();
    this.addEventListeners();
    
    // 设置初始焦点
    this.setInitialFocus();
    
    this.isActive = true;
  }

  deactivate(): void {
    if (!this.isActive) return;

    this.removeEventListeners();
    
    // 恢复之前的焦点
    if (this.options.returnFocus !== false && this.previousFocus) {
      this.focusManager.restoreFocus(this.previousFocus as HTMLElement);
    }
    
    this.isActive = false;
  }

  private updateFocusableElements(): void {
    this.focusableElements = this.focusManager.getFocusableElements(this.container);
    this.firstFocusable = this.focusableElements[0] || null;
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  private setInitialFocus(): void {
    let initialElement: HTMLElement | null = null;

    // 检查选项中的初始焦点
    if (this.options.initialFocus) {
      if (typeof this.options.initialFocus === 'string') {
        initialElement = this.container.querySelector(this.options.initialFocus);
      } else {
        initialElement = this.options.initialFocus;
      }
    }

    // 如果没有指定或找到初始焦点元素，使用第一个可聚焦元素
    if (!initialElement || !this.focusManager.isFocusable(initialElement)) {
      initialElement = this.firstFocusable;
    }

    if (initialElement) {
      initialElement.focus();
    }
  }

  private addEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('focusin', this.handleFocusIn);
    
    if (this.options.allowClickOutside !== true) {
      document.addEventListener('mousedown', this.handleMouseDown);
    }
  }

  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('mousedown', this.handleMouseDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      this.handleTabKey(event);
    } else if (event.key === 'Escape' && this.options.escapeDeactivates) {
      event.preventDefault();
      this.deactivate();
    }
  };

  private handleTabKey(event: KeyboardEvent): void {
    if (!this.firstFocusable || !this.lastFocusable) return;

    const isShiftTab = event.shiftKey;

    if (isShiftTab) {
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }

  private handleFocusIn = (event: FocusEvent): void => {
    if (!this.container.contains(event.target as Node)) {
      event.preventDefault();
      
      // 尝试将焦点返回到容器内的第一个可聚焦元素
      if (this.firstFocusable) {
        this.firstFocusable.focus();
      }
    }
  };

  private handleMouseDown = (event: MouseEvent): void => {
    if (!this.container.contains(event.target as Node)) {
      event.preventDefault();
    }
  };
}

// 创建全局焦点管理实例
export const focusManager = new FocusManager();

// 导出类和类型
export { FocusManager, FocusTrap, type FocusTrapOptions, type FocusableElement };