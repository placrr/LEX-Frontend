export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Back button */}
        <div className="h-4 w-16 bg-gray-200 rounded mb-5 animate-pulse" />

        {/* Score header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 mb-5 animate-pulse">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded-lg mb-2" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-16 bg-gray-200 rounded-xl" />
              <div>
                <div className="h-3 w-8 bg-gray-100 rounded mb-1" />
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Left: Tab content */}
          <div className="flex-1 min-w-0">

            {/* Tabs skeleton */}
            <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-5 animate-pulse">
              <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
              <div className="flex-1 h-9 bg-gray-100 rounded-lg" />
            </div>

            {/* Dimension bars skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 animate-pulse">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                    <div className="h-3 w-7 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths + Improvements skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-md" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-10 bg-gray-50 rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations skeleton */}
            <div className="bg-gray-200 rounded-2xl p-5 animate-pulse">
              <div className="h-4 w-28 bg-gray-300 rounded mb-3" />
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-full shrink-0" />
                    <div className="h-4 flex-1 bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Chat skeleton */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse" style={{ height: "350px" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded-md" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-full bg-gray-50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
