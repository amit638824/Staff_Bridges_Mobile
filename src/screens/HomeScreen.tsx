import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AppFooter from '../components/AppFooter';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../components/AppHeader';
import JobSuggestionSection from '../components/JobSuggestionSection';
import ViewedJobsSection from '../components/ViewedJobSection';
import JobApplicationModal from '../components/JobApplicationModal';
import { AppColors } from '../constants/AppColors';
import App from '../../App';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { useTranslation } from 'react-i18next'; // Import i18n hook

const { width } = Dimensions.get('window');

// IMAGE CONSTANTS
const IMAGES = {
  logo: require('../../assets/images/logo-removebg-preview.png'),
  designer: require('../../assets/images/depka.jpg'),
  girlMobile: require('../../assets/images/girlwithmobile-removebg-preview.png'),

  wallet: require('../../assets/images/wallet(1).png'),
  home: require('../../assets/images/home(1).png'),
  books: require('../../assets/images/stack-of-books.png'),
  bell: require('../../assets/images/notification-bell.png'),

  category1: require('../../assets/images/depka.jpg'),
  category2: require('../../assets/images/depka.jpg'),

  avatar1: require('../../assets/images/depka.jpg'),
  avatar2: require('../../assets/images/depka.jpg'),
  avatar3: require('../../assets/images/depka.jpg'),

  video1: require('../../assets/images/depka.jpg'),
  video2: require('../../assets/images/depka.jpg'),
  video3: require('../../assets/images/depka.jpg'),
};

const HomeScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showJobModal, setShowJobModal] = useState(false);
  const isMountedRef = useRef(false);

  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

