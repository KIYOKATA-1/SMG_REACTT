import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import IMAGES from '../../assets/img/image';

const SplashScreenComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={IMAGES.LOGIN_LOGO} style={styles.image} />
      <Text style={styles.text}>Добро пожаловать!</Text>
      <ActivityIndicator size="large" color="#7C77C6" style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C77C6',
  },
});

export default SplashScreenComponent;
