import { ArrowLeft, ArrowRight } from "lucide-react";
import StepContainer from "./step-container";
import { Button } from "@/components/ui/Button";
import { RegisterFormData, Step1Data } from "@/types/register";

interface Step1Props {
  onNext: (data: Step1Data) => void;
  onPrev: () => void;
  defaultValues?: Partial<RegisterFormData>;
}

export default function Step1Terms({ onNext, onPrev }: Step1Props) {
  const handleSubmit = () => {
    onNext({} as Step1Data);
  };

  return (
    <StepContainer>
      <div className="text-center py-8">
        <p className="text-gray-600 mb-8">
          이 페이지에는 서비스 이용을 위한 약관 동의 폼이 표시됩니다. (현재는
          플레이스홀더로, 실제 구현 필요)
        </p>
        <div className="flex justify-between mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={onPrev}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            이전
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            다음 단계로
          </Button>
        </div>
      </div>
    </StepContainer>
  );
}
