export default function FinancePage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-purple-600 text-2xl">🏦</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            金融业解决方案
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ESG合规与绿色投资组合的专业服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ESG投资框架</h3>
            <p className="text-gray-600 mb-4">
              建立完善的ESG投资决策体系
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• ESG评级体系</li>
              <li>• 投资筛选标准</li>
              <li>• 风险评估模型</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">绿色金融产品</h3>
            <p className="text-gray-600 mb-4">
              创新绿色金融产品设计
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 绿色债券发行</li>
              <li>• 碳金融产品</li>
              <li>• 可持续发展贷款</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">监管合规</h3>
            <p className="text-gray-600 mb-4">
              满足监管要求的合规管理
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 气候风险披露</li>
              <li>• ESG信息披露</li>
              <li>• 压力测试</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ESG投资管理流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ESG评估</h3>
              <p className="text-gray-600 text-sm">全面评估投资标的ESG表现</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">风险分析</h3>
              <p className="text-gray-600 text-sm">识别和量化气候风险</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">投资决策</h3>
              <p className="text-gray-600 text-sm">基于ESG因素的投资决策</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">持续监控</h3>
              <p className="text-gray-600 text-sm">投后ESG表现监控</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">典型案例：大型金融机构</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">项目背景</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">管理资产</span>
                  <span className="font-semibold">500亿元</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">项目周期</span>
                  <span className="font-semibold">18个月</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ESG评级</span>
                  <span className="font-semibold">A级</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">绿色投资占比</span>
                  <span className="font-semibold">40%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">投资效果</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-2">8,500</div>
                <div className="text-gray-600">吨CO₂减排量</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>绿色投资</span>
                  <span className="font-semibold">6,000吨</span>
                </div>
                <div className="flex justify-between">
                  <span>运营减排</span>
                  <span className="font-semibold">1,500吨</span>
                </div>
                <div className="flex justify-between">
                  <span>供应链</span>
                  <span className="font-semibold">1,000吨</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">服务优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">专业能力</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">气候风险建模</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">ESG数据分析</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">绿色金融创新</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">客户价值</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">投资回报优化</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">风险管理提升</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">品牌声誉增强</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}