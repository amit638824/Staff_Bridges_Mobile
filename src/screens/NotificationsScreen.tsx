import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AppHeader from "../components/AppHeader";
import { AppColors } from "../constants/AppColors";
import { useTranslation } from 'react-i18next';

interface NotificationItem {
  id: string;
  type: "job" | "profile" | "logoTip";
  title: string;
  salary?: string;
  company?: string;
  location?: string;
  timeAgo: string;
  isNew?: boolean;
  badge?: string;
}

const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  
  const handleBack = () => console.log("Back pressed");
  const handleViewJob = (id: string) => console.log("View Job:", id);

  const notifications: NotificationItem[] = [
    {
      id: "1",
      type: "job",
      title: t('notif_job_delivery'),
      salary: "₹ 8,000 – 15,500 /Month",
      company: "Rudrab—emis",
      location:  t("job1_location"),
      timeAgo: t('notif_time_2hours'),
      isNew: true,
      badge: t('notif_badge_new_job'),
    },
    {
      id: "2",
      type: "job",
      title: t('notif_job_delivery'),
      salary: "₹ 25,000 – 30,500 /Month",
      company: "Jobilito Manpower Private Limited",
      location:  t("job2_location"),
      timeAgo: t('notif_time_2hours'),
      isNew: true,
      badge: t('notif_badge_new_job'),
    },
    {
      id: "3",
      type: "job",
      title: t('notif_job_customer_support'),
      salary: "₹ 10,000 – 30,000 /Month",
      company: "Samruddhy Bmart Entertainment Pvt. Ltd",
      location:  t("job1_location"),
      timeAgo: t('notif_time_1day'),
      isNew: false,
    },
    {
      id: "4",
      type: "profile",
      title: t('notif_profile_update'),
      timeAgo: t('notif_time_10days'),
    },
    {
      id: "5",
      type: "logoTip",
      title: t('notif_logo_tip'),
      timeAgo: t('notif_time_10days'),
    },
  ];

  const todayNotifications = notifications.slice(0, 2);
  const oldNotifications = notifications.slice(2);

  const renderLogoTipNotification = (item: NotificationItem, index: number, isOld: boolean) => (
    <View key={item.id} style={[
      styles.notificationCard,
      isOld && index === oldNotifications.length - 1 ? styles.whiteCardBg : styles.lightBlueBg
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.logoTipIcon}>
          <Image
            source={require("../../assets/images/logo-removebg-preview.png")}
            style={{ width: 28, height: 28, resizeMode: "contain" }}
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

  const renderJobNotification = (item: NotificationItem, index: number, isOld: boolean) => {
    let cardBg = styles.whiteCardBg;
    
    if (!isOld) {
      if (index === 1) {
        cardBg = styles.lightBlueBg;
      }
    } else {
      if (index === 0 || index === 1) {
        cardBg = styles.lightBlueBg;
      } else {
        cardBg = styles.whiteCardBg;
      }
    }

    return (
      <View
        key={item.id}
        style={[styles.notificationCard, cardBg]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon name="work" size={20} color="#af4900" />
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
                onPress={() => handleViewJob(item.id)}
              >
                <Text style={styles.viewJobText}>{t('notif_view_job_button')}</Text>
              </TouchableOpacity>

              <Text style={styles.timeText}>{item.timeAgo}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderProfileNotification = (item: NotificationItem, index: number) => (
    <View key={item.id} style={[styles.notificationCard, styles.lightBlueBg]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, styles.profileIcon]}>
          <Icon name="person" size={20} color={AppColors.themeColor} />
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
        <Text style={styles.sectionHeader}>{t('notif_section_today')}</Text>
        {todayNotifications.map((item, index) =>
          item.type === "job"
            ? renderJobNotification(item, index, false)
            : renderProfileNotification(item, index)
        )}

        <Text style={styles.sectionHeader}>{t('notif_section_old')}</Text>
        {oldNotifications.map((item, index) =>
          item.type === "job"
            ? renderJobNotification(item, index, true)
            : item.type === "profile"
            ? renderProfileNotification(item, index)
            : renderLogoTipNotification(item, index, true)
        )}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
  },

  scrollContent: {
    paddingBottom: 30,
    backgroundColor: "#fff",
  },

  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 16,
  },

  notificationCard: {
    padding: 16,
    borderColor: "#E8E8E8",
    borderWidth: 1,
  },

  whiteCardBg: {
    backgroundColor: "#fff",
  },

  lightBlueBg: {
    backgroundColor: "#F2F8FF",
  },

  cardHeader: {
    flexDirection: "row",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#af4900",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  logoTipIcon: {
    width: 44,
    height: 44,
    borderRadius: 50,
    borderColor: "#b9c2ceff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    marginBottom: 4,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 10,
  },

  newBadge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },

  newBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4A90E2",
  },

  salary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  cardFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewJobButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.4,
    borderColor: AppColors.themeColor,
  },

  viewJobText: {
    color: AppColors.themeColor,
    fontSize: 12,
    fontWeight: "600",
  },

  timeText: {
    fontSize: 11,
    color: "#999",
  },

  profileTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },

  updateButton: {
    flexDirection: "row",
    borderWidth: 1.4,
    borderColor: AppColors.themeColor,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
  },

  updateButtonText: {
    color: AppColors.themeColor,
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 12,
  },
});

export default NotificationsScreen;