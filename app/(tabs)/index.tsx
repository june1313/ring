import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, Href } from "expo-router";
import { Calendar, DateData } from "react-native-calendars";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

// --- 타입 정의 ---
type CardProps = {
  icon: any;
  label: string;
  value: string;
  unit: string;
  href: Href;
  description?: string;
  iconProvider?: "FontAwesome5" | "MaterialCommunity";
};

type CardDataItem = {
  key: string;
  props: CardProps;
};

// --- 단일 카드 컴포넌트로 통합 ---
const MetricCard = ({
  icon,
  label,
  value,
  unit,
  href,
  description,
  iconProvider = "FontAwesome5",
}: CardProps) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        {iconProvider === "MaterialCommunity" ? (
          <MaterialCommunityIcons name={icon} size={20} color="#5A9DFF" />
        ) : (
          <FontAwesome5 name={icon} size={20} color="#5A9DFF" />
        )}
        <Text style={styles.cardTitle}>{label}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.largeValue}>
          {value} <Text style={styles.unit}>{unit}</Text>
        </Text>
        {description && <Text style={styles.subValue}>{description}</Text>}
      </View>
    </TouchableOpacity>
  </Link>
);

// --- 메인 홈 화면 컴포넌트 ---
export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const initialCardData: CardDataItem[] = [
    {
      key: "sleep",
      props: {
        icon: "moon",
        label: "수면",
        value: "7.8",
        unit: "시간",
        description: "어젯밤 수면 점수는 85점입니다.",
        href: "/health",
      },
    },
    {
      key: "exercise",
      props: {
        icon: "running",
        label: "운동",
        value: "450",
        unit: "Kcal",
        description: "오늘 52분 동안 활동했습니다.",
        href: "/exericse",
      },
    },
    {
      key: "hr",
      props: {
        icon: "heartbeat",
        label: "심박수",
        value: "68",
        unit: "bpm",
        description: "안정 시 심박수",
        href: "/health",
      },
    },
    {
      key: "spo2",
      props: {
        icon: "tint",
        label: "SpO2",
        value: "98",
        unit: "%",
        description: "평균 혈중 산소 포화도",
        href: "/health",
      },
    },
    {
      key: "stress",
      props: {
        icon: "brain",
        label: "스트레스",
        value: "25",
        unit: "낮음",
        description: "현재 스트레스 수준",
        href: "/health",
      },
    },
  ];

  const [cardData, setCardData] = useState(initialCardData);

  const formattedDate = `${selectedDate.getFullYear()}.${(
    selectedDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${selectedDate.getDate().toString().padStart(2, "0")}`;

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<CardDataItem>) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            style={{ opacity: isActive ? 0.7 : 1, marginBottom: 16 }}
            onLongPress={drag}
            disabled={!isEditMode}
          >
            {isEditMode && (
              <View style={styles.dragHandle}>
                <Feather name="menu" size={24} color="#8E8E93" />
              </View>
            )}
            <MetricCard {...item.props} />
          </TouchableOpacity>
        </ScaleDecorator>
      );
    },
    [isEditMode]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Genie Ring</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setCalendarVisible(true)}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditMode(!isEditMode)}
            style={{ marginLeft: 16 }}
          >
            <Feather
              name={isEditMode ? "check-square" : "edit"}
              size={22}
              color={isEditMode ? "#5A9DFF" : "#8E8E93"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <DraggableFlatList
        data={cardData}
        onDragEnd={({ data }) => setCardData(data)}
        keyExtractor={(item: CardDataItem) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setCalendarVisible(false)}
        >
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day: DateData) => {
                setSelectedDate(new Date(day.dateString));
                setCalendarVisible(false);
              }}
              markedDates={{
                [selectedDate.toISOString().split("T")[0]]: {
                  selected: true,
                  selectedColor: "#5A9DFF",
                },
              }}
              theme={{
                backgroundColor: "#1C1C1E",
                calendarBackground: "#1C1C1E",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#5A9DFF",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#5A9DFF",
                dayTextColor: "#d9e1e8",
                textDisabledColor: "#333",
                monthTextColor: "white",
                arrowColor: "#5A9DFF",
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#EAEAEA",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  dateText: {
    color: "#8E8E93",
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  cardContent: {
    alignItems: "flex-start",
    paddingTop: 16,
  },
  largeValue: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  unit: {
    fontSize: 18,
    color: "#8E8E93",
    fontWeight: "normal",
    marginLeft: 4,
  },
  subValue: {
    color: "#8E8E93",
    fontSize: 15,
    marginTop: 6,
  },
  dragHandle: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  calendarContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 10,
    width: "90%",
    elevation: 5,
  },
});
