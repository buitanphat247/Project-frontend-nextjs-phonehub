/**
 * Trusted Types Utilities
 * Hỗ trợ tạo TrustedHTML và TrustedScript cho Trusted Types policy
 */

// Type definitions cho Trusted Types
// Định nghĩa đầy đủ vì có thể DOM types chưa có sẵn
type TrustedHTML = string & { readonly __brand: unique symbol };
type TrustedScript = string & { readonly __brand: unique symbol };
type TrustedScriptURL = string & { readonly __brand: unique symbol };

interface TrustedTypePolicy {
  createHTML: (html: string) => TrustedHTML;
  createScript: (script: string) => TrustedScript;
  createScriptURL: (url: string) => TrustedScriptURL;
}

interface TrustedTypePolicyOptions {
  createHTML?: (html: string) => string;
  createScript?: (script: string) => string;
  createScriptURL?: (url: string) => string;
}

declare global {
  interface Window {
    trustedTypes?: {
      createPolicy: (name: string, policy: TrustedTypePolicyOptions) => TrustedTypePolicy;
      defaultPolicy?: TrustedTypePolicy;
    };
  }
}

// Tạo Trusted Types policy nếu chưa có
let trustedTypesPolicy: TrustedTypePolicy | null = null;
let policyInitialized = false;

function initializePolicy() {
  if (policyInitialized) return;
  policyInitialized = true;

  if (typeof window !== 'undefined' && window.trustedTypes) {
    try {
      // Kiểm tra xem policy đã tồn tại chưa
      if (window.trustedTypes.defaultPolicy) {
        trustedTypesPolicy = window.trustedTypes.defaultPolicy;
        return;
      }

      // Tạo policy với tên 'default' (khớp với CSP config)
      trustedTypesPolicy = window.trustedTypes.createPolicy('default', {
        createHTML: (html: string) => {
          // Sanitize HTML nếu cần (có thể dùng DOMPurify)
          return html;
        },
        createScript: (script: string) => {
          return script;
        },
        createScriptURL: (url: string) => {
          return url;
        },
      });
    } catch (error) {
      console.warn('Failed to create Trusted Types policy:', error);
    }
  }
}

// Khởi tạo policy ngay khi module được load (client-side)
// Chỉ chạy ở client-side, không chạy ở server-side
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Đợi DOM ready để đảm bảo window.trustedTypes đã sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePolicy);
  } else {
    initializePolicy();
  }
}

/**
 * Tạo TrustedHTML từ string
 * Sử dụng khi cần set innerHTML hoặc dangerouslySetInnerHTML
 */
export function createTrustedHTML(html: string): string | TrustedHTML {
  if (typeof window === 'undefined') {
    return html;
  }

  // Đảm bảo policy đã được khởi tạo
  initializePolicy();

  if (trustedTypesPolicy) {
    try {
      return trustedTypesPolicy.createHTML(html);
    } catch (error) {
      console.warn('Failed to create TrustedHTML:', error);
      return html;
    }
  }

  // Fallback nếu Trusted Types không được hỗ trợ
  return html;
}

/**
 * Tạo TrustedScript từ string
 * Sử dụng khi cần set script content
 */
export function createTrustedScript(script: string): string | TrustedScript {
  if (typeof window === 'undefined') {
    return script;
  }

  if (trustedTypesPolicy) {
    try {
      return trustedTypesPolicy.createScript(script);
    } catch (error) {
      console.warn('Failed to create TrustedScript:', error);
      return script;
    }
  }

  return script;
}

/**
 * Helper để tạo object cho dangerouslySetInnerHTML với TrustedHTML
 */
export function createDangerousHTML(html: string): { __html: string | TrustedHTML } {
  return {
    __html: createTrustedHTML(html),
  };
}

