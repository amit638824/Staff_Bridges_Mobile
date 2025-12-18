import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AppColors } from "../constants/AppColors";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { useTranslation } from "react-i18next";
interface ViewedJobsSectionProps {
  jobs: any[];
  onViewSimilar?: () => void;
}

const ViewedJobsSection: React.FC<ViewedJobsSectionProps> = ({
  jobs,
  onViewSimilar,
}) => {
  const { t } = useTranslation();

  if (!jobs || jobs.length === 0) return null;

  const job = jobs[0]; // show latest / top job

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>
        {t("section_viewed_jobs")}
      </Text>

      <View style={styles.card}>
        <View style={styles.bestBadge}>
          <Text style={styles.bestBadgeText}>
            {t("card_best_job")}
          </Text>
        </View>

        <Text style={styles.jobTitle}>{job.job_title_name}</Text>

        <Text style={styles.salary}>
          ₹{job.salary_min} - {job.salary_max} / Month
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="briefcase-outline" size={14} color="#777" />
          <Text style={styles.company}>{job.company}</Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.location}>
            {job.locality_name}, {job.city_name}
          </Text>
        </View>

        <View style={styles.divider} />
      </View>

      <LinearGradient
        colors={["#d5f5f8", "#7cdce2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fullGradient}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={onViewSimilar}
        >
          <Text style={styles.buttonText}>
            {t("btn_view_similar_jobs")}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ViewedJobsSection;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: verticalScale(16), // 20*0.8
  },

  headerLineContainer: {
    alignItems: "center",
    marginTop: verticalScale(12), // 15*0.8
    marginBottom: verticalScale(8), //10*0.8
  },

  headerLine: {
    width: scale(32), //40*0.8
    height: verticalScale(3.2), //4*0.8
    backgroundColor: "#00b5b5",
    borderRadius: moderateScale(8), //10*0.8
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: moderateScale(11.2), //14*0.8
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(12), //15*0.8
  },

  badgeLabel: {
    backgroundColor: "#FFE8D6",
    paddingVertical: verticalScale(4.8), //6*0.8
    paddingHorizontal: scale(9.6), //12*0.8
    borderRadius: moderateScale(3.2), //4*0.8
    alignSelf: "center",
    marginBottom: verticalScale(9.6), //12*0.8
  },

  badgeLabelText: {
    fontSize: moderateScale(8.8), //11*0.8
    fontWeight: "700",
    color: "#D76B42",
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(11.2), //14*0.8
    shadowColor:'#81b5e6ff',
    shadowOpacity: 0.6,
    shadowRadius: moderateScale(8), //10*0.8
    shadowOffset: { width: scale(6.4), height: verticalScale(8) }, //8*0.8, 10*0.8
    elevation: 10,
    borderColor: "#ddd",
    borderWidth: scale(0.8), //1*0.8
    paddingBottom: verticalScale(9.6), //12*0.8
    paddingHorizontal: scale(9.6), //12*0.8
    marginHorizontal: scale(16), //20*0.8
    paddingTop: 0,
    position: "relative",
  },

  bestBadge: {
    backgroundColor: "#fde7da",
    alignSelf: "flex-end",
    borderTopStartRadius: moderateScale(4.8), //6*0.8
    borderBottomLeftRadius: moderateScale(4.8),
    marginBottom: verticalScale(4.8), //6*0.8
    marginTop: verticalScale(6.4), //8*0.8
    paddingVertical: verticalScale(2.4), //3*0.8
    paddingHorizontal: scale(4.8), //6*0.8
    marginRight: scale(-9.6), //-12*0.8
  },

  bestBadgeText: {
    fontSize: moderateScale(8), //10*0.8
    fontWeight: "600",
  },

  jobTitle: {
    fontSize: moderateScale(12), //15*0.8
    fontWeight: "600",
    color: "#000",
    marginBottom: verticalScale(2.4), //3*0.8
  },

  salary: {
    fontSize: moderateScale(10.4), //13*0.8
    color: "#333",
    fontWeight: "500",
    marginBottom: verticalScale(6.4), //8*0.8
  },

  company: {
    fontSize: moderateScale(10.4), //13*0.8
    color: "#444",
    marginLeft: scale(3.2), //4*0.8
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8), //10*0.8
  },

  location: {
    fontSize: moderateScale(9.6), //12*0.8
    color: "#666",
    marginLeft: scale(3.2), //4*0.8
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(4.8), //6*0.8
  },

  tag: {
    paddingHorizontal: scale(8), //10*0.8
    paddingVertical: verticalScale(3.2), //4*0.8
    marginTop: verticalScale(9.6), //12*0.8
    backgroundColor: "#EAF6FF",
    fontSize: moderateScale(8.8), //11*0.8
    fontWeight: "600",
    color: "#0186c9",
  },

  urgentTag: {
    backgroundColor: "#FFE8E8",
    color: "#E63946",
  },

  divider: {
    width: "100%",
    height: verticalScale(0.8), //1*0.8
    backgroundColor: "#ddd",
    marginTop: verticalScale(12), //15*0.8
    marginBottom: verticalScale(16), //20*0.8
  },

  fullGradient: {
    width: "100%",
    paddingVertical: verticalScale(12), //18*0.8
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(-40), //-50*0.8
  },

  button: {
    backgroundColor: AppColors.themeColor,
    paddingVertical: verticalScale(8.8), //11*0.8
    paddingHorizontal: scale(36), //45*0.8
    borderRadius: moderateScale(20), //25*0.8
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(3.2), //4*0.8
    shadowOffset: { width: 0, height: verticalScale(1.6) }, //2*0.8
  },

  buttonText: {
    fontSize: moderateScale(11.2), //14*0.8
    fontWeight: "700",
    color: "#fff",
  },
});

