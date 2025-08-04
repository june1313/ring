// app/_layout.tsx

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// 스플래시 스크린이 즉시 사라지는 것을 방지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // 사용자가 알려준 정확한 폰트 이름과 경로로 수정합니다.
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // 폰트 로딩이 끝나면 스플래시 스크린을 숨깁니다.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 폰트가 로드되지 않았다면 아직 아무것도 표시하지 않습니다.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 폰트 로딩이 완료되면 앱 레이아웃을 렌더링합니다.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
