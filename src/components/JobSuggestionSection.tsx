import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { AppColors } from "../constants/AppColors";

interface JobCardProps {
  title: string;
  salary: string;
  company: string;
  location: string;
  badges: string[];
}

const JobCard: React.FC<JobCardProps> = ({ title, salary, company, location, badges }) => {
  const { t } = useTranslation();

  const renderBadge = (badge: string, index: number) => {
    let icon = null;
    let tagStyle = [styles.tag] as any;
    let textStyle = [styles.tagText] as any;

    const translatedBadge = t(
      badge === "New Job"
        ? "card_new_job"
        : badge === "Verified"
        ? "card_verified"
        : badge === "Urgent Hiring"
        ? "card_urgent_hiring"
        : badge
    );

    if (badge === "New Job") {
      tagStyle.push(styles.newTag);
      textStyle.push({ color: "#7e93ff" });
    }

    if (badge === "Verified") {
      icon = (
        <Ionicons
          name="checkmark-done-circle"
          size={moderateScale(11)}
          color="#007BFF"
        />
      );
      tagStyle.push(styles.verifiedTag);
      textStyle.push({ color: "#000" });
    }

    if (badge === "Urgent Hiring") {
      icon = (
        <Ionicons name="time-outline" size={moderateScale(11)} color="#dc935e" />
      );
      tagStyle.push(styles.urgentTag);
      textStyle.push({ color: "#dc935e" });
    }

    return (
      <View key={index} style={tagStyle}>
        {icon}
        <Text style={textStyle}>{translatedBadge}</Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Best Job Tag */}
      <View style={styles.bestBadge}>
        <Text style={styles.bestBadgeText}>{t("card_best_job")}</Text>
      </View>

      <Text style={styles.jobTitle}>{title}</Text>
      <Text style={styles.salary}>{salary}</Text>

      <View style={styles.locationRow}>
        <Ionicons
          name="briefcase-outline"
          size={moderateScale(12)}
          color="#777"
        />
        <Text style={styles.company}>{company}</Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={moderateScale(12)}
          color="#777"
        />
        <Text style={styles.location}>{location}</Text>
      </View>

      {/* Badge Row */}
      <View style={styles.tagContainer}>{badges.map(renderBadge)}</View>

<View style={styles.dividerWrapper}>
          <View style={styles.divider} />
</View>
    </View>
  );
};

const JobSuggestionSection = () => {
  const { t } = useTranslation();

  const jobs = [
    {
      title: t("job1_title"),
      salary: t("job1_salary"),
      company: "Rudrab—emis",
      location: t("job1_location"),
      badges: ["New Job", "Verified", "Urgent Hiring"],
    },
    {
      title: t("job2_title"),
      salary: t("job2_salary"),
      company: "Samruddhy Bmart Entertainment Pvt. Ltd",
      location: t("job2_location"),
      badges: ["Verified", "Urgent Hiring"],
    },
  ];

  return (
    <View style={styles.section}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {jobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </ScrollView>
    </View>
  );
};

export default JobSuggestionSection;

const styles = StyleSheet.create({
  section: {
    marginTop: verticalScale(0),
    paddingHorizontal: scale(12),
  },

  card: {
    width: scale(250),
    backgroundColor: "#fff",
    borderRadius: scale(12),
    shadowColor: AppColors.primary ,
    shadowOpacity: 0.5,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: verticalScale(6) },
    elevation: 15,
    paddingTop: verticalScale(2),
    borderColor: "#ddd",
    borderWidth: scale(1),
    paddingBottom: verticalScale(8),
    paddingHorizontal: scale(10),
    marginRight: scale(12),
    marginBottom: verticalScale(4),
  },

  bestBadge: {
    backgroundColor: "#fde7da",
    alignSelf: "flex-end",
    borderTopStartRadius: scale(5),
    borderBottomLeftRadius: scale(5),
    marginBottom: verticalScale(5),
    marginTop: verticalScale(6),
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(5),
    marginRight: scale(-10),
  },

  bestBadgeText: {
    fontSize: moderateScale(8),
    fontWeight: "700",
  },

  jobTitle: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#000",
    marginBottom: verticalScale(2),
  },

  salary: {
    fontSize: moderateScale(11),
    color: "#333",
    fontWeight: "500",
    marginBottom: verticalScale(6),
  },

  company: {
    fontSize: moderateScale(10),
    color: "#444",
    marginLeft: scale(3),
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },

  location: {
    fontSize: moderateScale(10),
    color: "#666",
    marginLeft: scale(3),
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(5),
  },

  // divider: {
  //   width: "100%",
  //   height: verticalScale(1),
  //   backgroundColor: "#ddd",
  //   marginTop: verticalScale(12),
  //   marginBottom: verticalScale(15),
  // },
  dividerWrapper: {
    marginHorizontal: -scale(10),
  },

  divider: {
    height: verticalScale(1),
    backgroundColor: '#ddd',
    marginVertical: verticalScale(12),
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    // borderRadius: scale(2),
    marginTop: verticalScale(10),
  },

  tagText: {
    fontSize: moderateScale(10),
    fontWeight: "600",
  },

  newTag: {
    backgroundColor: "#d9dfff",
    borderWidth: scale(1),
    borderColor: "#d9dfff",
  },

  verifiedTag: {
    backgroundColor: "#e8e8e8",
    borderWidth: scale(1),
    borderColor: "#e8e8e8",
  },

  urgentTag: {
    backgroundColor: "#ffcca7",
    borderWidth: scale(1),
    borderColor: "#ffcca7",
  },
});
