import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather, AntDesign } from "@expo/vector-icons";

// JCRing 앱의 핵심인 블러 카드 컴포넌트
const GlassCard = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => (
  <BlurView intensity={40} tint="dark" style={[styles.card, style]}>
    {children}
  </BlurView>
);

// 날짜 선택 컴포넌트
const DateScroller = () => (
  <View style={styles.dateScroller}>
    <Text style={styles.dateText}>월요일, 07/24</Text>
    <Text style={[styles.dateText, styles.activeDate]}>화요일, 07/25</Text>
    <Text style={styles.dateText}>수요일, 07/26</Text>
  </View>
);

// 수면 그래프 시뮬레이션
const SleepChart = () => (
  <View style={styles.sleepChartContainer}>
    {Array.from({ length: 40 }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.sleepBar,
          {
            height: 10 + Math.random() * 25,
            opacity: 0.5 + Math.random() * 0.5,
          },
        ]}
      />
    ))}
  </View>
);

export default function HomeScreen() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      }} // 멋진 배경 이미지
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <Text style={styles.logo}>JCRing</Text>
            <View style={styles.headerIcons}>
              <Feather name="refresh-cw" size={22} color="white" />
              <AntDesign
                name="plus"
                size={26}
                color="white"
                style={{ marginLeft: 20 }}
              />
            </View>
          </View>

          {/* 날짜 스크롤러 */}
          <DateScroller />

          {/* 건강 지수 카드 */}
          <GlassCard>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.cardTitle}>건강 지수</Text>
              <Feather name="chevron-right" size={22} color="#A5C9FF" />
            </View>
            <Text
              style={{
                color: "#A5C9FF",
                fontSize: 18,
                marginTop: 10,
                fontFamily: "SpaceMono",
              }}
            >
              좋음
            </Text>
            {/* 여기에 그래프 이미지를 넣거나, 그래프 라이브러리를 사용합니다. */}
          </GlassCard>

          {/* 수면 카드 */}
          <GlassCard>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.cardTitle}>수면</Text>
              <Feather name="chevron-right" size={22} color="#A5C9FF" />
            </View>
            <Text style={styles.hugeScore}>88</Text>
            <Text
              style={{
                color: "#A5C9FF",
                alignSelf: "center",
                marginBottom: 20,
                fontFamily: "SpaceMono",
              }}
            >
              환상적
            </Text>
            <SleepChart />
            <View style={styles.sleepMetrics}>
              <Text style={styles.metricText}>7h 24m</Text>
              <Text style={styles.metricText}>68 bpm</Text>
              <Text style={styles.metricText}>97 %</Text>
            </View>
          </GlassCard>

          {/* 운동 카드 */}
          <GlassCard style={{ alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={styles.cardTitle}>운동</Text>
              <Feather name="chevron-right" size={22} color="#A5C9FF" />
            </View>
            {/* 운동 점수 링 시뮬레이션 */}
            <View style={styles.ringContainer}>
              <View style={styles.outerRing}>
                <View style={styles.innerRing}>
                  <Text style={styles.hugeScore}>86</Text>
                </View>
              </View>
            </View>
          </GlassCard>
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
    backgroundColor: "rgba(0,0,0,0.6)", // 배경 위에 어두운 오버레이를 추가하여 가독성 확보
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    color: "white",
    fontSize: 24,
    fontFamily: "SpaceMono", // 적용된 폰트
  },
  headerIcons: {
    flexDirection: "row",
  },
  dateScroller: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateText: {
    color: "#929292",
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  activeDate: {
    color: "white",
    fontWeight: "bold",
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  hugeScore: {
    color: "white",
    fontSize: 80,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
    fontFamily: "SpaceMono",
  },
  sleepChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 40,
  },
  sleepBar: {
    width: 4,
    backgroundColor: "white",
    borderRadius: 2,
  },
  sleepMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  metricText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SpaceMono",
  },
  ringContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(28, 28, 30, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  innerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
