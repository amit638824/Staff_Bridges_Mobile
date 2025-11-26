import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AppFooter from '../../components/AppFooter';
import { AppColors } from '../../constants/AppColors';

const ProfileScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

  // Receive tabIndex from navigation, default is 3 (Profile tab)
  const [currentIndex, setCurrentIndex] = useState(route?.params?.tabIndex ?? 3);

  const handleFooterTap = (index: number) => {
    setCurrentIndex(index);
  };

  // Add this function to handle settings navigation
  const handleSettingsPress = () => {
    navigation.navigate('SettingsScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareButton}>
             <Icon name="logo-whatsapp" size={16} color="#FF6600"/>
            <Text style={styles.shareText}>Share App</Text>
          </TouchableOpacity>
          {/* Add onPress handler to settings icon */}
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={24} color="#000" style={{ marginLeft: 12 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Area */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderProfileCard()}
        {renderJobPreferenceCard()}
        {renderCompletionSection()}
        {renderUploadResume()}
        {renderWorkExperience()}
      </ScrollView>

      {/* Footer */}
      <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />
    </SafeAreaView>
  );
};



/* ------------ COMPONENTS ------------- */

const renderProfileCard = () => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <View
  style={{
    width: 56,
    height: 56,
    borderRadius: 30, // half of width/height = perfect circle
    borderWidth: 4,
    borderColor: '#e491bfff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }}>
  <Image
    source={require('../../../assets/images/boss.png')}
    style={{
      width: 40,
      height: 40,
      backgroundColor: '#ffffffd2',
      borderRadius: 27, // half of width/height
    }}
  />
</View>



      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.profileName}>Ram Singh</Text>
        <Text style={styles.profileSub}>Member Since 2025</Text>
      </View>
      <TouchableOpacity style={styles.iconButtonBorder}>
        <Icon name="pencil-outline" size={18} color="#999" />
      </TouchableOpacity>
    </View>

    <View style={{ marginTop: 12 }}>
      <View style={styles.infoRow}>
        <Icon name="call" size={14} color="#999" />
        <Text style={styles.infoText}>976543210</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="location" size={14} color="#999" />
        <Text style={styles.infoText}>Dewa Road</Text>
      </View>
    </View>
  </View>
);

const renderJobPreferenceCard = () => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>Looking for jobs</Text>
      <TouchableOpacity style={styles.iconButtonBorder}>
        <Icon name="pencil" size={18} color="#999" />
      </TouchableOpacity>
    </View>
    <Text style={styles.chip}>Customer Support / Telecaller</Text>
  </View>
);

const renderCompletionSection = () => (
<View style={styles.completionContainer}>
  <Text style={styles.completionTitle}>
    Add 3 missing details to get more job responses
  </Text>

  <View style={styles.completionRow}>
    {/* Fixed Circular Progress */}
  <View style={styles.progressWrapper}>
  <View style={styles.progressBase}>
    <View style={styles.progressFill} />
    <Text style={styles.progressLabel}>18%{"\n"}done</Text>
  </View>
</View>


    {/* Horizontally scrollable cards */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {[
        { icon: 'work-outline', color: '#E91E63', title: 'Add previous work', subtitle: 'to let know you better' },
        { icon: 'star-outline', color: '#9C27B0', title: 'Add relative', subtitle: 'and boost your' },
        { icon: 'file-upload', color: '#4CAF50', title: 'If you have a', subtitle: 'Upload it here' },
      ].map((item, index) => (
        <View key={index} style={styles.completionCard}>
          <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
            <Icon name={item.icon} color={item.color} size={22} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.completionTitleText}>{item.title}</Text>
            <Text style={styles.completionSubText}>{item.subtitle}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
</View>

);

const renderUploadResume = () => (
  <View style={styles.uploadCard}>
    <View >
       <Image
  source={require('../../../assets/images/cv.png')}
  style={{ width: 50, height: 50 }}
/>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.uploadText}>If you have a{"\n"}resume{"\n"} upload it here</Text>
    </View>
    <TouchableOpacity style={styles.uploadButton}>
      <Text style={styles.uploadButtonText}>Upload</Text>
    </TouchableOpacity>
  </View>
);

const renderWorkExperience = () => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>Work Experience</Text>
      <Text style={{ color:AppColors.themeColor, fontWeight: '600' }}>Add New</Text>
    </View>

    <Text style={styles.subHeading}>Customer Support / Telecaller</Text>
    <Text style={styles.subText}>1 year</Text>
    <Text style={styles.link}>Add company details</Text>
<LinearGradient
  colors={['#def2ec', '#97e1ca']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.greenBox}
>
  <Image
  source={require('../../../assets/images/active-user.png')}
  style={styles.boyImage}
/>

  <View style={{ marginLeft: 8 }}>
    <Text style={styles.greenTextUp}>Boost your profile with chat</Text>
    <Text style={styles.greenTextDown}>Add pending details instantly {"\n"}
      to attract recruiters.</Text>
  </View>
</LinearGradient>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor} />
      </TouchableOpacity>
    </View>
<Text style={[styles.subText, { fontWeight: '700',color: '#000' }]}>
  Domestic Calling
</Text>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>Category Details</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor}/>
      </TouchableOpacity>
    </View>
    <Text style={[styles.subText, { fontWeight: '700',color: '#000' }]}>Bike</Text>
     <Text style={styles.subText}>Which of these IDs/ Documents do you have?</Text>
    <Text style={[styles.subText, { fontWeight: '500',color: '#000' }]}>Pan Card, Aadhar Card</Text>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>Basic Details</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor} />
      </TouchableOpacity>
    </View>
    <Text style={styles.subText}>Current/Last Salary</Text>
        <Text style={styles.link}>Add</Text>

    <Text style={styles.subText}>Email ID</Text>
        <Text style={styles.link}>Add</Text>
 <Text style={styles.subText}>Alternate Phone no.</Text>
        <Text style={styles.link}>Add</Text>
           <Text style={styles.subText}>Age & Gender</Text>
           <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={[styles.link,{marginEnd:10}]}>Add</Text><Text style={styles.subText}>Male</Text>
            </View>
          <Text style={styles.subText}>Educational Level</Text>
     <Text style={[styles.subText, { fontWeight: '700',color: '#000' }]}>Graduate</Text>

   

  </View>
);

