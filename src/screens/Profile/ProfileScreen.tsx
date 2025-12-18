import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AppFooter from '../../components/AppFooter';
import { AppColors } from '../../constants/AppColors';
import { useTranslation } from 'react-i18next';
import { profileSchema } from '../../validation/profileSchema';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { profileService } from '../../services/profileService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState ,AppDispatch} from '../../redux/store';
import { fetchUserProfile, updateBasicInfo, updateProfileField } from '../../redux/slices/userSlice';
import { fetchSeekerCategories, fetchSeekerExperienceByUser } from '../../redux/slices/seekerCategorySlice';
import { locationService } from '../../services/locationService';
import { PermissionsAndroid, Linking } from 'react-native';
import { pick } from '@react-native-documents/picker';
import { additionalDetailsSchema } from '../../validation/profileSchema';

interface ProfileData {
  userId: number;
  fullName: string;
  phone: string;
  alternateMobile: string;
  email: string;
  location: string;
  memberSince: string | number; // ← Add this line
 skills: string[];
  experience: Record<string, string>;
  salary: string;
  gender: string;
  education: string;
  profilePic?: string | number;
  resume?: string;
}

interface EditModalState {
  visible: boolean;
  fullName: string;
  location: string;
}

interface Locality {
  id: number;
  name: string;
}

const formatEducation = (education: string): string => {
  if (!education) return '';

  const value = education.toLowerCase();

  // ✅ backend sends "any"
  if (value === 'any') {
    return 'Below 10th';
  }

  const educationMap: { [key: string]: string } = {
    postgraduate: 'Post Graduate',
    graduate: 'Graduate',
    intermediate: 'Intermediate',
    highschool: 'High School',
    belowten: 'Below 10th',
  };

  return educationMap[value] || education;
};


const ProfileScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { t } = useTranslation();
const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const locationState = useSelector((state: RootState) => state.location);
  
const seekerCategories = useSelector(
  (state: RootState) => state.seekerCategory.categories
);

const seekerExperience = useSelector(
  (state: RootState) => state.seekerCategory.experienceList
);
const latestCategory = useMemo(() => {
  return seekerCategories?.length
    ? seekerCategories[seekerCategories.length - 1]
    : null;
}, [seekerCategories]);

const [currentIndex, setCurrentIndex] = useState(route?.params?.tabIndex ?? 3);
const [loading, setLoading] = useState(false);
const [dataLoading, setDataLoading] = useState(true);
const [showEditLocalityModal, setShowEditLocalityModal] = useState(false);
const [editLocalities, setEditLocalities] = useState<Locality[]>([]);
const [editLocalitySearch, setEditLocalitySearch] = useState('');
const [editLocalityLoading, setEditLocalityLoading] = useState(false);

const [profilePicLoading, setProfilePicLoading] = useState(false);
const [resumeLoading, setResumeLoading] = useState(false);

const [editModal, setEditModal] = useState<EditModalState>({
  visible: false,
  fullName: '',
  location: '',
});

const genderOptions = ["Male", "Female", "Other"];

const educationOptions = [
  { key: "Any", label: "Below 10th" },
  { key: "highschool", label: "10th Pass" },
  { key: "intermediate", label: "12th Pass" },
  { key: "graduate", label: "Graduate" },
  { key: "postgraduate", label: "Post Graduate" },
];

const [basicModalVisible, setBasicModalVisible] = useState(false);

const [basicDetails, setBasicDetails] = useState({
  salary: '',
  email: '',
  alternateMobile: '',
  gender: '',
  education: '',
});


  // ================= FETCH DATA ON MOUNT =================
useEffect(() => {
  const loadProfileData = async () => {
    try {
      setDataLoading(true);
      const userId = auth.userId;

      if (!userId) {
        console.warn('No userId found');
        setDataLoading(false);
        return;
      }

      // ✅ Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Profile data loading timeout');
        setDataLoading(false);
      }, 10000); // 10 second timeout

      // ✅ Fetch user profile data with error handling
      try {
        await dispatch(fetchUserProfile(userId) as any);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }

      // ✅ Fetch seeker categories with error handling
      try {
        await dispatch(fetchSeekerCategories({ userId, page: 1, limit: 100 }) as any);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }

      clearTimeout(timeoutId);
      setDataLoading(false);

    } catch (error) {
      console.error('Unexpected error loading profile:', error);
      setDataLoading(false);
    }
  };

  if (auth.userId) {
    loadProfileData();
  }
}, [auth.userId]);


const displayLocation = useMemo(() => {
  const city = userProfile?.city || locationState?.city || 'Not set';
  const locality = userProfile?.locality || locationState?.locality || '';
  
  if (!city) return 'Location not set';
  return locality ? `${city}, ${locality}` : city;
}, [userProfile?.city, userProfile?.locality, locationState?.city, locationState?.locality]);


const hasResumeUploaded = useMemo(() => {
  return Boolean(userProfile?.resume);
}, [userProfile?.resume]);


