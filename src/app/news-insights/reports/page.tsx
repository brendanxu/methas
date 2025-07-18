export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Reports
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            In-depth market reports and publications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2025 Carbon Market Buyer&apos;s Guide</h3>
            <p className="text-gray-600 text-sm">
              Explore key carbon market trends, compliance, and integrity updates
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Guide to Article 6</h3>
            <p className="text-gray-600 text-sm">
              20-minute guide explaining Article 6 of the Paris Agreement
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">SBTi Update Summary</h3>
            <p className="text-gray-600 text-sm">
              Summary of the July 2024 SBTi update on scope 3 emissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}