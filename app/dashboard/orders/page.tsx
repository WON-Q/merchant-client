"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DailyOrderFilters,
  MonthlyOrderFilters,
} from "./components/order-filters";
import { OrderTable } from "./components/order-table";
import {
  Order,
  OrderMenuStatus,
  DailyOrderFilter,
  MonthlyOrderFilter,
} from "@/types/order";
import { Page } from "@/types/api";

export default function OrdersPage() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState("daily");

  // 데이터 로딩 상태
  const [loading, setLoading] = useState(false);

  // 주문 데이터 상태
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // 일별 필터 상태
  const [dailyFilter, setDailyFilter] = useState<DailyOrderFilter>({
    date: new Date().toISOString().split("T")[0], // 오늘 날짜
    minAmount: undefined,
    maxAmount: undefined,
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  // 월별 필터 상태
  const [monthlyFilter, setMonthlyFilter] = useState<MonthlyOrderFilter>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // 0-based에서 1-based로 변환
    minAmount: undefined,
    maxAmount: undefined,
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  // 필터 입력값 상태 (문자열로 관리)
  const [dailyMinAmount, setDailyMinAmount] = useState("");
  const [dailyMaxAmount, setDailyMaxAmount] = useState("");
  const [monthlyMinAmount, setMonthlyMinAmount] = useState("");
  const [monthlyMaxAmount, setMonthlyMaxAmount] = useState("");
  const [yearInput, setYearInput] = useState(monthlyFilter.year.toString());
  const [monthInput, setMonthInput] = useState(monthlyFilter.month.toString());

  // 페이지 로드 시 주문 데이터 조회
  useEffect(() => {
    fetchOrders();
  }, []);

  // 일별 주문 데이터 조회
  const fetchDailyOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("date", dailyFilter.date);
      params.append("page", dailyFilter.page.toString());
      params.append("size", dailyFilter.size.toString());
      params.append("sort", dailyFilter.sort);

      if (dailyFilter.minAmount) {
        params.append("minAmount", dailyFilter.minAmount.toString());
      }

      if (dailyFilter.maxAmount) {
        params.append("maxAmount", dailyFilter.maxAmount.toString());
      }

      const response = await fetch(
        `/api/dashboard/orders/daily?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errorMessage || "주문 조회 중 오류가 발생했습니다."
        );
      }

      const data = await response.json();
      const pageData = data.data as Page<Order>;

      setOrders(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "주문 조회 중 오류가 발생했습니다."
      );
      setOrders([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // 월별 주문 데이터 조회
  const fetchMonthlyOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("year", monthlyFilter.year.toString());
      params.append("month", monthlyFilter.month.toString());
      params.append("page", monthlyFilter.page.toString());
      params.append("size", monthlyFilter.size.toString());
      params.append("sort", monthlyFilter.sort);

      if (monthlyFilter.minAmount) {
        params.append("minAmount", monthlyFilter.minAmount.toString());
      }

      if (monthlyFilter.maxAmount) {
        params.append("maxAmount", monthlyFilter.maxAmount.toString());
      }

      const response = await fetch(
        `/api/dashboard/orders/monthly?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errorMessage || "주문 조회 중 오류가 발생했습니다."
        );
      }

      const data = await response.json();
      const pageData = data.data as Page<Order>;

      setOrders(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "주문 조회 중 오류가 발생했습니다."
      );
      setOrders([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // 주문 데이터 조회 (활성 탭에 따라 분기)
  const fetchOrders = () => {
    if (activeTab === "daily") {
      fetchDailyOrders();
    } else {
      fetchMonthlyOrders();
    }
  };

  // 주문 메뉴 상태 변경
  const handleMenuStatusChange = async (
    orderMenuId: number,
    status: OrderMenuStatus
  ) => {
    try {
      const response = await fetch(
        `/api/dashboard/orders/menu/${orderMenuId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errorMessage || "상태 변경 중 오류가 발생했습니다."
        );
      }

      console.log("메뉴 상태가 변경되었습니다.");

      // 주문 목록 다시 조회
      fetchOrders();
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "상태 변경 중 오류가 발생했습니다."
      );
    }
  };

  // 일별 주문 조회
  const handleDailySearch = () => {
    const filter: DailyOrderFilter = {
      ...dailyFilter,
      page: 0, // 검색 시 첫 페이지로 초기화
      minAmount: dailyMinAmount ? parseInt(dailyMinAmount) : undefined,
      maxAmount: dailyMaxAmount ? parseInt(dailyMaxAmount) : undefined,
    };

    setDailyFilter(filter);
    fetchDailyOrders();
  };

  // 월별 주문 조회
  const handleMonthlySearch = () => {
    const year = parseInt(yearInput);
    const month = parseInt(monthInput);

    if (
      isNaN(year) ||
      isNaN(month) ||
      year < 1970 ||
      year > 9999 ||
      month < 1 ||
      month > 12
    ) {
      console.error("올바른 연도와 월을 입력해주세요.");
      return;
    }

    const filter: MonthlyOrderFilter = {
      ...monthlyFilter,
      year,
      month,
      page: 0, // 검색 시 첫 페이지로 초기화
      minAmount: monthlyMinAmount ? parseInt(monthlyMinAmount) : undefined,
      maxAmount: monthlyMaxAmount ? parseInt(monthlyMaxAmount) : undefined,
    };

    setMonthlyFilter(filter);
    fetchMonthlyOrders();
  };

  // 일별 페이지 변경
  const handleDailyPageChange = (page: number) => {
    setDailyFilter({
      ...dailyFilter,
      page,
    });
    fetchDailyOrders();
  };

  // 월별 페이지 변경
  const handleMonthlyPageChange = (page: number) => {
    setMonthlyFilter({
      ...monthlyFilter,
      page,
    });
    fetchMonthlyOrders();
  };

  // 탭 변경
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOrders([]);
    setTotalPages(0);

    if (value === "daily") {
      fetchDailyOrders();
    } else {
      fetchMonthlyOrders();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 주문 관리 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <p className="text-muted-foreground">
          주문 정보를 관리하고 처리할 수 있습니다.
        </p>
      </div>

      {/* 일별/월별 주문 조회 탭 */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="daily">일별 주문</TabsTrigger>
          <TabsTrigger value="monthly">월별 주문</TabsTrigger>
        </TabsList>

        {/* 일별 주문 조회 컨텐츠 */}
        <TabsContent value="daily">
          <DailyOrderFilters
            date={dailyFilter.date}
            minAmount={dailyMinAmount}
            maxAmount={dailyMaxAmount}
            onDateChange={(date) => setDailyFilter({ ...dailyFilter, date })}
            onMinAmountChange={setDailyMinAmount}
            onMaxAmountChange={setDailyMaxAmount}
            onSearch={handleDailySearch}
            loading={loading}
          />

          <OrderTable
            orders={orders}
            currentPage={dailyFilter.page}
            totalPages={totalPages}
            onPageChange={handleDailyPageChange}
            onMenuStatusChange={handleMenuStatusChange}
            loading={loading}
          />
        </TabsContent>

        {/* 월별 주문 조회 컨텐츠 */}
        <TabsContent value="monthly">
          <MonthlyOrderFilters
            year={yearInput}
            month={monthInput}
            minAmount={monthlyMinAmount}
            maxAmount={monthlyMaxAmount}
            onYearChange={setYearInput}
            onMonthChange={setMonthInput}
            onMinAmountChange={setMonthlyMinAmount}
            onMaxAmountChange={setMonthlyMaxAmount}
            onSearch={handleMonthlySearch}
            loading={loading}
          />

          <OrderTable
            orders={orders}
            currentPage={monthlyFilter.page}
            totalPages={totalPages}
            onPageChange={handleMonthlyPageChange}
            onMenuStatusChange={handleMenuStatusChange}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
