import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, Href } from "expo-router";

// --- 타입 정의 ---
type CardProps = {
  icon: any;
  title: string;
  value?: string;
  unit?: string;
  description?: string;
  href: Href;
  iconProvider?: "FontAwesome5" | "MaterialCommunityIcons" | "Feather";
};

// --- 신규 컴포넌트들 ---

// 날짜 스크롤러
const DateSelector = ({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}) => {
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (3 - i)); // 오늘 기준 과거 3일, 미래 3일
    return date;
  });

  const getDayLabel = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "오늘";
    return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelectorContainer}
        // 오늘 날짜가 중앙에 오도록 초기 스크롤 위치 설정 (선택사항)
        contentOffset={{ x: 150, y: 0 }}
      >
        {dates.map((date) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const label = getDayLabel(date);
          const dateString = `${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={styles.dateButton}
              onPress={() => onDateSelect(date)}
            >
              <Text
                style={[styles.dateText, isSelected && styles.selectedDateText]}
              >
                {label}, {dateString}
              </Text>
              {isSelected && <View style={styles.selectedUnderline} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// 전체 너비 수면 카드
const SleepCard = ({ icon, title, href }: CardProps) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name={icon} size={20} color="#8A9BFF" />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#8E8E93" />
      </View>
      <View style={styles.sleepCardContent}>
        <Text style={styles.sleepScore}>88</Text>
        <Text style={styles.sleepQuality}>환상적</Text>
        <View style={styles.timelineContainer}>
          <Text style={styles.timeLabel}>22:23</Text>
          <View style={styles.timelineGraph}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.timelineBar,
                  {
                    height: 10 + Math.random() * 25,
                    opacity: 0.5 + Math.random() * 0.5,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.timeLabel}>05:27</Text>
        </View>
        <View style={styles.sleepMetricsContainer}>
          <View style={styles.sleepMetric}>
            <Text style={styles.largeValue}>
              7<Text style={styles.unit}>h</Text> 24
              <Text style={styles.unit}>m</Text>
            </Text>
            <Text style={styles.subValue}>시간</Text>
          </View>
          <View style={styles.sleepMetric}>
            <Text style={styles.largeValue}>
              68<Text style={styles.unit}>bpm</Text>
            </Text>
            <Text style={styles.subValue}>HR</Text>
          </View>
          <View style={styles.sleepMetric}>
            <Text style={styles.largeValue}>
              97<Text style={styles.unit}>%</Text>
            </Text>
            <Text style={styles.subValue}>SpO2</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </Link>
);

// 절반 너비 지표 카드
const MetricCard = ({
  icon,
  title,
  value,
  unit,
  href,
  iconProvider,
}: CardProps) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.halfCard}>
      <View style={styles.cardHeader}>
        {iconProvider === "MaterialCommunityIcons" ? (
          <MaterialCommunityIcons name={icon} size={20} color="#5A9DFF" />
        ) : (
          <FontAwesome5 name={icon} size={20} color="#5A9DFF" />
        )}
        <Text style={styles.cardTitleSm}>{title}</Text>
      </View>
      <Text style={styles.mediumValue}>
        {value}
        <Text style={styles.unitSm}> {unit}</Text>
      </Text>
    </TouchableOpacity>
  </Link>
);

// --- 메인 홈 화면 컴포넌트 ---
export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const cardData = [
    {
      key: "sleep",
      type: "full",
      component: SleepCard,
      props: { icon: "moon", title: "수면", href: "/health" },
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
          href: "/exericse",
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
          href: "/health",
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
          href: "/health",
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
          href: "/health",
        },
      },
    ],
    [
      {
        key: "hrv",
        type: "half",
        component: MetricCard,
        props: {
          icon: "heart-multiple",
          title: "HRV",
          value: "52",
          unit: "ms",
          href: "/health",
          iconProvider: "MaterialCommunityIcons",
        },
      },
      {
        key: "glucose",
        type: "half",
        component: MetricCard,
        props: {
          icon: "water-percent",
          title: "혈당",
          value: "95",
          unit: "mg/dL",
          href: "/health",
          iconProvider: "MaterialCommunityIcons",
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
          href: "/health",
        },
      },
      {
        key: "vo2max",
        type: "half",
        component: MetricCard,
        props: {
          icon: "run-fast",
          title: "Vo2Max",
          value: "45",
          unit: "ml/kg/min",
          href: "/health",
          iconProvider: "MaterialCommunityIcons",
        },
      },
    ],
  ];

  const renderItem = ({ item }) => {
    if (Array.isArray(item)) {
      return (
        <View style={styles.halfRow}>
          <View style={styles.halfContainer}>
            <MetricCard {...item[0].props} />
          </View>
          <View style={styles.halfContainer}>
            {item[1] ? <MetricCard {...item[1].props} /> : null}
          </View>
        </View>
      );
    }
    const CardComponent = item.component;
    return (
      <View style={{ paddingHorizontal: 8, marginBottom: 16 }}>
        <CardComponent {...item.props} />
      </View>
    );
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986",
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>JCRing</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={{ marginRight: 20 }}>
              <Feather name="refresh-cw" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="plus" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <FlatList
          data={cardData}
          renderItem={renderItem}
          keyExtractor={(item) =>
            Array.isArray(item) ? item[0].key : item.key
          }
          contentContainerStyle={styles.scrollContent}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, backgroundColor: "rgba(10, 10, 10, 0.85)" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: { color: "#EAEAEA", fontSize: 28, fontWeight: "bold" },
  dateSelectorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  dateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  dateText: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedDateText: {
    color: "white",
  },
  selectedUnderline: {
    height: 3,
    width: "60%",
    backgroundColor: "white",
    marginTop: 6,
    alignSelf: "center",
  },
  scrollContent: { paddingBottom: 120 },
  card: {
    backgroundColor: "rgba(28, 28, 30, 0.9)",
    borderRadius: 20,
    padding: 20,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
  },
  halfRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfContainer: { width: "50%", paddingHorizontal: 8 },
  halfCard: {
    backgroundColor: "rgba(28, 28, 30, 0.9)",
    borderRadius: 20,
    padding: 20,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    height: 160,
    justifyContent: "flex-start",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  cardTitleSm: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  sleepCardContent: { alignItems: "center", paddingTop: 16 },
  sleepScore: {
    color: "white",
    fontSize: 64,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  sleepQuality: { color: "#A5C9FF", fontSize: 16, marginBottom: 20 },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  timeLabel: { color: "#8E8E93", fontSize: 12 },
  timelineGraph: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 40,
    marginHorizontal: 10,
  },
  timelineBar: { width: 3, backgroundColor: "white", borderRadius: 2 },
  sleepMetricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 24,
  },
  sleepMetric: { alignItems: "center" },
  largeValue: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  unit: { fontSize: 16, color: "#8E8E93", fontWeight: "normal", marginLeft: 4 },
  subValue: { color: "#8E8E93", fontSize: 14, marginTop: 4 },
  mediumValue: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
    marginTop: 10,
  },
  unitSm: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "normal",
    marginLeft: 2,
  },
});
