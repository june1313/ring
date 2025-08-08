import React from "react";
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
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

// --- 타입, 상수, 데이터 ---
const COLORS = {
  primary: "#9B59B6",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
};
const VO2MAX_DATA = {
  value: 45,
  level: "매우 좋음",
  fitnessAge: 28,
  percentile: 20,
  trend: [42, 42.5, 43, 44, 44.5, 45],
  levels: [
    { label: "매우 낮음", range: "0-30", color: "#E74C3C" },
    { label: "낮음", range: "31-35", color: "#F39C12" },
    { label: "보통", range: "36-42", color: "#5DADE2" },
    { label: "좋음", range: "43-48", color: "#50D6A3" },
    { label: "매우 좋음", range: "49+", color: "#9B59B6" },
  ],
};
const chartConfig = {
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
  propsForBackgroundLines: { stroke: COLORS.gridLine },
};

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

// --- 피트니스 게이지 컴포넌트 ---
const FitnessLevelGauge = ({ value, levels }) => {
  const size = 250;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const angle = 270; // 270도만 사용
  const percentage = Math.min(
    100,
    Math.max(0, ((value - 25) / (55 - 25)) * 100)
  );
  const strokeDashoffset =
    circumference - circumference * (percentage / 100) * (angle / 360);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="135" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.card}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * -(1 - angle / 360)}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.primary}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.gaugeTextContainer}>
        <Text style={styles.gaugeValue}>{value}</Text>
        <Text style={styles.gaugeLabel}>{VO2MAX_DATA.level}</Text>
      </View>
    </View>
  );
};

// --- 메인 컴포넌트 ---
export default function Vo2maxDetailsScreen() {
  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="VO2Max (심폐 건강)" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <FitnessLevelGauge
              value={VO2MAX_DATA.value}
              levels={VO2MAX_DATA.levels}
            />
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>피트니스 연령</Text>
                <Text style={styles.summaryValue}>
                  {VO2MAX_DATA.fitnessAge}세
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>동년배 비교</Text>
                <Text style={styles.summaryValue}>
                  상위 {VO2MAX_DATA.percentile}%
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>장기 트렌드 (지난 6개월)</Text>
            <LineChart
              data={{
                labels: ["3월", "4월", "5월", "6월", "7월", "8월"],
                datasets: [{ data: VO2MAX_DATA.trend }],
              }}
              width={Dimensions.get("window").width - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>VO2Max란?</Text>
            <Text style={styles.descriptionText}>
              VO2Max는 운동 중 신체가 사용할 수 있는 최대 산소량을 나타내는
              지표로, 심폐지구력과 전반적인 건강 상태를 보여주는 중요한
              척도입니다.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>점수 향상시키기</Text>
            <View style={styles.tipRow}>
              <FontAwesome5 name="running" color={COLORS.primary} size={16} />
              <Text style={styles.descriptionText}>
                고강도 인터벌 트레이닝(HIIT)은 VO2Max를 높이는 가장 효과적인
                방법 중 하나입니다.
              </Text>
            </View>
            <View style={styles.tipRow}>
              <FontAwesome5
                name="weight-hanging"
                color={COLORS.primary}
                size={16}
              />
              <Text style={styles.descriptionText}>
                꾸준한 유산소 운동과 근력 운동을 병행하여 전반적인 체력을
                향상시키세요.
              </Text>
            </View>
          </View>
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  gaugeTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeValue: { color: "white", fontSize: 64, fontWeight: "bold" },
  gaugeLabel: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: COLORS.gridLine,
    paddingTop: 20,
    marginTop: 20,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { color: "white", fontSize: 22, fontWeight: "bold" },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
  fitnessAgeText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  descriptionText: {
    color: COLORS.subText,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
});
