import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
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
  Alert,
  Modal,
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
  const [cartItemCount, setCartItemCount] = useState(0);

  const [hitProducts, setHitProducts] = useState<StoreProduct[]>([]);
  const [normalProducts, setNormalProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const userSession = await getSession();
        setSession(userSession);
      } catch {
        setSession(null);
      }
    })();
  }, [getSession]);

  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem("cart");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("cart");
        const cart: CartProduct[] = jsonValue ? JSON.parse(jsonValue) : [];
        setCartItemCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!session) return;
      setIsLoading(true);
      try {
        const response = await StoreService.getStoreProducts(session.key);
        setProducts(response.results);
        setFilteredProducts(response.results);
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session]);

  useEffect(() => {
    setHitProducts(filteredProducts.filter((item) => item.is_hit));
    setNormalProducts(filteredProducts.filter((item) => !item.is_hit));
  }, [filteredProducts]);

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
    } catch {
      Alert.alert("Ошибка", "Не удалось добавить товар в корзину.");
    }
  };
  const ProductCard = ({ item }: { item: StoreProduct }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
  
    const handleNextImage = () => {
      if (item.file_image.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % item.file_image.length);
      }
    };
  
    const handlePrevImage = () => {
      if (item.file_image.length > 1) {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? item.file_image.length - 1 : prevIndex - 1
        );
      }
    };
  
    return (
      <View style={styles.productCard}>
        {item.is_hit && (
          <View style={styles.hitTag}>
            <Text style={styles.hitTagText}>Хит Продаж!</Text>
          </View>
        )}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handlePrevImage} style={styles.prevButton}>
            <MaterialIcons name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => setIsFullScreen(true)} style={styles.zoomButton}>
            <MaterialIcons name="zoom-in" size={24} color="white" />
          </TouchableOpacity>
  
          <Image
            source={{
              uri: item.file_image[currentIndex] || "https://via.placeholder.com/150",
            }}
            style={styles.productImage}
          />
  
          <TouchableOpacity onPress={handleNextImage} style={styles.nextButton}>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text
          style={styles.productDescription}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
        <Text style={styles.productPrice}>{item.price} EdCoins</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addToCartText}>Добавить в корзину</Text>
        </TouchableOpacity>
  
        {isFullScreen && (
          <Modal visible={isFullScreen} transparent={true}>
            <View style={styles.fullScreenContainer}>
              <TouchableOpacity onPress={handlePrevImage} style={styles.prevButton}>
                <MaterialIcons name="chevron-left" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextImage} style={styles.nextButton}>
                <MaterialIcons name="chevron-right" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsFullScreen(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={30} color="white" />
              </TouchableOpacity>
              <Image
                source={{ uri: item.file_image[currentIndex] }}
                style={styles.fullScreenImage}
              />
            </View>
          </Modal>
        )}
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
            <Text style={styles.buttonText}>Корзина</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("History")}
          >
            <MaterialCommunityIcons name="history" size={26} color="white" />
            <Text style={styles.buttonText}>История</Text>
          </TouchableOpacity>
          <View style={styles.balance}>
            <Text style={styles.balanceDesc}>Ваш Баланс</Text>
            <Text style={styles.balanceText}>
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

          <Text style={styles.sectionTitle}>Хиты Продаж!</Text>
          <FlatList
            horizontal
            data={hitProducts}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />

          <Text style={styles.sectionTitle}>Товары</Text>
          <FlatList
            horizontal
            data={normalProducts}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StorePage;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productCard: {
    width: 180,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: "center",
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: "#260094",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: "#260094",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  hitTag: {
    position: "absolute",
    top: 10,
    left: 8,
    backgroundColor: "#F2277E",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    zIndex: 1,
  },
  hitTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    marginVertical: 10,
    color: "#333",
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
  searchBar: {
    margin: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  balanceDesc: {
    color: "#FFFFFFA6",
    fontSize: 14,
    fontWeight: "500",
  },
  balanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skeletonLoader: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0", // Серый фон для скелетона
    borderRadius: 8,
    position: "absolute",
    top: 0,
    left: 0,
  },
  prevButton: {
    position: "absolute",
    left: 5,
    top: "50%",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  nextButton: {
    position: "absolute",
    right: 5,
    top: "50%",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  zoomButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
