import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { EdugressService } from "../../../services/edugress/edugress.service";
import { useSession } from "../../../lib/useSession";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [diagnosticFile, setDiagnosticFile] = useState<string | null>(null);
  const [isPDFVisible, setIsPDFVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  const openModal = (month: string, fileUrl?: string) => {
    setSelectedMonth(month);
    setDiagnosticFile(fileUrl || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMonth(null);
  };

  const openPDF = () => {
    setPdfLoading(true);
    setModalVisible(false);
    setIsPDFVisible(true);
  };

  const closePDF = () => {
    setIsPDFVisible(false);
  };

  const downloadFile = async (fileUrl: string) => {
    try {
      setIsDownloading(true);
      if (!FileSystem.documentDirectory) {
        throw new Error("Директория для документов недоступна");
      }
      const fileUri = FileSystem.documentDirectory + fileUrl.split("/").pop();
      const { uri } = await FileSystem.downloadAsync(fileUrl, fileUri);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Ошибка скачивания файла:", error);
    } finally {
      setIsDownloading(false);
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
          {roadmapData.roadmap.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.blockContainer}
              onPress={() =>
                openModal(MONTH_NAMES[item.month - 1], item.diagnostic_map)
              }
            >
              <View style={styles.point} />
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
                  {item.goal
                    ? `${parseFloat(item.goal).toFixed(0)}%`
                    : "Нет данных"}
                </Text>
              </View>
              {index < roadmapData.roadmap.length - 1 && (
                <View style={styles.line} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMonth || ""}</Text>
            {diagnosticFile ? (
              <View style={styles.modalButtons}>
                {isDownloading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <>
                    <TouchableOpacity onPress={openPDF} style={styles.Btn}>
                      <Text>Диагностика карты</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.Btn,
                        { display: "flex", flexDirection: "row", gap: 5 },
                      ]}
                      onPress={() => downloadFile(diagnosticFile)}
                    >
                      <Text>Скачать</Text>
                      <MaterialIcons name="download" size={20} color="black" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              <Text style={styles.noFileText}>Файл отсутствует</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isPDFVisible && diagnosticFile && (
        <Modal
          visible={isPDFVisible}
          animationType="slide"
          onRequestClose={closePDF}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {pdfLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            )}
            <WebView
              source={{ uri: diagnosticFile }}
              onLoadEnd={() => setPdfLoading(false)}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closePDF}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  roadmap: {
    alignItems: "center",
    width: "100%",
  },
  blockContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  point: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F2277E",
    zIndex: 1,
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: "#ccc",
    zIndex: 0,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 14,
    color: "#333",
  },
  goalText: {
    fontSize: 14,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtons: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  modalBtn: {},
  noFileText: {
    fontSize: 14,
    color: "red",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F2277E",
    borderRadius: 5,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
  },
  Btn: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    width: 200,
  },
});

export default RoadmapScreen;
