// app/(tabs)/exericse.tsx

import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const ExerciseLogItem = ({
  icon,
  title,
  details,
}: {
  icon: React.ComponentProps<typeof FontAwesome5>["name"];
  title: string;
  details: string;
}) => (
  <BlurView intensity={40} tint="dark" style={styles.logItem}>
    <View style={styles.logIconContainer}>
      <FontAwesome5 name={icon} size={20} color="white" />
    </View>
    <View style={styles.logTextContainer}>
      <Text style={styles.logTitle}>{title}</Text>
      <Text style={styles.logDetails}>{details}</Text>
    </View>
  </BlurView>
);

export default function ExerciseScreen() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>운동 기록</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
          <ExerciseLogItem
            icon="running"
            title="공원 조깅"
            details="5.2 km / 35분"
          />
          <ExerciseLogItem
            icon="dumbbell"
            title="전신 근력 운동"
            details="50분 / 450 Kcal"
          />
          <ExerciseLogItem
            icon="spa"
            title="요가 클래스"
            details="60분 / 180 Kcal"
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  header: {
    padding: 24,
  },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    borderRadius: 24, // 둥근 모서리
    marginBottom: 16,
    overflow: "hidden", // BlurView 효과를 위해 필수
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    padding: 16,
  },
  logIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  logTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  logTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  logDetails: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
    fontFamily: "SpaceMono",
  },
});
