import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { AppColors } from "../../constants/AppColors";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";

const citiesKeys = ["lucknow", "delhi", "pune", "hyderabad", "mumbai"];

const localitiesData = [
  "adilNagar",
  "amarShaheedPath",
  "arjunganj",
  "cantonment",
  "faizullaganj",
  "kursiRoad",
  "safedabad",
  "samesee",
  "sisana",
  "sultanpurRoad",
  "aishbagh",
  "aminabad",
  "bakshiKaTalab",
  "devaRoad",
  "faizabadRoad",
  "gomtiNagar",
];

export default function WorkLocationScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [showLocalityModal, setShowLocalityModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredLocalities = localitiesData.filter((item) =>
    t(item).toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/your-location.png")}
            style={styles.icon}
          />
        </View>

        <Text style={styles.title}>{t("tellWorkLocation")}</Text>

        <Text style={styles.label}>{t("preferredCity")}</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowCityModal(true)}>
          <Text style={styles.dropdownText}>{selectedCity ? t(selectedCity) : t("chooseCity")}</Text>
          <Icon name="keyboard-arrow-down" size={22} />
        </TouchableOpacity>

        <Text style={styles.label}>{t("preferredLocality")}</Text>
        <TouchableOpacity
          disabled={!selectedCity}
          style={[styles.dropdown, { opacity: selectedCity ? 1 : 0.4 }]}
          onPress={() => setShowLocalityModal(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedLocality ? t(selectedLocality) : t("chooseLocality")}
          </Text>
          <Icon name="keyboard-arrow-down" size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!selectedCity || !selectedLocality}
          style={[
            styles.button,
            { backgroundColor: selectedCity && selectedLocality ? AppColors.buttons : "#cacaca" },
          ]}
          onPress={() => navigation.navigate("JobRoleScreen")}
        >
          <Text style={styles.btnText}>{t("next")}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* LOCALITY BOTTOM SHEET */}
      <Modal visible={showLocalityModal} transparent animationType="slide">
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
         <Text style={styles.sheetTitle}>
  {selectedCity ? t("chooseLocalityWithCity", { city: t(selectedCity) }) : t("chooseYourLocality")}
</Text>


              <TouchableOpacity onPress={() => setShowLocalityModal(false)}>
                <Icon name="close" size={26} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider}></View>

            <TextInput
              placeholder={t("typeLocality")}
              placeholderTextColor="#7c7878ff"
              style={styles.searchBar}
              value={searchText}
              onChangeText={setSearchText}
            />

            <FlatList
              data={filteredLocalities}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F2F2F2" },
                  ]}
                  onPress={() => {
                    setSelectedLocality(item);
                    setShowLocalityModal(false);
                    setSearchText("");
                  }}
                >
                  <Text style={styles.listItemText}>{t(item)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* CITY BOTTOM SHEET */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.sheetHeader}>
              <Text style={styles.modalTitle}>{t("chooseCity")}</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Icon name="close" size={26} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={citiesKeys}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F2F2F2" },
                  ]}
                  onPress={() => {
                    setSelectedCity(item);
                    setSelectedLocality("");
                    setShowCityModal(false);
                  }}
                >
                  <Text style={styles.cityText}>{t(item)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 30 },
  progressContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#cacaca",
    borderRadius: 5,
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    width: "20%",
    backgroundColor: AppColors.buttons,
    borderRadius: 5,
  },
  imageContainer: { alignItems: "flex-start", marginBottom: 10 },
  icon: { width: 60, height: 60 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 25 },
  label: { marginTop: 10, fontWeight: "600" },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: { fontSize: 14 },
  button: {
    marginTop: 50,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    height: "70%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: "bold" },
  listItem: {
    width: "95%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  listItemText: { fontSize: 15 },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    color: "black",
    marginTop: 30,
    borderRadius: 2,
    marginBottom: 15,
    marginHorizontal: 10,
    width: "95%",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  cityItem: {
    width: "95%",
    paddingVertical: 16,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  cityText: { fontSize: 16 },
});