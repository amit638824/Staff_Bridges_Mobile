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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppColors } from '../constants/AppColors';
import App from '../../App';

const JobInfoScreen = ({ navigation, route }: any) => {
  const [isSaved, setIsSaved] = useState(false);

  const jobData = route.params?.jobData || {};

  const jobDetails = {
    title: jobData.title || 'Telecaller',
    company: jobData.company || 'RAPIDHIRE.COM',
    location: jobData.location || 'Gomti Nagar, Lucknow (within 7 KM)',
    salary: jobData.salary || '₹ 8,000 – 15,500 /Month',
    experience: jobData.experience || '6 - 12 months Experience in customer support',
    vacancies: jobData.vacancies || '90 Vacancies',
    type: jobData.type || 'Full Time',
    postedAgo: jobData.postedAgo || 'Posted 10+ days ago',
description:'',
    highlights: [
      'Industry Type: BPO',
      '12th Pass and above',
      'All genders',
      '6 days working | Rotational Shift',
      'PAN Card, Aadhar Card, Bank Account, DRA Certificate',
    ],

    skillsRequired: ['Computer Knowledge', 'Internet Calling', 'Query Resolution'],
  };

  return (
    <SafeAreaView style={styles.container}>
  <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

  {/* FIXED HEADER LIKE PROFILE SCREEN */}
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={26} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.shareButton}>
      <Ionicons name="logo-whatsapp" size={16} color={AppColors.themeColor}/>
      <Text style={styles.shareText}>Share</Text>
    </TouchableOpacity>
  </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* IMAGE + TITLE */}
        <View style={styles.topSection}>
          <Image
            source={require('../../assets/images/residential.png')}
            style={styles.jobImage}
          />
          <Text style={styles.jobTitle}>{jobDetails.title}</Text>
          <Text style={styles.company}>{jobDetails.company}</Text>
        </View>

        {/* INFO SECTION */}
        <View style={styles.infoCard}>
          {/* Location */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{jobDetails.location}</Text>
          </View>

          {/* Salary */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcon name="currency-inr" size={18} color="#666" />
            <Text style={styles.infoText}>{jobDetails.salary}</Text>
          </View>

          {/* Experience */}
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{jobDetails.experience}</Text>
          </View>
        </View>

        {/* TAGS SECTION */}
        <View style={styles.tagsRow}>
          <View style={styles.tagBox}>
            <Text style={styles.tagText}>{jobDetails.vacancies}</Text>
          </View>
          <View style={styles.tagBox}>
            <Text style={styles.tagText}>{jobDetails.type}</Text>
          </View>
        </View>

        {/* JOB HIGHLIGHTS (LIGHT BLUE BOX) */}
       

        <View style={styles.highlightCard}>
                    <Text style={styles.sectionTitle}>Job Highlights</Text>

        {jobDetails.highlights.map((text, index) => {
  let iconName = 'checkmark-circle'; // default icon
  let iconLibrary = Ionicons;

  if (text.includes('Industry Type')) {
    iconName = 'business-outline'; // industry icon
  } else if (text.includes('working') || text.includes('Shift')) {
    iconName = 'time-outline'; // clock icon
  }

  return (
    <View key={index} style={styles.highlightRow}>
      {iconLibrary === Ionicons ? (
        <Ionicons name={iconName} size={16} color={AppColors.themeColor} />
      ) : (
        <MaterialCommunityIcon name={iconName} size={16} color={AppColors.themeColor} />
      )}
      <Text style={styles.highlightText}>
        {text.includes('Industry Type') ? (
          <>
            <Text style={styles.highlightBold}>Industry Type: </Text>
            BPO
          </>
        ) : (
          text
        )}
      </Text>
    </View>
  );
})}

        </View>

      {/* SKILLS CARD WITH BORDER + SHADOW */}
<View style={styles.skillsContainer}>
  <Text style={styles.subTitle}>Skills Required</Text>

  <View style={styles.skillsWrap}>
    {jobDetails.skillsRequired.map((skill, index) => (
      <View key={index} style={styles.skillChip}>
        <Text style={styles.skillLabel}>{skill}</Text>
      </View>
    ))}
  </View>
   <Text style={styles.jobDesTitle}>Job Description</Text>

  <Text style={styles.descriptionText}>
    {jobDetails.description ||
      'We are looking for a Telecaller to join our team at Rapidhire.com. This role involves managing...'}
  </Text>

  <TouchableOpacity>
    <View style={{ flexDirection: 'row', alignItems: 'center' ,alignContent:'center', marginTop:6,alignSelf:'flex-end'}}>
    <Text style={styles.readMore}>Read More</Text>
    <Ionicons name="chevron-down" size={16} color="#03416b" />
 </View> </TouchableOpacity>
</View>

{/* CONTACT PERSON */}
<View style={styles.contactCard}>
  <Text style={styles.contactText}>Contact Person</Text>
  <Text style={styles.contactAddress}>Priya Singh Thakur</Text>

  <Text style={styles.contactText}>Interview Address</Text>
  <Text style={styles.contactAddress}>Gomti Nagar, Lucknow</Text>
</View>
<Text style={styles.smallText}>Posted 10+days ago</Text>
<View style={styles.shareCard} >
  <Text style={styles.subTitle}>Have a friend who will be{"\n"} good for this job?</Text>
    <TouchableOpacity style={styles.shareButtonLarge}>
      <Ionicons name="logo-whatsapp" size={16} color="#fff" />
      <Text style={styles.shareTextLarge}>Share with Friends</Text>
    </TouchableOpacity>
    <Image style={{width:70,height:70,position:'absolute',bottom:50,right:40}} source={require('../../assets/images/clapping.png')} />
</View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.applyBtn}>
          <Text style={styles.applyText}>Apply Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.callText}>Call HR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobInfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

 header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  paddingHorizontal: 16,
  paddingBottom: 10,
  marginBottom:20,
  backgroundColor: "#fff",
},

