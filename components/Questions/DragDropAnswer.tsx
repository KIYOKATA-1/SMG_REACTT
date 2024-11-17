import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface Item {
  index: string;
  text: string;
  img?: string;
}

interface DragDropAnswers {
  [key: string]: string[];
}

interface DragDropAnswerProps {
  options: {
    categories: string[];
    options: { [index: string]: { text: string; img?: string } }[];
  };
  answer: DragDropAnswers | null;
  setAnswer: (answer: DragDropAnswers) => void;
}

const DragDropAnswer: React.FC<DragDropAnswerProps> = ({ options, setAnswer, answer }) => {
  const flatOptions: Item[] = Object.entries(options.options).flatMap(([index, optionGroup]) =>
    Object.entries(optionGroup).map(([key, { text, img }]) => ({
      index: key,
      text,
      img,
    }))
  );

  const [answerOptions, setAnswerOptions] = useState<Item[]>(flatOptions);
  const [dropAnswers, setDropAnswers] = useState<DragDropAnswers>(() => {
    const initialDropAnswers: DragDropAnswers = {};
    options.categories.forEach((category) => {
      initialDropAnswers[category] = [];
    });
    return initialDropAnswers;
  });

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleSelectCategory = (category: string) => {
    if (!selectedItem) {
      return;
    }

    const updatedDropAnswers = { ...dropAnswers };

    // Удаляем элемент из всех категорий
    Object.keys(updatedDropAnswers).forEach((cat) => {
      updatedDropAnswers[cat] = updatedDropAnswers[cat].filter((index) => index !== selectedItem.index);
    });

    // Добавляем элемент в выбранную категорию
    updatedDropAnswers[category] = [...updatedDropAnswers[category], selectedItem.index];
    setDropAnswers(updatedDropAnswers);

    // Удаляем элемент из доступных элементов
    setAnswerOptions((prev) => prev.filter((item) => item.index !== selectedItem.index));

    // Передаем данные обратно в `setAnswer` как строки
    setAnswer(
      Object.fromEntries(
        Object.entries(updatedDropAnswers).map(([key, values]) => [key, values.map(String)])
      )
    );

    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.initialZone}>
        <Text style={styles.zoneTitle}>Доступные элементы</Text>
        <FlatList
          data={answerOptions}
          keyExtractor={(item) => item.index}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, selectedItem?.index === item.index && styles.selectedItem]}
              onPress={() => handleSelectItem(item)}
            >
              <Text>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.dropZones}>
        {options.categories.map((category) => (
          <View key={category} style={styles.dropZone}>
            <Text style={styles.zoneTitle}>{category}</Text>
            <FlatList
              data={dropAnswers[category].map((index) => flatOptions.find((item) => item.index === index))}
              keyExtractor={(item) => (item ? item.index : '')}
              renderItem={({ item }) =>
                item ? (
                  <TouchableOpacity style={styles.item}>
                    <Text>{item.text}</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleSelectCategory(category)}
            >
              <Text style={styles.addButtonText}>Добавить сюда</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  initialZone: {
    width: '40%',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  dropZones: {
    width: '55%',
    flexDirection: 'column',
  },
  dropZone: {
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  item: {
    padding: 10,
    marginBottom: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedItem: {
    backgroundColor: '#add8e6',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#add8e6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DragDropAnswer;
