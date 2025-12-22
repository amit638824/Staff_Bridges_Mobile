import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppColors } from '../constants/AppColors';
import { useTranslation } from 'react-i18next';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { getRecruiterJobList, RecruiterJob } from '../services/jobService';
import { getJobBenefits } from '../services/jobBenefitsService';

const { height } = Dimensions.get('window');

interface JobApplicationModalProps {
  visible: boolean;
  onApplyNow: () => void;
  onNotNow: () => void;
  onClose: () => void;
}

// Map job_qualification to readable format
const getQualificationLabel = (qualification: string): string => {
  const qualMap: Record<string, string> = {
    primary: '5th Pass',
    middle: '8th Pass',
    highschool: '10th Pass',
    intermediate: '12th Pass',
    graduate: 'Graduate',
    postgraduate: 'Post Graduate',
  };
  return qualMap[qualification?.toLowerCase()] || qualification;
};

// Format working days
const formatWorkingDays = (days: string): string => {
  const daysNum = parseInt(days);
  return `${daysNum} Days/Week`;
};

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  visible,
  onApplyNow,
  onNotNow,
  onClose,
}) => {
  const { t } = useTranslation();

  const slideAnim = useRef(new Animated.Value(height)).current;

  const [jobsData, setJobsData] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(false);
const [jobBenefits, setJobBenefits] = useState<Record<number, string[]>>({});

  /* ---------------- Slide Animation ---------------- */
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : height,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  /* ---------------- Fetch Jobs ---------------- */
useEffect(() => {
  if (!visible) return;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobs = await getRecruiterJobList();
      setJobsData(jobs);

      // 🔹 Fetch benefits for each job
      const benefitsMap: Record<number, string[]> = {};

      await Promise.all(
        jobs.map(async (job) => {
          try {
            const benefits = await getJobBenefits(job.job_id);
            benefitsMap[job.job_id] = benefits || [];
          } catch {
            benefitsMap[job.job_id] = [];
          }
        })
      );

      setJobBenefits(benefitsMap);
    } catch (error) {
      console.log('Failed to load jobs', error);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, [visible]);


  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* -------- Header -------- */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.modalTitle}>{t('modal_start_applying')}</Text>

              <View style={styles.headerSubRow}>
                <Text style={styles.subTitle}>
                  {t('modal_new_jobs_unlocked')}
                </Text>
                <View style={styles.paginationBox}>
                  <Text style={styles.paginationText}>
                    01/{jobsData.length.toString().padStart(2, '0')}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={moderateScale(15)} color="#3b3b3b" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* -------- Job List -------- */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color={AppColors.themeColor}
                style={{ marginTop: verticalScale(30) }}
              />
            ) : (
              jobsData.map((job) => (
                <View key={job.job_id} style={styles.card}>
                  {/* ---- Job Title & Checkbox ---- */}
                  <View style={styles.salaryTopContainer}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.jobRole}>{job.job_title_name}</Text>
                      <Text style={styles.categoryTag}>{job?.company?.toUpperCase()}</Text>
                    </View>
                    <Ionicons
                      name="checkbox"
                      size={20}
                      color={AppColors.themeColor}
                    />
                  </View>

                  {/* ---- Location & Salary Row ---- */}
                  <View style={styles.row}>
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color="#6b6b6b"
                    />
                    <Text style={styles.jobInfo}>
                      {job.locality_name}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Ionicons
                      name="cash-outline"
                      size={15}
                      color="#6b6b6b"
                    />
                    <Text style={styles.salary}>
                      ₹{parseInt(job.salary_min)} - ₹{parseInt(job.salary_max)} \ Month
                    </Text>
                  </View>

                  {/* ---- Experience ---- */}
                  <View style={styles.row}>
                    <Ionicons
                      name="briefcase-outline"
                      size={15}
                      color="#6b6b6b"
                    />
                    <Text style={styles.salary}>
                      {parseInt(job.min_experience)} - {parseInt(job.max_experience)} years Experience{"\n"}
                     in {job.category_name}
                    </Text>

                  </View>

                  {/* ---- Tags Row ---- */}
                  <View style={styles.tagRow}>
                    <View style={styles.tagContainer}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color="#444"
                      />
                      <Text style={styles.tag}>
                        {job.job_type}
                      </Text>
                    </View>

                    {job.only_fresher === 1 && (
                      <View style={styles.tagContainer}>
                        <Ionicons
                          name="star-outline"
                          size={14}
                          color="#FF6B35"
                        />
                        <Text style={styles.tag}>Fresher Only</Text>
                      </View>
                    )}
                  </View>
<View style={styles.divider}></View>
{/* ---- Benefits Section ---- */}
{jobBenefits[job.job_id]?.length > 0 && (
  <View style={styles.benefitsContainer}>
    <Text style={styles.benefitsText} numberOfLines={1}>
      {jobBenefits[job.job_id]
        .slice(0, 2)
        .map(b => `${b} Provided`)
        .join(' | ')}
    </Text>
  </View>
)}
<View style={styles.divider}></View>


                  {/* ---- Job Details Section ---- */}
                  <Text style={styles.sectionTitle}>Job Highlights</Text>

                  {/* Gender */}
                  <View style={styles.detailRow}>
                    {/* <View style={styles.detailIconContainer}>
                      <Ionicons
                        name="person-outline"
                        size={14}
                        color={AppColors.themeColor}
                      />
                    </View> */}
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Gender</Text>
                      <Text style={styles.detailValue}>{job.gender}</Text>
                    </View>
                  </View>

                  {/* Education Level */}
                  <View style={styles.detailRow}>
                    {/* <View style={styles.detailIconContainer}>
                      <Ionicons
                        name="school-outline"
                        size={14}
                        color={AppColors.themeColor}
                      />
                    </View> */}
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Education</Text>
                      <Text style={styles.detailValue}>
                        {getQualificationLabel(job.qualification)}
                      </Text>
                    </View>
                  </View>

                  {/* Working Days */}
                  <View style={styles.detailRow}>
                    {/* <View style={styles.detailIconContainer}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={AppColors.themeColor}
                      />
                    </View> */}
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Working Days</Text>
                      <Text style={styles.detailValue}>
                        {formatWorkingDays(job.working_days)} | {job.shift} Shift
                      </Text>
                    </View>
                  </View>

                  {/* Salary Type */}
                  <View style={styles.detailRow}>
                    {/* <View style={styles.detailIconContainer}>
                      <Ionicons
                        name="wallet-outline"
                        size={14}
                        color={AppColors.themeColor}
                      />
                    </View> */}
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Salary Type</Text>
                      <Text style={styles.detailValue}>
                        {job.salary_benifits}
                      </Text>
                    </View>
                  </View>

                  {/* Openings */}
                  {job.openings && (
                    <View style={styles.detailRow}>
                      {/* <View style={styles.detailIconContainer}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color={AppColors.themeColor}
                        />
                      </View> */}
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Openings</Text>
                        <Text style={styles.detailValue}>
                          {job.openings} Position{job.openings > 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* -------- Bottom Buttons -------- */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.notNowBtn} onPress={onNotNow}>
              <Ionicons name="close" size={18} color="#777" />
              <Text style={styles.notNowText}>
                {t('modal_not_now')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={onApplyNow}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.applyText}>
                {t('modal_apply_now')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default JobApplicationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalContainer: {
    width: '100%',
    height: height * 0.92,
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(18),
    borderTopRightRadius: scale(18),
    position: 'relative',
  },

  headerTextContainer: {
    flex: 1,
  },

  modalTitle: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#000',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
  },

  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(3),
  },

  subTitle: {
    fontSize: moderateScale(13),
    color: '#5E5E5E',
    marginRight: scale(8),
  },

  paginationBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: scale(5),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    alignSelf: 'center',
  },

  paginationText: {
    fontSize: moderateScale(10),
    color: '#444',
    fontWeight: '600',
  },

 scrollContent: {
  paddingHorizontal: scale(8),
  paddingBottom: verticalScale(80), // ✅ space for buttons
},


  card: {
    borderWidth: scale(1),
    borderColor: '#e5e5e5',
    borderRadius: scale(8),
    padding: 0,
    marginTop: verticalScale(4),
    paddingBottom: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.4,
    margin: scale(8),
    shadowRadius: scale(3),
    boxShadow: '0 4px 4px rgba(0,0,0,0.1)',
    marginBottom: verticalScale(12),
    overflow: 'hidden',
  },

  salaryTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(12),
  },

  jobRole: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },

  categoryTag: {
    fontSize: moderateScale(13),
    // color: AppColors.themeColor,
        color: '#000',
    fontWeight: '600',
    marginTop: verticalScale(2),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: verticalScale(6),
    paddingHorizontal: scale(12),
    gap: scale(6),
  },

  jobInfo: {
    fontSize: moderateScale(10),
    color: '#585858',
    flex: 1,
    lineHeight: moderateScale(14),
  },

  salary: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#000',
    flex: 1,
    lineHeight: moderateScale(14),
  },

  tagRow: {
    flexDirection: 'row',
    gap: scale(6),
    marginTop: verticalScale(10),
    paddingHorizontal: scale(12),
    flexWrap: 'wrap',
  },

  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3),
    backgroundColor: '#e8e8e8',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(3),
  },

  tag: {
    fontSize: moderateScale(9),
    color: '#444',
    fontWeight: '500',
  },
