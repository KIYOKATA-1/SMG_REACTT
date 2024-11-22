import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { UserTestResultQuestions } from '../../services/test/test.types';
import { TestService } from '../../services/test/test.service';
import { useSession } from '../../lib/useSession';

interface OpenParagraphResultProps {
  question: UserTestResultQuestions;
  refetch?: () => void;
}

const OpenParagraphResult: React.FC<OpenParagraphResultProps> = ({ question, refetch }) => {
  const { getSession } = useSession();
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [score, setScore] = useState(question.score_for_answer !== '0.00' ? question.score_for_answer : '');
  const [error, setError] = useState<string | null>(null);

  const userAnswerOpen = question.user_answer.answer && typeof question.user_answer.answer === 'string'
    ? question.user_answer.answer
    : '';

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setSessionKey(session.key);
      } else {
        Alert.alert('Ошибка', 'Не удалось получить сессию пользователя.');
      }
    };

    fetchSession();
  }, [getSession]);

  const handleInputChange = (text: string) => {
    if (!isNaN(Number(text))) {
      if (Number(text) > Number(question.test_question_data.score)) {
        setError(`Оценка не может превышать максимальный балл ${question.test_question_data.score}`);
      } else {
        setError(null);
        setScore(text);
      }
    }
  };

  const handleAnswerScore = useCallback(async () => {
    if (!sessionKey || error || !refetch) return;

    try {
      await TestService.changeScoreForAnswer(sessionKey, question.id, score);
      Alert.alert('Успех', 'Оценка успешно сохранена');
      refetch();
    } catch (error) {
      console.error('Error updating score:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить оценку');
    }
  }, [sessionKey, score, error, refetch]);

  return (
    <View style={styles.container}>
      <Text style={styles.answerText}>Ответ пользователя:</Text>
      <View style={styles.answerContainer}>
        <Text style={styles.userAnswer}>{userAnswerOpen}</Text>
      </View>

      {refetch && (
        <View style={styles.scoreContainer}>
          <TextInput
            style={styles.scoreInput}
            placeholder="Выставите балл"
            placeholderTextColor="#888"
            value={score}
            onChangeText={handleInputChange}
            keyboardType="numeric"
          />
          <Text style={styles.maxScoreText}>Макс. балл: {question.test_question_data.score}</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button title="Сохранить" onPress={handleAnswerScore} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#263546',
    borderRadius: 8,
    marginBottom: 20,
  },
  answerText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  answerContainer: {
    backgroundColor: '#FFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  userAnswer: {
    color: '#202942',
    fontSize: 16,
  },
  scoreContainer: {
    marginTop: 10,
  },
  scoreInput: {
    backgroundColor: '#130F18',
    color: 'white',
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    width: 80,
  },
  maxScoreText: {
    color: '#E1E1E1',
    marginTop: 5,
  },
  errorText: {
    color: '#FF6347',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default OpenParagraphResult;
