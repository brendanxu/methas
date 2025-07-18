export default function GreenSupplyChainPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            绿色供应链
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            端到端的供应链碳管理解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">供应商碳管理</h3>
            <p className="text-gray-600 mb-4">
              建立供应商碳排放管理体系，推动供应链整体减排
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 供应商碳排放调查</li>
              <li>• 碳减排目标设定</li>
              <li>• 碳管理培训</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">产品碳足迹</h3>
            <p className="text-gray-600 mb-4">
              计算和管理产品全生命周期的碳足迹
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 产品LCA分析</li>
              <li>• 碳标签认证</li>
              <li>• 碳足迹追踪</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">绿色采购体系</h3>
            <p className="text-gray-600 mb-4">
              建立绿色采购标准和评估体系
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 绿色采购政策</li>
              <li>• 供应商绿色评估</li>
              <li>• 绿色产品目录</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">供应链碳管理流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">碳盘查</h3>
              <p className="text-gray-600 text-sm">全面调查供应链碳排放现状</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">目标设定</h3>
              <p className="text-gray-600 text-sm">制定供应链减排目标和计划</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">协同减排</h3>
              <p className="text-gray-600 text-sm">与供应商协同实施减排措施</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">监测评估</h3>
              <p className="text-gray-600 text-sm">持续监测和评估减排效果</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">服务优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">全链条覆盖</h3>
              <p className="text-gray-600">从原材料到最终产品的全供应链管理</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">数字化平台</h3>
              <p className="text-gray-600">智能化供应链碳管理平台</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">标准化流程</h3>
              <p className="text-gray-600">标准化的供应链碳管理流程和工具</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">专业支持</h3>
              <p className="text-gray-600">专业的供应链碳管理咨询团队</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}