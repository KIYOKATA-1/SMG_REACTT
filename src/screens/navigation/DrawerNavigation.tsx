import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../ProfileScreen';
import TransactionsScreen from '../Transactions';
import QuizzesScreen from '../Quizzes';
import CourseDetailsScreen from '../CourseDetails';
import ProductScreen from '../ProductDetails';
import CurstomDrawerContent from './CurstomDrawerContent';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faClockRotateLeft, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Profile"
    drawerContent={CurstomDrawerContent}
    screenOptions={{
      drawerHideStatusBarOnOpen: true,
      drawerActiveTintColor: '#5F2DED',
      drawerActiveBackgroundColor: 'transparent',
      drawerLabelStyle: { marginLeft: -20 },
    }}
  >
    <Drawer.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{
        drawerLabel: 'Мой Кабинет',
        drawerIcon: ({ size, color }) => (
          <FontAwesomeIcon icon={faUser} size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Transactions" 
      component={TransactionsScreen} 
      options={{
        drawerLabel: 'Транзакции',
        drawerIcon: ({ size, color }) => (
          <FontAwesomeIcon icon={faClockRotateLeft} size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Quizzes" 
      component={QuizzesScreen} 
      options={{
        drawerLabel: 'Тесты',
        drawerIcon: ({ size, color }) => (
          <FontAwesomeIcon icon={faCartShopping} size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="CourseDetails" 
      component={CourseDetailsScreen} 
      options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} 
    />
    <Drawer.Screen 
      name="ProductDetails" 
      component={ProductScreen} 
      options={{ drawerItemStyle: { display: 'none' } , headerShown: false,}} 
    />
  </Drawer.Navigator>
);

export default DrawerNavigator;
