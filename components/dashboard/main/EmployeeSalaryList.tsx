"use client";

import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";

const monthlyAlbaData = [
  { name: "윤태경", time: "10:00 ~ 15:00", status: "출근 완료", payDay: "6월 30일", dDay: "D-23", payInfo: { hours: 40, wage: 16820, totalPay: 672800 } },
  { name: "신희원", time: "18:00 ~ 22:00", status: "미출근", payDay: "6월 30일", dDay: "D-23", payInfo: { hours: 24, wage: 10030, totalPay: 240720 } },
  { name: "김새봄", time: "12:00 ~ 18:00", status: "출근 완료", payDay: "6월 30일", dDay: "D-23", payInfo: { hours: 36, wage: 12000, totalPay: 432000 } }, 
];

const dailyAlbaData = [
  { name: "윤태경", time: "09:00 ~ 15:00", status: "출근 완료", payDay: "6월 30일", dDay: "D-3", payInfo: { hours: 40, wage: 16820, totalPay: 672800 } },
  { name: "신희원", time: "10:00 ~ 14:00", status: "미출근", payDay: "6월 30일", dDay: "D-3", payInfo: { hours: 24, wage: 9840, totalPay: 236160 } },
  { name: "김새봄", time: "12:00 ~ 18:00", status: "출근 완료", payDay: "6월 30일", dDay: "D-3", payInfo: { hours: 36, wage: 12000, totalPay: 432000 } }, 
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
  {/* 타이틀 영역 - D-Day 오른쪽에 표시 */}
  <div className="flex justify-between items-center ">
    <div className="text-2xl font-bold text-gray-900">직원별 급여</div>
    <div className="text-xl font-semibold text-orange-600">{albaData[0].dDay}</div>
  </div>

  <div className="w-full border-t  border-gray-300"></div>

  {/* 알바생 리스트 */}
  <ul className="space-y-3">
    {albaData.map((alba, idx) => (
      <li key={idx} className="flex flex-col gap-2 py-3">
        {/* 기본 정보 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {alba.name}
              
              <div className="w-full border-t"></div>
            </span>
              <div className="text-sm  text-gray-600 relative top-[4px] ">{alba.time}</div>
          </div>
        
        </div>

        {/* 급여 지급 내역 */}
        <div className="flex justify-between text-xl text-gray-700 mt-2">
          <div className="flex flex-col gap-y-2">
            <span className="text-xl font-semibold text-gray-400">근무시간</span>
            <span className="text-black">{alba.payInfo.hours}시간</span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-xl font-semibold text-gray-400">시급</span>
            <span className="text-black">{alba.payInfo.wage.toLocaleString()}원</span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-xl font-semibold text-gray-400">총 지급액</span>
            <span className="font-bold text-orange-600">
              {alba.payInfo.totalPay.toLocaleString()}원
            </span>
          </div>
        </div>
      </li>
    ))}
  </ul>
</DashboardCard>

  );
}
