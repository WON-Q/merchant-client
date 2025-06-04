"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 테스트용 알림 목록
  const [notifications, setNotifications] = useState([
    "[공지] 새로운 기능이 업데이트되었습니다 🎉",
    "[주문] 주문번호 #12345 가 접수되었습니다",
  ]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 알림 버튼 */}
      <Button
        variant="ghost"
        className="relative p-2 h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6 text-[#FF6B35]" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </Button>

      {/* 드롭다운 알림창 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-150 flex flex-col"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="p-4 border-b border-neutral-200 font-bold text-base">
            알림 내역
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-sm text-neutral-500 text-center py-4">
                새로운 알림이 없습니다.
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-neutral-100 text-sm text-neutral-800"
                >
                  {notification}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
