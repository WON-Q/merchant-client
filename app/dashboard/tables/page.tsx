"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Plus, Settings, Users, Clock, DollarSign } from "lucide-react";
import { DiningTable, TableOrder } from "@/app/api/dashboard/tables/route";
import { OrderDetailResponse } from "@/app/api/dashboard/orders/[orderCode]/route";
import { useWebSocket } from "@/contexts/websocket-context";
import { useMerchantContext } from "@/contexts/merchant-context";

interface TableLayout extends Layout {
  tableNumber: number;
  capacity: number;
  status: string;
  orders?: TableOrder[];
}
const STORAGE_KEY = "table-layout";

// ✅ API로 테이블 가져오기 + 변환
const fetchTablesFromAPI = async (): Promise<TableLayout[]> => {
  try {
    const response = await fetch("/api/dashboard/tables"); // API route
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      const mappedLayout: TableLayout[] = result.data.map(
        (table: DiningTable) => ({
          i: table.diningTableId.toString(), // Unique key
          x: Math.floor(table.locationX / 50), // Adjust X position
          y: Math.floor(table.locationY / 50), // Adjust Y position
          w: Math.floor(table.locationW / 50), // ✅ 위치 가로
          h: Math.floor(table.locationH / 50),
          tableNumber: table.tableNumber, // 추가 저장
          capacity: table.capacity,
          status: table.status,
          orders: table.orders || [], // 주문 정보 추가
        })
      );

      return mappedLayout;
    } else {
      console.error("Invalid API response:", result);
      return [];
    }
  } catch (err) {
    console.error("Failed to fetch tables from API:", err);
    return [];
  }
};

