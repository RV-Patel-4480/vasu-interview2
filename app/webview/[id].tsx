import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import { useAppTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/stores/auth.store";
import { useCoursesStore } from "@/stores/course.store";

export default function CourseWebView() {
  const { theme } = useAppTheme();
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const courses = useCoursesStore((s) => s.courses);
  const user = useAuthStore((s) => s.user);

  const course = useMemo(
    () => courses.find((c) => String(c.id) === id),
    [courses, id],
  );

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const headers = {
    "x-course-id": String(course.id),
    "x-course-title": course.title ?? "",
    "x-user-name": user?.username ?? "",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI';
            padding: 16px;
            background: ${theme.SystemBackground};
          }
          h1 { color: ${theme.Label}; }
          .card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 12px ${theme.Label}20;
          }
          .price {
            color: ${theme.Blue};
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>${course.title}</h1>
          <p>${course.description}</p>
          <p class="price">₹ ${course.price}</p>

          <hr />

          <h3>Course Content</h3>
          <ul>
            <li>Introduction</li>
            <li>Module 1</li>
            <li>Module 2</li>
            <li>Final Project</li>
          </ul>

          <button onclick="sendMessage()">Send Message to App</button>
        </div>

        <script>
          function sendMessage(){
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: "COURSE_STARTED",
                courseTitle: "${course?.title}",
                userName: "${user?.username ?? "Guest"}",
              })
            );
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html, headers }}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === "COURSE_STARTED") {
            Alert.alert(
              data?.type || "WebView To Native",
              `User ${data?.userName} started ${data?.courseTitle} course.`,
            );
          }
        }}
      />
    </View>
  );
}

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.SystemBackground,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
