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
import { LineChart } from "react-native-chart-kit";
import { MotiView } from "moti";

const COLORS = {
  primary: "#3ACCE1",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
};

export default function SpO2DetailsScreen() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");

  const dailyData = [
    98, 99, 97, 98, 96, 97, 99, 98, 97, 96, 98, 99, 98, 97, 96, 97, 98, 99, 97,
    98, 96, 97, 99, 98,
  ];
  const weeklyData = [97, 98, 96, 99, 97, 98, 95];
  const monthlyData = Array.from({ length: 30 }, () => 95 + Math.random() * 4);

  const getLabels = (): string[] => {
    if (timeRange === "day") return ["00", "06", "12", "18", "23"];
    if (timeRange === "week") return ["월", "화", "수", "목", "금", "토", "일"];
    return ["1", "10", "20", "30"].map(String);
  };

  const getData = (): number[] => {
    if (timeRange === "day") return dailyData;
    if (timeRange === "week") return weeklyData;
    return monthlyData;
  };

  const average = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = (arr: number[]) => Math.min(...arr);
  const max = (arr: number[]) => Math.max(...arr);

  const currentData = getData();
  const currentSpO2 =
    currentData.length > 0
      ? currentData[currentData.length - 1].toFixed(0)
      : "--";
  const status = parseInt(currentSpO2) >= 95 ? "정상" : "주의";

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
          <Text style={styles.headerTitle}>SpO2</Text>
          <TouchableOpacity>
            <Feather name="help-circle" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <Text style={styles.currentValue}>
              {currentSpO2}
              <Text style={styles.unit}>%</Text>
            </Text>
            <Text style={[styles.status, { color: COLORS.primary }]}>
              {status}
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 150 }}
            style={styles.chartContainer}
          >
            <LineChart
              data={{
                labels: getLabels(),
                datasets: [{ data: getData() }],
              }}
              width={Dimensions.get("window").width - 64}
              height={220}
              yAxisSuffix="%"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: COLORS.card,
                backgroundGradientFrom: COLORS.card,
                backgroundGradientTo: COLORS.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(58, 204, 225, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: COLORS.primary,
                },
                propsForHorizontalLine: {
                  strokeWidth: 0.5,
                  stroke: COLORS.gridLine,
                },
                propsForVerticalLines: {
                  strokeWidth: 0.5,
                  stroke: COLORS.gridLine,
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
            <View style={styles.timeRangeButtons}>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === "day" && styles.activeButton,
                ]}
                onPress={() => setTimeRange("day")}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === "day" && styles.activeText,
                  ]}
                >
                  일
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === "week" && styles.activeButton,
                ]}
                onPress={() => setTimeRange("week")}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === "week" && styles.activeText,
                  ]}
                >
                  주
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === "month" && styles.activeButton,
                ]}
                onPress={() => setTimeRange("month")}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === "month" && styles.activeText,
                  ]}
                >
                  월
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 300 }}
            style={styles.metricsContainer}
          >
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {average(currentData).toFixed(1)}
                <Text style={styles.metricUnit}>%</Text>
              </Text>
              <Text style={styles.metricLabel}>평균</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {min(currentData).toFixed(0)}
                <Text style={styles.metricUnit}>%</Text>
              </Text>
              <Text style={styles.metricLabel}>최저</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {max(currentData).toFixed(0)}
                <Text style={styles.metricUnit}>%</Text>
              </Text>
              <Text style={styles.metricLabel}>최고</Text>
            </View>
          </MotiView>
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
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerTitle: { color: COLORS.text, fontSize: 22, fontWeight: "bold" },
  scrollContent: { padding: 16, paddingBottom: 30 },
  currentValue: {
    fontFamily: "SpaceMono",
    fontSize: 64,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  unit: { fontSize: 24, color: COLORS.subText },
  status: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingTop: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  timeRangeButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    paddingBottom: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  timeRangeButton: { flex: 1, paddingVertical: 10, alignItems: "center" },
  timeRangeText: { color: COLORS.subText, fontWeight: "600", fontSize: 16 },
  activeButton: { backgroundColor: COLORS.primary },
  activeText: { color: "white" },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  metric: { alignItems: "center" },
  metricValue: {
    fontFamily: "SpaceMono",
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
  },
  metricUnit: { fontSize: 18, color: COLORS.subText },
  metricLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
});
