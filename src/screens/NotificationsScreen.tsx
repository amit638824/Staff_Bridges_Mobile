import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AppHeader from "../components/AppHeader";
import { AppColors } from "../constants/AppColors";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { getNotifications, NotificationJob } from '../services/notificationService';
import { getRecruiterJobDetails, RecruiterJob } from '../services/jobService';
import { getTimeAgo } from "../services/notificationService";
import { useNavigation } from "@react-navigation/native";
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';

interface NotificationItem {
  id: string;
  type: "job" | "profile" | "logoTip";
  title: string;
  salary?: string;
  company?: string;
  location?: string;
  timeAgo: string;
  createdAt?: string; 
    isNew?: boolean;
  badge?: string;
}

const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
    const [jobNotifications, setJobNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => console.log("Back pressed");
const handleViewJob = async (jobId: number) => {
  // Fetch job details from API
  const jobData = await getRecruiterJobDetails(jobId);

  if (jobData) {
    navigation.navigate('JobInfoScreen', { jobData });
  } else {
    Alert.alert('Error', 'Unable to fetch job details.');
  }
};


  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const notifJobs: NotificationJob[] = await getNotifications();
      const jobItems: NotificationItem[] = [];

      for (let notif of notifJobs) {
        const jobDetail: RecruiterJob | null = await getRecruiterJobDetails(notif.job_id);
        if (jobDetail) {
          jobItems.push({
            id: notif.n_id.toString(),
            type: "job",
            title: jobDetail.job_title_name,
salary: `₹ ${parseInt(jobDetail.salary_min || '0', 10)} – ${parseInt(jobDetail.salary_max || '0', 10)} / Month`,
            company: jobDetail.company,
            location: `${jobDetail.city_name}, ${jobDetail.locality_name}`,
            timeAgo: getTimeAgo(jobDetail.created_at),
createdAt: jobDetail.created_at ,
            isNew: true,
            badge: t('notif_badge_new_job')
          });
        }
      }

      setJobNotifications(jobItems);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  // Static profile & logoTip notifications
  const staticNotifications: NotificationItem[] = [
    {
      id: "profile1",
      type: "profile",
      title: t('notif_profile_update'),
      timeAgo: t('notif_time_10days'),
    },
    {
      id: "logo1",
      type: "logoTip",
      title: t('notif_logo_tip'),
      timeAgo: t('notif_time_10days'),
    }
  ];
const today = new Date();
today.setHours(0, 0, 0, 0); // start of today

const todayNotifications = jobNotifications.filter(job => {
  if (!job.createdAt) return false;
  const jobDate = new Date(job.createdAt);
  return jobDate >= today;
});

const oldNotifications = [
  ...jobNotifications.filter(job => {
    if (!job.createdAt) return false;
    const jobDate = new Date(job.createdAt);
    return jobDate < today;
  }),
  ...staticNotifications
];
today.setHours(0, 0, 0, 0); // start of today

   const renderLogoTipNotification = (item: NotificationItem, index: number, isOld: boolean) => (
    <View key={item.id} style={[
      styles.notificationCard,
      isOld && index === oldNotifications.length - 1 ? styles.whiteCardBg : styles.lightBlueBg
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.logoTipIcon}>
          <Image
            source={require("../../assets/images/logo-removebg-preview.png")}
            style={{ width: 30, height: 30, resizeMode: "contain" }}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.profileTitle}>{item.title}</Text>

          <View style={styles.cardFooter}>
            <View />
            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProfileNotification = (item: NotificationItem, index: number) => (
    <View key={item.id} style={[styles.notificationCard, styles.lightBlueBg]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, styles.profileIcon]}>
          <Icon name="person" size={25} color={AppColors.themeColor} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.profileTitle}>{item.title}</Text>

          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.updateButton}>
              <Icon name="add" size={14} color={AppColors.themeColor} />
              <Text style={styles.updateButtonText}>{t('notif_update_profile_button')}</Text>
            </TouchableOpacity>

            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  const renderJobNotification = (item: NotificationItem, index: number, isOld: boolean) => (
    <View key={item.id} style={[styles.notificationCard, styles.whiteCardBg]}>
      <View style={styles.cardHeader}>
       <View style={styles.iconContainer}>
  <FontAwesome name="briefcase" size={22} color="#af4900" />
</View>

        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>{item.badge}</Text>
              </View>
            )}
          </View>

          <Text style={styles.salary}>{item.salary}</Text>
          <View style={styles.detailRow}>
            <Icon name="business" size={14} color="#666" />
            <Text style={styles.detailText}>{item.company}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={14} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>

          <View style={styles.cardFooter}>
      <TouchableOpacity
  style={styles.viewJobButton}
  onPress={() => handleViewJob(Number(item.id))} // convert string -> number
>
  <Text style={styles.viewJobText}>{t('notif_view_job_button')}</Text>
</TouchableOpacity>


            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Keep renderProfileNotification & renderLogoTipNotification as in your previous code
  // ...

  return (
    <View style={styles.container}>
      <AppHeader
        showLogo={false}
        showLocation={false}
        showLanguage={false}
        showNotification={false}
        showBackArrow={true}
        onBackPressed={handleBack}
        customLeftWidget={
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t('notif_header_title')}</Text>
          </View>
        }
      />
      <View style={styles.divider} />

