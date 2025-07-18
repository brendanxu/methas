export default function ClimateConsultingPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Climate Consulting
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready your business for a sustainable future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Environmental Footprint & Net Zero</h3>
            <p className="text-gray-600 text-sm">
              Measure, report, and reduce your environmental impact
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reporting & Compliance</h3>
            <p className="text-gray-600 text-sm">
              Navigate regulations and meet compliance requirements
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Value Chain & Renewables</h3>
            <p className="text-gray-600 text-sm">
              Engage stakeholders and transition to renewable energy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}