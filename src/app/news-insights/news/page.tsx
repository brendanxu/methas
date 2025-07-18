export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest News
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Latest industry updates and announcements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Article 6 Update</h3>
            <p className="text-gray-600 text-sm">
              Latest developments in Article 6 implementation
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Carbon Market Trends</h3>
            <p className="text-gray-600 text-sm">
              Key trends shaping the carbon market in 2024
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">New Partnerships</h3>
            <p className="text-gray-600 text-sm">
              Strategic partnerships driving climate action
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}