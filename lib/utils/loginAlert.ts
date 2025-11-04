import Swal from 'sweetalert2'

// Alert về home - chỉ có 1 nút, không thể đóng
export const showLoginRequired = (description: string = 'Bạn không có quyền truy cập trang này') => {
  return Swal.fire({
    icon: 'warning',
    title: 'Quay về trang chủ',
    text: description,
    showCancelButton: false,
    confirmButtonText: 'Quay về trang chủ',
    confirmButtonColor: '#1890ff',
    width: 600,
    buttonsStyling: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: true,
    focusConfirm: true
  })
}

// Alert yêu cầu đăng nhập - có 2 nút: Đăng nhập và Đóng
export const showLoginAlert = (description: string = 'Bạn cần đăng nhập để thêm các sản phẩm yêu thích') => {
  return Swal.fire({
    icon: 'warning',
    title: 'Bạn cần đăng nhập',
    text: description,
    showCancelButton: true,
    confirmButtonText: 'Đăng nhập',
    cancelButtonText: 'Đóng',
    confirmButtonColor: '#1890ff',
    cancelButtonColor: '#8c8c8c',
    width: 600,
    buttonsStyling: true,
    reverseButtons: false,
    allowOutsideClick: true,
    allowEscapeKey: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Chỉ dispatch event để Header mở AuthModal, không thay đổi URL
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('openAuthModal'))
      }
    }
    return result
  })
}

export const showAccessDenied = (message: string = 'Bạn không có quyền truy cập trang này') => {
  return Swal.fire({
    icon: 'error',
    title: 'Không có quyền truy cập',
    text: message,
    showCancelButton: false,
    confirmButtonText: 'Về trang chủ',
    confirmButtonColor: '#1890ff',
    width: 600,
    buttonsStyling: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: true,
    focusConfirm: true
  })
}
