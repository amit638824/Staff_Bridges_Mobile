import React, { useState, useEffect } from "react";
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

export default function AboutYourselfScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();

  // ===== ALL HOOKS MUST COME FIRST =====
  const authUserId = useSelector((state: RootState) => state.auth?.userId);
  const authToken  = useSelector((state: RootState) => state.auth?.token);
  const authState  = useSelector((state: RootState) => state.auth);
  const loading    = useSelector((state: RootState) => state.user?.loading);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasAuthError, setHasAuthError]     = useState(false);

  // THESE WERE THE PROBLEM — MUST ALWAYS RUN, EVEN IF SCREEN RETURNS EARLY
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");

  // =====================================
  // Now your useEffect is safe
  // =====================================
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


  // ✅ Show loading while checking auth
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

  // ✅ Show error if auth failed
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
            onPress={() => {
              console.log('🔄 Navigating back to PhoneLoginScreen');
              navigation.replace('PhoneLoginScreen');
            }}
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


  const handleNext = async () => {
    console.log('🚀 handleNext called');
    console.log('Form Data:', { fullName, gender, education, experience, salary });
    console.log('UserId from Redux:', authUserId);

    // ✅ Validate required fields
    if (!fullName.trim() || !gender || !education) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (!authUserId) {
      console.error('❌ CRITICAL: No userId available!');
      Alert.alert("Error", "User ID not found. Please login again.");
      navigation.replace('PhoneLoginScreen');
      return;
    }

    console.log('📤 Calling updateBasicInfo API with userId:', authUserId);

    // ✅ Call updateBasicInfo API
    try {
      const result = await dispatch(
     updateBasicInfo({
  userId: authUserId,
  fullName: fullName.trim(),
  gender,
  salary: salary.trim(),
  education,
  experience,              // ✅ added
})

      );

      console.log('📥 updateBasicInfo result:', JSON.stringify(result, null, 2));

      // ✅ Check if the thunk was fulfilled (success)
      if (updateBasicInfo.fulfilled.match(result)) {
        console.log("✅ Profile Updated Successfully");
        Alert.alert("Success", "Profile updated successfully!");

        // ✅ Request location permission
        let permissionResult;
        if (Platform.OS === "android") {
          permissionResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        } else {
          permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }

        if (permissionResult === RESULTS.GRANTED) {
          // ✅ Get current location
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("✅ Location Captured:", latitude, longitude);

              // ✅ Save location to Redux
              dispatch(setLocation({ latitude, longitude }));
Alert.alert(
  "Location Captured",
  `Latitude: ${latitude}\nLongitude: ${longitude}`
);

              // ✅ Navigate to next screen
              console.log('🚀 Navigating to WorkLocationScreen');
              navigation.navigate("WorkLocationScreen");
            },
            (error) => {
              console.error("❌ Error getting location:", error);
              // Continue anyway even if location fails
              console.log('⚠️ Continuing without location...');
              navigation.navigate("WorkLocationScreen");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          console.warn("⚠️ Location permission denied, continuing anyway");
          // Continue to next screen even without location
          navigation.navigate("WorkLocationScreen");
        }
      } else {
        // ✅ Handle API error
        const errorMessage = result.payload?.message || result.payload?.error || "Failed to update profile.";
        console.error("❌ Profile Update Failed:", result.payload);
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("❌ Exception during profile update:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView 
      style={[
        styles.safeArea, 
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }
      ]}
    >
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
        <TextInput 
          placeholder={t("fullName")} 
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#999"
        />

        {/* Gender */}
        <Text style={styles.label}>{t("gender")} *</Text>
        <View style={styles.row}>
          {[
            { key: "male", label: t("male"), icon: "male" },
            { key: "female", label: t("female"), icon: "female" }
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.chip, gender === item.key && styles.chipSelected]}
              onPress={() => setGender(item.key)}
            >
              <Icon name={item.icon} size={16} color="black" />
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Education */}
        <Text style={styles.label}>{t("education")} *</Text>
        <View style={styles.wrap}>
          {educationOptions.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.chip, education === item.key && styles.chipSelected]}
              onPress={() => setEducation(item.key)}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Experience */}
        <Text style={styles.label}>{t("workExperience")}</Text>
        <View style={styles.row}>
          {[
            { key: "experienced", label: t("haveExperience") },
            { key: "fresher", label: t("fresher") }
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.chip, experience === item.key && styles.chipSelected]}
              onPress={() => setExperience(item.key)}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Salary */}
        <Text style={styles.label}>{t("monthlySalary")}</Text>
        <View style={styles.salaryBox}>
          <TextInput
            style={styles.salaryInputField}
            placeholder={t("salaryPlaceholder")}
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
          />
          <Text style={styles.suffixText}>{t("perMonth")}</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.primaryButton, { opacity: fullName.trim() === "" ? 0.5 : 1 }]}
          disabled={loading || fullName.trim() === ""}
          onPress={handleNext}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>{t("next")}</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    padding: 20,
  },

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

  imageContainer: { marginBottom: 10 },
  icon: { width: 60, height: 60 },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 20 },
  label: { marginTop: 10, fontSize: 15, fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    color: "black",
  },

  row: { flexDirection: "row", gap: 10, marginVertical: 8 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 10 },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: "#ccc",
  },

  chipSelected: {
    backgroundColor: "#e7f6f6",
    borderColor: "#099ca4",
  },

  chipText: { marginLeft: 5, fontSize: 13 },

  salaryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 6,
  },

  salaryInputField: {
    flex: 1,
    paddingVertical: 12,
    color: "black",
    fontSize: 15,
  },

  suffixText: {
    color: "#555",
    fontSize: 14,
    marginLeft: 5,
  },

  primaryButton: {
    backgroundColor: AppColors.buttons,
    padding: 16,
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 25,
  },

  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});