import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserTestResultQuestions, MultipleSelectQuestion } from '../../services/test/test.types';

const MultipleResult: React.FC<{ question: UserTestResultQuestions }> = ({ question }) => {
  const multipleSelectQuestion = question.test_question_data as MultipleSelectQuestion;

  return (
    <View>
      <Text style={styles.sectionHeader}>Ваш ответ:</Text>
      {multipleSelectQuestion.options.options.map((option, index) => {
        const isCorrect =
          Array.isArray(question.correct_answer.answer) &&
          question.correct_answer.answer.some(
            (ans) => ans.text === option.text
          );
        const isSelected =
          Array.isArray(question.user_answer.answer) &&
          question.user_answer.answer.some(
            (ans) => ans.text === option.text
          );

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
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: { fontSize: 18, color: '#8B94A3', marginBottom: 10 },
  optionContainer: { padding: 10, marginVertical: 5, borderRadius: 5 },
  correct: { backgroundColor: '#33AC72' },
  incorrect: { backgroundColor: '#FF6347' },
  defaultOption: { backgroundColor: '#130F18' },
  optionText: { color: 'white', fontSize: 16 },
});

export default MultipleResult;
