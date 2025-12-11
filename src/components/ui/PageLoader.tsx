export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/20 via-transparent to-orange-50/20 animate-pulse-slow"></div>

      <div className="text-center relative z-10">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            <div
              className="absolute inset-3 border-4 border-orange-300 rounded-full border-r-transparent animate-spin"
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}
            ></div>
            <div
              className="absolute inset-6 border-2 border-orange-400 rounded-full border-b-transparent animate-spin"
              style={{ animationDuration: '2s' }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
            Marketplace
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span
              className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: '0s', animationDuration: '1s' }}
            ></span>
            <span
              className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s', animationDuration: '1s' }}
            ></span>
            <span
              className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s', animationDuration: '1s' }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  )
}