useEffect(() => {
  if (!auth.userId) return;

  const fetchExperience = async () => {
    try {
      await dispatch(fetchSeekerExperienceByUser({ userId: auth.userId }));
    } catch (err) {
      console.error('Error fetching experience:', err);
    }
  };

  // ✅ Fetch experience independently
  fetchExperience();

}, [auth.userId, dispatch]);


  const formatExperience = (exp?: string | number): string => {
  if (!exp || exp === '0') return 'Fresher';

  const value = Number(exp);

  if (value < 1) return 'Less than 1 year';
  if (value === 1) return '1 year';

  return `${value} years`;
};

const profileData = useMemo<ProfileData>(() => {
  const createdAt = userProfile?.createdAt || userProfile?.user_createdAt;
  const memberSinceYear = createdAt 
    ? new Date(createdAt).getFullYear().toString() 
    : new Date().getFullYear().toString();

 const skills = Array.isArray(seekerCategories) 
    ? seekerCategories.map(c => c.category_name).filter(Boolean)
    : [];

  const experienceMap: Record<string, string> = {};

  if (Array.isArray(seekerExperience)) {
    seekerExperience.forEach(item => {
      if (item?.category_name) {
        experienceMap[item.category_name] = formatExperience(item.experience_value ?? '0');
      }
    });
  }

  // ✅ Fill missing experiences
  skills.forEach(skill => {
    if (!experienceMap[skill]) {
      experienceMap[skill] = 'Fresher';
    }
  });


  return {
    userId: auth.userId ?? 0,
    fullName: userProfile?.fullName || userProfile?.user_fullName || 'User',
    phone: userProfile?.phone ?? auth.mobile ?? userProfile?.user_mobile ?? 'N/A',
    alternateMobile: userProfile?.alternateMobile ?? userProfile?.user_alternateMobile ?? '',
    email: userProfile?.email ?? userProfile?.user_email ?? '',
    location: displayLocation,
    skills,
    experience: experienceMap,
    salary: userProfile?.salary ?? userProfile?.user_salary ?? '',
    gender: userProfile?.gender ?? userProfile?.user_gender ?? '',
    education: formatEducation(userProfile?.education ?? userProfile?.user_education ?? ''),
    profilePic:
      userProfile?.profilePic || userProfile?.user_profilePic
        ? userProfile?.profilePic || userProfile?.user_profilePic
        : require('../../../assets/images/boss.png'),
    memberSince: memberSinceYear,
  };
}, [auth, userProfile, displayLocation, seekerCategories, seekerExperience]);


  // Logging useEffect
  useEffect(() => {
 
  }, [auth, userProfile, seekerCategories, locationState, displayLocation, profileData]);

  // ================= VALIDATION =================
  const validateProfile = async () => {
    try {
      await profileSchema.validate(profileData, { abortEarly: false });
      Alert.alert(t('validationTitle'), t('profile_validation_success'));
    } catch (err: any) {
      if (err.inner?.length) {
        Alert.alert(t('validationTitle'), t(err.inner[0].message));
      }
    }
  };

 const handleEditBasicDetails = () => {
  setBasicDetails({
    salary: profileData.salary || '',
    email: profileData.email || '',
    alternateMobile:
      userProfile?.alternateMobile ??
      userProfile?.user_alternateMobile ??
      '',
    gender: profileData.gender || '',
    education: userProfile?.education || userProfile?.user_education || '',
  });
  setBasicModalVisible(true);
};


  // ================= PROFILE PIC =================
  const handleProfilePicPress = () => {
    Alert.alert(
      t('profile_upload_photo') || 'Upload Photo',
      t('choose_photo_source') || 'Choose photo source',
      [
        { text: t('camera') || 'Camera', onPress: pickImageFromCamera },
        { text: t('gallery') || 'Gallery', onPress: pickImageFromGallery },
        { text: t('cancel') || 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickImageFromCamera = () => {
    launchCamera({ mediaType: 'photo', cameraType: 'front' }, response => {
      if (response.assets?.length) {
        uploadProfilePicture(response.assets[0]);
      }
    });
  };

  const pickImageFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets?.length) {
        uploadProfilePicture(response.assets[0]);
      }
    });
  };

// ✅ REPLACE THIS FUNCTION IN ProfileScreen.tsx

const fetchEditLocalities = async (search?: string) => {
  const cityName = locationState.city || userProfile?.city;
  if (!cityName) return;

  const cityRes = await locationService.getCitiesByState(26, 1, cityName);
  const cityId = cityRes?.data?.data?.items?.[0]?.id;
  if (!cityId) return;

  setEditLocalityLoading(true);
  try {
    let allLocalities: Locality[] = [];
    let page = 1;

    while (true) {
      const res = await locationService.getLocalitiesByCity(cityId, page, search);
      const items = res.data.data.items;

      allLocalities = [...allLocalities, ...items];

      // Check if there's more data to fetch
      if (items.length < 10) break; // Assuming the limit is 10 per page
      page++;
    }

    setEditLocalities(allLocalities);
  } catch (e) {
  } finally {
    setEditLocalityLoading(false);
  }
};


