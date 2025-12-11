import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import { AppColors } from "../constants/AppColors";
import { AppConstants } from "../constants/AppConstants";

const languages = [
  { code: "en", label: "English (English)" },
  { code: "hi", label: "हिंदी (Hindi)" },
];

const LanguageSelectorBottomSheet = ({ visible, onClose }: any) => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleNext = async () => {
    await i18n.changeLanguage(selectedLang);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("chooseLanguage")}</Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={AppConstants.iconSize.xs}
                color={AppColors.themeColor}
              />
            </TouchableOpacity>
          </View>
<View style={styles.dividerWrapper}>
          <View style={styles.divider} />
</View>
          {/* LANG LIST */}
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => {
              const selected = selectedLang === item.code;
              return (
                <TouchableOpacity
                  style={[styles.card, selected && styles.cardSelected]}
                  onPress={() => setSelectedLang(item.code)}
                >
                  <Text style={styles.label}>{item.label}</Text>

                  {/* Radio */}
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterActive,
                    ]}
                  >
                    {selected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* NEXT BUTTON */}
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>{t("next")}</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelectorBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: AppConstants.padding.md,
    borderTopLeftRadius: AppConstants.borderRadius.lg,
    borderTopRightRadius: AppConstants.borderRadius.lg,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: AppConstants.fontSize.lg,
    fontWeight: "700",
  },
dividerWrapper: {
  marginHorizontal: -AppConstants.padding.md,  // removes left & right padding
},

  divider: {
    height: AppConstants.screenHeight * 0.0015,
    backgroundColor: "#ddd",
    marginVertical: AppConstants.spacing.md,
    marginBottom: AppConstants.spacing.lg,
  },

  card: {
    padding: AppConstants.padding.sm,
    borderRadius: AppConstants.borderRadius.sm,
    borderWidth: 1,
    borderColor: AppColors.themeBorder,
    marginBottom: AppConstants.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: AppColors.themeColorLight,
  },

  cardSelected: {
    backgroundColor: AppColors.themeColorLight,
  },

  label: {
    fontSize: AppConstants.fontSize.md,
    fontWeight: "500",
  },

  radioOuter: {
    width: AppConstants.iconSize.sm,
    height: AppConstants.iconSize.sm,
    borderRadius: AppConstants.iconSize.sm,
    borderWidth: 2,
    borderColor: AppColors.themeColor,
    justifyContent: "center",
    alignItems: "center",
  },

  radioOuterActive: {
    borderColor: AppColors.themeColor,
  },

  radioInner: {
    width: AppConstants.iconSize.xxs,
    height: AppConstants.iconSize.xxs,
    backgroundColor: AppColors.themeColor,
    borderRadius: AppConstants.iconSize.xxs,
  },

  nextBtn: {
    backgroundColor: AppColors.themeColor,
    paddingVertical: AppConstants.padding.sm,
    borderRadius: AppConstants.borderRadius.lg,
    marginTop: AppConstants.spacing.sm,
    marginBottom: AppConstants.spacing.lg,
    height: AppConstants.buttonHeight.md,
    justifyContent: "center",
  },

  nextBtnText: {
    color: "#fff",
    fontSize: AppConstants.fontSize.md,
    textAlign: "center",
    fontWeight: "600",
  },
});