useEffect(() => {
  const comingFromJobInfo = route?.params?.fromJobInfo === true;

  if (comingFromJobInfo && !isMountedRef.current) {
    setTimeout(() => {
      setShowJobModal(true);
    }, 500);
  }

  isMountedRef.current = true;

  // Remove navigation.setParams completely
  // return () => {
  //   if (navigation?.setParams) {
  //     navigation.setParams({ fromJobInfo: false });
  //   }
  // };
}, [route?.params?.fromJobInfo]);



  return (
    <>
      <SafeAreaView 
        style={{ flex: 1, backgroundColor: "#fff" }} 
        pointerEvents={showJobModal ? "none" : "auto"}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

         <AppHeader 
  location="location_dewa_road"
  onNotificationTap={() => console.log("Notifications tapped")}
/>

        <View style={styles.fixedTopContainer}>
          <View style={styles.resumeCard}>
            <Ionicons name="information-circle-outline" size={22}  />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.resumeTitle}>{t('home_resume_add')}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.resumeLink}>{t('home_resume_add_now')}</Text>
            </TouchableOpacity>
            <Ionicons name="close" size={18} color="#999" style={{marginEnd:10}} />
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder={t('home_search_placeholder')}
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 0 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 18, marginTop: 0 }}>
            <Text style={styles.subGreetingText}>{t('home_greeting_hey', { name: 'Asmit' })}</Text>
            <Text style={styles.subGreetingText}>{t('home_greeting_jobs_waiting')}</Text>
          </View>

          <View style={styles.bannerCard}>
            <View style={styles.bannerHeader}>
              <Image source={IMAGES.logo} style={styles.bannerLogo} />
              <Ionicons name="close" size={18} color="#999" />
            </View>

            <View style={styles.bannerContent}>
              <View style={styles.bannerTextSection}>
                <Text style={styles.bannerSubtitle}>{t('home_banner_subtitle')}</Text>
                <Text style={styles.bannerTitle}>{t('home_banner_title')}</Text>
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>{t('home_banner_apply_now')}</Text>
                </TouchableOpacity>
              </View>

              <Image source={IMAGES.designer} style={styles.bannerImage} />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={{ marginStart:15, fontWeight: '500', fontSize: 14, marginBottom: 12 }}>{t('home_apply_jobs_section')}</Text>

            <TouchableOpacity style={{ flexDirection: 'row', marginEnd: 10 }}>
              <Text style={styles.viewAll}>{t('home_view_all')}</Text>
              <Ionicons name="chevron-forward" size={15} style={{ marginRight: 10,}} color={AppColors.themeColor} />
            </TouchableOpacity>
          </View>

          <JobSuggestionSection />

          <View style={styles.dotsContainerJobSuggestion}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.dotJobSuggestion,
                  {
                    width: index === 0 ? 24 : 6,
                  },
                ]}
              />
            ))}
          </View>

          <ViewedJobsSection />

          <View style={styles.gridContainer}>
            <Text style={{ width: '100%', fontWeight: '500', fontSize: 14, marginBottom: 12 }}>{t('home_jobs_needs_title')}</Text>
            {renderNeedCard(IMAGES.wallet, t('home_jobs_high_paying'), t('home_jobs_high_paying_count'))}
            {renderNeedCard(IMAGES.home, t('home_jobs_work_from_home'), t('home_jobs_work_from_home_count'))}
            {renderNeedCard(IMAGES.books, t('home_jobs_graduate'), t('home_jobs_graduate_count'))}
            {renderNeedCard(IMAGES.bell, t('home_jobs_new'), t('home_jobs_new_count'))}

            <View style={styles.dotsContainerNeeds}>
              {[0, 1, 2].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.dotNeeds,
                    {
                      width: index === 0 ? 24 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <VideosSection />

          <ReferFriendSection />

          <Text style={videoStyles.sectionTitle}>{t('home_nearby_jobs_title')}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            <View style={{flexDirection:'row',padding:10}}>
         <NearbyAreaCard 
  distance={t('nearby_distance_km', { km: 2.1 })}
  area="nearby_area_gurugram"
  jobs={t('nearby_jobs_count', { count: 45 })}
/>

<NearbyAreaCard 
  distance={t('nearby_distance_km', { km: 3.5 })}
  area="nearby_area_vibhuti"
  jobs={t('nearby_jobs_count', { count: 30 })}
/>

<NearbyAreaCard 
  distance={t('nearby_distance_km', { km: 3.5 })}
  area="nearby_area_hazratganj"
  jobs={t('nearby_jobs_count', { count: 30 })}
/>

            </View>
          </ScrollView>

          <RateExperienceSection />

          <View style={styles.container}>
            {SuccessStoriesSection()}
          </View>
        </ScrollView>

        {!showJobModal && <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />}
      </SafeAreaView>

      {showJobModal && (
        <JobApplicationModal
          visible={showJobModal}
          onClose={() => setShowJobModal(false)}
          onApplyNow={() => setShowJobModal(false)}
          onNotNow={() => setShowJobModal(false)}
        />
      )}
    </>
  );
};

const renderNeedCard = (image: any, title: string, subtitle: string, highlight = false) => (
  <View style={[styles.needCard, highlight && styles.highlightCard]}>
    <Image source={image} style={styles.needImage} />
    <Text style={styles.needTitle}>{title}</Text>
    <Text style={styles.needSubtitle}>{subtitle}</Text>
  </View>
);

