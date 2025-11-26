import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

// ✅ Define and export RootStackParamList properly
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

// Define JobDetailsScreenParams
export interface JobDetailsScreenParams {
  selectedRoles: { id: string; title: string; image: any }[];
  currentRoleIndex: number;
  completedRoles: Record<string, any>; // you can refine this type
  totalRoles: number;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {showSplash ? (
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ 
            //  animationEnabled: false,
              gestureEnabled: false,
            }}
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
            {/* <Stack.Screen name="JobRoleScreen" component={JobRoleFlowScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;