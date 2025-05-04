import { ReactNode } from "react";

interface StepContainerProps {
  children: ReactNode;
}

export default function StepContainer({ children }: StepContainerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
      {children}
    </div>
  );
}
