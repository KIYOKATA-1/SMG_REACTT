import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, 
  ActivityIndicator, Alert, TouchableOpacity, 
  SafeAreaView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProfileStyle } from '../../styles/Profile';
import IMAGES from '../../assets/img/image';

const BACKEND_URL = 'https://api.smg.kz/en/api';

type RootStackParamList = {
  ProductDetails: { courseIds: number[] };
};

interface UserData {
  first_name: string;
  last_name: string;
  phone: string;
  role: number;
  coins: number;
}

interface Product {
  id: number;
  name: string;
  course: number[];
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchTokenAndData = async () => {
      try {
        const session = await AsyncStorage.getItem('session');
        if (!session) {
          Alert.alert('Ошибка', 'Сессия не найдена. Пожалуйста, войдите заново.');
          return;
        }
  
        const parsedSession = JSON.parse(session);
        const token = parsedSession.key; // Извлекаем токен из объекта сессии
  
        await fetchData(token);
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось получить сессию.');
      }
    };
  
    fetchTokenAndData();
  }, []);
  

  const fetchData = async (token: string) => {
    try {
      const userResponse = await axios.get<UserData>(`${BACKEND_URL}/user/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setUserData(userResponse.data);

      const productsResponse = await axios.get<{ results: Product[] }>(
        `${BACKEND_URL}/courses/products/?limit=100`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setProducts(productsResponse.data.results);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleText = (role: number): string => {
    switch (role) {
      case 0:
        return 'Ученик';
      case 1:
        return 'Куратор';
      case 2:
        return 'Админ';
      default:
        return 'Роль не определена';
    }
  };

  const handleProductPress = (courseIds: number[]) => {
    navigation.navigate('ProductDetails', { courseIds });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={ProfileStyle.loader} />;
  }

  return (
    <SafeAreaView style={ProfileStyle.container}>
      <View style={ProfileStyle.profileContainer}>
        {userData ? (
          <View style={ProfileStyle.userInfo}>
            <Image source={IMAGES.MIRUM_LOGO} style={ProfileStyle.logo} />
            <View style={ProfileStyle.userData}>
              <Text style={ProfileStyle.username}>
                {userData.first_name} {userData.last_name}
              </Text>
              <Text style={ProfileStyle.role}>{getRoleText(userData.role)}</Text>
              <Text style={ProfileStyle.coins}>ED COINS: {userData.coins}</Text>
            </View>
          </View>
        ) : (
          <Text>Загрузка данных пользователя...</Text>
        )}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={ProfileStyle.productItem}
              onPress={() => handleProductPress(item.course)}
            >
              <Text style={ProfileStyle.course}>{item.name}</Text>
              <View style={ProfileStyle.productInfo}>
                <Image source={IMAGES.GROUP} style={ProfileStyle.groupImage} />
                <Text style={ProfileStyle.studentCount}>+ 25 студентов</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
