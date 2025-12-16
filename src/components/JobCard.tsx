import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

interface JobCardProps {
  title: string;
  salary: string;
  company: string;
  location: string;
  badges: string[];
}

const JobCard: React.FC<JobCardProps> = ({ title, salary, company, location, badges }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>

      {/* Job Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Salary */}
      <Text style={styles.salary}>
        {t("jobCard.salary")}: {salary}
      </Text>

      {/* Company Row */}
      <View style={styles.locationRow}>
        <Ionicons name="briefcase-outline" size={moderateScale(12)} color="#777" />
        <Text style={styles.company}>{company}</Text>
      </View>

      {/* Location Row */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={moderateScale(12)} color="#777" />
        <Text style={styles.location}>{location}</Text>
      </View>

      {/* Badges */}
      <View style={styles.badgesContainer}>
        {badges.map((badge, index) => (
          <Text key={index} style={styles.badge}>
            {badge}
          </Text>
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: scale(12),
    borderRadius: scale(8),
    marginBottom: verticalScale(12),
    borderWidth: scale(1),
    borderColor: "#ddd",
  },

  title: {
    fontWeight: "bold",
    fontSize: moderateScale(14),
    color: "#000",
  },

  salary: {
    marginTop: verticalScale(1),
    marginBottom: verticalScale(8),
    fontSize: moderateScale(12),
    color: "#444",
  },

  company: {
    marginTop: verticalScale(1),
    marginLeft: scale(3),
    fontSize: moderateScale(12),
    color: "#444",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },

  location: {
    marginLeft: scale(3),
    fontSize: moderateScale(12),
    color: "#444",
  },

  badgesContainer: {
    flexDirection: "row",
    marginTop: verticalScale(8),
    flexWrap: "wrap",
  },

  badge: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(10),
    fontSize: moderateScale(10),
    marginRight: scale(5),
    marginBottom: verticalScale(5),
  },
});

export default JobCard;
