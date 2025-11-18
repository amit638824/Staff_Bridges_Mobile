import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface JobCardProps {
  title: string;
  salary: string;
  company: string;
  location: string;
  badges: string[];
}

const JobCard: React.FC<JobCardProps> = ({ title, salary, company, location, badges }) => {
  return (
    <View style={styles.card}>
      {/* Badge */}
      <View style={styles.bestBadge}>
        <Text style={styles.bestBadgeText}>⭐ BEST JOB FOR YOU</Text>
      </View>

      <Text style={styles.jobTitle}>{title}</Text>

      <Text style={styles.salary}>{salary}</Text>
          <View style={styles.locationRow}>
              <Ionicons name="briefcase-outline" size={14} color="#777"/>

      <Text style={styles.company}>{company}</Text>
</View>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color="#777" />
        <Text style={styles.location}>{location}</Text>
      </View>

   {/* Bottom Tags */}
<View style={styles.tagContainer}>
  {badges.map((b, i) => (
    <Text key={i} style={[styles.tag, b === "Urgent Hiring" && styles.urgentTag]}>
      {b}
    </Text>
  ))}
</View>

{/* Divider */}
<View style={styles.divider} />

    </View>
  );
};


const JobSuggestionSection = () => {
  const jobs = [
    {
      title: "Email & Chat Support Executive",
      salary: "₹ 16,000 - 25,000 / Month",
      company: "Rudraksh-omies",
      location: "Hazratganj, Lucknow (within 7 KM)",
      badges: ["New Job", "Verified", "Urgent Hiring"],
    },
    {
      title: "Customer Relationship Manager",
      salary: "₹ 20,000 - 30,000 / Month",
      company: "Moris Tech Pvt Ltd",
      location: "Gomti Nagar, Lucknow (within 5 KM)",
      badges: ["Verified", "Urgent Hiring"],
    },
  ];

  return (
    <View style={styles.section}>
      {/* Header */}
    

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
    marginTop: 10,
    paddingHorizontal: 15,
  },


   card: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: 'teal',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8, // For Android shadow
    paddingTop: 0,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingBottom: 12,
    paddingHorizontal: 12,
    marginRight: 16,
    position: 'relative',
  },

  bestBadge: {
    backgroundColor: "#fee9c8",
    alignSelf: "flex-end",
    borderTopStartRadius: 6,
    borderBottomLeftRadius: 6,
    marginBottom: 6,
    marginTop:8,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },

  bestBadgeText: {
    color: "#b87025",
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
    // marginBottom: 0,
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
  divider: {
  width: "100%",
  height: 1,
  backgroundColor: "#ddd",
  marginTop: 15,
  marginBottom: 20, // space after divider
},


  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    // borderRadius: 10,
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
});
