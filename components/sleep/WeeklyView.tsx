import React from "react";
import { View, Text } from "react-native";
import { styles, COLORS } from "@/styles/sleep-details-styles";
import { Legend } from "./SharedComponents";

const WEEKLY_DATA = {
  avgTime: { h: 7, m: 36 },
  dailyData: [
    { day: "월", total: 7.5, deep: 0.25, light: 0.5, rem: 0.2, awake: 0.05 },
    { day: "화", total: 6.8, deep: 0.2, light: 0.55, rem: 0.2, awake: 0.05 },
    { day: "수", total: 8.0, deep: 0.3, light: 0.45, rem: 0.2, awake: 0.05 },
    { day: "목", total: 7.2, deep: 0.22, light: 0.5, rem: 0.23, awake: 0.05 },
    { day: "금", total: 7.8, deep: 0.28, light: 0.48, rem: 0.2, awake: 0.04 },
    { day: "토", total: 8.5, deep: 0.35, light: 0.4, rem: 0.2, awake: 0.05 },
    { day: "일", total: 7.0, deep: 0.2, light: 0.5, rem: 0.25, awake: 0.05 },
  ],
  stageAvgs: {
    deep: "1h 37m",
    light: "3h 25m",
    rem: "1h 29m",
    awake: "0h 25m",
  },
};

export default function WeeklyView() {
  return (
    <>
      <Text style={styles.mainValueLg}>
        {WEEKLY_DATA.avgTime.h}
        <Text style={styles.mainUnitLg}>h</Text> {WEEKLY_DATA.avgTime.m}
        <Text style={styles.mainUnitLg}>m</Text>
      </Text>
      <Text style={styles.subText}>주간 평균 수면</Text>

      <View style={[styles.card, { paddingBottom: 0 }]}>
        <View style={styles.weeklyChartContainer}>
          {WEEKLY_DATA.dailyData.map((dayData, index) => (
            <View key={index} style={styles.weeklyBarWrapper}>
              <View style={[styles.stackedBar, { height: dayData.total * 18 }]}>
                <View
                  style={{ flex: dayData.awake, backgroundColor: COLORS.awake }}
                />
                <View
                  style={{ flex: dayData.rem, backgroundColor: COLORS.rem }}
                />
                <View
                  style={{ flex: dayData.light, backgroundColor: COLORS.light }}
                />
                <View
                  style={{ flex: dayData.deep, backgroundColor: COLORS.deep }}
                />
              </View>
              <Text style={styles.dayLabel}>{dayData.day}</Text>
            </View>
          ))}
        </View>
      </View>

      <Legend />

      <View style={styles.primaryMetricsContainer}>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>평균 심층 수면</Text>
          <Text style={styles.metricValueSm}>{WEEKLY_DATA.stageAvgs.deep}</Text>
        </View>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>평균 얕은 수면</Text>
          <Text style={styles.metricValueSm}>
            {WEEKLY_DATA.stageAvgs.light}
          </Text>
        </View>
      </View>
      <View style={styles.primaryMetricsContainer}>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>평균 렘수면</Text>
          <Text style={styles.metricValueSm}>{WEEKLY_DATA.stageAvgs.rem}</Text>
        </View>
        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>평균 각성 상태</Text>
          <Text style={styles.metricValueSm}>
            {WEEKLY_DATA.stageAvgs.awake}
          </Text>
        </View>
      </View>
    </>
  );
}
