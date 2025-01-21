import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useSession } from "../../../lib/useSession";
import { EdugressService } from "../../../services/edugress/edugress.service";
import { UserRoadmapData } from "../../../services/edugress/edugress.types";

const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const RoadmapScreen = () => {
  const [roadmapData, setRoadmapData] = useState<UserRoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getSession } = useSession();

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error("Токен не найден");

        const token = session.key;
        const data = await EdugressService.getUserRoadmap(token);
        setRoadmapData(data[0]);
      } catch (err: any) {
        setError(err.message || "Ошибка при загрузке данных роадмапа");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, [getSession]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!roadmapData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Нет данных для отображения</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.roadmap}>
          {/* Вертикальная линия */}
          <View style={styles.verticalLine} />
          {roadmapData.roadmap.map((item, index) => (
            <View key={index} style={styles.pointContainer}>
              {/* Точка (поинт) */}
              <View style={styles.point} />
              {/* Информация о месяце */}
              <View style={styles.textContainer}>
                <Text style={styles.monthText}>
                  {MONTH_NAMES[item.month - 1]}
                </Text>
                <Text style={styles.resultText}>
                  Результат:{" "}
                  {item.result
                    ? `${Math.round(parseFloat(item.result))}%`
                    : "Нет данных"}
                </Text>
                <Text style={styles.goalText}>
                  Цель:{" "}
                  {item.goal ? `${parseFloat(item.goal).toFixed(0)}%` : "Нет данных"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  roadmap: {
    width: "90%",
    alignItems: "center",
    position: "relative",
  },
  verticalLine: {
    position: "absolute",
    width: 4,
    backgroundColor: "#ddd",
    top: 0,
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -2 }],
  },
  pointContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  point: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F2277E",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -10 }],
    zIndex: 1,
  },
  textContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
    width: "70%",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    textAlign: "center",
  },
  resultText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  goalText: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default RoadmapScreen;
