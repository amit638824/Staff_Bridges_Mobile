import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

// ---------------- IMAGE FIX ---------------- //

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

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
  <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

  {/* Fixed Header */}
  <View style={{ marginTop: 0, paddingTop: 0 }}>
    <AppHeader 
      location="Dewa Road"
      onNotificationTap={() => console.log("Notifications tapped")}
    />
  </View>

  {/* Fixed Resume Card & Search Box */}
  <View style={styles.fixedTopContainer}>
    {/* 🔹 Resume Reminder Row */}
    <View style={styles.resumeCard}>
  <Ionicons name="information-circle-outline" size={22}  />
  <View style={{ flex: 1, marginLeft: 8 }}>
    <Text style={styles.resumeTitle}>Add Resume to boost your profile</Text>
  </View>
  <TouchableOpacity>
    <Text style={styles.resumeLink}>Add Now</Text>

  </TouchableOpacity>
      <Ionicons name="close" size={18} color="#999" />
</View>

{/* 🔹 Search Box */}
<View style={styles.searchBox}>
  <Ionicons name="search-outline" size={20} color="#999" />
  <TextInput
    style={styles.searchInput}
    placeholder="Search jobs"
    placeholderTextColor="#666"
  />
</View>
  </View>

  {/* Scrollable Content */}
 <ScrollView
  contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
  style={{ flex: 1 }}
  showsVerticalScrollIndicator={false}
>

{/* 🔹 Greeting Line */}
<View style={{ paddingHorizontal: 18, marginTop: 10 }}>
  <Text style={styles.subGreetingText}>Hey Asmit </Text>
  <Text style={styles.subGreetingText}>You have more jobs waiting...</Text>
</View>

        {/* Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <Image source={IMAGES.logo} style={styles.bannerLogo} />
            <Ionicons name="close" size={18} color="#999" />
          </View>

          <View style={styles.bannerContent}>
            <View style={styles.bannerTextSection}>
              <Text style={styles.bannerSubtitle}>Get Job-ready in minutes</Text>
              <Text style={styles.bannerTitle}>Learn about roles & responsibilities {"\n"}and how to master them.</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Apply now</Text>
              </TouchableOpacity>
            </View>

            <Image source={IMAGES.designer} style={styles.bannerImage} />
          </View>
        </View>
          <View style={styles.sectionHeader}>
                      <Text style={{ marginStart:15, fontWeight: '500', fontSize: 14, marginBottom: 12 }}>Apply to these jobs</Text>

                <TouchableOpacity style={{ flexDirection: 'row', marginEnd: 10 }}>
                  <Text style={styles.viewAll}>View All </Text>
                  <Ionicons name="ios-arrow-forward" size={14} style={{ marginRight: 10,}} color="#00A79D" />
      
                </TouchableOpacity>
              </View>
        <JobSuggestionSection />

        {/* Pagination Dots for Job Suggestions */}
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
        {/* Need Cards */}
        <View style={styles.gridContainer}>
          <Text style={{ width: '100%', fontWeight: '500', fontSize: 14, marginBottom: 12 }}>Jobs for all your needs</Text>
          {renderNeedCard(IMAGES.wallet, 'High Paying Jobs', 'View 188 jobs')}
          {renderNeedCard(IMAGES.home, 'Work From Home', 'View 85 jobs')}
          {renderNeedCard(IMAGES.books, 'Graduate Jobs', 'View 28 jobs')}
          {renderNeedCard(IMAGES.bell, 'New Jobs', 'View 16 jobs')}
          
          {/* Pagination Dots for Jobs for all your needs */}
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

        {/* Videos Section */}
        <VideosSection />

        {/* Refer a Friend Section */}
<ReferFriendSection />
        {/* Nearby Areas Section */}
                  <Text style={{ width: '100%', fontWeight: '500', fontSize: 14, margin:14 }}>Jobs in near by areas</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
          <View style={{flexDirection:'row',padding:10}}>
       <NearbyAreaCard distance="2.1 km away" area="Gurugram Sec 32" jobs="View 45 Jobs" />
        <NearbyAreaCard distance="3.5 km away" area="Vibhuti Khand" jobs="View 30 Jobs" />
        <NearbyAreaCard distance="3.5 km away" area="Hazratganj" jobs="View 30 Jobs" />
        </View>
</ScrollView>
          {/* Rate Experience Section */}
          <RateExperienceSection />

        <View style={styles.container}>
          {SuccessStoriesSection()};
              </View>
                    
      </ScrollView>

      <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />
    </SafeAreaView>
  );
};

// --------- UI Helper Component --------- //

