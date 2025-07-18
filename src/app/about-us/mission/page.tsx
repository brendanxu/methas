export default function MissionPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our mission and values
          </p>
        </div>

        <div className="prose prose-lg max-w-4xl mx-auto">
          <p className="text-gray-700 leading-relaxed">
            Our mission is to create true climate impact for all by inspiring everyone, everywhere to play a role.
          </p>
          <p className="text-gray-700 leading-relaxed mt-6">
            We believe that climate action should be accessible, measurable, and impactful. Through our comprehensive solutions, we help organizations navigate the complexities of climate change while delivering tangible results for business, society, and the planet.
          </p>
        </div>
      </div>
    </div>
  );
}