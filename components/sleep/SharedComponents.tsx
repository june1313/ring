import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { styles, COLORS } from "@/styles/sleep-details-styles";

export const StarRating = ({ rating }: { rating: number }) => (
  <View style={styles.starContainer}>
    {Array.from({ length: 5 }).map((_, i) => {
      if (rating >= i + 1)
        return (
          <FontAwesome5
            key={i}
            name="star"
            solid
            color="#FFD700"
            size={16}
            style={{ marginRight: 4 }}
          />
        );
      if (rating > i)
        return (
          <FontAwesome5
            key={i}
            name="star-half-alt"
            solid
            color="#FFD700"
            size={16}
            style={{ marginRight: 4 }}
          />
        );
      return (
        <FontAwesome5
          key={i}
          name="star"
          color="#555"
          size={16}
          style={{ marginRight: 4 }}
        />
      );
    })}
  </View>
);

export const Legend = () => (
  <View style={styles.legendContainer}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.awake }]} />
      <Text style={styles.legendText}>깨어 있음</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.rem }]} />
      <Text style={styles.legendText}>REM</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.light }]} />
      <Text style={styles.legendText}>얕은 수면</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: COLORS.deep }]} />
      <Text style={styles.legendText}>깊은 수면</Text>
    </View>
  </View>
);

export const MetricSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Feather name="info" size={16} color={COLORS.subText} />
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

export const MetricRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

export const MetricDuo = ({
  label1,
  value1,
  label2,
  value2,
}: {
  label1: string;
  value1: string;
  label2: string;
  value2: string;
}) => (
  <View style={styles.duoContainer}>
    <View style={styles.duoItem}>
      <Text style={styles.metricValueSm}>{value1}</Text>
      <Text style={styles.metricLabel}>{label1}</Text>
    </View>
    <View style={styles.duoItem}>
      <Text style={styles.metricValueSm}>{value2}</Text>
      <Text style={styles.metricLabel}>{label2}</Text>
    </View>
  </View>
);
