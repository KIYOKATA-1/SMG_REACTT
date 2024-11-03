import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserTestResultQuestions, MatchQuestion } from '../../services/test/test.types';

const MatchResult: React.FC<{ question: UserTestResultQuestions }> = ({ question }) => {
  const matchQuestion = question.test_question_data as MatchQuestion;
  const userAnswer = question.user_answer?.answer as { [key: string]: string };
  const correctAnswer = question.correct_answer?.answer as { [key: string]: string };

  if (!userAnswer || !correctAnswer) {
    return <Text style={styles.noAnswerText}>Ответы отсутствуют</Text>;
  }

  return (
    <View>
      <Text style={styles.sectionHeader}>Ваш ответ:</Text>
      {Object.entries(userAnswer).map(([leftKey, rightKey], index) => {
        const isCorrect = correctAnswer[leftKey] === rightKey;
        const leftOption = matchQuestion.options.left[parseInt(leftKey, 10)];
        const rightOption = matchQuestion.options.right[parseInt(rightKey, 10)];

        return (
          <View key={index} style={[styles.matchRow, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.optionText}>{leftOption[0].text}</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.optionText}>{rightOption[0].text}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: { fontSize: 18, color: '#8B94A3', marginBottom: 10 },
  matchRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  optionText: { fontSize: 16, color: '#FFFFFF' },
  arrow: { fontSize: 16, color: '#FFFFFF', marginHorizontal: 5 },
  correct: { backgroundColor: '#33AC72', padding: 10, borderRadius: 5 },
  incorrect: { backgroundColor: '#FF6347', padding: 10, borderRadius: 5 },
  noAnswerText: { color: '#FF6347', fontSize: 16, textAlign: 'center' },
});

export default MatchResult;
