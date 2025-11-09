interface ProductBreadcrumbProps {
  category: string
  productName: string
}

const ProductBreadcrumb = ({ category, productName }: ProductBreadcrumbProps) => {
  return (
    <nav className="mb-4 overflow-hidden">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 flex-nowrap">
        <li className="shrink-0"><a href="/" className="hover:text-blue-700 cursor-pointer whitespace-nowrap">Trang chủ</a></li>
        <li className="shrink-0">/</li>
        <li className="shrink-0"><a href={`/${category}`} className="hover:text-blue-700 capitalize cursor-pointer whitespace-nowrap">{category}</a></li>
        <li className="shrink-0">/</li>
        <li className="text-gray-900 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" title={productName}>{productName}</li>
      </ol>
    </nav>
  )
}

export default ProductBreadcrumb
