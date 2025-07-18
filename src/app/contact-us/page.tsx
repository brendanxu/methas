export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to talk? With over 800 experts in more than 30 countries, we can help with almost all of your climate challenges.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <p className="text-gray-600 text-sm mb-4">
                Ready to start your climate journey? Contact our team of experts.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">contact@southpole.com</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">+41 43 501 35 50</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Presence</h3>
              <p className="text-gray-600 text-sm mb-4">
                With offices in over 30 countries, we think global and act local.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Headquarters: Zurich, Switzerland</div>
                <div>Regional offices worldwide</div>
                <div>Local expertise in every market</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}