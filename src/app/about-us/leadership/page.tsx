export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Leadership
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our CEO, Chair, Board and team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">CEO</h3>
            <p className="text-gray-600 text-sm">Chief Executive Officer</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chair</h3>
            <p className="text-gray-600 text-sm">Chairman of the Board</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Board</h3>
            <p className="text-gray-600 text-sm">Board of Directors</p>
          </div>
        </div>
      </div>
    </div>
  );
}