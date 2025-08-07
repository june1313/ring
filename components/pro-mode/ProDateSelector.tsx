import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  LayoutChangeEvent, // [추가] onLayout 이벤트 타입을 위해 import
} from "react-native";

export default function ProDateSelector({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}) {
  // [추가] ScrollView와 각 아이템의 위치를 참조하기 위한 ref
  const scrollRef = useRef<ScrollView>(null);
  const itemLayouts = useRef<{ [key: string]: { x: number; width: number } }>(
    {}
  );

  // [추가] 화면의 너비를 가져옴
  const { width: screenWidth } = Dimensions.get("window");

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (3 - i));
    return date;
  });

  const getDayLabel = (date: Date) => {
    const today = new Date();

    if (date.toDateString() === today.toDateString()) return "오늘";

    return [
      "일요일",

      "월요일",

      "화요일",

      "수요일",

      "목요일",

      "금요일",

      "토요일",
    ][date.getDay()];
  };

  // [추가] 날짜 클릭 시 중앙 정렬 스크롤을 실행하는 함수
  const handleDatePress = (date: Date) => {
    onDateSelect(date); // 기존의 날짜 선택 기능은 그대로 실행

    const layout = itemLayouts.current[date.toISOString()];
    if (layout) {
      // 아이템의 중앙 좌표가 화면의 중앙에 오도록 스크롤 위치 계산
      const targetX = layout.x + layout.width / 2 - screenWidth / 2;
      scrollRef.current?.scrollTo({ x: targetX, animated: true });
    }
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef} // [추가] ScrollView에 ref 연결
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelectorContainer}
        // 초기 스크롤 위치는 그대로 유지
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
              onPress={() => handleDatePress(date)} // [수정] 새로운 핸들러 함수 연결
              // [추가] 렌더링 시 각 아이템의 위치와 크기를 저장
              onLayout={(event: LayoutChangeEvent) => {
                const { x, width } = event.nativeEvent.layout;
                itemLayouts.current[date.toISOString()] = { x, width };
              }}
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
}

// 스타일은 이전과 동일합니다.
const styles = StyleSheet.create({
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
    height: 2,
    backgroundColor: "white",
    marginTop: 6,
  },
});
