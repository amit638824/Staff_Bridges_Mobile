import React, { useState, useEffect, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { I18nextProvider } from 'react-i18next';

import i18n from './src/i18n/i18n';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';

import HomeScreen from './src/screens/HomeScreen';
import PhoneLoginScreen from './src/screens/PhoneLoginScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import AboutYourselfScreen from './src/screens/PreLogin/AboutYourselfScreen';
import WorkLocationScreen from './src/screens/PreLogin/WorkLocationScreen';
import ResponsesScreen from './src/screens/ResponsesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SelectJobRoleScreen from './src/screens/PreLogin/JobRoleScreen';
import JobDetailsScreen from './src/screens/PreLogin/JobDetailsScreen';
import JobsScreen from './src/screens/JobsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SplashScreen from './src/screens/PreLogin/SplashScreen';
import JobInfoScreen from './src/screens/JobInfoScreen';

// Types
export type RootStackParamList = {
  Splash: undefined; 
  PhoneLogin: undefined;
  HomeScreen: undefined;
  JobsScreen: undefined;
  JobInfoScreen: undefined;
  ProfileScreen: undefined;
  AboutYourselfScreen: undefined;
  WorkLocationScreen: undefined;
  ResponsesScreen: undefined;
  SettingsScreen: undefined;
  JobRoleScreen: undefined;
  JobDetailsScreen: JobDetailsScreenParams;
  JobRoleFlowScreen: undefined;
  NotificationsScreen: undefined;
};

export interface JobDetailsScreenParams {
  selectedRoles: { id: string; title: string; image: any }[];
  currentRoleIndex: number;
  completedRoles: Record<string, any>;
  totalRoles: number;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loader while language loads
const Loader = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const RootNavigator = ({ showSplash }: { showSplash: boolean }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {showSplash ? (
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ gestureEnabled: false }}
      />
    ) : (
      <>
        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="JobsScreen" component={JobsScreen} />
        <Stack.Screen name="JobInfoScreen" component={JobInfoScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AboutYourselfScreen" component={AboutYourselfScreen} />
        <Stack.Screen name="WorkLocationScreen" component={WorkLocationScreen} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        <Stack.Screen name="ResponsesScreen" component={ResponsesScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="JobRoleScreen" component={SelectJobRoleScreen} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
      </>
    )}
  </Stack.Navigator>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  return ( 
     <Provider store={store}>
  
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<Loader />}>
        <NavigationContainer>
          <RootNavigator showSplash={showSplash} />
        </NavigationContainer>
      </Suspense>
    </I18nextProvider>
      </Provider>
  );
};

export default App;