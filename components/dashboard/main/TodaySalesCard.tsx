"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";

export default function TodaySalesCard({ className }: { className?: string }) {
  const [currentHour, setCurrentHour] = useState<string>("");

  // 기준 시간 계산 (매 시 정각)
  useEffect(() => {
    const updateHour = () => {
      const now = new Date();
      let hour = now.getHours();

      // 오전/오후 구분
      const isPM = hour >= 12;
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;

      const formatted = `${isPM ? "오후" : "오전"} ${displayHour}시 00분 기준`;
      setCurrentHour(formatted);
    };

    updateHour();

    const interval = setInterval(updateHour, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardCard className={`relative flex flex-col gap-1 py-4 px-6 ${className}`}>
      {/* 상단 탭 */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* <Button variant="primary" size="lg" shape="pill" >
          현황
        </Button> */}

      </div>

      {/* 실시간 매출 */}
      <div className="text-2xl font-bold text-gray-900 ">금일 매출</div>
      <div className="w-full border-t  border-gray-300"></div>
      <div className="flex flex-col items-start leading-tight">
        <div className="text-4xl font-bold text-orange-600 tracking-tight">
          1,415,000원
        </div>
        <div className="text-l text-gray-500 mt-0">
          {currentHour}
        </div>
      </div>
      <div className="flex flex-col gap-0 mt-5">
        <div className="text-xl font-semibold text-gray-500 ">카드 결제</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">1,320,000원</div>
      </div>

      <div className="flex flex-col gap-0 mt-2">
        <div className="text-xl font-semibold text-gray-500">현금 결제</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">95,000원</div>
      </div>
    </DashboardCard>
  );
}
