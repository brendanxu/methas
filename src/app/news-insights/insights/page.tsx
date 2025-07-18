export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert analysis and commentary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Climate Policy Analysis</h3>
            <p className="text-gray-600 text-sm">
              In-depth analysis of global climate policies and regulations
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Intelligence</h3>
            <p className="text-gray-600 text-sm">
              Strategic insights into carbon and environmental markets
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Technology Trends</h3>
            <p className="text-gray-600 text-sm">
              Emerging technologies in climate solutions
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Outlook</h3>
            <p className="text-gray-600 text-sm">
              Climate investment trends and opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}