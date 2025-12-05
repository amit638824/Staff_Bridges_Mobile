import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AppColors } from "../../constants/AppColors";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateBasicInfo, setLocation } from "../../redux/slices/userSlice";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ===========================
// Yup validation schema
// ===========================
const schema = yup.object().shape({
  fullName: yup.string().trim().required("Full Name is required"),
  gender: yup.string().required("Gender is required"),
  education: yup.string().required("Education is required"),
  experience: yup.string().required("Experience is required"),
  salary: yup.string().matches(/^\d*$/, "Salary must be numeric").nullable(),
});

export default function AboutYourselfScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();

  const authUserId = useSelector((state: RootState) => state.auth?.userId);
  const authToken = useSelector((state: RootState) => state.auth?.token);
  const authState = useSelector((state: RootState) => state.auth);
  const loading = useSelector((state: RootState) => state.user?.loading);

  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [hasAuthError, setHasAuthError] = React.useState(false);

  // ===========================
  // React Hook Form
  // ===========================
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      gender: "",
      education: "",
      experience: "",
      salary: "",
    },
  });

  // ===========================
  // Check auth on mount
  // ===========================
  useEffect(() => {
    console.log('=== AboutYourselfScreen Mount ===');
    console.log('Full Auth State:', JSON.stringify(authState, null, 2));

    const timer = setTimeout(() => {
      if (!authUserId || !authToken) {
        setHasAuthError(true);
      } else {
        setHasAuthError(false);
      }
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [authUserId, authToken, authState]);

  if (isCheckingAuth) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={AppColors.buttons} />
          <Text style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
            {t('loading')}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasAuthError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20, fontWeight: '600' }}>
            ❌ User not found. Please login again.
          </Text>
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#999', marginBottom: 20 }}>
            UserId: {authUserId || 'null'}{'\n'}
            Token: {authToken ? '***SET***' : 'NOT SET'}
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { width: '100%' }]}
            onPress={() => navigation.replace('PhoneLoginScreen')}
          >
            <Text style={styles.btnText}>Go Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const educationOptions = [
    { key: "belowTenth", label: t("belowTenth") },
    { key: "tenthPass", label: t("tenthPass") },
    { key: "twelfthPass", label: t("twelfthPass") },
    { key: "diploma", label: t("diploma") },
    { key: "graduate", label: t("graduate") },
    { key: "postGraduate", label: t("postGraduate") },
  ];

  // ===========================
  // Submit handler
  // ===========================
  const onSubmit = async (data: any) => {
    console.log("🚀 Form Data:", data);

    if (!authUserId) {
      Alert.alert("Error", "User ID not found. Please login again.");
      navigation.replace('PhoneLoginScreen');
      return;
    }

    try {
      const result = await dispatch(updateBasicInfo({
        userId: authUserId,
        fullName: data.fullName.trim(),
        gender: data.gender,
        salary: data.salary?.trim(),
        education: data.education,
        experience: data.experience,
      }));

      if (updateBasicInfo.fulfilled.match(result)) {
        Alert.alert("Success", "Profile updated successfully!");

        // Request location permission
        let permissionResult;
        if (Platform.OS === "android") {
          permissionResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        } else {
          permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }

        if (permissionResult === RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              dispatch(setLocation({ latitude, longitude }));
              Alert.alert("Location Captured", `Latitude: ${latitude}\nLongitude: ${longitude}`);
              navigation.navigate("WorkLocationScreen");
            },
            (error) => {
              console.error("❌ Error getting location:", error);
              navigation.navigate("WorkLocationScreen");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          navigation.navigate("WorkLocationScreen");
        }
      } else {
        const errorMessage = result.payload?.message || result.payload?.error || "Failed to update profile.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  // ===========================
  // Render
  // ===========================
  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressFill} />
        </View>

        {/* Icon */}
        <View style={styles.imageContainer}>
          <Image source={require("../../../assets/images/list.png")} style={styles.icon} />
        </View>

        <Text style={styles.title}>{t("aboutYourself")}</Text>

        {/* Full Name */}
        <Text style={styles.label}>{t("yourName")} *</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                placeholder={t("fullName")}
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#999"
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
            </>
          )}
        />

        {/* Gender */}
        <Text style={styles.label}>{t("gender")} *</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { value, onChange } }) => (
            <View style={styles.row}>
              {[
                { key: "male", label: t("male"), icon: "male" },
                { key: "female", label: t("female"), icon: "female" }
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.chip, value === item.key && styles.chipSelected]}
                  onPress={() => onChange(item.key)}
                >
                  <Icon name={item.icon} size={16} color="black" />
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}
            </View>
          )}
        />

        {/* Education */}
        <Text style={styles.label}>{t("education")} *</Text>
        <Controller
          control={control}
          name="education"
          render={({ field: { value, onChange } }) => (
            <View style={styles.wrap}>
              {educationOptions.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.chip, value === item.key && styles.chipSelected]}
                  onPress={() => onChange(item.key)}
                >
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              {errors.education && <Text style={styles.errorText}>{errors.education.message}</Text>}
            </View>
          )}
        />

        {/* Experience */}
        <Text style={styles.label}>{t("workExperience")}</Text>
        <Controller
          control={control}
          name="experience"
          render={({ field: { value, onChange } }) => (
            <View style={styles.row}>
              {["experienced", "fresher"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, value === item && styles.chipSelected]}
                  onPress={() => onChange(item)}
                >
                  <Text style={styles.chipText}>{t(item)}</Text>
                </TouchableOpacity>
              ))}
              {errors.experience && <Text style={styles.errorText}>{errors.experience.message}</Text>}
            </View>
          )}
        />

        {/* Salary */}
        <Text style={styles.label}>{t("monthlySalary")}</Text>
        <Controller
          control={control}
          name="salary"
          render={({ field: { value, onChange } }) => (
            <View style={styles.salaryBox}>
              <TextInput
                style={styles.salaryInputField}
                placeholder={t("salaryPlaceholder")}
                placeholderTextColor="#888"
                keyboardType="numeric"
value={value || ""}
                onChangeText={onChange}
              />
              <Text style={styles.suffixText}>{t("perMonth")}</Text>
              {errors.salary && <Text style={styles.errorText}>{errors.salary.message}</Text>}
            </View>
          )}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{t("next")}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20 },
  progressContainer: { height: 10, width: "100%", backgroundColor: "#cacaca", borderRadius: 5, marginBottom: 20 },
  progressFill: { height: "100%", width: "20%", backgroundColor: AppColors.buttons, borderRadius: 5 },
  imageContainer: { marginBottom: 10 },
  icon: { width: 60, height: 60 },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 20 },
  label: { marginTop: 10, fontSize: 15, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 10, marginTop: 6, color: "black" },
  row: { flexDirection: "row", gap: 10, marginVertical: 8 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 10 },
  chip: { flexDirection: "row", alignItems: "center", borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderColor: "#ccc" },
  chipSelected: { backgroundColor: "#e7f6f6", borderColor: "#099ca4" },
  chipText: { marginLeft: 5, fontSize: 13 },
  salaryBox: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12, marginTop: 6 },
  salaryInputField: { flex: 1, paddingVertical: 12, color: "black", fontSize: 15 },
  suffixText: { color: "#555", fontSize: 14, marginLeft: 5 },
  primaryButton: { backgroundColor: AppColors.buttons, padding: 16, alignItems: "center", borderRadius: 30, marginVertical: 25 },
  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  errorText: { color: "red", fontSize: 12, marginTop: 2 },
});
