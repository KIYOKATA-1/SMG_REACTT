import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { ITestQuestions, UserAnswer, QuestionType, TestQuestion } from '../../services/test/test.types';

interface QuestionRendererProps {
  question: ITestQuestions;
  onAnswer: (answer: UserAnswer) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<UserAnswer | null>(null);

  const handleAnswerSelection = (answer: string) => {
    const userAnswer: UserAnswer = { answer };
    setSelectedAnswer(userAnswer);
  };

  const getOptions = (questionData: TestQuestion) => {
    if (
      questionData.question_type === QuestionType.SingleSelect ||
      questionData.question_type === QuestionType.MultipleSelect
    ) {
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
              selectedAnswer?.answer === item.text ? styles.selectedOption : {},
            ]}
            onPress={() => handleAnswerSelection(item.text)}
          >
            <Text style={styles.optionText}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const submitAnswer = () => {
    if (!selectedAnswer) {
      Alert.alert('Ошибка', 'Выберите ответ перед отправкой.');
      return;
    }
    onAnswer(selectedAnswer);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.test_question_data.description.text}</Text>
      {renderOptions()}
      <Button title="Ответить" onPress={submitAnswer} />
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
