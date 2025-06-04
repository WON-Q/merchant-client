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

// 최근 3개월 정산 금액 (목데이터)
const recentSettlements = [
  { month: `${month-2}월`, amount: 40200000 },
  { month: `${month-1}월`, amount: 30800000 },
  { month: `${month}월`, amount: 40300000 },
  { month: `${month + 1}월`, amount: 41990960 }, // ⭐️ 현재 월로 표시
];

const salesDataByDay: Record<number, { card: number; cash: number }> = {
  1: { card: 1250000, cash: 112000 },
  2: { card: 1420000, cash: 109000 },
  3: { card: 2550000, cash: 118000 }, // 토
  4: { card: 2300000, cash: 114000 }, // 일
  5: { card: 980000, cash: 110000 },
  6: { card: 1120000, cash: 115000 },
  7: { card: 1190000, cash: 120000 },
  8: { card: 1350000, cash: 113000 },
  9: { card: 1620000, cash: 117000 }, // 금
  10: { card: 2750000, cash: 121000 }, // 토
  11: { card: 2480000, cash: 110000 }, // 일
  12: { card: 1050000, cash: 111000 },
  13: { card: 1150000, cash: 114000 },
  14: { card: 1240000, cash: 119000 },
  15: { card: 1390000, cash: 116000 },
  16: { card: 1720000, cash: 120000 }, // 금
  17: { card: 2900000, cash: 118000 }, // 토
  18: { card: 2600000, cash: 110000 }, // 일
  19: { card: 1080000, cash: 113000 },
  20: { card: 1180000, cash: 115000 },
  21: { card: 1270000, cash: 120000 },
  22: { card: 1410000, cash: 117000 },
  23: { card: 1850000, cash: 122000 }, // 금
  24: { card: 3100000, cash: 118000 }, // 토
  25: { card: 2780000, cash: 110000 }, // 일
  26: { card: 1100000, cash: 114000 },
  27: { card: 1200000, cash: 119000 },
  28: { card: 1320000, cash: 112000 },
  29: { card: 1270000, cash: 120000 },
  30: { card: 1240000, cash: 119000 },
};

const settlementDataByDay: Record<number, number> = {
  1: 1341600,
  2: 1498820,
  3: 2596940,
  4: 2377480,
  5: 1059800,
  6: 1198900,
  7: 1290200,
  8: 1460600,
  9: 1779300,
  10: 2805980,
  11: 2539640,
  12: 1136820,
  13: 1254820,
  14: 1374020,
  15: 1505480,
  16: 1868320,
  17: 2948040,
  18: 2745800,
  19: 1147740,
  20: 1266100,
  21: 1373660,
  22: 1542520,
  23: 2005240,
  24: 3136240,
  25: 2832760,
  26: 1224520,
  27: 1314020,
  28: 1403360,
  29: 1348940,
  30: 1400580,
};


