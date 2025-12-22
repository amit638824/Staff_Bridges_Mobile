import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AppColors } from "../../constants/AppColors";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
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

// ===========================
// Education mapping types
// ===========================
interface EducationOption {
  key: "belowTenth" | "tenthPass" | "twelfthPass" | "diploma" | "graduate" | "postGraduate";
  label: string;
}

export default function AboutYourselfScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();

  const authUserId = useSelector((state: RootState) => state.auth?.userId);
  const authToken = useSelector((state: RootState) => state.auth?.token);
  const authState = useSelector((state: RootState) => state.auth);
  const loading = useSelector((state: RootState) => state.user?.loading);
  
  // ✅ Load existing profile data
  const userProfile = useSelector((state: RootState) => state.user?.profile);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasAuthError, setHasAuthError] = useState(false);

  // ===========================
  // Education mapping
  // ===========================
  const educationOptions: EducationOption[] = [
    { key: "belowTenth", label: t("belowTenth") },
    { key: "tenthPass", label: t("tenthPass") },
    { key: "twelfthPass", label: t("twelfthPass") },
    { key: "diploma", label: t("diploma") },
    { key: "graduate", label: t("graduate") },
    { key: "postGraduate", label: t("postGraduate") },
  ];

  const educationBackendMap: Record<string, string> = {
    belowTenth: "Any",  // ✅ FIXED: Capitalized "Any"
    tenthPass: "highschool",
    twelfthPass: "intermediate",
    diploma: "diploma",
    graduate: "graduate",
    postGraduate: "postgraduate",
  };

  // ✅ Reverse mapping (backend to frontend) - with proper type safety
  const educationFrontendMap: Record<string, "belowTenth" | "tenthPass" | "twelfthPass" | "diploma" | "graduate" | "postGraduate"> = {
    any: "belowTenth",
    highschool: "tenthPass",
    intermediate: "twelfthPass",
    diploma: "diploma",
    graduate: "graduate",
    postgraduate: "postGraduate",
  };

  // ===========================
  // React Hook Form
  // ===========================
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
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
  // Check auth on mount (no prefilling)
  // ===========================
  useEffect(() => {
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

  // ===========================
  // Submit handler
  // ===========================
  const onSubmit = async (data: any) => {
    if (!authUserId) {
      Alert.alert("Error", "User ID not found. Please login again.");
      navigation.replace('PhoneLoginScreen');
      return;
    }

    const backendEducation = educationBackendMap[data.education] ?? data.education;
    
    try {
      
      const result = await dispatch(updateBasicInfo({
        userId: authUserId,
        fullName: data.fullName.trim(),
        gender: data.gender,
        salary: data.salary?.trim() || "0",
        education: backendEducation,
        experience: data.experience,
      }) as any);


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
              // ✅ Set location in Redux (will be persisted automatically)
              dispatch(setLocation({ latitude, longitude }));
              navigation.navigate("WorkLocationScreen");
            },
            (error) => {
              navigation.navigate("WorkLocationScreen");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          navigation.navigate("WorkLocationScreen");
        }
      } else {
        // ✅ Extract error message safely from payload
        let errorMessage = "Failed to update profile";
        
        if (typeof result.payload === 'string') {
          errorMessage = result.payload;
        } else if (result.payload?.message) {
          errorMessage = result.payload.message;
        } else if (result.payload?.error) {
          errorMessage = result.payload.error;
        }
        
        console.error('❌ Profile update failed:', errorMessage);
        console.error('❌ Full error payload:', result.payload);
        Alert.alert("Error", errorMessage);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "An unexpected error occurred");
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/list.png")}
            style={styles.icon}
          />
        </View>

        <Text style={styles.title}>{t("aboutYourself")}</Text>

        {/* Full Name */}
        <Text style={styles.label}>{t("yourName")} </Text>
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
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName.message}</Text>
              )}
            </>
          )}
        />

        {/* Gender */}
        <Text style={styles.label}>{t("gender")} </Text>
        <Controller
  control={control}
  name="gender"
  render={({ field: { value, onChange } }) => (
    <View>
      <View style={styles.row}>
        {[
                { key: "male", label: t("male"), icon: "male" },
                { key: "female", label: t("female"), icon: "female" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.chip,
                    value === item.key && styles.chipSelected,
                  ]}
                  onPress={() => onChange(item.key)}
                >
                  <Icon name={item.icon} size={16} color="black" />
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
      </View>

      {errors.gender && (
        <Text style={styles.errorText}>
          {errors.gender.message}
        </Text>
      )}
    </View>
  )}
/>


        {/* Education */}
        <Text style={styles.label}>{t("education")} </Text>
      <Controller
  control={control}
  name="education"
  render={({ field: { value, onChange } }) => (
    <View>
      <View style={styles.wrap}>
 {educationOptions.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.chip,
                    value === item.key && styles.chipSelected,
                  ]}
                  onPress={() => onChange(item.key)}
                >
                  <Text style={styles.chipText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
                    </View>

      {errors.education && (
        <Text style={styles.errorText}>
          {errors.education.message}
        </Text>
      )}
    </View>
  )}
/>


        {/* Experience */}
        <Text style={styles.label}>{t("workExperience")}</Text>
     
<Controller
  control={control}
  name="experience"
  render={({ field: { value, onChange } }) => (
    <View>
      <View style={styles.row}>
     {["experienced", "fresher"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.chip,
                    value === item && styles.chipSelected,
                  ]}
                  onPress={() => onChange(item)}
                >
                  <Text style={styles.chipText}>{t(item)}</Text>
                </TouchableOpacity>
              ))}
                    </View>

      {errors.experience && (
        <Text style={styles.errorText}>
          {errors.experience.message}
        </Text>
      )}
    </View>
  )}
