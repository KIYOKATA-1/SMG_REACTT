import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserTestResultQuestions } from '../../services/test/test.types';

const ShortOpenResult: React.FC<{ question: UserTestResultQuestions }> = ({ question }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  if (!question || !question.user_answer || !question.correct_answer) {
    return <Text style={styles.errorText}>Данные недоступны</Text>;
  }

  const userAnswer = typeof question.user_answer.answer === 'string' ? question.user_answer.answer : 'Ответ отсутствует';
  const correctAnswer = typeof question.correct_answer.answer === 'string' ? question.correct_answer.answer : 'Нет данных';

  const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Ваш ответ:</Text>
      <View style={[styles.answerContainer, isCorrect ? styles.correctAnswerBox : styles.incorrectAnswerBox]}>
        <Text style={styles.answerText}>{userAnswer}</Text>
      </View>

      <TouchableOpacity style={styles.toggleButton} onPress={() => setShowCorrectAnswer(!showCorrectAnswer)}>
        <Text style={styles.toggleButtonText}>
          {showCorrectAnswer ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
        </Text>
      </TouchableOpacity>

      {showCorrectAnswer && (
        <View style={styles.correctAnswerContainer}>
          <Text style={styles.sectionHeader}>Правильный ответ:</Text>
          <View style={styles.correctAnswerBox}>
            <Text style={styles.answerText}>{correctAnswer}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#263546', borderRadius: 6, marginVertical: 10 },
  sectionHeader: { fontSize: 18, color: 'white', marginBottom: 10 },
  answerContainer: { padding: 10, borderRadius: 5 },
  correctAnswerBox: { backgroundColor: '#33AC72' },
  incorrectAnswerBox: { backgroundColor: '#F15C5C' },
  answerText: { color: 'white', fontSize: 16, textAlign: 'center' },
  toggleButton: { marginTop: 10, padding: 10, backgroundColor: '#202942', borderRadius: 5, alignItems: 'center' },
  toggleButtonText: { color: 'white', fontSize: 16 },
  correctAnswerContainer: { marginTop: 10 },
  errorText: { color: '#FF6347', textAlign: 'center', fontSize: 16 },
});

export default ShortOpenResult;
