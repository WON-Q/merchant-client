"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Button } from "@/components/ui/button";
import { Plus, Settings, Users, Trash, Loader, CheckCircle, Clock } from "lucide-react";
interface TableLayout extends Layout {
  tableNumber: number;
  capacity: number;
  status: string;
}
const STORAGE_KEY = "table-layout";

// ✅ API로 테이블 가져오기 + 변환
const fetchTablesFromAPI = async (): Promise<TableLayout[]> => {
  try {
    const response = await fetch("/api/dashboard/tables"); // API route
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      const mappedLayout: TableLayout[] = result.data.map((table: any) => ({
        i: table.diningTableId.toString(), // Unique key
        x: Math.floor(table.locationX / 50), // Adjust X position
        y: Math.floor(table.locationY / 50), // Adjust Y position
        w: Math.floor(table.locationW / 50),  // ✅ 위치 가로
        h: Math.floor(table.locationH / 50) ,
         tableNumber: table.tableNumber,      // 추가 저장
        capacity: table.capacity,
        status: table.status
      }));

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
  const [layout, setLayout] = useState<TableLayout[]>([]); // ✅ useState 수정
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

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

  // ✅ 위치 변경 시 localStorage 저장
 const handleLayoutChange = (newLayout: Layout[]) => {
  const updatedLayout = layout.map((item) => {
    const updated = newLayout.find((n) => n.i === item.i);
    return {
      ...item, // 기존 tableNumber, capacity, status 유지
      x: updated?.x ?? item.x,
      y: updated?.y ?? item.y,
      w: updated?.w ?? item.w,
      h: updated?.h ?? item.h
    };
  });

  setLayout(updatedLayout);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayout));
  console.log("💾 위치 변경 저장됨:", updatedLayout);
};

const handleAddTable = async () => {
  const newTableNumber = parseInt((document.getElementById("newTableNumber") as HTMLInputElement).value);
  const newCapacity = parseInt((document.getElementById("newCapacity") as HTMLSelectElement).value);
  const newStatus = (document.getElementById("newStatus") as HTMLSelectElement).value as "READY" | "IN_PROGRESS";
  const newLocationX = parseInt((document.getElementById("newLocationX") as HTMLInputElement).value);
  const newLocationY = parseInt((document.getElementById("newLocationY") as HTMLInputElement).value);
  const newLocationW = parseInt((document.getElementById("newLocationW") as HTMLInputElement).value);
  const newLocationH = parseInt((document.getElementById("newLocationH") as HTMLInputElement).value);

  // DiningTableRequest 준비
  const diningTableRequest = {
    tableNumber: newTableNumber,
    capacity: newCapacity,
    status: newStatus,
    locationX: newLocationX,
    locationY: newLocationY,
    locationW: newLocationW,
    locationH: newLocationH
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
  const newCapacity = selectedTableData.capacity;       // 나중에 form에서 직접 수정 가능

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

 


  const getTableStatusClass = (id: string) => {
    const statusIndex = parseInt(id) % 4;
    switch (statusIndex) {
      case 0:
        return "bg-green-50 border-green-300 text-green-800";
      case 1:
        return "bg-red-50 border-red-300 text-red-800";
      case 2:
        return "bg-yellow-50 border-yellow-300 text-yellow-800";
      case 3:
        return "bg-blue-50 border-blue-300 text-blue-800";
      default:
        return "bg-white border-gray-300";
    }
  };

  const selectedTableData = layout.find((t) => t.i === selectedTable); // 

  return (
    <div className="flex flex-row items-start gap-4 p-6"> 
      {/* 왼쪽 */}
      <div className={`flex flex-col gap-4 ${editMode ? "w-[calc(100%-320px)]" : "w-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-800">테이블 레이아웃 관리</h1>
            <p className="text-sm text-gray-500">매장 테이블 배치를 관리하고 테이블 상태를 확인할 수 있습니다.</p>
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
              onClick={() =>setShowAddModal(true)}
      
            >
              테이블 추가
            </Button>
          </div>
        </div>

       {/* ✅ 상태 표시 영역 */}
<div className="flex flex-wrap gap-3">
  {[
    { status: "available", label: "사용 가능", color: "bg-emerald-100", icon: CheckCircle },
    { status: "occupied", label: "사용 중", color: "bg-rose-100", icon: Users },
    { status: "reserved", label: "예약됨", color: "bg-amber-100", icon: Clock },
    { status: "cleaning", label: "청소 중", color: "bg-blue-100", icon: Loader },
  ].map((item) => {
    const IconComponent = item.icon;
    return (
      <div key={item.status} className="flex items-center gap-2 px-2 py-1 shadow-sm rounded border">
        <div className={`w-4 h-4 rounded-full ${item.color} border-2 border-white`} />
        <IconComponent className="w-4 h-4 text-slate-600" />
        <span className="text-sm text-slate-700">{item.label}</span>
      </div>
    );
  })}
</div>


        {/* Grid Layout */}
        <div className="bg-white border border-dashed rounded p-4 overflow-auto" style={{ height: 800 }}>
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
          {layout.map((item) => (
            <div
              key={item.i}
              onClick={() => editMode && setSelectedTable(item.i)}
              className={`cursor-pointer border rounded-md shadow-sm relative px-2 py-1 text-sm font-medium ${getTableStatusClass(item.i)}`}
            >
              {/* 오른쪽 하단, 한 줄 */}
              <div className="absolute bottom-1 right-1 flex items-center gap-1 text-sm font-semibold">
                {item.tableNumber}번 테이블
                <Users className="w-4 h-4" />
                {item.capacity}인
              </div>
            </div>
          ))}

          </GridLayout>
        </div>
      </div>

      {/* Sidebar */}
  {editMode && selectedTable && (
  <div className="w-80 min-w-[320px] border rounded p-4 shadow bg-white flex flex-col justify-start gap-4h-fit mt-28"> 
    <h2 className="text-lg font-bold">
      테이블 {selectedTableData ? selectedTableData.tableNumber : selectedTable} 정보
    </h2>
    
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">테이블 상태</label>
      <select className="border rounded px-2 py-1">
        <option>사용 가능</option>
        <option>사용 중</option>
        <option>예약됨</option>
        <option>청소 중</option>
      </select>

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
        <input type="number" className="border rounded px-2 py-1" id="newTableNumber" />

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
        <input type="number" className="border rounded px-2 py-1" id="newLocationX" />

        {/* 위치 Y */}
        <label className="text-sm font-medium">위치 Y 좌표</label>
        <input type="number" className="border rounded px-2 py-1" id="newLocationY" />

        {/* 너비 */}
        <label className="text-sm font-medium">너비 (width)</label>
        <input type="number" className="border rounded px-2 py-1" id="newLocationW" />

        {/* 높이 */}
        <label className="text-sm font-medium">높이 (height)</label>
        <input type="number" className="border rounded px-2 py-1" id="newLocationH" />
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


    </div>
  );
}