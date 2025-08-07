import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { CardProps } from "./types";
import Svg, { Circle, G } from "react-native-svg"; // [추가] SVG 컴포넌트

// [새로운 컴포넌트] 수면 링 차트
const SleepArcChart = () => {
  const stages = [
    { value: 0.2, color: "#5A9DFF" }, // 깊은
    { value: 0.55, color: "#A5C9FF" }, // 얕은
    { value: 0.25, color: "#D7BFFF" }, // REM
  ];
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0;

  return (
    <View style={{ width: radius * 2 + 20, height: radius * 2 + 20 }}>
      <Svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          {/* 배경 링 */}
          <Circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            stroke="#333"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {stages.map((stage, index) => {
            const strokeDashoffset =
              circumference - circumference * stage.value;
            const rotation = accumulatedPercentage * 360;
            accumulatedPercentage += stage.value;
            return (
              <G
                key={index}
                rotation={rotation}
                origin={`${radius}, ${radius}`}
              >
                <Circle
                  cx={radius}
                  cy={radius}
                  r={radius - strokeWidth / 2}
                  stroke={stage.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

// [수정된 컴포넌트] 수면 카드
export const SleepCard = ({ icon, title, color, href }: CardProps) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.card}>
      <LinearGradient
        colors={[`${color}25`, "transparent"]}
        style={styles.cardGlow}
      />
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name={icon as any} size={20} color={color} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#777" />
      </View>
      <View style={styles.sleepCardContent}>
        <View>
          <Text style={styles.largeValue}>
            7<Text style={styles.unit}>h</Text> 48
            <Text style={styles.unit}>m</Text>
          </Text>
          <Text style={styles.subValue}>수면 점수: 85점</Text>
        </View>
        {/* [교체] 새로운 수면 링 차트 */}
        <SleepArcChart />
      </View>
    </TouchableOpacity>
  </Link>
);

export const MetricCard = ({
  icon,
  title,
  value,
  unit,
  status,
  color,
  href,
  iconProvider,
}: CardProps) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.halfCard}>
      <LinearGradient
        colors={[`${color}20`, "transparent"]}
        style={styles.cardGlow}
      />
      <View style={styles.cardHeader}>
        {iconProvider === "MaterialCommunityIcons" ? (
          <MaterialCommunityIcons name={icon} size={20} color={color} />
        ) : (
          <FontAwesome5 name={icon} size={20} color={color} />
        )}
        <Text style={styles.cardTitleSm}>{title}</Text>
      </View>
      <View>
        <Text style={styles.mediumValue}>
          {value}
          <Text style={styles.unitSm}> {unit}</Text>
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#161B22",
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
  },
  cardGlow: { position: "absolute", top: 0, left: 0, right: 0, height: 3 },
  halfCard: {
    backgroundColor: "#161B22",
    borderRadius: 24,
    padding: 20,
    height: 170,
    justifyContent: "space-between",
    overflow: "hidden",
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
    color: "#EAEAEA",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  sleepCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
  },
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
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  unitSm: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "normal",
    marginLeft: 2,
  },
  timelineGraph: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 50,
    flex: 1,
    marginLeft: 10,
  },
  timelineBar: { width: 4, borderRadius: 2 },
  statusContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: "#8E8E93", fontSize: 14 },
});
