import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { I18nextProvider } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen";
import PhoneLoginScreen from "./src/screens/PhoneLoginScreen";
import ProfileScreen from "./src/screens/Profile/ProfileScreen";
import AboutYourselfScreen from "./src/screens/PreLogin/AboutYourselfScreen";
import WorkLocationScreen from "./src/screens/PreLogin/WorkLocationScreen";
import ResponsesScreen from "./src/screens/ResponsesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import SelectJobRoleScreen from "./src/screens/PreLogin/JobRoleScreen";
import JobDetailsScreen from "./src/screens/PreLogin/JobDetailsScreen";
import JobsScreen from "./src/screens/JobsScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import SplashScreen from "./src/screens/PreLogin/SplashScreen";
import JobInfoScreen from "./src/screens/JobInfoScreen";
import i18n from "./src/i18n/i18n";

const Stack = createNativeStackNavigator();

/* Loader */
const Loader = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);

/* 👇 Wrapper to apply bottom inset globally */
const RootNavigatorWithInsets = ({ showSplash }: { showSplash: boolean }) => {
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        /* ✅ THIS FIXES BOTTOM NAV OVERLAP */
        contentStyle: {
          paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: '#fff', 

        },
      }}
    >
      {showSplash ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
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
};

const App = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          {/* ✅ SafeAreaProvider MUST wrap NavigationContainer */}
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavigatorWithInsets showSplash={showSplash} />
            </NavigationContainer>
          </SafeAreaProvider>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