const renderNeedCard = (image: any, title: string, subtitle: string, highlight = false) => (
  <View style={[styles.needCard, highlight && styles.highlightCard]}>
    <Image source={image} style={styles.needImage} />
    <Text style={styles.needTitle}>{title}</Text>
    <Text style={styles.needSubtitle}>{subtitle}</Text>
  </View>
);

const VideosSection = () => {
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  const videos = [
    {
      id: 1,
      image: require('../../assets/images/cs_and_telecler.jpg'),
      title: 'Customer Support / TeleCaller',
      jobs: 'View 268 Jobs',
    },
    {
      id: 2,
      image: require('../../assets/images/sales-job.jpg'),
      title: 'Sales / Marketing',
      jobs: 'View 286 Jobs',
    },
    {
      id: 3,
      image: require('../../assets/images/depka.jpg'),
      title: 'More Categories',
      jobs: 'View 100+ Jobs',
    },
  ];

  const buildCategoryCard = (item: any) => (
    <TouchableOpacity key={item.id} style={videoStyles.categoryCard}>
      {/* Image with custom border radius */}
      <View style={videoStyles.imageContainer}>
        <Image source={item.image} style={videoStyles.categoryImage} />
      </View>

      {/* Content */}
      <View style={videoStyles.categoryContent}>
        <View style={videoStyles.jobsRow}>
          <Text style={videoStyles.jobsText}>{item.jobs}</Text>
          <Icon name="chevron-forward-outline" size={10} color="#009ca4" />
        </View>
        <Text style={videoStyles.categoryTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={videoStyles.container}>
      <Text style={videoStyles.sectionTitle}>Choose from job categories</Text>

      <View style={videoStyles.backgroundContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={videoStyles.scrollContent}
        >
          {videos.map((video) => buildCategoryCard(video))}
        </ScrollView>
      </View>

      {/* Pagination Dots */}
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
  return (
    <View style={{ marginTop: 10,}}>
    <ImageBackground
      source={require('../../assets/images/success-bg.jpg')}
      style={styles.containerImage}
      resizeMode="cover"
    >
      {/* Circular Top Icon */}
      
      <View style={styles.iconBorder}>
        <Image
          source={require('../../assets/images/clapping.png')}
          style={styles.iconImage}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.titleBlack}># Staff Bridges </Text>
        <Text style={styles.titleTeal}>Success Stories</Text>
      </Text>

      {/* Avatar Row */}
      <View style={styles.avatarRow}>
        <Image source={require('../../assets/images/depka.jpg')} style={styles.avatar} />
        <Image source={require('../../assets/images/mikes.jpg')} style={styles.avatar} />
        <Image source={require('../../assets/images/soni.jpg')} style={styles.avatar} />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Deepak, Mohit, Soni and many {"\n"}got <Text style={styles.titleTeal}>invited for interview</Text> by HR for {"\n"}a new job!
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

  return (
    <View style={styles.card}>
      
      {/* Orange Badge Positioned */}
      <View style={styles.badgeContainer}>
        <Icon name="location-sharp" size={14} color="#d78b54" />
        <Text style={styles.badgeText}>{distance}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.areaText}>{area}</Text>

        <View style={styles.row}>
          <Text style={styles.jobsText}>{jobs}</Text>
          <Icon name="chevron-forward" size={12} color="teal" />
        </View>
      </View>
    </View>
  );
};

const RateExperienceSection = () => {
  const [rating, setRating] = useState(0);

  return (
    <View style={rateStyles.container}>
      <Text style={rateStyles.title}>Rate your experience</Text>

      {/* Stars */}
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

      {/* Small info text with shield icon */}
      <View style={rateStyles.trustRow}>
        <MaterialCommunityIcon name="shield-check" size={18} color="#666" />
        <Text style={rateStyles.trustText}>
          More than 50 lakhs Indians trust Staff Bridges
        </Text>
      </View>
    </View>
  );
};

const ReferFriendSection = () => {
  return (
    <View style={referStyles.wrapper}>
      {/* Card Background */}
      <View style={referStyles.card}>
        <Text style={referStyles.text}>
          Help your friends get{"\n"}job on Staff Bridges
        </Text>

        <TouchableOpacity style={referStyles.button}>
          <Icon name="logo-whatsapp" size={18} color="#fff" />
          <Text style={referStyles.buttonText}>Refer friends</Text>
        </TouchableOpacity>
      </View>

      {/* Girl Image Overlapping */}
      <Image
        source={require('../../assets/images/girlwithmobile-removebg-preview.png')}
        style={referStyles.girlImage}
      />
    </View>
  );
};

export default HomeScreen;

// ----------------------------------------
// Add your existing styles below
// ----------------------------------------
const styles = StyleSheet.create({
  container: { backgroundColor: '#fff'},
   containerImage: {padding: 16},
  bannerCard: { marginTop:10, marginBottom:40, backgroundColor: '#cfe4eeff' },
  bannerLogo: { width: 50, height: 50, resizeMode: 'contain' },
  bannerImage: { width: 100, height: 125, resizeMode: 'contain' ,borderTopLeftRadius: 25,borderTopRightRadius:25,marginRight:20},
    bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginHorizontal: 14,
    // marginBottom: 12,
  },
resumeCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EAF4FF',
  padding: 12,
  // borderRadius: 10,
  // marginHorizontal: 18,
  marginTop: 5,
},

resumeTitle: {
  fontSize: 13,
  fontWeight: '500',
  color: '#000',
},

resumeLink: {
  fontSize: 13,
  marginEnd: 5,
   color:"#00A79D" ,
  textDecorationLine: 'underline',
  fontWeight: '700',
},

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop:10,
  },



  viewAll: {
    color: "#00A79D",
    fontSize: 13,
    fontWeight: "600",
   
  },

searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF', // White background
  borderRadius: 25,
  paddingHorizontal: 14,
  paddingVertical: 2,
  marginHorizontal: 14,
  marginTop: 20,
marginBottom:2,
  // 👇 Added border
  borderWidth:2,
  borderColor: '#CCCCCC', // Light grey border
},

