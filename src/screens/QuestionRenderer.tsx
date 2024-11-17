import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ITestQuestions, UserAnswer, QuestionType, TestQuestion, MatchQuestion } from '../../services/test/test.types';
import MatchAnswer from '../../components/Questions/MatchAnswer';
import MultipleAnswer from '../../components/Questions/MultipleAnswer';
import SingleAnswer from '../../components/Questions/SingleAnswer';
import ShortOpenAnswer from '../../components/Questions/ShortOpenAnswer';
import QuantitativeCharacteristicsAnswer from '../../components/Questions/QuantitativeCharacteristicsAnswer';
import OpenParagraphAnswer from '../../components/Questions/OpenParagraphAnswer';
import DragDropAnswer from '../../components/Questions/DragDropAnswer';

interface QuestionRendererProps {
  question: ITestQuestions;
  onAnswer: (answer: UserAnswer) => void;
  isLastQuestion: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, isLastQuestion }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ text: string; img?: string }[]>([]);
  const [matchResults, setMatchResults] = useState<{ [key: string]: string }>({});
  const [shortOpenAnswer, setShortOpenAnswer] = useState<string>('');
  const [quantitativeAnswer, setQuantitativeAnswer] = useState<string | null>(null);
  const [openParagraphAnswer, setOpenParagraphAnswer] = useState<string>('');
  const [dropAnswers, setDropAnswers] = useState<Record<string, string[]>>({}); // State для DragDrop

  const isMultipleSelect = question.test_question_data.question_type === QuestionType.MultipleSelect;
  const isMatch = question.test_question_data.question_type === QuestionType.Match;
  const isShortOpen = question.test_question_data.question_type === QuestionType.ShortOpen;
  const isQuantitative = question.test_question_data.question_type === QuestionType.QuantitativeCharacteristics;
  const isOpenParagraph = question.test_question_data.question_type === QuestionType.OpenParagraph;
  const isDragDrop = question.test_question_data.question_type === QuestionType.DragDrop;

  const handleSelect = (option: { text: string; img?: string }) => {
    if (isMultipleSelect) {
      setSelectedAnswers((prev) =>
        prev.some((item) => item.text === option.text)
          ? prev.filter((item) => item.text !== option.text)
          : [...prev, option]
      );
    } else if (!isMatch && !isQuantitative) {
      setSelectedAnswers([option]);
    }
  };

  const getOptions = (questionData: TestQuestion) => {
    if (
      questionData.question_type === QuestionType.SingleSelect ||
      questionData.question_type === QuestionType.MultipleSelect
    ) {
      return questionData.options?.options || [];
    }
    if (questionData.question_type === QuestionType.Match) {
      return (questionData as MatchQuestion).options;
    }
    if (
      questionData.question_type === QuestionType.QuantitativeCharacteristics ||
      questionData.question_type === QuestionType.DragDrop
    ) {
      return questionData.options;
    }
    return [];
  };

  const renderOptions = () => {
    const options = getOptions(question.test_question_data);

    if (isMatch && options && 'left' in options && 'right' in options) {
      return (
        <MatchAnswer
          options={options}
          setAnswer={setMatchResults}
          answer={matchResults}
        />
      );
    } else if (isShortOpen) {
      return (
        <ShortOpenAnswer
          answer={{ answer: shortOpenAnswer }}
          setAnswer={setShortOpenAnswer}
        />
      );
    } else if (isQuantitative && 'options' in options) {
      return (
        <QuantitativeCharacteristicsAnswer
          options={options as { options: string[] }}
          setAnswer={(selectedAnswer) => setQuantitativeAnswer(selectedAnswer)}
          answer={question.user_answer as { answer: string } | null}
        />
      );
    } else if (isOpenParagraph) {
      return (
        <OpenParagraphAnswer
          answer={{ answer: openParagraphAnswer }}
          setAnswer={(text) => setOpenParagraphAnswer(text)}
        />
      );
    } else if (isDragDrop) {
      return (
        <DragDropAnswer
          options={options as { categories: string[]; options: { [index: string]: { text: string; img?: string } }[] }}
          setAnswer={setDropAnswers}
          answer={dropAnswers}
        />
      );
    } else if (Array.isArray(options) && options.length > 0) {
      return (
        <FlatList
          data={options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.option,
                selectedAnswers.some((answer) => answer.text === item.text) ? styles.selectedOption : {},
              ]}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.optionText}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      );
    } else {
      return <Text>Опции не найдены для данного вопроса.</Text>;
    }
  };

  const submitAnswer = () => {
    if (!isMatch && !isShortOpen && !isQuantitative && !isOpenParagraph && !isDragDrop && selectedAnswers.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы один ответ перед отправкой.');
      return;
    }

    let formattedAnswer: UserAnswer;
    if (isMatch) {
      formattedAnswer = { answer: matchResults };
    } else if (isMultipleSelect) {
      formattedAnswer = { answer: selectedAnswers.map((ans) => ({ text: ans.text, img: ans.img })) };
    } else if (isShortOpen) {
      formattedAnswer = { answer: shortOpenAnswer };
    } else if (isQuantitative) {
      formattedAnswer = { answer: quantitativeAnswer || '' };
    } else if (isOpenParagraph) {
      formattedAnswer = { answer: openParagraphAnswer };
    } else if (isDragDrop) {
      formattedAnswer = { answer: dropAnswers };
    } else {
      formattedAnswer = { answer: { text: selectedAnswers[0].text, img: selectedAnswers[0].img } };
    }

    console.log('Отправляемый ответ:', JSON.stringify(formattedAnswer));
    onAnswer(formattedAnswer);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.test_question_data.description.text}</Text>
      {renderOptions()}
      <Button title={isLastQuestion ? 'Завершить' : 'Ответить'} onPress={submitAnswer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20, padding: 10 },
  questionText: { fontSize: 18, marginBottom: 10 },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#add8e6',
  },
  optionText: { fontSize: 16 },
});

export default QuestionRenderer;
