import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 변형
   * @default "primary"
   */
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "outline"
    | "ghost"
    | "link"
    |"destructive";

  /**
   * 버튼 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * 버튼 모양
   * @default "rounded"
   */
  shape?: "rounded" | "pill" | "square";

  /**
   * 버튼 왼쪽에 표시할 아이콘
   */
  leftIcon?: React.ReactNode;

  /**
   * 버튼 오른쪽에 표시할 아이콘
   */
  rightIcon?: React.ReactNode;

  /**
   * 전체 너비 차지 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 로딩 상태 표시
   * @default false
   */
  isLoading?: boolean;

  /**
   * 로딩 중일 때 표시할 텍스트입니다
   * @default "Loading..."
   */
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      shape = "rounded",
      leftIcon,
      rightIcon,
      fullWidth = false,
      isLoading = false,
      loadingText = "Loading...",
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    // 기본 버튼 스타일
    const baseStyles =
      "relative inline-flex items-center justify-center border font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    // 버튼 크기에 따른 스타일
    const sizeStyles = {
      xs: "h-6 px-2 text-xs gap-1.5",
      sm: "h-8 px-3 text-sm gap-2",
      md: "h-10 px-4 text-base gap-2",
      lg: "h-12 px-5 text-lg gap-2.5",
      xl: "h-14 px-6 text-xl gap-3",
    };

    // 버튼 모양 스타일
    const shapeStyles = {
      rounded: "rounded-lg",
      pill: "rounded-full",
      square: "rounded-none",
    };

    // 버튼 변형에 따른 스타일
    const variantStyles = {
      primary: cn(
        "bg-[#FF6B35] text-white border-transparent",
        "hover:bg-[#E55A24] active:bg-[#CC4A14]",
        "focus-visible:ring-[#FF6B35]",
        "disabled:bg-[#FFD6C7]"
      ),
      secondary: cn(
        "bg-[#2EC4B6] text-white border-transparent",
        "hover:bg-[#25A396] active:bg-[#1C837A]",
        "focus-visible:ring-[#2EC4B6]",
        "disabled:bg-[#C2EBE7]"
      ),
      accent: cn(
        "bg-[#FFBF69] text-[#333F48] border-transparent",
        "hover:bg-[#FFAD3C] active:bg-[#FF9B0F]",
        "focus-visible:ring-[#FFBF69]",
        "disabled:bg-[#FFE9C7]"
      ),
      success: cn(
        "bg-[#22C55E] text-white border-transparent",
        "hover:bg-opacity-90 active:bg-opacity-80",
        "focus-visible:ring-[#22C55E]",
        "disabled:opacity-50"
      ),
       destructive: cn(
    "bg-[#EF4444] text-white border-transparent",
    "hover:bg-[#DC2626] active:bg-[#B91C1C]",
    "focus-visible:ring-[#EF4444]",
    "disabled:opacity-50"
  ),
      warning: cn(
        "bg-[#F59E0B] text-white border-transparent",
        "hover:bg-opacity-90 active:bg-opacity-80",
        "focus-visible:ring-[#F59E0B]",
        "disabled:opacity-50"
      ),
      error: cn(
        "bg-[#EF4444] text-white border-transparent",
        "hover:bg-opacity-90 active:bg-opacity-80",
        "focus-visible:ring-[#EF4444]",
        "disabled:opacity-50"
      ),
      outline: cn(
        "bg-transparent border-2 border-[#D2D9E0] text-[#333F48]",
        "hover:bg-[#F5F7FA] active:bg-[#E9ECF0]",
        "focus-visible:ring-[#333F48]",
        "disabled:border-[#E9ECF0] disabled:text-[#8B97A3]"
      ),
      ghost: cn(
        "bg-transparent text-[#333F48] border-transparent",
        "hover:bg-[#F5F7FA] active:bg-[#E9ECF0]",
        "focus-visible:ring-[#333F48]",
        "disabled:text-[#8B97A3]"
      ),
      link: cn(
        "bg-transparent text-[#FF6B35] p-0 h-auto border-transparent",
        "hover:text-[#E55A24] hover:underline active:text-[#CC4A14]",
        "focus-visible:ring-[#FF6B35]",
        "disabled:text-[#FFD6C7] disabled:no-underline",
        "shadow-none"
      ),
    };

    // 로딩 스피너
    const LoadingSpinner = (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          shapeStyles[shape],
          variantStyles[variant],
          "transform hover:scale-[1.02] active:scale-[0.98] motion-safe:transition-transform",
          {
            "w-full": fullWidth,
            "cursor-not-allowed opacity-70": isLoading,
          },
          "overflow-hidden",
          className
        )}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...props}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {isLoading && LoadingSpinner}
          {!isLoading && leftIcon && <span>{leftIcon}</span>}
          <span>{isLoading && loadingText ? loadingText : children}</span>
          {!isLoading && rightIcon && <span>{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
