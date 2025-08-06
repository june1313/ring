import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

const COLORS = {
  sleep: "#8A9BFF",
  deep: "#5A9DFF",
  light: "#A5C9FF",
  rem: "#D7BFFF",
  awake: "#FFB86B",
};

// 상단 요약 카드
const SummaryCard = () => (
  <MotiView
    from={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "timing", duration: 500 }}
    style={styles.summaryCard}
  >
    <Text style={styles.score}>88</Text>
    <Text style={styles.scoreLabel}>환상적</Text>
    <Text style={styles.summaryText}>
      규칙적인 수면 습관을 유지하고, 잠자리에 들기 전 과도한 활동을 피하세요.
      편안한 환경은 정신적, 신체적 회복을 돕습니다.
    </Text>
  </MotiView>
);

// 수면 단계 상세 정보 카드
const SleepStageCard = () => (
  <MotiView
    from={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "timing", duration: 500, delay: 150 }}
    style={styles.detailSection}
  >
    <Text style={styles.sectionTitle}>수면 단계</Text>
    <View style={styles.stageTimeline}>
      {Array.from({ length: 40 }).map((_, i) => {
        const rand = Math.random();
        let color = COLORS.light;
        if (rand > 0.8) color = COLORS.deep;
        else if (rand < 0.2) color = COLORS.rem;
        return (
          <View
            key={i}
            style={[
              styles.stageBar,
              { height: 15 + Math.random() * 40, backgroundColor: color },
            ]}
          />
        );
      })}
    </View>
    <View style={styles.stageLegend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS.deep }]} />
        <Text style={styles.legendText}>깊은 수면</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS.light }]} />
        <Text style={styles.legendText}>얕은 수면</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS.rem }]} />
        <Text style={styles.legendText}>REM 수면</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS.awake }]} />
        <Text style={styles.legendText}>깨어있음</Text>
      </View>
    </View>
  </MotiView>
);

// 상세 지표 행 컴포넌트
const DetailRow = ({ label, value, unit, progress }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: progress }]} />
    </View>
    <Text style={styles.detailValue}>
      {value}
      {unit}
    </Text>
  </View>
);

export default function SleepDetailsScreen() {
  return (
    <LinearGradient colors={["#10141C", "#0A0A0A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color="#EAEAEA" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>수면</Text>
          <TouchableOpacity>
            <Feather name="share" size={24} color="#EAEAEA" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <SummaryCard />
          <SleepStageCard />

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 500, delay: 300 }}
            style={styles.detailSection}
          >
            <Text style={styles.sectionTitle}>평균 수면 개요</Text>
            <DetailRow
              label="수면 시간"
              value="7h 19m"
              unit=""
              progress="80%"
            />
            <DetailRow
              label="침대에서 보낸 시간"
              value="7h 24m"
              unit=""
              progress="85%"
            />
            <DetailRow label="수면 효율" value="92" unit="%" progress="92%" />
            <DetailRow
              label="평균 심박수"
              value="68"
              unit=" Bpm"
              progress="68%"
            />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: "#EAEAEA", fontSize: 20, fontWeight: "bold" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  summaryCard: {
    backgroundColor: "#161B22",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  score: {
    fontFamily: "SpaceMono",
    fontSize: 80,
    color: COLORS.sleep,
    fontWeight: "bold",
    textShadowColor: `${COLORS.sleep}50`,
    textShadowRadius: 15,
  },
  scoreLabel: {
    fontSize: 18,
    color: COLORS.sleep,
    marginTop: -10,
    marginBottom: 20,
  },
  summaryText: {
    color: "#BDBDBD",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  detailSection: {
    backgroundColor: "#161B22",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stageTimeline: {
    flexDirection: "row",
    height: 80,
    alignItems: "flex-end",
  },
  stageBar: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  stageLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    color: "#BDBDBD",
    fontSize: 13,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  detailLabel: {
    color: "#BDBDBD",
    fontSize: 16,
    width: "45%",
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 4,
    marginRight: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: COLORS.sleep,
  },
  detailValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    minWidth: 70,
    textAlign: "right",
    fontFamily: "SpaceMono",
  },
});
