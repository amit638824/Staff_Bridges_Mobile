import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
      <Text style={styles.title}>{title}</Text>
     <Text style={styles.salary}>{salary}</Text>
            <View style={styles.locationRow}>
                <Ionicons name="briefcase-outline" size={14} color="#777"/>
  
        <Text style={styles.company}>{company}</Text>
  </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.location}>{location}</Text>
        </View>

      <View style={styles.badgesContainer}>
        {badges.map((badge, index) => (
          <Text key={index} style={styles.badge}>{badge}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontWeight: "bold", fontSize: 16 },
  salary: { marginTop: 2 ,marginBottom:10},
  company: { marginTop: 2,marginLeft: 4, fontSize: 14, color: "#444" },
   locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  location: { marginLeft: 4, fontSize: 14, color: "#444" },
  badgesContainer: { flexDirection: "row", marginTop: 10 },
  badge: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 6,
  },
});

export default JobCard;
