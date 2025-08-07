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
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart, LineChart, ContributionGraph } from "react-native-chart-kit";

// --- 타입, 상수, 데이터 ---
const COLORS = {
  primary: "#FFB86B",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
  calm: "#50D6A3",
  relaxed: "#3ACCE1",
  tense: "#FFB86B",
  anxious: "#FF708D",
};
type Period = "일" | "주" | "월";

// 사용자가 제공한 스트레스 레벨 분류 함수
const getStressInfo = (value: number) => {
  if (value <= 25) return { text: "평온함", color: COLORS.calm };
  if (value <= 50) return { text: "편안함", color: COLORS.relaxed };
  if (value <= 75) return { text: "긴장됨", color: COLORS.tense };
  return { text: "불안", color: COLORS.anxious };
};

const DAILY_DATA = {
  timeline: Array.from({ length: 24 }, () =>
    Math.floor(10 + Math.random() * 80)
  ),
  summary: { avg: 45, high: 82, timeInStress: "3h 15m", timeInRest: "8h 30m" },
};
const WEEKLY_DATA = {
  dailyAvg: [45, 55, 62, 48, 75, 58, 42],
  avg: 55,
};
const MONTHLY_DATA = {
  heatmapData: Array.from({ length: 31 }, (_, i) => ({
    date: `2025-08-${String(i + 1).padStart(2, "0")}`,
    count: Math.floor(Math.random() * 100),
  })),
  weeklyTrend: [55, 68, 52, 65],
};
const chartConfig = (color = COLORS.primary) => ({
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => color,
  labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
  propsForBackgroundLines: { stroke: COLORS.gridLine },
});

// --- 재사용 컴포넌트 ---
const DetailScreenHeader = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
      <Feather name="chevron-left" size={28} color={COLORS.text} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity>
      <Feather name="help-circle" size={24} color={COLORS.text} />
    </TouchableOpacity>
  </View>
);
const PeriodToggle = ({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (p: Period) => void;
}) => (
  <View style={styles.toggleContainer}>
    {(["일", "주", "월"] as Period[]).map((p) => (
      <TouchableOpacity
        key={p}
        style={[styles.toggleButton, period === p && styles.activeToggleButton]}
        onPress={() => setPeriod(p)}
      >
        <Text
          style={[styles.toggleText, period === p && styles.activeToggleText]}
        >
          {p}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// --- 탭별 뷰 컴포넌트 ---
const DailyView = () => {
  const currentStress = getStressInfo(DAILY_DATA.summary.avg);
  return (
    <>
      <View style={styles.mainValueContainer}>
        <Text style={[styles.mainValue, { color: currentStress.color }]}>
          {DAILY_DATA.summary.avg}
        </Text>
        <Text style={styles.mainUnit}>{currentStress.text}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>시간대별 스트레스</Text>
        <BarChart
          data={{
            labels: ["00", "04", "08", "12", "16", "20", ""],
            datasets: [{ data: DAILY_DATA.timeline }],
          }}
          width={Dimensions.get("window").width - 48}
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          showValuesOnTopOfBars={false}
          withInnerLines={false}
          chartConfig={chartConfig()}
        />
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>최고 수치</Text>
          <Text style={styles.summaryValue}>{DAILY_DATA.summary.high}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>스트레스 시간</Text>
          <Text style={styles.summaryValue}>
            {DAILY_DATA.summary.timeInStress}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>휴식 시간</Text>
          <Text style={styles.summaryValue}>
            {DAILY_DATA.summary.timeInRest}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionCard}>
        <FontAwesome5 name="wind" size={24} color={COLORS.primary} />
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionTitle}>심호흡으로 스트레스 해소하기</Text>
          <Text style={styles.actionSubtitle}>
            1분간의 호흡 운동을 시작합니다.
          </Text>
        </View>
        <Feather name="play-circle" size={32} color={COLORS.text} />
      </TouchableOpacity>
    </>
  );
};

const WeeklyView = () => (
  <>
    <View style={styles.mainValueContainer}>
      <Text style={styles.mainValue}>{WEEKLY_DATA.avg}</Text>
      <Text style={styles.mainUnit}>주간 평균</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>일별 평균 스트레스</Text>
      <BarChart
        data={{
          labels: ["월", "화", "수", "목", "금", "토", "일"],
          datasets: [{ data: WEEKLY_DATA.dailyAvg }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero
        chartConfig={chartConfig()}
      />
    </View>
  </>
);

const MonthlyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>월간 스트레스 히트맵</Text>
      <ContributionGraph
        values={MONTHLY_DATA.heatmapData}
        endDate={new Date("2025-08-31")}
        numDays={31}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={{
          ...chartConfig(),
          color: (opacity = 1) => `rgba(255, 184, 107, ${opacity})`,
        }}
      />
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>주간별 평균 트렌드</Text>
      <LineChart
        data={{
          labels: ["1주차", "2주차", "3주차", "4주차"],
          datasets: [{ data: MONTHLY_DATA.weeklyTrend }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero
        chartConfig={chartConfig()}
        bezier
      />
    </View>
  </>
);

// --- 메인 컴포넌트 ---
export default function StressDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="스트레스 분석" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <PeriodToggle period={period} setPeriod={setPeriod} />
          {period === "일" && <DailyView />}
          {period === "주" && <WeeklyView />}
          {period === "월" && <MonthlyView />}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- 전체 스타일시트 ---
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
  mainValueContainer: { alignItems: "center", marginBottom: 24 },
  mainValue: {
    fontSize: 64,
    color: "white",
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  mainUnit: { fontSize: 18, color: COLORS.subText, marginTop: 4 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    minWidth: "33%",
    alignItems: "center",
    paddingVertical: 16,
  },
  summaryValue: { color: "white", fontSize: 28, fontWeight: "bold" },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
  actionCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  actionTextContainer: { flex: 1, marginLeft: 16 },
  actionTitle: { color: COLORS.text, fontSize: 16, fontWeight: "bold" },
  actionSubtitle: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
});
