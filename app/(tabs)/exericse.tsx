import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

// 운동 기록 아이템 컴포넌트
const ExerciseLogItem = ({
  icon,
  title,
  details,
}: {
  icon: React.ComponentProps<typeof FontAwesome5>["name"];
  title: string;
  details: string;
}) => (
  <View style={styles.logItem}>
    <View style={styles.logIconContainer}>
      <FontAwesome5 name={icon} size={20} color="white" />
    </View>
    <View style={styles.logTextContainer}>
      <Text style={styles.logTitle}>{title}</Text>
      <Text style={styles.logDetails}>{details}</Text>
    </View>
  </View>
);

// 날짜별 기록 그룹 컴포넌트
const DailyLogGroup = ({
  date,
  children,
}: {
  date: string;
  children: React.ReactNode;
}) => (
  <View style={styles.logGroup}>
    <Text style={styles.logDateHeader}>{date}</Text>
    {children}
  </View>
);

export default function ExerciseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>운동 기록</Text>
        </View>

        <DailyLogGroup date="2025년 8월 4일">
          <ExerciseLogItem
            icon="running"
            title="공원 조깅"
            details="5.2 km / 35분"
          />
        </DailyLogGroup>

        <DailyLogGroup date="2025년 8월 3일">
          <ExerciseLogItem
            icon="dumbbell"
            title="전신 근력 운동"
            details="50분 / 450 Kcal"
          />
          <ExerciseLogItem
            icon="spa"
            title="요가 클래스"
            details="60분 / 180 Kcal"
          />
        </DailyLogGroup>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#EAEAEA",
    fontSize: 34,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  logGroup: {
    marginBottom: 24,
  },
  logDateHeader: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  logIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2A2A2A", // 아이콘 배경을 좀 더 차분하게
    justifyContent: "center",
    alignItems: "center",
  },
  logTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  logTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  logDetails: {
    color: "#8E8E93",
    fontSize: 14,
    marginTop: 4,
  },
});
