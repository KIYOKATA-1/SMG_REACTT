import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserTestResultQuestions, MultipleSelectQuestion } from '../../services/test/test.types';

const MultipleResult: React.FC<{ question: UserTestResultQuestions }> = ({ question }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const multipleSelectQuestion = question.test_question_data as MultipleSelectQuestion;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Ваш ответ:</Text>
      {multipleSelectQuestion.options.options.map((option, index) => {
        const isCorrect =
          Array.isArray(question.correct_answer.answer) &&
          question.correct_answer.answer.some((ans) => ans.text === option.text);
        const isSelected =
          Array.isArray(question.user_answer.answer) &&
          question.user_answer.answer.some((ans) => ans.text === option.text);

        return (
          <View
            key={index}
            style={[
              styles.optionContainer,
              isSelected ? (isCorrect ? styles.correct : styles.incorrect) : styles.defaultOption,
            ]}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowCorrectAnswer(!showCorrectAnswer)}
      >
        <Text style={styles.toggleButtonText}>
          {showCorrectAnswer ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
        </Text>
      </TouchableOpacity>
      {showCorrectAnswer && (
        <>
          <Text style={styles.sectionHeader}>Правильные ответы:</Text>
          {Array.isArray(question.correct_answer.answer) &&
            question.correct_answer.answer.map((correct, index) => (
              <View key={index} style={styles.correctAnswerContainer}>
                <Text style={styles.correctAnswerText}>{correct.text}</Text>
              </View>
            ))}
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
  incorrect: { backgroundColor: '#FF6347' },
  defaultOption: { backgroundColor: '#130F18' },
  optionText: { color: 'white', fontSize: 16 },
  toggleButton: { marginTop: 10, padding: 10, backgroundColor: '#4A4A6A', borderRadius: 5, alignItems: 'center' },
  toggleButtonText: { color: 'white', fontSize: 16 },
  correctAnswerContainer: { padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#274A78' },
  correctAnswerText: { color: 'white', fontSize: 16 },
});

export default MultipleResult;
