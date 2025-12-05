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
    salary: jobData.salary || '₹ 8,000 – 15,500 /Month',
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
          <Ionicons name="logo-whatsapp" size={16} color={AppColors.themeColor}/>
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
                      <Text style={styles.highlightBold}>{t('jobinfo_highlight_industry')}: </Text>
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
          <Image style={{width:70, height:70, position:'absolute', bottom:50, right:40}} source={require('../../assets/images/clapping.png')} />
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginBottom:20,
    backgroundColor: "#fff",
  },

  shareButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: AppColors.buttons,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },

  shareText: { 
    color: AppColors.buttons, 
    marginLeft: 5, 
    fontWeight: '600' 
  },

  shareTextLarge: { 
    color: '#fff', 
    marginLeft: 10, 
  },

  topSection: {
    paddingHorizontal: 16,
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  jobImage: {
    width: 60,
    height: 60,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
    marginBottom: 10,
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },

  company: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 3,
  },

  infoCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    marginLeft: 12,
    color: '#444',
    fontWeight: '500',
  },

  tagsRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginHorizontal: 20,
    gap: 10,
  },

  tagBox: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
  },

  tagText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },

  jobDesTitle:{
    fontSize: 15,
    fontWeight: '700',
    marginTop:16,
    marginBottom:8,  
    marginLeft:4,
  },

  highlightCard: {
    backgroundColor: '#EAF7FF',
    borderWidth: 1,
    borderColor: '#D2E9FF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 12,
  },

  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  highlightText: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
  },

  highlightBold: {
    fontWeight: '700',
    color: '#000',
  },

  subTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },

  skillsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 3,
    shadowColor: '#c4ecff',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },

  skillLabel: {
    fontSize: 13,
    color: '#7d7d7d',
    fontWeight: '500',
  },

  descriptionText: {
    fontSize: 14,
    color: '#444',
    marginLeft:4,
    lineHeight: 20,
  },

  readMore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#03416b',
  },

  contactCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 3,
    shadowColor: '#c4ecff',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },

  contactText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  contactAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
    marginBottom: 15,
  },

  shareCard: {
    backgroundColor: '#c4ecff',
    padding: 16, 
    marginBottom:0
  },

  smallText: {
    fontSize: 12,
    color: '#999',
    alignContent:'flex-end',
    alignItems:'flex-end',
    alignSelf:'flex-end',
    marginBottom: 20,
    marginRight:40,
  },

  shareButtonLarge: {
    flexDirection: 'row',
    backgroundColor:AppColors.buttons,
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent:'center',
    marginTop:10,
    width:200,
  },

  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderColor: '#EEE',
    borderTopWidth: 2,
    borderTopColor: '#EEE',
  },

  applyBtn: {
    borderWidth: 1,
    borderColor: AppColors.buttons,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 150,
  },

  callBtn: {
    backgroundColor: AppColors.buttons,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 150,
  },

  applyText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.buttons,
  },

  callText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});