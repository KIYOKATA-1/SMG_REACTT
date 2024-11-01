import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { TestService } from '../services/test/test.service';
import { TestWrapper, UserAnswer } from '../services/test/test.types';
import { useSession } from '../lib/useSession';
import QuestionRenderer from '../src/screens/SingleAnswer';

interface TestPageProps {
  route: { params: { testId: number } };
  navigation: any;
}

const TestPage: React.FC<TestPageProps> = ({ route, navigation }) => {
  const { testId } = route.params;
  const { getSession } = useSession();
  const [testData, setTestData] = useState<TestWrapper | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTestId, setUserTestId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const sessionData = await getSession();
      if (!sessionData) {
        Alert.alert('Ошибка', 'Не удалось получить сессию пользователя.');
        setLoading(false);
        return;
      }
      setSession(sessionData.key);

      try {
        const response = await TestService.startTest(sessionData.key, testId);
        setUserTestId(response.user_test_id);

        const questions = await TestService.getTestQuestions(sessionData.key, response.user_test_id.toString(), null);
        setTestData(questions);
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось загрузить тест.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [getSession, testId]);

  const handleAnswerSubmission = useCallback(
    async (answer: UserAnswer) => {
      if (!session || !testData || !userTestId) return;

      try {
        const currentQuestion = testData.results[currentQuestionIndex];
        await TestService.answerTestQuestion(session, currentQuestion.id, answer);

        setTestData((prevData) => {
          if (!prevData) return prevData;

          const updatedResults = prevData.results.map((q) =>
            q.id === currentQuestion.id
              ? { ...q, is_answered: true, user_answer: answer }
              : q
          );

          return { ...prevData, results: updatedResults };
        });

        if (currentQuestionIndex < testData.results.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          await TestService.endTest(session, userTestId);
          Alert.alert('Тест завершён', 'Вы успешно завершили тест.');
          navigation.goBack();
        }
      } catch (error) {
        console.error("Ошибка при отправке ответа:", error);
        Alert.alert('Ошибка', 'Не удалось отправить ответ.');
      }
    },
    [session, testData, currentQuestionIndex, userTestId, navigation]
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!testData) {
    return (
      <View style={styles.container}>
        <Text>Вопросы не найдены.</Text>
        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Вопрос {currentQuestionIndex + 1} из {testData.count}</Text>
      <QuestionRenderer
        question={testData.results[currentQuestionIndex]}
        onAnswer={handleAnswerSubmission}
        isLastQuestion={currentQuestionIndex === testData.results.length - 1}
      />
      <View style={styles.navigationButtons}>
        {currentQuestionIndex > 0 && (
          <Button title="Назад" onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});

export default TestPage;
