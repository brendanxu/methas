'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SearchModal } from '@/components/ui/SearchModal';
import { trackClick } from '@/lib/analytics';

export const GlobalSearch: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 处理快捷键
  const handleKeydown = useCallback((event: KeyboardEvent) => {
    // Cmd/Ctrl + K 打开搜索
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setIsSearchOpen(true);
      trackClick('search_shortcut', { 
        shortcut: navigator.platform.includes('Mac') ? 'cmd+k' : 'ctrl+k' 
      });
    }
    
    // Escape 关闭搜索
    if (event.key === 'Escape' && isSearchOpen) {
      setIsSearchOpen(false);
    }
  }, [isSearchOpen]);

  // 注册全局快捷键监听
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  // 打开搜索
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    trackClick('search_button');
  }, []);

  // 关闭搜索
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <>
      {/* 搜索触发按钮（可由Header调用） */}
      <button
        onClick={openSearch}
        className="hidden"
        id="global-search-trigger"
        type="button"
        aria-label="打开搜索"
      />
      
      {/* 搜索模态框 */}
      <SearchModal
        open={isSearchOpen}
        onClose={closeSearch}
      />
    </>
  );
};

// 用于在其他组件中触发搜索的Hook
export const useGlobalSearch = () => {
  const openSearch = useCallback(() => {
    const trigger = document.getElementById('global-search-trigger');
    if (trigger) {
      trigger.click();
    }
  }, []);

  return { openSearch };
};

export default GlobalSearch;