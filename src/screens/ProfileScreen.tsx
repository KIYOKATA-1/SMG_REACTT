import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, 
  ActivityIndicator, Alert, TouchableOpacity, 
  SafeAreaView, Image, LayoutAnimation, UIManager, Platform
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
  username: string;
}

interface Product {
  id: number;
  name: string;
  course: number[];
}

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
        const token = parsedSession.key;

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

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={ProfileStyle.loader} />;
  }

  return (
    <SafeAreaView style={ProfileStyle.container}>
      <View style={ProfileStyle.profileContainer}>
        {userData ? (
          <TouchableOpacity
            style={[
              ProfileStyle.userInfo,
              isExpanded && { height: 200, flexDirection: 'column', alignItems: 'flex-start' },
            ]}
            onPress={toggleExpand}
          >
            {isExpanded && (
              <Image 
                source={IMAGES.MIRUM_LOGO} 
                style={{ width: 140, resizeMode: 'contain', height: 70, marginBottom: 10 }} 
              />
            )}
            <View style={isExpanded ? ProfileStyle.expandedUserData : ProfileStyle.userData}>
              <Text style={ProfileStyle.username}>
                {userData.first_name} {userData.last_name}
              </Text>
              <Text style={ProfileStyle.role}>{getRoleText(userData.role)}</Text>
              {isExpanded && (
                <>
                  <Text style={ProfileStyle.phone}>{userData.phone}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <Text>Загрузка данных пользователя...</Text>
        )}
        <View style={ProfileStyle.sbjctList}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={ProfileStyle.productItem}
                onPress={() => handleProductPress(item.course)}
              >
                <Text style={ProfileStyle.course}>{item.name}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Image source={IMAGES.GROUP} style={ProfileStyle.groupImage} />
                  <Text style={{ fontSize: 14, fontWeight: 'thin', color: '#fff' }}>
                    + 25 студентов
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