const uploadProfilePicture = async (asset: any) => {
  if (!asset?.uri) {
    return;
  }

  setProfilePicLoading(true);

  try {
    // ✅ FIX: Check file size (max 5MB for most backends)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
      const sizeMB = (asset.fileSize / (1024 * 1024)).toFixed(2);
      Alert.alert('Error', `Image too large. Max size: 5MB. Your size: ${sizeMB}MB`);
      setProfilePicLoading(false);
      return;
    }

    // ✅ Update Redux immediately with local URI
    dispatch(updateProfileField({ 
      profilePic: asset.uri 
    }));


    // ✅ Call profileService with proper structure
    const uploadResponse = await profileService.uploadProfilePicture(
      profileData.userId,
      {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `profile_${Date.now()}.jpg`,
      }
    );


    // ✅ If backend returns updated profile with new profilePic URL, update with that
    if (uploadResponse?.data?.data?.profilePic) {
      dispatch(updateProfileField({ 
        profilePic: uploadResponse.data.data.profilePic 
      }));
    }

    // ✅ Fetch latest profile from backend to ensure sync
    await dispatch(fetchUserProfile(profileData.userId) as any);

    Alert.alert('Success', 'Profile picture updated successfully!');
  } catch (e: any) {
   
    // ✅ Better error messages
    let errorMsg = 'Failed to upload image';
    if (e?.response?.status === 413) {
      errorMsg = 'Image is too large. Please choose a smaller image (max 5MB)';
    } else if (e?.response?.status === 400) {
      errorMsg = e?.response?.data?.message || 'Invalid image format';
    } else if (e?.response?.data?.message) {
      errorMsg = e.response.data.message;
    } else if (e?.message) {
      errorMsg = e.message;
    }

    Alert.alert('Error', errorMsg);
    
    // ❌ Revert the local change if upload fails
    await dispatch(fetchUserProfile(profileData.userId) as any);
  } finally {
    setProfilePicLoading(false);
  }
};

  // ================= RESUME =================

const requestStoragePermission = async () => {
  // iOS doesn't need explicit storage permission for file picker
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const androidVersion = typeof Platform.Version === 'string' 
      ? parseInt(Platform.Version, 10) 
      : Platform.Version;
    

    // ✅ Android 13+ (API 33+) uses READ_MEDIA_* permissions
    if (androidVersion >= 33) {
      
      try {
        // Request READ_MEDIA_IMAGES (since documents are stored as files)
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Photos Permission Required',
            message: 'This app needs access to your photos and documents to upload a resume.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );


        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (result === PermissionsAndroid.RESULTS.DENIED) {
          return false;
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
    // ✅ Android 6-12 (API 23-32) uses READ_EXTERNAL_STORAGE
    else if (androidVersion >= 23) {
      
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to upload a resume.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );


        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (result === PermissionsAndroid.RESULTS.DENIED) {
          return false;
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          return false;
        }
      } catch (err) {
        return false;
      }
    }

    return true;
  } catch (err) {
    return false;
  }
};



// ================= RESUME UPLOAD WITH IMPROVED PERMISSIONS =================

const handleResumeUpload = async () => {
  try {
    const results = await pick({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      multiple: false,
    });

    if (!results || results.length === 0) return;

    const file = results[0];

    // ✅ File size validation (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size && file.size > MAX_FILE_SIZE) {
      Alert.alert(
        'File Too Large',
        `Resume size ${(file.size / (1024 * 1024)).toFixed(2)}MB. Max allowed 5MB`
      );
      return;
    }

    await uploadResume({
      uri: file.uri,
      type: file.type || 'application/pdf', // ✅ FIXED
      name: file.name || `resume_${Date.now()}.pdf`,
      size: file.size,
    });

  } catch (err: any) {
    // ✅ Correct cancel handling
    if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
      return;
    }

    Alert.alert('Error', 'Failed to select resume');
  }
};


const openResume = async (url?: string) => {
  if (!url) {
    Alert.alert('No Resume', 'Resume not uploaded yet');
    return;
  }

  try {
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert('Unsupported', 'Cannot open this file');
      return;
    }

    await Linking.openURL(url);
  } catch (err) {
    Alert.alert('Error', 'Unable to open resume');
  }
};




// ================= UPLOAD RESUME =================

const uploadResume = async (file: any) => {
  if (!file?.uri) {
    Alert.alert('Error', 'Invalid file selected');
    return;
  }

  setResumeLoading(true);

  try {
    // ✅ Call profileService with proper structure
    const uploadResponse = await profileService.uploadResume(
      profileData.userId,
      {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || `resume_${Date.now()}.pdf`,
      }
    );

    // ✅ If backend returns updated profile with new resume URL
    if (uploadResponse?.data?.data?.resume) {
      dispatch(
        updateProfileField({
          resume: uploadResponse.data.data.resume,
        })
      );
    }

    // ✅ Fetch latest profile
    await dispatch(fetchUserProfile(profileData.userId) as any);

    Alert.alert(
      'Success',
      'Resume uploaded successfully!'
    );
  } catch (error: any) {

    let errorMsg = 'Failed to upload resume';

    if (error?.response?.status === 413) {
      errorMsg = 'File too large. Max: 5MB';
    } else if (error?.response?.status === 400) {
      errorMsg = error?.response?.data?.message || 'Invalid file format';
    } else if (error?.response?.status === 401) {
      errorMsg = 'Session expired. Please login again.';
    } else if (error?.response?.status === 403) {
      errorMsg = 'Permission denied';
    } else if (error?.response?.data?.message) {
      errorMsg = error.response.data.message;
    }

    Alert.alert('Error', errorMsg);
  } finally {
    setResumeLoading(false);
  }
};

