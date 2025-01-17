import React from "react";
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
  faCartShopping,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import ProfileScreen from "@/screens/ProfileScreen";
import TransactionsScreen from "@/screens/Transactions";
import QuizzesScreen from "@/screens/Quizzes";
import CourseDetailsScreen from "@/screens/CourseDetails";
import ProductScreen from "@/screens/ProductDetails";
import CustomDrawerContent from "./CurstomDrawerContent";
import TestPage from "../../../components/TestPage";
import EdugressScreen from "@/screens/Edugress";

type RootDrawerParamList = {
  Profile: undefined;
  Transactions: undefined;
  Quizzes: undefined;
  CourseDetails: undefined;
  ProductDetails: undefined;
  Edugress: undefined;
  TestPage: { testId: number };
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
      <FontAwesomeIcon icon={faBars} size={24} color="#202942" />
    </TouchableOpacity>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Profile"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
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
    />
    <Drawer.Screen
      name="Transactions"
      component={TransactionsScreen}
      options={{
        drawerLabel: "Транзакции",
        drawerIcon: ({ size, color }) => (
          <FontAwesomeIcon icon={faClockRotateLeft} size={size} color={color} />
        ),
        drawerItemStyle: styles.drawerItem,
        headerTintColor: "transparent",
      }}
    />
    <Drawer.Screen
      name="Quizzes"
      component={QuizzesScreen}
      options={{
        drawerLabel: "Тесты",
        drawerIcon: ({ size, color }) => (
          <FontAwesomeIcon icon={faCartShopping} size={size} color={color} />
        ),
        drawerItemStyle: styles.drawerItem,
        headerTintColor: "transparent",
      }}
    />
    <Drawer.Screen
      name="Edugress"
      component={EdugressScreen}
      options={{
        drawerLabel: "Edugress",
        drawerIcon: ({ size, color }) => (
          <FontAwesomeIcon icon={faCartShopping} size={size} color={color} />
        ),
        drawerItemStyle: styles.drawerItem,
        headerTintColor: "transparent",
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
    borderColor: "0 0 1px 1px rgba(95, 45, 237, 0.2)",
    backgroundColor: "#fbfbfb",
    ...Platform.select({
      ios: {
        shadowColor: "0 0 1px 1px rgba(95, 45, 237, 0.2)",
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
