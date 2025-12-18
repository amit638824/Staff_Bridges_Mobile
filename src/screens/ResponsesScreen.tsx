import React, { useState,useEffect } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppFooter from '../components/AppFooter';
import { AppColors } from '../constants/AppColors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getAppliedJobsByUser, AppliedJob } from '../services/appliedJobService';
import { getRecruiterJobDetails, RecruiterJob } from '../services/jobService';

const ResponsesScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
const userId = useSelector((state: any) => state.auth.userId);
const [jobDetails, setJobDetails] = useState<{ [key: number]: RecruiterJob }>({});

  const [activeTab, setActiveTab] = useState('applications');
  const [currentIndex, setCurrentIndex] = useState(2);
const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!userId) return;

  const fetchAppliedJobsWithDetails = async () => {
    setLoading(true);
    const jobs = await getAppliedJobsByUser(userId);

    const details: { [key: number]: RecruiterJob } = {};

    await Promise.all(
      jobs.map(async (job) => {
        const jobDetail = await getRecruiterJobDetails(job.job_id);
        if (jobDetail) details[job.job_id] = jobDetail;
      })
    );

    setAppliedJobs(jobs);
    setJobDetails(details);
    setLoading(false);
  };

  fetchAppliedJobsWithDetails();
}, [userId]);

useEffect(() => {
  if (!userId) return;

  const fetchAppliedJobs = async () => {
    setLoading(true);
    const jobs = await getAppliedJobsByUser(userId);
    setAppliedJobs(jobs);
    setLoading(false);
  };

  fetchAppliedJobs();
}, [userId]);

  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

