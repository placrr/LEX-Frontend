export default function ATSLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header skeleton */}
        <div className="mb-10 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="h-7 w-52 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-4 w-80 bg-gray-100 rounded mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-32 border-2 border-dashed border-gray-100 rounded-xl" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-11 bg-gray-100 rounded-xl" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-28 bg-gray-100 rounded-xl" />
              <div className="h-11 bg-gray-200 rounded-xl" />
            </div>
          </div>

          {/* Reports skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-5 w-24 bg-gray-200 rounded-lg mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-50 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
