"use client";

import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";

// 월별 베스트 5 (월간 주문 약 1,900건 기준)
const monthlyBestMenus = [
  { name: "짬뽕",    count: 438, rankChange: 1 },
  { name: "탕수육",  count: 362, rankChange: -1 },
  { name: "짬짜면",  count: 311, rankChange: 0 },
  { name: "멘보샤",  count: 238, rankChange: 2 },
  { name: "칠리새우", count: 200, rankChange: -2 },
];

// 일별 베스트 5 (하루 주문 약 60건 기준)
const dailyBestMenus = [
  { name: "짱뽕",  count: 15, rankChange: 2 },
  { name: "탕수육",    count: 13, rankChange: 1 },
  { name: "짬짜면",  count: 10, rankChange: 0 },
  { name: "멘보샤",  count:  9, rankChange: 1 },
  { name: "칠리새우", count:  8, rankChange: -2 },
];

// 월별 워스트 5 (월간 주문 약 1,900건 기준)
const monthlyWorstMenus = [
  { name: "망고크림새우", count:  74, rankChange:  1 },
  { name: "볶음밥",       count:  85, rankChange: -1 },
  { name: "군만두",       count: 112, rankChange:  0 },
  { name: "짜장면",       count: 119, rankChange:  2 },
  { name: "해물짬뽕",     count: 131, rankChange: -2 },
];

// 일별 워스트 5 (하루 주문 약 60건 기준)
const dailyWorstMenus = [
  { name: "망고크림새우", count: 2, rankChange:  1 },
  { name: "군만두",       count: 3, rankChange:  0 },
  { name: "볶음밥",       count: 4, rankChange: -1 },
  { name: "해물짬뽕",     count: 4, rankChange: -2 },
  { name: "볶음밥",       count:  6, rankChange: -1 },
];

export default function MenuStatusCard({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"월별" | "일별">("월별");
  const [menuType, setMenuType] = useState<"베스트" | "워스트">("베스트");

  const menus =
    menuType === "베스트"
      ? activeTab === "월별"
        ? monthlyBestMenus
        : dailyBestMenus
      : activeTab === "월별"
      ? monthlyWorstMenus
      : dailyWorstMenus;

  return (
    <DashboardCard className={`relative flex flex-col gap-4 py-5 px-6 ${className}`}>
      {/* 상단 탭 (월별/일별) */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant={activeTab === "월별" ? "primary" : "outline"}
          size="md"
          shape="pill"
          onClick={() => setActiveTab("월별")}
        >
          월별
        </Button>
        <Button
          variant={activeTab === "일별" ? "primary" : "outline"}
          size="md"
          shape="pill"
          onClick={() => setActiveTab("일별")}
        >
          일별
        </Button>
      </div>

      {/* 메뉴 현황 타이틀 */}
      <div className="text-2xl font-bold text-gray-900">메뉴 현황</div>
      <div className="w-full border-t border-gray-300" />

      {/* 베스트/워스트 탭 */}
      <div className="flex border-b border-gray-300 mb-2">
        <button
          onClick={() => setMenuType("베스트")}
          className={`flex-1 text-center py-2 text-xl font-semibold transition-colors duration-200 ${
            menuType === "베스트"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500"
          }`}
        >
          Best
        </button>
        <button
          onClick={() => setMenuType("워스트")}
          className={`flex-1 text-center py-2 text-xl font-semibold transition-colors duration-200 ${
            menuType === "워스트"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500"
          }`}
        >
          Worst
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <ul className="space-y-3">
        {menus.map((menu, idx) => {
          const rankChangeIcon =
            menu.rankChange > 0
              ? `▲${menu.rankChange}`
              : menu.rankChange < 0
              ? `▼${Math.abs(menu.rankChange)}`
              : "-";

          return (
            <li key={idx} className="mb-5 mt-2">
              {/* 랭킹 + 메뉴명 + 개수 */}
              <div className="flex justify-between items-center">
                {/* 왼쪽 영역 (랭킹 + 메뉴명) */}
                <div className="flex gap-5 items-center">
                  {/* 랭킹 숫자 */}
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-lg leading-[2.25rem] flex-shrink-0 ${
                      idx === 0
                        ? "bg-orange-600 text-white"
                        : idx === 1
                        ? "bg-orange-400 text-white"
                        : idx === 2
                        ? "bg-orange-300 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* 메뉴명 + 순위변동 */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">{menu.name}</span>
                    <span
                      className={`text-sm font-medium ${
                        menu.rankChange > 0
                          ? "text-red-600"
                          : menu.rankChange < 0
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {rankChangeIcon}
                    </span>
                  </div>
                </div>

                {/* 판매 개수 */}
                <span className="text-right text-[#FF6B35] font-bold text-lg">
                  {menu.count}개
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
