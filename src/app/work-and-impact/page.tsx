export default function WorkAndImpactPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our work & impact
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re in business to make a positive impact on climate, environment and for people
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Studies</h3>
            <p className="text-gray-600 text-sm">
              Real-world climate solutions and client success stories
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Reports</h3>
            <p className="text-gray-600 text-sm">
              Annual impact and sustainability reports
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Client Stories</h3>
            <p className="text-gray-600 text-sm">
              Success stories from our clients
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
            <p className="text-gray-600 text-sm">
              Discover our certified climate action projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}