const VideosSection = () => {
  const { t } = useTranslation();
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  const videos = [
    {
      id: 1,
      image: require('../../assets/images/cs_and_telecler.jpg'),
      title: t('role_customer_support'),
      jobs:t('nearby_jobs_count', { count: 268 })
    },
    {
      id: 2,
      image: require('../../assets/images/sales-job.jpg'),
      title: t('role_sales_bd'),
      jobs:t('nearby_jobs_count', { count: 286 })
    },
    {
      id: 3,
      image: require('../../assets/images/depka.jpg'),
       title: t('role_customer_support'),
      jobs:t('nearby_jobs_count', { count: 100 })
    },
  ];

  const buildCategoryCard = (item: any) => (
    <TouchableOpacity key={item.id} style={videoStyles.categoryCard}>
      <View style={videoStyles.imageContainer}>
        <Image source={item.image} style={videoStyles.categoryImage} />
      </View>

      <View style={videoStyles.categoryContent}>
        <View style={videoStyles.jobsRow}>
          <Text style={videoStyles.jobsText}>{item.jobs}</Text>
          <Icon name="chevron-forward-outline" size={10} color={AppColors.buttons} />
        </View>
        <Text style={videoStyles.categoryTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={videoStyles.container}>
      <Text style={videoStyles.sectionTitle}>{t('home_videos_section')}</Text>

      <View style={videoStyles.backgroundContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={videoStyles.scrollContent}
        >
          {videos.map((video) => buildCategoryCard(video))}
        </ScrollView>
      </View>

      <View style={videoStyles.dotsContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              videoStyles.dot,
              {
                width: index === selectedJobIndex ? 24 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const SuccessStoriesSection = () => {
  const { t } = useTranslation();
  
  return (
    <View style={{ marginTop: 10,}}>
      <ImageBackground
        source={require('../../assets/images/success-bg.jpg')}
        style={styles.containerImage}
        resizeMode="cover"
      >
        <View style={styles.iconBorder}>
          <Image
            source={require('../../assets/images/clapping.png')}
            style={styles.iconImage}
          />
        </View>

        <Text style={styles.title}>
          <Text style={styles.titleBlack}>{t('home_success_stories_title_black')}</Text>
          <Text style={styles.titleTeal}> {t('home_success_stories_title_teal')}</Text>
        </Text>

        <View style={styles.avatarRow}>
          <Image source={require('../../assets/images/depka.jpg')} style={styles.avatar} />
          <Image source={require('../../assets/images/mikes.jpg')} style={styles.avatar} />
          <Image source={require('../../assets/images/soni.jpg')} style={styles.avatar} />
        </View>

  <Text style={styles.description}>
  {t('home_success_names')}
  {"\n"}
  {t('home_success_got')}{" "}
  <Text style={styles.highlightText}>
    {t('home_success_highlight')}
  </Text>{" "}
  {t('home_success_by_hr')}
  {"\n"}
  {t('home_success_footer')}
</Text>


      </ImageBackground>
    </View> 
  );
};

interface NearbyAreaCardProps {
  distance: string;
  area: string;
  jobs: string;
}

const NearbyAreaCard: React.FC<NearbyAreaCardProps> = ({ distance, area, jobs }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.badgeContainer}>
        <Icon name="location-sharp" size={14} color="#d78b54" />
        <Text style={styles.badgeText}>{t(distance)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.areaText}>{t(area)}</Text>

        <View style={styles.row}>
          <Text style={styles.jobsText}>{t(jobs)}</Text>
          <Icon name="chevron-forward" size={12} color="teal" />
        </View>
      </View>
    </View>
  );
};


const RateExperienceSection = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);

  return (
    <View style={rateStyles.container}>
      <Text style={rateStyles.title}>{t('home_rate_experience')}</Text>

      <View style={rateStyles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome
              name={star <= rating ? "star" : "star-o"}
              size={30}
              color={star <= rating ? "#FFC107" : "#C4C4C4"}
              style={{ marginHorizontal: 6 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={rateStyles.trustRow}>
        <MaterialCommunityIcon name="shield" size={18} color="#666" />
        <Text style={rateStyles.trustText}>
          {t('home_trust_text')}
        </Text>
      </View>
    </View>
  );
};

const ReferFriendSection = () => {
  const { t } = useTranslation();
  
  return (
    <View style={referStyles.wrapper}>
      <View style={referStyles.card}>
        <Text style={referStyles.text}>
          {t('home_refer_friend_text')}
        </Text>

        <TouchableOpacity style={referStyles.button}>
          <Icon name="logo-whatsapp" size={18} color="#fff" />
          <Text style={referStyles.buttonText}>{t('home_refer_button')}</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../../assets/images/girlwithmobile-removebg-preview.png')}
        style={referStyles.girlImage}
      />
    </View>
  );
};

export default HomeScreen;

// MAIN STYLES
const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#fff'
  },
  containerImage: {
    padding: scale(12)
  },
  bannerCard: { 
    marginTop: verticalScale(8), 
    marginBottom: verticalScale(20), 
    backgroundColor: AppColors.cardBg 
  },
  bannerLogo: { 
    width: scale(40), 
    height: scale(40), 
    resizeMode: 'contain' 
  },
  bannerImage: { 
    width: scale(80), 
    height: verticalScale(86), 
    resizeMode: 'contain',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    marginRight: scale(16),

  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scale(12),
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardLightBg,
    padding: scale(10),
    marginTop: verticalScale(4),
  },
  resumeTitle: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: '#000',
  },
  resumeLink: {
    fontSize: moderateScale(11),
    marginEnd: scale(4),
    color: AppColors.themeColor,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop: verticalScale(8),
  },
  viewAll: {
    color: AppColors.themeColor,
    fontSize: moderateScale(11),
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(22),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(1),
    marginHorizontal: scale(12),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(1),
    borderWidth: scale(1.5),
    borderColor: '#CCCCCC',
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(4),
    fontSize: moderateScale(12),
    color: '#000',
  },
  greetingText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#000',
  },
  subGreetingText: {
    fontSize: moderateScale(11),
    marginTop: verticalScale(2),
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bannerTextSection: {
    flex: 1,
    marginRight: scale(8),
    marginLeft: scale(4),
  },
  bannerSubtitle: {
    fontSize: moderateScale(13),
    color: '#666',
    marginStart: scale(8),
    marginBottom: verticalScale(2),
  },
  bannerTitle: {
    fontSize: moderateScale(11),
    marginStart: scale(8),
    fontWeight: '500',
    color: '#000',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(15),
  },
  bannerButton: {
    backgroundColor: AppColors.buttons,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    marginStart: scale(8),
    // marginBottom: verticalScale(16),
    borderRadius: scale(18),
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: moderateScale(12),
  },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    padding: scale(12),
    backgroundColor: AppColors.cardLightBg,
    marginTop: verticalScale(8)
  },
  needCard: { 
    width: '48%', 
    backgroundColor: '#fff', 
    padding: scale(12), 
    borderRadius: scale(10), 
    marginBottom: verticalScale(8), 
    alignItems: 'center',
  shadowColor: AppColors.primary ,
    shadowOpacity: 0.5,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: verticalScale(6) },
    elevation: 6,
    //     elevation: 1,
    // shadowOpacity: 0.1,
    // shadowRadius: 0,
    // shadowOffset: { width: 0, height: verticalScale(1) },
  },
  needImage: { 
    width: scale(32), 
    height: scale(32), 
    marginBottom: verticalScale(8) 
  },
  needTitle: { 
    fontWeight: 'bold', 
    fontSize: moderateScale(12) 
  },
  needSubtitle: { 
    color: '#777', 
    marginTop: verticalScale(2) 
  },
  highlightCard: { 
    borderWidth: scale(1), 
    borderColor: '#099', 
    backgroundColor: '#e0f7fa' 
  },
  iconBorder: {
    padding: scale(3),
    borderRadius: scale(45),
    height: scale(50),
    alignContent: 'center',
    width: scale(50),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(1.5),
    borderColor: AppColors.gradientDark,
  },
  iconImage: {
    width: scale(40),
    height: scale(40),
  },
  title: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  titleBlack: {
    color: '#000',
    fontWeight: '600',
  },
  titleTeal: {
    color: AppColors.themeColor,
    fontWeight: '700',
  },
  avatarRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  avatar: {
    width: scale(30),
    alignSelf: 'center',
    height: scale(30),
    borderRadius: scale(15),
    marginHorizontal: scale(-2),
  },
   highlightText: {
    color: AppColors.themeColor,
       marginTop: verticalScale(10),
    fontSize: moderateScale(12),
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  description: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(12),
    textAlign: 'center',
    color: '#000',
    lineHeight: moderateScale(18),
  },
  card: {
    width: scale(130),
    backgroundColor: '#fff',
    borderRadius: scale(12),
    shadowColor: 'teal',
    shadowOpacity: 0.6,
    shadowRadius: scale(8),
    shadowOffset: { width: scale(6), height: verticalScale(6) },
    elevation: 4,
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(10),
    marginRight: scale(14),
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: verticalScale(16),
    left: scale(55),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffcca7',
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(6),
    borderRadius: scale(4),
  },
  badgeText: {
    marginLeft: scale(2),
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#d78b54',
  },
  content: {
    flexDirection: 'column',
  },
  areaText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#000',
  },
  jobsText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: '#555',
    marginRight: scale(2),
  },
  row: {
    marginTop: verticalScale(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsContainerNeeds: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
    // marginBottom: verticalScale(16),
    width: '100%',
  },
  dotNeeds: {
    height: verticalScale(3),
    backgroundColor: AppColors.themeColor,
    borderRadius: scale(1.5),
    marginHorizontal: scale(3),
  },
  dotsContainerJobSuggestion: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(16),
  },
  dotJobSuggestion: {
    height: verticalScale(3),
    backgroundColor: AppColors.themeColor,
    borderRadius: scale(1.5),
    marginHorizontal: scale(3),
  },
  fixedTopContainer: {
    backgroundColor: '#fff',
    paddingBottom: verticalScale(6),
  },
});

