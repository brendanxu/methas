export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading climate impact since 2006
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission</h3>
            <p className="text-gray-600 text-sm">Our mission and values</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Leadership</h3>
            <p className="text-gray-600 text-sm">Meet our CEO, Chair, Board and team</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Locations</h3>
            <p className="text-gray-600 text-sm">Over 800 employees in 30+ countries</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Integrity</h3>
            <p className="text-gray-600 text-sm">Driving integrity in the carbon market</p>
          </div>
        </div>
      </div>
    </div>
  );
}