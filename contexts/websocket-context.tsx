"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import WebSocketService, { OrderNotification } from "@/lib/websocket-service";
import { useMerchantContext } from "./merchant-context";

interface WebSocketContextType {
  isConnected: boolean;
  subscribeToOrderNotifications: (
    callback: (notification: OrderNotification) => void
  ) => () => void;
  notifications: OrderNotification[];
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  serverUrl?: string;
}

export function WebSocketProvider({
  children,
  serverUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws",
}: WebSocketProviderProps) {
  // 환경 변수 디버깅
  console.log("[WebSocketContext] Environment variable check:");
  console.log(" - NEXT_PUBLIC_WS_URL:", process.env.NEXT_PUBLIC_WS_URL);
  console.log(" - Using URL:", serverUrl);

  const { merchantInfo } = useMerchantContext();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

  // WebSocket 연결 초기화
  useEffect(() => {
    console.log(
      "[WebSocketContext] Initializing WebSocket with URL:",
      serverUrl
    );

    // 잘못된 URL이 제공되는지 확인
    if (!serverUrl) {
      console.error("[WebSocketContext] WebSocket URL is missing!");
    }

    // 웹소켓 서비스 초기화
    WebSocketService.init(serverUrl);

    // 연결 상태 구독
    const unsubscribe = WebSocketService.subscribe("connection", (data) => {
      console.log("[WebSocketContext] Connection status changed:", data);
      if ("status" in data) {
        setIsConnected(data.status === "connected");
      }
    });

    // 오류 상태 구독
    const errorUnsubscribe = WebSocketService.subscribe("error", (data) => {
      console.error("[WebSocketContext] WebSocket error:", data);
    });

    // 5초마다 연결 상태 확인
    const intervalId = setInterval(() => {
      const connected = WebSocketService.isConnected();
      setIsConnected(connected);
      console.log(
        `[WebSocketContext] Connection check: ${
          connected ? "connected" : "disconnected"
        }`
      );
    }, 5000);

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      unsubscribe();
      errorUnsubscribe();
      clearInterval(intervalId);
    };
  }, [serverUrl]);

  // 가맹점 ID가 있을 때만 주문 알림 구독
  useEffect(() => {
    // 디버깅용 로그
    console.log("[WebSocketContext] merchantInfo:", merchantInfo);

    if (!merchantInfo || !merchantInfo.merchantId) {
      console.log(
        "[WebSocketContext] No merchant ID available, skipping subscription"
      );
      return;
    }

    console.log(
      `[WebSocketContext] Subscribing with merchantId: ${merchantInfo.merchantId}`
    );

    // 주문 알림 구독
    const unsubscribe = WebSocketService.subscribeToOrderNotifications(
      merchantInfo.merchantId,
      (notification) => {
        console.log("[WebSocketContext] Received notification:", notification);
        console.log(
          "[WebSocketContext] Notification type:",
          typeof notification
        );
        console.log(
          "[WebSocketContext] Notification keys:",
          Object.keys(notification)
        );
        setNotifications((prev) => [notification, ...prev].slice(0, 50)); // 최대 50개만 유지
      }
    );

    return () => {
      console.log("[WebSocketContext] Unsubscribing from notifications");
      unsubscribe();
    };
  }, [merchantInfo]);

  // 컨텍스트 값
  const value: WebSocketContextType = {
    isConnected,
    subscribeToOrderNotifications: (callback) => {
      if (!merchantInfo?.merchantId) {
        console.error("Merchant ID is not available");
        return () => {};
      }
      return WebSocketService.subscribeToOrderNotifications(
        merchantInfo.merchantId,
        callback
      );
    },
    notifications,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
