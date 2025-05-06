import { Button } from "@/components/ui/Button";

export const HelpSection = () => {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white">?</span>
        </div>
        <div>
          <div className="text-sm font-medium">도움이 필요하신가요?</div>
          <div className="text-xs text-neutral-500">고객센터에 문의하세요</div>
        </div>
      </div>
      <Button className="mt-4 w-full" variant="outline" size="sm">
        고객센터
      </Button>
    </div>
  );
};
