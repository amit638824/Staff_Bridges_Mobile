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
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

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

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#fff',
    padding: scale(16),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },

  dividerWrapper: {
    marginHorizontal: -scale(16),
  },

  divider: {
    height: verticalScale(1),
    backgroundColor: '#ddd',
    marginVertical: verticalScale(12),
  },

  card: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: AppColors.themeBorder,
    marginBottom: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: AppColors.themeColorLight,
  },

  cardSelected: {
    backgroundColor: AppColors.themeColorLight,
  },

  label: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },

  radioOuter: {
    width: scale(15),
    height: scale(15),
    borderRadius: scale(15),
    borderWidth: 2,
    borderColor: AppColors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: AppColors.themeColor,
  },

  radioInner: {
    width: scale(8),
    height: scale(8),
    backgroundColor: AppColors.themeColor,
    borderRadius: scale(8),
  },

  nextBtn: {
    backgroundColor: AppColors.themeColor,
    paddingVertical: verticalScale(10),
    borderRadius: scale(20),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
    height: verticalScale(36),
    justifyContent: 'center',
  },

  nextBtnText: {
    color: '#fff',
    fontSize: moderateScale(14),
    textAlign: 'center',
    fontWeight: '600',
  },
});
