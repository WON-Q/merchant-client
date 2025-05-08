"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/api/auth/use-auth";

interface UserProfileDropdownProps {
  userName: string;
  userEmail: string;
}

export function UserProfileDropdown({
  userName,
  userEmail,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  // 드롭다운 외부 클릭 시 닫기
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

  // 메뉴 아이템 클릭 핸들러
  const handleMenuClick = (action: string) => {
    setIsOpen(false);

    if (action === "settings") {
      router.push("/dashboard/settings");
    } else if (action === "logout") {
      // useAuth의 logout 함수 사용
      logout();
      router.push("/login");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 프로필 아바타 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-[#FF6B35] flex items-center justify-center flex-shrink-0 ring-1 ring-white/10 shadow-sm cursor-pointer"
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        tabIndex={0}
      >
        <span className="text-sm font-bold text-white leading-none">
          {userName.charAt(0)}
        </span>
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-150"
          role="menu"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-[#FF6B35] flex items-center justify-center flex-shrink-0">
                <span className="text-base font-bold text-white">
                  {userName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{userName}</div>
                <div className="text-xs text-neutral-500 truncate">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => handleMenuClick("settings")}
              className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>계정 설정</span>
            </button>
          </div>
          <div className="py-1 border-t border-neutral-200">
            <button
              onClick={() => handleMenuClick("logout")}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
