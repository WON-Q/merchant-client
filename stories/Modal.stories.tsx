import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { AlertCircle, Check, Info } from "lucide-react";

const meta = {
  title: "UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "모달은 메인 콘텐츠 위에 떠있는 대화상자로, 중요한 정보를 표시하거나 사용자 입력을 받는 데 사용됩니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "모달이 열려있는지 여부",
      defaultValue: false,
    },
    onClose: {
      action: "closed",
      description: "모달이 닫힐 때 호출되는 함수",
    },
    title: {
      control: "text",
      description: "모달의 제목",
    },
    description: {
      control: "text",
      description: "모달의 설명 텍스트",
    },
    children: {
      control: "text",
      description: "모달 내부에 표시될 콘텐츠",
    },
    footer: {
      description: "모달 하단에 표시될 푸터 콘텐츠",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "full"],
      description: "모달의 크기",
      defaultValue: "md",
    },
    showCloseButton: {
      control: "boolean",
      description: "닫기 버튼 표시 여부",
      defaultValue: true,
    },
    closeOnOverlayClick: {
      control: "boolean",
      description: "오버레이 클릭 시 모달이 닫히는지 여부",
      defaultValue: true,
    },
    closeOnEsc: {
      control: "boolean",
      description: "ESC 키 누를 시 모달이 닫히는지 여부",
      defaultValue: true,
    },
    scrollable: {
      control: "boolean",
      description: "모달 내용이 길 때 스크롤 가능 여부",
      defaultValue: true,
    },
    blur: {
      control: "boolean",
      description: "배경 블러 효과 적용 여부",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 모달에는 상태가 필요하므로 래퍼 컴포넌트를 사용합니다
const ModalWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="알림"
        description="모달 창의 기본 예시입니다."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsOpen(false)}>확인</Button>
          </>
        }
      >
        <p>
          모달 컴포넌트는 중요한 정보를 표시하거나 사용자로부터 입력을 받을 때
          유용합니다. 배경을 어둡게 처리하여 현재 작업에 집중할 수 있도록
          도와줍니다.
        </p>
      </Modal>
    </div>
  );
};

export const BasicExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "기본적인 모달 사용 예시입니다. 모달은 제목, 설명, 본문, 그리고 푸터로 구성됩니다.",
      },
    },
  },
  render: () => <ModalWrapper />,
};

