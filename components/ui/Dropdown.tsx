import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  Children,
  isValidElement,
  cloneElement,
  ReactElement,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { DropdownMenuItemProps } from "./DropdownMenuItem";

export interface DropdownProps {
  /**
   * 현재 선택된 값
   */
  value?: string;

  /**
   * 기본 선택 값
   */
  defaultValue?: string;

  /**
   * 값이 변경될 때 호출되는 함수
   */
  onChange?: (value: string) => void;

  /**
   * 드롭다운의 시각적 스타일
   * @default "default"
   */
  variant?: "default" | "outline" | "ghost";

  /**
   * 드롭다운의 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * 드롭다운의 모양
   * @default "rounded"
   */
  shape?: "rounded" | "pill" | "square";

  /**
   * 전체 너비 차지 여부
   * @default true
   */
  fullWidth?: boolean;

  /**
   * 오류 상태 표시
   * @default false
   */
  isError?: boolean;

  /**
   * 오류 메시지
   */
  errorMessage?: string;

  /**
   * 로딩 상태 표시
   * @default false
   */
  isLoading?: boolean;

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * 드롭다운에 대한 레이블
   */
  label?: string;

  /**
   * 필수 선택 필드 여부
   * @default false
   */
  isRequired?: boolean;

  /**
   * placeholder로 사용될 옵션 텍스트
   */
  placeholder?: string;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * id 속성
   */
  id?: string;

  /**
   * name 속성
   */
  name?: string;

