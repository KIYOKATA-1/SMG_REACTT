import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { IUserTestResults, UserTestResultQuestions, FlagType, SingleSelectQuestion, MultipleSelectQuestion } from '../services/test/test.types';
import { useSession } from '../lib/useSession';

interface TestResultPageProps {
  testResult: IUserTestResults;
  userTestId: number | null;
  navigation: any;
}

const TestResultPage: React.FC<TestResultPageProps> = ({ testResult, userTestId, navigation }) => {
  const { getSession } = useSession();
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<{ [key: number]: boolean }>({});

  const toggleShowCorrectAnswer = (questionId: number) => {
    setShowCorrectAnswer((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const renderAnswerOption = (option, isSelected, isCorrect, index) => (
    <View
      key={index}
      style={[
        styles.optionContainer,
        isSelected
          ? isCorrect
            ? styles.correctAnswer
            : styles.incorrectAnswer
          : styles.defaultAnswer,
      ]}
    >
      <Text style={styles.optionText}>{option.text}</Text>
    </View>
  );

  const renderQuestion = ({ item }: { item: UserTestResultQuestions }) => {
    const { user_answer, correct_answer, test_question_data } = item;
    const isShowCorrect = showCorrectAnswer[item.id];
    const questionWithOptions = test_question_data as SingleSelectQuestion | MultipleSelectQuestion;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{test_question_data.description.text}</Text>

        <Text style={styles.subHeader}>Ваш ответ:</Text>
        <View style={styles.optionsContainer}>
  {questionWithOptions.options?.options?.map((option, index) => {
    const isSelected = Array.isArray(user_answer.answer)
      ? user_answer.answer.some((ans) => typeof ans === 'object' && ans.text === option.text)
      : typeof user_answer.answer === 'object' && user_answer.answer?.text === option.text;

    const isCorrect = Array.isArray(correct_answer.answer)
      ? correct_answer.answer.some((ans) => typeof ans === 'object' && ans.text === option.text)
      : typeof correct_answer.answer === 'object' && correct_answer.answer?.text === option.text;

    return renderAnswerOption(option, isSelected, isCorrect, index);
  })}
</View>


        {isShowCorrect && (
          <>
            <Text style={styles.subHeader}>Правильный ответ:</Text>
            <View style={styles.optionsContainer}>
              {questionWithOptions.options?.options.map((option, index) => {
                const isCorrect = Array.isArray(correct_answer.answer)
                  ? correct_answer.answer.some((ans) => typeof ans === 'object' && ans.text === option.text)
                  : typeof correct_answer.answer === 'object' && correct_answer.answer?.text === option.text;

                return isCorrect ? renderAnswerOption(option, true, true, index) : null;
              })}
            </View>
          </>
        )}

        <Button
          title={isShowCorrect ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
          onPress={() => toggleShowCorrectAnswer(item.id)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Результаты теста</Text>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Всего правильных ответов: {testResult.correct_count} из {testResult.user_answers.length}</Text>
        <Text style={styles.resultText}>Балл: {((Number(testResult.correct_count) / testResult.user_answers.length) * 100).toFixed(1)}%</Text>
      </View>
      <FlatList
        data={testResult.user_answers}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderQuestion}
      />
      <Button title="Назад к курсу" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1B1423' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'white' },
  resultContainer: { marginBottom: 20, alignItems: 'center' },
  resultText: { fontSize: 18, color: 'white' },
  questionContainer: { marginBottom: 20, padding: 10, backgroundColor: '#2A1A40', borderRadius: 10 },
  questionText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  subHeader: { fontSize: 16, color: '#8B94A3', marginTop: 10 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  optionContainer: { padding: 10, borderRadius: 5, margin: 5 },
  optionText: { color: 'white', fontSize: 14 },
  correctAnswer: { backgroundColor: '#33AC72' },
  incorrectAnswer: { backgroundColor: '#FF6347' },
  defaultAnswer: { backgroundColor: '#130F18' },
});

export default TestResultPage;