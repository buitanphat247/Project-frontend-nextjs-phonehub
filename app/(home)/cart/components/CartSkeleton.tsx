const CartSkeleton = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header Skeleton */}
              <div className="p-6 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              </div>

              {/* Items Skeleton */}
              <div className="divide-y divide-gray-200">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image Skeleton */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse shrink-0" />

                      {/* Product Info Skeleton */}
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                        <div className="flex items-center space-x-2">
                          <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                        </div>
                      </div>

                      {/* Quantity Controls Skeleton */}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                        <div className="w-12 h-8 bg-gray-200 rounded animate-pulse" />
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                      </div>

                      {/* Item Total Skeleton */}
                      <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />

                      {/* Remove Button Skeleton */}
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />

              <div className="space-y-3 mb-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                ))}
              </div>

              {/* Buttons Skeleton */}
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Info Box Skeleton */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;

