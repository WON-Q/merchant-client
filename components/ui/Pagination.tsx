import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./Button";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 현재 페이지 번호
   * @default 1
   */
  currentPage: number;

  /**
   * 전체 페이지 수
   * @default 1
   */
  totalPages: number;

  /**
   * 페이지 변경 이벤트 핸들러
   */
  onPageChange: (page: number) => void;

  /**
   * 한 번에 표시할 페이지 버튼 개수
   * @default 2
   */
  siblingCount?: number;

  /**
   * 페이지네이션 크기
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * 테두리 스타일 적용 여부
   * @default false
   */
  bordered?: boolean;

  /**
   * 페이지네이션 모양
   * @default "rounded"
   */
  shape?: "rounded" | "pill" | "square";

  /**
   * 항상 처음/마지막 페이지 버튼 표시 여부
   * @default false
   */
  showFirstLast?: boolean;

  /**
   * 컬러 변형
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "accent" | "neutral";

  /**
   * 전체 너비 차지 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      siblingCount = 2,
      size = "md",
      bordered = false,
      shape = "rounded",
      showFirstLast = false,
      variant = "primary",
      fullWidth = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    // 현재 페이지가 범위를 벗어나지 않도록 조정
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    // 표시할 페이지 번호 생성
    const getPageNumbers = () => {
      const totalNumbers = siblingCount * 2 + 1;

      // 전체 페이지가 표시할 수 있는 번호보다 적거나 같으면 전체 표시
      if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      // 시작 및 끝 점 계산
      const leftSiblingIndex = Math.max(safePage - siblingCount, 1);
      const rightSiblingIndex = Math.min(safePage + siblingCount, totalPages);

      // 점(...)을 표시하지 않을 조건
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      // 왼쪽과 오른쪽에 ... 표시
      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        );
        return [1, "leftEllipsis", ...middleRange, "rightEllipsis", totalPages];
      }

      // 왼쪽에만 ... 표시
      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftRange = Array.from(
          { length: 3 + siblingCount },
          (_, i) => i + 1
        );
        return [...leftRange, "rightEllipsis", totalPages];
      }

      // 오른쪽에만 ... 표시
      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightRange = Array.from(
          { length: 3 + siblingCount },
          (_, i) => totalPages - (3 + siblingCount) + i + 1
        );
        return [1, "leftEllipsis", ...rightRange];
      }

      // 둘 다 표시하지 않음 (기본적으로 모든 페이지 표시)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    // 페이지 이동 핸들러
    const changePage = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== safePage && !disabled) {
        onPageChange(page);
      }
    };

    // 버튼 크기 설정
    const buttonSize: Record<string, "xs" | "sm" | "md" | "lg" | "xl"> = {
      xs: "xs",
      sm: "xs",
      md: "sm",
      lg: "md",
      xl: "lg",
    };

    // 간격 설정
    const gapSize: Record<string, string> = {
      xs: "gap-0.5",
      sm: "gap-1",
      md: "gap-1.5",
      lg: "gap-2",
      xl: "gap-3",
    };

    // 색상 변형 설정
    const variantStyles = {
      primary: {
        active: "bg-[#FF6B35] text-white border-[#FF6B35] hover:bg-[#FF6B35]",
        normal: "bg-white text-[#333F48]",
      },
      secondary: {
        active: "bg-[#2EC4B6] text-white border-[#2EC4B6] hover:bg-[#2EC4B6]",
        normal: "bg-white text-[#333F48]",
      },
      accent: {
        active:
          "bg-[#FFBF69] text-[#333F48] border-[#FFBF69] hover:bg-[#FFBF69]",
        normal: "bg-white text-[#333F48]",
      },
      neutral: {
        active: "bg-[#333F48] text-white border-[#333F48] hover:bg-[#333F48]",
        normal: "bg-white text-[#333F48]",
      },
    };

    // 페이지 번호 렌더링
    const renderPageNumbers = () => {
      const pageNumbers = getPageNumbers();

      return pageNumbers.map((pageNumber, idx) => {
        // Ellipsis 렌더링
        if (pageNumber === "leftEllipsis" || pageNumber === "rightEllipsis") {
          return (
            <div
              key={`${pageNumber}-${idx}`}
              className="flex items-center justify-center px-2"
            >
              <span className="text-neutral-500">...</span>
            </div>
          );
        }

        // 버튼 컴포넌트에 맞는 variant로 변환
        const getButtonVariant = (variant: PaginationProps["variant"]) => {
          // neutral을 outline으로 매핑하고 나머지는 그대로 사용
          return variant === "neutral" ? "outline" : variant;
        };

        // 숫자 버튼 렌더링
        const isActive = safePage === pageNumber;
        const buttonVariant = getButtonVariant(variant);

        return (
          <Button
            key={`page-${pageNumber}`}
            variant={isActive ? buttonVariant : "outline"}
            size={buttonSize[size]}
            shape={shape}
            className={cn(
              "min-w-[2.5rem]",
              isActive
                ? variantStyles[variant].active
                : variantStyles[variant].normal
            )}
            onClick={() => changePage(pageNumber as number)}
            disabled={disabled}
          >
            {pageNumber}
          </Button>
        );
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          gapSize[size],
          fullWidth ? "w-full justify-center" : "",
          className
        )}
        {...props}
      >
        {/* 처음 페이지 버튼 */}
        {showFirstLast && (
          <Button
            variant="outline"
            size={buttonSize[size]}
            shape={shape}
            onClick={() => changePage(1)}
            disabled={safePage === 1 || disabled}
            className={bordered ? "" : "border-0"}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
        )}

        {/* 이전 페이지 버튼 */}
        <Button
          variant="outline"
          size={buttonSize[size]}
          shape={shape}
          onClick={() => changePage(safePage - 1)}
          disabled={safePage === 1 || disabled}
          className={bordered ? "" : "border-0"}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* 페이지 번호들 */}
        <div className={cn("flex items-center", gapSize[size])}>
          {renderPageNumbers()}
        </div>

        {/* 다음 페이지 버튼 */}
        <Button
          variant="outline"
          size={buttonSize[size]}
          shape={shape}
          onClick={() => changePage(safePage + 1)}
          disabled={safePage === totalPages || disabled}
          className={bordered ? "" : "border-0"}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* 마지막 페이지 버튼 */}
        {showFirstLast && (
          <Button
            variant="outline"
            size={buttonSize[size]}
            shape={shape}
            onClick={() => changePage(totalPages)}
            disabled={safePage === totalPages || disabled}
            className={bordered ? "" : "border-0"}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
