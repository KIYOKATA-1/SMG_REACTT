import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserTestResultQuestions, QuantitativeCharacteristicsQuestion } from '../../services/test/test.types';

const QuantitativeResult: React.FC<{ question: UserTestResultQuestions }> = ({ question }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  if (!question || !question.user_answer || !question.correct_answer) {
    return <Text style={styles.errorText}>Данные недоступны</Text>;
  }

  const quantitativeQuestion = question.test_question_data as QuantitativeCharacteristicsQuestion;
  const userAnswer = question.user_answer?.answer as string;
  const correctAnswer = question.correct_answer?.answer as string;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Ваш ответ:</Text>
      {quantitativeQuestion.options.options.map((option, index) => {
        const isSelected = userAnswer === option;
        const isCorrect = correctAnswer === option;

        return (
          <View
            key={index}
            style={[
              styles.optionContainer,
              isSelected ? (isCorrect ? styles.correct : styles.incorrect) : styles.defaultOption,
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </View>
        );
      })}

      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowCorrectAnswer(!showCorrectAnswer)}>
        <Text style={styles.toggleButtonText}>
          {showCorrectAnswer ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
        </Text>
      </TouchableOpacity>

      {showCorrectAnswer && (
        <>
          <Text style={styles.sectionHeader}>Правильный ответ:</Text>
          <View style={styles.correctAnswerContainer}>
            <Text style={styles.correctAnswerText}>{correctAnswer || 'Нет данных'}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#1B1423', borderRadius: 6, marginVertical: 10 },
  sectionHeader: { fontSize: 18, color: 'white', marginBottom: 10 },
  optionContainer: { padding: 10, marginVertical: 5, borderRadius: 5 },
  correct: { backgroundColor: '#33AC72' },
  incorrect: { backgroundColor: '#F15C5C' },
  defaultOption: { backgroundColor: '#130F18' },
  optionText: { color: 'white', fontSize: 16 },
  toggleButton: { marginTop: 10, padding: 10, backgroundColor: '#4A4A6A', borderRadius: 5, alignItems: 'center' },
  toggleButtonText: { color: 'white', fontSize: 16 },
  correctAnswerContainer: { marginTop: 10, padding: 10, backgroundColor: '#33AC72', borderRadius: 5 },
  correctAnswerText: { color: 'white', fontSize: 16, textAlign: 'center' },
  errorText: { color: '#FF6347', textAlign: 'center', fontSize: 16 },
});

export default QuantitativeResult;
