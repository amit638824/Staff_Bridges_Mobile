import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AppFooter from '../../components/AppFooter';
import { AppColors } from '../../constants/AppColors';
import { useTranslation } from 'react-i18next';
import { profileSchema } from '../../validation/profileSchema';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const ProfileScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(route?.params?.tabIndex ?? 3);
 const validateProfile = async () => {
  try {
    const profileData = {
      fullName: 'Sheetal Sharma',
      phone: '9876543210',
      location: 'Delhi',
      experience: '2 Years',
      skills: ['Calling'],
      salary: '20000',
      email: 'sheetal@gmail.com',
      gender: 'Female',
      education: 'Graduate'
    };

    await profileSchema.validate(profileData, { abortEarly: false });

    Alert.alert(t('validationTitle'), t('profile_validation_success'));
  } catch (err: any) {
    if (err.inner && err.inner.length > 0) {
      Alert.alert(
        t('validationTitle'),
        t(err.inner[0].message)   // show 1st error
      );
    }
  }
};
  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSettingsPress = () => {
    navigation.navigate('SettingsScreen');
  };

 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>{t('profile_header_title')}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareButton}>
             <Icon name="logo-whatsapp" size={16} color="#FF6600"/>
            <Text style={styles.shareText}>{t('profile_share_app_button')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={24} color="#000" style={{ marginLeft: 12 }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
     {renderProfileCard(t, validateProfile)}
{renderJobPreferenceCard(t, validateProfile)}

        {renderCompletionSection(t)}
        {renderUploadResume(t)}
        {renderWorkExperience(t)}
      </ScrollView>

      <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />
    </SafeAreaView>
  );
};

const renderProfileCard = (t: any, validateProfile: () => void) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 30,
          borderWidth: 4,
          borderColor: '#e491bfff',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <Image
          source={require('../../../assets/images/boss.png')}
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#ffffffd2',
            borderRadius: 27,
          }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.profileName}>{t('profile_user_name')}</Text>
        <Text style={styles.profileSub}>{t('profile_member_since')}</Text>
      </View>
     <TouchableOpacity style={styles.iconButtonBorder} onPress={validateProfile}>
  <Icon name="pencil-outline" size={18} color="#999" />
</TouchableOpacity>

    </View>

    <View style={{ marginTop: 12 }}>
      <View style={styles.infoRow}>
        <Icon name="call" size={14} color="#999" />
        <Text style={styles.infoText}>976543210</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="location" size={14} color="#999" />
        <Text style={styles.infoText}>{t('profile_location')}</Text>
      </View>
    </View>
  </View>
);

const renderJobPreferenceCard = (t: any, validateProfile: () => void) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_looking_for_jobs')}</Text>
    <TouchableOpacity style={styles.iconButtonBorder} onPress={validateProfile}>
  <Icon name="pencil-outline" size={18} color="#999" />
</TouchableOpacity>

    </View>
    <Text style={styles.chip}>{t('role_customer_support')}</Text>
  </View>
);

const renderCompletionSection = (t: any) => (
  <View style={styles.completionContainer}>
    <Text style={styles.completionTitle}>
      {t('profile_completion_title')}
    </Text>

    <View style={styles.completionRow}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressBase}>
          <View style={styles.progressFill} />
          <Text style={styles.progressLabel}>18%{"\n"}done</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { icon: 'work-outline', color: '#E91E63', title: t('profile_add_work'), subtitle: t('profile_let_know_better') },
          { icon: 'star-outline', color: '#9C27B0', title: t('profile_add_skills'), subtitle: t('profile_boost_profile') },
          { icon: 'file-upload', color: '#4CAF50', title: t('profile_have_resume'), subtitle: t('profile_upload_here') },
        ].map((item, index) => (
          <View key={index} style={styles.completionCard}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
              <Icon name={item.icon} color={item.color} size={22} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.completionTitleText}>{item.title}</Text>
              <Text style={styles.completionSubText}>{item.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
);

const renderUploadResume = (t: any) => (
  <View style={styles.uploadCard}>
    <View >
      <Image
        source={require('../../../assets/images/cv.png')}
        style={{ width: 50, height: 50 }}
      />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.uploadText}>{t('profile_upload_resume_text')}</Text>
    </View>
    <TouchableOpacity style={styles.uploadButton}>
      <Text style={styles.uploadButtonText}>{t('profile_upload_button')}</Text>
    </TouchableOpacity>
  </View>
);

