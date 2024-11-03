import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserTestResultQuestions, SingleSelectQuestion } from '../../services/test/test.types';

const SingleResult: React.FC<{ question: UserTestResultQuestions }> = ({ question }) => {
  const singleSelectQuestion = question.test_question_data as SingleSelectQuestion;

  const getAnswerText = (answer: any) => {
    // Проверяем, является ли ответ объектом с полем `text`
    if (typeof answer === 'object' && !Array.isArray(answer) && answer.text) {
      return answer.text;
    }
    return '';
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>Ваш ответ:</Text>
      {singleSelectQuestion.options.options.map((option, index) => {
        const correctAnswerText = getAnswerText(question.correct_answer.answer);
        const userAnswerText = getAnswerText(question.user_answer.answer);

        const isCorrect = correctAnswerText === option.text;
        const isSelected = userAnswerText === option.text;

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

export default SingleResult;
