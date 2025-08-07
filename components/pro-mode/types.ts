import { Href } from "expo-router";
import React from "react";

// Card 컴포넌트가 받는 props 타입
export type CardProps = {
  icon: any;
  title: string;
  value?: string;
  unit?: string;
  status?: string;
  color: string;
  href: Href;
  iconProvider?: "FontAwesome5" | "MaterialCommunityIcons";
};

// FlatList에서 사용할 데이터 아이템의 타입
export type CardDataItem = {
  key: string;
  type: "full" | "half";
  component: React.ComponentType<any>;
  props: CardProps;
};

// [수정] 공통 색상 정의에 새로운 지표 색상 추가
export const COLORS = {
  sleep: "#8A9BFF",
  exercise: "#50D6A3",
  hr: "#FF708D",
  spo2: "#3ACCE1",
  stress: "#FFB86B",
  glucose: "#A061FF",
  hrv: "#48C9B0", // HRV (청록색)
  temp: "#F39C12", // 온도 (주황색)
  pressure: "#5DADE2", // 압력 (하늘색)
  vo2max: "#9B59B6", // VO2Max (보라색)
};
