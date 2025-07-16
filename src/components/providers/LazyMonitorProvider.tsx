/**
 * 懒加载监控提供者
 * 替代原有的直接导入所有监控组件的方式
 */

'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { lazyMonitorManager, corePerformanceMonitor, LazyMonitorComponents } from '@/lib/monitoring/lazy-monitor'
import type { LazyMonitorComponent } from '@/lib/monitoring/lazy-monitor'

interface LazyMonitorProviderProps {
  children: React.ReactNode
  enabledComponents?: string[]
  debugMode?: boolean
}

export function LazyMonitorProvider({ 
  children, 
  enabledComponents = ['performance', 'errors'],
  debugMode = false 
}: LazyMonitorProviderProps) {
  const pathname = usePathname()
  const [loadedComponents, setLoadedComponents] = useState<Map<string, LazyMonitorComponent>>(new Map())
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化核心监控
  useEffect(() => {
    if (!isInitialized) {
      // 启动核心性能监控
      corePerformanceMonitor.init()
      
      // 加载高优先级组件
      lazyMonitorManager.loadHighPriorityComponents().then(() => {
        if (debugMode) {
          console.log('[LazyMonitorProvider] High priority components loaded')
        }
      })
      
      setIsInitialized(true)
    }
  }, [isInitialized, debugMode])

  // 路径变化时加载相关组件
  useEffect(() => {
    if (pathname) {
      lazyMonitorManager.loadForRoute(pathname)
      
      // 如果在管理员页面，加载性能监控UI
      if (pathname.startsWith('/admin')) {
        loadComponentIfNeeded('widget')
      }
    }
  }, [pathname])

  // 根据需要加载组件
  const loadComponentIfNeeded = async (componentName: string) => {
    if (!enabledComponents.includes(componentName)) return

    try {
      const component = await lazyMonitorManager.loadMonitorComponent(
        componentName as keyof typeof LazyMonitorComponents
      )
      
      if (component) {
        setLoadedComponents(prev => new Map(prev).set(componentName, component))
        
        if (debugMode) {
          console.log(`[LazyMonitorProvider] Loaded component: ${componentName}`)
        }
      }
    } catch (error) {
      console.warn(`[LazyMonitorProvider] Failed to load ${componentName}:`, error)
    }
  }

  // 条件性加载组件
  useEffect(() => {
    // 根据用户交互加载监控组件
    const handleUserInteraction = () => {
      // 用户首次交互后加载资源监控
      if (enabledComponents.includes('resources')) {
        loadComponentIfNeeded('resources')
      }
    }

    // 监听首次用户交互
    const interactionEvents = ['click', 'touchstart', 'keydown']
    const handleFirstInteraction = () => {
      handleUserInteraction()
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction)
      })
    }

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true })
    })

    return () => {
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction)
      })
    }
  }, [enabledComponents])

  // 网络状态监控
  useEffect(() => {
    // 在良好网络条件下加载额外监控组件
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      if (connection && connection.effectiveType === '4g') {
        setTimeout(() => {
          loadComponentIfNeeded('analytics')
        }, 3000)
      }
    }
  }, [])

  return (
    <>
      {children}
      
      {/* 渲染懒加载的监控组件 */}
      {Array.from(loadedComponents.entries()).map(([name, Component]) => (
        <Suspense key={name} fallback={null}>
          <Component />
        </Suspense>
      ))}
      
      {/* 开发模式调试信息 */}
      {debugMode && process.env.NODE_ENV === 'development' && (
        <MonitorDebugInfo 
          loadedComponents={Array.from(loadedComponents.keys())}
          pathname={pathname}
        />
      )}
    </>
  )
}

// 调试信息组件
function MonitorDebugInfo({ 
  loadedComponents, 
  pathname 
}: { 
  loadedComponents: string[]
  pathname: string 
}) {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        loadedComponents: loadedComponents.length,
        components: loadedComponents,
        pathname,
        coreMetrics: corePerformanceMonitor.getMetrics().size
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 2000)
    return () => clearInterval(interval)
  }, [loadedComponents, pathname])

  if (!metrics) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}
    >
      <div>🔍 Monitor Debug</div>
      <div>Loaded: {metrics.loadedComponents}</div>
      <div>Components: {metrics.components.join(', ')}</div>
      <div>Metrics: {metrics.coreMetrics}</div>
      <div>Route: {metrics.pathname}</div>
    </div>
  )
}

// 监控状态钩子
export function useMonitorStatus() {
  const [status, setStatus] = useState({
    isInitialized: false,
    loadedComponents: [] as string[],
    coreMetrics: 0
  })

  useEffect(() => {
    const updateStatus = () => {
      setStatus({
        isInitialized: true,
        loadedComponents: lazyMonitorManager.getLoadedComponents(),
        coreMetrics: corePerformanceMonitor.getMetrics().size
      })
    }

    updateStatus()
    const interval = setInterval(updateStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  return status
}

// 性能监控钩子
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Map<string, any>>(new Map())

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(new Map(corePerformanceMonitor.getMetrics()))
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 1000)
    return () => clearInterval(interval)
  }, [])

  return metrics
}

// 条件性监控组件
export function ConditionalMonitorWidget({ 
  condition, 
  component: componentName 
}: { 
  condition: boolean
  component: keyof typeof LazyMonitorComponents 
}) {
  const [Component, setComponent] = useState<LazyMonitorComponent | null>(null)

  useEffect(() => {
    if (condition) {
      lazyMonitorManager.loadMonitorComponent(componentName)
        .then(comp => setComponent(comp))
        .catch(error => console.warn('Failed to load conditional component:', error))
    }
  }, [condition, componentName])

  if (!Component) return null

  return (
    <Suspense fallback={<div>Loading monitor...</div>}>
      <Component />
    </Suspense>
  )
}

export default LazyMonitorProvider