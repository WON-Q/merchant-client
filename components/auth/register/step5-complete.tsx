import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import StepContainer from "./step-container";
import { Button } from "@/components/ui/Button";
import { RegisterFormData } from "@/types/register";

interface Step5Props {
  formData: RegisterFormData;
}

export default function Step5Complete({ formData }: Step5Props) {
  return (
    <StepContainer>
      <div className="text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3">회원가입이 완료되었습니다!</h3>
        <p className="text-gray-600 mb-8">
          로그인 후 서비스를 이용하실 수 있습니다.
        </p>

        <div className="flex justify-center mt-10">
          <Link href="/login">
            <Button variant="primary" size="lg">
              로그인 페이지로 이동
            </Button>
          </Link>
        </div>
      </div>
    </StepContainer>
  );
}
