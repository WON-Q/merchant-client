import React, { useState } from "react";
import { Clock, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu-item";
import { Pagination } from "@/components/ui/pagination";
import { Order, OrderMenuStatus } from "@/types/order";

interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onMenuStatusChange: (
    orderMenuId: number,
    status: OrderMenuStatus
  ) => Promise<void>;
  loading: boolean;
}

export function OrderTable({
  orders,
  currentPage,
  totalPages,
  onPageChange,
  onMenuStatusChange,
  loading,
}: OrderTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const toggleOrderExpand = (orderCode: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderCode]: !prev[orderCode],
    }));
  };

  // 주문 상태에 따른 배지 색상 및 텍스트 반환
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "ORDERED":
        return (
          <Badge variant="warning" leftIcon={<Clock className="w-3 h-3" />}>
            주문됨
          </Badge>
        );
      case "PAID":
        return (
          <Badge variant="primary" leftIcon={<Check className="w-3 h-3" />}>
            결제됨
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" leftIcon={<Check className="w-3 h-3" />}>
            완료됨
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge variant="error" leftIcon={<X className="w-3 h-3" />}>
            취소됨
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // 결제 상태에 따른 배지 색상 및 텍스트 반환
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="warning" leftIcon={<Clock className="w-3 h-3" />}>
            대기중
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" leftIcon={<Check className="w-3 h-3" />}>
            완료됨
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="error" leftIcon={<X className="w-3 h-3" />}>
            실패함
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge variant="error" leftIcon={<X className="w-3 h-3" />}>
            취소됨
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // 메뉴 상태에 따른 배지 색상 및 텍스트 반환
  const getMenuStatusBadge = (status: string) => {
    switch (status) {
      case "ORDERED":
        return (
          <Badge variant="warning" leftIcon={<Clock className="w-3 h-3" />}>
            주문됨
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge variant="primary" leftIcon={<Clock className="w-3 h-3" />}>
            처리중
          </Badge>
        );
      case "SERVED":
        return (
          <Badge variant="success" leftIcon={<Check className="w-3 h-3" />}>
            서빙됨
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge variant="error" leftIcon={<X className="w-3 h-3" />}>
            취소됨
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // 날짜 포맷팅 함수
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B35]"></div>
        </div>
      ) : (
        <>
          {/* 주문 목록 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문 코드
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    테이블
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문 상태
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 상태
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 수단
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문 시간
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 완료
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <React.Fragment key={order.orderCode}>
                      {/* 주문 정보 행 */}
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleOrderExpand(order.orderCode)}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {order.orderCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.tableNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {getOrderStatusBadge(order.orderStatus)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.paymentMethod === "CARD" && "카드"}
                          {order.paymentMethod === "CASH" && "현금"}
                          {order.paymentMethod === "ACCOUNT_TRANSFER" &&
                            "계좌이체"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.paidAt ? formatDateTime(order.paidAt) : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₩{order.totalAmount.toLocaleString()}
                        </td>
                      </tr>

                      {/* 확장된 메뉴 항목 행 */}
                      {expandedOrders[order.orderCode] && (
                        <tr>
                          <td colSpan={8} className="px-0">
                            <div className="p-4 bg-gray-50">
                              <h4 className="text-md font-medium mb-2">
                                주문 메뉴 목록
                              </h4>
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      메뉴
                                    </th>
                                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      옵션
                                    </th>
                                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      수량
                                    </th>
                                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      단가
                                    </th>
                                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      총 가격
                                    </th>
                                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      상태
                                    </th>
                                    <th className="px-4 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      상태 변경
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {order.menus.map((menu) => (
                                    <tr
                                      key={menu.orderMenuId}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                        {menu.menuName}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        {menu.options.length > 0 ? (
                                          <ul>
                                            {menu.options.map((option) => (
                                              <li
                                                key={option.orderMenuOptionId}
                                              >
                                                {option.optionName} (+₩
                                                {option.optionPrice.toLocaleString()}
                                                )
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          "-"
                                        )}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        {menu.quantity}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        ₩{menu.unitPrice.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        ₩{menu.totalPrice.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        {getMenuStatusBadge(menu.status)}
                                      </td>
                                      <td
                                        className="px-4 py-2 text-sm text-gray-500"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Dropdown
                                          value={menu.status}
                                          onChange={(value) =>
                                            onMenuStatusChange(
                                              menu.orderMenuId,
                                              value as OrderMenuStatus
                                            )
                                          }
                                          disabled={menu.status === "CANCELED"}
                                          size="sm"
                                        >
                                          <DropdownMenuItem
                                            value={OrderMenuStatus.ORDERED}
                                          >
                                            <span className="flex items-center gap-2">
                                              <Clock className="h-3.5 w-3.5" />
                                              주문됨
                                            </span>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            value={OrderMenuStatus.IN_PROGRESS}
                                          >
                                            <span className="flex items-center gap-2">
                                              <Clock className="h-3.5 w-3.5" />
                                              처리중
                                            </span>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            value={OrderMenuStatus.SERVED}
                                          >
                                            <span className="flex items-center gap-2">
                                              <Check className="h-3.5 w-3.5" />
                                              서빙됨
                                            </span>
                                          </DropdownMenuItem>
                                        </Dropdown>
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-gray-50">
                                    <td
                                      colSpan={4}
                                      className="px-4 py-2 text-right text-sm font-medium"
                                    >
                                      총 주문 금액:
                                    </td>
                                    <td
                                      colSpan={3}
                                      className="px-4 py-2 text-sm font-bold"
                                    >
                                      ₩{order.totalAmount.toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      조회된 주문 정보가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 0 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={currentPage + 1} // API는 0-based, UI는 1-based
                totalPages={totalPages}
                onPageChange={(page) => onPageChange(page - 1)} // API는 0-based, UI는 1-based
                showFirstLast
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
