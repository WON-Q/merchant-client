import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DailyOrderFiltersProps {
  date: string;
  minAmount: string;
  maxAmount: string;
  onDateChange: (date: string) => void;
  onMinAmountChange: (amount: string) => void;
  onMaxAmountChange: (amount: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function DailyOrderFilters({
  date,
  minAmount,
  maxAmount,
  onDateChange,
  onMinAmountChange,
  onMaxAmountChange,
  onSearch,
  loading,
}: DailyOrderFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="날짜 선택"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          isRequired
          disabled={loading}
        />
        <Input
          label="최소 금액"
          type="number"
          placeholder="최소 금액 입력"
          value={minAmount}
          onChange={(e) => onMinAmountChange(e.target.value)}
          rightIcon={<span className="text-neutral-400">원</span>}
          disabled={loading}
        />
        <Input
          label="최대 금액"
          type="number"
          placeholder="최대 금액 입력"
          value={maxAmount}
          onChange={(e) => onMaxAmountChange(e.target.value)}
          rightIcon={<span className="text-neutral-400">원</span>}
          disabled={loading}
        />
        <div className="flex items-end">
          <Button
            variant="primary"
            leftIcon={<Search className="h-4 w-4" />}
            onClick={onSearch}
            isLoading={loading}
            className="w-full"
          >
            주문 조회
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MonthlyOrderFiltersProps {
  year: string;
  month: string;
  minAmount: string;
  maxAmount: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onMinAmountChange: (amount: string) => void;
  onMaxAmountChange: (amount: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function MonthlyOrderFilters({
  year,
  month,
  minAmount,
  maxAmount,
  onYearChange,
  onMonthChange,
  onMinAmountChange,
  onMaxAmountChange,
  onSearch,
  loading,
}: MonthlyOrderFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          label="연도"
          type="number"
          min="2000"
          max="2100"
          placeholder="YYYY"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          isRequired
          disabled={loading}
        />
        <Input
          label="월"
          type="number"
          min="1"
          max="12"
          placeholder="MM"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          isRequired
          disabled={loading}
        />
        <Input
          label="최소 금액"
          type="number"
          placeholder="최소 금액 입력"
          value={minAmount}
          onChange={(e) => onMinAmountChange(e.target.value)}
          rightIcon={<span className="text-neutral-400">원</span>}
          disabled={loading}
        />
        <Input
          label="최대 금액"
          type="number"
          placeholder="최대 금액 입력"
          value={maxAmount}
          onChange={(e) => onMaxAmountChange(e.target.value)}
          rightIcon={<span className="text-neutral-400">원</span>}
          disabled={loading}
        />
        <div className="flex items-end">
          <Button
            variant="primary"
            leftIcon={<Search className="h-4 w-4" />}
            onClick={onSearch}
            isLoading={loading}
            className="w-full"
          >
            주문 조회
          </Button>
        </div>
      </div>
    </div>
  );
}
