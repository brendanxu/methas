export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our certified climate action projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Forest Conservation</h3>
            <p className="text-gray-600 text-sm">
              Protecting and restoring forest ecosystems worldwide
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Renewable Energy</h3>
            <p className="text-gray-600 text-sm">
              Solar, wind, and hydroelectric power projects
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Development</h3>
            <p className="text-gray-600 text-sm">
              Projects that benefit local communities and ecosystems
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Agriculture</h3>
            <p className="text-gray-600 text-sm">
              Sustainable farming and land use practices
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Waste Management</h3>
            <p className="text-gray-600 text-sm">
              Reducing methane emissions from waste treatment
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Technology Solutions</h3>
            <p className="text-gray-600 text-sm">
              Innovative carbon removal and reduction technologies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}