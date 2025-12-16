import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppColors } from '../constants/AppColors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import App from '../../App';

const JobInfoScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);

  const jobData = route.params?.jobData || {};

  const jobDetails = {
    title: jobData.title || t('jobinfo_default_title'),
    company: jobData.company || 'RAPIDHIRE.COM',
    location: jobData.location || t('jobinfo_default_location'),
    salary: jobData.salary || '8,000 – 15,500 /Month',
    experience: jobData.experience || t('jobinfo_default_experience'),
    vacancies: jobData.vacancies || t('jobinfo_vacancies_count'),
    type: jobData.type || t('jobinfo_full_time'),
    postedAgo: jobData.postedAgo || t('jobinfo_posted_days'),
    description: '',
    highlights: [
      t('jobinfo_highlight_industry'),
      t('jobinfo_highlight_education'),
      t('jobinfo_highlight_gender'),
      t('jobinfo_highlight_working'),
      t('jobinfo_highlight_documents'),
    ],
    skillsRequired: [
      t('jobinfo_skill_computer'),
      t('jobinfo_skill_calling'),
      t('jobinfo_skill_query'),
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share" size={16} color={AppColors.themeColor}/>
          <Text style={styles.shareText}>{t('jobinfo_share_button')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View style={styles.topSection}>
          <Image
            source={require('../../assets/images/residential.png')}
            style={styles.jobImage}
          />
          <Text style={styles.jobTitle}>{jobDetails.title}</Text>
          <Text style={styles.company}>{jobDetails.company}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{jobDetails.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcon name="currency-inr" size={18} color="#666" />
            <Text style={styles.infoText}>{jobDetails.salary}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{jobDetails.experience}</Text>
          </View>
        </View>

        <View style={styles.tagsRow}>
          <View style={styles.tagBox}>
            <Text style={styles.tagText}>{jobDetails.vacancies}</Text>
          </View>
          <View style={styles.tagBox}>
            <Text style={styles.tagText}>{jobDetails.type}</Text>
          </View>
        </View>

        <View style={styles.highlightCard}>
          <Text style={styles.sectionTitle}>{t('jobinfo_highlights_title')}</Text>

          {jobDetails.highlights.map((text, index) => {
            let iconName = 'checkmark-circle';
            let iconLibrary = Ionicons;

            if (text.includes(t('jobinfo_highlight_industry'))) {
              iconName = 'business-outline';
            } else if (text.includes('working') || text.includes('Shift')) {
              iconName = 'time-outline';
            }

            return (
              <View key={index} style={styles.highlightRow}>
                {iconLibrary === Ionicons ? (
                  <Ionicons name={iconName} size={16} color={AppColors.themeColor} />
                ) : (
                  <MaterialCommunityIcon name={iconName} size={16} color={AppColors.themeColor} />
                )}
                <Text style={styles.highlightText}>
                  {text.includes(t('jobinfo_highlight_industry')) ? (
                    <>
                      <Text style={styles.highlightBold}>{t('jobinfo_highlight_industry')} </Text>
                      BPO
                    </>
                  ) : (
                    text
                  )}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.subTitle}>{t('jobinfo_skills_title')}</Text>

          <View style={styles.skillsWrap}>
            {jobDetails.skillsRequired.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillLabel}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.jobDesTitle}>{t('jobinfo_description_title')}</Text>

          <Text style={styles.descriptionText}>
            {jobDetails.description ||
              t('jobinfo_description_default')}
          </Text>

          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent:'center', marginTop:6, alignSelf:'flex-end'}}>
              <Text style={styles.readMore}>{t('jobinfo_read_more')}</Text>
              <Ionicons name="chevron-down" size={16} color="#03416b" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactText}>{t('jobinfo_contact_person_title')}</Text>
          <Text style={styles.contactAddress}>Priya Singh Thakur</Text>

          <Text style={styles.contactText}>{t('jobinfo_interview_address_title')}</Text>
          <Text style={styles.contactAddress}>Gomti Nagar, Lucknow</Text>
        </View>

        <Text style={styles.smallText}>{t('jobinfo_posted_days')}</Text>

        <View style={styles.shareCard}>
          <Text style={styles.subTitle}>{t('jobinfo_refer_friend_title')}</Text>
          <TouchableOpacity style={styles.shareButtonLarge}>
            <Ionicons name="logo-whatsapp" size={16} color="#fff" />
            <Text style={styles.shareTextLarge}>{t('jobinfo_refer_button')}</Text>
          </TouchableOpacity>
          <Image style={{width:70, height:70, position:'absolute', bottom:40, right:40}} source={require('../../assets/images/clapping.png')} />
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyText}>{t('jobinfo_apply_button')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.callText}>{t('jobinfo_call_hr_button')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobInfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : verticalScale(8), // 10*0.8
    marginTop:20,
    paddingHorizontal: scale(12.8), //16*0.8
    // paddingBottom: verticalScale(8), //10*0.8
    marginBottom: verticalScale(16), //20*0.8
    backgroundColor: "#fff",
  },

  shareButton: {
    flexDirection: 'row',
    borderWidth: scale(0.8), //1*0.8
    borderColor: AppColors.buttons,
    borderRadius: moderateScale(16), //20*0.8
    paddingHorizontal: scale(8), //10*0.8
    paddingVertical: verticalScale(3.2), //4*0.8
    alignItems: 'center',
  },

  shareText: { 
    color: AppColors.buttons, 
    marginLeft: scale(4), //5*0.8
    fontWeight: '600' 
  },

  shareTextLarge: { 
    color: '#fff', 
    marginLeft: scale(8), //10*0.8
  },

  topSection: {
    paddingHorizontal: scale(12.8), //16*0.8
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: verticalScale(8), //10*0.8
  },

  jobImage: {
    width: scale(48), //60*0.8
    height: scale(48),
    alignSelf: 'flex-start',
    resizeMode: 'contain',
    marginBottom: verticalScale(8), //10*0.8
  },

  jobTitle: {
    fontSize: moderateScale(14.4), //18*0.8
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },

  company: {
    fontSize: moderateScale(9.6), //12*0.8
    color: '#666',
    textAlign: 'center',
    marginTop: verticalScale(2.4), //3*0.8
  },

  infoCard: {
    backgroundColor: '#fff',
    marginTop: verticalScale(12.8), //16*0.8
    marginHorizontal: scale(16), //20*0.8
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(9.6), //12*0.8
  },

  infoText: {
    fontSize: moderateScale(11.2), //14*0.8
    marginLeft: scale(9.6), //12*0.8
    color: '#444',
    fontWeight: '500',
  },

  tagsRow: {
    flexDirection: 'row',
    marginTop: verticalScale(6.4), //8*0.8
    marginHorizontal: scale(16), //20*0.8
    gap: scale(8), //10*0.8
  },

  tagBox: {
    paddingHorizontal: scale(11.2), //14*0.8
    paddingVertical: verticalScale(4.8), //6*0.8
    borderRadius: moderateScale(1.6), //2*0.8
    backgroundColor: '#fff',
    borderWidth: scale(0.8), //1*0.8
    borderColor: '#DDD',
  },

  tagText: {
    fontSize: moderateScale(9.6), //12*0.8
    color: '#555',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: moderateScale(12), //15*0.8
    fontWeight: '700',
    color: '#000',
    marginBottom: verticalScale(6.4), //8*0.8
  },

  jobDesTitle:{
    fontSize: moderateScale(12), //15*0.8
    fontWeight: '700',
    marginTop: verticalScale(12.8), //16*0.8
    marginBottom: verticalScale(6.4), //8*0.8
    marginLeft: scale(3.2), //4*0.8
  },

  highlightCard: {
    backgroundColor: '#EAF7FF',
    borderWidth: scale(0.8), //1*0.8
    borderColor: '#D2E9FF',
    padding: scale(12.8), //16*0.8
    borderRadius: moderateScale(9.6), //12*0.8
    marginHorizontal: scale(16), //20*0.8
    marginTop: verticalScale(9.6), //12*0.8
  },

  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8), //10*0.8
  },

  highlightText: {
    flex: 1,
    marginLeft: scale(8), //10*0.8
    color: '#000',
    fontSize: moderateScale(11.2), //14*0.8
    lineHeight: verticalScale(10), //20*0.8
  },

  highlightBold: {
    fontWeight: '700',
    color: '#000',
  },

  subTitle: {
    fontSize: moderateScale(12), //15*0.8
    fontWeight: '700',
    color: '#000',
    marginBottom: verticalScale(8), //10*0.8
  },

  skillsContainer: {
    backgroundColor: '#fff',
    padding: scale(12.8), //16*0.8
    marginHorizontal: scale(16),
    marginTop: verticalScale(12.8),
    borderRadius: moderateScale(9.6),
    borderWidth: scale(0.8),
    borderColor: '#E5E5E5',
    elevation: 3,
    shadowColor: '#c4ecff',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3.2), //4*0.8
  },

  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8), //10*0.8
  },

  skillChip: {
    paddingHorizontal: scale(11.2), //14*0.8
    paddingVertical: verticalScale(6.4), //8*0.8
    backgroundColor: '#fff',
    borderRadius: moderateScale(16), //20*0.8
    borderWidth: scale(0.8), //1*0.8
    borderColor: '#D9D9D9',
  },

  skillLabel: {
    fontSize: moderateScale(10.4), //13*0.8
    color: '#7d7d7d',
    fontWeight: '500',
  },

  descriptionText: {
    fontSize: moderateScale(11.2), //14*0.8
    color: '#444',
    marginLeft: scale(3.2),
    lineHeight: verticalScale(16), //20*0.8
  },

  readMore: {
    fontSize: moderateScale(11.2), //14*0.8
    fontWeight: '800',
    color: '#03416b',
  },

  contactCard: {
    backgroundColor: '#fff',
    padding: scale(12.8),
    marginHorizontal: scale(16),
    marginTop: verticalScale(12.8),
    borderRadius: moderateScale(9.6),
    borderWidth: scale(0.8),
    borderColor: '#E5E5E5',
    elevation: 3,
    shadowColor: '#c4ecff',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3.2),
    marginBottom: verticalScale(12), //15*0.8
  },

  contactText: {
    fontSize: moderateScale(12), //15*0.8
    fontWeight: '600',
    color: '#000',
  },

  contactAddress: {
    fontSize: moderateScale(11.2), //14*0.8
    color: '#666',
    marginTop: verticalScale(2.4), //3*0.8
    marginBottom: verticalScale(6), //15*0.8
  },

  shareCard: {
    backgroundColor: '#c4ecff',
    padding: scale(12.8),
    marginBottom: 0,
  },

  smallText: {
    fontSize: moderateScale(9.6), //12*0.8
    color: '#999',
    alignContent:'flex-end',
    alignItems:'flex-end',
    alignSelf:'flex-end',
    marginBottom: verticalScale(10), //20*0.8
    marginRight: scale(32), //40*0.8
  },

  shareButtonLarge: {
    flexDirection: 'row',
    backgroundColor:AppColors.buttons,
    borderRadius: moderateScale(20), //25*0.8
    paddingHorizontal: scale(10), //14*0.8
    paddingVertical: verticalScale(6), //10*0.8
    alignItems: 'center',
    justifyContent:'center',
    marginBottom:15,
    marginTop: verticalScale(8), //10*0.8
    width: scale(150), //200*0.8
  },

  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    // marginTop:10,
    width: '100%',
    padding: scale(16), //20*0.8
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: scale(8), //10*0.8
    borderTopWidth: scale(1.6), //2*0.8
    borderTopColor: '#EEE',
  },

  applyBtn: {
    borderWidth: scale(0.8), //1*0.8
    borderColor: AppColors.buttons,
    borderRadius: moderateScale(20), //25*0.8
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(6), //12*0.8
    paddingHorizontal: scale(14.4), //18*0.8
    minWidth: scale(120), //150*0.8
    marginBottom:verticalScale(10)
  },

  callBtn: {
    backgroundColor: AppColors.buttons,
    borderRadius: moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(4.8), //6*0.8
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(14.4),
    minWidth: scale(120),
        marginBottom:verticalScale(10)
  },

  applyText: {
    fontSize: moderateScale(11.2), //14*0.8
    fontWeight: '600',
    color: AppColors.buttons,
  },

  callText: {
    fontSize: moderateScale(11.2), //14*0.8
    fontWeight: '600',
    color: '#fff',
  },
});
