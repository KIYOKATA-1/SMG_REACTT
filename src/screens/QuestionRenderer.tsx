import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ITestQuestions, UserAnswer, QuestionType, TestQuestion } from '../../services/test/test.types';

interface QuestionRendererProps {
  question: ITestQuestions;
  onAnswer: (answer: UserAnswer) => void;
  isLastQuestion: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, isLastQuestion }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ text: string; img?: string }[]>([]);
  const isMultipleSelect = question.test_question_data.question_type === QuestionType.MultipleSelect;

  const handleSelect = (option: { text: string; img?: string }) => {
    if (isMultipleSelect) {
      setSelectedAnswers((prev) =>
        prev.some((item) => item.text === option.text)
          ? prev.filter((item) => item.text !== option.text)
          : [...prev, option]
      );
    } else {
      setSelectedAnswers([option]);
    }
  };

  const getOptions = (questionData: TestQuestion) => {
    if (questionData.question_type === QuestionType.SingleSelect || questionData.question_type === QuestionType.MultipleSelect) {
      return questionData.options?.options || [];
    }
    return [];
  };

  const renderOptions = () => {
    const options = getOptions(question.test_question_data);

    if (options.length === 0) {
      return <Text>Опции не найдены для данного вопроса.</Text>;
    }

    return (
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              selectedAnswers.some((answer) => answer.text === item.text) ? styles.selectedOption : {},
            ]}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.optionText}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const submitAnswer = () => {
    if (selectedAnswers.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы один ответ перед отправкой.');
      return;
    }

    let formattedAnswer: UserAnswer;
    if (isMultipleSelect) {
      // MultipleSelect: отправляем массив объектов с ответами
      formattedAnswer = { answer: selectedAnswers.map((ans) => ({ text: ans.text, img: ans.img })) };
    } else {
      // SingleSelect: отправляем один объект
      formattedAnswer = { answer: { text: selectedAnswers[0].text, img: selectedAnswers[0].img } };
    }

    // Log for debugging
    console.log('Отправляемый ответ:', JSON.stringify(formattedAnswer));

    onAnswer(formattedAnswer);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.test_question_data.description.text}</Text>
      {renderOptions()}
      <Button title={isLastQuestion ? "Завершить" : "Ответить"} onPress={submitAnswer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20, padding: 10 },
  questionText: { fontSize: 18, marginBottom: 10 },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#add8e6',
  },
  optionText: { fontSize: 16 },
});

export default QuestionRenderer;
