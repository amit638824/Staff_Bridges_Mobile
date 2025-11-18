import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import PhoneLoginScreen from './src/screens/PhoneLoginScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import AboutYourselfScreen from './src/screens/PreLogin/AboutYourselfScreen';
import WorkLocationScreen from './src/screens/PreLogin/WorkLocationScreen';
import ResponsesScreen from './src/screens/ResponsesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// ✅ Define and export RootStackParamList properly
export type RootStackParamList = {
  PhoneLogin: undefined;
  HomeScreen: undefined;
  ProfileScreen: undefined;
  AboutYourselfScreen: undefined;
  WorkLocationScreen: undefined;
  ResponsesScreen: undefined;
  SettingsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="PhoneLogin"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="AboutYourselfScreen" component={AboutYourselfScreen} />
                <Stack.Screen name="WorkLocationScreen" component={WorkLocationScreen} />
                        <Stack.Screen name="ResponsesScreen" component={ResponsesScreen} />
                        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;