export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            解决方案
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            因地制宜的行业解决方案，助力企业实现可持续发展
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">方案概览</h2>
            <p className="text-gray-600 mb-6">
              基于不同行业特点，提供定制化的碳管理解决方案
            </p>
            <a href="/solutions/overview" className="text-green-600 font-medium hover:text-green-700">
              查看详情 →
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">实施成果</h2>
            <p className="text-gray-600 mb-6">
              真实的客户成功案例和关键数据展示
            </p>
            <a href="/solutions/results" className="text-green-600 font-medium hover:text-green-700">
              查看成果 →
            </a>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">按行业分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">能源行业</h3>
              <p className="text-gray-600 text-sm mb-4">传统能源向清洁能源转型</p>
              <a href="/solutions/energy-industry" className="text-green-600 text-sm font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🏭</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">制造业</h3>
              <p className="text-gray-600 text-sm mb-4">智能制造与碳减排</p>
              <a href="/solutions/manufacturing" className="text-green-600 text-sm font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl">🛒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">零售业</h3>
              <p className="text-gray-600 text-sm mb-4">供应链碳中和计划</p>
              <a href="/solutions/retail" className="text-green-600 text-sm font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">🏦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">金融业</h3>
              <p className="text-gray-600 text-sm mb-4">ESG合规与绿色投资组合</p>
              <a href="/solutions/finance" className="text-green-600 text-sm font-medium hover:text-green-700">
                了解更多 →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">服务关联逻辑</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">🛠️</span>
                </div>
                <h3 className="font-semibold text-gray-900">服务类型</h3>
                <p className="text-gray-600 text-sm">展示能力</p>
              </div>
              <div className="text-gray-400 text-2xl">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900">解决方案</h3>
                <p className="text-gray-600 text-sm">证明效果</p>
              </div>
              <div className="text-gray-400 text-2xl">→</div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-gray-900">碳智观察</h3>
                <p className="text-gray-600 text-sm">知识支撑</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}