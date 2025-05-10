"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { LoginHistoryResponse } from "@/app/api/dashboard/login-history/route";
import { Page } from "@/types/api";
import { Dropdown } from "@/components/ui/dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu-item";
import { formatKoreanDateTime } from "@/lib/utils";

export default function LoginHistoryPage() {
  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // 정렬 상태
  const [sortField, setSortField] = useState("loginAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // 데이터 상태
  const [loginHistory, setLoginHistory] = useState<LoginHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로그인 이력 조회 - useCallback으로 메모이제이션
  const fetchLoginHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/dashboard/login-history?page=${page}&size=${size}&sort=${sortField},${sortDirection}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errorMessage || "로그인 이력을 불러오는데 실패했습니다."
        );
      }

      const data = await response.json();

      if (data.success && data.data) {
        const pageData = data.data as Page<LoginHistoryResponse>;
        setLoginHistory(pageData.content);
        setTotalPages(pageData.totalPages);
      } else {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 이력 조회 중 오류 발생:", error);
      setError(
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      );
      setLoginHistory([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, size, sortField, sortDirection]);

  // 페이지 로드 시 및 페이지/크기/정렬 변경 시 로그인 이력 조회
  useEffect(() => {
    fetchLoginHistory();
  }, [fetchLoginHistory]); // fetchLoginHistory가 변경될 때만 실행 (내부에서 필요한 의존성은 이미 포함됨)

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // UI는 1-based, API는 0-based
  };

  // 페이지 크기 변경 핸들러
  const handleSizeChange = (newSize: string) => {
    setSize(parseInt(newSize));
    setPage(0); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  // 정렬 변경 핸들러
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      // 같은 필드를 클릭한 경우 정렬 방향만 전환
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // 새로운 필드로 정렬하는 경우 필드 변경 및 내림차순 기본 설정
      setSortField(field);
      setSortDirection("desc");
    }
    setPage(0); // 정렬 변경 시 첫 페이지로 이동
  };

  // 정렬 방향 변경 핸들러
  const handleSortDirectionChange = (direction: string) => {
    setSortDirection(direction as "asc" | "desc");
    setPage(0);
  };

  // 정렬 아이콘 표시
  const renderSortIcon = (field: string) => {
    if (field !== sortField) {
      return <ArrowUpDown className="h-3 w-3 ml-1 text-neutral-400" />;
    }

    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1 text-[#FF6B35]" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1 text-[#FF6B35]" />
    );
  };

  // 디바이스 정보 추출
  const getDeviceInfo = (userAgent: string) => {
    const isMobile =
      /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(
        userAgent.toLowerCase()
      );
    const isTablet = /tablet|ipad/i.test(userAgent.toLowerCase());

    // 브라우저 정보 추출 (간단한 구현)
    let browser = "알 수 없음";
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("MSIE") || userAgent.includes("Trident/"))
      browser = "Internet Explorer";

    // OS 정보 추출 (간단한 구현)
    let os = "알 수 없음";
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac OS")) os = "macOS";
    else if (userAgent.includes("Android")) os = "Android";
    else if (
      userAgent.includes("iOS") ||
      userAgent.includes("iPhone") ||
      userAgent.includes("iPad")
    )
      os = "iOS";
    else if (userAgent.includes("Linux")) os = "Linux";

    return {
      icon: isTablet ? (
        <Tablet className="h-4 w-4 text-blue-500" />
      ) : isMobile ? (
        <Smartphone className="h-4 w-4 text-green-500" />
      ) : (
        <Monitor className="h-4 w-4 text-purple-500" />
      ),
      deviceType: isTablet ? "태블릿" : isMobile ? "모바일" : "데스크톱",
      browser,
      os,
    };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">로그인 이력</h1>
        <p className="text-muted-foreground">
          계정의 로그인 활동 내역을 확인할 수 있습니다.
        </p>
      </div>

      {/* 로그인 이력 테이블 */}
      <div className="rounded-lg border bg-white shadow-sm">
        {/* 테이블 컨트롤 영역 - 단일 행으로 재구성 */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between p-4 border-b gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">정렬:</span>
                <Dropdown
                  value={sortDirection}
                  onChange={handleSortDirectionChange}
                  size="sm"
                  variant="outline"
                  className="w-24"
                >
                  <DropdownMenuItem value="asc">오름차순</DropdownMenuItem>
                  <DropdownMenuItem value="desc">내림차순</DropdownMenuItem>
                </Dropdown>
              </div>

              <div className="h-6 border-l border-neutral-200"></div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">표시 개수:</span>
                <Dropdown
                  value={size.toString()}
                  onChange={handleSizeChange}
                  size="sm"
                  variant="outline"
                  className="w-20"
                >
                  <DropdownMenuItem value="5">5개</DropdownMenuItem>
                  <DropdownMenuItem value="10">10개</DropdownMenuItem>
                  <DropdownMenuItem value="20">20개</DropdownMenuItem>
                  <DropdownMenuItem value="50">50개</DropdownMenuItem>
                </Dropdown>
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              총 {loginHistory.length}개의 로그인 이력이 있습니다.
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B35]"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12 text-center">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-lg font-medium text-red-500">
                  오류가 발생했습니다
                </p>
                <p className="text-neutral-600 mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSortChange("userAgent")}
                    >
                      디바이스 {renderSortIcon("userAgent")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSortChange("loginAt")}
                    >
                      로그인 시간 {renderSortIcon("loginAt")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSortChange("ipAddress")}
                    >
                      IP 주소 {renderSortIcon("ipAddress")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    브라우저/OS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {loginHistory.length > 0 ? (
                  loginHistory.map((entry, index) => {
                    const deviceInfo = getDeviceInfo(entry.userAgent);

                    return (
                      <tr
                        key={`${entry.loginAt}-${index}`}
                        className="hover:bg-neutral-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {deviceInfo.icon}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">
                                {deviceInfo.deviceType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {formatKoreanDateTime(entry.loginAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {entry.ipAddress}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {deviceInfo.browser}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {deviceInfo.os}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-neutral-500">
                        로그인 이력이 없습니다.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 - 테두리 없이 표시 */}
        {!loading && !error && totalPages > 0 && (
          <div className="flex items-center justify-center p-4">
            <Pagination
              currentPage={page + 1} // UI는 1-based, API는 0-based
              totalPages={totalPages}
              onPageChange={handlePageChange}
              size="md"
              variant="primary"
              showFirstLast
              bordered={false} // 테두리 제거
            />
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-800 text-sm">
        <p className="font-medium mb-1">보안 팁</p>
        <p>
          로그인 이력을 정기적으로 확인하여 의심스러운 활동이 있는지
          모니터링하세요. 낯선 위치나 기기에서의 접속이 발견되면 즉시 비밀번호를
          변경하는 것이 좋습니다.
        </p>
      </div>
    </div>
  );
}
