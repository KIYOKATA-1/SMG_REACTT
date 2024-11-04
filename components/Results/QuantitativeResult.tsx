import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuantitativeCharacteristicsQuestion, UserTestResultQuestions } from '../../services/test/test.types';

interface QuantitativeResultProps {
  question: UserTestResultQuestions;
}

const QuantitativeResult: React.FC<QuantitativeResultProps> = ({ question }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const quantitativeQuestion = question.test_question_data as QuantitativeCharacteristicsQuestion;

  // User's answer
  const userAnswer = typeof question.user_answer.answer === 'string' ? question.user_answer.answer : '';

  // Correct answer
  const correctAnswer = typeof question.correct_answer.answer === 'string' ? question.correct_answer.answer : '';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ваш ответ:</Text>
      <View style={styles.optionsContainer}>
        {quantitativeQuestion.options.options.map((option, index) => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === userAnswer;
          return (
            <View
              key={index}
              style={[
                styles.option,
                isSelected
                  ? isCorrect
                    ? styles.correctOption
                    : styles.incorrectOption
                  : styles.defaultOption,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity onPress={() => setShowCorrectAnswer(!showCorrectAnswer)}>
        <Text style={styles.toggleButton}>
          {showCorrectAnswer ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
        </Text>
      </TouchableOpacity>
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
    padding: 10,
    backgroundColor: '#1B1423',
    borderRadius: 8,
  },
  header: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  correctOption: {
    backgroundColor: '#33AC72',
  },
  incorrectOption: {
    backgroundColor: '#F15C5C',
  },
  defaultOption: {
    backgroundColor: '#130F18',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  toggleButton: {
    color: '#FFD700',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  correctAnswerContainer: {
    backgroundColor: '#33AC72',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  correctAnswerText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QuantitativeResult;