searchInput: {
  flex: 1,
  marginLeft: 10,
  fontSize: 14,
  color: '#000',
},

greetingText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#000',
},

subGreetingText: {
  fontSize: 13,
  // color: '#666',
  marginTop: 4,
},

  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bannerTextSection: {
    flex: 1,
    marginRight: 10,
    marginLeft:6,
  },
  bannerSubtitle: {
    fontSize: 15,
    color: '#666',
    marginStart: 10,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 13,
        marginStart: 10,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
    lineHeight: 18,
  },
  bannerButton: {
    backgroundColor:  "#00A79D" ,
    paddingHorizontal: 20,
    paddingVertical: 8,
        marginStart: 10,
        marginBottom: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    
  },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 16 ,paddingBottom:0,backgroundColor:"#d2e6ff",marginTop:10},
  needCard: { width: '48%', backgroundColor: '#f8f8f8', padding: 16, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  needImage: { width: 40, height: 40, marginBottom: 10 },
  needTitle: { fontWeight: 'bold', fontSize: 14 },
  needSubtitle: { color: '#777', marginTop: 4 },
  highlightCard: { borderWidth: 1, borderColor: '#099', backgroundColor: '#e0f7fa' },
  iconBorder: {
    padding: 4,
    borderRadius: 50,
    height: 60,
    alignContent: 'center',
    width: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'teal',
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  titleBlack: {
    color: '#000',
    fontWeight: '600',
  },
  titleTeal: {
    color: 'teal',
    fontWeight: '700',
  },
  avatarRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 36,
    alignSelf: 'center',
    height: 36,
    borderRadius: 18,
    marginHorizontal: 5,
  },
  description: {
    marginTop: 12,
    fontSize: 13.5,
    textAlign: 'center',
    color: '#000',
    lineHeight: 20,
  },
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: 'teal',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 8, height: 8 },
    elevation: 4, // For Android shadow
    paddingTop: 70,
    paddingBottom: 12,
    paddingHorizontal: 12,
    marginRight: 16,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 20,
    left: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffcca7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#d78b54',
  },
  content: {
    flexDirection: 'column',
  },
  areaText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#000',
  },
  jobsText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#555',
    marginRight: 4,
  },
  row: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsContainerNeeds: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
    width: '100%',
  },
  dotNeeds: {
    height: 4,
    backgroundColor: '#009ca4',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  dotsContainerJobSuggestion: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  dotJobSuggestion: {
    height: 4,
    backgroundColor: '#009ca4',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  fixedTopContainer: {
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
});

const videoStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backgroundContainer: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 12,
    shadowColor: '#2196F3',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 70,
  },
  categoryContent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  jobsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  jobsText: {
    fontSize: 11.5,
    color: '#999',
    fontWeight: '500',
    marginRight: 3,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    lineHeight: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    height: 4,
    backgroundColor: '#009ca4',
    borderRadius: 2,
    marginHorizontal: 4,
  },
});

const rateStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  trustText: {
    marginLeft: 8,
    fontSize: 12.5,
    color: "#444",
    fontWeight: "500",
  },
});

const referStyles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(254, 238, 219, 1)",
    paddingVertical: 18,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
    minHeight: 100,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#00A79D",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13.5,
    marginLeft: 8,
    fontWeight: "600",
  },

  girlImage: {
    position: "absolute",
    right: 0,
    top: -18, // Moves image outside card (overlapping effect)
    height: 138, 
    width: 210,
    resizeMode: "contain",
  },
});