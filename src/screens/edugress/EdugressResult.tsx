import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { EdugressService } from "../../../services/edugress/edugress.service";
import FilesDropdown from "../../../components/FilesDropdown";
import { useSession } from "../../../lib/useSession";
import {
  IExamStudentResultResponse,
  ITopStudent,
} from "../../../services/edugress/edugress.types";

const EdugressResults = () => {
  const { getSession } = useSession();
  const [files, setFiles] = useState<{ id: number; name: string }[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topStudents, setTopStudents] = useState<ITopStudent[]>([]);
  const [userRanking, setUserRanking] = useState<number | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error("Токен не найден");

        const response = await EdugressService.getFiles(session.key);
        setFiles(response.results || []);
      } catch (err: any) {
        setError(err.message || "Ошибка при загрузке файлов");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [getSession]);

  const handleFileSelect = async (fileId: number) => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) throw new Error("Токен не найден");

      const response: IExamStudentResultResponse =
        await EdugressService.getStudentResults(fileId, session.key);

      setTopStudents(response.top_students.top || []);
      setUserRanking(response.top_students.user_ranking || null);
      setSelectedFileId(fileId);
    } catch (err: any) {
      setError(err.message || "Ошибка при получении результатов");
    } finally {
      setLoading(false);
    }
  };

  const getRowStyle = (index: number, isUser: boolean): object => {
    if (isUser) {
      return {
        backgroundColor: "#FFD700", // Золотой фон
        borderColor: "#FFD700", // Золотая граница
        shadowColor: "#FFD700", // Эффект свечения
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 10, // Для Android
      };
    }
    if (index < 25) {
      return { backgroundColor: "#CBFAD8" }; // Цвет для топ-25
    }
    return {};
  };

  const renderResults = () => {
    if (topStudents.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Выберите файл для отображения результатов
        </Text>
      );
    }

    const userInTop25 = userRanking !== null && userRanking <= 25;
    const user = userRanking !== null ? topStudents[userRanking - 1] : null;

    return (
      <View style={styles.resultWrapper}>
        <FlatList
          data={
            userInTop25
              ? topStudents.slice(0, 25)
              : [...topStudents.slice(0, 25), user]
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            if (!item) return null; // Пропускаем некорректные данные

            const isUser = userRanking !== null && index === userRanking - 1;
            return (
              <View style={[styles.resultItem, getRowStyle(index, isUser)]}>
                <Text style={styles.resultIndex}>{index + 1}.</Text>
                <View>
                  <Text style={styles.resultName}>
                    {item.user_info.first_name} {item.user_info.last_name}
                  </Text>
                  <Text style={styles.resultScore}>Баллы: {item.total_score}</Text>
                </View>
              </View>
            );
          }}
        />
        {!userInTop25 && userRanking !== null && user && (
          <>
            <Text style={styles.ellipsis}>...</Text>
            <View style={[styles.resultItem, getRowStyle(userRanking - 1, true)]}>
              <Text style={styles.resultIndex}>{userRanking}.</Text>
              <View>
                <Text style={styles.resultName}>
                  {user.user_info.first_name} {user.user_info.last_name}
                </Text>
                <Text style={styles.resultScore}>Баллы: {user.total_score}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    );
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
      <View style={styles.dropdownContainer}>
        <FilesDropdown
          files={files}
          onFileSelect={handleFileSelect}
          selectedFileId={selectedFileId}
        />
      </View>
      <View style={styles.resultsContainer}>
        <Text style={styles.topTitle}>Результаты студентов:</Text>
        {renderResults()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  resultsContainer: {
    flex: 1,
    marginHorizontal: 16, 
  },
  resultWrapper: {
    marginTop: 16,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Для Android
  },
  resultIndex: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    color: "#333",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  resultScore: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  ellipsis: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 8,
  },
});

export default EdugressResults;
