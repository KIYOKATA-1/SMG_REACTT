import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface MatchAnswerProps {
  options: {
    left: { [index: string]: { text: string; img?: string } }[];
    right: { [index: string]: { text: string; img?: string } }[];
  };
  setAnswer: (answer: { [key: string]: string }) => void;
  answer: { [key: string]: string } | null;
}

interface Connection {
  source: number;
  target: number;
}

const MatchAnswer: React.FC<MatchAnswerProps> = ({ options, setAnswer, answer }) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [matchResults, setMatchResults] = useState<{ [key: string]: string }>({});
  const prevMatchResultsRef = useRef<{ [key: string]: string }>({});

  const handleLeftClick = (index: number) => {
    setSelectedLeft(index);
  };

  const handleRightClick = (index: number) => {
    if (selectedLeft !== null) {
      let updatedConnections = connections.filter((conn) => conn.target !== index);
      updatedConnections = updatedConnections.filter((conn) => conn.source !== selectedLeft);

      const newConnection = { source: selectedLeft, target: index };
      updatedConnections.push(newConnection);
      setConnections(updatedConnections);

      const updatedResults = { ...matchResults };
      updatedResults[selectedLeft.toString()] = index.toString();
      setMatchResults(updatedResults);

      setSelectedLeft(null);
    }
  };

  useEffect(() => {
    if (JSON.stringify(prevMatchResultsRef.current) !== JSON.stringify(matchResults)) {
      setAnswer(matchResults);
      prevMatchResultsRef.current = matchResults;
    }
  }, [matchResults, setAnswer]);

  useEffect(() => {
    if (answer) {
      const newMatchResults: { [key: string]: string } = {};
      const newConnections: Connection[] = [];

      for (const [sourceKey, targetKey] of Object.entries(answer)) {
        const sourceIndex = parseInt(sourceKey, 10);
        const targetIndex = parseInt(targetKey, 10);
        newConnections.push({ source: sourceIndex, target: targetIndex });
        newMatchResults[sourceKey] = targetKey;
      }

      if (JSON.stringify(matchResults) !== JSON.stringify(newMatchResults)) {
        setConnections(newConnections);
        setMatchResults(newMatchResults);
      }
    } else {
      if (Object.keys(matchResults).length > 0) {
        setConnections([]);
        setMatchResults({});
      }
    }
  }, [answer]);

  const renderLeftOptions = () => (
    <FlatList
      data={options.left}
      keyExtractor={(_, index) => `left-${index}`}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={[styles.option, selectedLeft === index ? styles.selectedOption : styles.defaultOption]}
          onPress={() => handleLeftClick(index)}
        >
          <Text style={styles.optionText}>{item[index].text}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderRightOptions = () => (
    <FlatList
      data={options.right}
      keyExtractor={(_, index) => `right-${index}`}
      renderItem={({ item, index }) => (
        <TouchableOpacity style={styles.option} onPress={() => handleRightClick(index)}>
          <Text style={styles.optionText}>{item[index].text}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подберите соответствия</Text>
      <View style={styles.optionsContainer}>
        {renderLeftOptions()}
        {renderRightOptions()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  option: { padding: 10, margin: 5, borderRadius: 5, backgroundColor: '#21192A', minWidth: 100 },
  optionText: { color: 'white', textAlign: 'center' },
  selectedOption: { backgroundColor: '#531894' },
  defaultOption: { backgroundColor: '#21192A' },
});

export default MatchAnswer;
