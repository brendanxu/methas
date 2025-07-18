export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Impact Reports
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Annual impact and sustainability reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2024 Impact Report</h3>
            <p className="text-gray-600 text-sm">
              Our latest annual impact and sustainability report
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2023 Impact Report</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive overview of our climate impact achievements
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2022 Impact Report</h3>
            <p className="text-gray-600 text-sm">
              Key milestones and environmental outcomes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}