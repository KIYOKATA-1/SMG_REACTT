import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, SafeAreaView, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestService } from '../services/test/test.service';
import { TestWrapper, UserAnswer, IUserTestResults, ITestQuestions } from '../services/test/test.types';
import { useSession } from '../lib/useSession';
import QuestionRenderer from '@/screens/QuestionRenderer';
import TestResultPage from './Results/TestResultPage';

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
  const [testResult, setTestResult] = useState<IUserTestResults | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const checkTestCompletion = async () => {
      const sessionData = await getSession();
      if (!sessionData) {
        Alert.alert('Ошибка', 'Не удалось получить сессию пользователя.');
        setLoading(false);
        return;
      }
      setSession(sessionData.key);
  
      try {
        const savedUserTestId = await AsyncStorage.getItem(`userTestId_${testId}`);
        if (savedUserTestId) {
          const result = await TestService.getTestResult(sessionData.key, savedUserTestId);
          if (result?.is_ended) {
            setTestResult(result); // Сохраняем результат теста, если он завершен
            setLoading(false);
            return; // Останавливаем дальнейшую загрузку теста
          }
        }
  
        if (savedUserTestId) {
          setUserTestId(parseInt(savedUserTestId, 10));
          const questions = await TestService.getTestQuestions(sessionData.key, savedUserTestId, null);
          setTestData(questions);
        } else {
          const response = await TestService.startTest(sessionData.key, testId);
          setUserTestId(response.user_test_id);
          await AsyncStorage.setItem(`userTestId_${testId}`, response.user_test_id.toString());
          const questions = await TestService.getTestQuestions(sessionData.key, response.user_test_id.toString(), null);
          setTestData(questions);
        }
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось загрузить тест.');
      } finally {
        setLoading(false);
      }
    };
  
    checkTestCompletion();
  }, [getSession, testId]);
  

const handleAnswerSubmission = useCallback(
  async (answer: UserAnswer) => {
    if (!session || !testData || !userTestId) return;

    try {
      const currentQuestion = testData.results[currentQuestionIndex];
      const questionType = currentQuestion.test_question_data.question_type;

      // Отправка ответа
      await TestService.answerTestQuestion(
        session,
        currentQuestion.id,
        answer,
        questionType
      );

      // Обновление состояния текущего вопроса
      setTestData((prevData) => {
        if (!prevData) return prevData;

        const updatedResults = prevData.results.map((q) =>
          q.id === currentQuestion.id
            ? { ...q, is_answered: true, user_answer: answer }
            : q
        );

        return { ...prevData, results: updatedResults };
      });

      // Завершение теста
      if (currentQuestionIndex === testData.results.length - 1) {
        setLoading(true); // Локальный индикатор загрузки
        const [endResponse, testResultData] = await Promise.all([
          TestService.endTest(session, userTestId),
          TestService.getTestResult(session, userTestId.toString()),
        ]);

        await AsyncStorage.removeItem(`userTestId_${testId}`);
        setTestResult(testResultData);
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } catch (error) {
      console.error('Ошибка при отправке ответа:', error);
      Alert.alert('Ошибка', 'Не удалось отправить ответ.');
    } finally {
      setLoading(false); // Отключение индикатора загрузки
    }
  },
  [session, testData, currentQuestionIndex, userTestId]
);

  
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#263546" />
      </View>
    );
  }

  if (testResult) {
    return (
      <TestResultPage
        testResult={testResult}
        navigation={navigation}
      />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default TestPage;
