import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";

export const ExerciseCard = () => (
  <Link href="/exericse" asChild>
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <FontAwesome5 name="running" size={20} color="#5A9DFF" />
        <Text style={styles.cardTitle}>운동</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.largeValue}>
          450 <Text style={styles.unit}>kcal</Text>
        </Text>
        <Text style={styles.subValue}>총 활동 시간: 52분</Text>
      </View>
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  card: { backgroundColor: "#1C1C1E", borderRadius: 20, padding: 20 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  cardContent: { alignItems: "center", paddingVertical: 20 },
  largeValue: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  unit: { fontSize: 20, color: "#8E8E93", fontWeight: "normal" },
  subValue: { color: "#8E8E93", fontSize: 16, marginTop: 8 },
});
