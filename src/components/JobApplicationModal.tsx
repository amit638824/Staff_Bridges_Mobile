import React, { useEffect } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppColors } from '../constants/AppColors';
import { useTranslation } from 'react-i18next';
import { scale,moderateScale,verticalScale } from 'react-native-size-matters';

const { height } = Dimensions.get('window');

interface JobApplicationModalProps {
  visible: boolean;
  onApplyNow: () => void;
  onNotNow: () => void;
  onClose: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  visible,
  onApplyNow,
  onNotNow,
  onClose,
}) => {
  const { t } = useTranslation();

  const slideAnim = React.useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : height,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

 const jobsData = [
  {
    id: 1,
    role: t("job_1_role"),
    company: "Rudrab—emis",
    location: t("job_1_location"),
    salary: t("job_1_salary"),
    experience: t("job_1_experience"),
    tags: [t("tag_new_job"), t("tag_verified"), t("tag_full_time")],
    insurance: true,
    highlights: [
      t("job_1_highlight_1"),
      t("job_1_highlight_2"),
      t("job_1_highlight_3"),
    ],
  },
  {
    id: 2,
    role: t("job_2_role"),
    company: "Samruddhy Bmart Entertainment Pvt. Ltd",
    location: t("job_2_location"),
    salary: t("job_2_salary"),
    experience: t("job_2_experience"),
    tags: [t("tag_new_job"), t("tag_verified"), t("tag_full_time")],
    insurance: true,
    highlights: [
      t("job_2_highlight_1"),
      t("job_2_highlight_2"),
      t("job_2_highlight_3"),
    ],
  },
  {
    id: 3,
    role: t("job_3_role"),
    company: "Jobilito Manpower Private Limited",
    location: t("job_3_location"),
    salary: t("job_3_salary"),
    experience: t("job_3_experience"),
    tags: [t("tag_new_job"), t("tag_verified"), t("tag_full_time")],
    insurance: true,
    highlights: [
      t("job_3_highlight_1"),
      t("job_3_highlight_2"),
      t("job_3_highlight_3"),
    ],
  },
];


  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>

          {/* ------- Header -------- */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.modalTitle}>{t("modal_start_applying")}</Text>

              <View style={styles.headerSubRow}>
                <Text style={styles.subTitle}>{t("modal_new_jobs_unlocked")}</Text>
                <View style={styles.paginationBox}>
                  <Text style={styles.paginationText}>01/04</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={moderateScale(15)} color="#3b3b3b" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* ------- Job List -------- */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {jobsData.map((job) => (
              <View key={job.id} style={styles.card}>

                <View style={styles.salaryTopContainer}>
                  <Text style={styles.jobRole}>{job.role}</Text>
                  <Ionicons name="checkbox" size={20} color={AppColors.themeColor} />
                </View>

                <Text style={styles.companyName}>{job.company}</Text>

                <View style={styles.row}>
                  <Ionicons name="location-outline" size={15} color="#6b6b6b" />
                  <Text style={styles.jobInfo}>{job.location}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="cash-outline" size={15} color="#6b6b6b" />
                  <Text style={styles.salary}>{job.salary}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="briefcase-outline" size={15} color="#6b6b6b" />
                  <Text style={styles.salary}>{job.experience}</Text>
                </View>

                <View style={styles.tagRow}>
                  {job.tags.map((tag, i) => (
                    <View key={i} style={styles.tagContainer}>
                      {tag === 'Verified' && (
                        <Ionicons name="checkmark-circle" size={14} color={AppColors.primary} />
                      )}
                      {tag === 'Full Time' && (
                        <Ionicons name="time-outline" size={14} color="#444" />
                      )}
                      <Text style={styles.tag}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                {job.insurance && (
                  <>
                    <Text style={styles.sectionTitle}>{t("modal_insurance_provided")}</Text>
                    <View style={styles.divider} />
                  </>
                )}

                <Text style={styles.sectionTitle}>{t("modal_job_highlights")}</Text>
                {job.highlights.map((highlight, i) => (
                  <Text key={i} style={styles.bullet}>{highlight}</Text>
                ))}
              </View>
            ))}

            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* ------- Bottom Buttons -------- */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.notNowBtn} onPress={onNotNow}>
              <Ionicons name="close" size={18} color="#777" />
              <Text style={styles.notNowText}>{t("modal_not_now")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={onApplyNow}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.applyText}>{t("modal_apply_now")}</Text>
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
  marginRight: scale(8),   // small spacing before pagination
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
    paddingBottom: verticalScale(20),
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
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(12),
  },

  jobRole: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },

  companyName: {
    fontSize: moderateScale(10),
    marginTop: verticalScale(3),
    color: '#6b6b6b',
    fontWeight: '500',
    paddingHorizontal: scale(12),
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
  },

  bullet: {
    fontSize: moderateScale(10),
    color: '#5e5e5e',
    marginTop: verticalScale(3),
    paddingHorizontal: scale(12),
    lineHeight: moderateScale(14),
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(5),
    marginVertical: verticalScale(16),
  },

  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#e0e0e0',
  },

  activeDot: {
    backgroundColor: '#00BCC4',
  },

  bottomSpacing: {
    height: verticalScale(40),
  },

  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(12),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(28) : verticalScale(23),
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