import React from "react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* 설정 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-muted-foreground">
          계정 및 가맹점 설정을 관리할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
