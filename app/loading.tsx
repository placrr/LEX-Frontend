export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      {/* Hero skeleton */}
      <div className="pt-28 pb-20 md:pt-36 md:pb-28 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="h-7 w-44 bg-gray-200/60 rounded-full animate-pulse mb-6" />

          {/* Heading */}
          <div className="h-12 sm:h-16 w-72 sm:w-96 bg-gray-200/60 rounded-2xl animate-pulse mb-3" />
          <div className="h-12 sm:h-16 w-56 sm:w-72 bg-gradient-to-r from-purple-200/60 to-pink-200/60 rounded-2xl animate-pulse mb-6" />

          {/* Subheading */}
          <div className="h-4 w-80 bg-gray-100 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse mb-8" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="h-12 w-48 bg-gray-900/10 rounded-full animate-pulse" />
            <div className="h-12 w-52 bg-gray-100 rounded-full animate-pulse" />
          </div>

          {/* Pills */}
          <div className="flex gap-3 mt-12">
            <div className="h-9 w-40 bg-purple-50 rounded-full animate-pulse" />
            <div className="h-9 w-36 bg-blue-50 rounded-full animate-pulse" />
            <div className="h-9 w-40 bg-orange-50 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Features skeleton */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-14">
            <div className="h-6 w-20 bg-purple-100 rounded-full animate-pulse mb-4" />
            <div className="h-10 w-80 bg-gray-200/60 rounded-xl animate-pulse mb-2" />
            <div className="h-10 w-64 bg-gray-200/60 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl p-7 bg-gray-50 border border-gray-100 animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-gray-200 mb-5" />
                <div className="h-6 w-40 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 w-full bg-gray-100 rounded mb-1" />
                <div className="h-4 w-3/4 bg-gray-100 rounded mb-6" />
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-14 bg-white rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
