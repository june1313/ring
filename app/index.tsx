import { Redirect } from "expo-router";

export default function StartPage() {
  // (tabs) 그룹의 기본 화면인 index.tsx로 사용자를 리디렉션합니다.
  return <Redirect href="/(tabs)" />;
}