shareButton: {
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: AppColors.buttons,
  borderRadius: 20,
  paddingHorizontal: 10,
  paddingVertical: 4,
  alignItems: 'center',
},

shareText: { 
  color: AppColors.buttons, 
  marginLeft: 5, 
  fontWeight: '600' 
},
shareTextLarge: { 
  color: '#fff', 
  marginLeft: 10, 
  // fontWeight: '600',
  },

  /* TOP SECTION */
  topSection: {
    paddingHorizontal: 16,
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  jobImage: {
    width: 60,
    height: 60,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
    marginBottom: 10,
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },

  company: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 3,
  },

  /* INFO CARD */
  infoCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    marginLeft: 12,
    color: '#444',
    fontWeight: '500',
  },

  /* TAGS */
  tagsRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginHorizontal: 20,
    gap: 10,
  },

  tagBox: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
  },

  tagText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },

  /* SECTION TITLE */
  sectionTitleRow: {
    marginTop: 20,
    marginHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
jobDesTitle:{
  fontSize: 15,
  fontWeight: '700',
  marginTop:16,
  marginBottom:8,  
  marginLeft:4,
},
  /* JOB HIGHLIGHTS BOX — SAME AS SCREENSHOT */
highlightCard: {
  backgroundColor: '#EAF7FF',
  borderWidth: 1,
  borderColor: '#D2E9FF',
  padding: 16,
  borderRadius: 12,
  marginHorizontal: 20,
  marginTop: 12,
},

highlightRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 10,
},

highlightBullet: {
  marginTop: 3,
},

highlightText: {
  flex: 1,
  marginLeft: 10,
  color: '#000',
  fontSize: 14,
  lineHeight: 20,
},

highlightBold: {
  fontWeight: '700',
  color: '#000',
},

/* SKILLS SECTION — WHITE ROUNDED CHIPS */
skillsCard: {
  marginHorizontal: 16,
  marginTop: 12,
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
},
/* REUSABLE SUBTITLE */
subTitle: {
  fontSize: 15,
  fontWeight: '700',
  color: '#000',
   marginBottom: 10,
},

/* SKILLS CARD */
skillsContainer: {
  backgroundColor: '#fff',
  padding: 16,
  marginHorizontal: 20,
  marginTop: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E5E5',
  elevation: 3,
  shadowColor: '#c4ecff',
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

skillsWrap: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
},

skillChip: {
  paddingHorizontal: 14,
  paddingVertical: 8,
  backgroundColor: '#fff',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#D9D9D9',
},

skillLabel: {
  fontSize: 13,
  color: '#7d7d7d',
  fontWeight: '500',
},
shareButtonLarge: {
  flexDirection: 'row',
  borderWidth: 1, 
  backgroundColor:AppColors.buttons,
  borderRadius: 25,
  paddingHorizontal: 14,
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent:'center',
  marginTop:10,
  width:200,
},
/* JOB DESCRIPTION CARD */
descriptionCard: {
  backgroundColor: '#fff',
  padding: 16,
  marginHorizontal: 20,
  marginTop: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E5E5',
  elevation: 3,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

descriptionText: {
  fontSize: 14,
  color: '#444',
  marginLeft:4,
  lineHeight: 20,
},

readMore: {
  // marginTop: 6,
  fontSize: 14,
  fontWeight: '800',
  color: '#03416b',

},

/* CONTACT PERSON CARD */
contactCard: {
  backgroundColor: '#fff',
  padding: 16,
  marginHorizontal: 20,
  marginTop: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E5E5',
  elevation: 3,
  shadowColor: '#c4ecff',
  shadowOpacity: 0.1,
  shadowRadius: 4,
   marginBottom: 15,
},
shareCard: {
  backgroundColor: '#c4ecff',
  padding: 16, 
  marginBottom:0
 },
 
contactText: {
  fontSize: 15,
  fontWeight: '600',
  color: '#000',
  // marginTop: 15,
},

contactAddress: {
  fontSize: 14,
  color: '#666',
  marginTop: 3,
  marginBottom: 15,
},
smallText: {
  fontSize: 12,
  color: '#999',
  // textAlign: 'center',
  alignContent:'flex-end',
  alignItems:'flex-end',
  alignSelf:'flex-end',
    marginBottom: 20,
  marginRight:40,
},  

skillBox: {
  paddingHorizontal: 14,
  paddingVertical: 8,
  backgroundColor: '#fff',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#D9D9D9',
},

/* BOTTOM BUTTONS */
bottomButtons: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  padding: 20,
  backgroundColor: '#fff',
  flexDirection: 'row',
  justifyContent: 'flex-end',  // 👈 aligns buttons to right
  gap: 10,
  borderColor: '#EEE',
  borderTopWidth: 2,
  borderTopColor: '#EEE',
},

applyBtn: {
  borderWidth: 1,
  borderColor: AppColors.buttons,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 18,
  minWidth: 150,  // 👈 optional width control
},

callBtn: {
  backgroundColor: AppColors.buttons,
  borderRadius: 25,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 6,
  paddingVertical: 12,
  paddingHorizontal: 18,
  minWidth: 150,  // 👈 matches apply button size
},
  applyText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.buttons,
  },
  callText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
