import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

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
      badge === "New Job" ? "card_new_job" :
      badge === "Verified" ? "card_verified" :
      badge === "Urgent Hiring" ? "card_urgent_hiring" : badge
    );

    if (badge === "New Job") {
      tagStyle.push(styles.newTag);
      textStyle.push({ color: "#7e93ff" });
    }

    if (badge === "Verified") {
      icon = <Ionicons name="checkmark-done-circle" size={13} color="#007BFF" />;
      tagStyle.push(styles.verifiedTag);
      textStyle.push({ color: "#000" });
    }

    if (badge === "Urgent Hiring") {
      icon = <Ionicons name="time-outline" size={13} color="#dc935e" />;
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
        <Ionicons name="briefcase-outline" size={14} color="#777" />
        <Text style={styles.company}>{company}</Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color="#777" />
        <Text style={styles.location}>{location}</Text>
      </View>

      {/* Badge Row */}
      <View style={styles.tagContainer}>{badges.map(renderBadge)}</View>

      <View style={styles.divider} />
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
    marginTop: 10,
    paddingHorizontal: 15,
  },

  card: {
    width: 310,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "teal",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    paddingTop: 0,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingBottom: 12,
    paddingHorizontal: 12,
    marginRight: 16,
    marginBottom: 10,
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

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 15,
    marginBottom: 20,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    marginTop: 12,
  },

  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },

  newTag: {
    backgroundColor: "#d9dfff",
    borderWidth: 1,
    borderColor: "#d9dfff",
  },

  verifiedTag: {
    backgroundColor: "#e8e8e8",
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },

  urgentTag: {
    backgroundColor: "#ffcca7",
    borderWidth: 1,
    borderColor: "#ffcca7",
  },
});
