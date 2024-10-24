import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import TabNavigator from './src/screens/navigation/TabNavigator';
import ProductScreen from './src/screens/ProductDetails';  
import CourseDetailsScreen from './src/screens/CourseDetails';  

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="ProductDetails" component={ProductScreen} />
        <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
