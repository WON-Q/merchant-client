import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 메뉴 아이템의 고유 값
   */
  value: string;

  /**
   * 메뉴 아이템의 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * 메뉴 아이템의 선택 여부 (내부적으로 사용)
   * @default false
   */
  selected?: boolean;

  /**
   * 메뉴 아이템 시작 부분에 표시할 아이콘 또는 요소
   */
  startContent?: React.ReactNode;

  /**
   * 메뉴 아이템 끝 부분에 표시할 아이콘 또는 요소
   */
  endContent?: React.ReactNode;
}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (
    {
      value,
      disabled = false,
      selected = false,
      startContent,
      endContent,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 w-full cursor-pointer",
          selected ? `bg-primary-50 text-primary font-medium` : "",
          disabled
            ? "opacity-50 pointer-events-none cursor-not-allowed bg-neutral-50 text-neutral-400"
            : "hover:bg-neutral-50 active:bg-neutral-100",
          className
        )}
        role="option"
        aria-disabled={disabled}
        aria-selected={selected}
        data-value={value}
        {...props}
      >
        {startContent && <span className="flex-shrink-0">{startContent}</span>}
        <span className="flex-grow truncate">{children}</span>
        {endContent && (
          <span className="flex-shrink-0 ml-auto">{endContent}</span>
        )}
      </div>
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenuItem };
