import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles, COLORS } from "@/styles/sleep-details-styles";

type Period = "일" | "주" | "월";

type HeaderProps = {
  period: Period;
  setPeriod: (p: Period) => void;
  date: Date;
  setDate: (d: Date) => void;
};

export default function Header({
  period,
  setPeriod,
  date,
  setDate,
}: HeaderProps) {
  const changeDate = (amount: number) => {
    const newDate = new Date(date);
    const step = period === "주" ? 7 : 1;
    if (period === "월") {
      newDate.setMonth(date.getMonth() + amount);
    } else {
      newDate.setDate(date.getDate() + amount * step);
    }
    setDate(newDate);
  };

  const formatDate = () => {
    if (period === "일")
      return date.toISOString().split("T")[0].replace(/-/g, "/");
    const start = new Date(date);
    const end = new Date(date);
    if (period === "주") {
      const dayOfWeek = start.getDay() === 0 ? 6 : start.getDay() - 1;
      start.setDate(start.getDate() - dayOfWeek);
      end.setDate(start.getDate() + 6);
      return `${start.getFullYear()}/${start
        .toISOString()
        .slice(5, 10)
        .replace("-", "/")} - ${end
        .toISOString()
        .slice(5, 10)
        .replace("-", "/")}`;
    }
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}월`;
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>수면</Text>
        <TouchableOpacity>
          <Feather name="share" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerMidRow}>
        {(["일", "주", "월"] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[
              styles.periodButton,
              period === p && styles.activePeriodButton,
            ]}
          >
            <Text
              style={[
                styles.periodText,
                period === p && styles.activePeriodText,
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.headerBottomRow}>
        <TouchableOpacity onPress={() => changeDate(-1)}>
          <Feather name="chevron-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate()}</Text>
        <TouchableOpacity onPress={() => changeDate(1)}>
          <Feather name="chevron-right" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
