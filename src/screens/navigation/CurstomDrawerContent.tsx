import React, { useRef, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserGraduate,
  faChevronDown,
  faChevronUp,
  faUser,
  faClockRotateLeft,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IMAGES from "../../../assets/img/image";

type RootStackParamList = {
  Login: undefined;
  Edugress: undefined;
  Transactions: undefined;
  Profile: undefined;
  EduResults: undefined;
  RoadmapScreen: undefined;
  Store: undefined;
};

export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isEdugressOpen, setEdugressOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const toggleEdugress = () => {
    setEdugressOpen((prev) => {
      if (prev) {
        Animated.timing(dropdownHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(dropdownHeight, {
          toValue: 150, 
          duration: 400,
          useNativeDriver: false,
        }).start();
      }
      return !prev;
    });
  };

  const handleMenuPress = (menu: string, screen: keyof RootStackParamList) => {
    setActiveMenu(menu);
    navigation.navigate(screen);
  };

  const handleOptionPress = (option: string) => {
    setActiveMenu(option);
    if (option === "Результаты") {
      navigation.navigate("EduResults");
    } else if (option === "Главная") {
      navigation.navigate("Edugress");
    } else if (option === "Дорожная карта") {
      navigation.navigate("RoadmapScreen");
    }
  };

  return (
    <DrawerContentScrollView {...props} style={{padding: 10,}}>
      <View style={styles.imageContainer}>
        <Image source={IMAGES.LOGIN_LOGO} style={styles.logo} />
      </View>
      {/* Мой Кабинет */}
      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeMenu === "Profile" && styles.activeDrawerItem,
        ]}
        onPress={() => handleMenuPress("Profile", "Profile")}
      >
        <View style={styles.drawerLabelContainer}>
          <FontAwesomeIcon
            icon={faUser}
            size={20}
            color={activeMenu === "Profile" ? "#fff" : "#555"}
          />
          <Text
            style={[
              styles.drawerLabel,
              { color: activeMenu === "Profile" ? "#fff" : "#555" },
            ]}
          >
            Мой Кабинет
          </Text>
        </View>
      </TouchableOpacity>
      {/* Транзакции */}
      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeMenu === "Transactions" && styles.activeDrawerItem,
        ]}
        onPress={() => handleMenuPress("Transactions", "Transactions")}
      >
        <View style={styles.drawerLabelContainer}>
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            size={20}
            color={activeMenu === "Transactions" ? "#fff" : "#555"}
          />
          <Text
            style={[
              styles.drawerLabel,
              { color: activeMenu === "Transactions" ? "#fff" : "#555" },
            ]}
          >
            Транзакции
          </Text>
        </View>
      </TouchableOpacity>
      {/* Edugress Dropdown */}
      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeMenu === "Edugress" && styles.activeDrawerItem,
        ]}
        onPress={toggleEdugress}
      >
        <View style={styles.drawerLabelContainer}>
          <FontAwesomeIcon
            icon={faUserGraduate}
            size={20}
            color={
              activeMenu === "Edugress" || activeMenu?.startsWith("SubOption")
                ? "#fff"
                : "#555"
            }
          />
          <Text
            style={[
              styles.drawerLabel,
              {
                color:
                  activeMenu === "Edugress" ||
                  activeMenu?.startsWith("SubOption")
                    ? "#fff"
                    : "#555",
              },
            ]}
          >
            Edugress
          </Text>
        </View>
        <FontAwesomeIcon
          icon={isEdugressOpen ? faChevronUp : faChevronDown}
          size={16}
          color={
            activeMenu === "Edugress" || activeMenu?.startsWith("SubOption")
              ? "#fff"
              : "#555"
          }
        />
      </TouchableOpacity>
      <Animated.View
        style={[styles.edugressDropdown, { height: dropdownHeight }]}
      >
        {isEdugressOpen && (
          <>
            <TouchableOpacity
              style={[
                styles.edugressItem,
                activeMenu === "Главная" && styles.activeSubOption,
              ]}
              onPress={() => handleOptionPress("Главная")}
            >
              <View style={styles.subOption}>
                <MaterialCommunityIcons
                  name="rhombus-split"
                  size={20}
                  color={activeMenu === "Главная" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.edugressItemText,
                    activeMenu === "Главная" && styles.activeSubOptionText,
                  ]}
                >
                  Главная
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.edugressItem,
                activeMenu === "Результаты" && styles.activeSubOption,
              ]}
              onPress={() => handleOptionPress("Результаты")}
            >
              <View style={styles.subOption}>
                <MaterialCommunityIcons
                  name="text-box-search-outline"
                  size={20}
                  color={activeMenu === "Результаты" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.edugressItemText,
                    activeMenu === "Результаты" && styles.activeSubOptionText,
                  ]}
                >
                  Результаты
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.edugressItem,
                activeMenu === "Дорожная карта" && styles.activeSubOption,
              ]}
              onPress={() => handleOptionPress("Дорожная карта")}
            >
              <View style={styles.subOption}>
                <MaterialCommunityIcons
                  name="map-marker-path"
                  size={20}
                  color={activeMenu === "Дорожная карта" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.edugressItemText,
                    activeMenu === "Дорожная карта" &&
                      styles.activeSubOptionText,
                  ]}
                >
                  Дорожная карта
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeMenu === "Store" && styles.activeDrawerItem,
        ]}
        onPress={() => handleMenuPress("Store", "Store")}
      >
        <View style={styles.drawerLabelContainer}>
          <FontAwesomeIcon
            icon={faStore}
            size={20}
            color={activeMenu === "Store" ? "#fff" : "#555"}
          />
          <Text
            style={[
              styles.drawerLabel,
              { color: activeMenu === "Store" ? "#fff" : "#555" },
            ]}
          >
            Магазин
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.logoutLabel}>LOGOUT</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    width: "70%",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  activeDrawerItem: {
    backgroundColor: "#260094",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  drawerLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  edugressDropdown: {
    marginLeft: 15,
    marginTop: 5,
  },
  edugressItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  subOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  edugressItemText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  activeSubOption: {
    backgroundColor: "#260094",
  },
  activeSubOptionText: {
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#E63946",
    borderRadius: 25,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 30,
  },
  logoutLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
