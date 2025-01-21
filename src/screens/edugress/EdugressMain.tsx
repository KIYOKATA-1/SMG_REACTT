import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { EdugressService } from "../../../services/edugress/edugress.service";
import { useSession } from "../../../lib/useSession";
import { ITestResult } from "../../../services/edugress/edugress.types";
import FilesDropdown from "../../../components/FilesDropdown";
import BarChart from "../../../components/BarChart";

const RADIUS = 50;
const STROKE_WIDTH = 10;
const CIRCLE_LENGTH = (radius: number) => 2 * Math.PI * radius;

const EdugressScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTestData, setCurrentTestData] = useState<ITestResult[]>([]);
  const [lastTestData, setLastTestData] = useState<ITestResult[]>([]);

  const [animationValues, setAnimationValues] = useState<Animated.Value[]>([]);
  const { getSession } = useSession();

  const [files, setFiles] = useState<{ id: number; name: string }[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [chartData, setChartData] = useState<
    { name: string; avg_score_percent: number; avg_goal_percent: number }[]
  >([]);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) {
          throw new Error("Токен не найден");
        }

        const token = session.key;
        const filesResponse = await EdugressService.getFiles(token);

        if (!filesResponse.results || filesResponse.results.length === 0) {
          throw new Error("Нет доступных тестов");
        }

        const sortedFiles = [...filesResponse.results].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const latestTestId = sortedFiles[0].id;
        const progressResponse = await EdugressService.getStudentProgress(
          latestTestId,
          token
        );

        const currentTest =
          progressResponse.current_test_data?.results?.map((item: any) => ({
            name: item.name,
            score: Math.round(item.score_percent),
            score_percent: item.score_percent || 0,
            max_score: item.max_score || 0,
            expected_score: item.expected_score || 0,
          })) || [];

        const lastTest =
          progressResponse.last_test_data?.results?.map((item: any) => ({
            name: item.name,
            score: Math.round(item.score_percent),
            score_percent: item.score_percent || 0,
            max_score: item.max_score || 0,
            expected_score: item.expected_score || 0,
          })) || [];

        setCurrentTestData(currentTest);
        setLastTestData(lastTest);

        const animations = currentTest.map(() => new Animated.Value(0));
        setAnimationValues(animations);

        Animated.stagger(
          200,
          animations.map((anim, index) =>
            Animated.timing(anim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: false,
            })
          )
        ).start();
      } catch (err: any) {
        setError(err.message || "Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, [getSession]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error("Токен не найден");

        const response = await EdugressService.getFiles(session.key);
        setFiles(response.results || []);
      } catch (error) {
        console.error("Ошибка при загрузке файлов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = async (fileId: number) => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) throw new Error("Токен не найден");

      const examResults = await EdugressService.getExamResults(
        fileId,
        session.key
      );
      const preparedData = examResults.grade_vs_average.map((item: any) => ({
        name: item.name,
        avg_score_percent: item.avg_score_percent,
        avg_goal_percent: item.avg_goal_percent,
      }));

      setChartData(preparedData);
      setSelectedFileId(fileId);
    } catch (error) {
      console.error("Ошибка при получении результатов теста:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, { backgroundColor: "#F2277E" }]} />
          <Text style={{ color: "black", fontWeight: "600" }}>
            Текущий тест
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, { backgroundColor: "#9DE7BF" }]} />
          <Text style={{ color: "black", fontWeight: "600" }}>
            Прошлый тест
          </Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ScrollView horizontal contentContainerStyle={styles.centerContainer}>
          {currentTestData.map((item, index) => {
            const previousScore =
              lastTestData.find((test) => test.name === item.name)?.score || 0;
            const currentScore = item.score;

            const currentAnimatedOffset = animationValues[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: [
                CIRCLE_LENGTH(RADIUS),
                CIRCLE_LENGTH(RADIUS) * (1 - currentScore / 100),
              ],
            });

            const previousAnimatedOffset = animationValues[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: [
                CIRCLE_LENGTH(RADIUS - STROKE_WIDTH - 5),
                CIRCLE_LENGTH(RADIUS - STROKE_WIDTH - 5) *
                  (1 - previousScore / 100),
              ],
            });

            return (
              <View key={index} style={[styles.card, styles.cardSquare]}>
                <View style={styles.svgContainer}>
                  <Svg height="150" width="150">
                    <G rotation="-90" origin="75, 75">
                      <Circle
                        cx="75"
                        cy="75"
                        r={RADIUS}
                        stroke="#e6e6e6"
                        strokeWidth={STROKE_WIDTH}
                        fill="transparent"
                      />
                      <AnimatedCircle
                        cx="75"
                        cy="75"
                        r={RADIUS}
                        stroke="#F2277E"
                        strokeWidth={STROKE_WIDTH}
                        fill="transparent"
                        strokeDasharray={CIRCLE_LENGTH(RADIUS)}
                        strokeDashoffset={currentAnimatedOffset}
                        strokeLinecap="round"
                      />
                      <AnimatedCircle
                        cx="75"
                        cy="75"
                        r={RADIUS - STROKE_WIDTH - 5}
                        stroke="#9DE7BF"
                        strokeWidth={STROKE_WIDTH}
                        fill="transparent"
                        strokeDasharray={CIRCLE_LENGTH(
                          RADIUS - STROKE_WIDTH - 5
                        )}
                        strokeDashoffset={previousAnimatedOffset}
                        strokeLinecap="round"
                      />
                    </G>
                  </Svg>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.subjectText}>
                    {item.name || "Неизвестный предмет"}
                  </Text>
                  <Text style={styles.scoreText}>Текущий: {currentScore}%</Text>
                  <Text style={styles.scoreText}>
                    Прошлый: {previousScore}%
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.chartContainer}>
          <FilesDropdown
            files={files}
            onFileSelect={handleFileSelect}
            selectedFileId={selectedFileId}
          />
          {chartData.length > 0 && <BarChart data={chartData} />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  svgContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginTop: -20,
    alignItems: "center",
    flex: 1,
  },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginBottom: 20,
    borderColor: "#e0e0e0",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  svg: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
  legendSquare: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  scrollContainer: {
    marginTop: 10,
    paddingVertical: 20,
  },
  card: {
    marginHorizontal: 8,
    height: "auto",
    display: "flex",
    padding: 16,
    backgroundColor: "#263546",
    borderRadius: 8,
    elevation: 2,
  },
  cardSquare: {
    width: 200,
    gap: 30,
    display: "flex",

    height: 300,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  selectedFileText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  chartContainer: {
    marginTop: 20,
    gap: 20,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
  },

  subjectText: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
});

export default EdugressScreen;
