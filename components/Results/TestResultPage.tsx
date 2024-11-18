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
import QuantitativeResult from '../../components/Results/QuantitativeResult';
import OpenParagraphResult from '../../components/Results/OpenParagraphResult';
import DragDropResult from '../../components/Results/DragDropResult';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TestResultPageProps {
  testResult: IUserTestResults;
  navigation: any;
}

const TestResultPage: React.FC<TestResultPageProps> = ({ testResult, navigation }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<UserTestResultQuestions | null>(null);

  const getColorByStatus = (status: FlagType) => {
    switch (status) {
      case FlagType.CORRECT:
        return '#33AC72'; // Зеленый для правильных ответов
      case FlagType.INCORRECT:
        return '#F15C5C'; // Красный для неправильных ответов
      case FlagType.SEMI_CORRECT:
        return '#FF984D'; // Оранжевый для частично правильных ответов
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
      case QuestionType.QuantitativeCharacteristics:
        return <QuantitativeResult question={question} />;
      case QuestionType.OpenParagraph:
        return <OpenParagraphResult question={question} />;
      case QuestionType.DragDrop:
        return <DragDropResult question={question} />;
      default:
        return <Text>Тип вопроса не поддерживается.</Text>;
    }
  };

  const scorePercentage =
    testResult.correct_count && testResult.user_answers.length
      ? ((Number(testResult.correct_count) / testResult.user_answers.length) * 100).toFixed(1)
      : '0';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Результаты теста</Text>
      <Text style={styles.percentageText}>
        Правильных ответов: {testResult.correct_count} / {testResult.user_answers.length}
      </Text>
      <Text style={styles.percentageText}>Процент успешности: {scorePercentage}%</Text>

      <View style={styles.flagsContainer}>
        {testResult.user_answers.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.questionContainerSmall,
              selectedQuestion?.id === item.id && styles.selectedQuestionContainer,
            ]}
            onPress={() => setSelectedQuestion(item)}
          >
            <View style={styles.questionFlag}>
              <Text style={styles.questionNumber}>{index + 1}</Text>
              <View style={[styles.flag, { backgroundColor: getColorByStatus(item.flag) }]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedQuestion && (
        <View style={styles.selectedQuestionContainer}>
          <Text style={styles.questionText}>
            Вопрос: {selectedQuestion.test_question_data.description?.text || 'Описание отсутствует'}
          </Text>
          {renderSelectedQuestion(selectedQuestion)}
        </View>
      )}

      <Button title="Назад к курсу" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#263546' },
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
    padding: 15,
    backgroundColor: '#5C727D',
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
  questionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
});

export default TestResultPage;
