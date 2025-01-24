import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // <-- Подключаем AntDesign
import { StoreProduct } from "../../../../services/store/store.types";
import { useSession } from "../../../../lib/useSession";
import { StoreService } from "../../../../services/store/store.service";
import { ISession } from "../../../../services/auth/auth.types";

type CartProduct = StoreProduct & { quantity: number };

const StoreCart = () => {
  const { getSession } = useSession();
  const navigation = useNavigation();
  const [session, setSession] = useState<ISession | null>(null);
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    patronymic: "",
    city: "",
    street: "",
    house: "",
    apartment: "",
    contact_phone_1: "",
    contact_phone_2: "",
  });

  // Загружаем сессию
  useEffect(() => {
    (async () => {
      try {
        const fetchedSession = await getSession();
        setSession(fetchedSession);
      } catch (error) {
        console.error("Ошибка получения сессии:", error);
      }
    })();
  }, [getSession]);

  const loadCartFromStorage = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cart");
      if (jsonValue) {
        setCartItems(JSON.parse(jsonValue));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Ошибка при загрузке корзины:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCartFromStorage();
    }, [loadCartFromStorage])
  );

  const removeFromCart = async (id: number) => {
    try {
      const updatedCart = cartItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
            : item
        )
        .filter((item) => item.quantity > 0);

      setCartItems(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Ошибка при обновлении корзины:", error);
      Alert.alert("Ошибка", "Не удалось обновить корзину.");
    }
  };

  const totalSum = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleCheckout = async () => {
    if (!session || !session.key) {
      Alert.alert("Ошибка", "Пользователь не авторизован.");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Ошибка", "Корзина пуста. Добавьте товары для покупки.");
      return;
    }

    const userCoins = session.user?.coins ?? 0;
    if (userCoins < totalSum) {
      Alert.alert("Ошибка", "Недостаточно EdCoins для покупки товаров.");
      return;
    }

    const checkoutData = {
      items: cartItems.map((item) => ({
        id: item.id,
        amount: item.quantity,
      })),
      user_address: formData,
    };

    setIsLoading(true);
    try {
      const result = await StoreService.checkout(session.key, checkoutData);
      Alert.alert("Успех", "Покупка успешно завершена!");

      setCartItems([]);
      await AsyncStorage.removeItem("cart");

      const updatedCoins = userCoins - totalSum;
      const updatedSession = {
        ...session,
        user: { ...session.user, coins: updatedCoins },
      };
      await AsyncStorage.setItem("session", JSON.stringify(updatedSession));
      setSession(updatedSession);

      console.log("Результат покупки:", result);
    } catch (error: any) {
      console.error("Ошибка при оформлении покупки:", error);
      Alert.alert(
        "Ошибка",
        error.message || "Не удалось выполнить покупку. Попробуйте снова."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.cart}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Корзина</Text>
          <View style={styles.balanceBox}>
            <Text style={styles.balanceLabel}>Ваш баланс</Text>
            <Text style={styles.balanceValue}>
              {session?.user?.coins ?? 0} EdCoins
            </Text>
          </View>
        </View>

        {/* Список товаров в корзине */}
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <View style={styles.cartItem} key={item.id}>
              <Image
                style={styles.cartItemImage}
                source={{
                  uri:
                    Array.isArray(item.file_image) && item.file_image.length > 0
                      ? item.file_image[0]
                      : "https://via.placeholder.com/100x70",
                }}
              />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemDesc}>{item.description}</Text>
                <Text style={styles.cartItemQuantity}>
                  Количество: {item.quantity}
                </Text>
              </View>
              <View style={styles.cartItemActions}>
                <Text style={styles.cartItemPrice}>
                  {(item.price || 0) * (item.quantity || 1)} EdCoins
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.removeButtonText}>Убрать</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCartText}>Ваша корзина пуста.</Text>
        )}

        {/* Сумма и количество товаров */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Итого</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Количество товаров:</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Сумма:</Text>
            <Text style={styles.summaryValue}>{totalSum} EdCoins</Text>
          </View>
        </View>

        {/* Форма с адресом и контактами */}
        <View style={styles.formContainer}>
          <Text style={styles.warningText}>
            *ВНИМАНИЕ! Если Вам нет 18 лет, просим ввести данные Вашего родителя
            или ответственного совершеннолетнего лица.
          </Text>
          <View style={styles.formRow}>
            <TextInput
              placeholder="Фамилия"
              style={styles.input}
              value={formData.last_name}
              onChangeText={(value) => handleInputChange("last_name", value)}
            />
            <TextInput
              placeholder="Имя"
              style={styles.input}
              value={formData.first_name}
              onChangeText={(value) => handleInputChange("first_name", value)}
            />
            <TextInput
              placeholder="Отчество"
              style={styles.input}
              value={formData.patronymic}
              onChangeText={(value) => handleInputChange("patronymic", value)}
            />
          </View>
          <TextInput
            placeholder="Город"
            style={styles.input}
            value={formData.city}
            onChangeText={(value) => handleInputChange("city", value)}
          />
          <View style={styles.formRow}>
            <TextInput
              placeholder="Улица"
              style={styles.input}
              value={formData.street}
              onChangeText={(value) => handleInputChange("street", value)}
            />
            <TextInput
              placeholder="Дом"
              style={styles.input}
              value={formData.house}
              onChangeText={(value) => handleInputChange("house", value)}
            />
            <TextInput
              placeholder="Квартира"
              style={styles.input}
              value={formData.apartment}
              onChangeText={(value) => handleInputChange("apartment", value)}
            />
          </View>
          <View style={styles.formRow}>
            <TextInput
              placeholder="Контактный телефон 1"
              style={styles.input}
              value={formData.contact_phone_1}
              onChangeText={(value) =>
                handleInputChange("contact_phone_1", value)
              }
            />
            <TextInput
              placeholder="Контактный телефон 2"
              style={styles.input}
              value={formData.contact_phone_2}
              onChangeText={(value) =>
                handleInputChange("contact_phone_2", value)
              }
            />
          </View>
        </View>

        {/* Кнопка оформления заказа */}
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            isLoading && styles.checkoutButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>Приобрести</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  cart: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 12,
    padding: 6,
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  balanceBox: {
    backgroundColor: "#260094",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "bold",
  },
  balanceValue: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#260094",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 12,
    padding: 8,
  },
  cartItemImage: {
    width: 100,
    height: 70,
    resizeMode: "contain",
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  cartItemDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 4,
  },
  cartItemQuantity: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  cartItemActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
  },
  cartItemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  removeButton: {
    borderWidth: 0.5,
    borderColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#F15C5C",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginVertical: 20,
  },
  summaryContainer: {
    marginVertical: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#00000020",
    paddingTop: 16,
    gap: 30,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#000",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  warningText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    marginRight: 10,
    color: "#000",
  },
  checkoutButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#260094",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  checkoutButtonDisabled: {
    backgroundColor: "gray",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