// ================= IN YOUR COMPONENT JSX =================

const renderUploadResume = (
  t: any,
  handleResumeUpload: () => void,
  resumeLoading: boolean,
  hasResumeUploaded: boolean
) => (
  <View style={styles.uploadCard}>
    <Image
      source={require('../../../assets/images/cv.png')}
      style={{ width: 50, height: 50 }}
    />

    <View style={{ flex: 1 }}>
      <Text style={styles.uploadText}>
        {t('profile_upload_resume_text') || 'If you have a resume\nupload it here'}
      </Text>
    </View>

    <TouchableOpacity
      style={[
        styles.uploadButton,
        hasResumeUploaded && { borderColor: '#4CAF50' }, // ✅ green border
      ]}
      onPress={hasResumeUploaded ? undefined : handleResumeUpload}
      disabled={resumeLoading || hasResumeUploaded}
    >
      {resumeLoading ? (
        <ActivityIndicator size="small" color={AppColors.themeColor} />
      ) : hasResumeUploaded ? (
        <Icon name="checkmark-circle" size={22} color="#4CAF50" />
      ) : (
        <Text style={styles.uploadButtonText}>Upload</Text>
      )}
    </TouchableOpacity>
  </View>
);

  // ================= EDIT MODAL =================
  const openEditModal = () => {
  setEditModal({
    visible: true,
    fullName: profileData.fullName,
    location: profileData.location,
  });
};

const closeEditModal = () => {
  setEditModal(prev => ({
    ...prev,
    visible: false,
  }));
};
const educationToDisplay = (value: string) => {
  if (value === 'any') return 'Below 10th';
  if (value === 'highschool') return 'High School';
  if (value === 'intermediate') return 'Intermediate';
  return value;
};

const educationToApi = (label: string) => {
  const v = label.toLowerCase();
  if (v === 'below 10th') return 'any';
  if (v === 'high school') return 'highschool';
  if (v === 'intermediate') return 'intermediate';
  return '';
};

const saveBasicDetails = async () => {
  try {
    setLoading(true);

    // ✅ VALIDATION FIRST
    await additionalDetailsSchema.validate(
  {
    email: basicDetails.email,
    alternateMobile: basicDetails.alternateMobile || null,
    salary: basicDetails.salary,
    gender: basicDetails.gender,
    education: basicDetails.education,
  },
  { abortEarly: false }
);


    // 🚀 API CALL
    await profileService.updateAdditionalProfile({
      userId: profileData.userId,
      salary: basicDetails.salary,
      email: basicDetails.email,
      alternateMobile: basicDetails.alternateMobile,
      gender: basicDetails.gender,
      education: basicDetails.education,
    });

    dispatch(
      updateProfileField({
        salary: basicDetails.salary,
        email: basicDetails.email,
        alternateMobile: basicDetails.alternateMobile,
        gender: basicDetails.gender,
        education: basicDetails.education,
      })
    );

    await dispatch(fetchUserProfile(profileData.userId) as any);

    Alert.alert('Success', 'Basic details updated successfully');
    setBasicModalVisible(false);

  } catch (err: any) {
    if (err?.inner?.length) {
      // ✅ show first validation error
      Alert.alert(
        t('validationTitle'),
        t(err.inner[0].message)
      );
    } else {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Update failed'
      );
    }
  } finally {
    setLoading(false);
  }
};



