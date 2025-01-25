import React, { useState } from "react";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faClockRotateLeft,
  faBars,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import ProfileScreen from "@/screens/ProfileScreen";
import TransactionsScreen from "@/screens/Transactions";
import CourseDetailsScreen from "@/screens/CourseDetails";
import ProductScreen from "@/screens/ProductDetails";
import TestPage from "../../../components/TestPage";
import EdugressScreen from "@/screens/edugress/EdugressMain";
import CustomDrawerContent from "./CurstomDrawerContent";
import EdugressResults from "../edugress/EdugressResult";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PurchaseHistory from "../store/history/HistoryPage";

import RoadmapScreen from "../edugress/UserRoadmap";
import StorePage from "../store/StorePage";
import StoreCart from "../store/cart/CartPage";
type RootDrawerParamList = {
  Profile: undefined;
  Transactions: undefined;
  Edugress: undefined;
  EduResults: undefined;
  CourseDetails: undefined;
  ProductDetails: undefined;
  TestPage: { testId: number };
  RoadmapScreen: undefined;
  Store: undefined; 
  Cart: undefined;
  History: undefined;
};

type DrawerNavigatorProps = DrawerNavigationProp<RootDrawerParamList>;
type TestPageProps = NativeStackScreenProps<RootDrawerParamList, "TestPage">;

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const CustomBurgerButton = () => {
  const navigation = useNavigation<DrawerNavigatorProps>();

  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={styles.burgerBtn}
    >
      <FontAwesomeIcon icon={faBars} size={24} color="#260094" />
    </TouchableOpacity>
  );
};

const DrawerNavigator = () => {
  const [activeScreen, setActiveScreen] = useState<string>("Profile");

  const handleSetActive = (screenName: string) => {
    setActiveScreen(screenName);
  };

  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} activeScreen={activeScreen} />
      )}
      screenOptions={{
        drawerHideStatusBarOnOpen: true,
        drawerActiveTintColor: "#F2277E",
        drawerActiveBackgroundColor: "transparent",
        drawerLabelStyle: { marginLeft: -20 },
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <CustomBurgerButton />
          </View>
        ),
        headerStyle: {
          backgroundColor: "#fff",
        },
        drawerStyle: [styles.drawer],
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: "Мой Кабинет",
          drawerIcon: ({ size, color }) => (
            <FontAwesomeIcon icon={faUser} size={size} color={color} />
          ),
          drawerItemStyle: styles.drawerItem,
          headerTintColor: "transparent",
        }}
        listeners={{
          focus: () => handleSetActive("Profile"),
        }}
      />
<Drawer.Screen
  name="Cart"
  component={StoreCart}
  options={{
    drawerLabel: "Корзина",
    headerShown: false,
    drawerIcon: ({ size, color }) => (
      <MaterialCommunityIcons name="cart" size={size} color={color} />
    ),
  }}
/>

<Drawer.Screen
  name="History"
  component={PurchaseHistory}
  options={{
    drawerLabel: "История",
    headerShown: false,
    drawerIcon: ({ size, color }) => (
      <MaterialCommunityIcons name="cart" size={size} color={color} />
    ),
  }}
/>


      <Drawer.Screen
        name="Edugress"
        component={EdugressScreen}
        options={{
          drawerLabel: "Edugress",
          drawerIcon: ({ size, color }) => (
            <FontAwesomeIcon icon={faUserGraduate} size={size} color={color} />
          ),
          drawerItemStyle: { display: "none" },
          headerTintColor: "transparent",
        }}
        listeners={{
          focus: () => handleSetActive("Edugress"),
        }}
      />
      <Drawer.Screen
        name="EduResults"
        component={EdugressResults}
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Результаты Edugress",
        }}
      />
            <Drawer.Screen
        name="RoadmapScreen"
        component={RoadmapScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
          title: "Дорожная карта",
        }}
      />
      
      <Drawer.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerTintColor: "transparent",
        }}
      />
      <Drawer.Screen
  name="Store"
  component={StorePage} // Замените на ваш компонент страницы Store
  options={{
    drawerLabel: "Магазин",
    drawerIcon: ({ size, color }) => (
      <MaterialCommunityIcons name="cart" size={24} color="black" />
    ),
    drawerItemStyle: styles.drawerItem,
    headerTintColor: "transparent",
  }}
  listeners={{
    focus: () => handleSetActive("Store"),
  }}
/>


      <Drawer.Screen
        name="ProductDetails"
        component={ProductScreen}
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
      <Drawer.Screen
        name="TestPage"
        component={TestPageWrapper}
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const TestPageWrapper: React.FC<TestPageProps> = (props) => (
  <TestPage {...props} />
);

const styles = StyleSheet.create({
  drawerItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  drawer: {
    width: 240,
    borderWidth: 1,
    borderColor: "rgba(95, 45, 237, 0.2)",
    backgroundColor: "#fbfbfb",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(95, 45, 237, 0.2)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  burgerBtn: {
    position: "relative",
    left: 10,
  },
});

export default DrawerNavigator;
