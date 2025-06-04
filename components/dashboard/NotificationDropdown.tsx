"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/contexts/websocket-context";
import { OrderNotification } from "@/lib/websocket-service";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications: wsNotifications, isConnected } = useWebSocket();

  // 알림 목록 (웹소켓 알림 + 테스트용 초기 알림)
  const [notifications, setNotifications] = useState<
    (OrderNotification | string)[]
  >([]); // 웹소켓에서 알림이 오면 상태 업데이트
  useEffect(() => {
    console.log(
      "[NotificationDropdown] WebSocket notifications:",
      wsNotifications
    );

    if (wsNotifications.length > 0) {
      setNotifications((prev) => {
        console.log("[NotificationDropdown] Previous notifications:", prev);

        // 문자열 알림과 OrderNotification 객체를 합치기
        const stringNotifications = prev.filter(
          (item): item is string => typeof item === "string"
        );

        // 중복 제거 (orderCode 기준)
        const existingCodes = new Set(
          prev
            .filter(
              (item): item is OrderNotification => typeof item !== "string"
            )
            .map((item) => item.orderCode)
        );

        const newNotifications = wsNotifications.filter(
          (item) => !existingCodes.has(item.orderCode)
        );

        console.log(
          "[NotificationDropdown] New notifications to add:",
          newNotifications.length
        );

        const result = [...newNotifications, ...stringNotifications];
        console.log("[NotificationDropdown] Updated notifications:", result);

        return result;
      });
    }
  }, [wsNotifications]);

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
        {/* 웹소켓 연결 상태 표시 */}
        <span
          className="absolute bottom-0 right-0 h-2 w-2 rounded-full ring-1 ring-white"
          style={{ backgroundColor: isConnected ? "#22c55e" : "#ef4444" }}
        />
      </Button>

      {/* 드롭다운 알림창 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 max-h-96 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-150 flex flex-col"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="p-4 border-b border-neutral-200 font-bold text-base flex justify-between items-center">
            <span>알림 내역</span>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 연결 상태 디버그 정보를 콘솔에 출력
                  console.log(
                    "[NotificationDropdown] Testing WebSocket connection..."
                  );

                  import("@/lib/websocket-service").then((module) => {
                    const WebSocketService = module.default;
                    WebSocketService.testConnection().then((success) => {
                      console.log(
                        `[NotificationDropdown] Connection test ${
                          success ? "successful" : "failed"
                        }`
                      );

                      if (!success) {
                        console.log(
                          "[NotificationDropdown] Reloading page to reestablish connection"
                        );
                        window.location.reload();
                      }
                    });
                  });
                }}
                className="mr-2 p-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
              >
                재연결
              </button>
              <span className="flex items-center text-xs font-normal">
                {isConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    연결됨
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                    연결 안됨
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-sm text-neutral-500 text-center py-4">
                새로운 알림이 없습니다.
              </div>
            ) : (
              notifications.map((notification, index) => {
                if (typeof notification === "string") {
                  // 문자열 형태의 알림(기존 테스트용)
                  return (
                    <div
                      key={index}
                      className="p-3 rounded bg-neutral-100 text-sm text-neutral-800"
                    >
                      {notification}
                    </div>
                  );
                } else {
                  // OrderNotification 객체 형태의 알림(실시간)
                  // 백엔드에서 LocalDateTime이 ISO 문자열로 올 수 있으므로 안전하게 파싱
                  let timestamp: Date;
                  try {
                    timestamp = new Date(notification.timestamp);
                    // 유효하지 않은 날짜인 경우 현재 시간 사용
                    if (isNaN(timestamp.getTime())) {
                      timestamp = new Date();
                    }
                  } catch {
                    console.error(
                      "Error parsing timestamp:",
                      notification.timestamp
                    );
                    timestamp = new Date();
                  }

                  const timeAgo = formatDistanceToNow(timestamp, {
                    addSuffix: true,
                    locale: ko,
                  });

                  return (
                    <div
                      key={notification.orderCode}
                      className="p-3 rounded bg-orange-50 text-sm border-l-2 border-[#FF6B35]"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-[#FF6B35]">
                          주문 #{notification.orderCode}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {timeAgo}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="mr-2">
                          테이블 {notification.tableNumber}번
                        </span>
                        <span className="font-medium">
                          {notification.totalAmount.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-neutral-700">
                          {notification.message}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {notification.orderStatus}
                        </span>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
