export default function ImplementationResultsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            实施成果
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            真实的客户成功案例和关键数据展示
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-green-50 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">72,500</div>
            <div className="text-gray-600">累计减排量（吨CO₂）</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">服务客户数量</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
            <div className="text-gray-600">客户满意度</div>
          </div>
        </div>

        <div className="space-y-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center">客户成功案例</h2>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">零售连锁店供应链碳中和计划</h3>
                <p className="text-gray-600 mb-4">
                  为某大型零售连锁企业制定全供应链碳中和计划，涵盖供应商管理、物流优化和门店节能等方面。
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">项目周期</span>
                    <span className="text-gray-900">24个月</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">覆盖门店</span>
                    <span className="text-gray-900">500+家</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">供应商数量</span>
                    <span className="text-gray-900">200+家</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">22,000</div>
                  <div className="text-gray-600 mb-4">吨CO₂减排量</div>
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
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">金融机构ESG合规与绿色投资组合</h3>
                <p className="text-gray-600 mb-4">
                  协助某大型金融机构建立ESG投资框架，优化投资组合的碳排放表现，同时满足监管合规要求。
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">项目周期</span>
                    <span className="text-gray-900">18个月</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">管理资产</span>
                    <span className="text-gray-900">500亿元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ESG评级</span>
                    <span className="text-gray-900">A级</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8,500</div>
                  <div className="text-gray-600 mb-4">吨CO₂减排量</div>
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
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">传统能源公司向清洁能源转型</h3>
                <p className="text-gray-600 mb-4">
                  帮助某传统能源公司制定清洁能源转型战略，包括甲烷减排、可再生能源投资和碳捕集技术应用。
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">项目周期</span>
                    <span className="text-gray-900">36个月</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">投资规模</span>
                    <span className="text-gray-900">20亿元</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">清洁能源占比</span>
                    <span className="text-gray-900">35%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50,000</div>
                  <div className="text-gray-600 mb-4">吨CO₂减排量</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>甲烷减排</span>
                      <span className="font-semibold">30,000吨</span>
                    </div>
                    <div className="flex justify-between">
                      <span>可再生能源</span>
                      <span className="font-semibold">15,000吨</span>
                    </div>
                    <div className="flex justify-between">
                      <span>能效提升</span>
                      <span className="font-semibold">5,000吨</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">价值创造说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">环境价值</h3>
              <p className="text-gray-600">显著减少温室气体排放，助力全球气候目标</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">经济价值</h3>
              <p className="text-gray-600">降低运营成本，提高资源利用效率</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">社会价值</h3>
              <p className="text-gray-600">提升企业ESG评级，增强品牌价值</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">战略价值</h3>
              <p className="text-gray-600">构建可持续发展竞争优势</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}