import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AppColors } from "../constants/AppColors";
import { useTranslation } from "react-i18next";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

interface AppFooterProps {
  currentIndex: number;
  onTap?: (index: number) => void;
}

const AppFooter: React.FC<AppFooterProps> = ({ currentIndex, onTap }) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const navItems = [
    { label: t("footer_home"), solid: "home", outline: "home-outline", route: "HomeScreen" },
    { label: t("footer_jobs"), solid: "work", outline: "briefcase-outline", route: "JobsScreen" },
    { label: t("footer_responses"), solid: "chat", outline: "chat-outline", route: "ResponsesScreen" },
    { label: t("footer_profile"), solid: "person", outline: "account-outline", route: "ProfileScreen" },
  ];

  const handlePress = (index: number, route: string) => {
    navigation.replace(route, { tabIndex: index });
    if (onTap) onTap(index);
  };

  return (
    <View style={footerStyles.container}>
      <View style={footerStyles.navBar}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={footerStyles.navItem}
            activeOpacity={0.8}
            onPress={() => handlePress(index, item.route)}
          >
            {currentIndex === index ? (
              <Icon name={item.solid} size={moderateScale(20)} color={AppColors.themeColor} />
            ) : (
              <MaterialCommunityIcons name={item.outline} size={moderateScale(20)} color="#999" />
            )}

            <Text
              style={[
                footerStyles.label,
                { color: currentIndex === index ? AppColors.themeColor : "#999" },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const footerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.15,
    shadowRadius: scale(4),
    paddingBottom: verticalScale(20),
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: verticalScale(6),
  },
  navItem: {
    alignItems: "center",
  },
  label: {
    fontSize: moderateScale(10),
    fontWeight: "500",
    marginTop: verticalScale(3),
  },
});

export default AppFooter;