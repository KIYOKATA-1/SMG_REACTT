import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ITestQuestions, UserAnswer, MultipleSelectQuestion } from '../../services/test/test.types';

interface MultipleAnswerProps {
  question: ITestQuestions;
  onAnswer: (answer: UserAnswer) => void;
}

const MultipleAnswer: React.FC<MultipleAnswerProps> = ({ question, onAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const options = (question.test_question_data as MultipleSelectQuestion).options.options;

  const handleSelect = (optionText: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionText) ? prev.filter((text) => text !== optionText) : [...prev, optionText]
    );
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы один ответ.');
      return;
    }

    const formattedAnswer: UserAnswer = { answer: selectedOptions }; // Форматируем ответ как массив строк
    console.log('Отправляемый ответ (MultipleAnswer):', JSON.stringify(formattedAnswer));
    onAnswer(formattedAnswer);
  };

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity key={option.text} onPress={() => handleSelect(option.text)}>
          <Text style={{ color: selectedOptions.includes(option.text) ? 'blue' : 'black' }}>{option.text}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Ответить</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MultipleAnswer;
