
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: { params: { diningTableId: string } }): Promise<NextResponse> {
  try {
    const diningTableId = context.params.diningTableId;
    const authToken = req.cookies.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, errorMessage: "인증 토큰 없음" },
        { status: 401 }
      );
    }

    const payload = await req.json();

    console.log("🔄 테이블 수정 요청:", {
      diningTableId,
      payload,
    });

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/tables/${diningTableId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const contentType = backendRes.headers.get("content-type") || "";
    if (!backendRes.ok || !contentType.includes("application/json")) {
      const errorText = await backendRes.text();
      return NextResponse.json(
        { success: false, errorMessage: `수정 실패: ${backendRes.status}`, backendError: errorText },
        { status: backendRes.status }
      );
    }

    const body = await backendRes.json();
    return NextResponse.json({ success: true, data: body.data }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, errorMessage: `테이블 수정 실패: ${msg}` },
      { status: 500 }
    );
  }
}
