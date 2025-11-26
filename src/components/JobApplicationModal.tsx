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
      role: 'Delivery Boy',
      company: 'FLIPWEB NET',
      location: 'Hazratganj, Lucknow (within 7 Km)',
      salary: '₹6,000 - 25,000 /Month',
      experience: '0 - 2 years Experience\nIn Delivery',
      tags: ['New Job', 'Verified', 'Full Time'],
      insurance: true,
      highlights: ['All education levels', 'All genders', '5 days working | Day shift'],
    },
    {
      id: 2,
      role: 'Digital Marketing Executive',
      company: 'FUTURE GROWTH',
      location: 'Gomti Nagar, Lucknow (within 7 Km)',
      salary: '₹8,000 - 15,500 /Month',
      experience: '1 - 2 years Experience\nIn Digital Marketing',
      tags: ['New Job', 'Verified', 'Full Time'],
      insurance: true,
      highlights: ['All education levels', 'All genders', '5 days working | Day shift'],
    },
    {
      id: 3,
      role: 'Recruiter / HR Admin',
      company: 'EXPERTISE',
      location: 'Hazratganj, Lucknow (within 7 Km)',
      salary: '₹7,000 - 23,500 /Month',
      experience: '1 - 2 years Experience\nIn Recruiter / HR / Admin',
      tags: ['New Job', 'Verified', 'Full Time'],
      insurance: true,
      highlights: ['All education levels', 'All genders', '5 days working | Day shift'],
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
              <Text style={styles.modalTitle}>Start Applying!</Text>

              <View style={styles.headerSubRow}>
                <Text style={styles.subTitle}>New jobs unlocked!</Text>

                {/* <View style={styles.paginationBox}>
                  <Text style={styles.paginationText}>
                    {String(jobsData.length).padStart(2, '0')} Jobs
                  </Text>
                </View> */}
              </View>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#3b3b3b" />
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
                    <Text style={styles.sectionTitle}>Insurance Provided</Text>
                    <View style={styles.divider} />
                  </>
                )}

                <Text style={styles.sectionTitle}>Job Highlights</Text>
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
              <Text style={styles.notNowText}>Not Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={onApplyNow}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.applyText}>Apply Now</Text>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
  },

  headerTextContainer: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },

  headerSubRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },

  subTitle: {
    fontSize: 12,
    color: '#5E5E5E',
    flex: 1,
  },

  paginationBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  paginationText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '600',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  card: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    padding: 0,
    marginTop: 15,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    margin:10,
    shadowRadius: 4,
    boxShadow: '0 4px 4px rgba(0,0,0,0.1)',
    marginBottom: 15,
    overflow: 'hidden',
  },

  salaryTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  jobRole: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },

  companyName: {
    fontSize: 12,
    marginTop: 4,
    color: '#6b6b6b',
    fontWeight: '500',
    paddingHorizontal: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 15,
    gap: 8,
  },

  jobInfo: {
    fontSize: 12,
    color: '#585858',
    flex: 1,
    lineHeight: 16,
  },

  salary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    lineHeight: 16,
  },

  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 15,
    flexWrap: 'wrap',
  },

  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius:4,
  },

  tag: {
    fontSize: 11,
    color: '#444',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#ededed',
    marginVertical: 14,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 15,
  },

  bullet: {
    fontSize: 12,
    color: '#5e5e5e',
    marginTop: 4,
    paddingHorizontal: 15,
    lineHeight: 16,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },

  activeDot: {
    backgroundColor: '#00BCC4',
  },

  bottomSpacing: {
    height: 50,
  },

  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    gap: 12,
  },

  notNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    flex: 0.4,
  },

  notNowText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#666',
  },

  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.themeColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 0.6,
  },

  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 6,
  },
});