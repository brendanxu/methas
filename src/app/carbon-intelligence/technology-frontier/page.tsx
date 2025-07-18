export default function TechnologyFrontierPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            技术前沿
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            碳管理技术、创新解决方案、甲烷减排技术
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">💾</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">碳管理技术</h3>
            <p className="text-gray-600 text-sm">
              数字化碳监测和管理平台
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🔬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">创新解决方案</h3>
            <p className="text-gray-600 text-sm">
              前沿碳减排技术应用
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">🔥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">甲烷减排技术</h3>
            <p className="text-gray-600 text-sm">
              高效甲烷检测与处理技术
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-600 font-semibold">碳管理技术</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI驱动的碳排放监测系统</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  基于人工智能和物联网技术的碳排放实时监测系统，实现精准的碳足迹追踪。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">实时数据采集</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">AI算法分析</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">自动化报告生成</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">技术优势</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">监测精度</span>
                    <span className="font-semibold text-blue-600">99%+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">响应时间</span>
                    <span className="font-semibold text-blue-600">秒级</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">成本降低</span>
                    <span className="font-semibold text-blue-600">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-semibold">创新解决方案</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">直接空气捕获(DAC)技术突破</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  新一代DAC技术在能耗和成本方面取得重大突破，为大规模碳移除奠定基础。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">低温吸附材料</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">热泵集成系统</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">模块化设计</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">性能指标</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">能耗降低</span>
                    <span className="font-semibold text-green-600">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">成本目标</span>
                    <span className="font-semibold text-green-600">$150/吨CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">捕获效率</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-orange-600 font-semibold">甲烷减排技术</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">激光甲烷检测技术</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  采用激光光谱技术的甲烷泄漏检测系统，实现远距离、高精度的甲烷检测。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">激光光谱分析</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">无人机搭载</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">实时数据传输</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">技术参数</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">检测距离</span>
                    <span className="font-semibold text-orange-600">500米</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">检测精度</span>
                    <span className="font-semibold text-orange-600">1ppm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">覆盖面积</span>
                    <span className="font-semibold text-orange-600">10km²/小时</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">技术发展路线图</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2024年</h3>
              <p className="text-gray-600 text-sm">技术验证和小规模试点</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2025年</h3>
              <p className="text-gray-600 text-sm">商业化应用推广</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2026年</h3>
              <p className="text-gray-600 text-sm">规模化部署</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-xl">🌟</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2027年</h3>
              <p className="text-gray-600 text-sm">技术成熟和成本优化</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}