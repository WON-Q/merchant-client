import React from "react";

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({ title, children, className }: DashboardCardProps) {
  return (
    <div className={`p-5 bg-white rounded-xl shadow border flex flex-col gap-3 ${className}`}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  );
}
