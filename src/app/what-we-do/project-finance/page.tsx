export default function ProjectFinancePage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Project Finance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Finance decarbonisation at scale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Heavy Industry</h3>
            <p className="text-gray-600 text-sm">
              Financing solutions for industrial decarbonization projects
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nature-based Removals</h3>
            <p className="text-gray-600 text-sm">
              Forest and ecosystem restoration projects
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tech-based Removals</h3>
            <p className="text-gray-600 text-sm">
              Innovative carbon removal technologies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}