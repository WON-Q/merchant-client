"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

export function DashboardDayBanner() {
  const dayItems = [
    { label: "알바 급여일", dday: "D-23" },
    { label: "식자재 발주일", dday: "D-15" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dayItems.length);
    }, 2000); // 2초마다 변경
    return () => clearInterval(interval);
  }, []);

  const currentItem = dayItems[currentIndex];

 return (
  <div className="flex items-center gap-3 px-5 py-2 bg-orange-100 text-orange-800 rounded-full text-base font-bold shadow-sm animate-fade-in transition-all duration-300">
    <CalendarDays className="h-5 w-5 flex-shrink-0" />
    <span>{currentItem.label}</span>
    <span className="ml-3 px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm">
      {currentItem.dday}
    </span>
  </div>
);

}
