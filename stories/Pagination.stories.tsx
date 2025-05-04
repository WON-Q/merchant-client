import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination, PaginationProps } from "@/components/ui/Pagination";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "페이지네이션 컴포넌트는 여러 페이지의 콘텐츠를 탐색할 수 있는 인터페이스를 제공합니다. 페이지 이동, 첫 페이지/마지막 페이지로 이동 등의 기능을 제공합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "현재 페이지 번호",
      defaultValue: 1,
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "전체 페이지 수",
      defaultValue: 10,
    },
    onPageChange: {
      description: "페이지 변경 이벤트 핸들러",
    },
    siblingCount: {
      control: { type: "number", min: 0 },
      description: "현재 페이지 좌우에 표시할 페이지 버튼 개수",
      defaultValue: 2,
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "페이지네이션 크기",
      defaultValue: "md",
    },
    bordered: {
      control: "boolean",
      description: "페이지 버튼 테두리 스타일 적용 여부",
      defaultValue: false,
    },
    shape: {
      control: "select",
      options: ["rounded", "pill", "square"],
      description: "페이지네이션 모양",
      defaultValue: "rounded",
    },
    showFirstLast: {
      control: "boolean",
      description: "처음/마지막 페이지 버튼 표시 여부",
      defaultValue: false,
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
      description: "페이지네이션 색상 변형",
      defaultValue: "primary",
    },
    fullWidth: {
      control: "boolean",
      description: "전체 너비 차지 여부",
      defaultValue: false,
    },
    disabled: {
      control: "boolean",
      description: "비활성화 여부",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Playground용 별도의 컴포넌트 생성
const PlaygroundPaginationComponent = (args: PaginationProps) => {
  const [currentPage, setCurrentPage] = React.useState(args.currentPage);

  // 컨트롤 값이 변경될 때 상태 업데이트
  React.useEffect(() => {
    setCurrentPage(args.currentPage);
  }, [args.currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    args.onPageChange?.(page);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="p-4 bg-neutral-50 rounded-lg w-full text-center">
        <p className="text-lg font-medium">현재 페이지: {currentPage}</p>
        <p className="text-sm text-neutral-500">
          전체 {args.totalPages} 페이지 중
        </p>
      </div>
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export const Playground: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    siblingCount: 2,
    size: "md",
    bordered: false,
    shape: "rounded",
    showFirstLast: false,
    variant: "primary",
    fullWidth: false,
    disabled: false,
    onPageChange: () => {}, // 타입 에러 해결을 위해 추가
  },
  render: (args) => <PlaygroundPaginationComponent {...args} />,
};

const VariantsExampleComponent = () => {
  // 각 variant별로 상태 관리
  const [primaryPage, setPrimaryPage] = React.useState(5);
  const [secondaryPage, setSecondaryPage] = React.useState(5);
  const [accentPage, setAccentPage] = React.useState(5);
  const [neutralPage, setNeutralPage] = React.useState(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Primary</span>
        <Pagination
          currentPage={primaryPage}
          totalPages={10}
          onPageChange={setPrimaryPage}
          variant="primary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Secondary</span>
        <Pagination
          currentPage={secondaryPage}
          totalPages={10}
          onPageChange={setSecondaryPage}
          variant="secondary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Accent</span>
        <Pagination
          currentPage={accentPage}
          totalPages={10}
          onPageChange={setAccentPage}
          variant="accent"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Neutral</span>
        <Pagination
          currentPage={neutralPage}
          totalPages={10}
          onPageChange={setNeutralPage}
          variant="neutral"
        />
      </div>
    </div>
  );
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "페이지네이션은 다양한 색상 변형을 제공합니다. 앱의 디자인 시스템에 맞게 선택하세요.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <VariantsExampleComponent />,
};

const SizesExampleComponent = () => {
  const [xsPage, setXsPage] = React.useState(5);
  const [smPage, setSmPage] = React.useState(5);
  const [mdPage, setMdPage] = React.useState(5);
  const [lgPage, setLgPage] = React.useState(5);
  const [xlPage, setXlPage] = React.useState(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Extra Small
        </span>
        <Pagination
          currentPage={xsPage}
          totalPages={10}
          onPageChange={setXsPage}
          size="xs"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Small</span>
        <Pagination
          currentPage={smPage}
          totalPages={10}
          onPageChange={setSmPage}
          size="sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Medium</span>
        <Pagination
          currentPage={mdPage}
          totalPages={10}
          onPageChange={setMdPage}
          size="md"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Large</span>
        <Pagination
          currentPage={lgPage}
          totalPages={10}
          onPageChange={setLgPage}
          size="lg"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Extra Large
        </span>
        <Pagination
          currentPage={xlPage}
          totalPages={10}
          onPageChange={setXlPage}
          size="xl"
        />
      </div>
    </div>
  );
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "페이지네이션은 다양한 크기로 제공됩니다. UI에 적합한 크기를 선택하세요.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <SizesExampleComponent />,
};

// 인터랙티브한 모양 예제 컴포넌트
const InteractiveShapesExample = () => {
  const [roundedPage, setRoundedPage] = React.useState(5);
  const [pillPage, setPillPage] = React.useState(5);
  const [squarePage, setSquarePage] = React.useState(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Rounded</span>
        <Pagination
          currentPage={roundedPage}
          totalPages={10}
          onPageChange={setRoundedPage}
          shape="rounded"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Pill</span>
        <Pagination
          currentPage={pillPage}
          totalPages={10}
          onPageChange={setPillPage}
          shape="pill"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">Square</span>
        <Pagination
          currentPage={squarePage}
          totalPages={10}
          onPageChange={setSquarePage}
          shape="square"
        />
      </div>
    </div>
  );
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "페이지네이션 버튼은 다양한 모양으로 제공됩니다. UI에 적합한 모양을 선택하세요.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <InteractiveShapesExample />,
};

// 처음/마지막 버튼 인터랙티브 예제
const FirstLastButtonsExampleComponent = () => {
  const [withoutFirstLastPage, setWithoutFirstLastPage] = React.useState(5);
  const [withFirstLastPage, setWithFirstLastPage] = React.useState(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Without First/Last Buttons
        </span>
        <Pagination
          currentPage={withoutFirstLastPage}
          totalPages={20}
          onPageChange={setWithoutFirstLastPage}
          siblingCount={1}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          With First/Last Buttons
        </span>
        <Pagination
          currentPage={withFirstLastPage}
          totalPages={20}
          onPageChange={setWithFirstLastPage}
          siblingCount={1}
          showFirstLast
        />
      </div>
    </div>
  );
};

export const FirstLastButtons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "페이지가 많을 때 처음/마지막 페이지로 이동하는 버튼을 추가할 수 있습니다.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 20,
    onPageChange: () => {},
  },
  render: () => <FirstLastButtonsExampleComponent />,
};

