export default function ManufacturingPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">🏭</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            制造业解决方案
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            智能制造与碳减排的深度融合
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">能效提升</h3>
            <p className="text-gray-600 mb-4">
              通过智能化改造提升生产能效
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 设备智能化升级</li>
              <li>• 能源管理系统</li>
              <li>• 工艺流程优化</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">清洁生产</h3>
            <p className="text-gray-600 mb-4">
              推进清洁生产技术和工艺应用
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 清洁生产审核</li>
              <li>• 循环经济模式</li>
              <li>• 废物资源化</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">绿色制造</h3>
            <p className="text-gray-600 mb-4">
              建设绿色工厂和绿色供应链
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 绿色工厂认证</li>
              <li>• 绿色产品设计</li>
              <li>• 绿色供应链管理</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">智能制造碳减排体系</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">数字化碳管理</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">实时碳排放监测</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">碳足迹自动核算</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">减排效果预测</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">智能优化系统</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">生产计划优化</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">能源调度优化</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">设备运行优化</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">行业细分解决方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">钢铁行业</h3>
              <p className="text-gray-600 text-sm mb-3">
                高耗能行业的深度脱碳解决方案
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 氢能炼钢技术</li>
                <li>• 余热回收利用</li>
                <li>• 碳捕集与利用</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">化工行业</h3>
              <p className="text-gray-600 text-sm mb-3">
                化工过程的绿色化改造
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 绿色催化技术</li>
                <li>• 生物基材料</li>
                <li>• 过程集成优化</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">电子制造</h3>
              <p className="text-gray-600 text-sm mb-3">
                电子产品制造的低碳化
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 清洁室节能</li>
                <li>• 半导体尾气处理</li>
                <li>• 产品生态设计</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">服务成效</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">30%</div>
              <div className="text-gray-600">平均能耗降低</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">25%</div>
              <div className="text-gray-600">生产效率提升</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">40%</div>
              <div className="text-gray-600">废料减少</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}