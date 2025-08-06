import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// 분리된 메인 화면 컴포넌트들을 import 합니다.
import ProModeScreen from "@/components/pro-mode/ProModeScreen";
import LiteModeScreen from "@/components/lite-mode/LiteModeScreen";

export default function HomeScreen() {
  const [mode, setMode] = useState<"PRO" | "LITE">("PRO");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Genie Ring</Text>
          <Text style={styles.headerSubtitle}>{mode}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setMode(mode === "PRO" ? "LITE" : "PRO");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={styles.modeSwitchButton}
        >
          <Feather name="repeat" size={22} color="#ccc" />
        </TouchableOpacity>
      </View>

      {mode === "LITE" ? <LiteModeScreen /> : <ProModeScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#161B22",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: { color: "#EAEAEA", fontSize: 28, fontWeight: "bold" },
  headerSubtitle: {
    color: "#5A9DFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
    fontFamily: "SpaceMono",
  },
  modeSwitchButton: {
    padding: 8, // 터치 영역을 확보하기 위한 패딩
  },
});
