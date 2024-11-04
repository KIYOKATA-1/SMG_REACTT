import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface OpenParagraphAnswerProps {
  answer: { answer: string } | null;
  setAnswer: (option: string) => void;
}

const OpenParagraphAnswer: React.FC<OpenParagraphAnswerProps> = ({ answer, setAnswer }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (text: string) => {
    setInputValue(text);
    setAnswer(text); // Отправляем ответ в родительский компонент
  };

  useEffect(() => {
    if (answer) {
      setInputValue(answer.answer);
    } else {
      setInputValue('');
    }
  }, [answer]);

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Впишите свой ответ</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Ваш ответ"
        placeholderTextColor="#888"
        value={inputValue}
        onChangeText={handleChange}
        multiline
        numberOfLines={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  instructionText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#130F18',
    color: 'white',
    borderColor: '#E1E1E1',
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 10,
    textAlignVertical: 'top',
  },
});

export default OpenParagraphAnswer;
