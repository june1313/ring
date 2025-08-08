import React, { useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// --- 분리된 컴포넌트들을 import ---
import Header from "@/components/sleep/Header";
import DailyView from "@/components/sleep/DailyView";
import WeeklyView from "@/components/sleep/WeeklyView";
import MonthlyView from "@/components/sleep/MonthlyView";

// --- 스타일과 색상도 import ---
import { styles, COLORS } from "@/styles/sleep-details-styles";

type Period = "일" | "주" | "월";

export default function SleepDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  const [date, setDate] = useState(new Date("2025-07-26"));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={["#1F2937", COLORS.background, COLORS.background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Header
            period={period}
            setPeriod={setPeriod}
            date={date}
            setDate={setDate}
          />

          {period === "일" && <DailyView />}
          {period === "주" && <WeeklyView />}
          {period === "월" && <MonthlyView />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
