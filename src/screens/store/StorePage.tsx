import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ScrollView, // Добавлен ScrollView
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import IMAGES from "../../../assets/img/image";
import { ISession } from "../../../services/auth/auth.types";
import { useSession } from "../../../lib/useSession";
import { StoreService } from "../../../services/store/store.service";
import { CartProduct, StoreProduct } from "../../../services/store/store.types";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorePage = () => {
  type RootDrawerParamList = {
    Cart: undefined;
    Store: undefined;
    History: undefined;
  };

  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const { getSession } = useSession();
  const [session, setSession] = useState<ISession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<StoreProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: number]: number;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const userSession = await getSession();
        setSession(userSession);
      } catch (error) {
        console.error("Ошибка получения сессии:", error);
        setSession(null);
      }
    };
    fetchSession();
  }, [getSession]);

  useEffect(() => {
    const clearCart = async () => {
      await AsyncStorage.removeItem("cart");
    };
    clearCart();
  }, []);
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("cart");
        const cart: CartProduct[] = jsonValue ? JSON.parse(jsonValue) : [];
        setCartItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
      }
    };
    fetchCartItemCount();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!session) return;
      setIsLoading(true);
      try {
        const response = await StoreService.getStoreProducts(session.key);
        setProducts(response.results);
        setFilteredProducts(response.results);
      } catch (error) {
        console.error("Ошибка загрузки продуктов:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [session]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchTerm(text);
      if (text.trim() === "") {
        setFilteredProducts(products);
        return;
      }

      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredProducts(filtered);
    },
    [products]
  );

  const addToCart = async (product: StoreProduct) => {
    try {
      const jsonValue = await AsyncStorage.getItem("cart");
      const cart: CartProduct[] = jsonValue ? JSON.parse(jsonValue) : [];

      const existingItem = cart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));

      setCartItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));

      Alert.alert("Успех", "Товар добавлен в корзину!");
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      Alert.alert("Ошибка", "Не удалось добавить товар в корзину.");
    }
  };

  const ProductCard = ({ item, currentImageIndex, addToCart }: { 
    item: StoreProduct; 
    currentImageIndex: { [key: number]: number }; 
    addToCart: (product: StoreProduct) => void; 
  }) => {
    const [isImageLoading, setImageLoading] = useState(true);
  
    return (
      <View style={styles.productCard}>
        {item.is_hit && (
          <View style={styles.hitTag}>
            <Text style={styles.hitTagText}>Хит Продаж!</Text>
          </View>
        )}
        <View style={styles.imageContainer}>
          {isImageLoading && (
            <ActivityIndicator
              size="large"
              color="#260094"
              style={styles.imageLoader}
            />
          )}
          <Image
            source={{
              uri:
                item.file_image[currentImageIndex[item.id]] ||
                "https://via.placeholder.com/150",
            }}
            style={[styles.productImage, isImageLoading && { display: "none" }]}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)} // В случае ошибки тоже скрываем лоадер
          />
        </View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>{item.price} EdCoins</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addToCartText}>Добавить в корзину</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <View style={styles.topBtns}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Cart")}
          >
            <MaterialIcons name="shopping-cart" size={24} color="white" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Корзина
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("History")}
          >
            <MaterialCommunityIcons name="history" size={26} color="white" />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              История
            </Text>
          </TouchableOpacity>
          <View style={styles.balance}>
            <Text style={{ color: "#FFFFFFA6", fontSize: 14, fontWeight: "500" }}>
              Ваш Баланс
            </Text>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              {session?.user.coins ?? "Загрузка..."} EdCoins
            </Text>
          </View>
        </View>
        <View style={styles.contentWrapper}>
          <ImageBackground
            source={IMAGES.STORE}
            style={styles.background}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Добро пожаловать в Mirum Store!</Text>
              <Text style={styles.subtitle}>
                Вы долго и упорно (и, конечно же, заслуженно) зарабатывали свои
                эдкоины и теперь{"\n"}
                настало время заслуженных покупок!
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Поиск товара"
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={handleSearch}
            />
            <FontAwesome name="search" size={24} color="white" />
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
<FlatList
  data={filteredProducts}
  renderItem={({ item }) => (
    <ProductCard
      item={item}
      currentImageIndex={currentImageIndex}
      addToCart={addToCart}
    />
  )}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={styles.productList}
  horizontal={true}
/>

          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  background: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  imageStyle: {
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  topBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#260094",
    height: 60,
    minWidth: 80,
  },
  balance: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#260094",
    height: 60,
  },
  searchBar: {
    margin: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#cccccc",
    borderRadius: 16,
    backgroundColor: "#260094",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
    backgroundColor: "#fff",
    height: 40,
    borderRadius: 8,
    width: "90%",
    padding: 10,
    color: "#333",
  },
  productList: {
    padding: 16,
  },

  navigationButtons: {
    position: "absolute",
    width: "100%",
    top: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 50,
  },
  navButtonText: {
    color: "white",
    fontSize: 18,
  },

  zoomButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 6,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  modalNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#260094",
    padding: 10,
    borderRadius: 8,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  horizontalProductList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  hitTag: {
    position: "absolute",
    top: 25,
    left: -5,
    backgroundColor: "#F2277E",
    paddingVertical: 3,
    paddingHorizontal: 9,
    transform: [{ rotate: "-30deg" }],
    zIndex: 1,
    borderRadius: 5,
  },
  hitTagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#F2277E",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  productCard: {
    width: 220, // Фиксированная ширина карточки
    height: 320, // Фиксированная высота карточки
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "space-between", // Равномерное распределение элементов
  },
  imageContainer: {
    width: "100%",
    height: 150, // Фиксированная высота изображения
    justifyContent: "center",
    alignItems: "center",
  },
  imageLoader: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center", // Центрирование названия
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    textAlign: "center", // Центрирование описания
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 16,
    color: "#260094",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: "#260094",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default StorePage;
