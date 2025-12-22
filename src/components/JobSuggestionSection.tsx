import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { AppColors } from "../constants/AppColors";
import { getJobBenefits } from "../services/jobBenefitsService";

interface JobSuggestionSectionProps {
  jobs: any[];
  onJobPress?: (job: any) => void;
}

interface JobCardProps {
  job: any;
  title: string;
  salary: string;
  company: string;
  location: string;
  badges: string[];
  benefits: string[];
  onPress?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job,
  title, 
  salary, 
  company, 
  location, 
  badges,
  benefits,
  onPress 
}) => {
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
      // icon = (
      //   <MaterialCommunityIcon
      //     name="new-box"
      //     size={moderateScale(10)}
      //     color="#7e93ff"
      //   />
      // );
    }

    if (badge === "Verified") {
      icon = (
        <MaterialCommunityIcon
          name="check-circle"
          size={moderateScale(11)}
          color="#007BFF"
        />
      );
      tagStyle.push(styles.verifiedTag);
      textStyle.push({ color: "#080808ff" });
    }

    if (badge === "Urgent Hiring") {
      icon = (
        <MaterialCommunityIcon 
          name="clock-outline" 
          size={moderateScale(11)} 
          color="#dc935e" 
        />
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
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.bestBadge}>
        <Text style={styles.bestBadgeText}>{t("card_best_job")}</Text>
      </View>

      <Text style={styles.jobTitle} numberOfLines={2}>{title}</Text>
      <Text style={styles.salary}>{salary}</Text>

      <View style={styles.locationRow}>
        <Ionicons
          name="briefcase-outline"
          size={moderateScale(12)}
          color="#777"
        />
        <Text style={styles.company} numberOfLines={1}>{company}</Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={moderateScale(12)}
          color="#777"
        />
        <Text style={styles.location} numberOfLines={1}>{location}</Text>
      </View>

<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <View style={styles.tagContainer}>
    {badges.map(renderBadge)}
  </View>
</ScrollView>

      <View style={styles.dividerWrapper}>
        <View style={styles.divider} />
      </View>
{/* 
      {benefits && benefits.length > 0 && (
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsText} numberOfLines={1}>
            {benefits.slice(0, 2).map(b => `${b} Provided`).join(' | ')}
          </Text>
        </View>
      )} */}
    </TouchableOpacity>
  );
};

const JobSuggestionSection: React.FC<JobSuggestionSectionProps> = ({ 
  jobs,
  onJobPress 
}) => {
  const { t } = useTranslation();
  const [jobBenefits, setJobBenefits] = useState<Record<number, string[]>>({});
  const [loadingBenefits, setLoadingBenefits] = useState(true);

  // Helper function to check if job is new
  const isNewJob = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInDays =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  // Fetch benefits for all jobs
  useEffect(() => {
    const loadBenefits = async () => {
      try {
        setLoadingBenefits(true);
        const benefitsData: Record<number, string[]> = {};

        await Promise.all(
          jobs.map(async (job) => {
            try {
              const benefits = await getJobBenefits(job.job_id);
              benefitsData[job.job_id] = benefits || [];
            } catch (error) {
              console.error(`Error fetching benefits for job ${job.job_id}:`, error);
              benefitsData[job.job_id] = [];
            }
          })
        );

        setJobBenefits(benefitsData);
      } catch (error) {
        console.error('Error loading benefits:', error);
      } finally {
        setLoadingBenefits(false);
      }
    };

    if (jobs && jobs.length > 0) {
      loadBenefits();
    }
  }, [jobs]);

  // Show empty state if no jobs
  if (!jobs || jobs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="briefcase-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>{t('loading') || 'loading jobs..'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {jobs.map((job, index) => (
          <JobCard
            key={job.job_id || index}
            job={job}
            title={job.job_title_name}
            salary={`₹${parseInt(job.salary_min, 10)} - ₹${parseInt(job.salary_max, 10)} / Month`}
            company={job.company}
            location={`${job.locality_name}, ${job.city_name}`}
            badges={[
              isNewJob(job.created_at) ? "New Job" : "",
              job.verification_required === 0 ? "Verified" : "",
              job.openings >= 5 || job.hiring_for_others === 1 ? "Urgent Hiring" : "",
            ].filter(Boolean)}
            benefits={jobBenefits[job.job_id] || []}
            onPress={() => onJobPress && onJobPress(job)}
          />
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
    marginHorizontal: scale(20),
  },
  emptyText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(14),
    color: '#999',
    textAlign: 'center',
  },
 card: {
  width: scale(270), // ✅ ideal
    backgroundColor: "#fff",
    borderRadius: scale(12),
    shadowColor: AppColors.primary,
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
    flex: 1,
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
    flex: 1,
  },
 tagContainer: {
  flexDirection: "row",
  flexWrap: "nowrap",    
  alignItems: "center",
  marginTop: verticalScale(10),
 
},

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
  textAlign:'center',
  borderRadius: moderateScale(4),
  minWidth: scale(70),        // ✅ Ensures consistent width
   marginRight:scale(10)
},

  tagText: {
    fontSize: moderateScale(10),
    alignSelf:'center',
    fontWeight: "600",
  },
  newTag: {
    backgroundColor: "#d9dfff",
    borderWidth: scale(1),
     textAlign:'center',
    borderColor: "#d9dfff",
  },
  verifiedTag: {
    backgroundColor: "#e8e8e8",
    borderWidth: scale(1),
    borderColor: "#e8f5e9",
  },
  urgentTag: {
    backgroundColor: "#ffcca7",
    borderWidth: scale(1),
    borderColor: "#ffcca7",
  },
  benefitsContainer: {
    // marginTop: verticalScale(4),
    paddingTop: verticalScale(8),
  },
  benefitsText: {
    fontSize: moderateScale(9),
    fontWeight: "500",
    color: "#999",
  },
});