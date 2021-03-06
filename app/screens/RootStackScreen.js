import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import DrawerScreen from './DrawerScreen';
import SearchScreen from './SearchScreen';
import CityScreen from './CityScreen';
import SignUpScreen from './SignUpScreen';
import ContentScreen from './ContentScreen';

const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="Splash"
      component={SplashScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="Home"
      component={DrawerScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen name="Search" component={SearchScreen} />
    <RootStack.Screen name="City" component={CityScreen} />
    <RootStack.Screen
      name="Content"
      component={ContentScreen}
      options={{headerShown: false}}
    />
  </RootStack.Navigator>
);

export default RootStackScreen;
