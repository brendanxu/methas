export default function CarbonAssetManagementPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            碳资产管理
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            全方位碳资产管理服务，从核算到交易的完整解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">碳足迹核算</h3>
            <p className="text-gray-600 mb-4">
              专业的碳排放核算服务，帮助企业准确计算组织和产品层面的碳足迹
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• ISO 14064标准核算</li>
              <li>• 产品生命周期评估</li>
              <li>• 供应链碳排放核算</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">碳资产开发</h3>
            <p className="text-gray-600 mb-4">
              协助企业开发碳减排项目，将减排成果转化为可交易的碳资产
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• CCER项目开发</li>
              <li>• VCS项目注册</li>
              <li>• 碳信用核证</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">碳交易管理</h3>
            <p className="text-gray-600 mb-4">
              提供碳配额和碳信用的交易策略、风险管理和合规服务
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 碳市场分析</li>
              <li>• 交易策略制定</li>
              <li>• 合规风险管理</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">服务优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">专业团队</h3>
              <p className="text-gray-600">拥有多年碳市场经验的专业团队，熟悉国内外碳交易规则</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">全流程服务</h3>
              <p className="text-gray-600">从碳盘查到碳交易的一站式解决方案</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">数字化平台</h3>
              <p className="text-gray-600">智能化碳管理平台，实时监控碳资产状况</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">合规保障</h3>
              <p className="text-gray-600">确保所有碳资产开发和交易符合监管要求</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}