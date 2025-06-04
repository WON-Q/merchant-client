import React from "react";
import TodaySalesCard from "@/components/dashboard/main/TodaySalesCard";
import ExpectedDepositCard from "@/components/dashboard/main/ExpectedDepositCard";
import SalesCalendarCard from "@/components/dashboard/main/SalesCalendarCard";
import EmployeeSalaryList from "@/components/dashboard/main/EmployeeSalaryList";
import MenuCard from "@/components/dashboard/main/MenuCard";

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-8 p-6 md:p-1 pt-8">
        {/* 대시보드 제목 */}
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-neutral-500">가맹점 데이터 및 통계를 확인할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
  {/* 좌측 영역 */}
  <div className="flex flex-col h-full">
    {/* 상단 카드 2개 */}
    <div className="flex gap-4 mb-4">
      <TodaySalesCard className="flex-1 min-h-[350px] max-h-[350px]" />
      <ExpectedDepositCard className="flex-1 min-h-[350px] max-h-[350px]" />
    </div>

    {/* BEST & WORST 메뉴 카드 */}
    <div className="flex gap-4 mb-4">
      <MenuCard className="flex-1 max-h-[600px]" />
      <EmployeeSalaryList className="flex-1 max-h-[600px]" />
    
    </div>
  </div>

  {/* 우측 영역: 달력 */}
  <SalesCalendarCard className="h-full self-stretch max-h-[910px]" />
</div>
      </div>
    </div>
  );
}
