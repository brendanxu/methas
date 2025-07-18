export default function CarbonIntelligenceReportsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            碳智报告
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            研究报告与白皮书下载
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">研究报告</h3>
            <p className="text-gray-600 text-sm">
              深度行业研究和数据分析报告
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">白皮书</h3>
            <p className="text-gray-600 text-sm">
              专业技术和解决方案白皮书
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">最新报告</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-600 text-sm font-semibold">研究报告</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2024年中国碳市场发展报告</h3>
                <p className="text-gray-600 text-sm mb-4">
                  全面分析中国碳市场发展现状、挑战和机遇
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2024-01-15</span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                    下载
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 text-sm font-semibold">白皮书</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">甲烷减排技术应用白皮书</h3>
                <p className="text-gray-600 text-sm mb-4">
                  详细介绍甲烷减排技术的原理和应用案例
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2024-01-10</span>
                  <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">
                    下载
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-600 text-sm font-semibold">研究报告</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ESG投资趋势分析报告</h3>
                <p className="text-gray-600 text-sm mb-4">
                  全球ESG投资市场现状和发展趋势分析
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2024-01-05</span>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600">
                    下载
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">热门下载</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-600 text-sm font-semibold">技术白皮书</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">碳中和技术路线图</h3>
                    <p className="text-gray-600 text-sm">各行业碳中和技术发展路径和时间表</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">5.2K</div>
                      <div className="text-xs text-gray-500">下载量</div>
                    </div>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600">
                      下载
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-600 text-sm font-semibold">行业报告</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">制造业碳减排最佳实践</h3>
                    <p className="text-gray-600 text-sm">制造业企业碳减排实践案例和经验总结</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">3.8K</div>
                      <div className="text-xs text-gray-500">下载量</div>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                      下载
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 text-sm font-semibold">政策解读</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">双碳政策解读报告</h3>
                    <p className="text-gray-600 text-sm">最新双碳政策深度解读和企业应对建议</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">4.1K</div>
                      <div className="text-xs text-gray-500">下载量</div>
                    </div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">
                      下载
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">分类浏览</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">市场分析</h3>
                <p className="text-gray-600 text-sm">15份报告</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">🔬</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">技术研究</h3>
                <p className="text-gray-600 text-sm">12份报告</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">📋</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">政策解读</h3>
                <p className="text-gray-600 text-sm">8份报告</p>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 text-xl">🏢</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">行业实践</h3>
                <p className="text-gray-600 text-sm">20份报告</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">订阅报告更新</h2>
            <p className="text-gray-600 mb-6">
              第一时间获取最新研究报告和白皮书
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="请输入您的邮箱"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                订阅
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}