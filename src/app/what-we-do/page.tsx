export default function WhatWeDoPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What we do
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three areas of expertise. One world class offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental Certificates</h3>
            <p className="text-gray-600 text-sm mb-4">
              Carbon credits, Energy Attribute Certificates, Biodiversity credits
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Carbon credits</li>
              <li>• Energy Attribute Certificates</li>
              <li>• Biodiversity & other environmental credits</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Climate Consulting</h3>
            <p className="text-gray-600 text-sm mb-4">
              Environmental footprint & net zero, Reporting & compliance, Value chain & renewables
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Measure & report impact</li>
              <li>• Set targets & net zero roadmaps</li>
              <li>• Act on value chain & engage stakeholders</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Finance</h3>
            <p className="text-gray-600 text-sm mb-4">
              Heavy industry, Nature-based removals, Tech-based removals
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Evaluate feasibility</li>
              <li>• Design & action your project</li>
              <li>• Commercialise voluntary or Article 6 credits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}