import React, { useState } from "react";
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
import { RootStackParamList } from "../../App";
import { AppColors } from "../constants/AppColors";
import { useTranslation } from "react-i18next";
import LanguageSelectorBottomSheet from "../components/LanguageSelectorBottomSheet";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 

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
  onNotificationTap?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  location = "location_dewa_road",
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
  const { t } = useTranslation();

  const [showLangModal, setShowLangModal] = useState(false);

  // ✅ GET LOCATION FROM REDUX
  const { city, locality } = useSelector(
    (state: RootState) => state.location
  );

  // ✅ FINAL LOCATION LABEL
  const locationLabel =
    locality && city
      // ? `${locality}, ${city}`
      ? `${locality}`
      : locality
      ? locality
      : city
      ? city
      : t(location);

  const handleNotificationTap = () => {
    navigation.navigate("NotificationsScreen");
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={headerStyles.safeArea}>
        <View style={headerStyles.container}>

          {/* LEFT */}
          <View style={headerStyles.leftSection}>
            {showBackArrow && (
              <TouchableOpacity
                style={[headerStyles.iconButton, { marginLeft: moderateScale(8) }]}
                onPress={onBackPressed}
              >
                <Icon
                  name="arrow-back"
                  size={moderateScale(18)}
                  color="#080808ff"
                />
              </TouchableOpacity>
            )}

            {customLeftWidget ? (
              customLeftWidget
            ) : (
              <View style={headerStyles.leftInner}>
                {showLogo && (
                  <Image
                    source={require("../../assets/images/staff_bridges_logo.png")}
                    style={headerStyles.logo}
                    resizeMode="contain"
                  />
                )}

                {showLogo && <View style={{ width: scale(6) }} />}

                {showLocation && (
                  <View style={headerStyles.locationContainer}>
                    <Icon
                      name="location-on"
                      size={moderateScale(18)}
                      color={AppColors.buttons}
                    />
                    <Text
                      style={headerStyles.locationText}
                      numberOfLines={1}
                    >
                      {locationLabel}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          {/* RIGHT */}
          {showRightSection && (
            <View style={headerStyles.rightSection}>

              {/* NOTIFICATION */}
              {showNotification && (
                <View style={headerStyles.notificationWrapper}>
                  <TouchableOpacity
                    style={headerStyles.iconButton}
                    onPress={handleNotificationTap}
                  >
                    <Icon name="notifications" size={moderateScale(22)} color={AppColors.buttons} />
                  </TouchableOpacity>

                  <View style={headerStyles.badge}>
                    <Text style={headerStyles.badgeText}>2</Text>
                  </View>
                </View>
              )}

              {/* LANGUAGE */}
              {showLanguage && (
                <View style={headerStyles.languageWrapper}>
                  <TouchableOpacity
                    style={headerStyles.iconButton}
                    onPress={() => setShowLangModal(true)}
                  >
                    <Icon name="translate" size={moderateScale(20)} color={AppColors.buttons} />
                  </TouchableOpacity>

                  <Icon
                    name="keyboard-arrow-down"
                    size={moderateScale(16)}
                    color={AppColors.buttons}
                    style={{ marginLeft: scale(1) }}
                  />
                </View>
              )}

            </View>
          )}
        </View>
      </SafeAreaView>

      <LanguageSelectorBottomSheet
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </>
  );
};

export default AppHeader;

const headerStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(0),
    paddingBottom: verticalScale(5),
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
    height: verticalScale(39),
    width: scale(90),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: AppColors.buttons,
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginLeft: scale(3),
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: scale(3),
        marginRight:scale(5),

  },
  notificationWrapper: {
    position: "relative",
    marginRight: scale(4),
  },
  badge: {
    position: "absolute",
    right: scale(4),
    top: verticalScale(-2),
    width: scale(14),
    height: scale(14),
    backgroundColor: "#e06417",
    borderRadius: scale(18),
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: moderateScale(10),
    fontWeight: "bold",
  },
  languageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: scale(16),
  },
});