/>

        {/* Salary */}
        <Text style={styles.label}>{t("monthlySalary")}</Text>
       
        <Controller
  control={control}
  name="salary"
  render={({ field: { value, onChange } }) => (
    <View>
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
      </View>

      {errors.salary && (
        <Text style={styles.errorText}>
          {errors.salary.message}
        </Text>
      )}
    </View>
  )}
/>

      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{t("next")}</Text>
        )}
      </TouchableOpacity>
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
    paddingBottom: verticalScale(80),
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
    width: "20%",
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
    marginTop: verticalScale(6),
    fontSize: moderateScale(12),
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
    borderRadius: scale(6),
    marginTop: verticalScale(4),
    color: "black",
    fontSize: moderateScale(12),
  },

  row: {
    flexDirection: "row",
    gap: scale(8),
    marginVertical: verticalScale(6),
  },

  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
    marginVertical: verticalScale(8),
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(10),
    borderRadius: scale(18),
    borderColor: "#ccc",
  },

  chipSelected: {
    backgroundColor: "#e7f6f6",
    borderColor: "#099ca4",
  },

  chipText: {
    marginLeft: scale(5),
    fontSize: moderateScale(11),
  },

  salaryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: scale(6),
    paddingHorizontal: scale(10),
    marginTop: verticalScale(4),
  },

  salaryInputField: {
    flex: 1,
    paddingVertical: verticalScale(8),
    color: "black",
    fontSize: moderateScale(12),
  },

  suffixText: {
    color: "#555",
    fontSize: moderateScale(11),
    marginLeft: scale(4),
  },

  primaryButton: {
    position: "absolute",
    bottom: verticalScale(24),
    left: scale(20),
    right: scale(20),
    backgroundColor: AppColors.buttons,
    paddingVertical: verticalScale(12),
    borderRadius: scale(26),
    alignItems: "center",
  },

  btnText: {
    fontSize: moderateScale(13),
    fontWeight: "700",
    color: "#fff",
  },

errorText: {
  color: 'red',
  fontSize: moderateScale(10),
  marginTop: verticalScale(4),
  marginLeft: scale(4), // aligns nicely under field
  textAlign: 'left',
},

});