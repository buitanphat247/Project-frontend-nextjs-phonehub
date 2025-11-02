"use client";

import React, { useState, useEffect } from "react";
import { Empty, Spin, message } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import ProductCard from "../../products/components/ProductCard";
import { Product } from "../../products/interface/IProduct";

const FavoriteProductsTab: React.FC = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch favorite products từ API
    // Tạm thời để empty array
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="p-6">
        <Empty
          image={<HeartOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
          description={
            <span className="text-gray-600">Bạn chưa có sản phẩm yêu thích nào</span>
          }
        >
          <p className="text-gray-500 mt-4">Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau</p>
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FavoriteProductsTab;