// 테두리 인터랙티브 예제
const BorderedExampleComponent = () => {
  const [withoutBordersPage, setWithoutBordersPage] = React.useState(5);
  const [withBordersPage, setWithBordersPage] = React.useState(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Without Borders
        </span>
        <Pagination
          currentPage={withoutBordersPage}
          totalPages={10}
          onPageChange={setWithoutBordersPage}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          With Borders
        </span>
        <Pagination
          currentPage={withBordersPage}
          totalPages={10}
          onPageChange={setWithBordersPage}
          bordered
        />
      </div>
    </div>
  );
};

export const Bordered: Story = {
  parameters: {
    docs: {
      description: {
        story: "페이지네이션 버튼에 테두리를 추가할 수 있습니다.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <BorderedExampleComponent />,
};

// 전체 너비 인터랙티브 예제
const FullWidthExampleComponent = () => {
  const [page, setPage] = React.useState(5);

  return (
    <div className="w-full max-w-3xl">
      <div className="w-full p-4 bg-neutral-50 rounded-lg mb-4">
        <h3 className="text-center text-lg font-medium">검색 결과</h3>
      </div>
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
        fullWidth
      />
    </div>
  );
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "전체 너비를 차지하는 페이지네이션입니다. 부모 요소의 너비에 따라 확장됩니다.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
    fullWidth: true,
  },
  render: () => <FullWidthExampleComponent />,
};

// 비활성화 인터랙티브 예제 (비활성화된 경우는 클릭 불가이므로 단순함)
const DisabledExampleComponent = () => {
  const [page, setPage] = React.useState(5);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-neutral-50 rounded-lg">
        <p className="font-medium">
          비활성화된 페이지네이션은 클릭해도 페이지가 변경되지 않습니다.
        </p>
      </div>
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
        disabled
      />
    </div>
  );
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "비활성화된 페이지네이션입니다. 사용자와 상호작용할 수 없습니다.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
    disabled: true,
  },
  render: () => <DisabledExampleComponent />,
};

