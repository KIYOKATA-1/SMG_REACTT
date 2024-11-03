import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface MatchAnswerProps {
  options: {
    left: { [index: string]: { text: string; img?: string } }[];
    right: { [index: string]: { text: string; img?: string } }[];
  };
  setAnswer: (answer: { [key: string]: string }) => void;
  answer: { [key: string]: string } | null;
}

const MatchAnswer: React.FC<MatchAnswerProps> = ({ options, setAnswer, answer }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchResults, setMatchResults] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (answer && JSON.stringify(answer) !== JSON.stringify(matchResults)) {
      setMatchResults(answer);
    }
  }, [answer]);

  useEffect(() => {
    setAnswer(matchResults);
  }, [matchResults, setAnswer]);

  const handleLeftSelect = (leftText: string) => {
    setSelectedLeft(leftText === selectedLeft ? null : leftText);
  };

  const handleRightSelect = (rightText: string) => {
    if (selectedLeft) {
      setMatchResults((prev) => {
        const updatedResults = { ...prev };

        Object.keys(updatedResults).forEach((key) => {
          if (updatedResults[key] === rightText) {
            delete updatedResults[key];
          }
        });

        updatedResults[selectedLeft] = rightText;
        return updatedResults;
      });

      setSelectedLeft(null);
    }
  };

  const leftOptions = options.left.map(item => Object.values(item)[0]);
  const rightOptions = options.right.map(item => Object.values(item)[0]);

  const renderOption = (
    item: { text: string; img?: string },
    isSelected: boolean,
    isMatched: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.option,
        isSelected ? styles.selectedOption : {},
        isMatched ? styles.matchedOption : {},
      ]}
      onPress={onPress}
    >
      <Text style={styles.optionText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={[{ key: 'match' }]}
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.questionText}>Подберите соответствия</Text>
          <View style={styles.matchContainer}>
            <View style={styles.column}>
              {leftOptions.map((item, index) => (
                <React.Fragment key={index}>
                  {renderOption(
                    item,
                    selectedLeft === item.text,
                    Boolean(matchResults[item.text]),
                    () => handleLeftSelect(item.text)
                  )}
                </React.Fragment>
              ))}
            </View>

            <View style={styles.column}>
              {rightOptions.map((item, index) => (
                <React.Fragment key={index}>
                  {renderOption(
                    item,
                    matchResults[selectedLeft || ''] === item.text,
                    Object.values(matchResults).includes(item.text),
                    () => handleRightSelect(item.text)
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  questionText: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  matchContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, paddingHorizontal: 10 },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedOption: { backgroundColor: '#add8e6' },
  matchedOption: { backgroundColor: '#d3ffd3' },
  optionText: { fontSize: 16 },
});

export default MatchAnswer;
