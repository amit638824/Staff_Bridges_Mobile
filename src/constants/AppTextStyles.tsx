import { StyleSheet, TextStyle } from "react-native";
import { AppColors } from "./AppColors";

// ✅ If you're using Google Fonts (via Expo), install it:
// expo install @expo-google-fonts/poppins expo-font

export const AppTextStyles = StyleSheet.create<{
  headlineLarge: TextStyle;
  headlineMedium: TextStyle;
  bodyLarge: TextStyle;
  bodyMedium: TextStyle;
  buttonText: TextStyle;
}>({
  headlineLarge: {
    color: AppColors.textPrimary,
    fontFamily: "Poppins-Bold", // ✅ ensure this font is loaded in your app
    fontWeight: "700",
    fontSize: 24,
  },
  headlineMedium: {
    color: AppColors.textPrimary,
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
    fontSize: 20,
  },
  bodyLarge: {
    color: AppColors.textPrimary,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  bodyMedium: {
    color: AppColors.textSecondary,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  buttonText: {
    color: AppColors.white,
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
    fontSize: 16,
  },
});
