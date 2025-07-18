export default function ESGCarbonConsultingPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ESG与碳咨询
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            专业的ESG管理和碳战略咨询服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">双碳战略规划</h3>
            <p className="text-gray-600 mb-4">
              制定符合企业实际情况的碳达峰、碳中和战略规划
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 碳中和路径设计</li>
              <li>• 减排目标制定</li>
              <li>• 实施计划制定</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ESG报告编制</h3>
            <p className="text-gray-600 mb-4">
              协助企业编制符合国际标准的ESG报告
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• GRI标准报告</li>
              <li>• TCFD框架披露</li>
              <li>• 可持续发展报告</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">可持续发展咨询</h3>
            <p className="text-gray-600 mb-4">
              全面的可持续发展战略咨询和实施支持
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 可持续发展战略</li>
              <li>• 绿色金融咨询</li>
              <li>• 社会责任管理</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ESG管理体系</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Environmental</h3>
              <p className="text-gray-600 text-sm">环境保护与气候变化应对</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Social</h3>
              <p className="text-gray-600 text-sm">社会责任与员工权益保护</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">⚖️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Governance</h3>
              <p className="text-gray-600 text-sm">公司治理与商业道德</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">服务优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">专业认证</h3>
              <p className="text-gray-600">团队拥有多项国际ESG和碳管理认证</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">实践经验</h3>
              <p className="text-gray-600">服务过多家上市公司和大型企业</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">标准齐全</h3>
              <p className="text-gray-600">熟悉各种国际ESG标准和框架</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">全程服务</h3>
              <p className="text-gray-600">从战略制定到实施落地的全程支持</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}