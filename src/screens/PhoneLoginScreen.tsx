import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import { AppColors } from '../constants/AppColors';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import App from '../../App';
import { PLACEHOLDER_ELEMENT } from './../../node_modules/css-select/lib/esm/pseudo-selectors/subselects';

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
  const refRBSheet = useRef<any>(null);
  const [phone, setPhone] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const changeLanguage = (code: string) => {
    setSelectedLanguage(code);
    setLanguageModalVisible(false);
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }
    if (!isChecked) {
      Alert.alert('Terms Required', 'You must agree to the terms before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://app.elderlycare.life/api/api/v1/login_phone', {
        phone,
      });

      if (response.data.status === true) {
        Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
        refRBSheet.current?.open();
      } else {
        Alert.alert('Failed', response.data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP.');
      return;
    }

    setIsOtpLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsOtpLoading(false);
      refRBSheet.current?.close();
      Alert.alert('Login Successful', 'Welcome!');
      navigation.replace('AboutYourselfScreen');
    }, 1500);
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
    <Text style={{ marginRight: 6 ,paddingHorizontal:4}}>
      {selectedLanguage === 'hi' ? 'हिंदी' : 'English'}
    </Text>

    {/* Chevron Down Icon */}
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
  
        {/* Phone Input */}
        <View style={styles.phoneForm}>
          <Text style={styles.phoneLabel}>Let's start with your phone number</Text>
          <View style={styles.phoneInputContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={styles.countryCode}>+91</Text>

  {/* Vertical Divider */}
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
              placeholder="Enter mobile number to get OTP"
              placeholderTextColor={AppColors.lightText}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <TouchableOpacity
            style={styles.sendOtpButton}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendOtpText}>Send OTP</Text>
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
          <Text style={styles.termsText}>
            By clicking agree, you accept our
            {/* <Text style={styles.linkText}> Terms of Service</Text> and
            <Text style={styles.linkText}> Privacy Policy</Text>. */}
              <Text style={styles.termsText}> Terms of Service</Text> and
            <Text style={styles.termsText}> Privacy Policy</Text>.
          </Text>
        </View>

      {/* Language Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={languageModalVisible}
  onRequestClose={() => setLanguageModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      
      {/* Header Row with Title + Cross */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Choose Language</Text>
        <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
          <Ionicons name="close" size={15} color="#444444ff" />
        </TouchableOpacity>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Language List */}
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const selected = selectedLanguage === item.code;
          return (
            <TouchableOpacity
              style={[
                styles.languageCard,
                selected && styles.languageCardSelected,
              ]}
              onPress={() => changeLanguage(item.code)}
            >
              <Text style={styles.languageLabel}>{item.label}</Text>
           <View
  style={[
    styles.radioOuter,
    selected && styles.radioOuterSelected,
  ]}
>
  {selected && <View style={styles.radioInner} />}
</View>

            </TouchableOpacity>
          );
        }}
      />

      {/* Next Button styled like Send OTP */}
      <TouchableOpacity
        style={styles.sendOtpButton}
        onPress={() => setLanguageModalVisible(false)}
      >
        <Text style={styles.sendOtpText}>Next</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

  </View>
      </ScrollView>

      {/* OTP Bottom Sheet */}
      <RBSheet
        ref={refRBSheet}
        height={300}
        openDuration={250}
        draggable
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          draggableIcon: { backgroundColor: '#000' },
          container: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
        }}
      >
        <Text style={styles.otpTitle}>Enter OTP</Text>
        
        <Text style={styles.otpSubtitle}>
          We have sent an OTP to +91 {phone}
        </Text>
        <TextInput
          style={styles.otpInput}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor={AppColors.lightText}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />
        <TouchableOpacity
          style={styles.verifyOtpButton}
          onPress={handleVerifyOtp}
          disabled={isOtpLoading}
        >
          {isOtpLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyOtpText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>
      </RBSheet>
    </SafeAreaView>
  );
};

export default PhoneLoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {  },
  pagePadding: {
  padding: 16,
},

  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginBottom: 16 },
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
  countryCode: { fontSize: 16, fontWeight: '600', marginRight: 8,color:AppColors.lightText },
  phoneInput: { flex: 1, fontSize: 16 ,padding:4},
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
  linkText: { color: AppColors.themeColor, textDecorationLine: 'underline' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 16,
    maxHeight: '50%',
  },
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  languageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor:AppColors.themeColor,
    backgroundColor:AppColors.themeColorLight,
    borderRadius: 10,
    marginBottom: 20,
  },
  languageCardSelected: { backgroundColor: AppColors.themeColorLight },
  languageLabel: { fontSize: 15, fontWeight: '500' },
  selectedDot: { width: 16, height: 16, borderRadius: 16, backgroundColor: AppColors.themeColor, },
  otpTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  otpSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  otpInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 6,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  verifyOtpButton: {
    backgroundColor: AppColors.themeColor,
    borderRadius: 40,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  verifyOtpText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},

divider: {
  height: 1,
  backgroundColor: '#ccc',
  marginBottom: 30,
  width: '100%',
},
radioOuter: {
  width: 18,
  height: 18,
  borderRadius: 18,
  borderWidth: 2,
  borderColor: AppColors.themeColor,
  alignItems: 'center',
  justifyContent: 'center',
},

radioOuterSelected: {
  borderColor: AppColors.themeColor,
},

radioInner: {
  width: 10,
  height: 10,
  borderRadius: 10,
  backgroundColor: AppColors.themeColor,
},

});