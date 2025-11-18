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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const ResponsesScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('applications');

  const applicationData = {
    title: 'Email & Chat Support Executive',
    salary: '₹ 15,000 - 20,000 / Month',
    company: 'Rudraksh-omies',
    location: 'Hazratganj, Lucknow (within 7 KM)',
    badge: 'Urgent Hiring',
    timeAgo: '7 hours ago',
    status: 'Application sent',
    actionButtons: ['View similar jobs', 'Call HR'],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
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
      >
        {/* Application Card */}
        <View style={styles.applicationCard}>
          {/* Top Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.bestJobBadge}>
              <Ionicons name="star" size={12} color="#FFA500" />
              <Text style={styles.bestJobText}>Best job for you</Text>
            </View>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Urgent Hiring</Text>
            </View>
          </View>

          {/* Job Title */}
          <Text style={styles.jobTitle}>{applicationData.title}</Text>

          {/* Salary */}
          <View style={styles.infoRow}>
            <Ionicons name="cash" size={14} color="#333" />
            <Text style={styles.infoText}>{applicationData.salary}</Text>
          </View>

          {/* Company */}
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{applicationData.company}</Text>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{applicationData.location}</Text>
          </View>

          {/* Application Status */}
          <View style={styles.statusContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-circle" size={40} color="#2196F3" />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {applicationData.status}
              </Text>
              <Text style={styles.statusTime}>
                {applicationData.timeAgo}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.similarJobsButton}>
              <Text style={styles.buttonText}>Similar jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callHRButton}>
              <Ionicons name="call" size={16} color="#fff" />
              <Text style={[styles.buttonText, { marginLeft: 6 }]}>
                Call HR
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Section */}
        <TouchableOpacity style={styles.helpCard}>
          <View>
            <Text style={styles.helpTitle}>Got help / Tell us what happened!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#D32F2F" />
        </TouchableOpacity>

        {/* Add Experience Section */}
        <View style={styles.experienceCard}>
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
          <Image
            style={styles.experienceImage}
            source={require('../../assets/images/depka.jpg')}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#999" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="briefcase-outline" size={24} color="#999" />
          <Text style={styles.navLabel}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="mail" size={24} color="#009ca4" />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>
            Responses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResponsesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },

  activeTab: {
    backgroundColor: '#FFF3E0',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },

  activeTabText: {
    color: '#FFA500',
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  applicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },

  bestJobBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8D6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },

  bestJobText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D76B42',
  },

  urgentBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  urgentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E63946',
  },

  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },

  infoText: {
    fontSize: 12.5,
    color: '#666',
    fontWeight: '500',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  avatarPlaceholder: {
    marginRight: 12,
  },

  statusText: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  statusTime: {
    fontSize: 11,
    color: '#999',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  similarJobsButton: {
    flex: 1,
    backgroundColor: '#E0F7F7',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#009ca4',
  },

  callHRButton: {
    flex: 1,
    backgroundColor: '#00BCC4',
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpCard: {
    backgroundColor: '#FFE8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F',
  },

  experienceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  experienceContent: {
    flex: 1,
  },

  experienceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },

  addExperienceButton: {
    backgroundColor: '#00BCC4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  addExperienceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  experienceImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },

  activeNavItem: {
    // Active styling
  },

  navLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },

  activeNavLabel: {
    color: '#009ca4',
  },
});