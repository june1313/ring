import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-chart-kit";

const COLORS = {
  primary: "#FFB86B", // 스트레스의 메인 컬러
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
};

// --- 타입 정의 추가 ---
type Period = "일" | "주" | "월";
type PeriodToggleProps = {
  period: Period;
  setPeriod: (period: Period) => void;
};

// 일/주/월 선택 토글 (props에 타입 적용)
const PeriodToggle = ({ period, setPeriod }: PeriodToggleProps) => (
  <View style={styles.toggleContainer}>
    <TouchableOpacity
      style={[
        styles.toggleButton,
        period === "일" && styles.activeToggleButton,
      ]}
      onPress={() => setPeriod("일")}
    >
      <Text
        style={[styles.toggleText, period === "일" && styles.activeToggleText]}
      >
        일
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.toggleButton,
        period === "주" && styles.activeToggleButton,
      ]}
      onPress={() => setPeriod("주")}
    >
      <Text
        style={[styles.toggleText, period === "주" && styles.activeToggleText]}
      >
        주
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.toggleButton,
        period === "월" && styles.activeToggleButton,
      ]}
      onPress={() => setPeriod("월")}
    >
      <Text
        style={[styles.toggleText, period === "월" && styles.activeToggleText]}
      >
        월
      </Text>
    </TouchableOpacity>
  </View>
);

export default function StressDetailsScreen() {
  const [period, setPeriod] = useState<Period>("주");

  const data = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [{ data: [25, 30, 45, 20, 15, 35, 28] }],
  };

  const avg =
    data.datasets[0].data.reduce((a, b) => a + b, 0) /
    data.datasets[0].data.length;
  const min = Math.min(...data.datasets[0].data);
  const max = Math.max(...data.datasets[0].data);

  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>스트레스</Text>
          <TouchableOpacity>
            <Feather name="help-circle" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <PeriodToggle period={period} setPeriod={setPeriod} />
          <Text style={styles.mainValue}>
            25<Text style={styles.unit}> 낮음</Text>
          </Text>
          <Text style={styles.dateRange}>2025/07/28 - 2025/08/03</Text>

          <View style={styles.chartContainer}>
            <BarChart
              data={data}
              width={Dimensions.get("window").width - 32}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars={false}
              withInnerLines={false}
              chartConfig={{
                backgroundColor: COLORS.card,
                backgroundGradientFrom: COLORS.card,
                backgroundGradientTo: COLORS.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 184, 107, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
                propsForBackgroundLines: {
                  stroke: COLORS.gridLine,
                  strokeWidth: 0.5,
                },
                barPercentage: 0.5,
              }}
              style={{ borderRadius: 16 }}
            />
          </View>

          <View style={styles.summaryMetricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{avg.toFixed(0)}</Text>
              <Text style={styles.metricLabel}>평균</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{min.toFixed(0)}</Text>
              <Text style={styles.metricLabel}>최저</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{max.toFixed(0)}</Text>
              <Text style={styles.metricLabel}>최고</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: COLORS.text, fontSize: 20, fontWeight: "bold" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#161B22",
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 24,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  activeToggleButton: { backgroundColor: COLORS.primary },
  toggleText: { color: COLORS.subText, fontSize: 16, fontWeight: "bold" },
  activeToggleText: { color: "white" },
  mainValue: {
    fontFamily: "SpaceMono",
    fontSize: 64,
    color: "white",
    textAlign: "center",
  },
  unit: { fontSize: 24, color: "#8E8E93" },
  dateRange: {
    fontFamily: "SpaceMono",
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 16,
    marginBottom: 24,
  },
  summaryMetricsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
  },
  metricItem: { flex: 1, alignItems: "center" },
  metricValue: {
    fontFamily: "SpaceMono",
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  metricLabel: { color: "#8E8E93", fontSize: 14, marginTop: 4 },
});
