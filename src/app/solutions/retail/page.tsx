export default function RetailPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-600 text-2xl">🛒</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            零售业解决方案
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            供应链碳中和计划的全面实施
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">供应链管理</h3>
            <p className="text-gray-600 mb-4">
              建立低碳供应链管理体系
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 供应商碳足迹评估</li>
              <li>• 绿色采购标准</li>
              <li>• 供应链协同减排</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">门店运营</h3>
            <p className="text-gray-600 mb-4">
              零售门店的节能减排改造
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 智能照明系统</li>
              <li>• 制冷设备优化</li>
              <li>• 可再生能源应用</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">物流优化</h3>
            <p className="text-gray-600 mb-4">
              绿色物流和配送体系建设
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 路径优化算法</li>
              <li>• 新能源车辆</li>
              <li>• 包装材料优化</li>
            </ul>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">零售业碳中和路径</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">直接排放（范围1）</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">门店燃料使用</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">配送车辆排放</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">制冷剂泄漏</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">间接排放（范围2&3）</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">门店用电排放</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">供应链排放</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">产品生命周期</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">成功案例：大型零售连锁</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">项目概况</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">覆盖门店</span>
                  <span className="font-semibold">500+家</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">供应商数量</span>
                  <span className="font-semibold">200+家</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">项目周期</span>
                  <span className="font-semibold">24个月</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">投资金额</span>
                  <span className="font-semibold">5000万元</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">减排成果</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-2">22,000</div>
                <div className="text-gray-600">吨CO₂减排量</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>供应链优化</span>
                  <span className="font-semibold">15,000吨</span>
                </div>
                <div className="flex justify-between">
                  <span>门店节能</span>
                  <span className="font-semibold">4,500吨</span>
                </div>
                <div className="flex justify-between">
                  <span>物流优化</span>
                  <span className="font-semibold">2,500吨</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">客户收益</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">成本节约</h3>
              <p className="text-gray-600">年度运营成本降低15%，能源成本节约2000万元</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">品牌价值</h3>
              <p className="text-gray-600">绿色品牌形象提升，消费者满意度提高20%</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">合规优势</h3>
              <p className="text-gray-600">率先达到碳中和目标，获得政府政策支持</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">竞争优势</h3>
              <p className="text-gray-600">建立可持续发展竞争壁垒，引领行业变革</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}