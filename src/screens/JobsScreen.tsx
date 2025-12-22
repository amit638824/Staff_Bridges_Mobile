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
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobRoles } from '../redux/slices/jobRoleSlice';
import { RootState,AppDispatch } from '../redux/store';
import { getJobBenefits } from '../services/jobBenefitsService';

import { 
  getApplyToJobs, 
  getSimilarJobs
} from '../services/homeJobsService'; // adjust path

import { 
  getRecruiterJobList,
  getRecruiterJobDetails,
  RecruiterJob 
} from '../services/jobService';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const JobsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [searchText, setSearchText] = useState('');
const [similarJobs, setSimilarJobs] = useState<any[]>([]);
const [bestJobs, setBestJobs] = useState<RecruiterJob[]>([]);
const [moreJobs, setMoreJobs] = useState<RecruiterJob[]>([]);
const [loading, setLoading] = useState(true);
const [jobImages, setJobImages] = useState<Record<number, string>>({});
const [totalJobsCount, setTotalJobsCount] = useState(0);
const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
const [jobBenefits, setJobBenefits] = useState<Record<number, string[]>>({});
const [modalVisible, setModalVisible] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
const route = useRoute<any>();

  // ✅ Make sure this function exists in the same scope
 const openJobApplicationModal = () => {
  setShowJobModal(true); // always opens the modal
};

const closeJobModal = () => {
  setShowJobModal(false);
};
const dispatch = useDispatch<AppDispatch>();
const {
  roles: exploreCategories,
  loading: categoriesLoading,
} = useSelector((state: RootState) => state.jobRoles);


useEffect(() => {
  if (route?.params?.searchQuery) {
    setSearchText(route.params.searchQuery);
  }
}, [route?.params?.searchQuery]);

useEffect(() => {
  dispatch(fetchJobRoles({ page: 1, limit: 10 }));
}, [dispatch]);

const filterBySearch = (jobs: RecruiterJob[]) => {
  if (!searchText.trim()) return jobs;

  const keyword = searchText.toLowerCase();

  return jobs.filter(job =>
    job.job_title_name?.toLowerCase().includes(keyword) ||
    job.company?.toLowerCase().includes(keyword) ||
    job.city_name?.toLowerCase().includes(keyword) ||
    job.locality_name?.toLowerCase().includes(keyword)
  );
};


interface UIJob {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
  isBestJob: boolean;
  originalJob: RecruiterJob;
}

useEffect(() => {
  const fetchSimilarJobs = async () => {
    try {
      const similarJobsRes = await getSimilarJobs();
      setSimilarJobs(similarJobsRes || []);
    } catch (err) {
      console.error('Similar jobs fetch error', err);
    }
  };

  fetchSimilarJobs();
}, []);

