import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>프로필 편집</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>준비 중인 페이지입니다.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { padding: 24 },
  headerTitle: { color: "white", fontSize: 32, fontWeight: "bold" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentText: { color: "#9CA3AF", fontSize: 18 },
});
