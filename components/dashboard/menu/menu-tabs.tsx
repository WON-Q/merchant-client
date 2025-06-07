import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MenuTabsProps {
  /** 카테고리 목록 */
  categories: string[];
  /** 현재 활성화된 탭 */
  activeTab: string;
  /** 탭 변경 핸들러 */
  onTabChange: (tab: string) => void;
}

export function MenuTabs({
  categories,
  activeTab,
  onTabChange,
}: MenuTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  // 1) 원하는 순서 배열 정의
  const desiredOrder = [
    "전체",
    "면류",
    "밥류",
    "요리부",
    "사이드",
    "음료",
    "기타",
  ];
const orderedCategories = desiredOrder.filter((c) =>
    categories.includes(c)
  );


  // 활성 탭이 변경될 때 스크롤 위치 조정
  useEffect(() => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(
        `[data-tab="${activeTab}"]`
      );

      if (activeTabElement) {
        const tabsContainer = tabsRef.current;
        const tabsRect = tabsContainer.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();

        // 활성 탭이 보이지 않으면 스크롤 조정
        if (
          activeTabRect.left < tabsRect.left ||
          activeTabRect.right > tabsRect.right
        ) {
          const scrollLeft =
            activeTabRect.left -
            tabsRect.left +
            tabsContainer.scrollLeft -
            (tabsRect.width - activeTabRect.width) / 2;
          tabsContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
      }
    }
  }, [activeTab]);

  return (
    <div className="border border-neutral-100 rounded-md p-1 bg-neutral-50 shadow-sm">
      <div
        ref={tabsRef}
        className="flex w-full h-auto gap-1 overflow-x-auto no-scrollbar justify-center"
      >
        {orderedCategories.map((category) => {
          const tabValue =
            category === "전체" ? "all" : category.toLowerCase();
          const isActive = activeTab === tabValue;



          return (
            <button
              key={category}
              data-tab={tabValue}
              onClick={() => onTabChange(tabValue)}
              className={cn(
                "py-2.5 px-4 rounded-md whitespace-nowrap transition-colors",
                "text-sm font-medium flex-shrink-0",
                isActive
                  ? "bg-[#FF6B35] text-white shadow-sm"
                  : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-100"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
