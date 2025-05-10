import {
  ClipboardList,
  Home,
  LayoutGrid,
  QrCode,
  Settings,
  ShoppingBag,
  History,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DashboardRoute = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export const DASHBOARD_ROUTES: DashboardRoute[] = [
  {
    name: "대시보드",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "주문 관리",
    path: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    name: "테이블 관리",
    path: "/dashboard/tables",
    icon: LayoutGrid,
  },
  {
    name: "QR코드 관리",
    path: "/dashboard/qrcodes",
    icon: QrCode,
  },
  {
    name: "메뉴 관리",
    path: "/dashboard/menu",
    icon: ShoppingBag,
  },
  {
    name: "로그인 이력",
    path: "/dashboard/login-history",
    icon: History,
  },
  {
    name: "설정",
    path: "/dashboard/settings",
    icon: Settings,
  },
];
