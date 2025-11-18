// utils/AppTheme.tsx

import { StyleSheet } from 'react-native';
import { AppColors } from './AppColors';
import {AppTextStyles} from './AppTextStyles';

export const AppTheme = {
  // 🌞 Light Theme Configuration
  lightTheme: StyleSheet.create({
    // 🔹 Primary layout background
    screen: {
      flex: 1,
      backgroundColor: AppColors.background,
    },

    // 🌐 AppBar/Header style
    appBar: {
      backgroundColor: AppColors.white,
      elevation: 0,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: AppColors.border,
    },

    appBarTitle: {
      color: AppColors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },

    // ✏️ Input field styles
    input: {
      backgroundColor: AppColors.white,
      borderColor: AppColors.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 12,
      fontSize: 14,
      color: AppColors.textPrimary,
    },

    inputFocused: {
      borderColor: AppColors.primary,
      borderWidth: 1.5,
    },

    inputPlaceholder: {
      color: AppColors.textSecondary,
    },

    // ✅ Checkbox styling
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderColor: AppColors.border,
      borderWidth: 1,
      backgroundColor: AppColors.success,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // 🔘 Button styling
    button: {
      backgroundColor: AppColors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      elevation: 2,
    },

    buttonText: {
      ...AppTextStyles.buttonText,
      color: AppColors.white,
    },

    // 🖼️ Icon style (for global use)
    icon: {
      color: AppColors.primary,
    },

    // 📝 Text style linking Flutter’s textTheme
    textPrimary: {
      ...AppTextStyles.bodyLarge,
      color: AppColors.textPrimary,
    },
    textSecondary: {
      ...AppTextStyles.bodyMedium,
      color: AppColors.textSecondary,
    },
  }),
};
