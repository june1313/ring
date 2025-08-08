import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import { styles as commonStyles, COLORS } from "@/styles/sleep-details-styles";

// --- 타입 정의 ---
type SleepStage = "awake" | "rem" | "light" | "deep";

// --- 데이터 (모든 정보를 포함하도록 확장) ---
const DAILY_DATA = {
  score: 88,
  rating: "환상적",
  stars: 4.5,
  insight:
    "규칙적인 수면 습관을 유지하고, 수면 환경을 최적화하며, 잠자기 전에 과도한 흥분이나 격렬한 운동을 피하세요.",
  totalTime: { h: 7, m: 19 },
  timeInBed: { h: 7, m: 24 },
  timeInBedQuality: "좋음",
  totalTimeQuality: "최고",
  qualityFactors: [
    { label: "총 수면 시간", value: 95, color: COLORS.light },
    { label: "깊은 수면", value: 90, color: COLORS.deep },
    { label: "REM 수면", value: 85, color: COLORS.rem },
    { label: "수면 잠복기", value: 80, color: COLORS.awake },
  ],
  timeline: {
    start: "22:23",
    end: "05:27",
    data: Array.from({ length: 8 * 12 + 1 }, (_, i) => ({
      stage: (["awake", "rem", "light", "deep"] as SleepStage[])[
        Math.floor(Math.random() * 4)
      ],
      time: new Date(
        new Date("2025-08-07T22:23:00").getTime() + i * 5 * 60000
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    })),
  },
  hr: { avg: "58 bpm", min: "54 bpm", dipTime: "02:30" },
  spo2: { avg: "97%", min: "95%" },
  hrv: { avg: "62 ms", max: "75 ms" },
  naps: {
    duration: "25분",
    insight: "심박수가 안정되며 효과적인 재충전이 이루어졌습니다.",
    timeline: [75, 72, 68, 65, 64, 65],
  },
};

// --- 헬퍼 컴포넌트들 ---
const StarRating = ({ rating }: { rating: number }) => (
  <View style={styles.starContainer}>
    {Array.from({ length: 5 }).map((_, i) => {
      if (rating >= i + 1)
        return (
          <FontAwesome5
            key={i}
            name="star"
            solid
            color="#FFD700"
            size={16}
            style={{ marginRight: 4 }}
          />
        );
      if (rating > i)
        return (
          <FontAwesome5
            key={i}
            name="star-half-alt"
            solid
            color="#FFD700"
            size={16}
            style={{ marginRight: 4 }}
          />
        );
      return (
        <FontAwesome5
          key={i}
          name="star"
          color="#555"
          size={16}
          style={{ marginRight: 4 }}
        />
      );
    })}
  </View>
);
const Legend = () => (
  <View style={styles.legendContainer}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.awake }]} />
      <Text style={styles.legendText}>깨어 있음</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.rem }]} />
      <Text style={styles.legendText}>REM</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.light }]} />
      <Text style={styles.legendText}>얕은 수면</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.deep }]} />
      <Text style={styles.legendText}>깊은 수면</Text>
    </View>
  </View>
);
const MetricSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);
const MetricRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);
const MetricDuo = ({
  label1,
  value1,
  label2,
  value2,
}: {
  label1: string;
  value1: string;
  label2: string;
  value2: string;
}) => (
  <View style={styles.duoContainer}>
    <View style={styles.duoItem}>
      <Text style={styles.metricValueSm}>{value1}</Text>
      <Text style={styles.metricLabel}>{label1}</Text>
    </View>
    <View style={styles.duoItem}>
      <Text style={styles.metricValueSm}>{value2}</Text>
      <Text style={styles.metricLabel}>{label2}</Text>
    </View>
  </View>
);
const ProgressRing = ({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) => {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  return (
    <Svg
      height={radius * 2}
      width={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
    >
      <G rotation="-90" origin={`${radius}, ${radius}`}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};
const SleepQualityFactors = ({
  factors,
}: {
  factors: typeof DAILY_DATA.qualityFactors;
}) => (
  <MetricSection title="수면 점수 기여도">
    {factors.map((factor) => (
      <View key={factor.label} style={styles.factorRow}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <ProgressRing percentage={factor.value} color={factor.color} />
          <Text style={styles.factorLabel}>{factor.label}</Text>
        </View>
        <Text style={styles.factorValue}>{factor.value}</Text>
      </View>
    ))}
  </MetricSection>
);
const VerticalBarHypnogram = ({
  timeline,
  onScrub,
}: {
  timeline: typeof DAILY_DATA.timeline;
  onScrub: (data: any) => void;
}) => {
  const CHART_HEIGHT = 100;
  const BAR_WIDTH = 3;
  const BAR_MARGIN = 1;
  const chartWidth = timeline.data.length * (BAR_WIDTH + BAR_MARGIN);
  const STAGE_HEIGHTS = { awake: 10, rem: 40, light: 70, deep: 100 };
  return (
    <View style={{ height: CHART_HEIGHT + 40 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: chartWidth }}
      >
        <View style={styles.hypnogramChart}>
          {timeline.data.map((segment, index) => {
            const barHeight = STAGE_HEIGHTS[segment.stage];
            return (
              <View
                key={index}
                style={[
                  styles.hypnoBar,
                  { height: barHeight, backgroundColor: COLORS[segment.stage] },
                ]}
              />
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.timeLabelContainer}>
        <Text style={styles.timeLabel}>{timeline.start}</Text>
        <Text style={styles.timeLabel}>{timeline.end}</Text>
      </View>
    </View>
  );
};

// --- 최종 '일일' 뷰 ---
export default function DailyView() {
  const [scrubData, setScrubData] = useState<{
    stage: string;
    time: string;
  } | null>(null);
  return (
    <>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreSubtitle}>수면 점수</Text>
        <Text style={styles.scoreValue}>
          {DAILY_DATA.score}{" "}
          <Text style={styles.scoreLabel}>{DAILY_DATA.rating}</Text>
        </Text>
        <StarRating rating={DAILY_DATA.stars} />
        <Text style={styles.insightText}>{DAILY_DATA.insight}</Text>
      </View>

      <SleepQualityFactors factors={DAILY_DATA.qualityFactors} />

      <View style={styles.primaryMetricsContainer}>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>수면 시간</Text>
          <Text style={styles.primaryValue}>
            {DAILY_DATA.totalTime.h}
            <Text style={styles.primaryUnit}>h</Text> {DAILY_DATA.totalTime.m}
            <Text style={styles.primaryUnit}>m</Text>
          </Text>
          <View style={[styles.qualityBadge, { backgroundColor: "#E74C3C" }]}>
            <Text style={styles.badgeText}>{DAILY_DATA.totalTimeQuality}</Text>
          </View>
        </View>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>침대에서 보낸 시간</Text>
          <Text style={styles.primaryValue}>
            {DAILY_DATA.timeInBed.h}
            <Text style={styles.primaryUnit}>h</Text> {DAILY_DATA.timeInBed.m}
            <Text style={styles.primaryUnit}>m</Text>
          </Text>
          <View style={[styles.qualityBadge, { backgroundColor: "#50D6A3" }]}>
            <Text style={styles.badgeText}>{DAILY_DATA.timeInBedQuality}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {scrubData
              ? `${scrubData.stage.toUpperCase()} 수면・${scrubData.time}`
              : `수면 단계`}
          </Text>
          <Text style={styles.subText}>총 수면 목표: 8h 0m</Text>
        </View>
        <VerticalBarHypnogram
          timeline={DAILY_DATA.timeline}
          onScrub={setScrubData}
        />
        <Legend />
      </View>

      <MetricSection title="심박수">
        <MetricDuo
          label1="평균"
          value1={DAILY_DATA.hr.avg}
          label2="최저"
          value2={DAILY_DATA.hr.min}
        />
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitleSm}>심박수 안정</Text>
          <View style={styles.timelineBarContainer}>
            <View style={styles.timelineBar} />
            <FontAwesome5
              name="moon"
              size={16}
              color={COLORS.deep}
              style={[styles.timelineIcon, { left: "30%" }]}
            />
          </View>
          <Text style={styles.insightText}>
            수면 전반부({DAILY_DATA.hr.dipTime})에 심박수가 가장 안정되어,
            효율적인 회복이 시작되었습니다.
          </Text>
        </View>
      </MetricSection>

      <MetricSection title="신체적인 낮잠">
        <View style={styles.napContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metricValueSm}>{DAILY_DATA.naps.duration}</Text>
            <Text style={styles.insightText}>{DAILY_DATA.naps.insight}</Text>
          </View>
          <View>
            <LineChart
              data={{
                datasets: [
                  { data: DAILY_DATA.naps.timeline, strokeWidth: 2.5 },
                ],
              }}
              width={120}
              height={60}
              chartConfig={{
                color: () => COLORS.light,
                backgroundGradientFrom: COLORS.card,
                backgroundGradientTo: COLORS.card,
                propsForDots: { r: "0" },
              }}
              withShadow={false}
              withInnerLines={false}
              withOuterLines={false}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              bezier
              style={{ padding: 0, margin: 0 }}
            />
          </View>
        </View>
      </MetricSection>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  scoreSubtitle: { color: COLORS.subText, fontSize: 16, marginBottom: 4 },
  scoreValue: { color: COLORS.text, fontSize: 48, fontWeight: "bold" },
  scoreLabel: { fontSize: 18, fontWeight: "normal", color: COLORS.subText },
  starContainer: { flexDirection: "row", gap: 6, marginVertical: 12 },
  insightText: { color: COLORS.subText, fontSize: 15, lineHeight: 22 },
  primaryMetricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  primaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    flex: 1,
    position: "relative",
  },
  primaryLabel: { color: COLORS.subText, fontSize: 15, marginBottom: 8 },
  primaryValue: { color: COLORS.text, fontSize: 24, fontWeight: "bold" },
  primaryUnit: { fontSize: 16, color: COLORS.subText },
  qualityBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: "white", fontSize: 12, fontWeight: "bold" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: "bold" },
  sectionTitleSm: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subText: { color: COLORS.subText, fontSize: 14 },
  hypnogramChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    gap: 1,
  },
  hypnoBar: { width: 3, borderRadius: 2 },
  timeLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  timeLabel: { color: COLORS.subText, fontSize: 12 },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { color: COLORS.subText, fontSize: 12 },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 14,
  },
  metricLabel: { color: COLORS.subText, fontSize: 15 },
  metricValue: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  metricValueSm: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  duoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
  },
  duoItem: { alignItems: "center" },
  detailSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  timelineBarContainer: {
    height: 20,
    justifyContent: "center",
    marginBottom: 8,
  },
  timelineBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  timelineIcon: { position: "absolute" },
  napContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  factorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  factorLabel: { color: COLORS.text, fontSize: 15, marginLeft: 12 },
  factorValue: { color: COLORS.text, fontSize: 16, fontWeight: "bold" },
});
