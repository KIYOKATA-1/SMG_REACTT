import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { UserTestResultQuestions } from '../../services/test/test.types';

interface ShortOpenResultProps {
  question: UserTestResultQuestions;
}

const ShortOpenResult: React.FC<ShortOpenResultProps> = ({ question }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const isShortOpenCorrect =
    typeof question.user_answer.answer === 'string' &&
    typeof question.correct_answer.answer === 'string' &&
    question.user_answer.answer.trim().toLowerCase() === question.correct_answer.answer.trim().toLowerCase();

  const userAnswer =
    typeof question.user_answer.answer === 'string'
      ? question.user_answer.answer
      : 'Неверный формат ответа';

  const correctAnswer =
    typeof question.correct_answer.answer === 'string'
      ? question.correct_answer.answer
      : 'Правильный ответ недоступен';

  return (
    <View style={styles.container}>
      <View style={styles.answerContainer}>
        <Text style={styles.headerText}>Ваш ответ:</Text>
        <Text
          style={[
            styles.answerText,
            isShortOpenCorrect ? styles.correctBackground : styles.incorrectBackground,
          ]}
        >
          {userAnswer}
        </Text>
      </View>
      <Button
        title={showCorrectAnswer ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
        onPress={() => setShowCorrectAnswer(!showCorrectAnswer)}
      />
      {showCorrectAnswer && (
        <View style={styles.correctAnswerContainer}>
          <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  answerContainer: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  answerText: {
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  correctBackground: {
    backgroundColor: '#33AC72',
  },
  incorrectBackground: {
    backgroundColor: '#F15C5C',
  },
  correctAnswerContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#33AC72',
    borderRadius: 5,
  },
  correctAnswerText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ShortOpenResult;
