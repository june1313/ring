import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- 타입 정의 추가 ---
type HealthMetric = {
  id: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  name: string;
  value: string;
  unit: string;
  range?: string;
  button?: string;
};

// 건강 지표 데이터 (타입 적용)
const healthMetrics: HealthMetric[] = [
  {
    id: "hr",
    icon: "heart-pulse",
    name: "HR",
    value: "68",
    unit: "bpm",
    range: "범위 50-99 bpm",
    button: "측정",
  },
  {
    id: "spo2",
    icon: "gas-cylinder",
    name: "SpO2",
    value: "98",
    unit: "%",
    button: "측정",
  },
  { id: "sleep", icon: "sleep", name: "수면", value: "7.8", unit: "시간" },
  { id: "hrv", icon: "heart-multiple", name: "HRV", value: "52", unit: "ms" },
  {
    id: "glucose",
    icon: "water",
    name: "혈당",
    value: "95",
    unit: "mg/dL",
    button: "AI 분석",
  },
  { id: "temp", icon: "thermometer", name: "온도", value: "36.6", unit: "°C" },
  { id: "pressure", icon: "gauge", name: "압력", value: "1012", unit: "hPa" },
  {
    id: "vo2max",
    icon: "run-fast",
    name: "Vo2Max",
    value: "45",
    unit: "ml/kg/min",
    button: "측정",
  },
];

// item에 타입 적용
const HealthListItem = ({ item }: { item: HealthMetric }) => (
  <TouchableOpacity style={styles.listItem}>
    <MaterialCommunityIcons
      name={item.icon}
      size={24}
      color="#5A9DFF"
      style={styles.icon}
    />
    <View style={styles.textContainer}>
      <Text style={styles.name}>{item.name}</Text>
      {item.range && <Text style={styles.range}>{item.range}</Text>}
    </View>
    <View style={styles.valueContainer}>
      <Text style={styles.value}>
        {item.value} <Text style={styles.unit}>{item.unit}</Text>
      </Text>
      {item.button && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{item.button}</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

export default function HealthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>건강</Text>
      </View>
      <FlatList
        data={healthMetrics}
        renderItem={({ item }) => <HealthListItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  headerTitle: {
    color: "#EAEAEA",
    fontSize: 34,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  icon: { width: 30 },
  textContainer: { flex: 1, marginLeft: 16 },
  name: { color: "white", fontSize: 18, fontWeight: "600" },
  range: { color: "#8E8E93", fontSize: 14, marginTop: 4 },
  valueContainer: { alignItems: "flex-end" },
  value: {
    color: "white",
    fontSize: 22,
    fontFamily: "SpaceMono",
    fontWeight: "bold",
  },
  unit: { color: "#8E8E93", fontSize: 16, fontWeight: "normal" },
  button: {
    backgroundColor: "#333333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  buttonText: { color: "#EAEAEA", fontSize: 12, fontWeight: "bold" },
});
