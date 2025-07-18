export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Client Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Success stories from our clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Corporate Climate Action</h3>
            <p className="text-gray-600 text-sm">
              How global corporations are achieving their net zero targets
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Development</h3>
            <p className="text-gray-600 text-sm">
              Community-led projects creating positive environmental impact
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Innovation</h3>
            <p className="text-gray-600 text-sm">
              Innovative financing solutions for climate projects
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Supply Chain Transformation</h3>
            <p className="text-gray-600 text-sm">
              Transforming value chains for sustainable operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}