"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Phones", href: "/phones" },
  { name: "Laptops", href: "/laptops" },
  { name: "iPads", href: "/ipads" },
  { name: "Smartwatches", href: "/smartwatches" },
  { name: "About Us", href: "/about" },
];


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    // Special handling for product categories
    if (href === "/products") {
      return pathname === "/products" || pathname.startsWith("/products/");
    }

    // For other links, check if pathname starts with href
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Navigation Menu - Desktop */}
      <nav className="hidden md:flex space-x-8 py-4 border-t border-gray-200">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`font-medium transition-colors py-2 px-3 rounded-lg text-inherit! ${
              isActive(item.href) ? "text-blue-700! bg-blue-50 border-b-2 border-blue-600" : "text-gray-700! hover:text-gray-900! hover:bg-gray-50"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <nav className="py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-colors font-medium text-inherit! ${
                  isActive(item.href) ? "text-blue-700! bg-blue-100 border-l-4 border-blue-600" : "text-gray-700! hover:text-gray-900! hover:bg-gray-100"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