const saveEditedField = async () => {
  const { fullName, location } = editModal;

  if (!fullName || !location) {
    Alert.alert(t('validation'), t('field_cannot_be_empty'));
    return;
  }

  setLoading(true);

  try {

    // ✅ SEND LOCALITY TO BACKEND
    await profileService.updateUserProfileText(
      profileData.userId,
      fullName,
      location // 👈 THIS WAS MISSING
    );

    // ✅ Update redux immediately
    dispatch(
      updateProfileField({
        fullName,
        locality: location,
      })
    );

    // ✅ Re-fetch to confirm persistence
    await dispatch(fetchUserProfile(profileData.userId) as any);

    Alert.alert(t('success'), t('profile_updated_successfully'));
    setEditModal(prev => ({ ...prev, visible: false }));

  } catch (err: any) {

    Alert.alert(
      t('error'),
      err?.response?.data?.message || 'Update failed'
    );
  } finally {
    setLoading(false);
  }
};



  // ================= NAV =================
  const handleFooterTap = (index: number) => setCurrentIndex(index);
  const handleSettingsPress = () => navigation.navigate('SettingsScreen');

 if (dataLoading && !profileData.userId) {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.themeColor} />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    </SafeAreaView>
  );
}

  if (!profileData.userId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>User not logged in</Text>
      </SafeAreaView>
    );
  }

  return (
  <SafeAreaView style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

    <View style={styles.header}>
      <Text style={styles.title}>{t('profile_header_title') || 'My Profile'}</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="logo-whatsapp" size={16} color="#FF6600" />
          <Text style={styles.shareText}>{t('profile_share_app_button') || 'Show App'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Icon name="settings-outline" size={24} color="#000" style={{ marginLeft: 12 }} />
        </TouchableOpacity>
      </View>
    </View>

    {/* ✅ SHOW CONTENT WHILE STILL LOADING */}
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {renderProfileCard(t, validateProfile, profileData, openEditModal, handleProfilePicPress, loading)}
      {renderJobPreferenceCard(t, validateProfile, profileData, navigation)}
      {renderCompletionSection(t)}
      {renderUploadResume(t, handleResumeUpload, resumeLoading, hasResumeUploaded)}
      {renderWorkExperience(t, profileData, handleEditBasicDetails, latestCategory)}
    </ScrollView>

    <Modal visible={editModal.visible} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
        {'Edit Profile'}
      </Text>

      <TextInput
        style={styles.modalInput}
        placeholder="Full Name"
        value={editModal.fullName}
        onChangeText={text =>
          setEditModal(prev => ({ ...prev, fullName: text }))
        }
      />

  <TouchableOpacity
  style={styles.modalInput}
  onPress={() => {
    setEditLocalitySearch('');
    fetchEditLocalities();
    setShowEditLocalityModal(true);
  }}
>
  <Text style={{ color: editModal.location ? '#000' : '#999' }}>
    {editModal.location || 'Select Locality'}
  </Text>
</TouchableOpacity>


      <View style={{ flexDirection: 'row', gap: scale(10) }}>
        <TouchableOpacity
          style={styles.cancelEditButton}
          onPress={() => setEditModal(prev => ({ ...prev, visible: false }))}
        >
          <Text style={styles.cancelText}>
            {'Cancel'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callHRButton}
          onPress={saveEditedField}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.callHRText}>
              { 'Save'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

<Modal visible={showEditLocalityModal} transparent animationType="slide">
  <View style={styles.bottomSheetOverlay}>
    <View style={styles.bottomSheet}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Choose Locality</Text>
        <TouchableOpacity onPress={() => setShowEditLocalityModal(false)}>
          <Icon name="close" size={20} />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search locality..."
        style={styles.searchBar}
        value={editLocalitySearch}
        onChangeText={text => {
          setEditLocalitySearch(text);
          fetchEditLocalities(text);
        }}
      />

      {editLocalityLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
  data={editLocalities}
  keyExtractor={(item: Locality) => String(item.id)}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
  showsVerticalScrollIndicator={true}
  contentContainerStyle={{ paddingBottom: verticalScale(20) }}
  renderItem={({ item }: { item: Locality }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setEditModal(prev => ({
          ...prev,
          location: item.name,
        }));
        setShowEditLocalityModal(false);
      }}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
    </TouchableOpacity>
  )}
/>

      )}
    </View>
  </View>
</Modal>
<Modal visible={basicModalVisible} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Basic Details</Text>

      {/* Salary */}
      <Text style={styles.label}>Salary</Text>
      <TextInput
        style={styles.modalInput}
        placeholder="Enter salary"
        keyboardType="numeric"
        value={basicDetails.salary}
        onChangeText={text =>
          setBasicDetails(prev => ({ ...prev, salary: text }))
        }
      />

      {/* Email */}
     <Text style={styles.label}>Email</Text>
<TextInput
  style={styles.modalInput}
  placeholder="Enter email"
  keyboardType="email-address"
  autoCapitalize="none"      // ✅ IMPORTANT
  autoCorrect={false}        // ✅ IMPORTANT
  value={basicDetails.email}
  onChangeText={text =>
    setBasicDetails(prev => ({
      ...prev,
      email: text.trimStart(), // prevents leading spaces
    }))
  }
/>


      {/* Alternate Mobile */}
      <Text style={styles.label}>Alternate Mobile Number</Text>
      <TextInput
  style={styles.modalInput}
  placeholder="Enter alternate number"
  keyboardType="phone-pad"
  maxLength={10} // ✅ hard stop at 10 digits
  value={basicDetails.alternateMobile}
  onChangeText={text => {
    // allow only numbers
    const numeric = text.replace(/[^0-9]/g, '');
    setBasicDetails(prev => ({
      ...prev,
      alternateMobile: numeric,
    }));
  }}
/>


      {/* Gender (CHIPS) */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        {genderOptions.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              basicDetails.gender === item && styles.chipSelected,
            ]}
            onPress={() =>
              setBasicDetails(prev => ({ ...prev, gender: item }))
            }
          >
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Education (CHIPS) */}
      <Text style={styles.label}>Education</Text>
      <View style={styles.wrap}>
        {educationOptions.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.chip,
              basicDetails.education === item.key && styles.chipSelected,
            ]}
            onPress={() =>
              setBasicDetails(prev => ({
                ...prev,
                education: item.key,
              }))
            }
          >
            <Text style={styles.chipText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: "row", gap: scale(10), marginTop: scale(12) }}>
        <TouchableOpacity
          style={styles.cancelEditButton}
          onPress={() => setBasicModalVisible(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callHRButton}
          onPress={saveBasicDetails}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.callHRText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      <AppFooter currentIndex={currentIndex} onTap={handleFooterTap} />
    </SafeAreaView>
  );
};

