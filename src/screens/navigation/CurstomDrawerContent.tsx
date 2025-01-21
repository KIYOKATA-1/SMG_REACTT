import React, { useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserGraduate,
  faChevronDown,
  faChevronUp,
  faUser,
  faClockRotateLeft,
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
};

export default function CustomDrawerContent(props: any) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isEdugressOpen, setEdugressOpen] = useState(false); // Track dropdown open state
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // Track active main menu or sub-option

  const toggleEdugress = () => {
    setEdugressOpen((prev) => !prev);
  };

  const handleMenuPress = (menu: string, screen: keyof RootStackParamList) => {
    setActiveMenu(menu); // Set the active menu item
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
    <DrawerContentScrollView {...props}>
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
      {isEdugressOpen && (
        <View style={styles.edugressDropdown}>
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
                  activeMenu === "Дорожная карта" && styles.activeSubOptionText,
                ]}
              >
                Дорожная карта
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
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
  },
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    width: "70%",
    marginBottom: 20,
    right: 20,
    position: "relative",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
  },
  activeDrawerItem: {
    backgroundColor: "#263546",
  },
  drawerLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerLabel: {
    fontSize: 16,
    paddingVertical: 10,
    marginLeft: 10,
  },
  edugressDropdown: {
    marginLeft: 10,
    marginTop: 5,
  },
  edugressItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
  },
  subOption: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
  },
  edugressItemText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  activeSubOption: {
    backgroundColor: "#263546",
    borderRadius: 5,
  },
  activeSubOptionText: {
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#F2277E",
    borderRadius: 8,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  logoutLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
