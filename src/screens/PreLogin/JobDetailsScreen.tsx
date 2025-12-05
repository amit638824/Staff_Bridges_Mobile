// src/screens/PreLogin/JobDetailsScreen.tsx

import React, { useState } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppColors } from '../../constants/AppColors';
import { RootStackParamList } from '../../../App';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetailsScreen'>;

interface JobRole {
  id: string;
  title: string;
  image: any;
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
}

// Role-specific questions config
// Role-specific questions config
const roleQuestionsConfig: RoleQuestionsConfig = {
  delivery: {
    image: require('../../../assets/images/delvery.jpg'),
    title: 'jobDetails_role_delivery',
    questions: [
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
      {
        id: 'vehicle',
        question: 'jobDetails_question_vehicle',
        type: 'multi',
        options: [
          'jobDetails_option_bike',
          'jobDetails_option_scooter',
          'jobDetails_option_car',
          'jobDetails_option_none',
        ],
      },
      {
        id: 'documents',
        question: 'jobDetails_question_documents',
        type: 'multi',
        options: [
          'jobDetails_option_aadhar',
          'jobDetails_option_pan_card',
          'jobDetails_option_voter_id',
          'jobDetails_option_dl',
          'jobDetails_option_passport',
        ],
      },
    ],
  },

  customer_support: {
    image: require('../../../assets/images/cs_and_telecler.jpg'),
    title: 'jobDetails_role_customer_support',
    questions: [
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
      {
        id: 'workExp',
        question: 'jobDetails_question_workExp',
        type: 'multi',
        options: [
          'jobDetails_option_computer_knowledge',
          'jobDetails_option_domestic_calling',
          'jobDetails_option_international_calling',
          'jobDetails_option_query_resolution',
          'jobDetails_option_non_voice_chat',
          'jobDetails_option_none',
        ],
      },
      {
        id: 'haveItems',
        question: 'jobDetails_question_haveItems',
        type: 'multi',
        options: [
          'jobDetails_option_bike',
          'jobDetails_option_internet_connection',
          'jobDetails_option_laptop_desktop',
          'jobDetails_option_none',
        ],
      },
      {
        id: 'documents',
        question: 'jobDetails_question_documents',
        type: 'multi',
        options: [
          'jobDetails_option_aadhar',
          'jobDetails_option_pan_card',
          'jobDetails_option_voter_id',
          'jobDetails_option_dl',
          'jobDetails_option_passport',
        ],
      },
    ],
  },

  field_sales: {
    image: require('../../../assets/images/field_sales.jpg'),
    title: 'jobDetails_role_field_sales',
    questions: [
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
      {
        id: 'skills',
        question: 'jobDetails_question_skills',
        type: 'multi',
        options: ['jobDetails_option_sales_pitch', 'jobDetails_option_negotiation', 'jobDetails_option_client_meeting'],
      },
    ],
  },

  sales_bd: {
    image: require('../../../assets/images/sales-job.jpg'),
    title: 'jobDetails_role_sales_bd',
    questions: [
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
      {
        id: 'skills',
        question: 'jobDetails_question_skills',
        type: 'multi',
        options: ['jobDetails_option_leads_generation', 'jobDetails_option_proposals', 'jobDetails_option_closing'],
      },
    ],
  },

  digital_marketing: {
    image: require('../../../assets/images/backoffice.jpg'),
    title: 'jobDetails_role_digital_marketing',
    questions: [
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
      {
        id: 'tools',
        question: 'jobDetails_question_tools',
        type: 'multi',
        options: ['jobDetails_option_seo', 'jobDetails_option_sem', 'jobDetails_option_smm', 'jobDetails_option_email_marketing'],
      },
    ],
  },

  retail_sales: {
    image: require('../../../assets/images/counter-sales.jpg'),
    title: 'jobDetails_role_retail_sales',
    questions: [
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
      {
        id: 'skills',
        question: 'jobDetails_question_skills',
        type: 'multi',
        options: ['jobDetails_option_customer_handling', 'jobDetails_option_inventory', 'jobDetails_option_cash_management'],
      },
    ],
  },

  recruiter_hr: {
    image: require('../../../assets/images/hradmin.jpg'),
    title: 'jobDetails_role_hr_admin',
    questions: [
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
      {
        id: 'skills',
        question: 'jobDetails_question_skills',
        type: 'multi',
        options: ['jobDetails_option_recruitment', 'jobDetails_option_interviews', 'jobDetails_option_onboarding'],
      },
    ],
  },
};


const JobDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { selectedRoles, currentRoleIndex, completedRoles, totalRoles } = route.params;

  const currentRole: JobRole = selectedRoles[currentRoleIndex];
  const roleConfig: RoleConfig = roleQuestionsConfig[currentRole.id];

  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<Record<string, Set<string>>>({});

  const progressPercentage = ((currentRoleIndex + 1) / totalRoles) * 100;

  const handleSingleSelect = (value: string): void => {
    setSelectedExperience(value);
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

  const handleNext = (): void => {
    if (!selectedExperience) {
      Alert.alert(t('validationTitle'), t('jobDetails_validationExperience'));
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

  const renderChip = ({ label, isSelected, onTap, showIcon }: ChipProps) => (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onTap}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {t(label)}
      </Text>
      {showIcon && (
        <View style={{ marginLeft: 6 }}>
          {isSelected ? (
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
        <View style={styles.jobInfoContainer}>
          <Image source={roleConfig.image} style={styles.jobImage} />
          <View style={styles.jobTextContainer}>
            <Text style={styles.jobTitle}>{t(roleConfig.title)}</Text>
          </View>
        </View>
      </View>

      {/* Questions */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {roleConfig.questions.map((q) => renderQuestion(q))}
      </ScrollView>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
  jobInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  jobImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15, resizeMode: 'cover' },
  jobTextContainer: { flex: 1 },
  jobTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
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
