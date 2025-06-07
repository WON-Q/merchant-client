import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // X 아이콘 사용
import { useState } from "react";
interface QrGenerateModalProps {
  open: boolean;
  onClose: () => void;
  defaultTableNumber: number;
  onSuccess?: () => void;
}
export default function QrGenerateModal({
  open,
  onClose,
  defaultTableNumber,
  onSuccess,
}: QrGenerateModalProps) {
  const [targetUrl, setTargetUrl] = useState("");
  const [tableNumber, setTableNumber] = useState(defaultTableNumber);

  const handleSubmit = async () => {
    const res = await fetch("/api/dashboard/qrcodes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl, tableNumber }),
    });

    if (res.ok) {
      onClose();
      onSuccess?.();
    } else {
      alert("QR 생성 실패");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="relative">
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader>
          <DialogTitle>QR 코드 생성</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium">테이블 번호</label>
            <Input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(Number(e.target.value))}
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium">Target URL</label>
            <Input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="www.wonq_store/merchantId/tableId/menus?firstVisit=true"
            />
          </div>
          <Button className="w-full mt-4" onClick={handleSubmit}>
            QR 생성
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
