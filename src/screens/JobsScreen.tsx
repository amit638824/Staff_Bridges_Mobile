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
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const JobsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [searchText, setSearchText] = useState('');

  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const filterChips = [t('jobs_filter_new'), t('jobs_filter_distance'), t('jobs_filter_part_time'), t('jobs_filter_education')];

  const jobCategories = [
    {
      icon: 'trending-up',
      color: '#FFEBEE',
      iconColor: '#E91E63',
      title: t('jobs_category_high_paying'),
      subtitle: t('jobs_category_high_paying_count'),
    },
    {
      icon: 'new-box',
      color: '#FFF4E5',
      iconColor: '#FF7043',
      title: t('jobs_category_new'),
      subtitle: t('jobs_category_new_count'),
    },
    {
      icon: 'school',
      color: '#E8F4FF',
      iconColor: '#2196F3',
      title: t('jobs_category_graduate'),
      subtitle: t('jobs_category_graduate_count'),
    },
    {
      icon: 'home',
      color: '#FFF8E1',
      iconColor: '#FFC107',
      title: t('jobs_category_work_from_home'),
      subtitle: t('jobs_category_work_from_home_count'),
    },
    {
      icon: 'clock',
      color: '#E3F2FD',
      iconColor: '#2196F3',
      title: t('jobs_category_part_time'),
      subtitle: t('jobs_category_part_time_count'),
    },
    {
      icon: 'road',
      color: '#E3F2FD',
      iconColor: '#4CAF50',
      title: t('jobs_category_field'),
      subtitle: t('jobs_category_field_count'),
    },
  ];

  const categoryChips = [
    t('jobs_chip_telesales'),
    t('jobs_chip_sales'),
    t('jobs_chip_digital_marketing'),
    t('jobs_chip_marketing'),
    t('jobs_chip_field_sales'),
  ];

  const jobsData = [
    {
      id: 1,
      title: t('jobs_title_email_support'),
      company: 'RJS Tech Solutions',
      salary: t("job1_salary"),
      location: t('job_1_location'),
      badges: ['New', 'High Demand', 'Urgent Hiring'],
      isBestJob: true,
    },
    {
      id: 2,
      title: t('jobs_title_bpo_executive'),
      company: 'Prime Communications',
       salary: t("job2_salary"),
      location: t('job_2_location'),
      badges: ['Urgent Hiring'],
      isBestJob: true,
    },
    {
      id: 3,
      title: t('jobs_title_bpo_executive'),
      company: 'Prime Communications',
  salary: t("job3_salary"),
      location: t('job_3_location'),
      badges: ['Urgent Hiring'],
      isBestJob: true,
    },
    {
      id: 4,
      title: t('jobs_title_bpo_telecaller'),
      company: 'Sunshine Infotech',
 salary: t("job1_salary"),
      location: t('job_1_location'),
      badges: [],
      isBestJob: false,
    },
    {
      id: 5,
      title: t('jobs_title_hindi_telecaller'),
      company: 'Bright Minds Pvt Ltd',
 salary: t("job2_salary"),
      location: t('job_2_location'),
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
        {job.isBestJob && (
          <View style={styles.badgeRow}>
            <LinearGradient
              colors={['#ffe1cf', '#f9f4f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bestJobGradient}
            >
              <MaterialCommunityIcon name="star" size={10} color="#e59600" />
              <Text style={styles.bestJobText}>{t('jobs_best_job_badge')}</Text>
            </LinearGradient>

            <View style={styles.urgentBadge}>
              <MaterialCommunityIcon name="clock-outline" size={12} color="#d78b53" />
              <Text style={styles.urgentText}>{t('jobs_urgent_hiring')}</Text>
            </View>
          </View>
        )}

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

        <View style={styles.jobMetaRow}>
          <Icon name="briefcase-outline" size={12} color="#9E9E9E" />
          <Text style={styles.jobMeta}>{job.company}</Text>
        </View>

        <View style={styles.jobMetaRow}>
          <Icon name="location-outline" size={12} color="#9E9E9E" />
          <Text style={styles.jobMeta}>{job.location}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {[t('jobs_tag_new'), t('jobs_tag_vacancies'), t('jobs_tag_high_demand')].map((tag, index) => {
            const isNewJob = tag === t('jobs_tag_new');

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
                {tag === t('jobs_tag_high_demand') && (
                  <Icon name="flash-outline" size={10} color={!isNewJob ? '#000' : '#fff'} />
                )}

                <Text
                  style={[
                    styles.tagText,
                    {
                      color: isNewJob ? '#6c83ff' : '#979797',
                      marginLeft: tag === t('jobs_tag_high_demand') ? 2 : 0,
                    },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.tagDivider} />

        <Text style={styles.pfText}>{t('jobs_pf_provided')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <AppHeader
          location={t('jobs_header_title')}
          showLogo={false}
          showLocation={false}
          showBackArrow={true}
          onBackPressed={handleBackPress}
          customLeftWidget={
            <Text style={styles.headerTitle}>{t('jobs_header_title')}</Text>
          }
        />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('jobs_search_placeholder')}
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterChip}>
          <MaterialCommunityIcon
            name="filter-outline"
            size={14}
            color="#0072BC"
          />
          <Text style={[styles.filterChipText, { color: '#0072BC' }]}>
            {' '}{t('jobs_filter_button')}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ backgroundColor: '#fff6ec' }}>
          <View style={styles.bestJobCard}>
            <View style={styles.bestJobHeader}>
              <Icon name="star" size={18} color="#FFA500" />
              <Text style={styles.bestJobTitle}>{t('jobs_best_job_header')}</Text>
            </View>

            <View style={styles.bestJobContent}>
              <View style={styles.bestJobItem}>
                <View style={styles.bestJobItemContent}>
                  <View style={styles.bestJobItemRow}>
                    <Icon name="location-outline" size={18} color="#000" />
                    <Text style={styles.bestJobItemTitle}>{t('jobs_best_location')} {"\n"}<Text style={styles.bestJobItemSubtitle}>{t('jobs_best_you')}</Text>
</Text>
                  </View>
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
                    <Text style={styles.bestJobItemTitle}>{t('jobs_best_salary')} {"\n"}<Text style={styles.bestJobItemSubtitle}>{t('jobs_best_matching')}</Text></Text>
                  </View>
                  
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.bestJobItem}>
                <View style={styles.bestJobItemContent}>
                  <View style={styles.bestJobItemRow}>
                    <Icon name="thumbs-up" size={18} color="#000" />
                    <Text style={styles.bestJobItemTitle}>{t('jobs_best_experience')} {"\n"}<Text style={styles.bestJobItemSubtitle}>{t('jobs_best_matching')}</Text></Text>
                  </View>
                </View>
              </View>
            </View>

            <Image
              source={require('../../assets/images/phone_hand.png')}
              style={styles.bestJobImage}
            />
          </View>

          {jobsData.slice(0, 2).map((job) => renderJobCard(job))}

          <LinearGradient
            colors={['#d7dff1', '#9ab1e2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.experienceCard}
          >
            <View style={styles.experienceContent}>
              <Text style={styles.experienceTitle}>
                {t('jobs_experience_title')}
              </Text>
              <TouchableOpacity style={styles.addExperienceButton}>
                <Text style={styles.addExperienceText}>
                  {t('jobs_experience_button')}
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

        <View style={styles.moreJobsHeader}>
          <Icon name="arrow-forward-circle-outline" size={20} color="#2196F3" />
          <Text style={styles.moreJobsTitle}>{t('jobs_more_jobs_title')}</Text>
        </View>

        {jobsData.slice(3).map((job) => renderJobCard(job))}

        <View style={styles.spaceContainer}></View>
        <ViewedJobsSection />

        <View style={styles.jobsNeedsContainer}>
          <Text style={styles.jobsNeedsTitle}>{t('jobs_needs_title')}</Text>

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

        <View style={styles.exploreContainer}>
          <View style={styles.exploreHeader}>
            <Icon name="compass-outline" size={24} color="#0072BC" />
            <Text style={styles.exploreTitle}>{t('jobs_explore_title')}</Text>
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
    marginTop:scale(10)
  },
  headerTitle: {
    // fontSize: moderateScale(18) * 0.8,
        fontSize: scale(13.5), 
    fontWeight: '600',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(25) * 0.8,
    paddingHorizontal: scale(14) * 0.8,
    marginHorizontal: scale(16) * 0.8,
    marginVertical: verticalScale(12) * 0.8,
    borderWidth: scale(1) * 0.8,
    borderColor: '#ccc',
    shadowColor:'#0e0d0dff' ,
    shadowOpacity: 0.5,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: verticalScale(6) },
    elevation: 4,
  
  },
  spaceContainer: {
    marginBottom: verticalScale(20) * 0.8,
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(10) * 0.8,
    fontSize: moderateScale(14) * 0.8,
    color: '#000',
    paddingVertical: verticalScale(10) * 0.8,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    paddingVertical: verticalScale(10) * 0.8,
    marginBottom: verticalScale(15) * 0.8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: scale(12) * 0.8,
    paddingVertical: verticalScale(4) * 0.8,
    borderRadius: moderateScale(20) * 0.8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: scale(1) * 0.8,
    borderColor: '#ccc',
    marginRight: scale(8) * 0.8,
  },
  filterChipText: {
    fontSize: moderateScale(12) * 0.8,
    fontWeight: '600',
  },
  filterChipOption: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(12) * 0.8,
    paddingVertical: verticalScale(4) * 0.8,
    borderRadius: moderateScale(20) * 0.8,
    borderWidth: scale(1) * 0.8,
    borderColor: '#ccc',
    marginRight: scale(8) * 0.8,
  },
  filterChipOptionText: {
    fontSize: moderateScale(12) * 0.8,
    fontWeight: '600',
    color: '#666',
  },
  scrollContent: {
    paddingBottom: verticalScale(20) * 0.8,
  },
  bestJobCard: {
    backgroundColor: '#fff6ec',
    marginTop: verticalScale(16) * 0.8,
    marginBottom: 0,
    padding: scale(12) * 0.8,
    borderRadius: moderateScale(12) * 0.8,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    position: 'relative',
  },
  bestJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14) * 0.8,
      marginLeft: scale(8) * 0.8,
      
  },
  bestJobTitle: {
    fontSize: moderateScale(14) * 0.8,
    fontWeight: '700',
    marginLeft: scale(6) * 0.8,
    color: '#000',
  },
  bestJobContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
       marginLeft: scale(8) * 0.8,
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
  },
  bestJobItemTitle: {
    fontSize: moderateScale(13) * 0.8,
    fontWeight: '600',
    color: '#000',
    marginLeft: scale(4) * 0.8,
  },
  bestJobItemSubtitle: {
    fontSize: moderateScale(11) * 0.8,
    fontWeight: '500',
    color: '#999',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: scale(12) * 0.8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10) * 0.8,
    alignItems: 'center',
  },
  bestJobText: {
    fontSize: moderateScale(9) * 0.8,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bestJobGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10) * 0.8,
    paddingVertical: verticalScale(4) * 0.8,
    borderTopLeftRadius: moderateScale(20) * 0.8,
    borderBottomLeftRadius: moderateScale(20) * 0.8,
    alignSelf: 'flex-start',
    gap: scale(5) * 0.8,
  },
  salaryText: {
    fontSize: moderateScale(12) * 0.8,
    color: '#333',
    fontWeight: '500',
  },
  jobRow: {
    flexDirection: 'row',
    gap: scale(12) * 0.8,
    alignItems: 'flex-start',
    marginTop: verticalScale(5) * 0.8,
  },
  jobIcon: {
    width: scale(42) * 0.8,
    height: verticalScale(42) * 0.8,
    borderColor: '#e0e0e0',
    borderWidth: scale(1) * 0.8,
    borderRadius: moderateScale(4) * 0.8,
    padding: scale(6) * 0.8,
    resizeMode: 'contain',
    marginTop: verticalScale(2) * 0.8,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe8d7',
    paddingHorizontal: scale(8) * 0.8,
    paddingVertical: verticalScale(6) * 0.8,
    borderRadius: moderateScale(12) * 0.8,
    gap: scale(3) * 0.8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: scale(-13) * 0.8,
  },
  urgentText: {
    fontSize: moderateScale(10) * 0.8,
    fontWeight: '600',
    color: '#d78b53',
  },
  divider: {
    width: scale(1) * 0.8,
    height: verticalScale(30) * 0.8,
    backgroundColor: '#FFA500',
    marginHorizontal: scale(4) * 0.8,
  },
  bestJobImage: {
    position: 'absolute',
    right: scale(4) * 0.8,
    top: verticalScale(-15) * 0.8,
    width: scale(120) * 0.8,
    height: verticalScale(120) * 0.8,
    resizeMode: 'contain',
  },
  jobCard: {
    backgroundColor: '#fff',
    marginHorizontal: scale(16) * 0.8,
    marginVertical: verticalScale(8) * 0.8,
    borderRadius: moderateScale(14) * 0.8,
    padding: scale(12) * 0.8,
    shadowColor:'#81b5e6ff',
    shadowOpacity: 0.6,
    shadowRadius: moderateScale(10) * 0.8,
    shadowOffset: { width: scale(8) * 0.8, height: verticalScale(8) * 0.8 },
    elevation: 15,
    marginBottom: verticalScale(20) * 0.8,
    borderColor: '#bdc9d6',
    borderWidth: scale(0.5) * 0.8,
  },
  jobTitle: {
    fontSize: moderateScale(15) * 0.8,
    fontWeight: '700',
    color: '#000',
    marginBottom: verticalScale(4) * 0.8,
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6) * 0.8,
    paddingHorizontal: scale(4) * 0.8,
  },
  jobMeta: {
    fontSize: moderateScale(12) * 0.8,
    color: '#9E9E9E',
    marginLeft: scale(6) * 0.8,
  },
  experienceCard: {
    borderRadius: moderateScale(12) * 0.8,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    padding: scale(14) * 0.8,
    marginHorizontal: scale(16) * 0.8,
    marginBottom: verticalScale(20) * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#e7ebf4',
  },
  experienceContent: {
    flex: 1,
    paddingRight: scale(10) * 0.8,
  },
  experienceTitle: {
    fontSize: moderateScale(16) * 0.8,
    fontWeight: '800',
    marginBottom: verticalScale(12) * 0.8,
    marginLeft: scale(4) * 0.8,
    lineHeight: verticalScale(18) * 0.8,
  },
  addExperienceButton: {
    backgroundColor: AppColors.buttons,
    paddingHorizontal: scale(14) * 0.8,
    paddingVertical: verticalScale(8) * 0.8,
    borderRadius: moderateScale(30) * 0.8,
    alignSelf: 'flex-start',
  },
  addExperienceText: {
    fontSize: moderateScale(13) * 0.8,
    fontWeight: '600',
    color: '#fff',
  },
  experienceImageContainer: {
    position: 'relative',
  },
  experienceImage: {
    width: scale(70) * 0.8,
    height: verticalScale(60) * 0.8,
    // borderRadius: moderateScale(8) * 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(10) * 0.8,
    paddingHorizontal: scale(4) * 0.8,
  },
  tag: {
    flexDirection: 'row',
    paddingHorizontal: scale(10) * 0.8,
    paddingVertical: verticalScale(5) * 0.8,
    borderRadius: moderateScale(5) * 0.8,
    borderWidth: scale(1) * 0.8,
    alignItems: 'center',
    marginRight: scale(6) * 0.8,
  },
  tagText: {
    fontSize: moderateScale(11) * 0.8,
    fontWeight: '600',
  },
  tagDivider: {
    height: verticalScale(1) * 0.8,
    backgroundColor: '#e0e0e0',
    marginVertical: verticalScale(10) * 0.8,
  },
  pfText: {
    fontSize: moderateScale(11) * 0.8,
    fontWeight: '500',
    color: '#999',
    paddingHorizontal: scale(4) * 0.8,
  },
  moreJobsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(16) * 0.8,
    marginVertical: verticalScale(12) * 0.8,
  },
  moreJobsTitle: {
    fontSize: moderateScale(16) * 0.8,
    fontWeight: '700',
    color: '#000',
    marginLeft: scale(8) * 0.8,
  },
  jobsNeedsContainer: {
    marginTop: verticalScale(0) * 0.8,
    marginBottom: verticalScale(20) * 0.8,
    padding: scale(16) * 0.8,
    backgroundColor: '#e7ebff',
  },
  jobsNeedsTitle: {
    fontSize: moderateScale(16) * 0.8,
    fontWeight: '700',
    color: '#000',
    marginLeft: scale(8) * 0.8,
    marginBottom: verticalScale(12) * 0.8,
  },
  categoryColumn: {
    flexDirection: 'column',
    marginRight: scale(12) * 0.8,
    marginLeft: scale(6) * 0.8,
  },
  categoryCard: {
    width: scale(200) * 0.8,
    padding: scale(12) * 0.8,
    backgroundColor: '#fff',
    borderRadius: moderateScale(5) * 0.8,
    marginBottom: verticalScale(12) * 0.8,
    shadowRadius: moderateScale(4) * 0.8,
    shadowOffset: { width: 0, height: verticalScale(2) * 0.8 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10) * 0.8,
  },
  categoryTitle: {
    fontSize: moderateScale(14) * 0.8,
    fontWeight: '700',
    marginEnd: scale(4) * 0.8,
    color: '#000',
  },
  categorySubtitle: {
    fontSize: moderateScale(11) * 0.8,
    color: '#555',
    marginTop: verticalScale(2) * 0.8,
  },
  exploreContainer: {
    marginHorizontal: scale(16) * 0.8,
    marginTop: verticalScale(0) * 0.8,
  },
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12) * 0.8,
  },
  exploreTitle: {
    fontSize: moderateScale(16) * 0.8,
    fontWeight: '700',
    color: '#000',
    marginLeft: scale(8) * 0.8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(20) * 0.8,
    paddingHorizontal: scale(12) * 0.8,
    paddingVertical: verticalScale(8) * 0.8,
    borderWidth: scale(1) * 0.8,
    borderColor: '#ccc',
    marginRight: scale(8) * 0.8,
    marginBottom: verticalScale(8) * 0.8,
  },
  chipText: {
    fontSize: moderateScale(12) * 0.8,
    color: '#666',
    fontWeight: '500',
  },
});