export default function SalesCalendarCard({ className }: Props) {
  const [activeTab, setActiveTab] = useState<"매출" | "정산">("매출");

  return (
    <DashboardCard className={`col-span-1 ${className}`}>
      {/* 상단 탭 버튼 */}
      <div className="flex justify-between items-center ">
        {/* 타이틀 */}
        <div className="text-2xl font-bold text-gray-900 ">
          {activeTab === "매출" ? `${month + 1}월 매출 달력` : `${month + 1}월 정산 내역`}
        </div>
    
        {/* 탭 버튼 */}
        <div className="flex gap-3 text-sm">
       {/* 상단 탭 버튼 */}
            <Button
              variant={activeTab === "매출" ? "primary" : "outline"}
              size="lg"
              shape="pill"
              onClick={() => setActiveTab("매출")}
            >
              매출
            </Button>
            <Button
              variant={activeTab === "정산" ? "primary" : "outline"}
              size="lg"
              shape="pill"
              onClick={() => setActiveTab("정산")}
            >
              정산
            </Button>
        </div>
      </div>
<div className="w-35 border-t mb-1  "></div> 

      {/* 매출 탭 내용 */}
      {activeTab === "매출" && (
        <>
          {/* 상단 요약 영역 */}
          <div className="bg-gray-50 rounded-md p-4 flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-gray-600 text-2xl font-semibold tracking-tight">카드</span>
                <span className="text-orange-600 text-xl font-bold">39,397,000원</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-600 text-2xl font-semibold tracking-tight">현금</span>
                <span className="text-[#4F8DF9] text-xl font-bold"> 3,455,000원원</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-600 text-2xl font-semibold tracking-tight">수수료</span>
                <span className="text-green-600 text-xl font-bold"> 861,040원</span>
              </div>
            </div>

            {/* 총 매출액 */}
            <div className="flex justify-between items-center border-t pt-6 text-sm">
              <span className="text-gray-600 text-2xl  font-semibold tracking-tight">총 매출액</span>
              <span className="text-3xl font-bold text-gray-900">41,990,960원</span>
            </div>
          </div>

          {/* 달력 UI */}
          <div className="bg-white rounded-lg mt-1 px-2 pt-3 pb-1 w-full ">
            <div className="flex justify-center mb-5 text-gray-800 font-semibold text-[26px]">
              {year}년 {month + 1}월
            </div>

            <div className="grid grid-cols-7 font-semibold text-center text-gray-500 text-xl mb-5">
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

                const cardAmount = salesDataByDay[day]?.card || 0;
                const cashAmount = salesDataByDay[day]?.cash || 0;
                const totalAmount = cardAmount + cashAmount;
                const feeAmount = Math.floor(totalAmount * 0.02); // 2% 수수료 (소수점 버림)

                return (
                  <div
                    key={day}
                    className="rounded-lg p-2 text-xs text-gray-700 flex flex-col min-h-[80px]"
                  >
                    <div className="text-center font-bold text-[16px] mb-1 text-gray-800">
                      {day}
                    </div>

                    <div className="flex flex-col gap-[2px] flex-1 justify-start items-start px-4">
                      {cardAmount !== 0 && (
                        <span className="text-orange-600 leading-tight whitespace-nowrap  font-bold text-right w-full">
                          +{cardAmount.toLocaleString()}원
                        </span>
                      )}
                      {cashAmount !== 0 && (
                        <span className="text-[#4F8DF9] leading-tight whitespace-nowrap px-2.5 font-bold text-right w-full">
                          +{cashAmount.toLocaleString()}원
                        </span>
                      )}
                      {feeAmount !== 0 && (
                        <span className="text-green-600 leading-tight whitespace-nowrap px-5 font-bold text-right w-full">
                          -{feeAmount.toLocaleString()}원
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
<div className="flex justify-center mb-5 text-gray-800 font-semibold text-[26px]">
              {year}년 {month + 1}월
            </div>

{/* 정산 탭 요일 */}
<div className="grid grid-cols-7 font-semibold text-center text-gray-500 text-xl mb-5">
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
      className=" rounded-lg p-2 text-xs text-gray-700 flex flex-col min-h-[60px]"
    >
      <div className="text-center font-bold text-[16px] mb-1 text-gray-800">
        {day}
      </div>

      {settlementAmount !== 0 ? (
        <div className="text-blue-600 leading-tight whitespace-nowrap font-bold px-3 text-right w-full">
          +{settlementAmount.toLocaleString()}원
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
          <div className="bg-white rounded-lg p-4 ">
            <div className="text-base font-semibold mb-10 text-gray-800">최근 3개월 정산 금액</div>

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
                      {item.amount.toLocaleString()}원
                    </div>

                    <div
                      className={`w-8 ${barColorClass} rounded-t transition-all duration-300`}
                      style={{
                        height: `${heightPx}px`,
                        minHeight: "24px",
                      }}
                    ></div>

                    <div className="mt-2 text-sm text-gray-700">{item.month}</div>
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
