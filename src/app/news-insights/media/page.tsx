export default function MediaPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Media Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Press releases and media resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Press Releases</h3>
            <p className="text-gray-600 text-sm">
              Latest company announcements and news
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Media Kit</h3>
            <p className="text-gray-600 text-sm">
              Logos, images, and brand assets for media use
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Expert Interviews</h3>
            <p className="text-gray-600 text-sm">
              Connect with our climate experts for interviews
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Media Contact</h3>
            <p className="text-gray-600 text-sm">
              Contact information for media inquiries
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Awards & Recognition</h3>
            <p className="text-gray-600 text-sm">
              Industry awards and recognition received
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Press Coverage</h3>
            <p className="text-gray-600 text-sm">
              Recent media coverage and mentions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}