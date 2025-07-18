export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-world climate solutions and client success stories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nestlé Net Zero Roadmap</h3>
            <p className="text-gray-600 text-sm">
              Building a comprehensive net zero roadmap for a global food company
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bentley Net Zero Plastic</h3>
            <p className="text-gray-600 text-sm">
              Achieving net zero plastic to nature in the luxury automotive industry
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Philips Renewable Energy</h3>
            <p className="text-gray-600 text-sm">
              Sourcing long-term renewable energy from innovative solar projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}