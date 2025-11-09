"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { toast } from "react-toastify";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  StarOutlined,
  PhoneOutlined,
  LaptopOutlined,
  TabletOutlined,
  GiftOutlined,
  TruckOutlined,
  SafetyOutlined,
  AudioOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ProductCard from "./products/components/ProductCard";
import ProductCardSkeleton from "./products/components/ProductCardSkeleton";
import { useHomeProducts } from "./hooks/useHomeProducts";
import { isAuthenticated } from "../../lib/utils/cookie";
import { showLoginAlert } from "../../lib/utils/loginAlert";
const HomePage = () => {
  const router = useRouter();
  const { phonesProducts, laptopsProducts, ipadsProducts, smartwatchesProducts, loading } = useHomeProducts();

  const handleFavoriteClick = () => {
    if (isAuthenticated()) {
      router.push("/favourite");
    } else {
      showLoginAlert("You need to login to view favorites");
    }
  };

  const categories = [
    {
      name: "Phones",
      icon: <PhoneOutlined className="text-4xl" />,
      link: "/phones",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-700",
    },
    {
      name: "Laptop",
      icon: <LaptopOutlined className="text-4xl" />,
      link: "/laptops",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-700",
    },
    {
      name: "iPad",
      icon: <TabletOutlined className="text-4xl" />,
      link: "/ipads",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-700",
    },
    {
      name: "Smartwatches",
      icon: <ClockCircleOutlined className="text-4xl" />,
      link: "/smartwatches",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-700",
    },
  ];

  const features = [
    {
      icon: <TruckOutlined className="text-3xl" />,
      title: "Fast Delivery",
      description: "Delivery within 24h in Ho Chi Minh City",
    },
    {
      icon: <SafetyOutlined className="text-3xl" />,
      title: "Official Warranty",
      description: "12-24 months warranty from manufacturer",
    },
    {
      icon: <GiftOutlined className="text-3xl" />,
      title: "Attractive Offers",
      description: "Up to 50% off every week",
    },
    {
      icon: <AudioOutlined className="text-3xl" />,
      title: "24/7 Support",
      description: "Free consultation anytime",
    },
  ];

  const stats = [
    { number: "50K+", label: "Trusted Customers" },
    { number: "10K+", label: "Diverse Products" },
    { number: "99%", label: "Satisfied Customers" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">PhoneHub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">The leading destination for phones, laptops and tech accessories</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-black font-semibold px-8 py-4 h-auto"
                onClick={() => {
                  router.push("/products");
                }}
              >
                <ShoppingCartOutlined className="mr-2" />
                Shop Now
              </Button>
              <Button
                size="large"
                className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 h-auto cursor-pointer"
                onClick={handleFavoriteClick}
              >
                <HeartOutlined className="mr-2" />
                Favorites
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-300 rounded-full opacity-25 animate-pulse"></div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Categories</h2>
            <p className="text-gray-600 text-lg">Explore diverse tech products</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.link}>
                <div
                  className={`${category.bgColor} rounded-2xl p-6 md:p-8 text-center border border-gray-200 hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`${category.iconColor} mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>{category.icon}</div>
                  <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <div className={`w-12 h-1 bg-linear-to-r ${category.color} mx-auto rounded-full`}></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Discover the latest and most popular tech products</p>
          </div> */}

          {/* Phones Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <PhoneOutlined className="mr-3 text-blue-700" />
                Phones
              </h3>
              <Link href="/phones" className="text-blue-700 hover:text-blue-800 font-medium">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {phonesProducts.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Laptops Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <LaptopOutlined className="mr-3 text-green-700" />
                Laptop
              </h3>
              <Link href="/laptops" className="text-green-700 hover:text-green-800 font-medium">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {laptopsProducts.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* iPads Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <TabletOutlined className="mr-3 text-purple-700" />
                iPad & Tablet
              </h3>
              <Link href="/ipads" className="text-purple-700 hover:text-purple-800 font-medium">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {ipadsProducts.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Smartwatches Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <ClockCircleOutlined className="mr-3 text-orange-700" />
                Smartwatches
              </h3>
              <Link href="/smartwatches" className="text-orange-700 hover:text-orange-800 font-medium">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {smartwatchesProducts.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
