"use client";

import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";

const monthlyAlbaData = [
  { name: "윤태경", time: "09:00 ~ 15:00", status: "출근 완료", payDay: "6월 30일", payInfo: { hours: 40, wage: 16820, totalPay: 672800 } },
  { name: "신희원", time: "10:00 ~ 14:00", status: "미출근", payDay: "6월 30일", payInfo: { hours: 24, wage: 9840, totalPay: 236160 } },
  { name: "김새봄", time: "12:00 ~ 18:00", status: "출근 완료", payDay: "6월 30일", payInfo: { hours: 36, wage: 12000, totalPay: 432000 } }, 
];

const dailyAlbaData = [
  { name: "홍길동", time: "09:00 ~ 15:00", status: "출근 완료", payDay: "6월 30일", payInfo: { hours: 8, wage: 10000, totalPay: 80000 } },
  { name: "김철수", time: "10:00 ~ 14:00", status: "미출근", payDay: "6월 30일", payInfo: { hours: 0, wage: 10000, totalPay: 0 } },
  { name: "이영희", time: "12:00 ~ 18:00", status: "출근 완료", payDay: "6월 30일", payInfo: { hours: 6, wage: 12000, totalPay: 72000 } },
];


export default function AlbaManageCard({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"월별" | "일별">("월별");

  const albaData = activeTab === "월별" ? monthlyAlbaData : dailyAlbaData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "출근 완료":
         return "bg-[#FF6B35] text-white border-transparent";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <DashboardCard className={`relative flex flex-col gap-4 py-5 px-6 ${className}`}>
      {/* 상단 탭 */}
    
      {/* 타이틀 */}
      <div className="text-2xl font-bold text-gray-900 py-2">직원별 급여</div>
      <div className="w-full border-t"></div>

      {/* 알바생 리스트 */}
      <ul className="space-y-3">
        {albaData.map((alba, idx) => (
          <li
            key={idx}
            className="flex flex-col gap-2 py-3 "
          >
            {/* 기본 정보 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">{alba.name}</span>
                {/* <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(alba.status)}`}
                >
                  {alba.status}
                </span> */} 
              </div>
              <div className="text-sm text-gray-600">{alba.time}</div>
            </div>

      

         {/* ⭐️ 급여 지급 내역 - 이름 바로 아래에 붙이기 */}
<div className="flex justify-between text-xl text-gray-700 mt-2 ">
  <div className="flex flex-col gap-y-2">
    <span className="text-xl font-semibold text-gray-400">누적 근무시간</span>
    <span className="font-semibold">{alba.payInfo.hours}시간</span>
  </div>
  <div className="flex flex-col gap-y-2">
    <span className="text-xl font-semibold text-gray-400">시급</span>
    <span className="font-semibold">{alba.payInfo.wage.toLocaleString()}원</span>
  </div>
  <div className="flex flex-col gap-y-2">
    <span className="text-xl font-semibold text-gray-400">총 지급액</span>
    <span className="font-bold text-black">{alba.payInfo.totalPay.toLocaleString()}원</span>
  </div>
</div>


          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
