import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * 입력 필드의 변형 스타일을 지정합니다.
   * @default "default"
   */
  variant?: "default" | "outline" | "ghost";

  /**
   * 입력 필드의 크기를 지정합니다.
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * 입력 필드의 모서리 모양을 지정합니다.
   * @default "rounded"
   */
  shape?: "rounded" | "pill" | "square";

  /**
   * 입력 필드 왼쪽에 표시할 아이콘을 지정합니다.
   */
  leftIcon?: React.ReactNode;

  /**
   * 입력 필드 오른쪽에 표시할 아이콘을 지정합니다.
   */
  rightIcon?: React.ReactNode;

  /**
   * 컨테이너의 전체 너비를 차지할지 여부를 지정합니다.
   * @default true
   */
  fullWidth?: boolean;

  /**
   * 오류 상태를 시각적으로 표시합니다.
   * @default false
   */
  isError?: boolean;

  /**
   * 오류 발생 시 표시할 메시지를 지정합니다.
   */
  errorMessage?: string;

  /**
   * 로딩 상태를 시각적으로 표시합니다.
   * @default false
   */
  isLoading?: boolean;

  /**
   * 입력 필드에 대한 레이블을 지정합니다.
   */
  label?: string;

  /**
   * 필수 입력 필드 여부를 표시합니다.
   * @default false
   */
  isRequired?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      shape = "rounded",
      leftIcon,
      rightIcon,
      fullWidth = true,
      isError = false,
      errorMessage,
      isLoading = false,
      disabled,
      label,
      isRequired = false,
      ...props
    },
    ref
  ) => {
    // 기본 입력 필드 스타일
    const baseStyles =
      "relative block w-full transition-colors duration-200 border bg-white text-neutral-700 shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-neutral-400";

    // 입력 필드 크기에 따른 스타일
    const sizeStyles = {
      xs: "h-6 px-2 text-xs",
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-5 text-lg",
      xl: "h-14 px-6 text-xl",
    };

    // 입력 필드 모양 스타일
    const shapeStyles = {
      rounded: "rounded-lg",
      pill: "rounded-full",
      square: "rounded-none",
    };

    // 입력 필드 변형에 따른 스타일
    const variantStyles = {
      default: cn(
        "border-[#D2D9E0]",
        "focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]",
        isError
          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
          : ""
      ),
      outline: cn(
        "border-2 border-[#D2D9E0]",
        "focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]",
        isError
          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
          : ""
      ),
      ghost: cn(
        "border-transparent bg-[#F5F7FA]",
        "focus:border-[#FF6B35] focus:bg-white focus:ring-1 focus:ring-[#FF6B35]",
        isError
          ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
          : ""
      ),
    };

    // 로딩 스피너
    const LoadingSpinner = (
      <svg
        className="animate-spin h-4 w-4 text-neutral-400"
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
      <div
        className={cn("flex flex-col gap-1", fullWidth ? "w-full" : "w-auto")}
      >
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
            {isRequired && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <input
            ref={ref}
            className={cn(
              baseStyles,
              sizeStyles[size],
              shapeStyles[shape],
              variantStyles[variant],
              leftIcon ? "pl-10" : "",
              rightIcon || isLoading ? "pr-10" : "",
              className
            )}
            disabled={disabled || isLoading}
            {...props}
          />

          {leftIcon && (
            <span className="absolute left-3 inset-y-0 flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          {isLoading && (
            <span className="absolute right-3 inset-y-0 flex items-center justify-center">
              {LoadingSpinner}
            </span>
          )}

          {!isLoading && rightIcon && (
            <span className="absolute right-3 inset-y-0 flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {isError && errorMessage && (
          <p className="text-[#EF4444] text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
