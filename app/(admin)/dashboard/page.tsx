"use client";

import React from "react";
import { Card, Row, Col, Statistic, Input, Space } from "antd";
import { UserOutlined, ShoppingOutlined, DollarOutlined, RiseOutlined, SearchOutlined } from "@ant-design/icons";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <Space>
          <Input placeholder="Tìm kiếm theo tên hoặc slug" prefix={<SearchOutlined />} style={{ width: 300 }} allowClear />
        </Space>
      </div>

      <div>
        {/* Thống empesa tổng quan */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng người dùng" value={1250} prefix={<UserOutlined />} valueStyle={{ color: "#3f8600" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Đơn hàng" value={856} prefix={<ShoppingOutlined />} valueStyle={{ color: "#1890ff" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Doanh thu (VNĐ)" value={125000000} prefix={<DollarOutlined />} valueStyle={{ color: "#cf1322" }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Tăng trưởng (%)" value={11.28} prefix={<RiseOutlined />} suffix="%" valueStyle={{ color: "#3f8600" }} />
            </Card>
          </Col>
        </Row>

        {/* Card thống kê khác */}
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Đơn hàng gần đây" bordered={false}>
              <p>Đang cập nhật...</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Sản phẩm bán chạy" bordered={false}>
              <p>Đang cập nhật...</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
