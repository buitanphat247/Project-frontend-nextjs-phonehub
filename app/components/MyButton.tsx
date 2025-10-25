import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";

// Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
export type ButtonSize = 'small' | 'medium' | 'large'

// Props interface - extends Ant Design Button props
export interface MyButtonProps extends Omit<AntButtonProps, 'size' | 'type' | 'variant' | 'iconPosition'> {
  // Basic props
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  htmlType?: 'button' | 'submit' | 'reset'
  
  // Styling props
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  
  // Icon props
  icon?: React.ReactNode
  
  // Custom styling
  className?: string
  style?: React.CSSProperties
}

const MyButton: React.FC<MyButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  htmlType = "button",
  variant = "primary",
  size = "medium",
  block = false,
  icon,
  className = "",
  style,
  ...antProps
}) => {
  // Map custom variant to Ant Design type
  const getAntType = () => {
    const typeMap = {
      primary: "primary",
      secondary: "default",
      success: "primary",
      warning: "primary",
      danger: "primary",
      info: "default",
      text: "text",
    };
    return typeMap[variant] || "primary";
  };

  // Map custom size to Ant Design size
  const getAntSize = () => {
    const sizeMap = {
      small: "small",
      medium: "middle",
      large: "large",
    };
    return sizeMap[size] || "middle";
  };

  // Get custom styles for variants
  const getCustomStyles = () => {
    const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
      primary: {},
      success: { backgroundColor: "#10b981", borderColor: "#10b981" },
      warning: { backgroundColor: "#f59e0b", borderColor: "#f59e0b" },
      danger: { backgroundColor: "#ef4444", borderColor: "#ef4444" },
      info: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
      secondary: { backgroundColor: "#f3f4f6", borderColor: "#d1d5db", color: "#374151" },
      text: {},
    };
    return variantStyles[variant] || {};
  };

  return (
    <AntButton
      type={getAntType() as any}
      size={getAntSize() as any}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      htmlType={htmlType}
      block={block}
      icon={icon}
      className={className}
      style={{ ...getCustomStyles(), ...style }}
      {...antProps}
    >
      {children}
    </AntButton>
  );
};

export default MyButton;
