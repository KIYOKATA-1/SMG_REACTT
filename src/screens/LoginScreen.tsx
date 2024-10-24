import React, { useState, useCallback } from 'react';
import { View, Text, Alert, SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthService } from '../../services/auth.service';
import { LoginStyle } from '../../styles/Login';
import { MaskedTextInput } from 'react-native-mask-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IMAGES from '../../assets/img/image';

type RootStackParamList = {
  TabNavigator: undefined;
};

const LoginScreen = () => {
  const [username, setUsername] = useState('+7');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = useCallback(async () => {
    try {
      const response = await AuthService.login(username, password);
      if (response && response.key) {
        await AsyncStorage.setItem('token', response.key); // Сохранение токена
        console.log('Токен сохранен:', response.key); // Логирование токена
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        });
      } else {
        throw new Error('Не удалось получить токен.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Ошибка', error.message);
      } else {
        Alert.alert('Ошибка', 'Произошла неизвестная ошибка.');
      }
    }
  }, [username, password, navigation]);

  return (
    <SafeAreaView style={LoginStyle.container}>
      <View style={LoginStyle.loginContainer}>
        <View style={LoginStyle.imageContainer}>
          <Image source={IMAGES.LOGIN_LOGO} style={LoginStyle.logo} />
        </View>

        <View style={LoginStyle.inputContainer}>
          <MaskedTextInput
            mask="+79999999999"
            value={username}
            onChangeText={(text) => setUsername(text)}
            keyboardType="phone-pad"
            placeholder="Номер телефона"
            style={LoginStyle.input}
          />

          <TextInput
            placeholder="Пароль"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={LoginStyle.input}
          />
        </View>

        <TouchableOpacity style={LoginStyle.loginBtn} onPress={handleLogin}>
          <Text style={LoginStyle.btnText}>Войти</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
