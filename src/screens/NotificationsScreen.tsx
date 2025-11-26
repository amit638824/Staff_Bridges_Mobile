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
  const handleBack = () => console.log("Back pressed");
  const handleViewJob = (id: string) => console.log("View Job:", id);

  /** ORDER EXACTLY LIKE THE REFERENCE IMAGE */
  const notifications: NotificationItem[] = [
    {
      id: "1",
      type: "job",
      title: "Delivery",
      salary: "₹ 8,000 – 15,500 /Month",
      company: "Rudrab—emis",
      location: "Hazratganj, Lucknow (within 7 KM)",
      timeAgo: "2 hours ago",
      isNew: true,
      badge: "New Job",
    },
    {
      id: "2",
      type: "job",
      title: "Delivery",
      salary: "₹ 25,000 – 30,500 /Month",
      company: "Jobilito Manpower Private Limited",
      location: "Indira Nagar, Lucknow (within 7 KM)",
      timeAgo: "2 hours ago",
      isNew: true,
      badge: "New Job",
    },
    {
      id: "3",
      type: "job",
      title: "Customer Support / Telecaller",
      salary: "₹ 10,000 – 30,000 /Month",
      company: "Samruddhy Bmart Entertainment Pvt. Ltd",
      location: "Aliganj, Lucknow (within 7 KM)",
      timeAgo: "a day ago",
      isNew: false,
    },
    {
      id: "4",
      type: "profile",
      title: "Update your profile through chat to unlock your dream job faster!",
      timeAgo: "10+ days ago",
    },
    {
      id: "5",
      type: "logoTip",
      title: "Check this section daily for new updates to find a job faster",
      timeAgo: "10+ days ago",
    },
  ];

  const todayNotifications = notifications.slice(0, 2);
  const oldNotifications = notifications.slice(2);

  // -------------------------------------
  // LOGO TIP CARD
  // -------------------------------------
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

  // -------------------------------------
  // JOB CARD
  // -------------------------------------
  const renderJobNotification = (item: NotificationItem, index: number, isOld: boolean) => {
    let cardBg = styles.whiteCardBg;
    
    if (!isOld) {
      // Today section: first white, second light blue
      if (index === 1) {
        cardBg = styles.lightBlueBg;
      }
    } else {
      // Old section: first and second light blue
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
                <Text style={styles.viewJobText}>View Job</Text>
              </TouchableOpacity>

              <Text style={styles.timeText}>{item.timeAgo}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // -------------------------------------
  // PROFILE UPDATE CARD
  // -------------------------------------
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
              <Text style={styles.updateButtonText}>Update profile now</Text>
            </TouchableOpacity>

            <Text style={styles.timeText}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // -------------------------------------
  // RENDER
  // -------------------------------------
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
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
        }
      />

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Today</Text>
        {todayNotifications.map((item, index) =>
          item.type === "job"
            ? renderJobNotification(item, index, false)
            : renderProfileNotification(item, index)
        )}

        <Text style={styles.sectionHeader}>Old</Text>
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