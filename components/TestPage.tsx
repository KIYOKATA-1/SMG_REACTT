import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, SafeAreaView, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestService } from '../services/test/test.service';
import { TestWrapper, UserAnswer, IUserTestResults, TestData, ITestQuestions, UserTestResultQuestions } from '../services/test/test.types';
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
  const [testResult, setTestResult] = useState<IUserTestResults | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [session, setSession] = useState<string | null>(null);

  const defaultTestData: TestData = {
    id: testId,
    description: "Описание по умолчанию",
    duration: 0,
    is_visible: false,
    name: "Название теста по умолчанию",
    test_type: 0,
  };

  const transformQuestions = (questions: ITestQuestions[]): UserTestResultQuestions[] => {
    return questions.map((question) => ({
      ...question,
      correct_answer: question.correct_answer || {},
      flag: question.flag,
      test_question_data: question.test_question_data,
      user_answer: question.user_answer,
      is_answered: question.is_answered,
      score_for_answer: question.score_for_answer || '0',
      checked: question.checked ?? false,
      user: question.user,
      user_test: question.user_test,
      test_question: question.test_question,
      course: question.course,
      order: question.order,
    }));
  };

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
            setTestResult(result);
            setLoading(false);
            return;
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
        console.error("Ошибка при загрузке теста:", error);
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
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
          if (userTestId) {
            const result = await TestService.endTest(session, userTestId);
            const transformedQuestions = transformQuestions(testData.results);

            setTestResult({ 
              ...result,
              correct_count: result.total,
              user_answers: transformedQuestions,
              ended_time: new Date().toISOString(),
              id: userTestId,
              is_ended: true,
              order: 0,
              score: result.total.toString(),
              test_data: defaultTestData,
              user_data: { id: 0, full_name: "" },
            });

            await AsyncStorage.removeItem(`userTestId_${testId}`);
          } else {
            console.error("Ошибка: userTestId не найден");
          }
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

  if (testResult) {
    const totalQuestions = testResult.user_answers.length;
    const correctAnswersCount = Number(testResult.correct_count);     
    const completionPercentage = ((correctAnswersCount / totalQuestions) * 100).toFixed(1);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.header}>Результаты теста</Text>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}> 
          <Text style={styles.score}>Ответы: {correctAnswersCount} / {totalQuestions}</Text>
          <Text style={styles.score}>Балл: {completionPercentage}%</Text>
          </View>
          <Button title="Назад к курсу" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
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
  score: { fontSize: 18, marginVertical: 10 },
  resultContainer:{display: 'flex', borderWidth: 1, width: '100%', padding: 20,}
});

export default TestPage;