// ================= RENDER HELPERS =================
const renderProfileCard = (
  t: any,
  validateProfile: () => void,
  profileData: ProfileData,
openEditModal: () => void,
  handleProfilePicPress: () => void,
  loading: boolean,
  localProfilePic?: string
) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
   <View style={styles.profilePicContainer}>
  <TouchableOpacity
    onPress={handleProfilePicPress}
    disabled={loading}
    style={styles.imageOuterWrapper}
  >
    <View style={styles.imageInnerWrapper}>
    <Image
  source={
    typeof profileData.profilePic === 'string'
      ? { uri: profileData.profilePic }
      : profileData.profilePic
  }
  style={styles.profileImage}
/>


    </View>

    <View style={styles.cameraIconContainer}>
      <Icon name="camera-outline" size={18} color="#000" />
    </View>
  </TouchableOpacity>
</View>

      <View style={{ marginLeft: 12, flex: 1 }}>
  <Text style={styles.profileName}>{profileData.fullName}</Text>
  <Text style={styles.profileSub}>
    {`Member since ${profileData.memberSince}`}
  </Text>
</View>

<TouchableOpacity
  style={styles.iconButtonBorder}
onPress={openEditModal}
>
  <Icon name="pencil-outline" size={18} color="#999" />
</TouchableOpacity>

    </View>

    <View style={{ marginTop: 12 }}>
<View style={styles.infoRow}>
  <Icon name="call" size={14} color="#999" />
  <Text style={styles.infoText}>{profileData.phone}</Text>
</View>

<View style={styles.infoRow}>
  <Icon name="location" size={14} color="#999" />
  <Text style={styles.infoText}>{profileData.location}</Text>
</View>

    </View>
  </View>
);

const openSelectJobRole = (navigation: any) => {
  navigation.navigate('JobRoleScreen');
};

const renderJobPreferenceCard = (
  t: any,
  validateProfile: () => void,
  profileData: ProfileData,
  navigation: any // <-- pass navigation here
) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_looking_for_jobs') || 'Looking for jobs'}</Text>
      <TouchableOpacity
        style={styles.iconButtonBorder}
        onPress={() => openSelectJobRole(navigation)}
      >
        <Icon name="pencil-outline" size={18} color="#999" />
      </TouchableOpacity>
    </View>

    {/* Display skills as chips */}
    <View style={styles.chipsContainer}>
      {profileData.skills.length > 0 ? (
        profileData.skills.map((skill, index) => (
          <Text key={index} style={styles.chipJob}>{skill}</Text>
        ))
      ) : (
        <Text style={styles.chipJob}>{t('role_customer_support') || 'Customer Support / Telecaller'}</Text>
      )}
    </View>
  </View>
);


