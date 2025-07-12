'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Input, Tag, Divider, Empty, Spin, InputRef } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchOutlined,
  FileTextOutlined,
  BookOutlined,
  ToolOutlined,
  FolderOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { useSearch, SearchResultItem } from '@/hooks/useSearch';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

// 类型图标映射
const typeIcons: Record<string, React.ComponentType> = {
  page: FileTextOutlined,
  news: BookOutlined,
  service: ToolOutlined,
  case: FolderOutlined,
  resource: FolderOutlined,
};

// 类型标签颜色
const typeColors: Record<string, string> = {
  page: 'blue',
  news: 'green',
  service: 'orange',
  case: 'purple',
  resource: 'cyan',
};

// 类型中文名称
const typeNames: Record<string, string> = {
  page: '页面',
  news: '新闻',
  service: '服务',
  case: '案例',
  resource: '资源',
};

// 搜索建议项组件
const SuggestionItem: React.FC<{
  item: SearchResultItem;
  isActive: boolean;
  onClick: () => void;
  query: string;
}> = ({ item, isActive, onClick, query }) => {
  const IconComponent = typeIcons[item.type];

  return (
    <motion.div
      className={`p-3 cursor-pointer border-l-4 transition-all ${
        isActive 
          ? 'bg-primary/10 border-primary' 
          : 'bg-transparent border-transparent hover:bg-muted/50'
      }`}
      onClick={onClick}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
        }`}>
          {IconComponent && <IconComponent />}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 
              className="font-medium text-foreground truncate"
              dangerouslySetInnerHTML={{ 
                __html: item.title.replace(
                  new RegExp(`(${query})`, 'gi'), 
                  '<span class="text-primary font-semibold">$1</span>'
                )
              }}
            />
            <Tag color={typeColors[item.type]}>
              {typeNames[item.type]}
            </Tag>
          </div>
          
          <p 
            className="text-sm text-muted-foreground line-clamp-2"
            dangerouslySetInnerHTML={{ 
              __html: item.excerpt.replace(
                new RegExp(`(${query})`, 'gi'), 
                '<span class="text-primary">$1</span>'
              )
            }}
          />
          
          {/* 面包屑 */}
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            {item.breadcrumb.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                <span>{crumb}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 图片 */}
        {item.imageUrl && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 搜索历史组件
const SearchHistory: React.FC<{
  onSelectHistory: (query: string) => void;
}> = ({ onSelectHistory }) => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // 从本地存储加载搜索历史
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="p-4">
      <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <ClockCircleOutlined />
        最近搜索
      </h4>
      <div className="flex flex-wrap gap-2">
        {history.slice(0, 5).map((item, index) => (
          <Tag
            key={index}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onSelectHistory(item)}
          >
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
};

// 快捷提示组件
const SearchHints: React.FC = () => {
  
  return (
    <div className="p-4 border-t border-border">
      <div className="text-xs text-muted-foreground space-y-2">
        <div className="flex items-center justify-between">
          <span>按 ↑↓ 导航</span>
          <span>按 Enter 跳转</span>
        </div>
        <div className="flex items-center justify-between">
          <span>按 Esc 关闭</span>
          <span>按 Tab 查看全部结果</span>
        </div>
      </div>
    </div>
  );
};

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const inputRef = useRef<InputRef>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const {
    query,
    suggestions,
    loading,
    total,
    error,
    setQuery,
    clearSearch,
    navigateToSearch,
  } = useSearch();

  // 保存搜索历史
  const saveSearchHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const savedHistory = localStorage.getItem('search_history');
    let history: string[] = savedHistory ? JSON.parse(savedHistory) : [];
    
    // 移除重复项并添加到开头
    history = history.filter(item => item !== searchQuery);
    history.unshift(searchQuery);
    
    // 最多保存10个历史记录
    history = history.slice(0, 10);
    
    localStorage.setItem('search_history', JSON.stringify(history));
  }, []);

  // 处理搜索提交
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      saveSearchHistory(query.trim());
      navigateToSearch();
      onClose();
    }
  }, [query, saveSearchHistory, navigateToSearch, onClose]);

  // 处理建议项点击
  const handleSuggestionClick = useCallback((item: SearchResultItem) => {
    saveSearchHistory(query);
    window.open(item.url, '_self');
    onClose();
  }, [query, saveSearchHistory, onClose]);

  // 键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSuggestionClick(suggestions[activeIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Tab':
        if (query.trim()) {
          e.preventDefault();
          handleSearch();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [activeIndex, suggestions, handleSuggestionClick, handleSearch, onClose, query]);

  // 当模态框打开时自动聚焦
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 重置活动索引
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  // 清除搜索和关闭
  const handleClose = useCallback(() => {
    clearSearch();
    setActiveIndex(-1);
    onClose();
  }, [clearSearch, onClose]);

  const hasResults = suggestions.length > 0;
  const showEmpty = query.trim() && !loading && !hasResults && !error;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 720, top: 50 }}
      className="search-modal"
      closeIcon={<CloseOutlined />}
      destroyOnClose
    >
      <div className="relative">
        {/* 搜索输入框 */}
        <div className="sticky top-0 bg-background z-10 p-6 pb-0">
          <div className="relative">
            <SearchOutlined 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg" 
            />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索页面、新闻、服务或资源..."
              className="pl-12 pr-12 h-14 text-lg border-0 shadow-none"
              style={{
                borderRadius: '12px',
              }}
              suffix={
                query && (
                  <CloseOutlined
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setQuery('')}
                  />
                )
              }
            />
          </div>
          
          {/* 搜索状态 */}
          {query && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>
                {loading ? '搜索中...' : error ? (
                  <span className="text-red-500">搜索失败: {error}</span>
                ) : (
                  `找到 ${total} 条结果`
                )}
              </span>
              {total > 5 && !error && (
                <button
                  onClick={handleSearch}
                  className="text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  查看全部结果
                  <ArrowRightOutlined className="text-xs" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 搜索内容区域 */}
        <div className="max-h-96 overflow-y-auto">
          {!query && (
            <SearchHistory onSelectHistory={setQuery} />
          )}

          {loading && query && (
            <div className="flex items-center justify-center py-8">
              <Spin size="large" />
            </div>
          )}

          {error && query && (
            <div className="py-8 text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-red-500 mb-2">搜索出现问题</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {showEmpty && !error && (
            <div className="py-8">
              <Empty
                description="没有找到相关内容"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}

          {hasResults && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-4"
              >
                {/* 按类型分组显示 */}
                {Object.entries(
                  suggestions.reduce((groups: Record<string, SearchResultItem[]>, item) => {
                    if (!groups[item.type]) groups[item.type] = [];
                    groups[item.type].push(item);
                    return groups;
                  }, {})
                ).map(([type, items], groupIndex) => (
                  <div key={type}>
                    {groupIndex > 0 && <Divider className="my-2" />}
                    <div className="px-4 py-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {typeNames[type]} ({items.length})
                      </h4>
                    </div>
                    {items.map((item) => {
                      const globalIndex = suggestions.findIndex(s => s.id === item.id);
                      return (
                        <SuggestionItem
                          key={item.id}
                          item={item}
                          isActive={globalIndex === activeIndex}
                          onClick={() => handleSuggestionClick(item)}
                          query={query}
                        />
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* 底部提示 */}
        <SearchHints />
      </div>
    </Modal>
  );
};

export default SearchModal;