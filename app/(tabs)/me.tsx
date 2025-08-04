import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link, Href } from "expo-router";
import { BlurView } from "expo-blur";

const SettingsRow = ({
  icon,
  text,
  href,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  text: string;
  href: Href;
}) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.settingsRow}>
      <Feather name={icon} size={22} color="#A5C9FF" />
      <Text style={styles.settingsText}>{text}</Text>
      <Feather name="chevron-right" size={22} color="#9CA3AF" />
    </TouchableOpacity>
  </Link>
);

export default function MeScreen() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>내 정보</Text>
        </View>
        <ScrollView>
          <View style={styles.profileSection}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>김민준</Text>
            <Text style={styles.email}>minjun.kim@example.com</Text>
          </View>

          <BlurView intensity={40} tint="dark" style={styles.settingsGroup}>
            <SettingsRow
              icon="user"
              text="프로필 편집"
              href="/edit-profile" // 수정된 경로
            />
            <View style={styles.separator} />
            <SettingsRow icon="bell" text="알림 설정" href="/modal" />
            <View style={styles.separator} />
            <SettingsRow icon="shield" text="보안" href="/modal" />
            <View style={styles.separator} />
            <SettingsRow icon="help-circle" text="도움말" href="/modal" />
          </BlurView>
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
    paddingBottom: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#A5C9FF", // 테마 색상으로 변경
  },
  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  email: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 6,
    fontFamily: "SpaceMono",
  },
  settingsGroup: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 24, // 둥근 모서리
    overflow: "hidden", // BlurView 효과를 위해 필수
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  settingsText: {
    flex: 1,
    color: "white",
    fontSize: 18,
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginLeft: 58, // 아이콘 너비 + 텍스트 왼쪽 마진
  },
});
