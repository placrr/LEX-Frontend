export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Header skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-8 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200" />
            <div className="flex-1">
              <div className="h-6 w-48 bg-gray-200 rounded-lg" />
              <div className="h-4 w-64 bg-gray-100 rounded-lg mt-2" />
            </div>
          </div>
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-100 mb-3" />
              <div className="h-7 w-12 bg-gray-200 rounded-lg" />
              <div className="h-3 w-20 bg-gray-100 rounded mt-2" />
            </div>
          ))}
        </div>

        {/* Usage bar skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-2.5 bg-gray-100 rounded-full" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded-lg mb-5" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50">
                  <div className="w-12 h-12 rounded-full bg-gray-100" />
                  <div className="flex-1">
                    <div className="h-4 w-36 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded mt-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-5 w-28 bg-gray-200 rounded-lg mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-gray-50 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
