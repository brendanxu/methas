export default function IndustryInsightsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            行业洞察
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            政策解读、市场分析、趋势预测
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">政策解读</h3>
            <p className="text-gray-600 text-sm">
              深度解析最新碳中和政策
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">市场分析</h3>
            <p className="text-gray-600 text-sm">
              全球碳市场动态分析
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">🔮</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">趋势预测</h3>
            <p className="text-gray-600 text-sm">
              前瞻性行业发展趋势
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-600 font-semibold">政策解读</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">全国碳市场扩容影响分析</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  随着全国碳市场纳入行业范围的扩大，更多企业将面临碳排放管理的挑战和机遇。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">石化行业纳入时间表</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">建材行业准备工作</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">钢铁行业配额分配</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">关键数据</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">预计纳入企业</span>
                    <span className="font-semibold text-blue-600">8000+家</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">覆盖排放量</span>
                    <span className="font-semibold text-blue-600">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">市场规模预估</span>
                    <span className="font-semibold text-blue-600">1000亿元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-semibold">市场分析</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2024年全球碳价格走势</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  全球主要碳市场价格呈现分化趋势，欧盟ETS价格波动较大，而中国碳市场价格相对稳定。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">欧盟ETS价格分析</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">中国碳市场表现</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">RGGI市场动态</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">价格区间</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">欧盟ETS</span>
                    <span className="font-semibold text-green-600">60-85 €/吨</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">中国全国市场</span>
                    <span className="font-semibold text-green-600">50-70 元/吨</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RGGI</span>
                    <span className="font-semibold text-green-600">10-15 $/吨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-purple-600 font-semibold">趋势预测</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">碳中和技术发展趋势</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  未来五年，碳中和技术将在成本下降和规模化应用方面取得重大突破。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">CCUS技术商业化</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">绿氢产业链成熟</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">储能技术突破</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">发展预期</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CCUS成本下降</span>
                    <span className="font-semibold text-purple-600">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">绿氢产能增长</span>
                    <span className="font-semibold text-purple-600">10倍</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">储能成本下降</span>
                    <span className="font-semibold text-purple-600">70%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">专家观点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">碳市场发展</h3>
              <p className="text-gray-600 text-sm mb-4">
                &ldquo;未来三年将是中国碳市场快速发展的关键期，市场流动性和价格发现机制将显著改善。&rdquo;
              </p>
              <div className="text-xs text-gray-500">— 碳市场专家 张教授</div>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">技术创新</h3>
              <p className="text-gray-600 text-sm mb-4">
                &ldquo;甲烷减排技术将成为下一个投资热点，其减排效果远超传统CO₂减排项目。&rdquo;
              </p>
              <div className="text-xs text-gray-500">— 技术专家 李博士</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}