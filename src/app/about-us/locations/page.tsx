export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Locations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Over 800 employees in 30+ countries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Zurich, Switzerland',
            'London, UK',
            'Singapore',
            'Mexico City, Mexico',
            'São Paulo, Brazil',
            'Delhi, India',
            'Beijing, China',
            'New York, USA'
          ].map((location, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{location}</h3>
              <p className="text-gray-600 text-sm">Regional office</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}