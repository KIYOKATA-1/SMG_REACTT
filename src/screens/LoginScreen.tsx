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
import { AuthService } from '../../services/auth.service';
import { LoginStyle } from '../../styles/Login';
import { MaskedTextInput } from 'react-native-mask-text';
import IMAGES from '../../assets/img/image';
import { useSession } from '../../lib/useSession';
import { StackNavigationProp } from '@react-navigation/stack';

// Определяем тип для стека навигации
type RootStackParamList = {
  Login: undefined;
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
      const response = await AuthService.login(username, password);
      if (response && response.key) {
        await saveSession(response);
        console.log('Сессия сохранена:', response.key);

        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          navigation.replace('DrawerNavigator'); 
        });
      } else {
        throw new Error('Не удалось получить токен.');
      }
    } catch (error: unknown) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Произошла неизвестная ошибка.');
    }
  }, [username, password, saveSession, fadeAnim, navigation]);

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