  /**
   * DropdownMenuItem 컴포넌트들을 자식으로 받습니다
   */
  children?: React.ReactNode;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({
    value: controlledValue,
    defaultValue,
    onChange,
    className,
    variant = "default",
    size = "md",
    shape = "rounded",
    fullWidth = true,
    isError = false,
    errorMessage,
    isLoading = false,
    disabled = false,
    label,
    isRequired = false,
    placeholder,
    id,
    name,
    children,
  }) => {
    // 드롭다운 열림/닫힘 상태
    const [isOpen, setIsOpen] = useState(false);

    // 내부적으로 관리되는 선택값
    const [selectedValue, setSelectedValue] = useState(defaultValue || "");

    // 드롭다운 참조
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 제어 컴포넌트 지원
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : selectedValue;

    // 자식 DropdownMenuItem 컴포넌트에서 정보 추출
    const menuItems: {
      value: string;
      label: React.ReactNode;
      disabled?: boolean;
    }[] = [];

    Children.forEach(children, (child) => {
      if (
        isValidElement<DropdownMenuItemProps>(child) &&
        child.props?.value !== undefined
      ) {
        menuItems.push({
          value: child.props.value,
          label: child.props.children,
          disabled: child.props.disabled,
        });
      }
    });

    // 선택된 옵션 라벨 표시
    const selectedItem = menuItems.find((item) => item.value === currentValue);
    const displayText = selectedItem
      ? typeof selectedItem.label === "string"
        ? selectedItem.label
        : "Selected"
      : placeholder || "선택하세요";

    // 외부 클릭 감지하여 드롭다운 닫기
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // 값이 변경되었을 때
    const handleSelect = (value: string) => {
      if (!isControlled) {
        setSelectedValue(value);
      }
      if (onChange) {
        onChange(value);
      }
      setIsOpen(false);
    };

    // 기본 선택 필드 스타일
    const baseStyles =
      "relative block w-full transition-colors duration-200 border bg-white text-neutral-700 shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    // 선택 필드 크기에 따른 스타일
    const sizeStyles = {
      xs: "h-6 px-2 text-xs",
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-5 text-lg",
      xl: "h-14 px-6 text-xl",
    };

    // 드롭다운 메뉴 max-height
    const dropdownSizeStyles = {
      xs: "max-h-36",
      sm: "max-h-48",
      md: "max-h-60",
      lg: "max-h-72",
      xl: "max-h-80",
    };

    // 옵션 아이템 크기
    const optionSizeStyles = {
      xs: "py-1 px-2 text-xs",
      sm: "py-1.5 px-3 text-sm",
      md: "py-2 px-4 text-base",
      lg: "py-2.5 px-5 text-lg",
      xl: "py-3 px-6 text-xl",
    };

    // 선택 필드 모양 스타일
    const shapeStyles = {
      rounded: "rounded-lg",
      pill: "rounded-full",
      square: "rounded-none",
    };

    // 드롭다운 모양 스타일
    const dropdownShapeStyles = {
      rounded: "rounded-md",
      pill: "rounded-lg",
      square: "rounded-none",
    };

    // 선택 필드 변형에 따른 스타일
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

    // 히든 select 요소 추가 (form 제출용)
    const hiddenSelectInput = (
      <select
        id={id}
        name={name}
        value={currentValue}
        onChange={(e) => handleSelect(e.target.value)}
        className="sr-only"
        aria-hidden="true"
      >
        {menuItems.map((item) => (
          <option
            key={`hidden-${item.value}`}
            value={item.value}
            disabled={item.disabled}
          >
            {typeof item.label === "string" ? item.label : "Option"}
          </option>
        ))}
      </select>
    );

    // 라벨 ID 생성
    const labelId = id ? `${id}-label` : undefined;

    return (
      <div
        className={cn("flex flex-col gap-1", fullWidth ? "w-full" : "w-auto")}
      >
        {label && (
          <label id={labelId} className="text-sm font-medium text-neutral-700">
            {label}
            {isRequired && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}

        <div className="relative w-full" ref={dropdownRef}>
          {/* 히든 셀렉트 (form 제출용) */}
          {hiddenSelectInput}

          {/* 커스텀 셀렉트 UI */}
          <div
            className={cn(
              baseStyles,
              sizeStyles[size],
              shapeStyles[shape],
              variantStyles[variant],
              "flex items-center justify-between cursor-pointer",
              isOpen ? "ring-1 ring-[#FF6B35] border-[#FF6B35]" : "",
              isError ? "border-[#EF4444] ring-[#EF4444]" : "",
              disabled || isLoading ? "opacity-60 cursor-not-allowed" : "",
              className
            )}
            onClick={() => {
              if (!disabled && !isLoading) {
                setIsOpen(!isOpen);
              }
            }}
            tabIndex={0}
            role="combobox"
            aria-controls={isOpen ? `${id || "select"}-options` : undefined}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={labelId}
          >
            <span
              className={cn("truncate", !currentValue && "text-neutral-400")}
            >
              {displayText}
            </span>

            <div className="flex items-center">
              {isLoading ? (
                LoadingSpinner
              ) : (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-neutral-500 transition-transform",
                    isOpen ? "transform rotate-180" : ""
                  )}
                />
              )}
            </div>
          </div>

          {/* 드롭다운 메뉴 */}
          {isOpen && (
            <div
              id={`${id || "select"}-options`}
              className={cn(
                "absolute z-10 w-full mt-1 bg-white border border-[#D2D9E0] overflow-auto",
                dropdownShapeStyles[shape],
                dropdownSizeStyles[size],
                "shadow-lg animate-in fade-in-20 zoom-in-95"
              )}
              role="listbox"
            >
              <div className="py-1">
                {Children.map(children, (child) => {
                  if (
                    isValidElement<DropdownMenuItemProps>(child) &&
                    child.props?.value !== undefined
                  ) {
                    return cloneElement(
                      child as ReactElement<DropdownMenuItemProps>,
                      {
                        className: cn(
                          optionSizeStyles[size],
                          child.props.className
                        ),
                        selected: child.props.value === currentValue,
                        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                          if (!child.props.disabled) {
                            handleSelect(child.props.value);
                            if (child.props.onClick) {
                              child.props.onClick(e);
                            }
                          }
                        },
                        endContent:
                          child.props.value === currentValue &&
                          !child.props.endContent ? (
                            <Check className="h-4 w-4 text-[#FF6B35]" />
                          ) : (
                            child.props.endContent
                          ),
                      }
                    );
                  }
                  return child;
                })}
              </div>
            </div>
          )}
        </div>

        {isError && errorMessage && (
          <p className="text-[#EF4444] text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
