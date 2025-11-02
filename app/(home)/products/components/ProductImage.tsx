"use client";

import React, { useState } from "react";
import { Image } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Autoplay } from "swiper/modules";
import { Product } from "../interface/IProduct";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface ProductImageProps {
  product: Product;
}

const ProductImage = ({ product }: ProductImageProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Lấy images từ product, nếu không có thì dùng thumbnailImage
  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : product.thumbnailImage
      ? [product.thumbnailImage]
      : [];

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="h-96 flex items-center justify-center bg-gray-100">
          <span className="text-6xl">{product.image || "📱"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <style jsx>{`
        .thumbs-swiper .swiper-slide-thumb-active img {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      `}</style>
      <div className="relative">
        <Swiper
          modules={[Thumbs, FreeMode, Autoplay]}
          spaceBetween={10}
          navigation={images.length > 1}
          thumbs={{ swiper: thumbsSwiper && images.length > 1 ? thumbsSwiper : null }}
          className="main-swiper"
          touchRatio={1}
          touchAngle={45}
          grabCursor={true}
          allowTouchMove={true}
          simulateTouch={true}
          autoplay={images.length > 1 ? {
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          } : false}
          loop={images.length > 1}
          
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="h-96 flex items-center justify-center ">
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className="max-w-full max-h-full object-contain "
                  preview={{
                    mask: "Click để phóng to",
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {images.length > 1 && (
          <div className="mt-1 h-[70px] ">
            <Swiper
              onSwiper={setThumbsSwiper}
              slidesPerView={6}
              spaceBetween={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Thumbs]}
              className="thumbs-swiper h-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full object-contain h-full"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
