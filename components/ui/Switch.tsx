import React, {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * 스위치 활성화 상태
   * @default false
   */
  checked?: boolean;

  /**
   * 스위치 상태 변경시 호출될 함수
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * 스위치 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * 스위치 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * 스위치 색상
   * @default "primary"
   */
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error";

  /**
   * 스위치에 표시할 레이블
   */
  label?: string;

  /**
   * 레이블 위치
   * @default "right"
   */
  labelPosition?: "left" | "right";
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      size = "md",
      disabled = false,
      variant = "primary",
      className,
      label,
      labelPosition = "right",
      defaultChecked = false,
      ...props
    },
    ref
  ) => {
    // 제어/비제어 상태 관리
    const [internalChecked, setInternalChecked] = useState(
      checked !== undefined ? checked : defaultChecked
    );

    // 외부 checked prop이 변경될 때 내부 상태 동기화
    useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    // 스위치 사이즈에 따른 스타일
    const sizeStyles = {
      xs: {
        switch: "w-9 h-5",
        thumb: "h-3.5 w-3.5",
        label: "text-xs",
        translate: "translate-x-3.5",
      },
      sm: {
        switch: "w-11 h-6",
        thumb: "h-4 w-4",
        label: "text-sm",
        translate: "translate-x-5",
      },
      md: {
        switch: "w-13 h-7",
        thumb: "h-5 w-5",
        label: "text-base",
        translate: "translate-x-6",
      },
      lg: {
        switch: "w-16 h-8",
        thumb: "h-6 w-6",
        label: "text-lg",
        translate: "translate-x-8",
      },
      xl: {
        switch: "w-20 h-10",
        thumb: "h-8 w-8",
        label: "text-xl",
        translate: "translate-x-10",
      },
    };

    // 색상에 따른 스타일
    const variantStyles = {
      primary: "bg-[#FF6B35]",
      secondary: "bg-[#2EC4B6]",
      accent: "bg-[#FFBF69]",
      success: "bg-[#22C55E]",
      warning: "bg-[#F59E0B]",
      error: "bg-[#EF4444]",
    };

    // 클릭 핸들러 (커스텀 UI 클릭)
    const handleClick = () => {
      if (disabled) return;

      const newChecked = !internalChecked;
      setInternalChecked(newChecked);

      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }
    };

    // 체크박스 변경 핸들러 (input 요소)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const newChecked = event.target.checked;
      setInternalChecked(newChecked);

      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }
    };

    return (
      <div className={cn("relative inline-flex items-center", className)}>
        {label && labelPosition === "left" && (
          <span
            className={cn(
              "mr-3 font-medium text-neutral-700",
              sizeStyles[size].label
            )}
          >
            {label}
          </span>
        )}

        {/* 스위치 전체 영역을 클릭 가능하게 변경 */}
        <div
          className={cn(
            "relative",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          )}
          onClick={handleClick}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={internalChecked}
            onChange={handleChange}
            disabled={disabled}
            ref={ref}
            {...props}
          />

          {/* 스위치 배경 */}
          <div
            className={cn(
              "block rounded-full transition-colors duration-300 ease-in-out",
              sizeStyles[size].switch,
              internalChecked
                ? variantStyles[variant]
                : "bg-gray-200 dark:bg-gray-700"
            )}
          />

          {/* 스위치 원형 썸 - 동그라미 */}
          <span
            className={cn(
              "absolute block rounded-full bg-white",
              sizeStyles[size].thumb,
              "top-1/2 -translate-y-1/2 left-1",
              "transition-transform duration-300 ease-in-out",
              "shadow-md pointer-events-none",
              internalChecked ? sizeStyles[size].translate : "translate-x-0"
            )}
            aria-hidden="true"
          />
        </div>

        {label && labelPosition === "right" && (
          <span
            className={cn(
              "ml-3 font-medium text-neutral-700",
              sizeStyles[size].label
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
