import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import {
  IUserTestResults,
  UserTestResultQuestions,
  SingleSelectQuestion,
  MultipleSelectQuestion,
  FlagType,
} from '../../services/test/test.types';

interface TestResultPageProps {
  testResult: IUserTestResults;
  navigation: any;
}

const TestResultPage: React.FC<TestResultPageProps> = ({ testResult, navigation }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<{ [key: number]: boolean }>({});
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const toggleShowCorrectAnswer = (questionId: number) => {
    setShowCorrectAnswer((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

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

  const renderAnswerOption = (option: any, isSelected: boolean, isCorrect: boolean, index: number) => (
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

  const isTextOption = (answer: any): answer is { text: string } => {
    return typeof answer === 'object' && answer !== null && 'text' in answer;
  };

  const renderSelectedQuestion = (question: UserTestResultQuestions) => {
    const { user_answer, correct_answer, test_question_data } = question;
    const isShowCorrect = showCorrectAnswer[question.id];
    const questionText = test_question_data.description.text || 'Вопрос без текста';
    const correctAnswerExists = correct_answer && correct_answer.answer;

    const options =
      (test_question_data as SingleSelectQuestion | MultipleSelectQuestion).options?.options || [];

    return (
      <View style={styles.questionContainer} key={question.id}>
        <Text style={styles.questionText}>{`Вопрос ${question.order + 1}: ${questionText}`}</Text>
        <Text style={styles.subHeader}>Ваш ответ:</Text>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected =
              Array.isArray(user_answer.answer)
                ? user_answer.answer.some(
                    (ans) => isTextOption(ans) && ans.text === option.text
                  )
                : isTextOption(user_answer.answer) && user_answer.answer.text === option.text;

            const isCorrect =
              Array.isArray(correct_answer.answer)
                ? correct_answer.answer.some(
                    (ans) => isTextOption(ans) && ans.text === option.text
                  )
                : isTextOption(correct_answer.answer) && correct_answer.answer.text === option.text;

            return renderAnswerOption(option, isSelected, isCorrect, index);
          })}
        </View>

        {isShowCorrect && correctAnswerExists && (
          <>
            <Text style={styles.subHeader}>Правильный ответ:</Text>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => {
                const isCorrect =
                  Array.isArray(correct_answer.answer)
                    ? correct_answer.answer.some(
                        (ans) => isTextOption(ans) && ans.text === option.text
                      )
                    : isTextOption(correct_answer.answer) && correct_answer.answer.text === option.text;

                return isCorrect ? renderAnswerOption(option, true, true, index) : null;
              })}
            </View>
          </>
        )}

        {!correctAnswerExists && (
          <Text style={styles.noAnswerText}>Правильный ответ отсутствует</Text>
        )}

        <Button
          title={isShowCorrect ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
          onPress={() => toggleShowCorrectAnswer(question.id)}
        />
      </View>
    );
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

      {/* Отображаем выбранный вопрос */}
      {selectedQuestion !== null && renderSelectedQuestion(testResult.user_answers.find(q => q.id === selectedQuestion)!)}

      <Button title="Назад к курсу" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1B1423' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  percentageText: { fontSize: 18, color: '#8B94A3', marginBottom: 10 },
  questionContainer: { marginBottom: 20, padding: 10, backgroundColor: '#2A1A40', borderRadius: 10 },
  questionText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  subHeader: { fontSize: 16, color: '#8B94A3', marginTop: 10 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  optionContainer: { padding: 10, borderRadius: 5, margin: 5 },
  correctAnswer: { backgroundColor: '#33AC72' },
  incorrectAnswer: { backgroundColor: '#FF6347' },
  defaultAnswer: { backgroundColor: '#130F18' },
  optionText: { color: 'white', fontSize: 16 },
  noAnswerText: { fontSize: 16, color: 'red', marginTop: 5 },
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
