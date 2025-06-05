"use client";

import { CalendarDays } from "lucide-react";

export function DashboardDayBanner({
  label,
  dday,
}: {
  label: string;
  dday: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-2 bg-orange-100 text-orange-800 rounded-full text-base font-bold shadow-sm animate-fade-in transition-all duration-300">
      <CalendarDays className="h-5 w-5 flex-shrink-0" />
      <span>{label}</span>
      <span className="ml-3 px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm">
        {dday}
      </span>
    </div>
  );
}