const SizesExample = () => {
  const [size, setSize] = useState<
    "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  >("md");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            setSize("xs");
            setIsOpen(true);
          }}
        >
          XS
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSize("sm");
            setIsOpen(true);
          }}
        >
          SM
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSize("md");
            setIsOpen(true);
          }}
        >
          MD
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSize("lg");
            setIsOpen(true);
          }}
        >
          LG
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSize("xl");
            setIsOpen(true);
          }}
        >
          XL
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSize("2xl");
            setIsOpen(true);
          }}
        >
          2XL
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSize("full");
            setIsOpen(true);
          }}
        >
          Full
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${size.toUpperCase()} 크기 모달`}
        size={size}
        footer={<Button onClick={() => setIsOpen(false)}>닫기</Button>}
      >
        <p>
          이 모달의 크기는 <strong>{size}</strong> 입니다.
        </p>
        <p className="mt-2">
          다양한 크기의 모달을 제공하여 표시할 내용의 양에 맞게 최적화할 수
          있습니다.
        </p>
      </Modal>
    </div>
  );
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "모달은 다양한 크기를 지원합니다. 표시할 내용의 양에 맞게 크기를 선택하세요.",
      },
    },
  },
  render: () => <SizesExample />,
};

const AlertModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      // 결과 초기화를 위한 타임아웃
      setTimeout(() => setIsSuccess(false), 500);
    }, 1500);
  };

  return (
    <div>
      <Button variant="error" onClick={() => setIsOpen(true)}>
        항목 삭제
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => !isSuccess && setIsOpen(false)} // 성공 상태일 때는 닫기 방지
        title="정말 삭제하시겠습니까?"
        showCloseButton={!isSuccess}
        closeOnOverlayClick={!isSuccess}
        closeOnEsc={!isSuccess}
        size="sm"
        footer={
          isSuccess ? null : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSuccess}
              >
                취소
              </Button>
              <Button
                variant="error"
                onClick={handleConfirm}
                disabled={isSuccess}
              >
                {isSuccess ? "삭제 중..." : "삭제"}
              </Button>
            </>
          )
        }
      >
        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900">삭제 완료</h3>
            <p className="text-neutral-600 mt-2">
              선택한 항목이 성공적으로 삭제되었습니다.
            </p>
          </div>
        ) : (
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-neutral-700">
                이 항목을 삭제하면 관련된 모든 데이터가 영구적으로 제거됩니다.
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export const AlertModal: Story = {
  parameters: {
    docs: {
      description: {
        story: "경고 메시지나 확인이 필요한 중요한 액션에 사용되는 모달입니다.",
      },
    },
  },
  render: () => <AlertModalExample />,
};

const FormModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 폼 제출 시뮬레이션
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>로그인</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => !isSubmitting && setIsOpen(false)}
        title="로그인"
        description="계정 정보를 입력하여 로그인하세요."
        showCloseButton={!isSubmitting}
        closeOnOverlayClick={!isSubmitting}
        closeOnEsc={!isSubmitting}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="이메일 주소"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Checkbox label="로그인 상태 유지" disabled={isSubmitting} />
            <Button
              variant="link"
              size="sm"
              type="button"
              disabled={isSubmitting}
            >
              비밀번호 찾기
            </Button>
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              loadingText="로그인 중..."
            >
              로그인
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const FormModal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "로그인, 회원가입 등 사용자 입력이 필요한 폼을 모달로 표시한 예시입니다.",
      },
    },
  },
  render: () => <FormModalExample />,
};

const SampleExampleComponent = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="p-4 border border-neutral-200 rounded-lg w-96">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">딸기 요거트 스무디</h3>
            <p className="text-sm text-neutral-500 mt-1">
              신선한 딸기와 요거트의 만남
            </p>
          </div>
          <div className="text-lg font-semibold">5,800원</div>
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDetailsOpen(true)}
          >
            상세 정보
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsConfirmOpen(true)}
          >
            주문하기
          </Button>
        </div>
      </div>

      {/* 상세 정보 모달 */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="딸기 요거트 스무디"
        size="md"
        footer={<Button onClick={() => setIsDetailsOpen(false)}>닫기</Button>}
      >
        <div className="space-y-4">
          <div className="relative h-60 w-full bg-neutral-100 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* 이미지 대체 요소 */}
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              스무디 이미지
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">소개</h3>
              <p className="text-neutral-600 mt-1">
                신선한 딸기와 크리미한 요거트가 조화롭게 어우러진 스무디. 달콤한
                맛과 건강함을 동시에 즐길 수 있는 인기 메뉴입니다.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg">영양 정보</h3>
              <div className="mt-1 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">칼로리</span>
                  <span>320 kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">단백질</span>
                  <span>5g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">탄수화물</span>
                  <span>68g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">당류</span>
                  <span>42g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">지방</span>
                  <span>3g</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg">알레르기 정보</h3>
              <p className="text-neutral-600 mt-1">우유, 딸기</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* 주문 확인 모달 */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => !isProcessing && setIsConfirmOpen(false)}
        title="주문 확인"
        size="sm"
        showCloseButton={!isProcessing}
        closeOnOverlayClick={!isProcessing}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              isLoading={isProcessing}
              loadingText="처리 중..."
            >
              주문 확인
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-neutral-600">
              딸기 요거트 스무디 1잔을 주문하시겠습니까?
            </p>
          </div>

          <div className="bg-neutral-50 p-3 rounded-md">
            <div className="flex justify-between text-sm">
              <span>가격</span>
              <span>5,800원</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* 주문 성공 모달 */}
      <Modal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="주문 완료"
        size="sm"
        showCloseButton={true}
        footer={<Button onClick={() => setIsSuccessOpen(false)}>확인</Button>}
      >
        <div className="flex flex-col items-center text-center py-2">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">주문이 완료되었습니다</h3>
          <p className="text-neutral-600 mt-2 mb-4">
            딸기 요거트 스무디가 준비되면 알림으로 알려드립니다.
          </p>
          <div className="bg-neutral-50 w-full p-3 rounded-md">
            <div className="text-sm text-neutral-600">주문 번호</div>
            <div className="font-medium">#12345</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const SampleExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "음료 주문 시나리오에서 여러 모달을 활용하는 예시입니다. 상세 정보 보기, 주문 확인, 주문 완료 등 다양한 상황에서 모달을 활용하는 방법을 보여줍니다.",
      },
    },
  },
  render: () => <SampleExampleComponent />,
};
