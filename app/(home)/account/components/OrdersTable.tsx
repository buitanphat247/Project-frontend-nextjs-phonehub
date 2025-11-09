"use client";

import React from "react";
import { Button } from "antd";
import { OrderDetailResponse } from "../../../../lib/api/orders";
import { OrderItemReviewInfo } from "../hooks/useAccountData";

interface OrdersTableProps {
  orders: OrderDetailResponse[];
  ordersLoading: boolean;
  ordersTotal: number;
  ordersPage: number;
  ordersSize: number;
  onPageChange: (page: number) => void;
  productReviews: Map<number, OrderItemReviewInfo[]>;
  onReviewClick: (orderId: number, orderItemId: number, productId: number) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  ordersLoading,
  ordersTotal,
  ordersPage,
  ordersSize,
  onPageChange,
  productReviews,
  onReviewClick,
}) => {
  // Check if user has reviewed a product
  const hasUserReviewed = (orderItem: OrderDetailResponse["items"][number] | undefined): boolean => {
    if (!orderItem) return false;
    const directFlag = orderItem.isReviewed || Boolean(orderItem.reviewId);
    if (directFlag) return true;
    const reviews = productReviews.get(orderItem.productId) || [];
    return reviews.some((review) => (review as any).orderItemId === orderItem.id);
  };

  if (ordersLoading) {
    return (
      <div className="overflow-x-auto">
        {/* Table skeleton */}
        <table className="min-w-full table-auto border-collapse border-0">
          <thead>
            <tr className="bg-gray-50">
              {[...Array(6)].map((_, index) => (
                <th key={index} className="px-4 py-2 border-0">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(6)].map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 border-0">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination skeleton */}
        <div className="pt-4 flex justify-end gap-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="text-gray-600">Bạn chưa có đơn hàng nào.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border-0">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-0">Mã đơn</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-0">Trạng thái</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-0">Ngày tạo</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-0">Sản phẩm</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-0">Bình luận</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 border-0">Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium border-0">{o.id}</td>
              <td className="px-4 py-3 text-sm capitalize border-0">
                <span className={`${o.status === 'success' ? 'text-green-700' : o.status === 'failed' ? 'text-red-600' : 'text-gray-700'}`}>{o.status}</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 border-0">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
              <td className="px-4 py-3 text-sm text-gray-700 border-0">
                <div className="space-y-1">
                  {o.items?.map((it) => (
                    <div key={it.id}>{`${it.productName} x ${it.quantity}`}</div>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 border-0">
                <div className="space-y-2">
                  {o.items?.map((it) => {
                    const isOrderSuccess = o.status?.toLowerCase() === 'success';
                    const hasReviewed = hasUserReviewed(it);
                    return (
                      <div key={it.id}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => onReviewClick(o.id, it.id, it.productId)}
                          disabled={!isOrderSuccess || hasReviewed}
                          className="text-xs"
                        >
                          {hasReviewed ? "Đã đánh giá" : "Đánh giá"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-right font-semibold text-blue-700 border-0">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pt-4 flex justify-end gap-2 text-sm">
        <button 
          disabled={ordersPage === 0} 
          onClick={() => onPageChange(Math.max(0, ordersPage - 1))} 
          className={`px-3 py-1 rounded border ${ordersPage === 0 ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-50 border-gray-300'}`}
        >
          Trước
        </button>
        <div className="self-center text-gray-600">
          Trang {ordersPage + 1} / {Math.max(1, Math.ceil(ordersTotal / ordersSize))}
        </div>
        <button 
          disabled={(ordersPage + 1) >= Math.ceil(ordersTotal / ordersSize)} 
          onClick={() => onPageChange(ordersPage + 1)} 
          className={`px-3 py-1 rounded border ${(ordersPage + 1) >= Math.ceil(ordersTotal / ordersSize) ? 'text-gray-400 border-gray-200' : 'text-gray-700 hover:bg-gray-50 border-gray-300'}`}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;

