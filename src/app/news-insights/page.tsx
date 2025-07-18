export default function NewsInsightsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            News & insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The complexities of climate, simplified
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Latest News</h3>
            <p className="text-gray-600 text-sm">
              Latest industry updates and announcements
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Insights</h3>
            <p className="text-gray-600 text-sm">
              Expert analysis and commentary
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reports</h3>
            <p className="text-gray-600 text-sm">
              In-depth market reports and publications
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Events</h3>
            <p className="text-gray-600 text-sm">
              Upcoming events and webinars
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Media Center</h3>
            <p className="text-gray-600 text-sm">
              Press releases and media resources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}