import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Tailwind class 병합 유틸

// ----------------------------
// ✅ Dialog: 외부 className 적용 가능하게 수정
interface DialogProps {
  open: boolean;
  onOpenChange: () => void;
  children: ReactNode;
  className?: string; // ✅ 선택적 className
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onOpenChange}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn("bg-white rounded-lg shadow p-6 w-full max-w-md", className)}
      >
        {children}
      </div>
    </div>
  );
}

// ----------------------------
// ✅ DialogContent: 확장된 클래스 적용
interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

// ----------------------------
export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}
