import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserTestResultQuestions, MatchQuestion } from '../../services/test/test.types';

const MatchResult: React.FC<{ question: UserTestResultQuestions }> = ({ question }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const matchQuestion = question.test_question_data as MatchQuestion;
  const userAnswer = question.user_answer?.answer as { [key: string]: string } | undefined;
  const correctAnswer = question.correct_answer?.answer as { [key: string]: string } | undefined;

  if (!matchQuestion || !userAnswer || !correctAnswer) {
    return <Text style={styles.errorText}>Ответы или данные вопроса недоступны</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Ваш ответ:</Text>
      {Object.entries(userAnswer).map(([leftKey, rightKey], index) => {
        const isCorrect = correctAnswer[leftKey] === rightKey;
        const leftOption = matchQuestion.options.left[parseInt(leftKey, 10)];
        const rightOption = matchQuestion.options.right[parseInt(rightKey, 10)];

        return (
          <View key={index} style={[styles.matchRow, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.optionText}>{leftOption?.[0]?.text || '—'}</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.optionText}>{rightOption?.[0]?.text || '—'}</Text>
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
          {Object.entries(correctAnswer).map(([leftKey, rightKey], index) => {
            const leftOption = matchQuestion.options.left[parseInt(leftKey, 10)];
            const rightOption = matchQuestion.options.right[parseInt(rightKey, 10)];

            return (
              <View key={index} style={[styles.matchRow, styles.correct]}>
                <Text style={styles.optionText}>{leftOption?.[0]?.text || '—'}</Text>
                <Text style={styles.arrow}>→</Text>
                <Text style={styles.optionText}>{rightOption?.[0]?.text || '—'}</Text>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#1B1423', borderRadius: 6, marginVertical: 10 },
  sectionHeader: { fontSize: 18, color: 'white', marginBottom: 10 },
  matchRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  optionText: { fontSize: 16, color: '#FFFFFF' },
  arrow: { fontSize: 16, color: '#FFFFFF', marginHorizontal: 5 },
  correct: { backgroundColor: '#33AC72', padding: 10, borderRadius: 5 },
  incorrect: { backgroundColor: '#FF6347', padding: 10, borderRadius: 5 },
  toggleButton: { marginTop: 10, padding: 10, backgroundColor: '#4A4A6A', borderRadius: 5, alignItems: 'center' },
  toggleButtonText: { color: 'white', fontSize: 16 },
  errorText: { fontSize: 16, color: '#FF6347', textAlign: 'center', marginVertical: 10 },
});

export default MatchResult;
