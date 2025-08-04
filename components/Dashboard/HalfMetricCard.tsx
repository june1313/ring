import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Href } from "expo-router"; // Href 타입 import

// props 타입 정의
type HalfCardProps = {
  icon: any;
  label: string;
  value: string;
  unit: string;
  href: Href; // Href<string>이 아닌 Href로 수정
  iconProvider?: "FontAwesome5" | "MaterialCommunity";
};

export const HalfMetricCard = ({
  icon,
  label,
  value,
  unit,
  href,
  iconProvider = "FontAwesome5",
}: HalfCardProps) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.halfCard}>
      <View style={styles.cardHeader}>
        {iconProvider === "MaterialCommunity" ? (
          <MaterialCommunityIcons name={icon} size={20} color="#5A9DFF" />
        ) : (
          <FontAwesome5 name={icon} size={20} color="#5A9DFF" />
        )}
        <Text style={styles.cardTitle}>{label}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.mediumValue}>
          {value} <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  halfCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    height: "100%",
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  cardContent: { alignItems: "center", paddingVertical: 20 },
  mediumValue: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  unit: { fontSize: 20, color: "#8E8E93", fontWeight: "normal" },
});
