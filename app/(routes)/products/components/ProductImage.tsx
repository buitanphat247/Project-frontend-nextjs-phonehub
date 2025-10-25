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

  // Tạo array ảnh cho carousel với ảnh thật
  const images = [
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
    "https://baogiaothong.mediacdn.vn/upload/2-2022/images/2022-05-25/1-1653445668-308-width740height476.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
    "https://baogiaothong.mediacdn.vn/upload/2-2022/images/2022-05-25/1-1653445668-308-width740height476.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
    "https://baogiaothong.mediacdn.vn/upload/2-2022/images/2022-05-25/1-1653445668-308-width740height476.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
    "https://baogiaothong.mediacdn.vn/upload/2-2022/images/2022-05-25/1-1653445668-308-width740height476.jpg",
  ];

  return (
    <div className="bg-white  rounded-lg overflow-hidden">
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
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          className="main-swiper"
          touchRatio={1}
          touchAngle={45}
          grabCursor={true}
          allowTouchMove={true}
          simulateTouch={true}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={true}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="h-96 flex items-center justify-center">
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  preview={{
                    mask: "Click để phóng to",
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-1 h-[70px]">
          {images.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              slidesPerView={6}
              spaceBetween={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Thumbs]}
              className="thumbs-swiper h-full "
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full object-cover h-full"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
