// src/screens/PhoneLoginScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { sendOtp, loginWithOtp, setMobile, clearError } from '../redux/slices/authSlice';
import { setUserProfile } from '../redux/slices/userSlice';
import { AppColors } from '../constants/AppColors';
import { AppConstants } from '../constants/AppConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import LanguageSelectorBottomSheet from '../components/LanguageSelectorBottomSheet';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { phoneSchema, otpSchema } from '../validation/loginSchema';

type Language = {
  code: string;
  label: string;
};

const languages: Language[] = [
  { code: 'en', label: 'English (English)' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
];

const PhoneLoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const refRBSheet = useRef<any>(null);

  const { mobile, sendOtpLoading, loginLoading, error, otpSent } = useSelector(
    (state: RootState) => state.auth
  );

  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // -----------------------
  // React Hook Form setup
  // -----------------------
  
const { control, handleSubmit, watch, formState: { errors: phoneErrors } } = useForm({
  resolver: yupResolver(phoneSchema),
  defaultValues: { mobile, isChecked: true },
});

const watchMobile = watch("mobile");
const isMobileValid = watchMobile && watchMobile.length === 10;


  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  // -----------------------
  // Language change
  // -----------------------
  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    setLanguageModalVisible(false);
  };

  // -----------------------
  // Handle Send OTP
  // -----------------------
  const handleSendOtp = handleSubmit(async (formValues) => {
    dispatch(clearError());
    dispatch(setMobile(formValues.mobile));

    const result = await dispatch(sendOtp(formValues.mobile));
    if (sendOtp.fulfilled.match(result)) {
      Alert.alert(t('otpSent'), t('otpSentCheck'));
      refRBSheet.current?.open();
    } else {
      Alert.alert(t('failed'), error || t('failedSendOtp'));
    }
  });

  // -----------------------
  // Handle OTP Login
  // -----------------------
  const handleLoginWithOtp = handleOtpSubmit(async (values) => {
    dispatch(clearError());

    const result = await dispatch(loginWithOtp({ mobile, otp: values.otp }));
    if (loginWithOtp.fulfilled.match(result)) {
      refRBSheet.current?.close();

      const userData = result.payload?.data?.user;
      if (userData) dispatch(setUserProfile(userData));

      const isNewUser = !userData?.user_fullName;
      navigation.replace(isNewUser ? 'AboutYourselfScreen' : 'HomeScreen');
    } else {
      Alert.alert(t('failed'), error || t('failedLogin'));
    }
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView>
        {/* Logo + Language Selector */}
        <View style={styles.pagePadding}>
          <View style={styles.logoRow}>
            <Image
              source={require('../../assets/images/staff_bridges_logo.png')}
              style={styles.logo}
            />
            <TouchableOpacity
              style={styles.languageSelector}
              onPress={() => setLanguageModalVisible(true)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: AppConstants.spacing.xs, paddingHorizontal:AppConstants.padding.xs }}>
                  {i18n.language === 'hi' ? 'हिंदी' : 'English'}
                </Text>
                <Ionicons name="chevron-down" size={AppConstants.iconSize.sm} color={AppColors.themeColor} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <Image
          source={require('../../assets/images/job_search_banner.png')}
          style={styles.banner}
          resizeMode="cover"
        />

        {/* Phone + Terms Form */}
        <View style={styles.pagePadding}>
          <Text style={styles.phoneLabel}>{t('phoneTitle')}</Text>
          <View style={styles.phoneInputContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.countryCode}>+91</Text>
              <View
                style={styles.divider}
              />
            </View>

            {/* Phone Input */}
            <Controller
              control={control}
              name="mobile"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.phoneInput}
                  placeholder={t('enterPhone')}
                  placeholderTextColor={AppColors.placeholderColor}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={value}
                  onChangeText={(text) => onChange(text)}
                />
              )}
            />
          </View>
          {phoneErrors.mobile && <Text style={styles.errorText}>{phoneErrors.mobile.message}</Text>}

       
          {/* Send OTP Button */}
<TouchableOpacity
  style={[
    styles.sendOtpButton,
    (!isMobileValid || sendOtpLoading || otpSent) && { backgroundColor: "#ccc" }
  ]}
  onPress={handleSendOtp}
  disabled={!isMobileValid || sendOtpLoading || otpSent}
>
  {sendOtpLoading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.sendOtpText}>
      {otpSent ? t('otpSent') : t('sendOtp')}
    </Text>
  )}
</TouchableOpacity>

             {/* Terms Checkbox */}
          <Controller
            control={control}
            name="isChecked"
            render={({ field: { value, onChange } }) => (
              <View style={styles.termsRow}>
                <CheckBox
                  value={value}
                  onValueChange={onChange}
                  tintColors={{ true: AppColors.themeColor, false: '#999' }}
                />
                <Text style={styles.termsText}>{t('agreeTerms')}</Text>
              </View>
            )}
          />
          {phoneErrors.isChecked && (
            <Text style={styles.errorText}>{phoneErrors.isChecked.message}</Text>
          )}

        </View>
      </ScrollView>

      {/* Language Modal */}
      <LanguageSelectorBottomSheet
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />

      {/* OTP Bottom Sheet */}
    <RBSheet
  ref={refRBSheet}
  height={AppConstants.screenHeight * 0.30}
  openDuration={250}
  draggable
  customStyles={{
    wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
    draggableIcon: { backgroundColor: '#bbb', width: 60, height: 6, borderRadius: 3,marginBottom:AppConstants.spacing.md },
    container: {
      borderTopLeftRadius: AppConstants.borderRadius.lg,
      borderTopRightRadius: AppConstants.borderRadius.lg,
      paddingHorizontal: AppConstants.padding.xs,
      paddingTop: AppConstants.padding.xs,
      paddingBottom:AppConstants.padding.sm
    },
  }}
>
  <View>
    <Text style={styles.otpTitle}>{t('enterOtp')}</Text>

    <Text style={styles.otpSubtitle}>
      {t('otpSentMessage', { phone: mobile })}
    </Text>

    {/* OTP Input */}
    <Controller
      control={otpControl}
      name="otp"
      render={({ field: { onChange, value } }) => (
        <TextInput
          style={styles.otpInput}
          placeholder={t('enterOtpPlaceholder')}
          placeholderTextColor={AppColors.lightText}
          keyboardType="number-pad"
          maxLength={6}
          value={value}
          onChangeText={onChange}
        />
      )}
    />

    {otpErrors.otp && (
      <Text style={styles.errorText}>{otpErrors.otp.message}</Text>
    )}

    {error && (
      <Text style={styles.errorText}>{error}</Text>
    )}

    {/* Verify Button */}
    <TouchableOpacity
      style={styles.verifyOtpButton}
      onPress={handleLoginWithOtp}
      disabled={loginLoading}
    >
      {loginLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.verifyOtpText}>{t('verifyContinue')}</Text>
      )}
    </TouchableOpacity>

  </View>
</RBSheet>

    </SafeAreaView>
  );
};

export default PhoneLoginScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  
  pagePadding: { 
    padding: AppConstants.padding.md 
  },
  
  logoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: AppConstants.spacing.md 
  },
  
  logo: { 
    height: AppConstants.screenHeight * 0.08, 
    width: AppConstants.screenWidth * 0.3, 
    resizeMode: 'contain' 
  },
  
  languageSelector: { 
    paddingHorizontal: AppConstants.padding.sm, 
    paddingVertical: AppConstants.padding.xxs, 
    borderWidth: 1, 
    borderRadius: AppConstants.borderRadius.lg, 
    borderColor: AppColors.themeBorder 
  },
  
  banner: { 
    width: '100%', 
    height: AppConstants.screenHeight * 0.25, 
    marginVertical: 0 
  },
  
  phoneLabel: { 
    fontSize: AppConstants.fontSize.md, 
    fontWeight: '600', 
    marginBottom: AppConstants.spacing.md 
  },
  
 phoneInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: AppConstants.borderRadius.lg,

  // 🔽 Reduce horizontal padding
  paddingHorizontal: AppConstants.padding.md,
  paddingVertical:AppConstants.padding.xs,
},

countryCode: {
  fontSize: AppConstants.fontSize.sm,
  fontWeight: '600',
  marginRight: AppConstants.spacing.xs,
  color: AppColors.placeholderColor,
},

// Divider
divider: {
  width: 1,
  height: AppConstants.inputHeight.sm - 8, // 🔽 gives vertical spacing
  backgroundColor: '#ccc',
  marginHorizontal: AppConstants.spacing.sm, // 🔽 less margin
},

  
 phoneInput: {
  flex: 1,
  fontSize: AppConstants.fontSize.sm,
  padding: 0,        // remove all internal padding
  paddingLeft: 0,    // 🔥 specifically remove left padding
  marginLeft: 4,    // 🔥 optional: tighten even more if needed
},

  
  sendOtpButton: { 
    backgroundColor: AppColors.themeColor, 
    borderRadius: AppConstants.borderRadius.lg, 
    height: AppConstants.buttonHeight.md, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: AppConstants.spacing.md 
  },
  
  sendOtpText: { 
    color: '#fff', 
    fontSize: AppConstants.fontSize.md, 
    fontWeight: '600' 
  },
  
  termsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: AppConstants.spacing.md
  },
  
  termsText: { 
    flex: 1, 
    marginLeft: AppConstants.spacing.xs, 
    fontSize: AppConstants.fontSize.sm, 
    color: '#555' 
  },
    errorText: { 
    color: 'red', 
    fontSize: AppConstants.fontSize.sm, 
    textAlign: 'center', 
    marginBottom: AppConstants.spacing.md 
  },
  otpTitle: {
  fontSize: AppConstants.fontSize.xl,
  fontWeight: '700',
  textAlign: 'center',
  color: '#111',
  marginBottom: AppConstants.spacing.sm,
},

otpSubtitle: {
  fontSize: AppConstants.fontSize.md,
  color: '#666',
  textAlign: 'center',
  marginBottom: AppConstants.spacing.md,
  lineHeight: 20,
},

otpInput: {
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: AppConstants.borderRadius.lg,
  height: AppConstants.inputHeight.md,
  fontSize: AppConstants.fontSize.lg,
  textAlign: 'center',
  letterSpacing: 8,
  backgroundColor: '#fafafa',
  marginBottom: AppConstants.spacing.md,
},

verifyOtpButton: {
  backgroundColor: AppColors.themeColor,
  height: AppConstants.buttonHeight.md,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: AppConstants.borderRadius.lg,
marginBottom:0
  // same horizontal safe padding as language modal
  // marginTop: AppConstants.spacing.md,
},

verifyOtpText: {
  color: '#fff',
  fontSize: AppConstants.fontSize.md,
  fontWeight: '600',
},

});