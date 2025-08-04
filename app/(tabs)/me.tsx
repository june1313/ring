import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Href } from "expo-router";

// 설정 메뉴 행 컴포넌트 (더욱 정제된 스타일)
const SettingsRow = ({
  icon,
  text,
  href,
  isMaterial = false,
  description,
}: {
  icon: any;
  text: string;
  href: Href;
  isMaterial?: boolean;
  description?: string;
}) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.settingsRow}>
      {isMaterial ? (
        <MaterialCommunityIcons name={icon} size={24} color="#5A9DFF" />
      ) : (
        <Feather name={icon} size={22} color="#5A9DFF" />
      )}
      <View style={styles.settingsTextContainer}>
        <Text style={styles.settingsText}>{text}</Text>
        {description && (
          <Text style={styles.settingsDescription}>{description}</Text>
        )}
      </View>
      <Feather name="chevron-right" size={22} color="#7F7F7F" />
    </TouchableOpacity>
  </Link>
);

export default function MeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 프로필 카드 */}
        <TouchableOpacity style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=7" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>김민준</Text>
            <Text style={styles.userEmail}>계정 정보 보기</Text>
          </View>
        </TouchableOpacity>

        {/* 링 관리 섹션 */}
        <Text style={styles.sectionTitle}>JCRing</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="bluetooth"
            text="장치 설정"
            href="/modal"
            description="링 연결 및 관리"
          />
          <View style={styles.separator} />
          <SettingsRow
            isMaterial
            icon="update"
            text="펌웨어 업데이트"
            href="/modal"
            description="최신 버전: 2.0.10"
          />
          <View style={styles.separator} />
          <SettingsRow
            isMaterial
            icon="map-marker-question-outline"
            text="내 링 찾기"
            href="/modal"
          />
        </View>

        {/* 앱 설정 섹션 */}
        <Text style={styles.sectionTitle}>앱</Text>
        <View style={styles.settingsCard}>
          <SettingsRow icon="bell" text="알림" href="/modal" />
          <View style={styles.separator} />
          <SettingsRow icon="git-merge" text="제3자 연동" href="/modal" />
          <View style={styles.separator} />
          <SettingsRow icon="help-circle" text="도움말 및 지원" href="/modal" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A", // 더 깊고 어두운 배경
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#EAEAEA",
    fontSize: 34,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  username: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  userEmail: {
    color: "#8E8E93",
    fontSize: 16,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 24,
    textTransform: "uppercase", // 대문자로 기품있게
  },
  settingsCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingsTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  settingsText: {
    color: "#EAEAEA",
    fontSize: 17,
  },
  settingsDescription: {
    color: "#8E8E93",
    fontSize: 14,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth, // 매우 얇은 구분선
    backgroundColor: "#38383A",
    marginLeft: 60, // 아이콘 너비만큼 들여쓰기
  },
});
