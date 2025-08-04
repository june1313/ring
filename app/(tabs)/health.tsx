import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// GlassCard 스타일을 HealthMetricCard에 적용합니다.
const HealthMetricCard = ({
  icon,
  name,
  value,
  unit,
}: {
  icon: React.ComponentProps<typeof FontAwesome5>["name"];
  name: string;
  value: string;
  unit: string;
}) => (
  <View style={styles.cardContainer}>
    <BlurView intensity={40} tint="dark" style={styles.metricCard}>
      <FontAwesome5 name={icon} size={24} color="#A5C9FF" />
      <Text style={styles.metricName}>{name}</Text>
      <Text style={styles.metricValue}>
        {value} <Text style={styles.metricUnit}>{unit}</Text>
      </Text>
    </BlurView>
  </View>
);

export default function HealthScreen() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>건강 지표</Text>
          </View>
          <View style={styles.grid}>
            <HealthMetricCard
              icon="heartbeat"
              name="심박수"
              value="78"
              unit="bpm"
            />
            <HealthMetricCard
              icon="lungs"
              name="혈중 산소"
              value="98"
              unit="%"
            />
            <HealthMetricCard
              icon="brain"
              name="스트레스"
              value="32"
              unit="(낮음)"
            />
            <HealthMetricCard
              icon="temperature-high"
              name="체온"
              value="36.5"
              unit="°C"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  header: {
    padding: 24,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "SpaceMono", // 폰트 적용
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16, // 좌우 패딩 조정
  },
  cardContainer: {
    width: "50%", // 카드가 절반의 너비를 차지하도록
    padding: 8, // 카드 사이의 간격
  },
  metricCard: {
    padding: 20,
    borderRadius: 24, // 홈 화면과 동일한 값
    overflow: "hidden",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    alignItems: "flex-start", // 아이템들을 왼쪽 정렬
    width: "100%",
  },
  metricName: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 12,
    fontFamily: "SpaceMono",
  },
  metricValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
    fontFamily: "SpaceMono",
  },
  metricUnit: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#9CA3AF",
  },
});
