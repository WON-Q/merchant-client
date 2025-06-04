// app/api/dashboard/qrcodes/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

interface QrGenerateRequest {
  targetUrl: string;
  tableNumber: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const authToken = req.cookies.get("auth-token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, errorMessage: "인증 토큰 없음" },
        { status: 401 }
      );
    }

    const body: QrGenerateRequest = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { success: false, errorMessage: error?.message || "QR 생성 실패" },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, errorMessage: `QR 생성 중 오류 발생: ${errorMessage}` },
      { status: 500 }
    );
  }
}
