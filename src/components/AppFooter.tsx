import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AppColors } from "../constants/AppColors";
import { useTranslation } from "react-i18next";   

interface AppFooterProps {
  currentIndex: number;
  onTap?: (index: number) => void;
}

const AppFooter: React.FC<AppFooterProps> = ({ currentIndex, onTap }) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();  // 👈 TRANSLATION HOOK

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
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => handlePress(index, item.route)}
          >
            {currentIndex === index ? (
              <Icon name={item.solid} size={24} color={AppColors.themeColor} />
            ) : (
              <MaterialCommunityIcons name={item.outline} size={24} color="#999" />
            )}

            <Text
              style={[
                styles.label,
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    paddingBottom:25
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  navItem: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});

export default AppFooter;
