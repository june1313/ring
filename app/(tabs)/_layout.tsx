import React from "react";
import { Tabs } from "expo-router";
import { Foundation, FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#A5C9FF",
        tabBarInactiveTintColor: "#929292",
        tabBarStyle: {
          backgroundColor: "#161616",
          borderTopWidth: 0,
          elevation: 0,
          height: 90,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: "건강",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="heartbeat" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exericse"
        options={{
          title: "운동",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="running" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "나의",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={24} color={color} />
          ),
        }}
      />

      {/* 이 부분이 edit-profile 탭을 숨기는 핵심 코드입니다. */}
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
    </Tabs>
  );
}
