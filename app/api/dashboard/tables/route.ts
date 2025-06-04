  // File: app/api/dashboard/tables/route.ts
  import { NextResponse, NextRequest } from "next/server";

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

  /**
   * GET: 기존 테이블 목록 조회
   */
  export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
      const authToken = req.cookies.get("auth-token")?.value;
      if (!authToken) {
        return NextResponse.json(
          { success: false, errorMessage: "인증 토큰 없음" },
          { status: 401 }
        );
      }

      const backendRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/tables`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          cache: "no-store",
        }
      );

      const contentType = backendRes.headers.get("content-type") || "";
      if (!backendRes.ok || !contentType.includes("application/json")) {
        const errorText = await backendRes.text();
        return NextResponse.json(
          {
            success: false,
            errorMessage: `백엔드 오류: ${backendRes.status}`,
            backendError: errorText,
          },
          { status: backendRes.status }
        );
      }

      const body = await backendRes.json();
      const tables: DiningTable[] = body.data;
      const result = tables.map((t) => ({
        diningTableId: t.diningTableId,
        tableNumber: t.tableNumber,
        capacity: t.capacity,
        status: t.status,
        locationX: t.locationX,
        locationY: t.locationY,
        locationW: t.locationW,
        locationH: t.locationH,
        orders: t.orders,
      }));

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      return NextResponse.json(
        { success: false, errorMessage: `테이블 조회 실패: ${msg}` },
        { status: 500 }
      );
    }
  }
  


  /**
   * POST: 신규 테이블 추가 (프론트엔드에서 보낸 숫자/문자 타입 보정 및 기본 위치값 설정)
   */
  export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
      const authToken = req.cookies.get("auth-token")?.value;
      if (!authToken) {
        return NextResponse.json(
          { success: false, errorMessage: "인증 토큰 없음" },
          { status: 401 }
        );
      }

      // 1) 요청 본문 파싱
      const payload = await req.json();

      // 2) 숫자 타입 보정 및 기본 위치값 할당
      const toSend = {
        tableNumber: Number(payload.tableNumber),
        capacity: Number(payload.capacity),
        status: payload.status,
        locationX: payload.locationX ?? 0,
        locationY: payload.locationY ?? 0,
        locationW: payload.locationW ?? 100,
        locationH: payload.locationH ?? 50,
      };

      // 3) 백엔드 API 호출
      const backendRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/merchant/tables`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(toSend),
        }
      );

      const contentType = backendRes.headers.get("content-type") || "";
      if (!backendRes.ok || !contentType.includes("application/json")) {
        const errorText = await backendRes.text();
        return NextResponse.json(
          { success: false, errorMessage: `추가 실패: ${backendRes.status}`, backendError: errorText },
          { status: backendRes.status }
        );
      }

      // 4) 생성된 테이블 반환
      const body = await backendRes.json();
      return NextResponse.json({ success: true, data: body.data }, { status: 201 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      return NextResponse.json(
        { success: false, errorMessage: `테이블 추가 실패: ${msg}` },
        { status: 500 }
      );
    }
  } 