import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import ProDateSelector from "./ProDateSelector";
import { SleepCard, MetricCard } from "./ProCardComponents";
import { CardDataItem, COLORS } from "./types";

export default function ProModeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // [수정] cardData에 누락된 모든 지표 추가
  const cardData = [
    {
      key: "sleep",
      type: "full",
      component: SleepCard,
      props: {
        icon: "moon",
        title: "수면",
        color: COLORS.sleep,
        href: "/sleep-details",
      },
    },
    [
      {
        key: "exercise",
        type: "half",
        component: MetricCard,
        props: {
          icon: "running",
          title: "운동",
          value: "450",
          unit: "Kcal",
          status: "목표 달성",
          color: COLORS.exercise,
          href: "/exercise-details",
        },
      },
      {
        key: "hr",
        type: "half",
        component: MetricCard,
        props: {
          icon: "heartbeat",
          title: "심박수",
          value: "68",
          unit: "bpm",
          status: "안정",
          color: COLORS.hr,
          href: "/hr-details",
        },
      },
    ],
    [
      {
        key: "spo2",
        type: "half",
        component: MetricCard,
        props: {
          icon: "tint",
          title: "SpO2",
          value: "98",
          unit: "%",
          status: "좋음",
          color: COLORS.spo2,
          href: "/spo2-details",
        },
      },
      {
        key: "stress",
        type: "half",
        component: MetricCard,
        props: {
          icon: "brain",
          title: "스트레스",
          value: "25",
          unit: "낮음",
          status: "안정",
          color: COLORS.stress,
          href: "/stress-details",
        },
      },
    ],
    [
      {
        key: "glucose",
        type: "half",
        component: MetricCard,
        props: {
          iconProvider: "MaterialCommunityIcons",
          icon: "water-percent",
          title: "혈당",
          value: "95",
          unit: "mg/dL",
          status: "정상",
          color: COLORS.glucose,
          href: "/glucose-details",
        },
      },
      {
        key: "hrv",
        type: "half",
        component: MetricCard,
        props: {
          icon: "wave-square",
          title: "HRV",
          value: "58",
          unit: "ms",
          status: "좋음",
          color: COLORS.hrv,
          href: "/hrv-details", // 상세 페이지 링크 (추후 구현)
        },
      },
    ],
    [
      {
        key: "temp",
        type: "half",
        component: MetricCard,
        props: {
          icon: "thermometer-half",
          title: "온도",
          value: "36.6",
          unit: "°C",
          status: "정상",
          color: COLORS.temp,
          href: "/temp-details", // 상세 페이지 링크 (추후 구현)
        },
      },
      {
        key: "vo2max",
        type: "half",
        component: MetricCard,
        props: {
          icon: "lungs",
          title: "VO2Max",
          value: "45",
          unit: "ml/kg/min",
          status: "매우 좋음",
          color: COLORS.vo2max,
          href: "/vo2max-details", // 상세 페이지 링크 (추후 구현)
        },
      },
    ],
  ];

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (Array.isArray(item)) {
      return (
        <View style={styles.halfRow}>
          <MotiView
            from={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 700, delay: index * 150 }}
            style={styles.halfContainer}
          >
            {item[0] && <MetricCard {...item[0].props} />}
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 700, delay: index * 150 }}
            style={styles.halfContainer}
          >
            {item[1] ? (
              <MetricCard {...item[1].props} />
            ) : (
              <View style={styles.halfContainer} />
            )}
          </MotiView>
        </View>
      );
    }
    const CardComponent = item.component;
    return (
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: index * 150 }}
        style={{ paddingHorizontal: 8, marginBottom: 16 }}
      >
        <CardComponent {...item.props} />
      </MotiView>
    );
  };

  return (
    <LinearGradient colors={["#10141C", "#0A0A0A"]} style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <ProDateSelector
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        }
        data={cardData}
        renderItem={renderItem}
        keyExtractor={(item) => (Array.isArray(item) ? item[0].key : item.key)}
        contentContainerStyle={styles.scrollContent}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  halfRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfContainer: {
    width: "50%",
    paddingHorizontal: 8,
  },
});
