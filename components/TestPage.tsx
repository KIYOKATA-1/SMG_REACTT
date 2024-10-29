import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  ActivityIndicator, 
  SafeAreaView, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { TestService } from '../services/test/test.service';
import { TestWrapper, UserAnswer } from '../services/test/test.types';
import { useSession } from '../lib/useSession';
import QuestionRenderer from '../src/screens/QuestionRenderer';

interface TestPageProps {
  route: { params: { testId: number } };
  navigation: any;
}

const TestPage: React.FC<TestPageProps> = ({ route, navigation }) => {
  const { testId } = route.params;
  const { getSession } = useSession();
  const [testData, setTestData] = useState<TestWrapper | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userTestId, setUserTestId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});

  const fetchQuestions = useCallback(async () => {
    const session = await getSession();
    if (!session) {
      Alert.alert('Ошибка', 'Не удалось получить сессию пользователя.');
      setLoading(false);
      return;
    }

    try {
      const response = await TestService.startTest(session.key, testId);
      setUserTestId(response.user_test_id);

      const questions = await TestService.getTestQuestions(session.key, response.user_test_id.toString(), null);
      setTestData(questions);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить тест.');
    } finally {
      setLoading(false);
    }
  }, [getSession, testId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = async (answer: UserAnswer) => {
    if (!testData || !userTestId) return;

    const session = await getSession();
    if (!session) {
      Alert.alert('Ошибка', 'Не удалось получить сессию пользователя.');
      return;
    }

    try {
      const currentQuestion = testData.results[currentQuestionIndex];

      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.id]: answer,
      }));

      await TestService.answerTestQuestion(session.key, currentQuestion.id, answer);

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < testData.results.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        await TestService.endTest(session.key, userTestId);
        Alert.alert('Тест завершён', 'Вы успешно завершили тест.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить ответ.');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

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
      <Text style={styles.header}>
        Вопрос {currentQuestionIndex + 1} из {testData.count}
      </Text>
      <QuestionRenderer 
        question={testData.results[currentQuestionIndex]} 
        onAnswer={handleAnswer} 
      />
      <View style={styles.navigationButtons}>
        {currentQuestionIndex > 0 && (
          <Button title="Назад" onPress={handlePrevious} />
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
