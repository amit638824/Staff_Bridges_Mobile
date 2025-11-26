import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import LinearGradient from 'react-native-linear-gradient';
import { AppColors } from '../constants/AppColors';
import ViewedJobsSection from '../components/ViewedJobSection';

const { width } = Dimensions.get('window');

const JobsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [searchText, setSearchText] = useState('');

  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const filterChips = ['New Jobs +', 'Within 10 KMs +', 'Part Time +', 'Post Graduation +'];

  const jobCategories = [
    {
      icon: 'trending-up',
      color: '#FFEBEE',
      iconColor: '#E91E63',
      title: 'High Paying Jobs',
      subtitle: 'View 193 Jobs',
    },
    {
      icon: 'fiber-new',
      color: '#FFF4E5',
      iconColor: '#FF7043',
      title: 'New Jobs',
      subtitle: 'View 43 Jobs',
    },
    {
      icon: 'school',
      color: '#E8F4FF',
      iconColor: '#2196F3',
      title: 'Graduate Jobs',
      subtitle: 'View 74 Jobs',
    },
    {
      icon: 'home',
      color: '#FFF8E1',
      iconColor: '#FFC107',
      title: 'Work From Home',
      subtitle: 'View 40 Jobs',
    },
    {
      icon: 'time',
      color: '#E3F2FD',
      iconColor: '#2196F3',
      title: 'Part Time Jobs',
      subtitle: 'View 43 Jobs',
    },
    {
      icon: 'road',
      color: '#E3F2FD',
      iconColor: '#4CAF50',
      title: 'Field Job',
      subtitle: 'View 8 Jobs',
    },
  ];

  const categoryChips = [
    'Telesales / Telemarketing',
    'Sales / Business Development',
    'Digital Marketing',
    'Marketing',
    'Field Sales',
  ];

  // Job data structure
  const jobsData = [
    {
      id: 1,
      title: 'Email & Chat Support Executive',
      company: 'RJS Tech Solutions',
      salary: '₹15,000 - ₹20,000 / month',
      location: 'Lucknow, Uttar Pradesh',
      badges: ['New', 'High Demand', 'Urgent Hiring'],
      isBestJob: true,
    },
    {
      id: 2,
      title: 'International BPO Executive',
      company: 'Prime Communications',
      salary: '₹20,000 - ₹28,000 / month',
      location: 'Lucknow, Uttar Pradesh',
      badges: ['Urgent Hiring'],
      isBestJob: true,
    },
    {
      id: 3,
      title: 'International BPO Executive',
      company: 'Prime Communications',
      salary: '₹20,000 - ₹28,000 per month',
      location: 'Lucknow, Uttar Pradesh',
      badges: ['Urgent Hiring'],
      isBestJob: true,
    },
    {
      id: 4,
      title: 'BPO Telecaller',
      company: 'Sunshine Infotech',
      salary: '₹12,000 - ₹18,000 per month',
      location: 'Lucknow, Uttar Pradesh',
      badges: [],
      isBestJob: false,
    },
    {
      id: 5,
      title: 'Hindi Telecaller',
      company: 'Bright Minds Pvt Ltd',
      salary: '₹10,000 - ₹14,000 per month',
      location: 'Lucknow, Uttar Pradesh',
      badges: [],
      isBestJob: false,
    },
  ];

  const handleJobCardPress = (job: typeof jobsData[0]) => {
    navigation.navigate('JobInfoScreen', {
      jobData: job,
    });
  };

  const renderJobCard = (job: typeof jobsData[0]) => (
    <TouchableOpacity 
      key={job.id}
      onPress={() => handleJobCardPress(job)}
    >
      <View style={styles.jobCard}>
        {/* Top Row - Best Job Tag */}
        {job.isBestJob && (
          <View style={styles.badgeRow}>
            <LinearGradient
              colors={['#ffe1cf', '#f9f4f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bestJobGradient}
            >
              <MaterialCommunityIcon name="star" size={10} color="#e59600" />
              <Text style={styles.bestJobText}>BEST JOB FOR YOU</Text>
            </LinearGradient>

            <View style={styles.urgentBadge}>
              <MaterialCommunityIcon name="clock-outline" size={12} color="#d78b53" />
              <Text style={styles.urgentText}>Urgent Hiring</Text>
            </View>
          </View>
        )}

        {/* Job + Image Section */}
        <View style={styles.jobRow}>
          <Image
            source={require('../../assets/images/residential.png')}
            style={styles.jobIcon}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.salaryText}>{job.salary}</Text>
          </View>
        </View>

        {/* Company */}
        <View style={styles.jobMetaRow}>
          <Icon name="briefcase-outline" size={12} color="#9E9E9E" />
          <Text style={styles.jobMeta}>{job.company}</Text>
        </View>

        {/* Location */}
        <View style={styles.jobMetaRow}>
          <Icon name="location-outline" size={12} color="#9E9E9E" />
          <Text style={styles.jobMeta}>{job.location}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {['New Job', '80 Vacancies', 'High Demand'].map((tag, index) => {
            const isNewJob = tag === 'New Job';

            return (
              <View
                key={index}
                style={[
                  styles.tag,
                  {
                    backgroundColor: isNewJob ? '#d9dfff' : '#fff',
                    borderColor: isNewJob ? '#d9dfff' : '#ccc',
                  },
                ]}
              >
                {tag === 'High Demand' && (
                  <Icon name="flash-outline" size={10} color={!isNewJob ? '#000' : '#fff'} />
                )}

                <Text
                  style={[
                    styles.tagText,
                    {
                      color: isNewJob ? '#6c83ff' : '#979797',
                      marginLeft: tag === 'High Demand' ? 2 : 0,
                    },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Divider */}
        <View style={styles.tagDivider} />

        {/* PF Provided */}
        <Text style={styles.pfText}>PF Provided</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <AppHeader
          location="277 jobs near you"
          showLogo={false}
          showLocation={false}
          showBackArrow={true}
          onBackPressed={handleBackPress}
          customLeftWidget={
            <Text style={styles.headerTitle}>277 jobs near you</Text>
          }
        />
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs here.."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterChip}>
          <MaterialCommunityIcon
            name="filter-outline"
            size={14}
            color="#0072BC"
          />
          <Text style={[styles.filterChipText, { color: '#0072BC' }]}>
            {' '}
            Filter (1)
          </Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {filterChips.map((chip, index) => (
            <TouchableOpacity key={index} style={styles.filterChipOption}>
              <Text style={styles.filterChipOptionText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
     <View style={{ backgroundColor: '#fff6ec' }}>
  <View style={styles.bestJobCard}>
          <View style={styles.bestJobHeader}>
            <Icon name="star" size={16} color="#FFA500" />
            <Text style={styles.bestJobTitle}>BEST JOB FOR YOU</Text>
          </View>

          <View style={styles.bestJobContent}>
            <View style={styles.bestJobItem}>
              <View style={styles.bestJobItemContent}>
                <View style={styles.bestJobItemRow}>
                  <Icon name="location-outline" size={18} color="#000" />
                  <Text style={styles.bestJobItemTitle}>Near</Text>
                </View>
                <Text style={styles.bestJobItemSubtitle}>You</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bestJobItem}>
              <View style={styles.bestJobItemContent}>
                <View style={styles.bestJobItemRow}>
                  <MaterialCommunityIcon
                    name="currency-inr"
                    size={18}
                    color="#000"
                  />
                  <Text style={styles.bestJobItemTitle}>Salary</Text>
                </View>
                <Text style={styles.bestJobItemSubtitle}>Matching</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bestJobItem}>
              <View style={styles.bestJobItemContent}>
                <View style={styles.bestJobItemRow}>
                  <Icon name="thumbs-up" size={18} color="#000" />
                  <Text style={styles.bestJobItemTitle}>Experience</Text>
                </View>
                <Text style={styles.bestJobItemSubtitle}>Matching</Text>
              </View>
            </View>
          </View>

          <Image
            source={require('../../assets/images/phone_hand.png')}
            style={styles.bestJobImage}
          />
        </View>

        {/* Job Cards */}
    {/* First two job cards */}
  {jobsData.slice(0, 2).map((job) => renderJobCard(job))}

        {/* Add Experience Section with Blue Gradient */}
        <LinearGradient
          colors={['#d7dff1', '#9ab1e2']}
          start={{ x: 0, y: 0 }}
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
  {renderJobCard(jobsData[2])}
  </View>
        {/* More Jobs For You */}
        <View style={styles.moreJobsHeader}>
          <Icon name="arrow-forward-circle-outline" size={20} color="#2196F3" />
          <Text style={styles.moreJobsTitle}>More Jobs For You</Text>
        </View>

        {jobsData.slice(3).map((job) => renderJobCard(job))}

        <View style={styles.spaceContainer}></View>
        <ViewedJobsSection />

        {/* Jobs for all your needs */}
        <View style={styles.jobsNeedsContainer}>
          <Text style={styles.jobsNeedsTitle}>Jobs for all your needs</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {Array.from({ length: Math.ceil(jobCategories.length / 2) }, (_, i) => {
              const pair = jobCategories.slice(i * 2, i * 2 + 2);

              return (
                <View key={i} style={styles.categoryColumn}>
                  {pair.map((category, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.categoryCard]}
                    >
                      <View style={styles.row}>
                        <MaterialCommunityIcon
                          name={category.icon}
                          size={24}
                          color={category.iconColor}
                        />
                        <View>
                          <Text style={styles.categoryTitle}>{category.title}</Text>
                          <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Explore jobs in other categories */}
        <View style={styles.exploreContainer}>
          <View style={styles.exploreHeader}>
            <Icon name="compass-outline" size={24} color="#0072BC" />
            <Text style={styles.exploreTitle}>Explore jobs in other categories</Text>
          </View>

          <View style={styles.chipsContainer}>
            {categoryChips.map((chip, index) => (
              <TouchableOpacity key={index} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />
    </SafeAreaView>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  spaceContainer: {
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    paddingVertical: 10,
    marginBottom: 15,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipOption: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  filterChipOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bestJobCard: {
    backgroundColor: '#fff6ec',
    marginTop: 16,
    marginBottom: 0,
    padding: 12,
    borderRadius: 12,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    position: 'relative',
  },
  bestJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bestJobTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    color: '#000',
  },
  bestJobContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },
  bestJobItem: {
    alignItems: 'center',
  },
  bestJobItemContent: {
    alignItems: 'center',
  },
  bestJobItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 2,
  },
  bestJobItemTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  bestJobItemSubtitle: {
    fontSize: 9,
    fontWeight: '500',
    color: '#999',
    alignItems: 'center',
    alignSelf: 'center',
    // marginTop: 1,
    marginLeft: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  bestJobText: {
    fontSize: 9,
    fontWeight: '700',
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
  salaryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
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
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#FFA500',
    marginHorizontal: 4,
  },
  bestJobImage: {
    position: 'absolute',
    right: 4,
    top: -15,
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  jobCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    padding: 12,
    shadowColor:'#81b5e6ff',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 8, height: 8 },
    elevation: 10,
    marginBottom: 20,
    borderColor: '#bdc9d6',
    borderWidth: 0.5,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  jobMeta: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 6,
  },
  experienceCard: {
    borderRadius: 12,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    borderTopColor: '#e7ebf4',
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 4,
  },
  experienceContent: {
    flex: 1,
    paddingRight: 10,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '800',
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
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  tag: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  pfText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999',
    paddingHorizontal: 4,
  },
  moreJobsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  moreJobsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginLeft: 8,
  },
  jobsNeedsContainer: {
    marginTop: 15,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#e7ebff',
  },
  jobsNeedsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginLeft: 8,
    marginBottom: 12,
  },
  categoryColumn: {
    flexDirection: 'column',
    marginRight: 12,
    marginLeft:6
  },
  categoryCard: {
    width: 200,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginEnd: 4,
    color: '#000',
  },
  categorySubtitle: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
  },
  exploreContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginLeft: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});