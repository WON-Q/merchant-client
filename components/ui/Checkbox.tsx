import React, { forwardRef, useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "checked" | "defaultChecked"
  > {
  /**
   * 체크박스 선택 상태 또는 기본 선택 상태
   * <br />
   * 함수가 제공되면 제어 컴포넌트로 동작하고,
   * 함수 없이 boolean만 제공되면 비제어 컴포넌트로 동작합니다.
   * @default false
   */
  checked?: boolean;

  /**
   * 체크박스 상태 변경시 호출될 함수
   * <br />
   * 이 함수가 제공되면 컴포넌트는 제어 모드로 동작합니다.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * 체크박스 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * 체크박스 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * 체크박스 색상
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
   * 체크박스 레이블
   */
  label?: string;

  /**
   * 레이블 위치
   * @default "right"
   */
  labelPosition?: "left" | "right";
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      size = "md",
      disabled = false,
      variant = "primary",
      label,
      labelPosition = "right",
      id: providedId,
      ...props
    },
    ref
  ) => {
    // 고유 ID 생성 (접근성 향상을 위함)
    const generatedId = useId();
    const id = providedId || `checkbox-${generatedId}`;

    // 체크박스 내부 상태 관리
    const [internalChecked, setInternalChecked] = useState(checked);

    // 제어/비제어 컴포넌트 처리
    const isControlled = !!onCheckedChange;
    const checkboxChecked = isControlled ? checked : internalChecked;

    // checked prop이 변경되면 내부 상태 업데이트
    useEffect(() => {
      setInternalChecked(checked);
    }, [checked]);

    // 내부 참조 생성
    const innerRef = React.useRef<HTMLInputElement>(null);

    // ref 병합 함수
    const mergeRefs = (node: HTMLInputElement | null) => {
      if (innerRef) innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) {
        ref.current = node;
      }
    };

    // 체크박스 변경 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;

      // 비제어 컴포넌트일 경우 내부 상태 업데이트
      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      // 콜백 호출
      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }
    };

    // 직접 체크박스 클릭 핸들러
    const handleCheckboxClick = (event: React.MouseEvent) => {
      if (disabled) return;

      // 이벤트 버블링 방지
      event.stopPropagation();

      // 내부 input 요소에 클릭 이벤트 전달
      if (innerRef.current) {
        innerRef.current.click();
      }
    };

    // 크기별 스타일 매핑
    const sizeClasses = {
      xs: {
        checkbox: "h-3 w-3 min-w-[0.75rem]",
        label: "text-xs",
        icon: "h-2 w-2",
      },
      sm: {
        checkbox: "h-4 w-4 min-w-[1rem]",
        label: "text-sm",
        icon: "h-2.5 w-2.5",
      },
      md: {
        checkbox: "h-5 w-5 min-w-[1.25rem]",
        label: "text-base",
        icon: "h-3 w-3",
      },
      lg: {
        checkbox: "h-6 w-6 min-w-[1.5rem]",
        label: "text-lg",
        icon: "h-3.5 w-3.5",
      },
      xl: {
        checkbox: "h-7 w-7 min-w-[1.75rem]",
        label: "text-xl",
        icon: "h-4 w-4",
      },
    };

    // 색상별 스타일 매핑
    const variantClasses = {
      primary: {
        bg: "bg-[#FF6B35]",
        border: "border-[#FF6B35]",
        text: "text-white",
      },
      secondary: {
        bg: "bg-[#2EC4B6]",
        border: "border-[#2EC4B6]",
        text: "text-white",
      },
      accent: {
        bg: "bg-[#FFBF69]",
        border: "border-[#FFBF69]",
        text: "text-[#333F48]",
      },
      success: {
        bg: "bg-[#22C55E]",
        border: "border-[#22C55E]",
        text: "text-white",
      },
      warning: {
        bg: "bg-[#F59E0B]",
        border: "border-[#F59E0B]",
        text: "text-white",
      },
      error: {
        bg: "bg-[#EF4444]",
        border: "border-[#EF4444]",
        text: "text-white",
      },
    };

    return (
      <div
        className={cn("flex items-center", disabled && "opacity-50", className)}
      >
        {/* 왼쪽 레이블 */}
        {label && labelPosition === "left" && (
          <label
            htmlFor={id}
            className={cn(
              "mr-2 font-medium text-neutral-700 select-none",
              sizeClasses[size].label,
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            {label}
          </label>
        )}

        {/* 체크박스 컨테이너 - 고정된 크기를 유지 */}
        <div
          className={cn(
            "relative flex items-center justify-center",
            sizeClasses[size].checkbox
          )}
        >
          {/* 실제 HTML 체크박스 (화면에 보이지 않음) */}
          <input
            id={id}
            type="checkbox"
            ref={mergeRefs}
            checked={checkboxChecked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only" // 화면에서 숨기지만 접근성 유지
            {...props}
          />

          {/* 시각적 체크박스 - 직접 클릭 가능하게 함 */}
          <div
            onClick={handleCheckboxClick}
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-md border-2 transition-colors",
              "border-[#D2D9E0] bg-white",
              checkboxChecked && [
                variantClasses[variant].bg,
                variantClasses[variant].border,
              ],
              !disabled
                ? "cursor-pointer hover:border-neutral-400"
                : "cursor-not-allowed",
              "z-10" // 이 레이어가 최상위에 와야 클릭 이벤트를 받을 수 있음
            )}
            aria-hidden="true"
          >
            {/* 체크 아이콘 */}
            {checkboxChecked && (
              <Check
                className={cn(
                  "stroke-[3]",
                  variantClasses[variant].text,
                  sizeClasses[size].icon
                )}
              />
            )}
          </div>
        </div>

        {/* 오른쪽 레이블 */}
        {label && labelPosition === "right" && (
          <label
            htmlFor={id}
            className={cn(
              "ml-2 font-medium text-neutral-700 select-none",
              sizeClasses[size].label,
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
