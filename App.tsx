import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import DrawerNavigator from './src/screens/navigation/DrawerNavigation';
import SplashScreenComponent from './src/screens/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Эмуляция загрузки данных
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady) {
    return <SplashScreenComponent />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="DrawerNavigator" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