const renderCompletionSection = (t: any) => (
  <View style={styles.completionContainer}>
    <Text style={styles.completionTitle}>
      {t('profile_completion_title') || 'Add 3 missing details to get more job responses'}
    </Text>

    <View style={styles.completionRow}>
      <View style={styles.progressWrapper}>
        <View style={styles.progressBase}>
          <View style={styles.progressFill} />
          <Text style={styles.progressLabel}>18%{'\n'}done</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { icon: 'briefcase-outline', color: '#E91E63', title: t('profile_add_work') || 'Add work', subtitle: t('profile_let_know_better') || 'Let us know better' },
          { icon: 'star-outline', color: '#9C27B0', title: t('profile_add_skills') || 'Add skills', subtitle: t('profile_boost_profile') || 'Boost your profile' },
          { icon: 'document-attach-outline', color: '#4CAF50', title: t('profile_have_resume') || 'Have a resume?', subtitle: t('profile_upload_here') || 'Upload it here' },
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



const renderWorkExperience = (
  t: any,
  profileData: ProfileData,
  onEditBasicDetails: () => void,
  latestCategory: any // 👈 ADD THIS
) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_work_experience') || 'Work experience'}</Text>
      <Text style={{ color: AppColors.themeColor, fontWeight: '600' }}>{t('profile_add_new') || 'Add New'}</Text>
    </View>
{/* Display work experience in new line format */}
{profileData.skills.length > 0 && Object.keys(profileData.experience).length > 0 && (
  <View style={{ marginVertical: 10 }}>
    {profileData.skills.map((skill, index) => (
      <View key={index} style={{ alignItems: 'flex-start', marginVertical: 4 }}>
<View style={styles.experienceRow}>
  <View style={styles.greyDot} />
  <Text style={styles.subText}>{skill}</Text>
</View>
        <Text style={styles.subText}>
          {profileData.experience[skill] ? profileData.experience[skill] : '0 years'}
        </Text>
        <TouchableOpacity>
          <Text style={[styles.link, { fontWeight: '600' }]}>
            {t('profile_add_company_details') || 'Add company details'}
          </Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
)}


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
        <Text style={styles.greenTextUp}>{t('profile_boost_chat_title') || 'Boost on chat'}</Text>
        <Text style={styles.greenTextDown}>{t('profile_boost_chat_desc') || 'Get more responses'}</Text>
      </View>
    </LinearGradient>

    {/* REMOVED SKILLS SECTION */}

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_skills') || 'Skills'}</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor} />
      </TouchableOpacity>
    </View>
 
  <TouchableOpacity>
    <Text style={[styles.link, { fontWeight: '700' }]}>
       {t('profile_add') || 'Add'}
    </Text>
  </TouchableOpacity>

{/* ================= CATEGORY DETAILS ================= */}
{latestCategory?.questions?.length > 0 && (
  <View style={{ marginTop: verticalScale(10) }}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={styles.sectionTitle}>Category Details</Text>
      <TouchableOpacity>
        <Icon name="pencil" size={18} color={AppColors.themeColor} />
      </TouchableOpacity>
    </View>

    {latestCategory.questions.map((item: any, index: number) => (
      <View key={index} style={{ marginBottom: verticalScale(8) }}>
        {/* Question */}
        <Text style={styles.subText}>
          {item.question}
        </Text>

        {/* Answer */}
        <Text style={[styles.link, { fontWeight: '700' }]}>
          {Array.isArray(item.answers)
            ? item.answers.join(', ')
            : item.answers}
        </Text>
      </View>
    ))}
  </View>
)}

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{t('profile_basic_details') || 'Basic details'}</Text>
    <TouchableOpacity onPress={onEditBasicDetails}>
  <Icon name="pencil" size={18} color={AppColors.themeColor} />
</TouchableOpacity>


    </View>
  <Text style={styles.subText}>
  {t('profile_current_salary') || 'Current salary'}
</Text>
<Text style={[styles.link, { fontWeight: '700' }]}>
  {profileData.salary ? profileData.salary : 'Add'}
</Text>

<Text style={styles.subText}>
  {t('profile_email_id') || 'Email id'}
</Text>
<Text style={[styles.link, { fontWeight: '700' }]}>
  {profileData.email ? profileData.email : 'Add'}
</Text>

<Text style={styles.subText}>
  {t('profile_alternate_phone') || 'Alternate phone number'}
</Text>
<Text style={[styles.link, { fontWeight: '700' }]}>
  {profileData.alternateMobile ? profileData.alternateMobile : 'Add'}
</Text>

<Text style={styles.subText}>
  {t('profile_age_gender') || 'Age / Gender'}
</Text>
<Text style={[styles.link, { fontWeight: '700' }]}>
  {profileData.gender ? profileData.gender : 'Add'}
</Text>

<Text style={styles.subText}>
  {t('profile_education_level') || 'Education level'}
</Text>
<Text style={[styles.subText, { fontWeight: '700', color: '#000' }]}>
  {profileData.education ? profileData.education : 'Add'}
</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  loadingText: {
    marginTop: verticalScale(12),
    color: '#999',
    fontSize: moderateScale(12),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android'
      ? verticalScale(StatusBar.currentHeight! - 10)
      : verticalScale(10),
    paddingHorizontal: scale(14.4),
    paddingBottom: verticalScale(8),
  },

  title: { fontSize: scale(13.5), fontWeight: '700', color: '#000' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  shareButton: {
    flexDirection: 'row',
    borderWidth: scale(0.8),
    borderColor: '#FF6600',
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3.2),
    alignItems: 'center',
  },
  shareText: { color: '#FF6600', marginLeft: scale(4), fontWeight: '600' },

  scrollContainer: { padding: scale(12), paddingBottom: verticalScale(64) },

  iconButtonBorder: {
    padding: scale(5),
    borderWidth: scale(0.8),
    borderColor: '#ccc',
    borderRadius: moderateScale(6),
  },
  cancelEditButton:{
  flex: 1,
  borderColor: AppColors.buttons,
  borderWidth:1,
  paddingVertical: verticalScale(12),
  borderRadius: moderateScale(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: scale(4),
  },
callHRButton: {
  flex: 1,
  backgroundColor: AppColors.buttons,
  paddingVertical: verticalScale(12),
  borderRadius: moderateScale(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: scale(4),
},
cancelText:{
  fontSize: moderateScale(12),
  fontWeight: '600',
  color: AppColors.themeColor,
},
callHRText: {
  fontSize: moderateScale(12),
  fontWeight: '600',
  color: '#fff',
},

  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
    padding: scale(12),
    marginBottom: verticalScale(12),
    borderWidth: scale(0.4),
    borderColor: '#ddd',
    shadowColor: '#6dc4f7ff',
    shadowOpacity: 1,
    shadowRadius: moderateScale(8),
    elevation: 3,
  },
bottomSheetOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'flex-end',
},

bottomSheet: {
  backgroundColor: '#fff',
  borderTopLeftRadius: moderateScale(16),
  borderTopRightRadius: moderateScale(16),
  padding: scale(16),
  maxHeight: '70%',
},


sheetHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: verticalScale(10),
},

sheetTitle: {
  fontSize: moderateScale(14),
  fontWeight: '700',
  color: '#000',
},

searchBar: {
  borderWidth: scale(1),
  borderColor: '#ddd',
  borderRadius: moderateScale(8),
  paddingHorizontal: scale(10),
  paddingVertical: verticalScale(8),
  marginBottom: verticalScale(10),
},

listItem: {
  paddingVertical: verticalScale(10),
  borderBottomWidth: scale(0.5),
  borderColor: '#eee',
},

listItemText: {
  fontSize: moderateScale(12),
  color: '#000',
},
label: {
  marginTop: verticalScale(6),
  fontSize: moderateScale(12),
  fontWeight: "600",
},

row: {
  flexDirection: "row",
  gap: scale(8),
  marginVertical: verticalScale(6),
},

wrap: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: scale(8),
  marginVertical: verticalScale(6),
},

chip: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: scale(18),
  paddingVertical: verticalScale(6),
  paddingHorizontal: scale(12),
  
},

chipSelected: {
  backgroundColor: "#e7f6f6",
  borderColor: "#099ca4",
},

chipText: {
  fontSize: moderateScale(11),
  color: "#000",
},


  profilePicContainer: {
    position: 'relative',

  },
 imageOuterWrapper: {
  padding: scale(4),        // 👈 space around image
  borderRadius: 40,
  backgroundColor: '#e491bfff',
  
},

imageInnerWrapper: {
  padding: scale(2),        // 👈 space between image & border
  borderRadius: 30,
  backgroundColor: '#fff',
},

profileImage: {
  width: 45,
  height: 45,
  borderRadius: 28,

},

  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileName: { fontSize: moderateScale(12.8), fontWeight: '700', color: '#000' },
  profileSub: { fontSize: moderateScale(10.4), color: 'gray' },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: verticalScale(4) },
  infoText: { marginLeft: scale(4), fontSize: moderateScale(10.4), color: '#333' },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: verticalScale(8),
  },

  chipJob: {
    marginTop: verticalScale(4),
    marginRight: scale(8),
    borderWidth: scale(0.8),
    borderColor: '#ddd',
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(9),
     paddingVertical: verticalScale(4),
    
    color: '#555',
  },

  completionContainer: {
    backgroundColor: '#fff0de',
    padding: scale(12),
    marginVertical: verticalScale(10),
    marginHorizontal: scale(-12),
  },
  completionTitle: {
    fontWeight: '600',
    fontSize: moderateScale(10.4),
    marginBottom: verticalScale(8),
    color: '#000',
  },

  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressWrapper: {
    width: scale(48),
    height: scale(48),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  progressBase: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: scale(3.2),
    borderColor: '#ffd7d9',
  },
  progressFill: {
    position: 'absolute',
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderTopColor: '#E91E63',
    borderTopWidth: scale(4),
    borderRightColor: 'transparent',
    borderRightWidth: scale(4),
    borderBottomColor: 'transparent',
    borderBottomWidth: scale(4),
    borderLeftColor: 'transparent',
    borderLeftWidth: scale(4),
    transform: [{ rotate: '65deg' }],
  },
  progressLabel: {
    fontSize: moderateScale(9.6),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },

  completionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: scale(8),
    marginRight: scale(8),
    borderRadius: moderateScale(6.4),
    width: scale(160),
    elevation: 2,
  },
  iconBox: {
    width: scale(32),
    height: scale(32),
    borderRadius: moderateScale(6.4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionTitleText: {
    fontWeight: '600',
    color: '#333',
    fontSize: moderateScale(9.6),
  },
  completionSubText: { color: '#777', fontSize: moderateScale(9.6) },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    marginBottom: verticalScale(8),
  },
  uploadText: {
    fontWeight: '600',
    fontSize: moderateScale(10.4),
    color: '#000',
    marginLeft: scale(8),
  },
  uploadButton: {
    borderWidth: scale(0.8),
    borderColor: AppColors.themeColor,
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(3.2),
  },
  uploadButtonText: { color: AppColors.themeColor, fontWeight: '600' },

  sectionTitle: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#000',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
  },
  
  skillsInlineContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: verticalScale(4),
  marginBottom: verticalScale(6),
},

  subHeading: {
    fontSize: moderateScale(11.2),
    fontWeight: '600',
    color: '#000',
    marginBottom: verticalScale(4),
  },
  experienceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: scale(6),
},