// siblingCount 인터랙티브 예제
const SiblingCountExampleComponent = () => {
  const [page0, setPage0] = React.useState(5);
  const [page1, setPage1] = React.useState(5);
  const [page2, setPage2] = React.useState(5);
  const [page3, setPage3] = React.useState(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Sibling Count: 0
        </span>
        <Pagination
          currentPage={page0}
          totalPages={20}
          onPageChange={setPage0}
          siblingCount={0}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Sibling Count: 1
        </span>
        <Pagination
          currentPage={page1}
          totalPages={20}
          onPageChange={setPage1}
          siblingCount={1}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Sibling Count: 2 (기본값)
        </span>
        <Pagination
          currentPage={page2}
          totalPages={20}
          onPageChange={setPage2}
          siblingCount={2}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Sibling Count: 3
        </span>
        <Pagination
          currentPage={page3}
          totalPages={20}
          onPageChange={setPage3}
          siblingCount={3}
        />
      </div>
    </div>
  );
};

export const SiblingCount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "siblingCount 값은 현재 페이지 양쪽에 표시할 페이지 버튼의 개수를 결정합니다. 값이 클수록 더 많은 페이지 버튼이 표시됩니다.",
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 20,
    onPageChange: () => {},
  },
  render: () => <SiblingCountExampleComponent />,
};

// 페이지 전환 예시를 위한 컴포넌트
const ActivePaginationExample = () => {
  const [page, setPage] = React.useState(4);
  const totalPages = 10;

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="p-4 bg-neutral-50 rounded-lg w-full text-center">
        <p className="text-lg font-medium">현재 페이지: {page}</p>
        <p className="text-sm text-neutral-500">전체 {totalPages} 페이지 중</p>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showFirstLast
      />
    </div>
  );
};

export const PaginationWithState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "상태와 함께 사용되는 페이지네이션 예시입니다. 페이지를 클릭하여 페이지 상태가 변경되는 것을 확인하세요.",
      },
    },
  },
  args: {
    currentPage: 4,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <ActivePaginationExample />,
};

// 실제 사용 예시를 위한 컴포넌트
const SampleExampleComponent = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 5;
  const totalProducts = 27;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // 실제 데이터 대신 더미 데이터 생성
  const products = Array.from({ length: totalProducts }, (_, i) => ({
    id: i + 1,
    name: `제품 ${i + 1}`,
    price: Math.floor(10000 + Math.random() * 90000),
    stock: Math.floor(Math.random() * 100),
  }));

  // 현재 페이지에 표시할 제품들
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-medium mb-4">제품 목록</h3>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                제품명
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                가격
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                재고
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  #{product.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  {product.price.toLocaleString()}원
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  {product.stock}개
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          siblingCount={1}
          size="sm"
          showFirstLast
        />
      </div>
    </div>
  );
};

export const SampleExample: Story = {
  parameters: {
    docs: {
      description: {
        story: "실제 제품 목록 페이지에서 페이지네이션을 활용한 예시입니다.",
      },
    },
  },
  args: {
    currentPage: 1,
    totalPages: 6,
    onPageChange: () => {},
  },
  render: () => <SampleExampleComponent />,
};
