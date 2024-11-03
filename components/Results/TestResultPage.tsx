import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import {
  IUserTestResults,
  UserTestResultQuestions,
  FlagType,
  QuestionType,
} from '../../services/test/test.types';
import ShortOpenResult from '../../components/Results/ShortOpenResult';
import SingleResult from '../../components/Results/SingleResult';
import MultipleResult from '../../components/Results/MultipleResult';
import MatchResult from '../../components/Results/MatchResult';

interface TestResultPageProps {
  testResult: IUserTestResults;
  navigation: any;
}

const TestResultPage: React.FC<TestResultPageProps> = ({ testResult, navigation }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const getColorByStatus = (status: FlagType) => {
    switch (status) {
      case FlagType.CORRECT:
        return '#33AC72';
      case FlagType.INCORRECT:
        return '#F15C5C';
      case FlagType.SEMI_CORRECT:
        return '#FF984D';
      case FlagType.UNTAGGED:
      default:
        return 'transparent';
    }
  };

  const renderSelectedQuestion = (question: UserTestResultQuestions) => {
    switch (question.test_question_data.question_type) {
      case QuestionType.ShortOpen:
        return <ShortOpenResult question={question} />;
      case QuestionType.SingleSelect:
        return <SingleResult question={question} />;
      case QuestionType.MultipleSelect:
        return <MultipleResult question={question} />;
      case QuestionType.Match:
        return <MatchResult question={question} />;
      default:
        return <Text>Тип вопроса не поддерживается.</Text>;
    }
  };

  const scorePercentage =
    testResult.correct_count && testResult.user_answers.length
      ? ((Number(testResult.correct_count) / testResult.user_answers.length) * 100).toFixed(1)
      : '0';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Результаты теста</Text>
      <Text style={styles.percentageText}>
        Правильных ответов: {testResult.correct_count} / {testResult.user_answers.length}
      </Text>
      <Text style={styles.percentageText}>Процент успешности: {scorePercentage}%</Text>

      {/* Вопросы с цветовыми флажками */}
      <View style={styles.flagsContainer}>
        {testResult.user_answers.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.questionContainerSmall,
              selectedQuestion === item.id && styles.selectedQuestionContainer,
            ]}
            onPress={() => setSelectedQuestion(item.id)}
          >
            <View style={styles.questionFlag}>
              <Text style={styles.questionNumber}>{index + 1}</Text>
              <View style={[styles.flag, { backgroundColor: getColorByStatus(item.flag) }]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Отображение выбранного вопроса */}
      {selectedQuestion !== null &&
        renderSelectedQuestion(testResult.user_answers.find((q) => q.id === selectedQuestion)!)}

      <Button title="Назад к курсу" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1B1423' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  percentageText: { fontSize: 18, color: '#8B94A3', marginBottom: 10 },
  flagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
  },
  questionContainerSmall: {
    padding: 5,
    alignItems: 'center',
  },
  selectedQuestionContainer: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 6,
  },
  questionFlag: {
    width: 30,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    paddingVertical: 4,
  },
  questionNumber: {
    fontSize: 12,
    color: 'white',
  },
  flag: {
    height: 10,
    width: '100%',
    marginTop: 4,
  },
});

export default TestResultPage;
