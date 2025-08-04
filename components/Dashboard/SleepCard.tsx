import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";

export const SleepCard = () => (
  <Link href="/health" asChild>
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <FontAwesome5 name="moon" size={20} color="#5A9DFF" />
        <Text style={styles.cardTitle}>수면</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.largeValue}>
          7<Text style={styles.unit}>h</Text> 48
          <Text style={styles.unit}>m</Text>
        </Text>
        <View style={styles.sleepBarContainer}>
          <View
            style={[styles.sleepBar, { flex: 3, backgroundColor: "#5A9DFF" }]}
          />
          <View
            style={[styles.sleepBar, { flex: 5, backgroundColor: "#8dbbff" }]}
          />
          <View
            style={[styles.sleepBar, { flex: 2, backgroundColor: "#cce0ff" }]}
          />
        </View>
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
  sleepBarContainer: {
    flexDirection: "row",
    height: 10,
    width: "80%",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 20,
  },
  sleepBar: { height: "100%" },
});
