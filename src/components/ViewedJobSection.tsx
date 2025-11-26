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

const ViewedJobsSection = () => {
  const viewedJob = {
    title: "Email & Chat Support Executive",
    salary: "₹ 18,000 - 25,000 / Month",
    company: "Rudraksh-omies",
    location: "Hazratganj, Lucknow (within 7 KM)",
    badges:[],
  };

  return (
    <View style={styles.wrapper}>
     
      {/* Title */}
      <Text style={styles.sectionTitle}>Because you viewed this job...</Text>

    

      {/* Job Card */}
      <View style={styles.card}>
        {/* Best Job Badge */}
        <View style={styles.bestBadge}>
          <Text style={styles.bestBadgeText}>⭐ BEST JOB FOR YOU</Text>
        </View>

        {/* Job Title */}
        <Text style={styles.jobTitle}>{viewedJob.title}</Text>

        {/* Salary */}
        <Text style={styles.salary}>{viewedJob.salary}</Text>

        {/* Company with Icon */}
        <View style={styles.locationRow}>
          <Ionicons name="briefcase-outline" size={14} color="#777" />
          <Text style={styles.company}>{viewedJob.company}</Text>
        </View>

        {/* Location with Icon */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.location}>{viewedJob.location}</Text>
        </View>

        {/* Bottom Tags */}
        <View style={styles.tagContainer}>
          {viewedJob.badges.map((b, i) => (
            <Text
              key={i}
              style={[
                styles.tag,
                b === "Urgent Hiring" && styles.urgentTag,
              ]}
            >
              {b}
            </Text>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />
      </View>

    {/* Full Width Gradient Bar with Button - Overlapping */}
      <LinearGradient
        colors={["#d5f5f8", "#7cdce2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fullGradient}
      >
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View similar jobs</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ViewedJobsSection;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },

  headerLineContainer: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },

  headerLine: {
    width: 40,
    height: 4,
    backgroundColor: "#00b5b5",
    borderRadius: 10,
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },

  badgeLabel: {
    backgroundColor: "#FFE8D6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 12,
  },

  badgeLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D76B42",
    letterSpacing: 0.5,
  },

  card: {
    // width: "92%",
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor:'#81b5e6ff',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 8, height: 10 },
    elevation: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingBottom: 12,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    paddingTop: 0,
    position: "relative",
  },

bestBadge: {
    backgroundColor: "#fde7da",
    alignSelf: "flex-end",
    borderTopStartRadius: 6,
    borderBottomLeftRadius: 6,
    marginBottom: 6,
    marginTop: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: -12,
  },

  bestBadgeText: {
    // color: "#b87025",
    fontSize: 10,
    fontWeight: "700",
  },


  jobTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 3,
  },

  salary: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    marginBottom: 8,
  },

  company: {
    fontSize: 13,
    color: "#444",
    marginLeft: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  location: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 12,
    backgroundColor: "#EAF6FF",
    fontSize: 11,
    fontWeight: "600",
    color: "#0186c9",
  },

  urgentTag: {
    backgroundColor: "#FFE8E8",
    color: "#E63946",
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 15,
    marginBottom: 20,
  },

  fullGradient: {
    width: "100%",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -50,
  },

  button: {
    backgroundColor: AppColors.themeColor,
    paddingVertical: 11,
    paddingHorizontal: 45,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});