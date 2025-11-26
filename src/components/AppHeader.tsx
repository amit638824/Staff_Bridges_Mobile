import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";   // 👈 IMPORT YOUR TYPE
import { AppColors } from "../constants/AppColors";


interface AppHeaderProps {
  location?: string;
  title?: string;
  showLogo?: boolean;
  showLocation?: boolean;
  customLeftWidget?: React.ReactNode;
  showBackArrow?: boolean;
  onBackPressed?: () => void;
  showNotification?: boolean;
  showLanguage?: boolean;
  showRightSection?: boolean;
  onNotificationTap?: () => void; // 👈 ADD THIS
}


const AppHeader: React.FC<AppHeaderProps> = ({
  location = "Dewa Road",
  title,
  showLogo = true,
  showLocation = true,
  customLeftWidget,
  showBackArrow = false,
  onBackPressed,
  showNotification = true,
  showLanguage = true,
  showRightSection = true,
}) => {

const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onLanguageChanged = () => {
    console.log("Language changed");
  };

const handleNotificationTap = () => {
  navigation.navigate("NotificationsScreen");
};

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* LEFT SECTION */}
          <View style={styles.leftSection}>
            {showBackArrow && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onBackPressed}
              >
                <Icon name="arrow-back" size={20} color="#080808ff" />
              </TouchableOpacity>
            )}

            {customLeftWidget ? (
              customLeftWidget
            ) : (
              <View style={styles.leftInner}>
                {showLogo && (
                  <Image
                    source={require("../../assets/images/staff_bridges_logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                )}
                {showLogo && <View style={{ width: 8 }} />}

                {showLocation && (
                  <View style={styles.locationContainer}>
                    <Icon name="location-on" size={18} color={AppColors.buttons} />
                    <Text style={styles.locationText}>{location}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* RIGHT SECTION */}
          {showRightSection && (
            <View style={styles.rightSection}>
              
              {/* NOTIFICATION ICON */}
              {showNotification && (
                <View style={styles.notificationWrapper}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleNotificationTap}  // 👈 UPDATED
                  >
                    <Icon name="notifications" size={26} color={AppColors.buttons} />
                  </TouchableOpacity>

                  {/* BADGE */}
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                </View>
              )}

              {/* LANGUAGE BUTTON */}
              {showLanguage && (
                <View style={styles.languageWrapper}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onLanguageChanged}
                  >
                    <Icon name="translate" size={22} color={AppColors.buttons}/>
                  </TouchableOpacity>
                  <Icon
                    name="keyboard-arrow-down"
                    size={18}
                    color={AppColors.buttons}
                    style={{ marginLeft: 2 }}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};


export default AppHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  leftSection: {
    flexDirection: "row",
    marginLeft: 10,
  },
  leftInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 35,
    width: 120,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: AppColors.buttons,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 4,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 4,
  },
  notificationWrapper: {
    position: "relative",
    marginRight: 10,
  },
  badge: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 14,
    height: 14,
    backgroundColor: "#FF6B00",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  languageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
});