//  const applicationData = {
//   title: t('resp_job_title'),
//   salary: '₹ 16,000 - 25,000 / Month',
//   company: 'Rudrao-emisis',
//   location: 'Hazratganj, Lucknow (within 7 KM)',
//   badge: t('resp_urgent_hiring'),
//   timeAgo: t('resp_time_ago_17h'),   // 👈 added translation
//   status: t('resp_status_sent'),
//   statusSubtext: t('resp_status_subtext'),
// };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE5E5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('resp_header_title')}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'applications' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('applications')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'applications' && styles.activeTabText,
            ]}
          >
{`${t('resp_applications_tab')} (${appliedJobs.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
     {loading ? null : appliedJobs.length === 0 ? (
  <View style={{ alignItems: 'center', marginTop: 40 }}>
    <Ionicons name="briefcase-outline" size={48} color="#ccc" />
    <Text style={{ marginTop: 10, color: '#777', fontSize: 13 }}>
      {t('resp_no_jobs_applied') || 'No jobs applied yet'}
    </Text>
  </View>
) : (
  appliedJobs.map((job, index) => {
    const appliedDate = new Date(job.aj_createdAt);
   const hoursAgo = Math.max(
  0,
  Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60))
);

    return (
      <View key={index} style={styles.applicationCard}>
        {/* BADGES */}
        <View style={styles.badgeRow}>
          <LinearGradient
            colors={['#ffe1cf', '#f9f4f1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bestJobGradient}
          >
            <Ionicons name="star" size={12} color="#e59600" />
            <Text style={styles.bestJobText}>
              {t('resp_best_job_badge')}
            </Text>
          </LinearGradient>
        </View>

        {/* JOB INFO */}
 <View style={styles.jobRow}>
  <Image
    source={{ uri: jobDetails[job.job_id]?.companylogo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Bh36VUEJ2DeC0vl6oKkElCXqN-anYYCROg&s' }}
    style={styles.jobIcon}
  />

  <View style={{ flex: 1 }}>
    <Text style={styles.jobTitle}>
      {jobDetails[job.job_id]?.job_title_name || t('resp_job_title')}
    </Text>

    <Text style={styles.salaryText}>
₹{parseInt(jobDetails[job.job_id]?.salary_min || '0', 10)} - {parseInt(jobDetails[job.job_id]?.salary_max || '0', 10)} / Month
    </Text>

  </View>
</View>


          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={13} color="#888" />
            <Text style={styles.infoText}>{jobDetails[job.job_id]?.company}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={13} color="#888" />
            <Text style={styles.infoText}> {jobDetails[job.job_id]?.work_location}, {jobDetails[job.job_id]?.city_name}
</Text>
          </View>

        {/* LOCATION */}
        {/* <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={13} color="#888" />
          <Text style={styles.infoText}>
            {job.job_jobType} · {job.job_workLocation}
          </Text>
        </View> */}

        {/* STATUS */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIconBg}>
            <Ionicons name="bulb" size={14} color="#d7e7f5ff" />
          </View>

          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>
              {t('resp_status_sent')} · {hoursAgo}h ago
            </Text>
            <Text style={styles.statusSubtext}>
              {t('resp_status_subtext')}
            </Text>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.similarJobsButton}>
            <Text style={styles.similarJobsText}>
              {t('resp_similar_jobs_button')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.callHRButton}>
            <Ionicons name="call" size={14} color="#fff" />
            <Text style={styles.callHRText}>
              {t('resp_call_hr_button')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  })
)}


        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpTitle}>{t('resp_help_card_title')}</Text>
          <Ionicons name="chevron-forward" size={18} color={AppColors.themeColor} />
        </TouchableOpacity>

        <LinearGradient
          colors={['#d7dff1', '#9ab1e2']}
          start={{ x: 0, y:0}}
          end={{ x: 0, y: 1 }}
          style={styles.experienceCard}
        >
          <View style={styles.experienceContent}>
            <Text style={styles.experienceTitle}>
              {t('resp_experience_title')}
            </Text>
            <TouchableOpacity style={styles.addExperienceButton}>
              <Text style={styles.addExperienceText}>
                {t('resp_experience_button')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.experienceImageContainer}>
            <Image
              style={styles.experienceImage}
              source={require('../../assets/images/job-brief.png')}
            />
          </View>
        </LinearGradient>
      </ScrollView>

      <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    paddingTop: Platform.OS === 'android'
      ? verticalScale(StatusBar.currentHeight! -10)
      : verticalScale(10),
  },

  headerTitle: {
    // fontSize: moderateScale(14),

        fontSize: scale(13.5), 
    fontWeight: '700',
    color: '#000',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f6ff',
    paddingHorizontal: scale(14),
    borderBottomWidth: scale(1),
    borderColor: '#eeeff1ff',
    paddingVertical: verticalScale(6),
  },

  tab: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(16),
    backgroundColor: '#f5f5f5',
    borderWidth: scale(1),
    borderColor: '#e0e0e0',
  },

  activeTab: {
    backgroundColor: '#fff6ec',
    borderColor: '#ebae3b',
  },

  tabText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#999',
  },

  activeTabText: {
    color: '#ebae3b',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: scale(14),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(80),
  },

  applicationCard: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    padding: verticalScale(10),
    marginBottom: verticalScale(5),
    borderWidth: scale(1),
    borderColor: '#d6d3d3ff',
    shadowColor: 'teal',
    shadowOpacity: 0.05,
    shadowRadius: scale(4),
    shadowOffset: { width: 0, height: verticalScale(2) },
    elevation: 10,
  },

  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(6),
    alignItems: 'center',
  },

  bestJobGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderTopLeftRadius: moderateScale(20),
    borderBottomLeftRadius: moderateScale(20),
    gap: scale(4),
  },

  bestJobText: {
    fontSize: moderateScale(8),
    fontWeight: '700',
  },

  jobRow: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'flex-start',
    marginTop: verticalScale(4),
    marginBottom:verticalScale(4),
  },

  jobIcon: {
    width: scale(34),
    height: scale(34),
    borderColor: '#e0e0e0',
    borderWidth: scale(1),
    borderRadius: scale(4),
    padding: scale(4),
    resizeMode: 'contain',
    marginTop: verticalScale(1),
  },

  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe8d7',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(3),
    borderBottomLeftRadius: moderateScale(10),
    borderTopLeftRadius: moderateScale(10),
    gap: scale(3),
    marginRight: scale(-12),
  },

  urgentText: {
    fontSize: moderateScale(9),
    fontWeight: '600',
    color: '#d78b53',
  },

  jobTitle: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#000',
    marginBottom: verticalScale(6),
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
    gap: scale(4),
  },

  salaryText: {
    fontSize: moderateScale(10),
    color: '#333',
    fontWeight: '500',
  },

  infoText: {
    fontSize: moderateScale(10),
    color: '#777',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
    backgroundColor: '#E3F2FD',
    borderRadius: moderateScale(30),
    gap: scale(8),
  },

  statusIconBg: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    backgroundColor: '#2e98fcff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusTextContainer: {
    flex: 1,
  },

  statusTitle: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },

  statusSubtext: {
    fontSize: moderateScale(9),
    color: '#666',
    lineHeight: moderateScale(13),
  },

  buttonRow: {
    flexDirection: 'row',
    gap: scale(6),
    marginTop: verticalScale(12),
    marginLeft: scale(110),
    marginRight: scale(10),
  },

  similarJobsButton: {
    flex: 1,
    borderColor: AppColors.themeColor,
    borderWidth: scale(1),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  similarJobsText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: AppColors.themeColor,
  },

  callHRButton: {
    flex: 1,
    backgroundColor: AppColors.buttons,
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(4),
  },

  callHRText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#fff',
  },

  helpCard: {
    backgroundColor: '#FFEBE9',
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius:moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },

  helpTitle: {
    fontSize: moderateScale(11),
    fontWeight: '600',
  },

  experienceCard: {
    borderRadius: moderateScale(10),
    padding: verticalScale(12),
    marginBottom: verticalScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    shadowOffset: { width: 0, height: verticalScale(1) },
    elevation: 2,
  },

  experienceContent: {
    flex: 1,
    paddingRight: scale(8),
  },

  experienceTitle: {
    fontSize: moderateScale(13),
    fontWeight: '800',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(16),
  },

  addExperienceButton: {
   backgroundColor: AppColors.buttons,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    alignSelf: 'flex-start',    
  },

  addExperienceText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#fff',
  },

    experienceImageContainer: {
    position: 'relative',
  },


  experienceImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(6),
  },
 
});

export default ResponsesScreen;