/* ------------ STYLES ------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

 header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  paddingHorizontal: 18,
  paddingBottom: 10,
},


  title: { fontSize: 20, fontWeight: '700', color: '#000' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  shareButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#FF6600',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  shareText: { color: '#FF6600', marginLeft: 5, fontWeight: '600' },
  scrollContainer: { padding: 15, paddingBottom: 80 },
profileCircle: {
  width: 50,
  height: 50,
  borderRadius: 25, // half of width/height = perfect circle
  borderColor: '#df7ab1',
  borderWidth: 2,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden', // ensures image doesn't leak outside border
},

profileImage: {
  width: 46, 
  height: 46,
  borderRadius: 23,
},
   boyImage: {
    width: 50,
    height: 50,
    
  },
  iconButtonBorder: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 6,
    // backgroundColor: '#fafafa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: '#ddd',
    shadowColor: '#6dc4f7ff',
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  profileName: { fontSize: 16, fontWeight: '700', color: '#000' },
  profileSub: { fontSize: 13, color: 'gray' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  infoText: { marginLeft: 5, fontSize: 13, color: '#333' },
  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    color: '#555',
  },
  completionContainer: { backgroundColor: '#fff0de', padding: 15, marginBottom: 15, marginHorizontal: -15 },
  completionTitle: { fontWeight: '600', fontSize: 13,marginBottom: 10, color: '#000' },
completionRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

progressWrapper: {
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},

progressBase: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  borderWidth: 4,
  borderColor: '#ffd7d9',
},

progressFill: {
  position: 'absolute',
  width: 60,
  height: 60,
  borderRadius: 30,
  borderTopColor: '#E91E63', // dark arc
  borderTopWidth: 5,
  borderRightColor: 'transparent',
  borderRightWidth: 5,
  borderBottomColor: 'transparent',
  borderBottomWidth: 5,
  borderLeftColor: 'transparent',
  borderLeftWidth: 5,
  transform: [{ rotate: '65deg' }], // 18% of 360° ≈ 65°
},

progressLabel: {
  fontSize: 12,
  fontWeight: '700',
  color: '#000',
  textAlign: 'center',
},

progressCircle: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#ffd7d9', // light track
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  marginRight: 15,
},

innerCircle: {
  width: '100%',
  height: '100%',
  borderRadius: 30,
  // position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: 'transparent',
 // transform: [{ rotate: '162deg' }], // 18% of 360° = ~65°, rotate to show arc
  borderTopColor: '#da1e28', // dark progress
  borderTopWidth: 5,
  borderRightColor: 'transparent',
  borderRightWidth: 5,
  borderBottomColor: 'transparent',
  borderBottomWidth: 5,
  borderLeftColor: 'transparent',
  borderLeftWidth: 5,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
},



  completionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    width: 200,
    elevation: 2,
  },
  iconBox: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  completionTitleText: { fontWeight: '600', color: '#333', fontSize: 12 },
  completionSubText: { color: '#777', fontSize: 12 },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
 
  
      marginBottom: 10,
  },
  
  uploadText: { fontWeight: '600', fontSize: 13, color: '#000', marginLeft: 10 },
  uploadButton: {
    borderWidth: 1,
    borderColor: AppColors.themeColor,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 4,
  },
  uploadButtonText: { color: AppColors.themeColor, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#000', marginTop: 10,marginBottom: 5 },
  subHeading: { fontSize: 14, fontWeight: '600', color: '#000',marginBottom: 5 },
  subText: { color: '#555', fontSize: 13,marginBottom: 5 },
  link: { color: AppColors.themeColor, fontSize: 13, fontWeight: '600' ,marginBottom: 5},
  greenBox: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  greenTextUp: { marginLeft: 8, color: '#333', fontSize: 14, flex: 1,fontWeight: '800' },
   greenTextDown: { marginLeft: 8, color: '#333', fontSize: 12, flex: 1 },
});

export default ProfileScreen;