import { NextRequest, NextResponse } from "next/server";

interface DiningTable {
  diningTableId: number;
  tableNumber: number;
  capacity: number;
  status: string;
  locationX: number;
  locationY: number;
  locationW: number;
  locationH: number;
  orders: any[];
}

interface QrCode {
  id: number;
  targetUrl: string;
  imageUrl: string;
  createdAt: string;
  diningTableId: number;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const authToken = req.cookies.get("auth-token")?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, errorMessage: "인증 토큰 없음" }, { status: 401 });
    }

    // 1. 테이블 목록 호출
    const tableRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/tables`, {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: "no-store",
    });
    const tableJson = await tableRes.json();
    const tables: DiningTable[] = tableJson.data;

    // 2. QR 목록 호출
    const qrRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/qr`, {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: "no-store",
    });
    const qrJson = await qrRes.json();
    const qrs: QrCode[] = qrJson.data;

    // 3. 테이블 + QR 결합
    const result = tables.map((table) => {
      const matchedQr = qrs.find((qr) => qr.diningTableId === table.diningTableId);

      return {
        id: String(table.diningTableId),
        name: `테이블 ${table.tableNumber}`,
        capacity: table.capacity,
        status: table.status === "READY" ? "active" : "inactive",
        createdAt: "2024-01-15", // 또는 matchedQr?.createdAt 파싱 가능
        lastUsed: undefined,
        qrCode: matchedQr?.imageUrl,
        targetUrl: matchedQr?.targetUrl,
      };
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, errorMessage: `QR코드 페이지 조회 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
