export default function SolutionOverviewPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            方案概览
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            基于不同行业特点，提供定制化的碳管理解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">核心能力</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">碳足迹评估</h3>
                  <p className="text-gray-600 text-sm">全面的组织和产品碳足迹评估</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">减排路径设计</h3>
                  <p className="text-gray-600 text-sm">科学的碳减排路径和目标设定</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">技术集成</h3>
                  <p className="text-gray-600 text-sm">多种减排技术的集成应用</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">数字化管理</h3>
                  <p className="text-gray-600 text-sm">智能化碳管理平台和工具</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">实施流程</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">现状评估</h3>
                  <p className="text-gray-600 text-sm">全面评估企业碳排放现状</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">方案设计</h3>
                  <p className="text-gray-600 text-sm">制定个性化减排方案</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">实施执行</h3>
                  <p className="text-gray-600 text-sm">协助企业实施减排措施</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">监测优化</h3>
                  <p className="text-gray-600 text-sm">持续监测和优化改进</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">行业适用性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">能源行业</h3>
              <p className="text-gray-600 text-sm">传统能源转型升级</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🏭</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">制造业</h3>
              <p className="text-gray-600 text-sm">智能制造绿色化</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl">🛒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">零售业</h3>
              <p className="text-gray-600 text-sm">供应链碳管理</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">🏦</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">金融业</h3>
              <p className="text-gray-600 text-sm">绿色金融服务</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">解决方案优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">个性化定制</h3>
              <p className="text-gray-600">根据企业特点和需求定制专属解决方案</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">全程支持</h3>
              <p className="text-gray-600">从规划到实施的全程专业支持</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">技术先进</h3>
              <p className="text-gray-600">采用国际先进的碳管理技术和方法</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">效果可见</h3>
              <p className="text-gray-600">可量化的减排效果和投资回报</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}