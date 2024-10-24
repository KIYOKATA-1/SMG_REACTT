import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, 
  ActivityIndicator, Alert, TouchableOpacity, 
  SafeAreaView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProfileStyle } from '../styles/Profile';
import IMAGES from '../assets/img/image';

const BACKEND_URL = 'https://api.smg.kz/en/api';

type RootStackParamList = {
  ProductDetails: { courseIds: number[] };
};

interface UserData {
  first_name: string;
  last_name: string;
  phone: string;
  role: number;
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
  const [isMenuVisible, setMenuVisible] = useState(false); // Состояние для меню

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchTokenAndData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Ошибка', 'Токен не найден. Пожалуйста, войдите заново.');
          return;
        }

        await fetchData(token); // Загружаем данные с использованием токена
      } catch (error) {
        console.error('Ошибка при получении токена:', error);
        Alert.alert('Ошибка', 'Не удалось получить токен.');
      }
    };

    fetchTokenAndData();
  }, []);

  const fetchData = async (token: string) => {
    try {
      const userResponse = await axios.get<UserData>(`${BACKEND_URL}/user/`, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('User Data:', userResponse.data);
      setUserData(userResponse.data);

      const productsResponse = await axios.get<{ results: Product[] }>(
        `${BACKEND_URL}/courses/products/?limit=100`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log('Products:', productsResponse.data.results);
      setProducts(productsResponse.data.results);
    } catch (error: any) {
      console.error('Ошибка при загрузке данных:', error.response?.data || error.message);
      Alert.alert('Ошибка', 'Не удалось загрузить данные. Проверьте интернет-подключение.');
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

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  if (loading) {
    return <ActivityIndicator size="large" style={ProfileStyle.loader} />;
  }

  return (
    <SafeAreaView style={ProfileStyle.container}>
      <View style={ProfileStyle.profileContainer}>
        {userData ? (
          <View style={ProfileStyle.userInfo}>
          <Image source={IMAGES.MIRUM_LOGO} style={{ width: 140, resizeMode: 'contain', height: 70, }} />
          <View style={ProfileStyle.userData}>
            <Text style={ProfileStyle.username}>
              {userData.first_name} {userData.last_name}
            </Text>
            <Text style={ProfileStyle.role}>{getRoleText(userData.role)}</Text>
          </View>
        </View>        
        ) : (
          <Text>Загрузка данных пользователя...</Text>
        )}

        <FlatList
          style={ProfileStyle.sbjctList}
          data={products}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<Text style={ProfileStyle.title}>Мои Продукты</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={ProfileStyle.productItem}
              onPress={() => handleProductPress(item.course)}
            >
                <Text style={ProfileStyle.course}>{item.name}</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Image source={IMAGES.GROUP} style={{height: 40, width: 80, objectFit: 'contain',position: 'relative', marginVertical: 5,}}/>
                  <Text style={{fontSize: 12, fontWeight: 'thin'}}>+ 25 студентов</Text>
                </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
