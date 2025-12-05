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
              <Ionicons name="close" size={18} color="#444" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

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
    ...StyleSheet.absoluteFillObject,   // 👈 removes all screen gaps
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,                   // 👈 permanently sticks to bottom
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 12 },

  card: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.themeColor,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardSelected: { backgroundColor: AppColors.themeColorLight },
  label: { fontSize: 15, fontWeight: "500" },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: AppColors.themeColor,
    justifyContent: "center",
    alignItems: "center",
  },

  radioOuterActive: { borderColor: AppColors.themeColor },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: AppColors.themeColor,
    borderRadius: 10,
  },

  nextBtn: {
    backgroundColor: AppColors.themeColor,
    paddingVertical: 14,
    borderRadius: 40,
    marginTop: 10,
  },

  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },

});