import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface OrderNotification {
  orderCode: string;
  merchantId: number;
  tableNumber: number;
  totalAmount: number;
  orderStatus: "ORDERED" | "PAID" | "CANCELED" | "REFUNDED";
  paymentStatus: "PENDING" | "COMPLETED" | "CANCELED" | "FAILED";
  timestamp: string; // LocalDateTime를 문자열로 받음
  message: string;
}

export interface ConnectionStatus {
  status: "connected" | "disconnected";
}

export interface ErrorMessage {
  error: string;
}

type DataType =
  | OrderNotification
  | ConnectionStatus
  | ErrorMessage
  | Record<string, unknown>;

class WebSocketService {
  private static instance: WebSocketService;
  private stompClient: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private connected: boolean = false;
  private listeners: Map<string, Set<(data: DataType) => void>> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private websocketUrl: string = "";
  private debug: boolean = true; // 디버깅 활성화

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log("[WebSocketService]", ...args);
    }
  }

  private error(...args: unknown[]): void {
    if (this.debug) {
      console.error("[WebSocketService ERROR]", ...args);
    }
  }

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public init(websocketUrl: string): void {
    this.log("Initializing with URL:", websocketUrl);
    this.websocketUrl = websocketUrl;
    this.connect();

    // 실시간 네트워크 상태 변화 감지
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.log("Browser went online, reconnecting...");
        if (!this.connected) {
          this.connect();
        }
      });

      window.addEventListener("offline", () => {
        this.log("Browser went offline, will reconnect when online");
      });
    }
  }

  // 연결 상태 테스트
  public testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.connected) {
        this.log("Connection is already established");
        resolve(true);
        return;
      }

      this.log("Testing connection...");

      const timeoutId = setTimeout(() => {
        this.log("Connection test timed out");
        resolve(false);
      }, 5000);

      const tempListener = this.subscribe("connection", (data) => {
        if ("status" in data && data.status === "connected") {
          clearTimeout(timeoutId);
          resolve(true);
        }
      });

      // 연결 시도
      this.connect();

      // 5초 후 리스너 제거
      setTimeout(() => {
        tempListener();
      }, 5500);
    });
  }

  private connect(): void {
    try {
      this.log("Connecting to:", this.websocketUrl);

      // 백업 URL 사용
      if (!this.websocketUrl) {
        this.error("WebSocket URL is empty, using backup URL");
        this.websocketUrl = "http://localhost:8080/ws";
      }

      // URL 프로토콜 확인
      let finalUrl = this.websocketUrl;

      // 브라우저가 HTTPS를 사용하는데 웹소켓이 WS를 사용하는 경우 오류가 발생할 수 있음
      if (typeof window !== "undefined") {
        const isSecure = window.location.protocol === "https:";
        this.log(
          `Current page protocol: ${window.location.protocol}, secure: ${isSecure}`
        );

        // 자동으로 프로토콜 조정
        if (isSecure && finalUrl.startsWith("http://")) {
          finalUrl = finalUrl.replace("http://", "https://");
          this.log(`Automatically switching to secure protocol: ${finalUrl}`);
        }
      }

      this.stompClient = new Client({
        webSocketFactory: () => {
          this.log("Creating SockJS instance for:", finalUrl);
          return new SockJS(finalUrl);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: this.onConnected.bind(this),
        onDisconnect: this.onDisconnected.bind(this),
        onStompError: this.onError.bind(this),
        debug: (msg) => {
          this.log("STOMP Debug:", msg);
        },
      });

      this.log("Activating STOMP client");
      this.stompClient.activate();
    } catch (error) {
      this.error("Connection error:", error);
      this.scheduleReconnect();
    }
  }

  private onConnected(): void {
    this.connected = true;
    this.log("Connected successfully");

    // 저장된 구독 다시 연결
    this.resubscribeAll();

    // 연결 이벤트 발송
    this.notifyListeners("connection", { status: "connected" });
  }

  private onDisconnected(): void {
    this.connected = false;
    this.log("Disconnected");
    this.notifyListeners("connection", { status: "disconnected" });
    this.scheduleReconnect();
  }

  private onError(error: unknown): void {
    this.error("STOMP error:", error);
    this.notifyListeners("error", { error: String(error) });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.log("Attempting to reconnect...");
      this.connect();
    }, 5000);
  }

  public disconnect(): void {
    if (this.stompClient && this.connected) {
      this.log("Disconnecting...");
      this.stompClient.deactivate();
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.connected = false;
    this.subscriptions.clear();
  }

  public subscribe(
    topic: string,
    callback: (data: DataType) => void
  ): () => void {
    this.log(`Subscribing to ${topic}`);

    if (!this.stompClient || !this.connected) {
      this.log(`Not connected yet, just adding listener for ${topic}`);
      // 연결이 없는 경우 리스너만 등록
      this.addListener(topic, callback);
      return () => this.removeListener(topic, callback);
    }

    // 이미 구독 중인 경우 리스너만 추가
    if (this.subscriptions.has(topic)) {
      this.log(`Already subscribed to ${topic}, adding listener`);
      this.addListener(topic, callback);
      return () => this.removeListener(topic, callback);
    }

    // 새로운 구독 추가
    try {
      this.log(`New subscription to ${topic}`);
      const subscription = this.stompClient.subscribe(topic, (message) => {
        try {
          this.log(`Raw message received on ${topic}:`, message.body);
          const data = JSON.parse(message.body) as DataType;
          this.log(`Parsed message on ${topic}:`, data);
          this.notifyListeners(topic, data);
        } catch (error) {
          this.error(`Error parsing message on ${topic}:`, error);
          this.error(`Raw message body:`, message.body);
        }
      });

      this.subscriptions.set(topic, subscription);
      this.addListener(topic, callback);

      return () => {
        this.removeListener(topic, callback);
        // 리스너가 없으면 구독 해제
        if (
          !this.listeners.has(topic) ||
          this.listeners.get(topic)!.size === 0
        ) {
          this.unsubscribe(topic);
        }
      };
    } catch (error) {
      this.error(`Error subscribing to ${topic}:`, error);
      return () => {};
    }
  }

  private unsubscribe(topic: string): void {
    this.log(`Unsubscribing from ${topic}`);
    try {
      const subscription = this.subscriptions.get(topic);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(topic);
      }
    } catch (error) {
      this.error(`Error unsubscribing from ${topic}:`, error);
    }
  }

  private resubscribeAll(): void {
    this.log("Resubscribing to all topics");
    // 기존 구독 정보 저장
    const topics = Array.from(this.listeners.keys());
    this.subscriptions.clear();

    // 구독 다시 연결
    topics.forEach((topic) => {
      if (this.stompClient && this.connected && this.listeners.has(topic)) {
        try {
          this.log(`Resubscribing to ${topic}`);
          const subscription = this.stompClient.subscribe(topic, (message) => {
            try {
              this.log(
                `Raw message received on ${topic} (resubscribed):`,
                message.body
              );
              const data = JSON.parse(message.body) as DataType;
              this.log(`Parsed message on ${topic} (resubscribed):`, data);
              this.notifyListeners(topic, data);
            } catch (error) {
              this.error(`Error parsing message on ${topic}:`, error);
              this.error(`Raw message body:`, message.body);
            }
          });
          this.subscriptions.set(topic, subscription);
        } catch (error) {
          this.error(`Error resubscribing to ${topic}:`, error);
        }
      }
    });
  }

  private addListener(topic: string, callback: (data: DataType) => void): void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)!.add(callback);
  }

  private removeListener(
    topic: string,
    callback: (data: DataType) => void
  ): void {
    if (this.listeners.has(topic)) {
      this.listeners.get(topic)!.delete(callback);
    }
  }

  private notifyListeners(topic: string, data: DataType): void {
    if (this.listeners.has(topic)) {
      this.listeners.get(topic)!.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          this.error(`Error in notification listener for ${topic}:`, error);
        }
      });
    }
  }

  /**
   * 주문 알림 구독
   * @param merchantId 가맹점 ID
   * @param callback 알림 수신 콜백
   */
  public subscribeToOrderNotifications(
    merchantId: number,
    callback: (notification: OrderNotification) => void
  ): () => void {
    const topic = `/topic/merchant/${merchantId}/orders`;
    this.log(
      `Subscribing to order notifications for merchant ${merchantId}, topic: ${topic}`
    );
    return this.subscribe(topic, callback as (data: DataType) => void);
  }

  public isConnected(): boolean {
    return this.connected;
  }
}

export default WebSocketService.getInstance();