export default function TablesPage() {
  const { merchantInfo } = useMerchantContext();
  const { isConnected, subscribeToOrderNotifications } = useWebSocket();
  const [layout, setLayout] = useState<TableLayout[]>([]); // ✅ useState 수정
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    [orderCode: string]: OrderDetailResponse;
  }>({});
  const [loadingOrderDetails, setLoadingOrderDetails] = useState<{
    [orderCode: string]: boolean;
  }>({});

  // ✅ 초기 useEffect
  useEffect(() => {
    const loadLayout = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            console.log("📦 localStorage layout 로드됨:", parsed);
            setLayout(parsed);
            return; // ✅ localStorage 우선 사용
          }
        } catch (e) {
          console.error("Failed to parse localStorage layout:", e);
        }
      }

      // localStorage 없으면 API fetch
      const apiLayout = await fetchTablesFromAPI();
      setLayout(apiLayout);

      // 초기 상태도 localStorage 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiLayout));
    };

    loadLayout();
  }, []);

  // WebSocket 주문 알림 구독
  useEffect(() => {
    if (!merchantInfo?.merchantId) return;

    console.log("🔌 WebSocket 주문 알림 구독 시작");

    const unsubscribe = subscribeToOrderNotifications((notification) => {
      console.log("📦 주문 알림 수신:", notification);

      // 알림 받으면 테이블 데이터 새로고침
      refreshTableData();
    });

    return () => {
      console.log("🔌 WebSocket 구독 해제");
      unsubscribe();
    };
  }, [merchantInfo, subscribeToOrderNotifications]);

  // 테이블 데이터 새로고침 함수
  const refreshTableData = async () => {
    try {
      console.log("🔄 테이블 데이터 새로고침 중...");
      const apiLayout = await fetchTablesFromAPI();

      setLayout((prevLayout) => {
        // 기존 위치 정보는 유지하고 상태와 주문 정보만 업데이트
        const updatedLayout = apiLayout.map((newTable) => {
          const existingTable = prevLayout.find((t) => t.i === newTable.i);
          if (existingTable) {
            return {
              ...existingTable, // 기존 위치 정보 유지
              status: newTable.status, // 상태 업데이트
              orders: newTable.orders, // 주문 정보 업데이트
            };
          }
          return newTable; // 새로운 테이블인 경우 그대로 추가
        });

        // localStorage에 업데이트된 상태 저장
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayout));

        return updatedLayout;
      });

      console.log("✅ 테이블 데이터 새로고침 완료");
    } catch (error) {
      console.error("❌ 테이블 데이터 새로고침 실패:", error);
    }
  };

  // 테이블 상태 결정 함수 (주문 존재 여부에 따라)
  const getTableStatus = (table: TableLayout): "READY" | "IN_PROGRESS" => {
    return table.orders && table.orders.length > 0 ? "IN_PROGRESS" : "READY";
  };

  // 주문 총액 계산 함수
  const getTotalAmount = (orders: TableOrder[]): number => {
    return orders?.reduce((total, order) => total + order.totalAmount, 0) || 0;
  };

  // 주문 상세 정보 가져오기 함수
  const fetchOrderDetail = async (
    orderCode: string
  ): Promise<OrderDetailResponse | null> => {
    // 이미 로딩 중이거나 캐시된 데이터가 있으면 반환
    if (loadingOrderDetails[orderCode] || orderDetails[orderCode]) {
      return orderDetails[orderCode] || null;
    }

    try {
      setLoadingOrderDetails((prev) => ({ ...prev, [orderCode]: true }));

      const response = await fetch(`/api/dashboard/orders/${orderCode}`);
      const result = await response.json();

      if (result.success) {
        const orderDetail = result.data as OrderDetailResponse;
        setOrderDetails((prev) => ({ ...prev, [orderCode]: orderDetail }));
        return orderDetail;
      } else {
        console.error("주문 상세 정보 조회 실패:", result.errorMessage);
        return null;
      }
    } catch (error) {
      console.error("주문 상세 정보 조회 중 오류:", error);
      return null;
    } finally {
      setLoadingOrderDetails((prev) => ({ ...prev, [orderCode]: false }));
    }
  };

  // ✅ 위치 변경 시 localStorage 저장
  const handleLayoutChange = (newLayout: Layout[]) => {
    const updatedLayout = layout.map((item) => {
      const updated = newLayout.find((n) => n.i === item.i);
      return {
        ...item, // 기존 tableNumber, capacity, status 유지
        x: updated?.x ?? item.x,
        y: updated?.y ?? item.y,
        w: updated?.w ?? item.w,
        h: updated?.h ?? item.h,
      };
    });

    setLayout(updatedLayout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayout));
    console.log("💾 위치 변경 저장됨:", updatedLayout);
  };

  // 테이블 클릭 핸들러 (모달 열기)
  const handleTableClick = async (tableId: string) => {
    if (editMode) {
      setSelectedTable(tableId);
    } else {
      const table = layout.find((t) => t.i === tableId);
      if (table) {
        setSelectedTable(tableId);
        setShowDetailModal(true);

        // 해당 테이블의 모든 주문에 대해 상세 정보 미리 로드
        if (table.orders && table.orders.length > 0) {
          table.orders.forEach((order) => {
            fetchOrderDetail(order.orderCode);
          });
        }
      }
    }
  };

  // 모달 닫기 핸들러
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTable(null);
  };

  const handleAddTable = async () => {
    const newTableNumber = parseInt(
      (document.getElementById("newTableNumber") as HTMLInputElement).value
    );
    const newCapacity = parseInt(
      (document.getElementById("newCapacity") as HTMLSelectElement).value
    );
    const newStatus = (
      document.getElementById("newStatus") as HTMLSelectElement
    ).value as "READY" | "IN_PROGRESS";
    const newLocationX = parseInt(
      (document.getElementById("newLocationX") as HTMLInputElement).value
    );
    const newLocationY = parseInt(
      (document.getElementById("newLocationY") as HTMLInputElement).value
    );
    const newLocationW = parseInt(
      (document.getElementById("newLocationW") as HTMLInputElement).value
    );
    const newLocationH = parseInt(
      (document.getElementById("newLocationH") as HTMLInputElement).value
    );

    // DiningTableRequest 준비
    const diningTableRequest = {
      tableNumber: newTableNumber,
      capacity: newCapacity,
      status: newStatus,
      locationX: newLocationX,
      locationY: newLocationY,
      locationW: newLocationW,
      locationH: newLocationH,
    };

    console.log("🆕 DiningTableRequest 준비됨:", diningTableRequest);

    try {
      // 🚀 Next API Route로 POST 요청 (백엔드 연동은 route.ts 에서 처리)
      const res = await fetch("/api/dashboard/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diningTableRequest),
      });

      const result = await res.json();

      if (result.success) {
        console.log("✅ 테이블 추가 성공:", result.data);

        // 백엔드에서 받은 diningTableId 와 함께 local Layout 업데이트
        const newItem: TableLayout = {
          i: result.data.diningTableId.toString(),
          x: Math.floor(newLocationX / 50),
          y: Math.floor(newLocationY / 50),
          w: Math.floor(newLocationW / 50),
          h: Math.floor(newLocationH / 50),
          tableNumber: newTableNumber,
          capacity: newCapacity,
          status: newStatus,
        };

        const updatedLayout = [...layout, newItem];
        setLayout(updatedLayout);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayout));

        console.log("🆕 테이블 추가됨 (로컬 Layout 반영):", newItem);
        setShowAddModal(false); // 모달 닫기
      } else {
        console.error("❌ 테이블 추가 실패:", result.errorMessage || result);
        alert(`테이블 추가 실패: ${result.errorMessage || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("❌ 요청 중 오류 발생:", error);
      alert(`요청 중 오류 발생: ${error}`);
    }
  };

  const handleUpdateTable = async () => {
    if (!selectedTableData) {
      alert("수정할 테이블을 선택하세요.");
      return;
    }

    // 예시: 수정 가능한 항목 (지금은 tableNumber, capacity만 백엔드에서 받음)
    const newTableNumber = selectedTableData.tableNumber; // 나중에 form에서 직접 수정 가능
    const newCapacity = selectedTableData.capacity; // 나중에 form에서 직접 수정 가능

    const updatePayload = {
      tableNumber: newTableNumber,
      capacity: newCapacity,
    };

    console.log("📝 테이블 수정 요청 준비:", updatePayload);

    try {
      const res = await fetch(`/api/dashboard/tables/${selectedTableData.i}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const result = await res.json();

      if (result.success) {
        console.log("✅ 테이블 수정 성공:", result.data);
        alert("테이블 수정 성공!");

        // 💡 원하면 여기서 layout 갱신 가능 (예: 최신 상태 반영용 GET 재호출 등)
      } else {
        console.error("❌ 테이블 수정 실패:", result.errorMessage || result);
        alert(`테이블 수정 실패: ${result.errorMessage || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("❌ 요청 중 오류 발생:", error);
      alert(`요청 중 오류 발생: ${error}`);
    }
  };

  const getTableStatusClass = (item: TableLayout) => {
    const actualStatus = getTableStatus(item);
    switch (actualStatus) {
      case "READY":
        return "bg-green-50 border-green-300 text-green-800";
      case "IN_PROGRESS":
        return "bg-red-50 border-red-300 text-red-800";
      default:
        return "bg-gray-50 border-gray-300 text-gray-800";
    }
  };

  const selectedTableData = layout.find((t) => t.i === selectedTable); //

  return (
    <div className="flex flex-row items-start gap-4 p-6">
      {/* 왼쪽 */}
      <div
        className={`flex flex-col gap-4 ${
          editMode ? "w-[calc(100%-320px)]" : "w-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-800">
              테이블 레이아웃 관리
            </h1>
            <p className="text-sm text-gray-500">
              매장 테이블 배치를 관리하고 테이블 상태를 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="md"
              variant="outline"
              rightIcon={<Settings className="h-4 w-4" />}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "편집 완료" : "테이블 편집"}
            </Button>
            <Button
              size="md"
              variant="primary"
              rightIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowAddModal(true)}
            >
              테이블 추가
            </Button>
          </div>
        </div>

        {/* ✅ 상태 표시 영역 */}
        <div className="flex flex-wrap gap-3">
          {[
            {
              status: "READY",
              label: "자리 비어있음",
              color: "bg-green-100",
              count: layout.filter((t) => getTableStatus(t) === "READY").length,
            },
            {
              status: "IN_PROGRESS",
              label: "식사 중",
              color: "bg-red-100",
              count: layout.filter((t) => getTableStatus(t) === "IN_PROGRESS")
                .length,
            },
          ].map((item) => {
            return (
              <div
                key={item.status}
                className="flex items-center gap-2 px-3 py-2 shadow-sm rounded border bg-white"
              >
                <div
                  className={`w-4 h-4 rounded-full ${item.color} border-2 border-white`}
                />
                <span className="text-sm text-slate-700">{item.label}</span>
                <span className="text-sm font-bold text-slate-900">
                  ({item.count})
                </span>
              </div>
            );
          })}
          {/* WebSocket 연결 상태 표시 */}
          <div className="flex items-center gap-2 px-3 py-2 shadow-sm rounded border bg-white">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className="text-xs text-slate-600">
              {isConnected ? "실시간 연결됨" : "연결 끊어짐"}
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div
          className="bg-white border border-dashed rounded p-4 overflow-auto"
          style={{ height: 800 }}
        >
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={60}
            width={editMode ? 960 : 1200}
            isDraggable={editMode}
            isResizable={editMode}
            onLayoutChange={handleLayoutChange}
            compactType={null}
            preventCollision={true}
          >
            {layout.map((item) => {
              const actualStatus = getTableStatus(item);
              const totalAmount = getTotalAmount(item.orders || []);

              return (
                <div
                  key={item.i}
                  onClick={() => handleTableClick(item.i)}
                  className={`cursor-pointer border rounded-md shadow-sm relative px-2 py-1 text-sm font-medium ${getTableStatusClass(
                    item
                  )}`}
                >
                  {/* 테이블 번호와 수용인원 */}
                  <div className="absolute top-1 left-1 flex items-center gap-1 text-xs font-bold">
                    {item.tableNumber}번
                    <Users className="w-3 h-3" />
                    {item.capacity}인
                  </div>

                  {/* 상태에 따른 정보 표시 */}
                  {actualStatus === "IN_PROGRESS" &&
                  item.orders &&
                  item.orders.length > 0 ? (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="bg-white bg-opacity-90 rounded px-1 py-0.5 text-xs">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Clock className="w-3 h-3 text-orange-600" />
                          <span className="font-medium text-orange-800">
                            {item.orders.length}개 주문
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">식사 중</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="font-bold text-green-800">
                              {totalAmount.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-1 left-1 right-1 text-center">
                      <span className="text-xs font-medium text-green-700">
                        자리 비어있음
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </GridLayout>
        </div>
      </div>

      {/* Sidebar */}
      {editMode && selectedTable && (
        <div className="w-80 min-w-[320px] border rounded p-4 shadow bg-white flex flex-col justify-start gap-4 h-fit mt-28">
          <h2 className="text-lg font-bold">
            테이블{" "}
            {selectedTableData ? selectedTableData.tableNumber : selectedTable}{" "}
            정보
          </h2>

          {/* 현재 상태 표시 */}
          {selectedTableData && (
            <div className="p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  현재 상태
                </span>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getTableStatus(selectedTableData) === "READY"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {getTableStatus(selectedTableData) === "READY"
                    ? "자리 비어있음"
                    : "식사 중"}
                </div>
              </div>

              {/* 주문 정보 */}
              {selectedTableData.orders &&
                selectedTableData.orders.length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      주문 정보
                    </div>
                    <div className="space-y-2">
                      {selectedTableData.orders.map((order, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 bg-white rounded border"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-800">
                              주문번호: {order.orderCode}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">결제금액:</span>
                            <span className="font-bold text-green-600">
                              {order.totalAmount.toLocaleString()}원
                            </span>
                          </div>
                          {order.paymentTransactionId && (
                            <div className="flex justify-between mt-1">
                              <span className="text-gray-600">거래ID:</span>
                              <span className="text-xs text-gray-500">
                                {order.paymentTransactionId.slice(0, 8)}...
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="text-xs pt-2 border-t flex justify-between">
                        <span className="font-medium">총 주문:</span>
                        <span className="font-bold text-blue-600">
                          {selectedTableData.orders.length}건
                        </span>
                      </div>
                      <div className="text-xs flex justify-between">
                        <span className="font-medium">총 금액:</span>
                        <span className="font-bold text-green-600">
                          {getTotalAmount(
                            selectedTableData.orders
                          ).toLocaleString()}
                          원
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">수용 인원</label>
            <select className="border rounded px-2 py-1">
              <option>2인</option>
              <option>4인</option>
              <option>6인</option>
              <option>8인</option>
            </select>

            <label className="text-sm font-medium">테이블 모양</label>
            <select className="border rounded px-2 py-1">
              <option>사각형</option>
              <option>원형</option>
              <option>긴 테이블</option>
            </select>
          </div>

          <Button
            variant="error"
            className="mt-6 w-full flex items-center justify-center space-x-2"
            onClick={handleUpdateTable}
          >
            <span>테이블 수정</span>
          </Button>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">테이블 추가</h2>

            <div className="flex flex-col gap-3">
              {/* 테이블 번호 */}
              <label className="text-sm font-medium">테이블 번호</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                id="newTableNumber"
              />

              {/* 좌석 수 */}
              <label className="text-sm font-medium">수용 인원</label>
              <select className="border rounded px-2 py-1" id="newCapacity">
                <option value={2}>2인</option>
                <option value={4}>4인</option>
                <option value={6}>6인</option>
                <option value={8}>8인</option>
              </select>

              {/* 상태 */}
              <label className="text-sm font-medium">테이블 상태</label>
              <select className="border rounded px-2 py-1" id="newStatus">
                <option value="READY">READY</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
              </select>

              {/* 위치 X */}
              <label className="text-sm font-medium">위치 X 좌표</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                id="newLocationX"
              />

              {/* 위치 Y */}
              <label className="text-sm font-medium">위치 Y 좌표</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                id="newLocationY"
              />

              {/* 너비 */}
              <label className="text-sm font-medium">너비 (width)</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                id="newLocationW"
              />

              {/* 높이 */}
              <label className="text-sm font-medium">높이 (height)</label>
              <input
                type="number"
                className="border rounded px-2 py-1"
                id="newLocationH"
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={handleAddTable}>
                추가하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 테이블 상세 정보 모달 */}
      {showDetailModal && selectedTableData && (
        <Modal
          isOpen={showDetailModal}
          onClose={closeDetailModal}
          title={`테이블 ${selectedTableData.tableNumber}번 상세 정보`}
        >
          <div className="space-y-4">
            {/* 테이블 기본 정보 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                테이블 정보
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">테이블 번호:</span>
                  <span className="ml-2 font-medium">
                    {selectedTableData.tableNumber}번
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">수용 인원:</span>
                  <span className="ml-2 font-medium">
                    {selectedTableData.capacity}인
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">현재 상태:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      getTableStatus(selectedTableData) === "READY"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getTableStatus(selectedTableData) === "READY"
                      ? "자리 비어있음"
                      : "식사 중"}
                  </span>
                </div>
              </div>
            </div>

            {/* 주문 정보 */}
            {selectedTableData.orders && selectedTableData.orders.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  주문 내역 ({selectedTableData.orders.length}건)
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedTableData.orders.map((order, index) => {
                    const orderDetail = orderDetails[order.orderCode];
                    const isLoadingDetail =
                      loadingOrderDetails[order.orderCode];

                    return (
                      <div
                        key={index}
                        className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-gray-800">
                              주문번호: {order.orderCode}
                            </div>
                            {order.paymentTransactionId && (
                              <div className="text-xs text-gray-500">
                                거래ID: {order.paymentTransactionId}
                              </div>
                            )}
                            {orderDetail && (
                              <div className="text-xs text-gray-500 mt-1">
                                주문시간:{" "}
                                {new Date(orderDetail.createdAt).toLocaleString(
                                  "ko-KR"
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              {order.totalAmount.toLocaleString()}원
                            </div>
                            {orderDetail && (
                              <div className="text-xs text-gray-500">
                                {orderDetail.paymentMethod} |{" "}
                                {orderDetail.orderStatus}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 주문 메뉴 상세 정보 */}
                        {isLoadingDetail && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-sm text-gray-500 text-center">
                              메뉴 정보 로딩 중...
                            </div>
                          </div>
                        )}

                        {orderDetail &&
                          orderDetail.menus &&
                          orderDetail.menus.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                주문 메뉴 ({orderDetail.menus.length}개):
                              </div>
                              <div className="space-y-2">
                                {orderDetail.menus.map((menu, menuIndex) => (
                                  <div
                                    key={menuIndex}
                                    className="bg-white p-2 rounded border"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-800">
                                          {menu.menuName}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          수량: {menu.quantity}개 | 단가:{" "}
                                          {menu.unitPrice.toLocaleString()}원
                                        </div>
                                        {menu.options &&
                                          menu.options.length > 0 && (
                                            <div className="mt-1">
                                              <div className="text-xs text-gray-500 mb-1">
                                                선택 옵션:
                                              </div>
                                              <div className="space-y-1">
                                                {menu.options.map(
                                                  (option, optionIndex) => (
                                                    <div
                                                      key={optionIndex}
                                                      className="text-xs text-gray-600 ml-2 flex justify-between"
                                                    >
                                                      <span>
                                                        • {option.optionName}
                                                      </span>
                                                      <span>
                                                        +
                                                        {option.optionPrice.toLocaleString()}
                                                        원
                                                      </span>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                      <div className="text-right ml-2">
                                        <div className="font-bold text-blue-600">
                                          {menu.totalPrice.toLocaleString()}원
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {menu.status}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>

                {/* 주문 요약 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-700">총 주문 금액:</span>
                    <span className="text-green-600">
                      {getTotalAmount(
                        selectedTableData.orders
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="text-gray-500 text-lg mb-2">
                  현재 주문이 없습니다
                </div>
                <div className="text-gray-400 text-sm">
                  이 테이블은 현재 비어있는 상태입니다.
                </div>
              </div>
            )}

            {/* 모달 하단 버튼 */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeDetailModal}>
                닫기
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
