import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";

interface FilesDropdownProps {
  files: { id: number; name: string }[];
  onFileSelect: (id: number) => void;
  selectedFileId: number | null;
}

const FilesDropdown: React.FC<FilesDropdownProps> = ({ files, onFileSelect, selectedFileId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFileSelect = (id: number) => {
    onFileSelect(id);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedFileId
            ? files.find((file) => file.id === selectedFileId)?.name || "Выбрать файл"
            : "Выбрать файл"}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Выберите файл</Text>
            <FlatList
              data={files}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item.id === selectedFileId && styles.modalItemSelected,
                  ]}
                  onPress={() => handleFileSelect(item.id)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    dropdownContainer: {
      marginVertical: 10,
    },
    dropdownButton: {
      padding: 12,
      backgroundColor: "#F2277E",
      borderRadius: 8,
      alignItems: "center",
    },
    dropdownButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
      textAlign: "center",
    },
    modalItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      backgroundColor: "#f9f9f9",
      elevation: 2,
    },
    modalItemSelected: {
      borderColor: "#F2277E",
      backgroundColor: "#ffe6ee",
    },
    modalItemText: {
      fontSize: 16,
      color: "#333",
      marginLeft: 10,
      flex: 1,
    },
    closeButton: {
      marginTop: 20,
      padding: 12,
      backgroundColor: "#F2277E",
      borderRadius: 8,
      alignItems: "center",
    },
    closeButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
export default FilesDropdown;
