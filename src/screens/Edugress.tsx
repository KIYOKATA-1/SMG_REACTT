import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { EdugressService } from "../../services/edugress/edugress.service";
import { useSession } from "../../lib/useSession";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const EdugressScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTestData, setCurrentTestData] = useState<any[]>([]);
  const [lastTestData, setLastTestData] = useState<any[]>([]);
  const [currentTestMeta, setCurrentTestMeta] = useState<{ date: string }>({
    date: "",
  });
  const [lastTestMeta, setLastTestMeta] = useState<{ date: string }>({
    date: "",
  });
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null); 
  const { getSession } = useSession();

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
            subject: item.name,
            score: item.score_percent,
          })) || [];

        const lastTest =
          progressResponse.last_test_data?.results?.map((item: any) => ({
            subject: item.name,
            score: item.score_percent,
          })) || [];

        setCurrentTestData(currentTest);
        setLastTestData(lastTest);
        setCurrentTestMeta({
          date: progressResponse.current_test_data?.date || "",
        });
        setLastTestMeta({ date: progressResponse.last_test_data?.date || "" });
      } catch (err: any) {
        setError(err.message || "Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, [getSession]);

  const createChartData = () => {
    const labels = currentTestData.map((item) =>
      item.subject.length > 20
        ? `${item.subject.slice(0, 20)}...`
        : item.subject
    );
    const currentScores = currentTestData.map((item) => Math.round(item.score)); // Округление текущих процентов
    const lastScores = lastTestData.map((item) => {
      const lastTestSubject = lastTestData.find(
        (sub) => sub.subject === item.subject
      );
      return lastTestSubject ? Math.round(lastTestSubject.score) : 0; 
    });

    return {
      labels,
      datasets: [
        {
          data: currentScores,
          color: () => "rgba(134, 65, 244, 1)", 
          strokeWidth: 2,
        },
        {
          data: lastScores,
          color: () => "rgba(244, 95, 65, 1)", 
          strokeWidth: 2,
        },
      ],
      legend: ["Текущий тест", "Последний тест"], 
    };
  };

  const handleSubjectClick = (index: number) => {
    const selectedCurrent = currentTestData[index];
    const selectedLast = lastTestData.find(
      (item) => item.subject === selectedCurrent.subject
    ) || {
      subject: selectedCurrent.subject,
      score: 0,
    };
    setSelectedSubject({ current: selectedCurrent, last: selectedLast });
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
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.title}>Результаты тестов:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <LineChart
              data={createChartData()}
              width={Math.max(screenWidth, currentTestData.length * 120)} 
              height={300}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "5",
                  strokeWidth: "5",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 16,
                borderRadius: 16,
              }}
              fromZero
              verticalLabelRotation={15} 
              onDataPointClick={(data) => {
                const { index } = data; 
                handleSubjectClick(index);
              }}
            />
          </ScrollView>
        </View>
      </ScrollView>

      {selectedSubject && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedSubject}
          onRequestClose={() => setSelectedSubject(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Детали по предмету</Text>
              <Text style={styles.modalSubject}>
                {selectedSubject.current.subject}
              </Text>
              <Text style={styles.modalScore}>
                Текущий тест: {Math.round(selectedSubject.current.score)}%
              </Text>
              <Text style={styles.modalScore}>
                Последний тест: {Math.round(selectedSubject.last.score)}%
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={() => setSelectedSubject(null)}
              >
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#000'
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalSubject: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ffa726",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EdugressScreen;
