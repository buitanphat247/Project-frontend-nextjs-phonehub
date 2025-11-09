"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { createDangerousHTML } from "@/lib/utils/trustedTypes";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Phones", href: "/phones" },
  { name: "Laptops", href: "/laptops" },
  { name: "iPads", href: "/ipads" },
  { name: "Smartwatches", href: "/smartwatches" },
  { name: "About Us", href: "/about" },
];


interface NavigationProps {
  isMenuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  authenticated?: boolean;
}

export default function Navigation({ isMenuOpen: externalIsMenuOpen, onMenuOpenChange, authenticated = false }: NavigationProps) {
  const [internalIsMenuOpen, setInternalIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Use external state if provided, otherwise use internal state
  const isMenuOpen = externalIsMenuOpen !== undefined ? externalIsMenuOpen : internalIsMenuOpen;
  const setIsMenuOpen = (open: boolean) => {
    if (onMenuOpenChange) {
      onMenuOpenChange(open);
    } else {
      setInternalIsMenuOpen(open);
    }
  };

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

  // Close menu function with animation
  const closeMenu = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsMenuOpen(false)
      setIsClosing(false)
    }, 300) // Match animation duration
  }

  // Open auth modal
  const handleOpenAuthModal = (tab: 'signin' | 'signup' = 'signin') => {
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { tab } }))
    closeMenu()
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen && !isClosing) {
      // Sử dụng requestAnimationFrame để tránh forced reflow
      requestAnimationFrame(() => {
        document.body.style.overflow = 'hidden'
      })

      // Handle ESC key to close menu
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isClosing) {
          closeMenu()
        }
      }

      document.addEventListener('keydown', handleEsc)
      return () => {
        document.removeEventListener('keydown', handleEsc)
        requestAnimationFrame(() => {
          document.body.style.overflow = 'unset'
        })
      }
    } else {
      requestAnimationFrame(() => {
        document.body.style.overflow = 'unset'
      })
    }
  }, [isMenuOpen, isClosing])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !isClosing) {
        closeMenu()
      }
    }

    if (isMenuOpen && !isClosing) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isMenuOpen, isClosing])

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

      {/* Mobile Menu Button - Hidden */}
      {/* <div className="md:hidden flex justify-end">
        <button
          onClick={() => {
            if (isMenuOpen) {
              closeMenu()
            } else {
              setIsMenuOpen(true)
            }
          }}
          className="p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div> */}

      {/* Mobile Menu Overlay - Fixed position với animation */}
      {isMenuOpen && (
        <>
          <style dangerouslySetInnerHTML={createDangerousHTML(`
              @keyframes slideInLeft {
                from {
                  transform: translateX(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              
              @keyframes slideOutLeft {
                from {
                  transform: translateX(0);
                  opacity: 1;
                }
                to {
                  transform: translateX(-100%);
                  opacity: 0;
                }
              }
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              
              @keyframes fadeOut {
                from {
                  opacity: 1;
                }
                to {
                  opacity: 0;
                }
              }
              
              .mobile-nav-enter {
                animation: slideInLeft 0.3s ease-out forwards;
              }
              
              .mobile-nav-exit {
                animation: slideOutLeft 0.3s ease-in forwards;
              }
              
              .mobile-nav-overlay-enter {
                animation: fadeIn 0.2s ease-out forwards;
              }
              
              .mobile-nav-overlay-exit {
                animation: fadeOut 0.2s ease-in forwards;
              }
            `)} />
          
          {/* Backdrop overlay */}
          <div 
            className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isClosing ? 'mobile-nav-overlay-exit' : 'mobile-nav-overlay-enter'}`}
            onClick={closeMenu}
          />
          
          {/* Mobile Menu - Fixed position */}
          <div 
            ref={menuRef}
            className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 md:hidden shadow-xl overflow-y-auto ${isClosing ? 'mobile-nav-exit' : 'mobile-nav-enter'}`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Đóng menu"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            <nav className="py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 mx-2 rounded-lg transition-colors font-medium text-inherit! ${
                    isActive(item.href) 
                      ? "text-blue-700! bg-blue-100 border-l-4 border-blue-600" 
                      : "text-gray-700! hover:text-gray-900! hover:bg-gray-100"
                  }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Auth Buttons - Only show when not authenticated */}
              {!authenticated && (
                <div className="px-4 pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => handleOpenAuthModal('signin')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <UserOutlined />
                    <span>Đăng nhập</span>
                  </button>
                  <button
                    onClick={() => handleOpenAuthModal('signup')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <span>Đăng ký</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
