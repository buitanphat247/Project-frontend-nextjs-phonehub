interface ProductBreadcrumbProps {
  category: string
  productName: string
}

const ProductBreadcrumb = ({ category, productName }: ProductBreadcrumbProps) => {
  return (
    <nav className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li><a href="/" className="hover:text-blue-700 cursor-pointer">Trang chủ</a></li>
        <li>/</li>
        <li><a href={`/${category}`} className="hover:text-blue-700 capitalize cursor-pointer">{category}</a></li>
        <li>/</li>
        <li className="text-gray-900">{productName}</li>
      </ol>
    </nav>
  )
}

export default ProductBreadcrumb