greyDot: {
  width: scale(6),
  height: scale(6),
  borderRadius: scale(3),
  backgroundColor: '#bdbdbd',
},

  subText: {
    color: '#555',
    fontSize: moderateScale(10.4),
    marginBottom: verticalScale(4),
  },
  link: { color: AppColors.themeColor, fontSize: moderateScale(10.4), fontWeight: '600', marginBottom: verticalScale(4) },

  greenBox: {
    flexDirection: 'row',
    padding: scale(12),
    borderRadius: moderateScale(8),
    marginVertical: verticalScale(8),
  },
  greenTextUp: {
    marginLeft: scale(6.4),
    color: '#333',
    fontSize: moderateScale(11.2),
    flex: 1,
    fontWeight: '800',
  },
  greenTextDown: { marginLeft: scale(6.4), color: '#333', fontSize: moderateScale(9.6), flex: 1 },

  boyImage: {
    width: scale(40),
    height: scale(40),
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    padding: scale(20),
    paddingBottom: verticalScale(30),
  },
  modalTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#000',
    marginBottom: verticalScale(16),
  },
  modalInput: {
    borderWidth: scale(1),
    borderColor: '#ddd',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(14),
    marginVertical: verticalScale(5),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginHorizontal: scale(8),
  },
  cancelButton: {
    borderWidth: scale(1),
    borderColor: AppColors.themeColor,
  },
  cancelButtonText: {
    color: AppColors.themeColor,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: AppColors.themeColor,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProfileScreen;