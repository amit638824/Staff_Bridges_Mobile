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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import LanguageSelectorBottomSheet from '../components/LanguageSelectorBottomSheet';

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

  // ✅ Redux selectors
  const { mobile, sendOtpLoading, loginLoading, error, otpSent, token, newUserFlag } = useSelector(
    (state: RootState) => state.auth
  );

  // Local state
  const [isChecked, setIsChecked] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [otp, setOtp] = useState('');

  const changeLanguage = async (code: string) => {
    setSelectedLanguage(code);
    await i18n.changeLanguage(code);
    setLanguageModalVisible(false);
  };

  // Step 1: Handle Send OTP
  const handleSendOtp = async () => {
    // Clear previous errors
    dispatch(clearError());

    // Validation
    if (!mobile || mobile.length !== 10) {
      Alert.alert(t('invalidPhone'), t('invalidPhoneMessage'));
      return;
    }

    if (!isChecked) {
      Alert.alert(t('termsRequired'), t('termsRequiredMessage'));
      return;
    }

    // Send OTP
    const result = await dispatch(sendOtp(mobile));

    if (sendOtp.fulfilled.match(result)) {
      Alert.alert(t('otpSent'), t('otpSentCheck'));
      // Open OTP modal
      refRBSheet.current?.open();
    } else {
      Alert.alert(t('failed'), error || t('failedSendOtp'));
    }
  };

  // Step 2: Handle Login/Register with OTP
  const handleLoginWithOtp = async () => {
    dispatch(clearError());

    // Validation
    if (!otp || otp.length < 4) {
      Alert.alert(t('invalidOtp'), t('invalidOtpMessage'));
      return;
    }

    // Login with OTP (auto-registers if new user)
    const result = await dispatch(loginWithOtp({ mobile, otp }));

    if (loginWithOtp.fulfilled.match(result)) {
      setOtp('');
      refRBSheet.current?.close();
      
      Alert.alert(t('loginSuccessful'), t('welcome'));

      // ✅ Extract user data from response
      const userData = result.payload?.data?.user;

      console.log('🔍 Login successful, userData:', userData);

      // ✅ Save user profile to Redux (userSlice)
    if (userData) {
        console.log('📝 Dispatching setUserProfile with:', userData);
        dispatch(setUserProfile(userData));
      }

      // ✅ Check if user_fullName is null/empty - if so, they are a new user
      const isNewUser = !userData?.user_fullName || userData.user_fullName === null || userData.user_fullName === '';
      
      console.log('📝 user_fullName:', userData?.user_fullName);
      console.log('📝 isNewUser:', isNewUser);

      if (isNewUser) {
        console.log('👤 New user detected (no user_fullName), navigating to AboutYourselfScreen');
        navigation.replace('AboutYourselfScreen');
      } else {
        console.log('👤 Existing user detected (has user_fullName), navigating to HomeScreen');
        navigation.replace('HomeScreen');
      }
    } else {
      Alert.alert(t('failed'), error || t('failedLogin'));
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView contentContainerStyle={{}}>
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
                <Text style={{ marginRight: 6, paddingHorizontal: 4 }}>
                  {i18n.language === 'hi' ? 'हिंदी' : 'English'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={AppColors.themeColor} />
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

        <View style={styles.pagePadding}>
          {/* Phone Input Form */}
          <View style={styles.phoneForm}>
            <Text style={styles.phoneLabel}>{t('phoneTitle')}</Text>
            <View style={styles.phoneInputContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.countryCode}>+91</Text>
                <View
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: '#ccc',
                    marginHorizontal: 8,
                  }}
                />
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder={t('enterPhone')}
                placeholderTextColor={AppColors.lightText}
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(text) => dispatch(setMobile(text))}
                editable={!otpSent}
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[
                styles.sendOtpButton,
                otpSent && { backgroundColor: '#ccc' },
              ]}
              onPress={handleSendOtp}
              disabled={sendOtpLoading || otpSent}
            >
              {sendOtpLoading ? (
                <ActivityIndicator color="#fff" />
              ) : otpSent ? (
                <Text style={styles.sendOtpText}>{t('otpSent')}</Text>
              ) : (
                <Text style={styles.sendOtpText}>{t('sendOtp')}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsRow}>
            <CheckBox
              value={isChecked}
              onValueChange={setIsChecked}
              tintColors={{ true: AppColors.themeColor, false: '#999' }}
            />
            <Text style={styles.termsText}>{t('agreeTerms')}</Text>
          </View>

          {/* Language Modal */}
          <LanguageSelectorBottomSheet
            visible={languageModalVisible}
            onClose={() => setLanguageModalVisible(false)}
          />
        </View>
      </ScrollView>

      {/* OTP Verification Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        height={320}
        openDuration={250}
        draggable
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          draggableIcon: { backgroundColor: '#000' },
          container: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
        }}
      >
        <View style={styles.otpBottomSheet}>
          <Text style={styles.otpTitle}>{t('enterOtp')}</Text>
          <Text style={styles.otpSubtitle}>
            {t('otpSentMessage', { phone: mobile })}
          </Text>

          {/* OTP Input */}
          <TextInput
            style={styles.otpInput}
            placeholder={t('enterOtpPlaceholder')}
            placeholderTextColor={AppColors.lightText}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

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
  container: { flex: 1, backgroundColor: '#fff' },
  pagePadding: {
    padding: 16,
  },
  logoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  logo: { height: 60, width: 120, resizeMode: 'contain' },
  languageSelector: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: AppColors.themeBorder,
  },
  banner: { width: '100%', height: 220, marginVertical: 0 },
  phoneForm: { marginVertical: 16 },
  phoneLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  countryCode: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginRight: 8, 
    color: AppColors.lightText 
  },
  phoneInput: { flex: 1, fontSize: 16, padding: 4 },
  sendOtpButton: {
    backgroundColor: AppColors.themeColor,
    borderRadius: 40,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  sendOtpText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  termsText: { flex: 1, marginLeft: 8, fontSize: 13, color: '#555' },
  otpBottomSheet: {
    padding: 20,
  },
  otpTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  otpSubtitle: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 6,
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  verifyOtpButton: {
    backgroundColor: AppColors.themeColor,
    borderRadius: 40,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  verifyOtpText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resendContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendText: {
    color: AppColors.themeColor,
    fontSize: 14,
    fontWeight: '500',
  },
});