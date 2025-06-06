"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useMerchantContext } from "@/contexts/merchant-context";
import { useWebSocket } from "@/contexts/websocket-context";
import toast, { Toaster } from "react-hot-toast";

interface OrderItem {
  menuName: string;
  quantity: number;
  options?: string[];
}

interface OrderMenuOption {
  optionName: string;
}

interface OrderMenu {
  orderMenuId: number; // 백엔드에서 필요한 식별자
  menuName: string;
  quantity: number;
  status: "ORDERED" | "SERVED"; // 백엔드 OrderMenuStatus enum
  options: OrderMenuOption[];
}

interface DailyOrder {
  orderCode: string;
  tableNumber: number;
  createdAt: string;
  menus: OrderMenu[];
}

interface KitchenOrder {
  id: string;
  orderCode: string;
  tableNumber: string;
  items: (OrderItem & {
    orderMenuId: number;
    menuStatus: "ORDERED" | "SERVED";
  })[]; // 개별 메뉴 상태 추가
  orderTime: string;
  status: "PENDING" | "COOKING" | "COMPLETED"; // UI 표시용 전체 상태
  isNewOrder?: boolean; // 새 주문 하이라이트용
}

export function KitchenUI() {
  const { merchantInfo } = useMerchantContext();
  const { subscribeToOrderNotifications } = useWebSocket();
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [highlightedOrders, setHighlightedOrders] = useState<Set<string>>(
    new Set()
  );

  // 주문 데이터 로드
  const loadOrders = async () => {
    try {
      console.log("📋 주방 주문 데이터 로드 중...");

      // 오늘 날짜 생성 (YYYY-MM-DD 형식)
      const today = new Date().toISOString().split("T")[0];

      // 일일 주문 조회 API 사용 (오래된 주문부터 표시)
      const response = await fetch(
        `/api/dashboard/orders/daily?date=${today}&page=0&size=1000&sort=createdAt,asc`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📋 주방 주문 데이터:", data.data);
        const orders: DailyOrder[] = data.data?.content || [];

        // 주방에서 사용할 형태로 변환
        const kitchenOrders: KitchenOrder[] = orders.map(
          (order: DailyOrder) => {
            // 주문의 메뉴 상태를 기반으로 전체 주문 상태 결정
            const menuStatuses = order.menus.map(
              (menu: OrderMenu) => menu.status
            );
            let kitchenStatus: "PENDING" | "COOKING" | "COMPLETED" = "PENDING";

            if (menuStatuses.every((status) => status === "SERVED")) {
              kitchenStatus = "COMPLETED";
            } else if (menuStatuses.some((status) => status === "SERVED")) {
              kitchenStatus = "COOKING";
            } else {
              // 모든 메뉴가 ORDERED 상태인 경우만 PENDING
              kitchenStatus = "PENDING";
            }

            return {
              id: order.orderCode,
              orderCode: order.orderCode,
              tableNumber: order.tableNumber.toString(),
              items: order.menus.map((menu: OrderMenu) => ({
                orderMenuId: menu.orderMenuId,
                menuName: menu.menuName,
                quantity: menu.quantity,
                menuStatus: menu.status,
                options: menu.options.map(
                  (opt: OrderMenuOption) => opt.optionName
                ),
              })),
              orderTime: order.createdAt,
              status: kitchenStatus,
            };
          }
        );

        setOrders(kitchenOrders);
        console.log(`📋 오늘 주방 주문: ${kitchenOrders.length}건`);
      } else {
        console.error("주방 주문 데이터 로드 실패:", response.statusText);
      }
    } catch (error) {
      console.error("주방 주문 데이터 로드 실패:", error);
    }
  };

  // WebSocket 주문 알림 구독
  useEffect(() => {
    if (!merchantInfo?.merchantId) return;

    const unsubscribe = subscribeToOrderNotifications((notification) => {
      console.log("주방: 새 주문 알림 수신:", notification);

      // 새 주문 하이라이트 설정
      if (
        notification &&
        typeof notification === "object" &&
        "orderCode" in notification
      ) {
        const orderCode = (notification as { orderCode: string }).orderCode;
        if (orderCode) {
          setHighlightedOrders((prev) => new Set([...prev, orderCode]));

          // 5초 후 하이라이트 제거
          setTimeout(() => {
            setHighlightedOrders((prev) => {
              const newSet = new Set(prev);
              newSet.delete(orderCode);
              return newSet;
            });
          }, 5000);
        }
      }

      // 주방 화면에서는 모든 알림에 대해 데이터 새로고침
      loadOrders();
    });

    return () => unsubscribe();
  }, [merchantInfo, subscribeToOrderNotifications]);

  // 초기 데이터 로드
  useEffect(() => {
    loadOrders();
  }, []);

  // 드래그 앤 드롭 핸들러 (전체 주문 + 개별 메뉴 단위)
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // 주문 대기로의 드래그 이동 차단
    if (destination.droppableId === "PENDING") {
      toast.error("주문 대기 상태로는 이동할 수 없습니다.");
      return;
    }

    // 전체 주문 드래그인지 개별 메뉴 드래그인지 구분
    if (draggableId.startsWith("order-")) {
      // 전체 주문 드래그 - 해당 주문의 모든 메뉴 상태를 일괄 변경
      const orderCode = draggableId.replace("order-", "");
      const targetOrder = orders.find((order) => order.orderCode === orderCode);

      if (!targetOrder) return;

      const newStatus =
        destination.droppableId === "COMPLETED" ? "SERVED" : "ORDERED";

      console.log(`🔄 전체 주문 상태 변경: ${orderCode} → ${newStatus}`);

      // 즉시 UI 상태 업데이트 (낙관적 업데이트)
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          if (order.orderCode === orderCode) {
            const updatedItems = order.items.map((item) => ({
              ...item,
              menuStatus: newStatus as "ORDERED" | "SERVED",
            }));

            let overallStatus: "PENDING" | "COOKING" | "COMPLETED" = "PENDING";
            if (newStatus === "SERVED") {
              overallStatus = "COMPLETED";
            } else {
              overallStatus = "PENDING";
            }

            return { ...order, items: updatedItems, status: overallStatus };
          }
          return order;
        });
      });

      // 각 메뉴에 대해 API 호출
      try {
        const promises = targetOrder.items.map((item) =>
          fetch(`/api/dashboard/orders/${orderCode}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderMenuId: item.orderMenuId,
              status: newStatus,
            }),
          })
        );

        const responses = await Promise.all(promises);
        const allSuccessful = responses.every((response) => response.ok);

        if (allSuccessful) {
          console.log(
            `✅ 전체 주문 상태 변경 성공: ${orderCode} → ${newStatus}`
          );
          const statusText = newStatus === "SERVED" ? "완료" : "대기";
          toast.success(
            `테이블 ${targetOrder.tableNumber} 전체 주문이 "${statusText}"로 변경되었습니다.`
          );
        } else {
          throw new Error("일부 메뉴 상태 변경에 실패했습니다.");
        }
      } catch (error) {
        console.error("전체 주문 상태 업데이트 실패:", error);
        toast.error("전체 주문 상태 변경에 실패했습니다.");

        // 실패 시 원상복구
        loadOrders();
      }

      return;
    }

    // 개별 메뉴 드래그 (기존 로직)
    const [orderCode, orderMenuIdStr] = draggableId.split("-");
    const orderMenuId = parseInt(orderMenuIdStr);

    const newStatus =
      destination.droppableId === "COMPLETED" ? "SERVED" : "ORDERED";
    const oldStatus = source.droppableId === "COMPLETED" ? "SERVED" : "ORDERED";

    console.log(`🔄 메뉴 상태 변경: ${orderMenuId} → ${newStatus}`);

    // 즉시 UI 상태 업데이트 (낙관적 업데이트)
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.orderCode === orderCode) {
          const updatedItems = order.items.map((item) =>
            item.orderMenuId === orderMenuId
              ? { ...item, menuStatus: newStatus as "ORDERED" | "SERVED" }
              : item
          );

          // 전체 주문 상태 재계산
          const allServed = updatedItems.every(
            (item) => item.menuStatus === "SERVED"
          );
          const someServed = updatedItems.some(
            (item) => item.menuStatus === "SERVED"
          );

          let overallStatus: "PENDING" | "COOKING" | "COMPLETED" = "PENDING";
          if (allServed) {
            overallStatus = "COMPLETED";
          } else if (someServed) {
            overallStatus = "COOKING";
          } else {
            // 모든 메뉴가 ORDERED 상태인 경우만 PENDING
            overallStatus = "PENDING";
          }

          return { ...order, items: updatedItems, status: overallStatus };
        }
        return order;
      });
    });

    try {
      const response = await fetch(
        `/api/dashboard/orders/${orderCode}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderMenuId, status: newStatus }),
        }
      );

      if (response.ok) {
        console.log(`✅ 메뉴 상태 변경 성공: ${orderMenuId} → ${newStatus}`);
        // 성공 토스트 메시지
        const statusText = newStatus === "SERVED" ? "완료" : "대기";
        toast.success(`메뉴 상태가 "${statusText}"로 변경되었습니다.`);
      } else {
        console.error(`❌ 메뉴 상태 변경 실패: ${response.statusText}`);

        // 에러 메시지 파싱
        let errorMessage = "메뉴 상태 변경에 실패했습니다.";
        try {
          const errorData = await response.json();
          if (errorData.errorMessage) {
            errorMessage = errorData.errorMessage;
          }
        } catch (e) {
          console.error("에러 응답 파싱 실패:", e);
        }

        toast.error(errorMessage);

        // 실패 시 원상복구
        setOrders((prevOrders) => {
          return prevOrders.map((order) => {
            if (order.orderCode === orderCode) {
              const revertedItems = order.items.map((item) =>
                item.orderMenuId === orderMenuId
                  ? { ...item, menuStatus: oldStatus as "ORDERED" | "SERVED" }
                  : item
              );

              // 전체 주문 상태 재계산
              const allServed = revertedItems.every(
                (item) => item.menuStatus === "SERVED"
              );
              const someServed = revertedItems.some(
                (item) => item.menuStatus === "SERVED"
              );

              let overallStatus: "PENDING" | "COOKING" | "COMPLETED" =
                "PENDING";
              if (allServed) {
                overallStatus = "COMPLETED";
              } else if (someServed) {
                overallStatus = "COOKING";
              } else {
                // 모든 메뉴가 ORDERED 상태인 경우만 PENDING
                overallStatus = "PENDING";
              }

              return { ...order, items: revertedItems, status: overallStatus };
            }
            return order;
          });
        });
      }
    } catch (error) {
      console.error("메뉴 상태 업데이트 실패:", error);
      toast.error("네트워크 오류로 메뉴 상태 변경에 실패했습니다.");

      // 에러 시 원상복구
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          if (order.orderCode === orderCode) {
            const revertedItems = order.items.map((item) =>
              item.orderMenuId === orderMenuId
                ? { ...item, menuStatus: oldStatus as "ORDERED" | "SERVED" }
                : item
            );

            const allServed = revertedItems.every(
              (item) => item.menuStatus === "SERVED"
            );
            const someServed = revertedItems.some(
              (item) => item.menuStatus === "SERVED"
            );

            let overallStatus: "PENDING" | "COOKING" | "COMPLETED" = "PENDING";
            if (allServed) {
              overallStatus = "COMPLETED";
            } else if (someServed) {
              overallStatus = "COOKING";
            } else {
              // 모든 메뉴가 ORDERED 상태인 경우만 PENDING
              overallStatus = "PENDING";
            }

            return { ...order, items: revertedItems, status: overallStatus };
          }
          return order;
        });
      });
    }
  };

  // 상태별 주문 그룹 가져오기 (메뉴 그룹화)
  const getOrderGroupsByStatus = (status: string) => {
    const orderGroups = new Map<
      string,
      {
        order: KitchenOrder;
        items: (OrderItem & {
          orderMenuId: number;
          menuStatus: "ORDERED" | "SERVED";
        })[];
      }
    >();

    orders.forEach((order) => {
      if (status === "COMPLETED") {
        // 완료 영역: 모든 메뉴가 완료된 주문만 포함
        const allItemsCompleted = order.items.every(
          (item) => item.menuStatus === "SERVED"
        );
        if (allItemsCompleted && order.items.length > 0) {
          orderGroups.set(order.orderCode, {
            order,
            items: order.items,
          });
        }
      } else {
        // 다른 영역: 기존 로직 유지
        const filteredItems = order.items.filter((item) => {
          return (
            (status === "PENDING" &&
              item.menuStatus === "ORDERED" &&
              order.status === "PENDING") ||
            (status === "COOKING" &&
              order.status === "COOKING" &&
              item.menuStatus === "ORDERED") // 조리 중 영역에서는 완료되지 않은 메뉴만 표시
          );
        });

        if (filteredItems.length > 0) {
          orderGroups.set(order.orderCode, {
            order,
            items: filteredItems,
          });
        }
      }
    });

    // 오래된 주문부터 정렬
    return Array.from(orderGroups.values()).sort(
      (a, b) =>
        new Date(a.order.orderTime).getTime() -
        new Date(b.order.orderTime).getTime()
    );
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getElapsedTime = (orderTime: string) => {
    const now = new Date();
    const order = new Date(orderTime);
    const diffMs = now.getTime() - order.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins;
  };

  const OrderGroupCard = ({
    orderGroup,
    index,
  }: {
    orderGroup: {
      order: KitchenOrder;
      items: (OrderItem & {
        orderMenuId: number;
        menuStatus: "ORDERED" | "SERVED";
      })[];
    };
    index: number;
  }) => {
    const { order, items } = orderGroup;
    const isHighlighted = highlightedOrders.has(order.orderCode);
    const isCompleted = items.every((item) => item.menuStatus === "SERVED");

    // 영수증 스타일 색상 결정
    const getReceiptStyle = () => {
      if (isHighlighted) {
        return "bg-yellow-50 border-yellow-300 shadow-lg animate-pulse";
      } else if (isCompleted) {
        return "bg-green-50 border-green-300";
      } else {
        return "bg-white border-gray-300";
      }
    };

    // 상단 색상 바 스타일
    const getTopBarStyle = () => {
      if (isHighlighted) {
        return "bg-yellow-500";
      } else if (isCompleted) {
        return "bg-green-500";
      } else if (order.status === "PENDING") {
        return "bg-blue-500";
      } else {
        return "bg-[#FF6B35]";
      }
    };

    return (
      <Draggable draggableId={`order-${order.orderCode}`} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-4"
          >
            <Card
              className={`border-2 hover:shadow-lg transition-all duration-500 overflow-hidden ${getReceiptStyle()} ${
                snapshot.isDragging ? "rotate-2 scale-105 shadow-2xl" : ""
              }`}
            >
              {/* 영수증 스타일 상단 색상 바 */}
              <div className={`h-3 w-full ${getTopBarStyle()}`}></div>

              <div className="p-6">
                {/* 주문 정보 헤더 */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-2xl text-[#333F48]">
                      테이블 {order.tableNumber}
                    </h4>
                    <p className="text-base text-gray-500 font-medium">
                      {order.orderCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-base text-gray-500 mb-2">
                      <Clock className="h-4 w-4" />
                      {formatTime(order.orderTime)}
                    </div>
                    <Badge
                      variant={
                        getElapsedTime(order.orderTime) > 15
                          ? "error"
                          : "secondary"
                      }
                      className="text-base px-3 py-1"
                    >
                      {getElapsedTime(order.orderTime)}분
                    </Badge>
                  </div>
                </div>

                {/* 점선 구분선 (영수증 스타일) */}
                <div className="border-t border-dashed border-gray-400 my-4"></div>

                {/* 메뉴 목록 */}
                <div className="space-y-3">
                  {items.map((item, itemIndex) => (
                    <Draggable
                      key={`${order.orderCode}-${item.orderMenuId}`}
                      draggableId={`${order.orderCode}-${item.orderMenuId}`}
                      index={index * 100 + itemIndex} // 고유한 인덱스 생성
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 bg-gray-50 rounded-lg border-2 border-dashed transition-all ${
                            snapshot.isDragging
                              ? "opacity-50 border-[#FF6B35] shadow-lg"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <span className="font-bold text-xl text-[#333F48] block mb-1">
                                {item.menuName}
                              </span>
                              {item.options && item.options.length > 0 && (
                                <div className="text-sm text-gray-600 font-medium">
                                  옵션: {item.options.join(", ")}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className="text-lg px-3 py-1 font-bold"
                              >
                                {item.quantity}개
                              </Badge>
                              <Badge
                                variant={
                                  item.menuStatus === "SERVED"
                                    ? "success"
                                    : "secondary"
                                }
                                className="text-sm px-2 py-1"
                              >
                                {item.menuStatus === "SERVED" ? "완료" : "대기"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>

                {/* 하단 점선 구분선 (영수증 스타일) */}
                <div className="border-t border-dashed border-gray-400 mt-4 pt-3">
                  <div className="text-center text-sm text-gray-500 font-mono">
                    총 {items.length}개 메뉴
                  </div>
                </div>
              </div>

              {/* 영수증 스타일 하단 색상 바 */}
              <div className={`h-2 w-full ${getTopBarStyle()}`}></div>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  const DropZone = ({
    title,
    status,
    bgColor,
    textColor,
  }: {
    title: string;
    status: string;
    bgColor: string;
    textColor: string;
  }) => {
    const orderGroups = getOrderGroupsByStatus(status);
    const isCompletedZone = status === "COMPLETED";

    return (
      <div className="flex-1">
        <div className={`${bgColor} ${textColor} p-6 rounded-t-lg text-center`}>
          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-lg opacity-90">
            {isCompletedZone
              ? "완료된 주문 드롭 영역"
              : `${orderGroups.length}개 주문`}
          </p>
        </div>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[700px] p-6 rounded-b-lg border-2 border-dashed transition-colors ${
                snapshot.isDraggingOver
                  ? "border-[#FF6B35] bg-orange-50"
                  : "border-gray-200"
              } ${
                isCompletedZone ? "bg-green-50 border-green-300" : "bg-gray-50"
              }`}
            >
              {/* 완료 영역이 아닌 경우에만 주문 카드들을 렌더링 */}
              {!isCompletedZone &&
                orderGroups.map((orderGroup, index) => (
                  <OrderGroupCard
                    key={orderGroup.order.orderCode}
                    orderGroup={orderGroup}
                    index={index}
                  />
                ))}
              {provided.placeholder}

              {/* 빈 상태 메시지 */}
              {!isCompletedZone && orderGroups.length === 0 && (
                <div className="text-center text-gray-400 mt-16">
                  <p className="text-2xl mb-4 font-semibold">주문이 없습니다</p>
                  <p className="text-lg">
                    {status === "PENDING" &&
                      "새로운 주문표가 들어오면 여기에 표시됩니다"}
                    {status === "COOKING" &&
                      "조리 중인 주문표가 여기에 표시됩니다"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    💡 전체 주문표를 드래그하거나 개별 메뉴를 드래그할 수
                    있습니다
                  </p>
                </div>
              )}

              {/* 완료 영역의 안내 메시지 */}
              {isCompletedZone && (
                <div className="text-center text-green-600 mt-32">
                  <div className="text-6xl mb-6">✅</div>
                  <p className="text-3xl mb-4 font-bold">조리 완료</p>
                  <p className="text-xl mb-6">
                    완료된 주문과 메뉴를 여기로 드래그하세요
                  </p>
                  <div className="bg-white rounded-lg p-6 mx-8 border-2 border-dashed border-green-400">
                    <p className="text-lg text-gray-600 mb-2">
                      📝 전체 주문표를 드래그하면 모든 메뉴가 완료됩니다
                    </p>
                    <p className="text-lg text-gray-600">
                      🍽️ 개별 메뉴를 드래그하면 해당 메뉴만 완료됩니다
                    </p>
                  </div>
                  {orderGroups.length > 0 && (
                    <div className="mt-8 p-4 bg-white rounded-lg border border-green-300 mx-8">
                      <p className="text-lg font-semibold text-green-700">
                        오늘 완료된 주문: {orderGroups.length}건
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        모든 메뉴가 완료된 주문만 집계됩니다
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="h-full">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "16px",
            padding: "16px 24px",
            borderRadius: "8px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#333F48] mb-4">주방 관리</h1>
        <p className="text-xl text-gray-600 mb-3">
          오늘 들어온 주문을 관리하세요. 전체 주문표나 개별 메뉴를 드래그하여
          조리 상태를 변경할 수 있습니다.
        </p>
        <div className="text-lg text-gray-500">
          총 {orders.length}건의 주문이 있습니다.
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DropZone
            title="주문 대기"
            status="PENDING"
            bgColor="bg-blue-600"
            textColor="text-white"
          />

          <DropZone
            title="조리 중"
            status="COOKING"
            bgColor="bg-orange-600"
            textColor="text-white"
          />

          <DropZone
            title="조리 완료"
            status="COMPLETED"
            bgColor="bg-green-600"
            textColor="text-white"
          />
        </div>
      </DragDropContext>
    </div>
  );
}
