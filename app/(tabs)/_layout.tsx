import React from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// 홈 화면에서 사용했던 색상들을 가져옵니다.
const COLORS = {
  home: "#FFFFFF", // 홈은 모든 색을 아우르는 중립적인 흰색으로 설정
  health: "#3ACCE1", // SpO2의 시원한 파란색
  exercise: "#50D6A3", // 운동의 활기찬 초록색
  me: "#8A9BFF", // 수면의 차분한 보라색
  inactive: "#8E8E93",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarBackground: () => (
          <LinearGradient
            colors={["#1C1C1E", "#161B22"]}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: {
          height: 85,
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          elevation: 0,
          paddingTop: 10,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
          tabBarActiveTintColor: COLORS.home, // 홈 탭 활성 색상
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: "정보",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chart-bar" size={24} color={color} />
          ),
          tabBarActiveTintColor: COLORS.health, // 정보 탭 활성 색상
        }}
      />
      <Tabs.Screen
        name="exericse"
        options={{
          title: "운동",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="running" size={24} color={color} />
          ),
          tabBarActiveTintColor: COLORS.exercise, // 운동 탭 활성 색상
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "프로필",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-alt" size={24} color={color} />
          ),
          tabBarActiveTintColor: COLORS.me, // 프로필 탭 활성 색상
        }}
      />

      {/* edit-profile 탭은 숨김 처리 */}
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
