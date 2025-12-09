import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppColors } from '../../constants/AppColors';
import { RootStackParamList } from '../../../App';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeekerCategories } from '../../redux/slices/seekerCategorySlice';
import { RootState } from '../../redux/store';
import { seekerExperienceService } from '../../services/seekerExperienceService';
import * as Yup from 'yup';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetailsScreen'>;

interface JobRole {
  id: string;
  title: string;
  image: any;
  categoryId?: number;
}

interface Question {
  id: string;
  question: string;
  type: 'single' | 'multi';
  options: string[];
}

interface RoleConfig {
  image: any;
  title: string;
  questions: Question[];
}

interface RoleQuestionsConfig {
  [key: string]: RoleConfig;
}

interface RoleAnswer {
  role: string;
  selectedExperience: string | null;
  selectedMulti: Record<string, Set<string>>;
}

interface CompletedRoles {
  [key: string]: RoleAnswer;
}

interface ChipProps {
  label: string;
  isSelected: boolean;
  onTap: () => void;
  showIcon: boolean;
  isSaving?: boolean;
}

interface SeekerCategoryItem {
  job_id: number;
  job_categoryid: number;
  category_name: string;
  category_image: string | null;
}

const jobDetailsSchema = Yup.object().shape({
  experience: Yup.string().required('jobDetails_validationExperience'),
  multi: Yup.object().test('multi-selected', () => true),
});

// Mapping of translation keys to actual experience text
const experienceTextMap: Record<string, string> = {
  'jobDetails_option_fresher': 'Fresher',
  'jobDetails_option_1_6_months': '1-6 months',
  'jobDetails_option_1_year': '1 year',
  'jobDetails_option_2_years': '2 years',
  'jobDetails_option_3_years': '3 years',
  'jobDetails_option_4_years': '4 years',
  'jobDetails_option_5_plus_years': '5 years',
};

// Static fallback role questions config - applied to ALL roles
const universalQuestions: Question[] = [
  {
    id: 'experience',
    question: 'jobDetails_question_experience',
    type: 'single',
    options: [
      'jobDetails_option_fresher',
      'jobDetails_option_1_6_months',
      'jobDetails_option_1_year',
      'jobDetails_option_2_years',
      'jobDetails_option_3_years',
      'jobDetails_option_4_years',
      'jobDetails_option_5_plus_years',
    ],
  },
];

// This config now applies SAME questions for ALL roles
const roleQuestionsConfig: RoleQuestionsConfig = {
  default: {
    image: require('../../../assets/images/sales-job.jpg'),
    title: 'jobDetails_default_title',
    questions: universalQuestions,
  },
};

const JobDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { selectedRoles, currentRoleIndex, completedRoles, totalRoles } = route.params;

  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { categories, fetchLoading } = useSelector(
    (state: RootState) => state.seekerCategory
  );

  const currentRole: JobRole = selectedRoles[currentRoleIndex];
  const roleConfig: RoleConfig = roleQuestionsConfig[currentRole.id] || roleQuestionsConfig.default;

  const [dynamicJobData, setDynamicJobData] = useState<SeekerCategoryItem | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<Record<string, Set<string>>>({});
  const [savingExperienceKey, setSavingExperienceKey] = useState<string | null>(null);
  const [existingExperienceId, setExistingExperienceId] = useState<number | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    console.log('🚀 JobDetailsScreen mounted, fetching categories for userId:', userId);
    if (userId) {
      dispatch(
        fetchSeekerCategories({ page: 1, limit: 100, userId: Number(userId) }) as any
      );
    }
  }, [dispatch, userId]);

  // Find matching job data for current role
  useEffect(() => {
    console.log('📍 Current Role ID:', currentRole.id);
    console.log('📊 Available Categories:', categories.length);

    if (categories.length > 0 && currentRole.categoryId) {
      const matchedCategory = categories.find(
        (cat) => cat.job_categoryid === currentRole.categoryId
      );

      if (matchedCategory) {
        console.log('✅ Found matching category:', matchedCategory);
        setDynamicJobData(matchedCategory);
      } else {
        console.log('❌ No matching category found for categoryId:', currentRole.categoryId);
      }
    }
  }, [categories, currentRole]);

  // Fetch existing experience for current category on mount
  useEffect(() => {
    const fetchExistingExperience = async () => {
      try {
        if (currentRole.categoryId && userId) {
          console.log('🔍 Fetching existing experience for categoryId:', currentRole.categoryId);
          const response = await seekerExperienceService.getSeekerExperienceByCategoryAndUser(
            currentRole.categoryId,
            Number(userId)
          );

          if (response.data?.data && response.data.data.length > 0) {
            const existingExperience = response.data.data[0];
            console.log('✅ Found existing experience:', existingExperience);
            setExistingExperienceId(existingExperience.id);
          }
        }
      } catch (error) {
        console.log('ℹ️ No existing experience found or error fetching:', error);
      }
    };

    fetchExistingExperience();
  }, [currentRole.categoryId, userId]);

  const progressPercentage = ((currentRoleIndex + 1) / totalRoles) * 100;

  const handleSingleSelect = async (value: string): Promise<void> => {
    setSelectedExperience(value);
    setSavingExperienceKey(value);

    try {
      // Get the actual experience text from the mapping
      const experienceText = experienceTextMap[value];

      const payload = {
        categoryId: currentRole.categoryId || 0,
        userId: Number(userId),
        experience: experienceText,
        status: 1,
        createdBy: Number(userId),
      };

      console.log('========================================');
      if (existingExperienceId) {
        console.log('📤 SEEKER EXPERIENCE API CALL (UPDATE)');
      } else {
        console.log('📤 SEEKER EXPERIENCE API CALL (CREATE)');
      }
      console.log('========================================');
      console.log('🔗 Endpoint: ' + (existingExperienceId ? 'PUT' : 'POST') + ' /api/seeker-experience' + (existingExperienceId ? `/${existingExperienceId}` : ''));
      console.log('📦 Payload:', payload);
      console.log('  - categoryId:', payload.categoryId);
      console.log('  - userId:', payload.userId);
      console.log('  - experience:', payload.experience);
      console.log('  - status:', payload.status);
      console.log('  - createdBy:', payload.createdBy);
      console.log('========================================');

      let response;
      if (existingExperienceId) {
        // Update existing experience
        response = await seekerExperienceService.updateSeekerExperience(existingExperienceId, payload);
      } else {
        // Create new experience
        response = await seekerExperienceService.saveSeekerExperience(payload);
      }

      console.log('========================================');
      console.log('✅ SEEKER EXPERIENCE SAVED SUCCESSFULLY');
      console.log('========================================');
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', response.data);
      console.log('========================================');

      // Store the experience ID if it's a new creation
      if (!existingExperienceId && response.data?.data?.id) {
        setExistingExperienceId(response.data.data.id);
        console.log('📌 Stored experience ID:', response.data.data.id);
      }
    } catch (error: any) {
      console.log('========================================');
      console.log('❌ ERROR SAVING SEEKER EXPERIENCE');
      console.log('========================================');
      console.log('🚨 Error Status:', error?.response?.status);
      console.log('🚨 Error Message:', error?.message);
      console.log('🚨 Response Data:', error?.response?.data);
      console.log('🚨 Full Error:', error);
      console.log('========================================');

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save experience. Please try again.';
      Alert.alert(t('validationTitle'), errorMessage);
    } finally {
      setSavingExperienceKey(null);
    }
  };

  const handleMultiSelect = (questionId: string, value: string): void => {
    setSelectedMulti((prev) => {
      const currentSet = prev[questionId] || new Set();
      const newSet = new Set(currentSet);

      if (newSet.has(value)) newSet.delete(value);
      else newSet.add(value);

      return { ...prev, [questionId]: newSet };
    });
  };

  const handleNext = async (): Promise<void> => {
    try {
      await jobDetailsSchema.validate(
        {
          experience: selectedExperience,
          multi: selectedMulti,
        },
        { abortEarly: false }
      );
    } catch (err: any) {
      if (err.inner && err.inner.length > 0) {
        const message = err.inner[0].message;
        Alert.alert(t('validationTitle'), t(message));
      } else {
        Alert.alert(t('validationTitle'), t('jobDetails_validationExperience'));
      }
      return;
    }

    const updatedAnswers: CompletedRoles = {
      ...completedRoles,
      [currentRole.id]: {
        role: currentRole.title,
        selectedExperience,
        selectedMulti,
      },
    };

    if (currentRoleIndex === totalRoles - 1) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'HomeScreen',
            params: { roleAnswers: updatedAnswers, fromJobInfo: true },
          },
        ],
      });
    } else {
      navigation.replace('JobDetailsScreen', {
        selectedRoles,
        currentRoleIndex: currentRoleIndex + 1,
        completedRoles: updatedAnswers,
        totalRoles,
      });

      setSelectedExperience(null);
      setSelectedMulti({});
    }
  };

  const renderChip = ({ label, isSelected, onTap, showIcon, isSaving }: ChipProps) => (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onTap}
      disabled={isSaving}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {t(label)}
      </Text>
      {showIcon && (
        <View style={{ marginLeft: 6 }}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#71695f" />
          ) : isSelected ? (
            <Ionicons name="checkmark" size={16} color="#71695f" />
          ) : (
            <Ionicons name="add" size={16} color="#999" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderQuestion = (question: Question) => (
    <View key={question.id} style={styles.questionSection}>
      <Text style={styles.questionText}>{t(question.question)}</Text>
      <View style={styles.chipsContainer}>
        {question.options.map((option) => (
          <View key={option} style={styles.chipWrapper}>
            {renderChip({
              label: option,
              isSelected: question.type === 'single'
                ? selectedExperience === option
                : (selectedMulti[question.id] || new Set()).has(option),
              showIcon: question.type === 'multi',
              isSaving: question.type === 'single' && savingExperienceKey === option,
              onTap: () =>
                question.type === 'single'
                  ? handleSingleSelect(option)
                  : handleMultiSelect(question.id, option),
            })}
          </View>
        ))}
      </View>
    </View>
  );

  // Show loading while fetching categories
  if (fetchLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={AppColors.themeColor} />
          <Text style={{ marginTop: 10, color: '#999' }}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Determine which image and title to display
  const displayJobImage = dynamicJobData?.category_image
    ? { uri: dynamicJobData.category_image }
    : roleConfig?.image || require('../../../assets/images/sales-job.jpg');

  const displayJobTitle = dynamicJobData?.category_name || t(roleConfig?.title || '');

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
      </View>

      {/* Role Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Image source={displayJobImage} style={styles.jobImage} />
          <Text style={styles.jobTitleCenter} numberOfLines={2}>
            {displayJobTitle}
          </Text>
        </View>
      </View>

      {/* Questions */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {roleConfig?.questions && roleConfig.questions.map((q) => renderQuestion(q))}
      </ScrollView>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>{t('jobDetails_next')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
  },
  progressBar: { height: '100%', backgroundColor: AppColors.themeColor, borderRadius: 10 },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomColor: '#f0f0f0' },
  jobImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15, resizeMode: 'cover' },
  headerCenter: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  jobTitleCenter: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
  },
  jobSubtitleCenter: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  jobTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 4 },
  jobSubtitle: { fontSize: 12, color: '#999' },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingHorizontal: 20, paddingVertical: 20 },
  questionSection: { marginBottom: 25 },
  questionText: { fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chipWrapper: { marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, backgroundColor: '#e3e3e3' },
  chipSelected: { borderColor: '#ffddb5', backgroundColor: '#ffddb5' },
  chipText: { fontSize: 13, fontWeight: '500', color: '#929292' },
  chipTextSelected: { fontWeight: '600', color: '#71695f' },
  buttonContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderTopColor: '#f0f0f0' },
  nextButton: { height: 50, backgroundColor: AppColors.themeColor, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});