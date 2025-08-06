import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function ProDateSelector({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}) {
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

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelectorContainer}
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
}

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
