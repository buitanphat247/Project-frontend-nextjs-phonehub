import { Skeleton } from "antd";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <Skeleton.Input active size="small" className="w-64" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image Skeleton */}
          <div className="bg-white rounded-lg overflow-hidden">
            {/* Main Image */}
            <div className="h-96 w-full bg-gray-200 animate-pulse rounded-lg" />
            {/* Thumbnail Skeleton */}
            <div className="mt-1 px-1">
              <div className="flex gap-[5px]">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-[70px] w-[70px] bg-gray-200 rounded border border-gray-300 shrink-0 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title */}
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />

            {/* 3 Options */}
            <div className="flex gap-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                  <Skeleton.Avatar active size={24} shape="circle" />
                  <Skeleton.Input active size="small" style={{ width: "60px", height: "20px" }} />
                </div>
              ))}
            </div>

            {/* Description - 2 dòng */}
            <Skeleton active paragraph={{ rows: 5, width: ["100%", "100%", "100%", "100%", "80%"] }} title={false} />

            {/* Action Buttons Skeleton (match UI: 1 primary row, then 2 secondary) */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Skeleton */}
        <div className="mt-10 space-y-6">
          <Skeleton.Input active size="large" className="w-48 mb-6" style={{ fontSize: "24px", height: "32px" }} />
          {[...Array(3)].map((_, groupIndex) => (
            <div key={groupIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Group Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <Skeleton.Input active size="default" className="w-48" style={{ fontSize: "18px", height: "24px" }} />
              </div>
              {/* Table Rows */}
              <table className="w-full">
                <tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex < 4 ? "border-b border-gray-200" : ""}>
                      <td className="px-6 py-4 w-1/3">
                        <Skeleton.Input active className="w-full" />
                      </td>
                      <td className="px-6 py-4 w-2/3">
                        <Skeleton.Input active className="w-full" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-10">
          <Skeleton.Input active size="large" className="w-48 mb-6" style={{ fontSize: "24px", height: "32px" }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
