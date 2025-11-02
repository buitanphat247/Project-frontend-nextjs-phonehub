const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative shrink-0">
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col grow space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
        <div className="mt-auto">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

