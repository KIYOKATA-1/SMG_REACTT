import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ShortOpenAnswerProps {
  answer: { answer: string } | null;
  setAnswer: (option: string) => void;
}

const ShortOpenAnswer: React.FC<ShortOpenAnswerProps> = ({ answer, setAnswer }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (value: string) => {
    setInputValue(value);
    setAnswer(value); 
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
      <Text style={styles.promptText}>Впишите свой ответ</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваш ответ"
        value={inputValue}
        onChangeText={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  promptText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  input: {
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    color: '#333',
  },
});

export default ShortOpenAnswer;
