"use client";

import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";

const monthlyBestMenus = [
  { name: "김치찌개", count: 120, rankChange: 1, review: "국물이 시원해요!" },
  { name: "된장찌개", count: 95, rankChange: -1, review: "구수한 맛이에요." },
  { name: "제육볶음", count: 80, rankChange: 0, review: "매콤한 맛이 일품!" },
  { name: "비빔밥", count: 75, rankChange: 2, review: "야채가 신선해요." },
  { name: "냉면", count: 60, rankChange: -2, review: "시원하게 한 그릇." },
];

const dailyBestMenus = [
  { name: "김치찌개", count: 120, rankChange: 1, review: "국물이 시원해요!" },
  { name: "된장찌개", count: 95, rankChange: -1, review: "구수한 맛이에요." },
  { name: "제육볶음", count: 80, rankChange: 0, review: "매콤한 맛이 일품!" },
  { name: "비빔밥", count: 75, rankChange: 2, review: "야채가 신선해요." },
  { name: "냉면", count: 60, rankChange: -2, review: "시원하게 한 그릇." },
];

const monthlyWorstMenus = [
  { name: "김치찌개", count: 120, rankChange: 1, review: "국물이 시원해요!" },
  { name: "된장찌개", count: 95, rankChange: -1, review: "구수한 맛이에요." },
  { name: "제육볶음", count: 80, rankChange: 0, review: "매콤한 맛이 일품!" },
  { name: "비빔밥", count: 75, rankChange: 2, review: "야채가 신선해요." },
  { name: "냉면", count: 60, rankChange: -2, review: "시원하게 한 그릇." },
];
const dailyWorstMenus = [
  { name: "김치찌개", count: 120, rankChange: 1, review: "국물이 시원해요!" },
  { name: "된장찌개", count: 95, rankChange: -1, review: "구수한 맛이에요." },
  { name: "제육볶음", count: 80, rankChange: 0, review: "매콤한 맛이 일품!" },
  { name: "비빔밥", count: 75, rankChange: 2, review: "야채가 신선해요." },
  { name: "냉면", count: 60, rankChange: -2, review: "시원하게 한 그릇." },
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
          size="lg"
          shape="pill"
          onClick={() => setActiveTab("월별")}
        >
          월별
        </Button>
        <Button
          variant={activeTab === "일별" ? "primary" : "outline"}
          size="lg"
          shape="pill"
          onClick={() => setActiveTab("일별")}
        >
          일별
        </Button>
      </div>

      {/* 메뉴 현황 타이틀 */}
      <div className="text-2xl font-bold text-gray-900 py-2">메뉴 현황</div>
      <div className="w-full border-t"></div>

      {/* 베스트/워스트 탭 */}
      <div className="flex border-b border-gray-300 mb-2">
        <button
          onClick={() => setMenuType("베스트")}
          className={`flex-1 text-center py-2  text-xl font-semibold transition-colors duration-200 ${
            menuType === "베스트"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500"
          }`}
        >Best
          
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
        {/* 랭킹 + 메뉴명/리뷰 + 개수 */}
        <div className="flex justify-between items-center">
          {/* 왼쪽 영역 (랭킹 + 메뉴명 + 리뷰) */}
          <div className="flex gap-5 items-center">
            {/* ⭐️ 랭킹 숫자 */}
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

            {/* 메뉴명 + 리뷰 (column) */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900">{menu.name}</span>
                {/* 순위변동 */}
                <span
                  className={`ml-2 text-sm font-medium ${
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

              {/* ⭐️ 리뷰는 아래로 */}
              <div className="text-sm text-gray-500">“{menu.review}”</div>
            </div>
          </div>

          {/* 판매 개수 */}
          <span className="text-right text-gray-800 font-bold text-lg">
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
