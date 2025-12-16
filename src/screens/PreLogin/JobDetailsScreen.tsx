import React, { useState, useEffect } from 'react';
import {
View,
Text,
SafeAreaView,
ScrollView,
StyleSheet,
TouchableOpacity,
StatusBar,
ActivityIndicator,
Image,
Platform,
Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppColors } from '../../constants/AppColors';
import { RootStackParamList } from '../../../App';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeekerCategories } from '../../redux/slices/seekerCategorySlice';
import { RootState } from '../../redux/store';
import { useTranslation } from 'react-i18next';
import type { SeekerCategoryItem  } from "../../redux/slices/seekerCategorySlice";
import { seekerExperienceService } from '../../services/seekerExperienceService';
import { masterQuestionService } from '../../services/masterQuestionService';
import { jobQuestionAnswerService } from '../../services/jobQuestionAnswerService';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import * as Yup from 'yup';

/* ----------------------------- TYPES ----------------------------- */

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetailsScreen'>;

interface JobRole {
id: string;
title: string;
image: any;
categoryId?: number;
}

interface DynamicQuestion {
id: number;
question: string;
options: string[];
}

interface CompletedRoles {
  [roleId: string]: {
    role: string;
    selectedExperience: string | null;
    selectedMulti: Record<string, Set<string>>;
  };
}

interface ChipProps {
label: string;
isSelected: boolean;
onTap: () => void;
showIcon: boolean;
isSaving?: boolean;
}

/* ----------------------------- VALIDATION ----------------------------- */

const jobDetailsSchema = Yup.object().shape({
experience: Yup.string().required('jobDetails_validationExperience'),
});

/* ----------------------------- EXPERIENCE MAP ----------------------------- */

const experienceTextMap: Record<string, string> = {
jobDetails_option_fresher: '0',
jobDetails_option_1_6_months: '0.5',
jobDetails_option_1_year: '1',
jobDetails_option_2_years: '2',
jobDetails_option_3_years: '3',
jobDetails_option_4_years: '4',
jobDetails_option_5_plus_years: '5',
};

/* ----------------------------- STATIC EXPERIENCE QUESTION ----------------------------- */

const EXPERIENCE_OPTIONS = [
'jobDetails_option_fresher',
'jobDetails_option_1_6_months',
'jobDetails_option_1_year',
'jobDetails_option_2_years',
'jobDetails_option_3_years',
'jobDetails_option_4_years',
'jobDetails_option_5_plus_years',
];

/* ----------------------------- COMPONENT ----------------------------- */

const JobDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
const { t } = useTranslation();
const { selectedRoles, currentRoleIndex, completedRoles, totalRoles } = route.params;

const dispatch = useDispatch();
const userId = useSelector((state: RootState) => state.auth.userId);
const { categories, fetchLoading } = useSelector(
  (state: RootState) => state.seekerCategory
);

const currentRole: JobRole = selectedRoles[currentRoleIndex];
const roleImage = require('../../../assets/images/sales-job.jpg'); // fallback

const [dynamicJobData, setDynamicJobData] = useState<SeekerCategoryItem | null>(null);
const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
const [selectedMulti, setSelectedMulti] = useState<Record<string, Set<string>>>({});
const [savingExperienceKey, setSavingExperienceKey] = useState<string | null>(null);
const [existingExperienceId, setExistingExperienceId] = useState<number | null>(null);
const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);
// Map questionId + option -> answerId
const [answerIdMap, setAnswerIdMap] = useState<Record<string, number>>({});

/* ---------- fetch categories (unchanged) ---------- */
useEffect(() => {
  if (userId) {
    dispatch(
      fetchSeekerCategories({ page: 1, limit: 100, userId: Number(userId) }) as any
    );
  }
}, [dispatch, userId]);

/* ---------- match category data (unchanged) ---------- */
useEffect(() => {
  if (categories.length > 0 && currentRole.categoryId) {
    const matchedCategory = categories.find(
      (cat) => cat.job_categoryid === currentRole.categoryId
    );

    if (matchedCategory) {
      setDynamicJobData(matchedCategory);
    } else {
      setDynamicJobData(null);
    }
  }
}, [categories, currentRole]);

/* ---------- fetch existing experience (unchanged) ---------- */
useEffect(() => {
  const fetchExistingExperience = async () => {
    try {
      if (currentRole.categoryId && userId) {
        const response = await seekerExperienceService.getSeekerExperienceByCategoryAndUser(
          currentRole.categoryId,
          Number(userId)
        );

        if (response.data?.data && response.data.data.length > 0) {
          const existingExperience = response.data.data[0];
          setExistingExperienceId(existingExperience.id);
          // If you'd like to prefill selectedExperience from existingExperience,
          // you'd map server value back to keys in experienceTextMap - omitted for brevity.
        }
      }
    } catch (error) {
      // console.log('fetchExistingExperience error', error);
    }
  };

  fetchExistingExperience();
}, [currentRole.categoryId, userId]);

