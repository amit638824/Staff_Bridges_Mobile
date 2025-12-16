import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { AppColors } from "../../constants/AppColors";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { workLocationSchema } from "../../validation/workLocationSchema";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import { locationService } from "../../services/locationService";

// ---------------- Types -----------------
interface City {
  id: number;
  name: string;
}

interface Locality {
  id: number;
  name: string;
}

export default function WorkLocationScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [showCityModal, setShowCityModal] = useState(false);
  const [showLocalityModal, setShowLocalityModal] = useState(false);

  const [cities, setCities] = useState<City[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);

  const [citySearchText, setCitySearchText] = useState("");
  const [localitySearchText, setLocalitySearchText] = useState("");

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingLocalities, setLoadingLocalities] = useState(false);

  const citySearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localitySearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const userId = useSelector((state: RootState) => state.auth?.userId);
const latitude = useSelector((state: RootState) => state.user?.location?.latitude);
const longitude = useSelector((state: RootState) => state.user?.location?.longitude);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workLocationSchema),
    defaultValues: {
      city: "",
      locality: "",
    },
  });

  const [loading, setLoading] = useState(false);

  // ---------------- Fetch All Cities with Pagination and optional search -----------------
  const fetchAllCities = async (searchName?: string) => {
    setLoadingCities(true);
    let allCities: City[] = [];
    let page = 1;

    try {
      while (true) {
        const res = await locationService.getCitiesByState(26, page, searchName);
        const items = res.data.data.items;
        const totalPages = res.data.data.totalPages;

        allCities = [...allCities, ...items];


        if (page >= totalPages) break;
        page++;
      }

      setCities(allCities);
    } catch (error) {
      // console.error("❌ Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  // ---------------- Fetch All Localities with Pagination and optional search -----------------
  const fetchAllLocalities = async (cityId: number, searchName?: string) => {
    setLoadingLocalities(true);
    let allLocalities: Locality[] = [];
    let page = 1;

    try {
      while (true) {
        const res = await locationService.getLocalitiesByCity(cityId, page, searchName);
        const items = res.data.data.items;
        const totalPages = res.data.data.totalPages;

        allLocalities = [...allLocalities, ...items];


        if (page >= totalPages) break;
        page++;
      }

      setLocalities(allLocalities);
    } catch (error) {
      // console.error("❌ Error fetching localities:", error);
    } finally {
      setLoadingLocalities(false);
    }
  };

  // Run on screen load - fetch initial cities
  useEffect(() => {
    fetchAllCities();
  }, []);

  // Debounced city search
  useEffect(() => {
    if (citySearchTimeoutRef.current) {
      clearTimeout(citySearchTimeoutRef.current);
    }

    citySearchTimeoutRef.current = setTimeout(() => {
      fetchAllCities(citySearchText);
    }, 500); // 500ms debounce

    return () => {
      if (citySearchTimeoutRef.current) {
        clearTimeout(citySearchTimeoutRef.current);
      }
    };
  }, [citySearchText]);

  // Debounced locality search
  useEffect(() => {
    if (localitySearchTimeoutRef.current) {
      clearTimeout(localitySearchTimeoutRef.current);
    }

    localitySearchTimeoutRef.current = setTimeout(() => {
      const selectedCity = control._formValues.city;
      
      // Find city ID from cities array
      const cityItem = cities.find(c => c.name === selectedCity);
      if (cityItem) {
        fetchAllLocalities(cityItem.id, localitySearchText);
      }
    }, 500); // 500ms debounce

    return () => {
      if (localitySearchTimeoutRef.current) {
        clearTimeout(localitySearchTimeoutRef.current);
      }
    };
  }, [localitySearchText]);

const onSubmit = async (data: any) => {


  if (!userId) {
    Alert.alert("User not found, please login again");
    return;
  }

  if (!latitude || !longitude) {
    Alert.alert("Location not captured");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      userId,
      countryId: 1,
      stateId: 10,
      city: data.city,
      locality: data.locality,
      latitude,
      longitude,
    };


    const res = await locationService.updateUserLocation(payload);


    if (res.data?.success) {
      navigation.navigate("JobRoleScreen");
    } else {
      Alert.alert(res.data?.message || "Failed to update location");
    }
  } catch (error) {
    // console.error("❌ Location update error:", error);
    Alert.alert("Something went wrong while saving location");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.imageContainer}>
          <Image source={require("../../../assets/images/your-location.png")} style={styles.icon} />
        </View>

        <Text style={styles.title}>{t("tellWorkLocation")}</Text>

        {/* CITY FIELD */}
        <Text style={styles.label}>{t("preferredCity")}</Text>

        <Controller
          control={control}
          name="city"
          render={({ field: { value } }) => (
            <>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setCitySearchText("");
                  setShowCityModal(true);
                  // Fetch cities when modal opens (in case they were cleared)
                  if (cities.length === 0) {
                    fetchAllCities();
                  }
                }}
              >
                <Text style={[styles.dropdownText, { color: value ? '#000' : '#999' }]}>
                  {value ? value : t("chooseCity")}
                </Text>
                <Icon name="keyboard-arrow-down" size={22} />
              </TouchableOpacity>

              {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
            </>
          )}
        />

        {/* LOCALITY */}
        <Text style={styles.label}>{t("preferredLocality")}</Text>

        <Controller
          control={control}
          name="locality"
          render={({ field: { value } }) => (
            <>
              <TouchableOpacity
                disabled={!control._formValues.city}
                style={[
                  styles.dropdown,
                  { opacity: control._formValues.city ? 1 : 0.5 },
                ]}
                onPress={() => {
                  setLocalitySearchText("");
                  setShowLocalityModal(true);
                }}
              >
                <Text style={[styles.dropdownText, { color: value ? '#000' : '#999' }]}>
                  {value ? value : t("chooseLocality")}
                </Text>
                <Icon name="keyboard-arrow-down" size={22} />
              </TouchableOpacity>

              {errors.locality && (
                <Text style={styles.errorText}>{errors.locality.message}</Text>
              )}
            </>
          )}
        />

 
      </ScrollView>
       {/* NEXT BTN */}
          <View style={styles.fixedFooter}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  control._formValues.city && control._formValues.locality
                    ? AppColors.buttons
                    : "#ccc",
              },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>{t("next")}</Text>
            )}
          </TouchableOpacity>
        </View>
      {/* CITY MODAL */}
      <Modal visible={showCityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.sheetHeader}>
              <Text style={styles.modalTitle}>{t("chooseCity")}</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Icon name="close" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider}></View>

            {/* City Search Bar */}
            <TextInput
              placeholder={t("searchCityPlaceholder") || "Search city..."}
              style={styles.searchBar}
              value={citySearchText}
              onChangeText={setCitySearchText}
              placeholderTextColor="#999"
            />

            {loadingCities ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.buttons} />
                <Text style={styles.loadingText}>Loading cities...</Text>
              </View>
            ) : (
              <FlatList
                data={cities}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.cityItem,
                      { backgroundColor: index % 2 === 0 ? "#fff" : "#f7f7f7" },
                    ]}
                    onPress={() => {
                      setValue("city", item.name);
                      setValue("locality", "");
                      setLocalitySearchText("");
                      fetchAllLocalities(item.id);
                      setShowCityModal(false);
                    }}
                  >
                    <Text style={styles.cityText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No cities found</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* LOCALITY MODAL */}
      <Modal visible={showLocalityModal} transparent animationType="slide">
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{t("chooseLocality")}</Text>
              <TouchableOpacity onPress={() => setShowLocalityModal(false)}>
                <Icon name="close" size={20} />
              </TouchableOpacity>
            </View>
 <View style={styles.divider}></View>
            <TextInput
              placeholder={t("typeLocality") || "Search locality..."}
              style={styles.searchBar}
              value={localitySearchText}
              onChangeText={setLocalitySearchText}
              placeholderTextColor="#999"
            />

            {loadingLocalities ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.buttons} />
                <Text style={styles.loadingText}>Loading localities...</Text>
              </View>
            ) : (
              <FlatList
                data={localities}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      { backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2" },
                    ]}
                    onPress={() => {
                      setValue("locality", item.name);
                      setLocalitySearchText("");
                      setShowLocalityModal(false);
                    }}
                  >
                    <Text style={styles.listItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No localities found</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    padding: scale(12),
  },

  progressContainer: {
    height: verticalScale(6),
    width: "100%",
    backgroundColor: "#cacaca",
    borderRadius: scale(4),
    marginBottom: verticalScale(12),
  },

  progressFill: {
    height: "100%",
    width: "30%",
    backgroundColor: AppColors.buttons,
    borderRadius: scale(4),
  },

  imageContainer: {
    marginBottom: verticalScale(6),
    alignItems: "flex-start",
  },

  icon: {
    width: scale(45),
    height: scale(45),
    resizeMode: "contain",
  },

  title: {
    fontSize: moderateScale(15),
    fontWeight: "bold",
    marginVertical: verticalScale(12),
  },

  label: { 
    marginTop: verticalScale(8), 
    fontWeight: "600",
    fontSize: moderateScale(13),
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: scale(5),
    marginTop: verticalScale(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: { 
    fontSize: moderateScale(12),
    color: "#555"
  },

  errorText: {
    color: "red",
    fontSize: moderateScale(10),
    marginTop: verticalScale(3),
    marginLeft: scale(5),
  },

  fixedFooter: {
    paddingBottom: verticalScale(22),
    paddingHorizontal: scale(16),
    backgroundColor: "#fff",
  },

  button: {
    paddingVertical: verticalScale(12),
    borderRadius: scale(24),
    alignItems: "center",
    marginTop: verticalScale(20),
  },

  btnText: {
    color: "#fff",
    fontSize: moderateScale(13),
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  modalBox: {
    backgroundColor: "#fff",
    height: "65%",
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: scale(16),
  },

  modalTitle: { 
    fontSize: moderateScale(15), 
    fontWeight: "700" 
  },

  cityItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
  marginHorizontal:scale(8),
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  cityText: { 
    fontSize: moderateScale(13) 
  },

  bottomSheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    height: "65%",
    borderTopLeftRadius: scale(22),
    borderTopRightRadius: scale(22),
  },

  sheetTitle: {
    fontSize: moderateScale(14),
    fontWeight: "700",
  },

divider:{
// height:0.5,
 borderColor: "#ccc",
 borderWidth: 0.3,
 marginBottom: verticalScale(15),
},
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    margin: scale(10),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
    fontSize: moderateScale(12),
    borderRadius: scale(4),
  },

  listItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
  marginHorizontal:scale(8),
      borderBottomWidth: 1,
    borderColor: "#eee",
  },

  listItemText: { 
    fontSize: moderateScale(13) 
  },

  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },

  loadingText: { 
    marginTop: verticalScale(8), 
    color: "#999", 
    fontSize: moderateScale(12) 
  },

  emptyContainer: { 
    alignItems: "center", 
    paddingVertical: verticalScale(30) 
  },

  emptyText: { 
    fontSize: moderateScale(12), 
    color: "#999", 
    fontWeight: "500" 
  },
});
