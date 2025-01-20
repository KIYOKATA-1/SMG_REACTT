import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";

interface BarChartProps {
  data: {
    name: string;
    avg_score_percent: number;
    avg_goal_percent: number;
  }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    avg_score_percent: number;
    avg_goal_percent: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const chartWidth = data.length * 80; 
  const chartHeight = 250;
  const yOffset = 30;

  const barWidth = 55;
  const barSpacing = 50;

  const maxValue = 100;

  const scaleY = (value: number) =>
    (value / maxValue) * (chartHeight - yOffset);

  const openModal = (item: {
    name: string;
    avg_score_percent: number;
    avg_goal_percent: number;
  }) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal>
        <Svg
          width={chartWidth + 50}
          height={chartHeight + 50}
          style={{ paddingTop: 10 }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const value = i * 25;
            const y = chartHeight - scaleY(value);

            return (
              <React.Fragment key={`grid-${i}`}>
                <Line
                  x1="50"
                  y1={y}
                  x2={chartWidth + 50}
                  stroke="#CCCCCC"
                  strokeDasharray="5 5"
                />
                <SvgText
                  x="40"
                  y={y + 5}
                  fontSize="10"
                  fill="black"
                  textAnchor="end"
                >
                  {value}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Оси */}
          <Line
            x1="50"
            y1={chartHeight}
            x2={chartWidth + 50}
            y2={chartHeight}
            stroke="black"
          />
          <Line x1="50" y1="0" x2="50" y2={chartHeight} stroke="black" />

          {/* Столбцы */}
          {data.map((item, index) => {
            const x = 50 + index * (barWidth + barSpacing);
            const scoreHeight = scaleY(item.avg_score_percent);
            const goalHeight = scaleY(item.avg_goal_percent);

            return (
              <React.Fragment key={index}>
                <Rect
                  x={x}
                  y={chartHeight - scoreHeight}
                  width={barWidth}
                  height={scoreHeight}
                  fill="#DDE9FD"
                  stroke="black"
                  ry="5" 
                  onPress={() => openModal(item)}
                />
                <Line
                  x1={x}
                  y1={chartHeight - goalHeight}
                  x2={x + barWidth}
                  y2={chartHeight - goalHeight}
                  stroke="#260096"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  fontSize="10"
                  fill="black"
                  textAnchor="middle"
                >
                  {item.name.length > 6
                    ? `${item.name.slice(0, 6)}...`
                    : item.name}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>

      <Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      {selectedItem && (
        <>
          <Text style={styles.modalTitle}>Результаты</Text>
          <View style={styles.modalDivider} />
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Предмет:</Text>
            <Text style={styles.modalValue}>{selectedItem.name}</Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Ваш Результат:</Text>
            <Text style={styles.modalValue}>
            {selectedItem.avg_score_percent.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Ваша Цель:</Text>
            <Text style={styles.modalValue}>
            {selectedItem.avg_goal_percent.toFixed(1)}%
            </Text>
          </View>
        </>
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Закрыть</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 15,
  },
  modalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#F2277E",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BarChart;
