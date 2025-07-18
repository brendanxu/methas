export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upcoming events and webinars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Climate Week NYC</h3>
            <p className="text-gray-600 text-sm">
              Join us at Climate Week NYC for the latest in climate action
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">COP29 Side Events</h3>
            <p className="text-gray-600 text-sm">
              South Pole&apos;s participation in COP29 conferences
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Carbon Market Webinars</h3>
            <p className="text-gray-600 text-sm">
              Monthly webinars on carbon market developments
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Net Zero Masterclass</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive training on net zero strategy development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}