/* ---------- fetch dynamic questions & their options ---------- */
useEffect(() => {
  const fetchDynamicQuestions = async () => {
    try {
      setLoadingQuestions(true);
      setDynamicQuestions([]);

      if (!currentRole.categoryId) {
        setLoadingQuestions(false);
        return;
      }

      const qRes = await masterQuestionService.getQuestionsByCategory(currentRole.categoryId);

      const items = qRes.data?.data?.items || [];
      const final: DynamicQuestion[] = [];

      // fetch options for each question in sequence (could be parallelized)
      for (const q of items) {
        try {
          const optRes = await masterQuestionService.getOptionsByQuestionId(q.id);
          const options = optRes.data?.data?.items?.map((o: any) => o.optionText) || [];
          final.push({
            id: q.id,
            question: q.description || '',
            options,
          });
        } catch (err) {
          // if fetching options fails for a question, continue with empty options
          final.push({
            id: q.id,
            question: q.description || '',
            options: [],
          });
        }
      }

      setDynamicQuestions(final);
    } catch (err) {
      // console.log('Error loading dynamic questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  fetchDynamicQuestions();
}, [currentRole.categoryId]);

/* ---------- progress ---------- */
const progressPercentage = ((currentRoleIndex + 1) / totalRoles) * 100;

/* ---------- handle single-select (experience) ---------- */
const handleSingleSelect = async (value: string): Promise<void> => {
  setSelectedExperience(value);
  setSavingExperienceKey(value);

  try {
    // Map translation key (value) to actual experience text for backend
    const experienceText = experienceTextMap[value] ?? null;

    const payload = {
      categoryId: currentRole.categoryId || 0,
      userId: Number(userId),
      experience: experienceText,
      status: 1,
      createdBy: Number(userId),
    };

    let response;
    if (existingExperienceId) {
      response = await seekerExperienceService.updateSeekerExperience(existingExperienceId, payload);
    } else {
      response = await seekerExperienceService.saveSeekerExperience(payload);
    }

    if (!existingExperienceId && response.data?.data?.id) {
      setExistingExperienceId(response.data.data.id);
    }
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to save experience. Please try again.';
    Alert.alert(t('validationTitle'), errorMessage);
  } finally {
    setSavingExperienceKey(null);
  }
};

// Get saved answerId for a question + option
const getSavedAnswerId = (questionId: string, option: string) => {
  return answerIdMap[`${questionId}_${option}`] || null;
};

// Save answerId when POST returns
const saveAnswerIdMapping = (questionId: string, option: string, answerId: number) => {
  setAnswerIdMap(prev => ({
    ...prev,
    [`${questionId}_${option}`]: answerId,
  }));
};

/* ---------- handle multi-select (dynamic questions) ---------- */

const handleMultiSelect = async (questionId: string | number, option: string) => {
  const qId = String(questionId);

  setSelectedMulti((prev) => {
    const currentSet = prev[qId] || new Set<string>();
    const nextSet = new Set(currentSet);

    const isSelected = nextSet.has(option);

    if (isSelected) {
      nextSet.delete(option);
      console.log(`Deselected option: ${option} for question: ${qId}`);

      const answerId = getSavedAnswerId(qId, option);
      if (answerId) {
        jobQuestionAnswerService.deleteAnswer(answerId)
          .then(res => console.log('DELETE response:', res.data))
          .catch(err => console.log('DELETE error:', err));
      }
    } else {
      nextSet.add(option);
      console.log(`Selected option: ${option} for question: ${qId}`);

      const payload = {
        categoryId: currentRole.categoryId || 0,
        questionId: Number(qId),
        userId: Number(userId),
        optionId: Number(option) // or backend optionId mapping
      };

      jobQuestionAnswerService.saveAnswer(payload)
        .then(res => {
          console.log('POST response:', res.data);
          if (res.data?.data?.id) {
            saveAnswerIdMapping(qId, option, res.data.data.id);
          }
        })
        .catch(err => console.log('POST error:', err));
    }

    return { ...prev, [qId]: nextSet };
  });
};

/* ---------- handle Next / Validation ---------- */
const handleNext = async (): Promise<void> => {
  try {
    await jobDetailsSchema.validate(
      { experience: selectedExperience },
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

  // Prepare serializable selectedMulti to pass to next screen (Sets -> arrays)
  const serializableMulti: Record<string, string[]> = {};
  Object.keys(selectedMulti).forEach((k) => {
    serializableMulti[k] = Array.from(selectedMulti[k]);
  });

const serializableSelectedMulti: Record<string, string[]> = {};
Object.keys(selectedMulti).forEach((qId) => {
  serializableSelectedMulti[qId] = Array.from(selectedMulti[qId]);
});

const updatedAnswers: CompletedRoles = {
  ...completedRoles,
  [currentRole.id]: {
    role: currentRole.title,
    selectedExperience,
    selectedMulti: serializableSelectedMulti, // now it's arrays, serializable
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

    // reset local state for next role
    setSelectedExperience(null);
    setSelectedMulti({});
    setExistingExperienceId(null);
  }
};

/* ---------- renderChip ---------- */
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

/* ---------- renderExperienceSection (STATIC) ---------- */
const renderExperienceSection = () => (
  <View style={styles.questionSection}>
    <Text style={styles.questionText}>{t('jobDetails_question_experience')}</Text>
    <View style={styles.chipsContainer}>
      {EXPERIENCE_OPTIONS.map((opt) => (
        <View key={opt} style={styles.chipWrapper}>
          {renderChip({
            label: opt,
            isSelected: selectedExperience === opt,
            showIcon: false,
            isSaving: savingExperienceKey === opt,
            onTap: () => handleSingleSelect(opt),
          })}
        </View>
      ))}
    </View>
  </View>
);

/* ---------- renderDynamicQuestion ---------- */
const renderDynamicQuestion = (question: DynamicQuestion) => (
  <View key={String(question.id)} style={styles.questionSection}>
    <Text style={styles.questionText}>{question.question}</Text>
    <View style={styles.chipsContainer}>
      {question.options.length === 0 ? (
        <Text style={{ color: '#999', fontSize: 13, marginTop: 6 }}>
          {'no options available'}
        </Text>
      ) : (
    question.options.map((option) => {
  const qId = String(question.id);
  const key = `${qId}_${option}`; // unique key

  return (
    <View key={key} style={styles.chipWrapper}>
      {renderChip({
        label: option,
        isSelected: (selectedMulti[qId] || new Set()).has(option),
        showIcon: true,
        onTap: () => handleMultiSelect(qId, option),
      })}
    </View>
  );
})

      )}
    </View>
  </View>
);

/* ---------- loading UI for fetchLoading categories ---------- */
if (fetchLoading) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={AppColors.themeColor} />
        <Text style={{ marginTop: 10, color: '#999' }}>{t('loading')}</Text>
      </View>
    </SafeAreaView>
  );
}

/* ---------- display image/title ---------- */
const displayJobImage = dynamicJobData?.category_image
  ? { uri: dynamicJobData.category_image }
  : roleImage;

const displayJobTitle = dynamicJobData?.category_name || currentRole.title || t('jobDetails_default_title');

/* ---------- final render ---------- */
return (
<SafeAreaView
  style={[
    styles.safeArea,
    { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }
  ]}
>
  <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

    <View style={styles.progressContainer}>
    {/* Progress Bar */}
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
    </View>
</View>
    {/* Header */}
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
      {/* Static experience first */}
      {renderExperienceSection()}

      {/* Dynamic questions fetched from backend */}
      {loadingQuestions ? (
        <ActivityIndicator size="large" color={AppColors.themeColor} style={{ marginTop: 24 }} />
      ) : (
        dynamicQuestions.map((q) => renderDynamicQuestion(q))
      )}
    </ScrollView>

    {/* Button */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.nextButton]} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('jobDetails_next')}</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
};

export default JobDetailsScreen;

/* ----------------------------- STYLES ----------------------------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    
  },

  /* ------------------ Progress Bar ------------------ */
   progressContainer: {
 paddingHorizontal: scale(16),
  },
  progressBarContainer: {
    height: verticalScale(6),
    width: "100%",
    backgroundColor: "#cacaca",
    borderRadius: scale(4),
    
    marginBottom: verticalScale(16),
    marginTop: verticalScale(8),
  },
  progressBar: {
    height: "100%",
    backgroundColor: AppColors.themeColor,
    borderRadius: scale(4),
  },

  /* ------------------ Header ------------------ */
  header: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },

  headerCenter: {
    alignItems: "flex-start",
  },

  jobImage: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(8),
     boxShadow: '0 4px 4px rgba(0,0,0,0.1)',
         resizeMode: "cover",
    marginBottom: verticalScale(6),
  },

  jobTitleCenter: {
  fontSize: moderateScale(15),
  fontWeight: "bold",
  // marginTop: verticalScale(12),
      // fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: verticalScale(4),
  },

  /* ------------------ ScrollView ------------------ */
  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(40),
  },

  /* ------------------ Questions / Chips ------------------ */
  questionSection: {
    marginBottom: verticalScale(18),
  },

  questionText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#000",
    marginBottom: verticalScale(10),
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chipWrapper: {
    marginRight: scale(8),
    marginBottom: verticalScale(10),
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: scale(1),
    borderColor: "#ddd",
    borderRadius: scale(20),
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
  backgroundColor: '#e3e3e3',
  },

 chipSelected: { borderColor: '#ffddb5', backgroundColor: '#ffddb5' },

 chipText: { fontSize: moderateScale(12), fontWeight: '500', color: '#929292' },
chipTextSelected: { fontWeight: '600', color: '#71695f' },

  /* ------------------ Next Button ------------------ */
  buttonContainer: {
    paddingHorizontal: scale(16),
    // paddingBottom: verticalScale(10),
  },

   nextButton: {
    height: verticalScale(36),
    backgroundColor: AppColors.themeColor,
    borderRadius: scale(26),
    justifyContent: "center",
    alignItems: "center",
       marginBottom: verticalScale(23),
  },

  nextButtonDisabled: {
    backgroundColor: "#ddd",
  },

  nextButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#fff",
  },
});
