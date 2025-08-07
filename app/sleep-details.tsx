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

// --- 타입, 상수, 데이터 ---
const COLORS = {
  text: "#EAEAEA",
  subText: "#BDBDBD",
  card: "rgba(28, 28, 30, 0.8)",
  border: "rgba(255, 255, 255, 0.1)",
  background: "#050a19",
  awake: "#FFB86B",
  rem: "#D7BFFF",
  light: "#A5C9FF",
  deep: "#5A9DFF",
};
type Period = "일" | "주" | "월";

// --- 재사용 컴포넌트들 ---
const Header = ({
  period,
  setPeriod,
  date,
  setDate,
}: {
  period: Period;
  setPeriod: (p: Period) => void;
  date: Date;
  setDate: (d: Date) => void;
}) => {
  const changeDate = (amount: number) => {
    const newDate = new Date(date);
    const dayOrWeekOrMonth =
      period === "일" ? "Date" : period === "주" ? "Date" : "Month";
    const step = period === "주" ? 7 : 1;
    newDate[`set${dayOrWeekOrMonth}`](
      date[`get${dayOrWeekOrMonth}`]() + amount * step
    );
    setDate(newDate);
  };
  const formatDate = () => {
    if (period === "일")
      return date.toISOString().split("T")[0].replace(/-/g, "/");
    const start = new Date(date);
    const end = new Date(date);
    if (period === "주") {
      start.setDate(date.getDate() - date.getDay() + 1);
      end.setDate(date.getDate() + (7 - date.getDay()));
      return `${start.toISOString().slice(5, 10).replace("-", "/")} - ${end
        .toISOString()
        .slice(5, 10)
        .replace("-", "/")}`;
    }
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>수면</Text>
        <TouchableOpacity>
          <Feather name="share" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerMidRow}>
        {(["일", "주", "월"] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[
              styles.periodButton,
              period === p && styles.activePeriodButton,
            ]}
          >
            <Text
              style={[
                styles.periodText,
                period === p && styles.activePeriodText,
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.headerBottomRow}>
        <TouchableOpacity onPress={() => changeDate(-1)}>
          <Feather name="chevron-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate()}</Text>
        <TouchableOpacity onPress={() => changeDate(1)}>
          <Feather name="chevron-right" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MetricSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.card}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Feather name="info" size={16} color={COLORS.subText} />
      </TouchableOpacity>
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

// --- 탭별 뷰 컴포넌트 ---
const DailyView = () => {
  const stages = {
    awake: { value: 0.1, ideal_min: 0.05, ideal_max: 0.15 },
    rem: { value: 0.22, ideal_min: 0.2, ideal_max: 0.25 },
    light: { value: 0.48, ideal_min: 0.45, ideal_max: 0.55 },
    deep: { value: 0.2, ideal_min: 0.13, ideal_max: 0.23 },
  };
  const StageBar = ({
    label,
    color,
    data,
  }: {
    label: string;
    color: string;
    data: typeof stages.awake;
  }) => (
    <View style={styles.stageRow}>
      <Text style={styles.stageLabel}>{label}</Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.idealRange,
            {
              left: `${data.ideal_min * 100}%`,
              width: `${(data.ideal_max - data.ideal_min) * 100}%`,
            },
          ]}
        />
        <View
          style={[
            styles.actualBar,
            { width: `${data.value * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
  return (
    <>
      <View style={styles.primaryMetricsContainer}>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>수면 시간</Text>
          <Text style={styles.primaryValue}>
            7<Text style={styles.primaryUnit}>h</Text> 48
            <Text style={styles.primaryUnit}>m</Text>
          </Text>
        </View>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>침대에서 보낸 시간</Text>
          <Text style={styles.primaryValue}>
            8<Text style={styles.primaryUnit}>h</Text> 15
            <Text style={styles.primaryUnit}>m</Text>
          </Text>
        </View>
      </View>
      <MetricSection title="수면 단계 목표">
        <StageBar label="깨어 있음" color={COLORS.awake} data={stages.awake} />
        <StageBar label="REM" color={COLORS.rem} data={stages.rem} />
        <StageBar label="얕은 수면" color={COLORS.light} data={stages.light} />
        <StageBar label="깊은 수면" color={COLORS.deep} data={stages.deep} />
      </MetricSection>
      <MetricSection title="수면 개요">
        <MetricRow label="수면 효율" value="95%" />
        <MetricRow label="잠드는 시간" value="15분" />
      </MetricSection>
      <MetricSection title="심박수">
        <MetricDuo
          label1="평균"
          value1="58 bpm"
          label2="최저"
          value2="54 bpm"
        />
      </MetricSection>
      <MetricSection title="산소포화도">
        <MetricDuo label1="평균" value1="97%" label2="최저" value2="95%" />
      </MetricSection>
      <MetricSection title="심박변이도">
        <MetricDuo label1="평균" value1="62 ms" label2="최대" value2="75 ms" />
      </MetricSection>
    </>
  );
};

const WeeklyView = () => (
  <>
    <View style={styles.primaryMetricsContainer}>
      <View style={styles.primaryCard}>
        <Text style={styles.primaryLabel}>평균 수면 시간</Text>
        <Text style={styles.primaryValue}>
          7<Text style={styles.primaryUnit}>h</Text> 30
          <Text style={styles.primaryUnit}>m</Text>
        </Text>
      </View>
      <View style={styles.primaryCard}>
        <Text style={styles.primaryLabel}>평균 수면 점수</Text>
        <Text style={styles.primaryValue}>85</Text>
      </View>
    </View>
    <MetricSection title="평균 수면 개요">
      <MetricRow label="평균 수면 효율" value="92%" />
      <MetricRow label="평균 잠드는 시간" value="18분" />
    </MetricSection>
    <MetricSection title="수면 부채">
      <MetricDuo label1="평균" value1="-30m" label2="누적" value2="-3h 30m" />
    </MetricSection>
  </>
);

const MonthlyView = () => (
  <>
    <View style={styles.primaryMetricsContainer}>
      <View style={styles.primaryCard}>
        <Text style={styles.primaryLabel}>월간 평균 수면</Text>
        <Text style={styles.primaryValue}>
          7<Text style={styles.primaryUnit}>h</Text> 25
          <Text style={styles.primaryUnit}>m</Text>
        </Text>
      </View>
      <View style={styles.primaryCard}>
        <Text style={styles.primaryLabel}>월간 평균 점수</Text>
        <Text style={styles.primaryValue}>82</Text>
      </View>
    </View>
    <MetricSection title="월간 수면 개요">
      <MetricRow label="월간 평균 효율" value="91%" />
      <MetricRow label="월간 평균 잠드는 시간" value="20분" />
    </MetricSection>
    <MetricSection title="수면 부채">
      <MetricDuo label1="평균" value1="-35m" label2="누적" value2="-17h 30m" />
    </MetricSection>
  </>
);

// --- 메인 컴포넌트 ---
export default function SleepDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  const [date, setDate] = useState(new Date("2025-08-07"));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
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

// --- 전체 스타일시트 ---
const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  headerContainer: { paddingVertical: 12, marginBottom: 16 },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  headerTitle: { color: COLORS.text, fontSize: 32, fontWeight: "bold" },
  headerMidRow: {
    flexDirection: "row",
    backgroundColor: "rgba(128,128,128,0.2)",
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  periodButton: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  activePeriodButton: { backgroundColor: "rgba(255,255,255,0.9)" },
  periodText: { color: COLORS.subText, fontSize: 16, fontWeight: "bold" },
  activePeriodText: { color: "black" },
  headerBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  dateText: { color: COLORS.text, fontSize: 18, fontWeight: "600" },
  primaryMetricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  primaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    width: "48%",
  },
  primaryLabel: { color: COLORS.subText, fontSize: 15, marginBottom: 8 },
  primaryValue: { color: COLORS.text, fontSize: 28, fontWeight: "bold" },
  primaryUnit: { fontSize: 18, color: COLORS.subText },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stageRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  stageLabel: { color: COLORS.subText, fontSize: 15, width: "25%" },
  barContainer: { flex: 1, height: 24, justifyContent: "center" },
  idealRange: {
    backgroundColor: "rgba(128,128,128,0.2)",
    height: "100%",
    position: "absolute",
    borderRadius: 4,
  },
  actualBar: { height: 8, borderRadius: 4 },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
});
