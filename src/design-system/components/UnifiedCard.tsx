/**
 * 统一的卡片组件
 * 替换所有重复的卡片实现，提供一致的API和样式
 */

'use client'

import React, { forwardRef, useMemo } from 'react'
import { Card as AntdCard } from 'antd'
import { CardProps } from '../component-interfaces'
import { DESIGN_TOKENS } from '../tokens'
import { cssVar } from '../css-generator'

// 卡片变体样式映射
const cardVariants = {
  default: {
    backgroundColor: cssVar('card'),
    borderColor: cssVar('border'),
    color: cssVar('card-foreground'),
    boxShadow: cssVar('shadows-sm'),
  },
  inner: {
    backgroundColor: cssVar('muted'),
    borderColor: 'transparent',
    color: cssVar('muted-foreground'),
    boxShadow: 'none',
  },
  meta: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: cssVar('foreground'),
    boxShadow: 'none',
  },
}

// 卡片尺寸映射
const cardSizes = {
  small: {
    padding: DESIGN_TOKENS.componentSizes.card.padding.small,
  },
  medium: {
    padding: DESIGN_TOKENS.componentSizes.card.padding.medium,
  },
  large: {
    padding: DESIGN_TOKENS.componentSizes.card.padding.large,
  },
}

// 统一卡片组件
export const UnifiedCard = forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    className = '',
    style,
    title,
    subtitle,
    extra,
    type = 'default',
    size = 'medium',
    hoverable = false,
    cover,
    actions,
    bordered = true,
    header,
    footer,
    loading = false,
    testId,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...rest
  }, ref) => {
    // 计算卡片样式
    const cardStyle = useMemo(() => {
      const variantStyle = cardVariants[type] || cardVariants.default
      const sizeStyle = cardSizes[size] || cardSizes.medium
      
      return {
        ...variantStyle,
        ...sizeStyle,
        borderRadius: cssVar('border-radius-lg'),
        border: bordered ? `1px solid ${cssVar('border')}` : 'none',
        transition: `all ${DESIGN_TOKENS.animations.duration.normal} ${DESIGN_TOKENS.animations.easing.easeInOut}`,
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        position: 'relative' as const,
        ...style,
      }
    }, [type, size, bordered, onClick, style])

    // 悬停效果
    const hoverStyle = useMemo(() => {
      if (!hoverable) return {}
      
      return {
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: cssVar('shadows-lg'),
          borderColor: cssVar('primary'),
        },
      }
    }, [hoverable])

    // 标题区域
    const titleNode = useMemo(() => {
      if (!title && !subtitle && !extra) return null
      
      return (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: subtitle ? DESIGN_TOKENS.spacing[1] : DESIGN_TOKENS.spacing[4],
        }}>
          <div>
            {title && (
              <div style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.lg,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                color: cssVar('card-foreground'),
                marginBottom: subtitle ? DESIGN_TOKENS.spacing[1] : 0,
              }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                color: cssVar('muted-foreground'),
                marginBottom: DESIGN_TOKENS.spacing[3],
              }}>
                {subtitle}
              </div>
            )}
          </div>
          {extra && (
            <div style={{
              flexShrink: 0,
              marginLeft: DESIGN_TOKENS.spacing[4],
            }}>
              {extra}
            </div>
          )}
        </div>
      )
    }, [title, subtitle, extra])

    // 操作区域
    const actionsNode = useMemo(() => {
      if (!actions || actions.length === 0) return null
      
      return (
        <div style={{
          display: 'flex',
          gap: DESIGN_TOKENS.spacing[2],
          marginTop: DESIGN_TOKENS.spacing[4],
          paddingTop: DESIGN_TOKENS.spacing[4],
          borderTop: `1px solid ${cssVar('border')}`,
        }}>
          {actions.map((action, index) => (
            <div key={index} style={{ flex: 1 }}>
              {action}
            </div>
          ))}
        </div>
      )
    }, [actions])

    // 使用 Ant Design Card 作为基础
    return (
      <AntdCard
        ref={ref}
        className={`unified-card unified-card--${type} unified-card--${size} ${className}`}
        style={cardStyle}
        title={titleNode}
        extra={extra}
        cover={cover}
        actions={actions}
        bordered={bordered}
        hoverable={hoverable}
        loading={loading}
        data-testid={testId}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...rest}
      >
        {header && (
          <div style={{
            marginBottom: DESIGN_TOKENS.spacing[4],
            paddingBottom: DESIGN_TOKENS.spacing[4],
            borderBottom: `1px solid ${cssVar('border')}`,
          }}>
            {header}
          </div>
        )}
        
        {children}
        
        {footer && (
          <div style={{
            marginTop: DESIGN_TOKENS.spacing[4],
            paddingTop: DESIGN_TOKENS.spacing[4],
            borderTop: `1px solid ${cssVar('border')}`,
          }}>
            {footer}
          </div>
        )}
        
        {actionsNode}
      </AntdCard>
    )
  }
)

UnifiedCard.displayName = 'UnifiedCard'

