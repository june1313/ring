import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

export default function LiteModeScreen() {
  const healthData = {
    date: "2025년 8월 5일",
    status: "좋음",
    statusColor: "#2ECC71",
    hr: "68",
    glucose: "95",
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.date}>{healthData.date}</Text>

        <View style={styles.statusCard}>
          <FontAwesome5
            name="check-circle"
            size={56}
            color={healthData.statusColor}
          />
          <Text style={styles.statusText}>
            오늘의 건강 상태: {healthData.status}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>심박수</Text>
          <Text style={styles.metricValue}>
            {healthData.hr} <Text style={styles.metricUnit}>bpm</Text>
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>혈당</Text>
          <Text style={styles.metricValue}>
            {healthData.glucose} <Text style={styles.metricUnit}>mg/dL</Text>
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.emergencyButton}>
        <Feather name="phone-call" size={32} color="white" />
        <Text style={styles.emergencyButtonText}>긴급 호출</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 150,
  },
  date: {
    fontSize: 24,
    color: "#BDBDBD",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "600",
  },
  statusCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 32,
  },
  statusText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    textAlign: "center",
  },
  metricCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  metricTitle: {
    fontSize: 28,
    color: "#BDBDBD",
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
    fontFamily: "SpaceMono",
  },
  metricUnit: {
    fontSize: 24,
    color: "#BDBDBD",
  },
  emergencyButton: {
    backgroundColor: "#D93636",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
  },
  emergencyButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
  },
});
