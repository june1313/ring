// hooks/useThemeColor.ts
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

// keyof typeof Colors.light: Colors.light 객체의 모든 키('text', 'background', 'card' 등)를
// 타입으로 사용하여, 이제 어떤 색상 이름이든 안전하게 받을 수 있습니다.
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
