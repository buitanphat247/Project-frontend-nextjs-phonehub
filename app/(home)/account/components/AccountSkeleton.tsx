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

        {/* Tabs Content Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Bar Skeleton */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-6 bg-gray-200 rounded animate-pulse w-32" />
              ))}
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <div className="p-6">
            {/* Profile Tab Skeleton - 2 cột giống form thật */}
            <div>
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
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;

