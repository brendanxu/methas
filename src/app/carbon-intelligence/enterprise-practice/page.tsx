export default function EnterprisePracticePage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            企业实践
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            各行业碳管理实践案例深度解析
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">能源行业案例</h3>
            <p className="text-gray-600 text-sm">
              传统能源企业的低碳转型实践
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🏭</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">制造业案例</h3>
            <p className="text-gray-600 text-sm">
              智能制造与碳减排的融合
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">零售业案例</h3>
            <p className="text-gray-600 text-sm">
              供应链碳中和的最佳实践
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">🏦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">金融业案例</h3>
            <p className="text-gray-600 text-sm">
              ESG投资的创新模式
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-semibold">能源行业</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">某大型石油公司的甲烷减排实践</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  该公司通过实施全面的甲烷减排计划，在三年内实现了显著的温室气体减排效果。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">实施LDAR技术检测泄漏</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">建设火炬气回收系统</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">优化生产工艺流程</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">关键数据</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">甲烷减排量</span>
                    <span className="font-semibold text-green-600">30,000吨CO₂当量</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">投资回报期</span>
                    <span className="font-semibold">2.5年</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">年度节约成本</span>
                    <span className="font-semibold">1200万元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-600 font-semibold">制造业</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">钢铁企业的数字化碳管理</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  通过建设数字化碳管理平台，实现了生产过程的精准碳核算和优化控制。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">实时碳排放监测</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">智能能源调度</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">工艺参数优化</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">关键数据</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">能耗降低</span>
                    <span className="font-semibold text-blue-600">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">碳强度下降</span>
                    <span className="font-semibold text-blue-600">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">年度减排量</span>
                    <span className="font-semibold text-blue-600">50,000吨CO₂</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-orange-600 font-semibold">零售业</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">连锁超市的供应链碳中和</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  通过供应链协同减排，实现了全链条的碳中和目标。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">500+供应商参与</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">绿色物流网络</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">门店节能改造</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">关键数据</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">供应链减排</span>
                    <span className="font-semibold text-orange-600">22,000吨CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">覆盖门店</span>
                    <span className="font-semibold text-orange-600">500+家</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">成本节约</span>
                    <span className="font-semibold text-orange-600">2000万元/年</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">实践启示</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">成功要素</h3>
              <p className="text-gray-600">高层承诺、全员参与、技术创新、数据驱动</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">关键挑战</h3>
              <p className="text-gray-600">初期投资、技术选择、人才培养、供应链协同</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}