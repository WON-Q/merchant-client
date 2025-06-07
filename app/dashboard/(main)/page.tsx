import React from "react";
import TodaySalesCard from "@/components/dashboard/main/TodaySalesCard";
import SalesCalendarCard from "@/components/dashboard/main/SalesCalendarCard";
import MenuCard from "@/components/dashboard/main/MenuCard";
import MonthlyProfitCard from "@/components/dashboard/main/MonthlyProfitCard";

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-12 p-6 md:p-1 pt-8">
        {/* flex 레이아웃: 모바일 시 세로 스택, md 이상일 때 flex-row */}
        <div className="flex flex-col md:flex-row gap-4 w-full items-start">
          {/* 좌측 영역 (30%) */}
          <div className="w-full md:w-[30%] flex flex-col h-full gap-4">
            {/* 상단 카드 2개 */}
            <div className="flex gap-4 mb-3">
              <TodaySalesCard className="bg-white rounded-xl border border-neutral-300 flex-1 min-h-[350px] max-h-[350px]" />
            </div>
            {/* BEST & WORST 메뉴 카드 */}
            <div className="flex gap-4 mb-8">
              <MenuCard className="bg-white rounded-xl border border-neutral-300 flex-1 max-h-[700px]" />
            </div>
          
          </div>

          {/* 우측 영역 (70%) */}
          <div className="w-full md:w-[70%]">
            <SalesCalendarCard className="bg-white rounded-xl border border-neutral-300 h-full self-stretch max-h-[1300px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
