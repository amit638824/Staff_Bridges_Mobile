import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppFooter from '../components/AppFooter';
import { AppColors } from '../constants/AppColors';

const ResponsesScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [currentIndex, setCurrentIndex] = useState(2);

  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

  const applicationData = {
    title: 'Email & Chat Support Executive',
    salary: '₹ 16,000 - 25,000 / Month',
    company: 'Rudrao-emisis',
    location: 'Hazratganj, Lucknow (within 7 KM)',
    badge: 'Urgent Hiring',
    timeAgo: '17 hours ago',
    status: 'Application sent',
    statusSubtext: 'HR called you. Call back to check application status.',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE5E5" />
      
    {/* Simple Header - Just "Responses" text */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Responses</Text>
      </View>

      {/* Tab Section */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'applications' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('applications')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'applications' && styles.activeTabText,
            ]}
          >
            Applications (1)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Application Card */}
        <View style={styles.applicationCard}>
          {/* Top Badge Row */}
      <View style={styles.badgeRow}>
  <LinearGradient
    colors={['#ffe1cf', '#f9f4f1']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.bestJobGradient}
  >
    <Ionicons name="star" size={10} color="#e59600" />
    <Text style={styles.bestJobText}>BEST JOB FOR YOU</Text>
  </LinearGradient>

  <View style={styles.urgentBadge}>
    <Ionicons name="time" size={10} color="#d78b53" />
    <Text style={styles.urgentText}>Urgent Hiring</Text>
  </View>
</View>


        {/* Job + Image Section */}
<View style={styles.jobRow}>
  <Image
    source={require('../../assets/images/residential.png')}
    style={styles.jobIcon}
  />

  <View style={{ flex: 1 }}>
    <Text style={styles.jobTitle}>{applicationData.title}</Text>

    <Text style={styles.salaryText}>{applicationData.salary}</Text>

    
  </View>
  
</View>


          {/* Company */}
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={13} color="#888" />
            <Text style={styles.infoText}>{applicationData.company}</Text>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={13} color="#888" />
            <Text style={styles.infoText}>{applicationData.location}</Text>
          </View>

          {/* Application Status with Blue Background */}
          <View style={styles.statusContainer}>
            <View style={styles.statusIconBg}>
              <Ionicons name="bulb" size={14} color="#d7e7f5ff" />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>
                Application sent {applicationData.timeAgo}
              </Text>
              <Text style={styles.statusSubtext}>
                {applicationData.statusSubtext}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.similarJobsButton}>
              <Text style={styles.similarJobsText}>Similar jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callHRButton}>
              <Ionicons name="call" size={14} color="#fff" />
              <Text style={styles.callHRText}>Call HR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Section */}
        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpTitle}>Get Help / Tell us what happened</Text>
          <Ionicons name="chevron-forward" size={18} color="#00BCC4" />
        </TouchableOpacity>

        {/* Add Experience Section with Blue Gradient */}
        <LinearGradient
          colors={['#d7dff1', '#9ab1e2']}
          start={{ x: 0, y:0}}
          end={{ x: 0, y: 1 }}
          style={styles.experienceCard}
        >
          <View style={styles.experienceContent}>
            <Text style={styles.experienceTitle}>
              Add industry experience to your profile
            </Text>
            <TouchableOpacity style={styles.addExperienceButton}>
              <Text style={styles.addExperienceText}>
                Add industry experience
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.experienceImageContainer}>
            <Image
              style={styles.experienceImage}
              source={require('../../assets/images/job-brief.png')}
            />
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Bottom Navigation */}
      <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />
    </SafeAreaView>
  );
};

export default ResponsesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 14,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f6ff',
    paddingHorizontal: 16,
    // paddingBottom: 14,
    alignContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#eeeff1ff',
    // borderBottomWidth: 1,
    padding: 8,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    // marginTop: ,
    borderColor: '#e0e0e0',
  },

  activeTab: {
    backgroundColor: '#fff6ec',
    borderColor: '#ebae3b',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },

  activeTabText: {
    color: '#ebae3b',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },

  applicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderColor: '#d6d3d3ff',
    borderWidth: 1,
    shadowColor: '#74f0f0ff',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },

  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },

  bestJobBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  bestJobText: {
    fontSize: 9,
    fontWeight: '700',
    // color: '#E8A54B',
    letterSpacing: 0.3,
  },
bestJobGradient: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderTopLeftRadius: 20,
  borderBottomLeftRadius: 20,

  alignSelf: 'flex-start',
  gap: 5,
},

jobRow: {
  flexDirection: 'row',
  gap: 12,
  alignItems: 'flex-start',
  marginTop: 5,
},

jobIcon: {
  width: 42,
  height: 42,
  borderColor: '#e0e0e0',
  borderWidth: 1,
  borderRadius: 4,
  padding: 6,
  resizeMode: 'contain',
  marginTop: 2,
},

  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe8d7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 3,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: -13,
  },

  urgentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#d78b53',
  },

  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },

  salaryIcon: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  salaryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },

  infoText: {
    fontSize: 12,
    color: '#777',
    fontWeight: '400',
  },

  imageBoxContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  jobImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 40,
    gap: 10,
    marginHorizontal: 16,
  },

  statusIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2e98fcff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusTextContainer: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 12,
    fontWeight: '700',
    // color: '#0084FF',
    marginBottom: 2,
  },

  statusSubtext: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },

  buttonRow: {
    flexDirection: 'row',
    
    gap: 10,
    marginTop: 14,
    marginLeft: 150,
    marginRight: 15,
  },

  similarJobsButton: {
    flex: 1,
    // backgroundColor: '#E0F7F6',
    borderColor: '#00A79D',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  similarJobsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00A79D',
  },

  callHRButton: {
    flex: 1,
    backgroundColor: AppColors.buttons,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  callHRText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  helpCard: {
    backgroundColor: '#FFEBE9',
    borderRadius: 10,
    borderTopEndRadius: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#cccbcbff',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 0,
  },

  helpTitle: {
    fontSize: 13,
    fontWeight: '600',
    // color: '#E85D4C',
  },

  experienceCard: {
    borderRadius: 12,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  experienceContent: {
    flex: 1,
    paddingRight: 10,
  },

  experienceTitle: {
    fontSize: 16,
    fontWeight: '800',
    // color: '#fff',
    marginBottom: 12,
    marginLeft: 4,
    lineHeight: 18,
  },

  addExperienceButton: {
  backgroundColor: AppColors.buttons,
      paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  addExperienceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },

  experienceImageContainer: {
    position: 'relative',
  },

  experienceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  verifiedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});