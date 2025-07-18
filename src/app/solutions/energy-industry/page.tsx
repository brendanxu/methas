export default function EnergyIndustryPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            能源行业解决方案
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            传统能源向清洁能源转型的综合解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">甲烷减排</h3>
            <p className="text-gray-600 mb-4">
              油气开采过程中的甲烷泄漏检测与减排
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 泄漏检测与修复(LDAR)</li>
              <li>• 火炬气回收利用</li>
              <li>• 甲烷捕集技术</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">可再生能源</h3>
            <p className="text-gray-600 mb-4">
              太阳能、风能等可再生能源项目开发
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 可再生能源规划</li>
              <li>• 储能系统集成</li>
              <li>• 智能电网建设</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">碳捕集技术</h3>
            <p className="text-gray-600 mb-4">
              CCUS技术在传统能源行业的应用
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 碳捕集设备</li>
              <li>• 碳封存技术</li>
              <li>• 碳利用项目</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">转型路径</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">现状评估</h3>
              <p className="text-gray-600 text-sm">评估当前能源结构和碳排放</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">战略规划</h3>
              <p className="text-gray-600 text-sm">制定清洁能源转型战略</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">项目实施</h3>
              <p className="text-gray-600 text-sm">分阶段实施转型项目</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">效果监测</h3>
              <p className="text-gray-600 text-sm">持续监测转型效果</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">典型案例</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">大型石油公司转型</h3>
              <p className="text-gray-600 mb-4">
                帮助某大型石油公司制定2050年净零排放目标和实施路径
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>项目投资</span>
                  <span className="font-semibold">20亿元</span>
                </div>
                <div className="flex justify-between">
                  <span>减排目标</span>
                  <span className="font-semibold">50,000吨CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span>清洁能源占比</span>
                  <span className="font-semibold">35%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">煤炭企业转型</h3>
              <p className="text-gray-600 mb-4">
                协助煤炭企业向清洁能源和新材料产业转型
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>转型投资</span>
                  <span className="font-semibold">8亿元</span>
                </div>
                <div className="flex justify-between">
                  <span>甲烷减排</span>
                  <span className="font-semibold">30,000吨CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span>新产业占比</span>
                  <span className="font-semibold">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}