const renderWorkExperience = (t: any) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_work_experience')}</Text>
      <Text style={{ color: AppColors.themeColor, fontWeight: '600' }}>{t('profile_add_new')}</Text>
    </View>

    <Text style={styles.subHeading}>{t('role_customer_support')}</Text>
    <Text style={styles.subText}>{t('profile_1_year')}</Text>
    <Text style={styles.link}>{t('profile_add_company_details')}</Text>

    <LinearGradient
      colors={['#def2ec', '#97e1ca']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.greenBox}
    >
      <Image
        source={require('../../../assets/images/active-user.png')}
        style={styles.boyImage}
      />

      <View style={{ marginLeft: 8 }}>
        <Text style={styles.greenTextUp}>{t('profile_boost_chat_title')}</Text>
        <Text style={styles.greenTextDown}>{t('profile_boost_chat_desc')}</Text>
      </View>
    </LinearGradient>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_skills')}</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor} />
      </TouchableOpacity>
    </View>
    <Text style={[styles.subText, { fontWeight: '700', color: '#000' }]}>
      {t('profile_domestic_calling')}
    </Text>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_category_details')}</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor}/>
      </TouchableOpacity>
    </View>
    <Text style={[styles.subText, { fontWeight: '700', color: '#000' }]}>{t('option_bike')}</Text>
    <Text style={styles.subText}>{t('profile_ids_documents_question')}</Text>
    <Text style={[styles.subText, { fontWeight: '500', color: '#000' }]}>{t('profile_documents_list')}</Text>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_basic_details')}</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor} />
      </TouchableOpacity>
    </View>
    <Text style={styles.subText}>{t('profile_current_salary')}</Text>
    <Text style={styles.link}>{t('profile_add')}</Text>

    <Text style={styles.subText}>{t('profile_email_id')}</Text>
    <Text style={styles.link}>{t('profile_add')}</Text>

    <Text style={styles.subText}>{t('profile_alternate_phone')}</Text>
    <Text style={styles.link}>{t('profile_add')}</Text>

    <Text style={styles.subText}>{t('profile_age_gender')}</Text>
    <View style={{flexDirection:'row',alignItems:'center'}}>
      <Text style={[styles.link,{marginEnd:10}]}>{t('profile_add')}</Text>
      <Text style={styles.subText}>{t('male')}</Text>
    </View>

    <Text style={styles.subText}>{t('profile_education_level')}</Text>
    <Text style={[styles.subText, { fontWeight: '700', color: '#000' }]}>{t('graduate')}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === 'android'
      ? verticalScale(StatusBar.currentHeight! -10)
      : verticalScale(10),
          paddingHorizontal: scale(14.4), // 18*0.8
    paddingBottom: verticalScale(8), // 10*0.8
  },

  title: {    fontSize: scale(13.5), fontWeight: '700', color: '#000' }, // 20*0.8
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  shareButton: {
    flexDirection: 'row',
    borderWidth: scale(0.8), // 1*0.8
    borderColor: '#FF6600',
    borderRadius: moderateScale(16), // 20*0.8
    paddingHorizontal: scale(8), // 10*0.8
    paddingVertical: verticalScale(3.2), // 4*0.8
    alignItems: 'center',
  },
  shareText: { color: '#FF6600', marginLeft: scale(4), fontWeight: '600' }, // 5*0.8

  scrollContainer: { padding: scale(12), paddingBottom: verticalScale(64) }, // 15*0.8, 80*0.8

  iconButtonBorder: {
    padding: scale(5), // 8*0.8
    borderWidth: scale(0.8), // 1*0.8
    borderColor: '#ccc',
    borderRadius: moderateScale(6), // 6*0.8
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(8), // 10*0.8
    padding: scale(12), // 15*0.8
   marginBottom: verticalScale(12), // 15*0.8
    borderWidth: scale(0.4), // 0.5*0.8
    borderColor: '#ddd',
    shadowColor: '#6dc4f7ff',
    shadowOpacity: 1,
    shadowRadius: moderateScale(8), // 10*0.8
    elevation: 3,
  },

  profileName: { fontSize: moderateScale(12.8), fontWeight: '700', color: '#000' }, //16*0.8
  profileSub: { fontSize: moderateScale(10.4), color: 'gray' }, //13*0.8

  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: verticalScale(4) }, //5*0.8
  infoText: { marginLeft: scale(4), fontSize: moderateScale(10.4), color: '#333' }, //5*0.8, 13*0.8

  chip: {
    marginTop: verticalScale(8), //10*0.8
    alignSelf: 'flex-start',
    borderWidth: scale(0.8), //1*0.8
    borderColor: '#ddd',
    borderRadius: moderateScale(16), //20*0.8
    paddingHorizontal: scale(9.6), //12*0.8
    paddingVertical: verticalScale(4), //5*0.8
    color: '#555',
  },

  completionContainer: { backgroundColor: '#fff0de', padding: scale(12), marginVertical: verticalScale(10), marginHorizontal: scale(-12) }, //15*0.8,15*0.8,-15*0.8
  completionTitle: { fontWeight: '600', fontSize: moderateScale(10.4), marginBottom: verticalScale(8), color: '#000' }, //13*0.8,10*0.8

  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressWrapper: {
    width: scale(48), // 60*0.8
    height: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12), // 15*0.8
  },
  progressBase: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24), //30*0.8
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: scale(3.2), //4*0.8
    borderColor: '#ffd7d9',
  },
  progressFill: {
    position: 'absolute',
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderTopColor: '#E91E63',
    borderTopWidth: scale(4), //5*0.8
    borderRightColor: 'transparent',
    borderRightWidth: scale(4),
    borderBottomColor: 'transparent',
    borderBottomWidth: scale(4),
    borderLeftColor: 'transparent',
    borderLeftWidth: scale(4),
    transform: [{ rotate: '65deg' }],
  },
  progressLabel: {
    fontSize: moderateScale(9.6), //12*0.8
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },

  completionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: scale(8), //10*0.8
    marginRight: scale(8), //10*0.8
    borderRadius: moderateScale(6.4), //8*0.8
    width: scale(160), //200*0.8
    elevation: 2,
  },
  iconBox: { width: scale(32), height: scale(32), borderRadius: moderateScale(6.4), justifyContent: 'center', alignItems: 'center' }, //40,8
  completionTitleText: { fontWeight: '600', color: '#333', fontSize: moderateScale(9.6) }, //12*0.8
  completionSubText: { color: '#777', fontSize: moderateScale(9.6) },

  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12), //15*0.8
    marginBottom: verticalScale(8), //10*0.8
  },
  uploadText: { fontWeight: '600', fontSize: moderateScale(10.4), color: '#000', marginLeft: scale(8) }, //13*0.8,10*0.8
  uploadButton: {
    borderWidth: scale(0.8), //1*0.8
    borderColor: AppColors.themeColor,
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(20), //25*0.8
    paddingVertical: verticalScale(3.2), //4*0.8
  },
  uploadButtonText: { color: AppColors.themeColor, fontWeight: '600' },

  sectionTitle: { fontSize: moderateScale(12), fontWeight: '700', color: '#000', marginTop: verticalScale(8), marginBottom: verticalScale(4) }, //15*0.8,10*0.8,5*0.8
  subHeading: { fontSize: moderateScale(11.2), fontWeight: '600', color: '#000', marginBottom: verticalScale(4) }, //14*0.8,5*0.8
  subText: { color: '#555', fontSize: moderateScale(10.4), marginBottom: verticalScale(4) }, //13*0.8,5*0.8
  link: { color: AppColors.themeColor, fontSize: moderateScale(10.4), fontWeight: '600', marginBottom: verticalScale(4) },

  greenBox: {
    flexDirection: 'row',
    padding: scale(12), //15*0.8
    borderRadius: moderateScale(8),
    marginVertical: verticalScale(8), //10*0.8
  },
  greenTextUp: { marginLeft: scale(6.4), color: '#333', fontSize: moderateScale(11.2), flex: 1, fontWeight: '800' }, //14*0.8
  greenTextDown: { marginLeft: scale(6.4), color: '#333', fontSize: moderateScale(9.6), flex: 1 }, //12*0.8

  boyImage: {
    width: scale(40), //50*0.8
    height: scale(40),
  },
});

export default ProfileScreen;

