"use client";

import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";

interface Props {
  className?: string;
}

// 이번달 날짜 배열 만들기
const getMonthDays = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

// ⭐️ 현재 연도/월 실시간 반영
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth()-1; // 0-indexed (0 = 1월 ~ 11 = 12월)
const days = getMonthDays(year, month);

// 최근 4개월 정산 금액 (목데이터)
const recentSettlements = [
  { month: `${month-2}월`, amount: 3122 },
  { month: `${month-1}월`, amount: 3080 },
  { month: `${month}월`, amount: 2890 },
  { month: `${month + 1}월`, amount: 3167 }, // ⭐️ 현재 월로 표시
];

const salesDataByDay: Record<number, { card: number; cash: number }> = {
  1:  { card: 88,  cash: 6.2 },
  2:  { card: 102, cash: 7.9 },
  3:  { card: 130, cash: 9.2 },
  4:  { card: 115, cash: 8.4 },
  5:  { card: 76,  cash: 5.8 },
  6:  { card: 82,  cash: 6.4 },
  7:  { card: 87,  cash: 6.9 },
  8:  { card: 95,  cash: 7.3 },
  9:  { card: 105, cash: 7.7 },
  10: { card: 128, cash: 9.0 },
  11: { card: 118, cash: 8.1 },
  12: { card: 79,  cash: 6.0 },
  13: { card: 84,  cash: 6.7 },
  14: { card: 89,  cash: 7.1 },
  15: { card: 98,  cash: 7.8 },
  16: { card: 108, cash: 8.0 },
  17: { card: 133, cash: 9.5 },
  18: { card: 120, cash: 8.5 },
  19: { card: 81,  cash: 6.3 },
  20: { card: 86,  cash: 6.8 },
  21: { card: 93,  cash: 7.2 },
  22: { card: 100, cash: 7.9 },
  23: { card: 110, cash: 8.2 },
  24: { card: 127, cash: 9.3 },
  25: { card: 119, cash: 8.0 },
  26: { card: 77,  cash: 5.9 },
  27: { card: 83,  cash: 6.5 },
  28: { card: 90,  cash: 7.0 },
  29: { card: 97,  cash: 7.6 },
  30: { card: 107, cash: 8.1 },
};




const settlementDataByDay: Record<number, number> = {
  1:  92.3,  // (88 + 6.2) * 0.98 = 92.316 → 92.3
  2:  107.7, // (102 + 7.9) * 0.98 = 107.702 → 107.7
  3:  136.4, // (130 + 9.2) * 0.98 = 136.416 → 136.4
  4:  120.9, // (115 + 8.4) * 0.98 = 120.932 → 120.9
  5:  80.2,  // (76 + 5.8) * 0.98 = 80.164 → 80.2
  6:  86.6,  // (82 + 6.4) * 0.98 = 86.632 → 86.6
  7:  92.0,  // (87 + 6.9) * 0.98 = 92.022 → 92.0
  8:  100.3, // (95 + 7.3) * 0.98 = 100.254 → 100.3
  9:  110.4, // (105 + 7.7) * 0.98 = 110.446 → 110.4
  10: 134.3, // (128 + 9.0) * 0.98 = 134.26 → 134.3
  11: 123.6, // (118 + 8.1) * 0.98 = 123.578 → 123.6
  12: 83.3,  // (79 + 6.0) * 0.98 = 83.3
  13: 88.9,  // (84 + 6.7) * 0.98 = 88.886 → 88.9
  14: 94.2,  // (89 + 7.1) * 0.98 = 94.178 → 94.2
  15: 103.7, // (98 + 7.8) * 0.98 = 103.684 → 103.7
  16: 113.7, // (108 + 8.0) * 0.98 = 113.68 → 113.7
  17: 139.7, // (133 + 9.5) * 0.98 = 139.65 → 139.7
  18: 125.9, // (120 + 8.5) * 0.98 = 125.93 → 125.9
  19: 85.6,  // (81 + 6.3) * 0.98 = 85.554 → 85.6
  20: 90.9,  // (86 + 6.8) * 0.98 = 90.944 → 90.9
  21: 98.2,  // (93 + 7.2) * 0.98 = 98.196 → 98.2
  22: 105.7, // (100 + 7.9) * 0.98 = 105.742 → 105.7
  23: 115.8, // (110 + 8.2) * 0.98 = 115.836 → 115.8
  24: 133.6, // (127 + 9.3) * 0.98 = 133.574 → 133.6
  25: 124.5, // (119 + 8.0) * 0.98 = 124.46 → 124.5
  26: 81.2,  // (77 + 5.9) * 0.98 = 81.242 → 81.2
  27: 87.7,  // (83 + 6.5) * 0.98 = 87.71 → 87.7
  28: 95.1,  // (90 + 7.0) * 0.98 = 95.06 → 95.1
  29: 102.5, // (97 + 7.6) * 0.98 = 102.508 → 102.5
  30: 112.8, // (107 + 8.1) * 0.98 = 112.798 → 112.8
};



