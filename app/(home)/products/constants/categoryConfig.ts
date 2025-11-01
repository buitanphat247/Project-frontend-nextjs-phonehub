export const categoryConfig = {
  phones: {
    label: 'Điện Thoại',
    title: 'Điện Thoại',
  },
  laptops: {
    label: 'Laptop',
    title: 'Laptop',
  },
  ipads: {
    label: 'iPad',
    title: 'iPad',
  },
  smartwatches: {
    label: 'Đồng hồ thông minh',
    title: 'Đồng hồ thông minh',
  },
  accessories: {
    label: 'Phụ Kiện',
    title: 'Phụ Kiện',
  },
  all: {
    label: 'Tất Cả Sản Phẩm',
    title: 'Tất Cả Sản Phẩm',
  },
} as const

export type CategoryKey = keyof typeof categoryConfig

