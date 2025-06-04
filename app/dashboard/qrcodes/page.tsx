"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QrGenerateModal from "@/components/dashboard/qrcodes/QrGenerateModal";
import Image from "next/image";

interface Table {
  id: string;
  name: string;
  capacity: number;
  qrCode?: string;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed?: string;
  targetUrl?: string;
}

export default function QRCodesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [generateModalTable, setGenerateModalTable] = useState<{ tableNumber: number } | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/dashboard/qrcodes", { cache: "no-store" });
    const json = await res.json();
    if (json.success) setTables(json.data);
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-8 p-6 md:p-10 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">QR코드 관리</h2>
            <p className="text-neutral-500 mt-1">테이블별 QR코드를 조회하고 관리할 수 있습니다.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-8 pb-4">
            <h3 className="text-2xl font-bold">QR 목록</h3>
            <p className="text-neutral-500 text-base mt-2">발급된 테이블 QR코드를 확인할 수 있습니다.</p>
          </div>

          <div className="px-8 pb-8">
            <div className="grid grid-cols-4 gap-[20px]">
              {tables.map((table) => (
                <Card key={table.id} className="w-full h-auto p-3 flex flex-col items-center justify-between border rounded-xl">
                  <div className="w-full">
                    <h2 className="text-base font-semibold">{table.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-[#d2f0e2] text-[#3c3c3c] px-2 py-0.5 text-xs">
                        {table.status === "active" ? "활성" : "비활성"}
                      </Badge>
                      <span className="text-xs text-gray-600">{table.capacity}명</span>
                    </div>
                  </div>

                  <div className="w-40 h-40 mt-2 flex items-center justify-center border rounded-lg relative overflow-hidden">
                    {table.qrCode ? (
                      <Image
                        src={table.qrCode}
                        alt="QR 코드"
                        width={160}
                        height={160}
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-xs text-gray-400 border-dashed border-2">
                        <span className="text-xl">📷</span>
                        QR코드 없음
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 w-full text-left mt-2">
                    <p>생성일: {table.createdAt}</p>
                    {table.lastUsed && <p>마지막 사용: {table.lastUsed}</p>}
                  </div>

                  <div className="flex gap-1 w-full mt-2 justify-between">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs px-3 flex-1"
                      onClick={() =>
                        setGenerateModalTable({ tableNumber: Number(table.name.replace("테이블 ", "")) })
                      }
                    >
                      {table.qrCode ? "QR 수정" : "QR 생성"}
                    </Button>

                    {table.qrCode ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-8 text-xs px-3 flex-1"
                        onClick={() => handleDownload(table.qrCode!, `table-${table.id}-qr.png`)}
                      >
                        다운로드
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-8 text-xs px-3 flex-1"
                        disabled
                      >
                        다운로드
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Generate Modal */}
      {generateModalTable && (
        <QrGenerateModal
          open={!!generateModalTable}
          onClose={() => setGenerateModalTable(null)}
          defaultTableNumber={generateModalTable?.tableNumber ?? 0}
          onSuccess={() => {
            setGenerateModalTable(null);
            fetchData(); // Refresh data after success
          }}
        />
      )}
    </div>
  );
}
