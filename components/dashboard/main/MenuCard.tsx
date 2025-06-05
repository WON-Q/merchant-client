"use client";

import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import { Button } from "@/components/ui/button";

const monthlyBestMenus = [
  { name: "짬뽕", count: 120, rankChange: 1, review: "얼큰하고 시원한 국물 맛이 일품이에요." },
  { name: "탕수육", count: 95, rankChange: -1, review: "겉은 바삭,속은 촉촉! 소스와 완벽한 조화"},
  { name: "멘보샤", count: 80, rankChange: 0, review:  "겉은 바삭, 새우살은 탱글탱글! 고급스러운 맛."},
  { name: "짬짜면", count: 75, rankChange: 2, review: "두 가지 메뉴를 한 번에!  " },
  { name: "칠리새우", count: 60, rankChange: -2, review: "매콤달콤한 소스에 새우가 정말 맛있어요."},
];

const dailyBestMenus = [
  { name: "탕수육", count: 120, rankChange: 2, review: "겉은 바삭,속은 촉촉! 소스와 완벽한 조화"},
   { name: "짬뽕", count: 95, rankChange: 1, review: "얼큰하고 시원한 국물 맛이 일품이에요." },
  { name: "짬짜면", count: 75, rankChange: 1, review: "두 가지 메뉴를 한 번에!  " },
    { name: "멘보샤", count: 80, rankChange: 0, review:  "겉은 바삭, 새우살은 탱글탱글! 고급스러운 맛."},
  { name: "칠리새우", count: 60, rankChange: -2, review: "매콤달콤한 소스에 새우가 정말 맛있어요."},
];

const monthlyWorstMenus = [
  { name: "망고크림중새우", count: 17, rankChange: 1, review: "조금 느끼하고 호불호가 갈릴 수 있는 메뉴" },
  { name: "볶음밥", count: 20, rankChange: -1, review: "평범한 맛으로 임팩트가 부족한 편이에요." },
  { name: "군만두", count: 25, rankChange: 0, review: "특별한 매력이 없는 기본 사이드 메뉴 느낌." },
  { name: "짜장면", count: 28, rankChange: 2, review: "무난하지만 특별한 맛의 임팩트는 약해요." },
  { name: "해물짬뽕", count: 31, rankChange: -2, review: "가격 대비 해물 양이 아쉬운 경우가 종종 있어요." },
];
const dailyWorstMenus = [
 { name: "망고크림중새우", count: 12, rankChange: 1, review: "조금 느끼하고 호불호가 갈릴 수 있는 메뉴" },
  { name: "군만두", count: 15, rankChange: 0, review: "특별한 매력이 없는 기본 사이드 메뉴 느낌." },
   { name: "볶음밥", count: 18, rankChange: -1, review: "평범한 맛으로 임팩트가 부족한 편이에요." },
  { name: "해물짬뽕", count: 23, rankChange: -2, review: "가격 대비 해물 양이 아쉬운 경우가 종종 있어요." },
   { name: "볶음밥", count: 30, rankChange: -1, review: "평범한 맛으로 임팩트가 부족한 편이에요." },
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
