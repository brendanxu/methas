export default function MethaneRemovalInvestmentPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <span className="text-2xl">🔥</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            甲烷清除投资
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            专注于甲烷减排的投资服务
          </p>
          <div className="inline-block bg-orange-100 text-orange-800 px-6 py-2 rounded-full text-lg font-semibold">
            减排效果是CO₂的25-84倍
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">⛏️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">煤矿甲烷捕集与利用</h3>
            <p className="text-gray-600 mb-4">
              从煤矿开采过程中捕集甲烷气体，转化为清洁能源
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 矿井瓦斯抽采</li>
              <li>• 甲烷发电项目</li>
              <li>• 工业热能利用</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">🛢️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">油气田伴生气回收</h3>
            <p className="text-gray-600 mb-4">
              回收油气开采过程中的伴生甲烷气体，减少直接排放
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 火炬气回收</li>
              <li>• 伴生气处理</li>
              <li>• 天然气液化</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">🔬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">半导体制程尾气处理</h3>
            <p className="text-gray-600 mb-4">
              处理半导体制造过程中产生的含氟温室气体
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• PFCs气体销毁</li>
              <li>• SF₆气体回收</li>
              <li>• 尾气净化系统</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择甲烷减排？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">25-84倍</div>
                <div className="text-gray-600">温室效应潜力</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">12年</div>
                <div className="text-gray-600">大气存留时间</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">16%</div>
                <div className="text-gray-600">全球温室气体排放占比</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">投资优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">高减排效益</h3>
              <p className="text-gray-600">甲烷的温室效应潜力是CO₂的25-84倍，减排效果显著</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">政策支持</h3>
              <p className="text-gray-600">各国政府高度重视甲烷减排，政策支持力度大</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">碳价值高</h3>
              <p className="text-gray-600">甲烷减排项目的碳信用价值远高于传统项目</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">技术成熟</h3>
              <p className="text-gray-600">甲烷捕集和处理技术已经成熟，实施风险较低</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}