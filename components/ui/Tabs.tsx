import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

// Tabs Context
type TabsContextValue = {
  value: string;
  onChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      "Tabs compound components must be used within a Tabs component"
    );
  }
  return context;
}

// Tabs
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 현재 선택된 탭 값
   */
  value: string;

  /**
   * 탭 값이 변경될 때 호출되는 함수
   */
  onValueChange: (value: string) => void;

  /**
   * 디폴트 선택 값 (uncontrolled mode)
   */
  defaultValue?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  defaultValue,
  className,
  children,
  ...props
}) => {
  const [tabValue, setTabValue] = useState(defaultValue || "");

  // 제어 모드 여부 판단
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : tabValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setTabValue(newValue);
    }
    onValueChange(newValue);
  };

  return (
    <TabsContext.Provider
      value={{ value: currentValue, onChange: handleValueChange }}
    >
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList
export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export const TabsList: React.FC<TabsListProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("flex bg-neutral-100 p-1 rounded-lg", className)}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

// TabsTrigger
export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 이 트리거에 해당하는 탭 값
   */
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const { value: selectedValue, onChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <button
      className={cn(
        "flex-1 px-3 py-1.5 text-sm font-medium transition-all",
        "focus:outline-none",
        isSelected
          ? "bg-white text-[#FF6B35] rounded-md shadow-sm"
          : "text-neutral-600 hover:text-neutral-900",
        className
      )}
      role="tab"
      aria-selected={isSelected}
      onClick={() => onChange(value)}
      tabIndex={isSelected ? 0 : -1}
      {...props}
    >
      {children}
    </button>
  );
};

// TabsContent
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 이 콘텐츠에 해당하는 탭 값
   */
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div className={cn("mt-2", className)} role="tabpanel" {...props}>
      {children}
    </div>
  );
};
