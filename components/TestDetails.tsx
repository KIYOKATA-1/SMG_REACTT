import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const TestDetails = ({ testResults }) => {
  if (!testResults || testResults.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет доступных данных</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.sectionTitle}>Детали тестов</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {testResults.map((result, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{result.name || "Без имени"}</Text>
            <Text style={styles.cardText}>Текущий результат: {result.score}%</Text>
            <Text style={styles.cardText}>Ожидаемый результат: {result.expected_score}%</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#F0F4F8",
    borderRadius: 10,
    padding: 16,
    marginRight: 10,
    width: 250,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
  emptyContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});

export default TestDetails;