// VIDEO STYLES
const videoStyles = StyleSheet.create({
  container: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: scale(14),
    marginBottom: verticalScale(10),
  },
  backgroundContainer: {
    paddingVertical: verticalScale(6),
  },
  scrollContent: {
    paddingHorizontal: scale(14),
  },
  categoryCard: {
    width: scale(200),
    height: verticalScale(140),
    backgroundColor: '#fff',
    borderRadius: scale(6),
    marginRight: scale(10),
    shadowColor: AppColors.primary,
    shadowOpacity: 0.5,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: verticalScale(6) },
    elevation: 6,
   
    overflow: 'hidden',
    marginBottom: verticalScale(8),
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(100),
    borderTopLeftRadius: scale(6),
    borderTopRightRadius: scale(6),
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: scale(60),
  },
  categoryContent: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(6),
  },
  jobsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(1),
  },
  jobsText: {
    fontSize: moderateScale(10),
    color: '#999',
    fontWeight: '500',
    marginRight: scale(2),
  },
  categoryTitle: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#000',
    lineHeight: moderateScale(14),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  dot: {
    height: verticalScale(3),
    backgroundColor: AppColors.themeColor,
    borderRadius: scale(1.5),
    marginHorizontal: scale(3),
  },
});

// RATE EXPERIENCE STYLES
const rateStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F6F6",
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(8),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(32),
    marginBottom: verticalScale(16),
  },
  title: {
    textAlign: "center",
    fontSize: moderateScale(12),
    fontWeight: "800",
    color: "#333",
    marginBottom: verticalScale(26),
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(10),
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(6),
  },
  trustText: {
    marginLeft: scale(6),
    fontSize: moderateScale(11),
    color: "#444",
    fontWeight: "500",
  },
});

// REFER FRIEND STYLES
const referStyles = StyleSheet.create({
  wrapper: {
    marginTop: verticalScale(6),
    alignItems: "center",
    width: "100%",
    marginBottom: verticalScale(12),
  },
  card: {
    width: "100%",
    backgroundColor: "rgb(255,241,224)",
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(14),
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
    minHeight: verticalScale(80),
  },
  text: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#222",
  },
  button: {
    marginTop: verticalScale(10),
    backgroundColor: AppColors.buttons,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20),
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(12),
    marginLeft: scale(6),
    fontWeight: "600",
  },
  girlImage: {
    position: "absolute",
    right: -15,
    bottom: verticalScale(-26),
    height: verticalScale(160),
    width: scale(180),
    resizeMode: "contain",
  },
});

export { styles, videoStyles, rateStyles, referStyles };