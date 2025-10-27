import React from 'react';
import { Order } from '../interface/IAccount';

interface OrdersTabProps {
  orders: Order[];
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                  📱
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{order.product}</h4>
                  <p className="text-sm text-gray-500">
                    Đơn hàng #{order.id} - {order.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-lg">{order.total.toLocaleString("vi-VN")}đ</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Đã giao"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Đang giao"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;
