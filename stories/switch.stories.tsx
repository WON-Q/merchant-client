import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@/components/ui/switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ON/OFF 상태를 시각적으로 표현하는 토글 스위치 컴포넌트입니다. 설정이나 옵션을 활성화/비활성화하는 데 사용합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "스위치의 현재 상태(체크 여부)",
      defaultValue: false,
    },
    disabled: {
      control: "boolean",
      description: "스위치의 비활성화 상태",
      defaultValue: false,
    },
    size: {
      control: "select",
      description: "스위치의 크기",
      options: ["xs", "sm", "md", "lg", "xl"],
      defaultValue: "md",
    },
    variant: {
      control: "select",
      description: "스위치의 색상 변형",
      options: [
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "error",
      ],
      defaultValue: "primary",
    },
    label: {
      control: "text",
      description: "스위치에 표시할 레이블",
    },
    labelPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "레이블 위치",
      defaultValue: "right",
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "알림 설정",
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 크기의 스위치를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch size="xs" label="Extra Small" checked={true} />
      <Switch size="sm" label="Small" checked={true} />
      <Switch size="md" label="Medium" checked={true} />
      <Switch size="lg" label="Large" checked={true} />
      <Switch size="xl" label="Extra Large" checked={true} />
    </div>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: "다양한 색상의 스위치를 제공합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-8">
        <Switch variant="primary" label="Primary" checked={true} />
        <Switch variant="secondary" label="Secondary" checked={true} />
        <Switch variant="accent" label="Accent" checked={true} />
      </div>
      <div className="flex flex-wrap gap-8">
        <Switch variant="success" label="Success" checked={true} />
        <Switch variant="warning" label="Warning" checked={true} />
        <Switch variant="error" label="Error" checked={true} />
      </div>
    </div>
  ),
};

export const LabelPositions: Story = {
  parameters: {
    docs: {
      description: {
        story: "레이블을 스위치의 왼쪽이나 오른쪽에 배치할 수 있습니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="오른쪽 레이블" labelPosition="right" checked={true} />
      <Switch label="왼쪽 레이블" labelPosition="left" checked={true} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: "스위치의 다양한 상태를 시각적으로 표현합니다.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-8">
        <Switch label="꺼짐 상태" checked={false} />
        <Switch label="켜짐 상태" checked={true} />
      </div>
      <div className="flex flex-wrap gap-8">
        <Switch label="비활성화 (꺼짐)" disabled checked={false} />
        <Switch label="비활성화 (켜짐)" disabled checked={true} />
      </div>
    </div>
  ),
};

const SampleExampleComponent = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [emailUpdates, setEmailUpdates] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm border border-neutral-100">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        앱 설정 관리
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="mr-8">
            <p className="font-medium text-neutral-800">푸시 알림</p>
            <p className="text-sm text-neutral-500">
              중요 알림을 푸시 형태로 받습니다
            </p>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
            variant="primary"
          />
        </div>
        <div className="border-t border-neutral-100 my-1"></div>
        <div className="flex items-center justify-between">
          <div className="mr-8">
            <p className="font-medium text-neutral-800">다크 모드</p>
            <p className="text-sm text-neutral-500">
              어두운 테마로 화면을 표시합니다
            </p>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            variant="secondary"
          />
        </div>
        <div className="border-t border-neutral-100 my-1"></div>
        <div className="flex items-center justify-between">
          <div className="mr-8">
            <p className="font-medium text-neutral-800">이메일 업데이트</p>
            <p className="text-sm text-neutral-500">
              새로운 소식을 이메일로 받습니다
            </p>
          </div>
          <Switch
            checked={emailUpdates}
            onCheckedChange={setEmailUpdates}
            variant="accent"
          />
        </div>
        <div className="border-t border-neutral-100 my-1"></div>
        <div className="flex items-center justify-between">
          <div className="mr-8">
            <p className="font-medium text-neutral-800">자동 저장</p>
            <p className="text-sm text-neutral-500">
              작업 내용이 자동으로 저장됩니다
            </p>
          </div>
          <Switch
            checked={autoSave}
            onCheckedChange={setAutoSave}
            variant="success"
          />
        </div>
      </div>
    </div>
  );
};

export const SampleExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "실제 사용 예시를 보여주는 예제입니다. 다양한 설정 옵션에서 스위치를 활용하는 방법을 보여줍니다.",
      },
    },
  },
  render: () => <SampleExampleComponent />,
};
