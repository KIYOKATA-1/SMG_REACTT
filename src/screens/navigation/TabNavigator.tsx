import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../../../components/ProfileScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Profile" component={ProfileScreen}     
      options={{
      tabBarLabel: 'Profile'.toUpperCase(),
      tabBarIcon: () => (
        <FontAwesomeIcon icon={faUser} color='#260094'/>
      ),
    }}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
