export default function CarbonIntelligencePage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            碳智观察
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            深度洞察碳管理实践，引领双碳发展趋势
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-green-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🏢</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">企业实践</h3>
            <p className="text-gray-600 text-sm mb-4">
              各行业碳管理实践案例
            </p>
            <a href="/carbon-intelligence/enterprise-practice" className="text-green-600 text-sm font-medium hover:text-green-700">
              查看更多 →
            </a>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">行业洞察</h3>
            <p className="text-gray-600 text-sm mb-4">
              政策解读、市场分析、趋势预测
            </p>
            <a href="/carbon-intelligence/industry-insights" className="text-green-600 text-sm font-medium hover:text-green-700">
              查看更多 →
            </a>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">🔬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">技术前沿</h3>
            <p className="text-gray-600 text-sm mb-4">
              碳管理技术、创新解决方案
            </p>
            <a href="/carbon-intelligence/technology-frontier" className="text-green-600 text-sm font-medium hover:text-green-700">
              查看更多 →
            </a>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">碳智报告</h3>
            <p className="text-gray-600 text-sm mb-4">
              研究报告与白皮书下载
            </p>
            <a href="/carbon-intelligence/reports" className="text-green-600 text-sm font-medium hover:text-green-700">
              查看更多 →
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">最新观察</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="text-sm text-green-600 mb-2">企业实践</div>
              <h3 className="font-semibold text-gray-900 mb-2">某制造业巨头的碳中和之路</h3>
              <p className="text-gray-600 text-sm mb-4">
                深度解析制造业企业如何通过技术创新实现碳中和目标
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">2024-01-15</span>
                <span className="text-green-600 text-xs">阅读更多</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="text-sm text-blue-600 mb-2">行业洞察</div>
              <h3 className="font-semibold text-gray-900 mb-2">2024年碳市场发展趋势</h3>
              <p className="text-gray-600 text-sm mb-4">
                分析全球碳市场最新动态和未来发展方向
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">2024-01-10</span>
                <span className="text-green-600 text-xs">阅读更多</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="text-sm text-purple-600 mb-2">技术前沿</div>
              <h3 className="font-semibold text-gray-900 mb-2">甲烷减排技术突破</h3>
              <p className="text-gray-600 text-sm mb-4">
                最新甲烷检测和减排技术的应用前景
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">2024-01-08</span>
                <span className="text-green-600 text-xs">阅读更多</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">知识支撑体系</h2>
            <p className="text-gray-600 mb-8">
              为服务类型和解决方案提供专业知识支撑
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">💡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">理论研究</h3>
                <p className="text-gray-600 text-sm">深入的理论分析和研究</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">📈</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">数据分析</h3>
                <p className="text-gray-600 text-sm">基于数据的深度分析</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl">🔮</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">趋势预测</h3>
                <p className="text-gray-600 text-sm">前瞻性的趋势分析</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}