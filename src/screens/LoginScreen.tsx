import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { AuthService } from '../../services/auth/auth.service';
import { LoginStyle } from '../../styles/Login';
import { MaskedTextInput } from 'react-native-mask-text';
import IMAGES from '../../assets/img/image';
import { useSession } from '../../lib/useSession';
import { StackNavigationProp } from '@react-navigation/stack';
import { ISession } from '../../services/auth/auth.types';

type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  DrawerNavigator: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('+7');
  const [password, setPassword] = useState('');
  const { saveSession } = useSession();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = useCallback(async () => {
    try {
      const response: ISession = await AuthService.login(username, password); // Ожидаем ISession
      if (response && response.key) {
        console.log('Токен:', response.key);
        console.log('Роль пользователя:', response.user.role);
        console.log('Статус пользователя (is_offline):', response.user.is_offline);
  
        // Сохраняем сессию
        await saveSession(response);
  
        // Проверяем роль пользователя и статус is_offline
        if (response.user.role === 0) {
          if (response.user.is_offline) {
            navigation.replace('DrawerNavigator'); // Запускаем приложение
          } else {
            Alert.alert(
              'Доступ запрещен',
              'Для доступа обратитесь в ближайший филиал SMG Education.'
            );
          }
        } else {
          Alert.alert(
            'Доступ запрещен',
            'Приложение доступно только для учеников.'
          );
        }
      } else {
        throw new Error('Не удалось получить токен.');
      }
    } catch (error: unknown) {
      if (typeof error === 'string') {
        Alert.alert('Ошибка', error);
      } else if (error instanceof Error) {
        Alert.alert('Ошибка', error.message);
      } else {
        Alert.alert('Ошибка', 'Произошла неизвестная ошибка.');
      }
    }
  }, [username, password, saveSession, navigation]);
  

  return (
    <SafeAreaView style={LoginStyle.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Animated.View style={[LoginStyle.loginContainer, { opacity: fadeAnim }]}>
            <View style={LoginStyle.imageContainer}>
              <Image source={IMAGES.LOGIN_LOGO} style={LoginStyle.logo} />
            </View>

            <View style={LoginStyle.inputContainer}>
              <MaskedTextInput
                mask="+79999999999"
                value={username}
                onChangeText={setUsername}
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
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
