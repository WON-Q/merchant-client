"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HelpSection } from "@/components/dashboard/help-section";
import { UserProfileDropdown } from "@/components/dashboard/user-profile-dropdown";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { NotificationDropdown} from "@/components/dashboard/NotificationDropdown";
import { DashboardDayBanner } from "@/components/dashboard/DashboardDayBanner";
import {
  MerchantProvider,
  useMerchantContext,
} from "@/contexts/merchant-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MerchantProvider>
      <DashboardContent>{children}</DashboardContent>
    </MerchantProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { merchantInfo, error } = useMerchantContext();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-3xl font-bold text-[#FF6B35]">원큐오더</div>
          <div className="text-lg text-red-500">오류가 발생했습니다</div>
          <div className="mt-2">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
        <Link href="/dashboard" className="hidden items-center gap-2 md:flex">
          <span className="text-xl font-bold text-[#FF6B35]">원큐오더</span>
          
        </Link>

         

        <div className="flex items-center gap-4">
       
          <DashboardDayBanner />
         <NotificationDropdown />
          <UserProfileDropdown
            userName={merchantInfo?.merchantOwnerName || "사장님"}
            userEmail={merchantInfo?.merchantName || "가맹점"}
          />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-white md:block">
          <div className="flex h-full flex-col overflow-y-auto p-4">
            <nav className="grid gap-2 text-sm">
              {DASHBOARD_ROUTES.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-50 text-xl",
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
