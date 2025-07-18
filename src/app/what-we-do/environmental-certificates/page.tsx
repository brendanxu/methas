export default function EnvironmentalCertificatesPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Environmental Certificates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and fund a world of impact projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Carbon Credits</h3>
            <p className="text-gray-600 text-sm">
              High-quality carbon credits from verified projects worldwide
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Energy Attribute Certificates</h3>
            <p className="text-gray-600 text-sm">
              Renewable energy certificates and guarantees of origin
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Biodiversity Credits</h3>
            <p className="text-gray-600 text-sm">
              Environmental credits for biodiversity and ecosystem services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}