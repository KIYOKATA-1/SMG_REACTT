import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuantitativeCharacteristicsAnswerProps {
  answer: { answer: string } | null;
  options: { options: string[] };
  setAnswer: (option: string) => void;
}

const QuantitativeCharacteristicsAnswer: React.FC<QuantitativeCharacteristicsAnswerProps> = ({ options, setAnswer, answer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();

  const handleSelect = (selected: string) => {
    setSelectedAnswer(selected);
    setAnswer(selected);
  };

  useEffect(() => {
    if (answer) {
      setSelectedAnswer(answer.answer);
    } else {
      setSelectedAnswer(undefined); // Используем undefined вместо null
    }
  }, [answer]);

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Выберите 1 правильный ответ</Text>
      <View style={styles.optionsContainer}>
        {options.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, selectedAnswer === option && styles.selectedOption]}
            onPress={() => handleSelect(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>Подсказка</Text>
        <Text>A : Колонка 1 {'>'} Колонка 2</Text>
        <Text>B : Колонка 1 {'<'} Колонка 2</Text>
        <Text>C : Колонка 1 = Колонка 2</Text>
        <Text>D : Недостаточно данных</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  instructionText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#21192A',
    borderRadius: 6,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#531894',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
  hintContainer: {
    backgroundColor: '#260094',
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
  },
  hintText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default QuantitativeCharacteristicsAnswer;
