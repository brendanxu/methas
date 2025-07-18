export default function ServiceTypesPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            服务类型
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            四大核心服务，助力企业实现双碳目标
          </p>
        </div>

        {/* 2x2 网格布局 - 中央十字分割线 */}
        <div className="relative max-w-5xl mx-auto">
          {/* 中央分割线 */}
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300"></div>
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px bg-gray-300"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-300">
            {/* 碳资产管理 */}
            <div className="bg-white p-12 relative group hover:bg-gray-50 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">碳资产管理</h3>
              <p className="text-gray-600 mb-6">
                全方位碳资产管理服务，从核算到交易的完整解决方案
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• 碳足迹核算</li>
                <li>• 碳资产开发</li>
                <li>• 碳交易管理</li>
              </ul>
              <a href="/service-types/carbon-asset-management" className="text-green-600 font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>

            {/* 甲烷清除投资 - 突出显示 */}
            <div className="bg-white p-12 relative group hover:bg-gray-50 transition-colors">
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                重点服务
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">甲烷清除投资</h3>
              <p className="text-gray-600 mb-6">
                <span className="text-orange-600 font-semibold">减排效果是CO₂的25-84倍</span>
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• 煤矿甲烷捕集与利用</li>
                <li>• 油气田伴生气回收</li>
                <li>• 半导体制程尾气处理</li>
              </ul>
              <a href="/service-types/methane-removal-investment" className="text-green-600 font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>

            {/* ESG与碳咨询 */}
            <div className="bg-white p-12 relative group hover:bg-gray-50 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ESG与碳咨询</h3>
              <p className="text-gray-600 mb-6">
                专业的ESG管理和碳战略咨询服务
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• 双碳战略规划</li>
                <li>• ESG报告编制</li>
                <li>• 可持续发展咨询</li>
              </ul>
              <a href="/service-types/esg-carbon-consulting" className="text-green-600 font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>

            {/* 绿色供应链 */}
            <div className="bg-white p-12 relative group hover:bg-gray-50 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">绿色供应链</h3>
              <p className="text-gray-600 mb-6">
                端到端的供应链碳管理解决方案
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li>• 供应商碳管理</li>
                <li>• 产品碳足迹</li>
                <li>• 绿色采购体系</li>
              </ul>
              <a href="/service-types/green-supply-chain" className="text-green-600 font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}