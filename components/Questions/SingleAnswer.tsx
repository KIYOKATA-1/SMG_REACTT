import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ITestQuestions, UserAnswer, SingleSelectQuestion } from '../../services/test/test.types';

interface SingleAnswerProps {
  question: ITestQuestions;
  onAnswer: (answer: UserAnswer) => void;
}

const SingleAnswer: React.FC<SingleAnswerProps> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const options = (question.test_question_data as SingleSelectQuestion).options.options;

  const handleSelect = (optionText: string) => {
    setSelectedOption(optionText);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      Alert.alert('Ошибка', 'Выберите ответ перед отправкой.');
      return;
    }
    onAnswer({ answer: { text: selectedOption } });
  };

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity key={option.text} onPress={() => handleSelect(option.text)}>
          <Text style={{ color: selectedOption === option.text ? 'blue' : 'black' }}>{option.text}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Ответить</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SingleAnswer;
