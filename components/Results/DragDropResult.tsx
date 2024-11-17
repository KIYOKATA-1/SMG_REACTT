import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { UserTestResultQuestions, DragDropQuestion } from '../../services/test/test.types';

interface DragDropResultProps {
  question: UserTestResultQuestions;
}

const DragDropResult: React.FC<DragDropResultProps> = ({ question }) => {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const ddQuestion = question.test_question_data as DragDropQuestion;
  const ddCorrectAnswers = question.correct_answer as { [key: string]: string[] };
  const ddUserAnswers = question.user_answer as { [key: string]: string[] };
  const options = ddQuestion.options.options;

  // Вычисляем процент правильности для каждого ответа
  const calculateAccuracy = (
    userAnswers: { [key: string]: string[] },
    correctAnswers: { [key: string]: string[] }
  ) => {
    let totalCorrect = 0;
    let totalAnswers = 0;

    Object.entries(correctAnswers).forEach(([key, correctValues]) => {
      const userValues = userAnswers[key] || [];
      totalAnswers += correctValues.length;
      totalCorrect += userValues.filter((value) => correctValues.includes(value)).length;
    });

    return totalAnswers > 0 ? ((totalCorrect / totalAnswers) * 100).toFixed(1) : '0';
  };

  const renderAnswerSection = (
    userAnswers: { [key: string]: string[] },
    correctAnswers: { [key: string]: string[] },
    isCorrectSection: boolean
  ) => {
    return Object.entries(correctAnswers).map(([key, correctValues], index) => {
      const userValues = userAnswers[key] || [];
      const keyOption = options.find((option) => Object.keys(option)[0] === key);
      const keyContent = keyOption ? Object.values(keyOption)[0] : null;

      return (
        <View style={styles.answerRow} key={index}>
          <View style={styles.answerKey}>
            {keyContent ? (
              <>
                {keyContent.img && (
                  <Image source={{ uri: keyContent.img }} style={styles.answerImage} />
                )}
                {keyContent.text && <Text style={styles.answerText}>{keyContent.text}</Text>}
              </>
            ) : (
              <Text style={styles.answerText}>{key}</Text>
            )}
          </View>
          <FlatList
            data={isCorrectSection ? correctValues : userValues}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const itemOption = options.find((opt) => Object.keys(opt)[0] === item);
              const itemContent = itemOption ? Object.values(itemOption)[0] : null;
              const isCorrect = correctValues.includes(item);
              const itemStyle =
                isCorrectSection || isCorrect
                  ? styles.correctAnswerBox
                  : styles.incorrectAnswerBox;

              return (
                <View style={[styles.answerItem, itemStyle]} key={item}>
                  {itemContent ? (
                    <>
                      {itemContent.img && (
                        <Image source={{ uri: itemContent.img }} style={styles.answerImage} />
                      )}
                      {itemContent.text && <Text style={styles.answerText}>{itemContent.text}</Text>}
                    </>
                  ) : (
                    <Text style={styles.answerText}>{item}</Text>
                  )}
                </View>
              );
            }}
          />
        </View>
      );
    });
  };

  const accuracy = calculateAccuracy(ddUserAnswers, ddCorrectAnswers);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ваш ответ:</Text>
      {renderAnswerSection(ddUserAnswers, ddCorrectAnswers, false)}
      <Text style={styles.accuracyText}>Точность: {accuracy}%</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowCorrectAnswer(!showCorrectAnswer)}
      >
        <Text style={styles.toggleButtonText}>
          {showCorrectAnswer ? 'Скрыть правильный ответ' : 'Показать правильный ответ'}
        </Text>
      </TouchableOpacity>
      {showCorrectAnswer && (
        <>
          <Text style={styles.sectionTitle}>Правильный ответ:</Text>
          {renderAnswerSection(ddUserAnswers, ddCorrectAnswers, true)}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#1B1423',
    borderRadius: 6,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  accuracyText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  answerKey: {
    flex: 1,
    marginRight: 10,
  },
  answerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 14,
    color: 'white',
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 4,
  },
  correctAnswerBox: {
    backgroundColor: '#33AC72',
  },
  incorrectAnswerBox: {
    backgroundColor: '#F15C5C',
  },
  toggleButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4A4A6A',
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DragDropResult;