export default function SalesCalendarCard({ className }: Props) {
  const [activeTab, setActiveTab] = useState<"매출" | "정산">("매출");

  return (
    <DashboardCard className={`col-span-1 ${className}`}>
      {/* 상단 탭 버튼 */}
      <div className="flex justify-between items-center  px-1">
        {/* 타이틀 */}
        <div className="text-2xl font-bold  text-gray-900">
          {activeTab === "매출" ? `${month + 1}월 매출 내역` : `${month + 1}월 정산 내역`}
        </div>
    
        {/* 탭 버튼 */}
        <div className="flex gap-3 text-sm">
       {/* 상단 탭 버튼 */}
            <Button
              variant={activeTab === "매출" ? "primary" : "outline"}
              size="md"
              shape="pill"
              onClick={() => setActiveTab("매출")}
            >
              매출
            </Button>
            <Button
              variant={activeTab === "정산" ? "primary" : "outline"}
              size="md"
              shape="pill"
              onClick={() => setActiveTab("정산")}
            >
              정산
            </Button>
        </div>
      </div>
<div className="w-full border-t  border-gray-300 "></div> 

      {/* 매출 탭 내용 */}
      {activeTab === "매출" && (
        <>
          {/* 상단 요약 영역 */}
          <div className="bg-gray-50 rounded-md p-4 flex flex-col gap-4 mt-4">
         <div className="grid grid-cols-3 gap-4">
                {/* 카드 - 왼쪽 */}
                <div className="flex flex-col gap-1 items-start px-1 ">
                  <span className="text-gray-600 text-2xl font-semibold tracking-tight">카드</span>
                  <span className="text-orange-600 text-xl font-bold">  30,070,000원</span>
                </div>

                {/* 현금 - 중앙 */}
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-gray-600 text-2xl font-semibold tracking-tight relative left-[-34px]">현금</span>
                  <span className="text-[#4F8DF9] text-xl font-bold">2,253,000원</span>
                </div>

                {/* 수수료 - 오른쪽 */}
                <div className="flex flex-col gap-1 items-end px-3">
                  <span className="text-gray-600 text-2xl font-semibold tracking-tight relative left-[-28px]">수수료</span>
                  <span className="text-green-600 text-xl font-bold">646,460원</span>
                </div>
              </div>


            {/* 총 매출액 */}
            <div className="flex justify-between items-center border-t pt-6 border-gray-200 text-sm">
                <span className="text-gray-600 text-2xl  font-semibold tracking-tight">총 매출액</span>
                <span className="text-3xl font-bold text-gray-900">31,676,540원</span>
            </div>
          </div>

          {/* 달력 UI */}
          <div className="bg-white rounded-lg mt-1 px-2 pt-3 pb-1 w-full ">
      
            <div className="grid grid-cols-7 font-semibold text-center text-gray-500 text-xl mb-5">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day}>{day}</div>
              ))}

              
            </div>
            <div className="w-full border-t border-gray-300 "></div> 
            <div className="grid grid-cols-7 gap-2 auto-rows-auto">
              {Array(days[0].getDay())
                .fill(0)
                .map((_, i) => (
                  <div key={"empty-" + i} />
                ))}

              {days.map((date) => {
                const day = date.getDate();

                const cardAmount = salesDataByDay[day]?.card || 0;
                const cashAmount = salesDataByDay[day]?.cash || 0;
                const totalAmount = cardAmount + cashAmount;
                const feeAmount = Math.round(totalAmount * 0.02 * 10) / 10; // 2% 수수료 (소수점 버림)
                const total= totalAmount - feeAmount;
                return (
                  <div
                    key={day}
                    className=" p-2 text-xs text-gray-700 flex flex-col min-h-[120px]"
                  >
                    
                    <div className="text-center font-bold text-[20px] mb-1 text-gray-800">
                      {day}
                    </div>
                    

                    <div className="flex flex-col gap-[2px] flex-1 justify-start items-start px-4 p-1 pr-0">
                        {cardAmount !== 0 && (
                        <span className="text-gray-800 leading-tight whitespace-nowrap font-bold text-right text-base w-full ">
                          +{total.toLocaleString()}만
                        </span>
                      )}
                      {cardAmount !== 0 && (
                        <span className="text-orange-600 leading-tight whitespace-nowrap font-bold text-right text-base w-full ">
                          +{cardAmount.toLocaleString()}만
                        </span>
                      )}
                      {cashAmount !== 0 && (
                        <span className="text-[#4F8DF9] leading-tight whitespace-nowrap font-bold text-right text-base w-full">
                          +{cashAmount.toLocaleString()}만
                        </span>
                      )}
                      {feeAmount !== 0 && (
                        <span className="text-green-600 leading-tight whitespace-nowrap font-bold text-right text-base w-full">
                          -{feeAmount.toLocaleString()}만
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 정산 탭 내용 */}
      {activeTab === "정산" && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-lg px-2 pt-3 pb-1 w-full ">
       {/* 정산 탭 타이틀 */}
        {/* <div className="flex justify-center mb-15  text-gray-800 font-semibold text-[28px]">
                      {year}년 {month + 1}월
                    </div> */}

        {/* 정산 탭 요일 */}
        <div className="grid grid-cols-7 font-semibold text-center text-gray-500 text-xl mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        

            <div className="grid grid-cols-7 gap-2 auto-rows-auto">
              {Array(days[0].getDay())
                .fill(0)
                .map((_, i) => (
                  <div key={"empty-" + i} />
                ))}

            {days.map((date) => {
  const day = date.getDate();
  const settlementAmount = settlementDataByDay[day] || 0;

  return (
    <div
      key={day}
      className=" rounded-lg p-2 text-xs text-gray-700 flex flex-col min-h-[90px]"
    >
      <div className="text-center font-bold text-[20px] mb-1 text-gray-800">
        {day}
      </div>

                    {settlementAmount !== 0 ? (
                      <div className="text-[#4F8DF9] leading-tight whitespace-nowrap font-bold text-right text-base w-full">
                        +{settlementAmount.toLocaleString()}만
                      </div>
                    ) : (
                      <div className="text-gray-400 text-[11px] text-right w-full">-</div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          {/* 최근 3개월 정산 그래프 */}
          <div className="bg-white rounded-lg pt-13 px-4 pb-1 "> 
            {/* <div className="text-base font-semibold mb-10 text-gray-800">최근 4개월 정산 금액</div> */}

            <div className="flex items-end justify-around h-44">
              {recentSettlements.map((item) => {
                const maxAmount = Math.max(...recentSettlements.map((d) => d.amount));
                const maxGraphHeightPx = 192 * 0.8;
                const heightPx = (item.amount / maxAmount) * maxGraphHeightPx;

                const isCurrentMonth = item.month === `${month + 1}월`;
                const barColorClass = isCurrentMonth ? "bg-blue-500" : "bg-gray-300";

                return (
                  <div key={item.month} className="flex flex-col items-center">
                    <div className="mb-1 text-sm text-gray-900 font-bold">
                      {item.amount.toLocaleString()}만
                    </div>

                    <div
                      className={`w-8 ${barColorClass} rounded-t transition-all duration-300`}
                      style={{
                        height: `${heightPx}px`,
                        minHeight: "24px",
                      }}
                    ></div>

                    <div className="mt-2 text-m font-bold text-gray-700">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