// 卡片组件变体
export const DefaultCard = forwardRef<HTMLDivElement, Omit<CardProps, 'type'>>(
  (props, ref) => <UnifiedCard ref={ref} type="default" {...props} />
)
DefaultCard.displayName = 'DefaultCard'

export const InnerCard = forwardRef<HTMLDivElement, Omit<CardProps, 'type'>>(
  (props, ref) => <UnifiedCard ref={ref} type="inner" {...props} />
)
InnerCard.displayName = 'InnerCard'

export const MetaCard = forwardRef<HTMLDivElement, Omit<CardProps, 'type'>>(
  (props, ref) => <UnifiedCard ref={ref} type="meta" {...props} />
)
MetaCard.displayName = 'MetaCard'

// 特殊用途卡片组件
export const ServiceCard = forwardRef<HTMLDivElement, CardProps & {
  icon?: React.ReactNode
  description?: string
  badge?: React.ReactNode
}>(
  ({ icon, description, badge, title, children, ...props }, ref) => (
    <UnifiedCard 
      ref={ref} 
      hoverable
      {...props}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: DESIGN_TOKENS.spacing[4],
      }}>
        {icon && (
          <div style={{
            fontSize: DESIGN_TOKENS.typography.fontSize['2xl'],
            color: cssVar('primary'),
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: DESIGN_TOKENS.spacing[2],
            marginBottom: DESIGN_TOKENS.spacing[2],
          }}>
            {title && (
              <h3 style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.lg,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                color: cssVar('card-foreground'),
                margin: 0,
              }}>
                {title}
              </h3>
            )}
            {badge}
          </div>
          {description && (
            <p style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              color: cssVar('muted-foreground'),
              margin: `0 0 ${DESIGN_TOKENS.spacing[3]} 0`,
            }}>
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </UnifiedCard>
  )
)
ServiceCard.displayName = 'ServiceCard'

export const NewsCard = forwardRef<HTMLDivElement, CardProps & {
  date?: string
  category?: string
  author?: string
  readTime?: string
}>(
  ({ date, category, author, readTime, title, children, ...props }, ref) => (
    <UnifiedCard 
      ref={ref} 
      hoverable
      {...props}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: DESIGN_TOKENS.spacing[2],
        marginBottom: DESIGN_TOKENS.spacing[3],
        fontSize: DESIGN_TOKENS.typography.fontSize.xs,
        color: cssVar('muted-foreground'),
      }}>
        {category && (
          <span style={{
            backgroundColor: cssVar('primary'),
            color: cssVar('white'),
            padding: `${DESIGN_TOKENS.spacing[1]} ${DESIGN_TOKENS.spacing[2]}`,
            borderRadius: cssVar('border-radius-sm'),
            fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
          }}>
            {category}
          </span>
        )}
        {date && <span>{date}</span>}
        {author && <span>by {author}</span>}
        {readTime && <span>{readTime} min read</span>}
      </div>
      
      {title && (
        <h3 style={{
          fontSize: DESIGN_TOKENS.typography.fontSize.lg,
          fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
          color: cssVar('card-foreground'),
          margin: `0 0 ${DESIGN_TOKENS.spacing[3]} 0`,
        }}>
          {title}
        </h3>
      )}
      
      {children}
    </UnifiedCard>
  )
)
NewsCard.displayName = 'NewsCard'

export const CaseCard = forwardRef<HTMLDivElement, CardProps & {
  company?: string
  industry?: string
  results?: React.ReactNode
}>(
  ({ company, industry, results, title, children, ...props }, ref) => (
    <UnifiedCard 
      ref={ref} 
      hoverable
      {...props}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: DESIGN_TOKENS.spacing[4],
      }}>
        <div>
          {company && (
            <div style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              color: cssVar('muted-foreground'),
              marginBottom: DESIGN_TOKENS.spacing[1],
            }}>
              {company}
            </div>
          )}
          {title && (
            <h3 style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.lg,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
              color: cssVar('card-foreground'),
              margin: 0,
            }}>
              {title}
            </h3>
          )}
          {industry && (
            <div style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              color: cssVar('muted-foreground'),
              marginTop: DESIGN_TOKENS.spacing[1],
            }}>
              {industry}
            </div>
          )}
        </div>
        {results && (
          <div style={{
            textAlign: 'right',
            flexShrink: 0,
            marginLeft: DESIGN_TOKENS.spacing[4],
          }}>
            {results}
          </div>
        )}
      </div>
      
      {children}
    </UnifiedCard>
  )
)
CaseCard.displayName = 'CaseCard'

// 卡片网格布局
export const CardGrid: React.FC<{
  children: React.ReactNode
  columns?: number
  gap?: number
  className?: string
}> = ({ 
  children, 
  columns = 3, 
  gap = 24, 
  className = '' 
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    width: '100%',
  }

  return (
    <div 
      className={`unified-card-grid ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  )
}

// 导出所有卡片组件
export {
  UnifiedCard as Card,
}

// 默认导出
export default UnifiedCard