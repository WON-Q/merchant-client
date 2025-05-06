"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HelpSection } from "@/components/dashboard/HelpSection";
import { UserProfileDropdown } from "@/components/dashboard/UserProfileDropdown";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 인증된 사용자에게 대시보드 표시
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
        <Link href="/dashboard" className="hidden items-center gap-2 md:flex">
          <span className="text-xl font-bold text-[#FF6B35]">원큐오더</span>
        </Link>

        <div className="flex items-center gap-4">
          <UserProfileDropdown userName="테스트" userEmail="test@test.com" />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-white md:block">
          <div className="flex h-full flex-col overflow-y-auto p-4">
            <nav className="grid gap-2 text-sm">
              {DASHBOARD_ROUTES.map((route) => {
                const Icon = route.icon; // 동적으로 아이콘 컴포넌트 렌더링
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-50",
                      pathname === route.path
                        ? "bg-neutral-100 text-[#FF6B35]"
                        : "text-neutral-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{route.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="flex-grow" />
            <div className="pt-4">
              <HelpSection />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