<ScrollView contentContainerStyle={styles.scrollContent}>
  {loading ? (
    <Text style={{ textAlign: 'center', marginTop: '90%' }}>
      {t('loading')}
    </Text>
  ) : (
    <>
      {/* TODAY NOTIFICATIONS */}
      {todayNotifications.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>{t('notif_section_today')}</Text>
          {todayNotifications.map((item, index) =>
            renderJobNotification(item, index, false)
          )}
        </>
      )}

      {/* OLD NOTIFICATIONS */}
      {oldNotifications.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>{t('notif_section_old')}</Text>
          {oldNotifications.map((item, index) => {
            if (item.type === "job") return renderJobNotification(item, index, true);
            if (item.type === "profile") return renderProfileNotification(item, index);
            return renderLogoTipNotification(item, index, true);
          })}
        </>
      )}

      {/* OPTIONAL: No notifications */}
      {todayNotifications.length === 0 && oldNotifications.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: '50%' }}>
          {t('no_notifications')}
        </Text>
      )}
    </>
  )}
</ScrollView>

    </View>
  );
};

// Keep your existing styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: scale(6), // was 8 * 0.8
    paddingBottom:scale(10),
  },

  headerTitle: {
    // fontSize: moderateScale(14.4), // 18 * 0.8
        fontSize: scale(13.5), 
    fontWeight: "600",
    color: "#000",
  },

  divider: {
    height: verticalScale(0.8), // 1 * 0.8
    backgroundColor: "#E8E8E8",
  },

  scrollContent: {
    paddingBottom: verticalScale(24), // 30 * 0.8
    backgroundColor: "#fff",
  },

  sectionHeader: {
    fontSize: moderateScale(11.2), // 14 * 0.8
    fontWeight: "600",
    color: "#999",
    marginTop: verticalScale(12.8), // 16 * 0.8
    marginBottom: verticalScale(8), // 10 * 0.8
    marginLeft: scale(12.8), // 16 * 0.8
  },

  notificationCard: {
    padding: moderateScale(12.8), // 16 * 0.8
    borderColor: "#E8E8E8",
    borderWidth: scale(0.8), // 1 * 0.8
  },

  whiteCardBg: {
    backgroundColor: "#fff",
  },

  lightBlueBg: {
    backgroundColor: "#f0ffff",
  },

  cardHeader: {
    flexDirection: "row",
  },

  iconContainer: {
    width: scale(35.2), // 44 * 0.8
    height: scale(35.2),
    borderRadius: scale(17.6), // 22 * 0.8
    borderWidth: scale(0.8), // 1 * 0.8
    borderColor: "#af4900",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(9.6), // 12 * 0.8
  },

  logoTipIcon: {
    width: scale(35.2),
    height: scale(35.2),
    borderRadius: scale(40), // 50 * 0.8
    borderColor: "#b9c2ceff",
    borderWidth: scale(0.8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(9.6),
  },

  profileIcon: {
    borderColor: AppColors.themeColor,
  },

  cardContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(3.2), // 4 * 0.8
  },

  jobTitle: {
    fontSize: moderateScale(12.8), // 16 * 0.8
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: scale(8), // 10 * 0.8
  },

  newBadge: {
    backgroundColor: "#d9dfff",
    paddingHorizontal: scale(12), // 8 * 0.8
    paddingVertical: verticalScale(4), // 2 * 0.8
    borderRadius: moderateScale(4), // 5 * 0.8
  },

  newBadgeText: {
    fontSize: moderateScale(8), // 10 * 0.8
    fontWeight: "600",
    color: "#637cff",
  },

  salary: {
    fontSize: moderateScale(11.2), // 14 * 0.8
    fontWeight: "600",
    color: "#000",
    marginBottom: verticalScale(4.8), // 6 * 0.8
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(2.4), // 3 * 0.8
  },

  detailText: {
    fontSize: moderateScale(9.6), // 12 * 0.8
    color: "#666",
    marginLeft: scale(3.2), // 4 * 0.8
  },

  cardFooter: {
    marginTop: verticalScale(8), // 10 * 0.8
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewJobButton: {
    paddingVertical: verticalScale(4.8), // 6 * 0.8
    paddingHorizontal: scale(12.8), // 16 * 0.8
    borderRadius: moderateScale(16), // 20 * 0.8
    borderWidth: scale(1.12), // 1.4 * 0.8
    borderColor: AppColors.themeColor,
  },

  viewJobText: {
    color: AppColors.themeColor,
    fontSize: moderateScale(9.6), // 12 * 0.8
    fontWeight: "600",
  },

  timeText: {
    fontSize: moderateScale(8.8), // 11 * 0.8
    color: "#999",
  },

  profileTitle: {
    fontSize: moderateScale(12), // 15 * 0.8
    fontWeight: "500",
    color: "#000",
    marginBottom: verticalScale(6.4), // 8 * 0.8
  },

  updateButton: {
    flexDirection: "row",
    borderWidth: scale(1.12), // 1.4 * 0.8
    borderColor: AppColors.themeColor,
    paddingHorizontal: scale(9.6), // 12 * 0.8
    paddingVertical: verticalScale(4), // 5 * 0.8
    borderRadius: moderateScale(16), // 20 * 0.8
    alignItems: "center",
  },

  updateButtonText: {
    color: AppColors.themeColor,
    marginLeft: scale(3.2), // 4 * 0.8
    fontWeight: "600",
    fontSize: moderateScale(9.6), // 12 * 0.8
  },
});


export default NotificationsScreen;