benefitsContainer: {
  marginTop: verticalScale(6),
  paddingHorizontal: scale(12),
  // paddingTop: verticalScale(8),
  // borderTopWidth: scale(0.6),
  // borderTopColor: '#e6e6e6',
},

benefitsText: {
  fontSize: moderateScale(9),
  fontWeight: '500',
  color: '#8a8a8a',
},

  divider: {
    height: scale(0.8),
    backgroundColor: '#ededed',
    marginVertical: verticalScale(10),
  },

  sectionTitle: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(8),
  },

  detailRow: {
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(10),
    alignItems: 'center',
  },

  detailIconContainer: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#f0f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: moderateScale(9),
    color: '#999',
    fontWeight: '500',
    marginBottom: verticalScale(1),
  },

  detailValue: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#000',
  },

 bottomSpacing: {
  height: verticalScale(80), // ✅ ensures last card border is visible
},


  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(12),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(50),
    backgroundColor: '#fff',
    paddingHorizontal: scale(16),
    gap: scale(10),
  },

  notNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1),
    borderColor: '#e0e0e0',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(26),
    backgroundColor: '#f5f5f5',
    flex: 0.4,
  },

  notNowText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginLeft: scale(5),
    color: '#666',
  },

  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.themeColor,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(26),
    flex: 0.6,
  },

  applyText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#fff',
    marginLeft: scale(5),
  },
});