useEffect(() => {
  const loadBenefits = async () => {
    const allJobs = [...bestJobs, ...moreJobs];
    const benefitsData: Record<number, string[]> = {};

    await Promise.all(
      allJobs.map(async (job) => {
        const benefits = await getJobBenefits(job.job_id);
        benefitsData[job.job_id] = benefits;
      })
    );

    setJobBenefits(benefitsData);
  };

  if (bestJobs.length || moreJobs.length) {
    loadBenefits();
  }
}, [bestJobs, moreJobs]);

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const [bestJobsRes, allJobsRes] = await Promise.all([
        getApplyToJobs(),
        
        getRecruiterJobList(),
      ]);

      setBestJobs(bestJobsRes);
      setMoreJobs(allJobsRes);
      setTotalJobsCount(allJobsRes.length);
    } catch (err) {
      console.error('Job fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);


useEffect(() => {
  const preloadImages = async () => {
    const allJobs = [...bestJobs, ...moreJobs];

    for (const job of allJobs) {
      if (!jobImages[job.job_id]) {
        const details = await getRecruiterJobDetails(job.job_id);

        if (details && typeof details.companylogo === 'string') {
          setJobImages(prev => ({
            ...prev,
            [job.job_id]: details.companylogo as string,
          }));
        }
      }
    }
  };

  if (bestJobs.length || moreJobs.length) {
    preloadImages();
  }
}, [bestJobs, moreJobs]);


const getFilteredJobs = (jobs: RecruiterJob[]) => {
  let filtered = [...jobs];

  // 🔍 SEARCH FILTER
  if (searchText.trim()) {
    const keyword = searchText.toLowerCase();

    filtered = filtered.filter(job =>
      job.job_title_name?.toLowerCase().includes(keyword) ||
      job.company?.toLowerCase().includes(keyword) ||
      job.city_name?.toLowerCase().includes(keyword) ||
      job.locality_name?.toLowerCase().includes(keyword)
    );
  }

  // 🎯 CHIP FILTERS
  if (!selectedFilter) return filtered;

  switch (selectedFilter) {
    case t('jobs_filter_new'):
      return filtered.filter(job => isNewJob(job.created_at));

    case t('jobs_filter_high_paying'):
      return filtered.filter(job => Number(job.salary_max) >= 20000);

    case t('jobs_filter_part_time'):
      return filtered.filter(job => job.job_type === 'Part-time');

    case t('jobs_filter_education'):
      return filtered.filter(job => job.qualification === 'graduate');

    default:
      return filtered;
  }
};



const mapRecruiterJobToUI = (job: RecruiterJob): UIJob => ({
  id: job.job_id,
  title: job.job_title_name,
  company: job.company,
salary: `₹${parseInt(job.salary_min, 10)} - ₹${parseInt(job.salary_max, 10)} / Month`,
  location: `${job.locality_name}, ${job.city_name}`,
  isBestJob: true,
  originalJob: job,
});



const fetchJobImage = async (jobId: number) => {
  if (jobImages[jobId]) return;

  const details = await getRecruiterJobDetails(jobId);
  if (details?.companylogo) {
    setJobImages(prev => ({
      ...prev,
      [jobId]: details.companylogo!,
    }));
  }
};

const isNewJob = (createdAt: string) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInDays =
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

  return diffInDays <= 7;
};

const getJobNeedsCounts = (jobs: RecruiterJob[]) => {
  return {
    highPaying: jobs.filter(
      job => Number(job.salary_max) >= 20000
    ).length,

    newJobs: jobs.filter(
      job => isNewJob(job.created_at)
    ).length,

    graduateJobs: jobs.filter(
      job => job.qualification === 'graduate'
    ).length,

    workFromHome: jobs.filter(
      job => job.work_location === 'Work From Home'
    ).length,

    partTime: jobs.filter(
      job => job.job_type === 'Part-time'
    ).length,

    fieldJobs: jobs.filter(
      job => job.work_location === 'Field'
    ).length,
  };
};

const jobNeedsCounts = getJobNeedsCounts(moreJobs);

const isHighDemandJob = (job: RecruiterJob) => {
  // You can tweak this logic later
  return job.openings >= 5 || job.hiring_for_others === 1;
};


  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const filterChips = [t('jobs_filter_new'), t('jobs_filter_high_paying'), t('jobs_filter_part_time'), t('jobs_filter_education')];

const jobCategories = [
  {
    icon: 'trending-up',
    color: '#FFEBEE',
    iconColor: '#E91E63',
    title: t('jobs_category_high_paying'),
    subtitle: t('view_jobs', { count: jobNeedsCounts.highPaying }),
  },
  {
    icon: 'new-box',
    color: '#FFF4E5',
    iconColor: '#FF7043',
    title: t('jobs_category_new'),
    subtitle: t('view_jobs', { count: jobNeedsCounts.newJobs }),
  },
  {
    icon: 'school',
    color: '#E8F4FF',
    iconColor: '#2196F3',
    title: t('jobs_category_graduate'),
    subtitle: t('view_jobs', { count: jobNeedsCounts.graduateJobs }),
  },
  {
    icon: 'home',
    color: '#FFF8E1',
    iconColor: '#FFC107',
    title: t('jobs_category_work_from_home'),
    subtitle: t('view_jobs', { count: jobNeedsCounts.workFromHome }),
  },
  {
    icon: 'clock',
    color: '#E3F2FD',
    iconColor: '#2196F3',
    title: t('jobs_category_part_time'),
    subtitle: t('view_jobs', { count: jobNeedsCounts.partTime }),
  },
  {
    icon: 'road',
    color: '#E3F2FD',
    iconColor: '#4CAF50',
    title: t('jobs_category_field'),
    subtitle: t('view_jobs', { count: jobNeedsCounts.fieldJobs }),
  },
];



  const categoryChips = [
    t('jobs_chip_telesales'),
    t('jobs_chip_sales'),
    t('jobs_chip_digital_marketing'),
    t('jobs_chip_marketing'),
    t('jobs_chip_field_sales'),
  ];

  
 const renderJobTags = (job: RecruiterJob) => {
  const tags: { label: string; type: 'new' | 'vacancy' | 'demand' }[] = [];

  if (isNewJob(job.created_at)) {
    tags.push({ label: t('jobs_tag_new'), type: 'new' });
  }

  if (job.openings > 0) {
    tags.push({
      label: `${job.openings} ${t('jobs_tag_vacancies')}`,
      type: 'vacancy',
    });
  }

  if (isHighDemandJob(job)) {
    tags.push({ label: t('jobs_tag_high_demand'), type: 'demand' });
  }

  return (
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <View
          key={index}
          style={[
            styles.tag,
            {
              backgroundColor: tag.type === 'new' ? '#d9dfff' : '#fff',
              borderColor: tag.type === 'new' ? '#d9dfff' : '#ccc',
            },
          ]}
        >
          {tag.type === 'demand' && (
            <Icon name="flash-outline" size={10} color="#000" />
          )}

          <Text
            style={[
              styles.tagText,
              {
                color: tag.type === 'new' ? '#6c83ff' : '#979797',
                marginLeft: tag.type === 'demand' ? 2 : 0,
              },
            ]}
          >
            {tag.label}
          </Text>
        </View>
      ))}
    </View>
  );
};
 const handleJobCardPress = (job: UIJob) => {
  navigation.navigate('JobInfoScreen', {
    jobData: job.originalJob,
  });
};


