const AccountSkeleton = () => {
  return (
    <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 ">
      <div className="container mx-auto px-4 py-8 space-y-4">
        {/* User Header Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center space-x-4">
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse shrink-0" />
            
            {/* User Info Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
            </div>
          </div>
        </div>

        {/* User Stats Skeleton - 4 cards riêng biệt */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Thông tin cá nhân Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-6" />
            
            {/* Form fields - Grid 2 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  {/* Label */}
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2" />
                  {/* Input */}
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full" />
                </div>
              ))}
            </div>
            
            {/* Button */}
            <div className="mt-6">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-40" />
            </div>
          </div>
        </div>

        {/* Cài đặt Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              {/* Thông báo section */}
              <div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-40 mb-2" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
                      </div>
                      <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bảo mật section */}
              <div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
                <div className="space-y-3">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="h-12 bg-gray-200 rounded-lg animate-pulse w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;

