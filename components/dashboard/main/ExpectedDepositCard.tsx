"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import Image from "next/image"; // ⭐️ 추가

interface Product {
  image: string; // 이미지 경로만
}

const products: Product[] = [
  { image: "/광고1-1.png" }
];

export default function RecommendedProductCard({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2초마다 인덱스 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardCard className={`relative flex flex-col gap-1 py-4 px-6 ${className}`}>
      {/* 타이틀 */}
     
        <div className="text-2xl font-bold text-gray-900 ">금융상품 추천</div>

      <div className="w-full border-t  border-gray-300"></div>

  

      {/* 이미지 배너 영역 */}
      <div className="relative w-full aspect-[10/16] overflow-hidden my-2">
        {products.map((product, idx) => (
       <Image
  key={idx}
  src={product.image}
  alt={`광고 ${idx + 1}`}
  fill
  className={`
    object-contain transition-opacity duration-700 ease-in-out
    ${idx === currentIndex ? "opacity-100" : "opacity-0"}
  `}
/>
        ))}
      </div>
    </DashboardCard>
  );
}