const renderJobCard = (job: UIJob) => (
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
  source={
    jobImages[job.id]
      ? { uri: jobImages[job.id] }
      : require('../../assets/images/residential.png')
  }
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

{renderJobTags(job.originalJob)}

        <View style={styles.tagDivider} />

{jobBenefits[job.id] && jobBenefits[job.id].length > 0 && (
  <Text style={styles.pfText}>
    {jobBenefits[job.id].map(b => `${b} Provided`).join(' | ')}
  </Text>
)}
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
<Text style={styles.headerTitle}>
  {totalJobsCount} {t('jobs_header_title')} 
</Text>
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
  returnKeyType="search"
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
    <TouchableOpacity
      key={index}
      style={[
        styles.filterChipOption,
        selectedFilter === chip && styles.filterChipOptionActive,
      ]}
      onPress={() =>
        setSelectedFilter(selectedFilter === chip ? null : chip)
      }
    >
      <Text
        style={[
          styles.filterChipOptionText,
          selectedFilter === chip && styles.filterChipOptionTextActive,
        ]}
      >
        {chip}
      </Text>
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

{getFilteredJobs(bestJobs)
  .slice(0, 2)
  .map((job) => renderJobCard(mapRecruiterJobToUI(job)))}

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
{getFilteredJobs(bestJobs)
  .slice(2)
  .map((job) => renderJobCard(mapRecruiterJobToUI(job)))}
        </View>

        <View style={styles.moreJobsHeader}>
          <Icon name="arrow-forward-circle-outline" size={20} color="#2196F3" />
          <Text style={styles.moreJobsTitle}>{t('jobs_more_jobs_title')}</Text>
        </View>

{getFilteredJobs(moreJobs).map((job) =>
  renderJobCard({
    ...mapRecruiterJobToUI(job),
    isBestJob: false,
  })
)}

        <View style={styles.spaceContainer}></View>
<ViewedJobsSection jobs={similarJobs} onViewSimilar={openJobApplicationModal} />

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
    {categoriesLoading ? (
      <Text style={styles.chipText}>{t('loading')}</Text>
    ) : (
      exploreCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.chip}
          onPress={() =>
            navigation.navigate('JobsByCategoryScreen', {
              categoryId: category.id,
              categoryName: category.name,
            })
          }
        >
          <Text style={styles.chipText}>{category.name}</Text>
        </TouchableOpacity>
      ))
    )}
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
  filterChipOptionActive: {
  backgroundColor: '#0072BC',
},
filterChipOptionTextActive: {
  color: '#fff',
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