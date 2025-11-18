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

interface AppHeaderProps {
  location?: string;
  title?: string;
  onNotificationTap?: () => void;
  showLogo?: boolean;
  showLocation?: boolean;
  customLeftWidget?: React.ReactNode;
  showBackArrow?: boolean;
  onBackPressed?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  location = "Dewa Road",
  title,
  onNotificationTap,
  showLogo = true,
  showLocation = true,
  customLeftWidget,
  showBackArrow = false,
  onBackPressed,
}) => {
  const onLanguageChanged = () => {
    console.log("Language changed");
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 🔹 Left Section */}
          <View style={styles.leftSection}>
            {showBackArrow && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onBackPressed}
              >
                <Icon name="arrow-back" size={20} color="#00A79D" />
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
                    <Icon name="location-on" size={18} color="#00A79D" />
                    <Text style={styles.locationText}>{location}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 🔹 Right Section */}
          <View style={styles.rightSection}>
            {/* Notifications */}
            <View style={styles.notificationWrapper}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationTap}
              >
                <Icon name="notifications" size={26} color="#00A79D" />
              </TouchableOpacity>

              {/* 🔸 Notification Badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </View>

            {/* Language Selector */}
            <View style={styles.languageWrapper}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onLanguageChanged}
              >
                <Icon name="translate" size={22} color="#00A79D" />
              </TouchableOpacity>
              <Icon
                name="keyboard-arrow-down"
                size={18}
                color="#00A79D"
                style={{ marginLeft: 2 }}
              />
            </View>
          </View>
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
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  leftSection: {
    flexDirection: "row",
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
    color: "#00A79D",
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