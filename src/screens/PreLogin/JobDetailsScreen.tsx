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

// ✅ Import RootStackParamList from App.tsx
import { RootStackParamList } from '../../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetailsScreen'>;

// Type definitions
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
const roleQuestionsConfig: RoleQuestionsConfig = {
  delivery: {
    image: require('../../../assets/images/delvery.jpg'),
    title: 'Delivery',
    questions: [
      {
        id: 'experience',
        question: 'What is your work experience?',
        type: 'single',
        options: ['Fresher', '1-6 Months', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'],
      },
      {
        id: 'vehicle',
        question: 'Which of these do you have?',
        type: 'multi',
        options: ['Bike', 'Scooter', 'Car', 'None of These'],
      },
      {
        id: 'documents',
        question: 'Which Ids/documents do you have?',
        type: 'multi',
        options: ['Aadhar', 'Pan Card', 'Voter Id', '2 Wheeler Driving Licence', 'Passport'],
      },
    ],
  },
  customer_support: {
    image: require('../../../assets/images/cs_and_telecler.jpg'),
    title: 'Customer Support / Telecaller',
    questions: [
      {
        id: 'experience',
        question: 'What is your work experience?',
        type: 'single',
        options: ['Fresher', '1-6 Months', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'],
      },
      {
        id: 'workExp',
        question: 'What is your work experience?',
        type: 'multi',
        options: ['Computer Knowledge', 'Domestic Calling', 'International Calling', 'Query Resolution', 'Non-voice/Chat Process', 'None of These'],
      },
      {
        id: 'haveItems',
        question: 'Which of these do you have?',
        type: 'multi',
        options: ['Bike', 'Internet Connection', 'Laptop/Desktop', 'None of These'],
      },
      {
        id: 'documents',
        question: 'Which Ids/documents do you have?',
        type: 'multi',
        options: ['Aadhar', 'Pan Card', 'Voter Id', '2 Wheeler Driving Licence', 'Passport'],
      },
    ],
  },
  field_sales: {
    image: require('../../../assets/images/field_sales.jpg'),
    title: 'Field Sales',
    questions: [
      {
        id: 'experience',
        question: 'What is your work experience?',
        type: 'single',
        options: ['Fresher', '1-6 Months', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'],
      },
      {
        id: 'haveItems',
        question: 'Which of these do you have?',
        type: 'multi',
        options: ['Bike', 'Internet Connection', 'Laptop/Desktop', 'None of These'],
      },
      {
        id: 'documents',
        question: 'Which Ids/documents do you have?',
        type: 'multi',
        options: ['Aadhar', 'Pan Card', 'Voter Id', '2 Wheeler Driving Licence', 'Passport'],
      },
    ],
  },
  sales_bd: {
    image: require('../../../assets/images/sales-job.jpg'),
    title: 'Sales / Business Development',
    questions: [
      {
        id: 'experience',
        question: 'What is your work experience?',
        type: 'single',
        options: ['Fresher', '1-6 Months', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'],
      },
      {
        id: 'haveItems',
        question: 'Which of these do you have?',
        type: 'multi',
        options: ['Internet Connection', 'Laptop/Desktop', 'None of These'],
      },
    ],
  },
  digital_marketing: {
    image: require('../../../assets/images/backoffice.jpg'),
    title: 'Digital Marketing',
    questions: [
      {
        id: 'experience',
        question: 'What is your work experience?',
        type: 'single',
        options: ['Fresher', '1-6 Months', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'],
      },
      {
        id: 'haveItems',
        question: 'Which of these do you have?',
        type: 'multi',
        options: ['Internet Connection', 'Laptop/Desktop', 'None of These'],
      },
    ],
  },
  recruiter_hr: {
    image: require('../../../assets/images/hradmin.jpg'),
    title: 'Recruiter / HR Admin',
    questions: [
      {
        id: 'experience',
        question: 'What is your work experience?',
        type: 'single',
        options: ['Fresher', '1-6 Months', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'],
      },
      {
        id: 'haveItems',
        question: 'Which of these do you have?',
        type: 'multi',
        options: ['Internet Connection', 'Laptop/Desktop'],
      },
    ],
  },
};

const JobDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { selectedRoles, currentRoleIndex, completedRoles, totalRoles } = route.params;

  const currentRole: JobRole = selectedRoles[currentRoleIndex];
  const roleConfig: RoleConfig = roleQuestionsConfig[currentRole.id];

  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<Record<string, Set<string>>>({});

  // Calculate progress percentage
  const progressPercentage = ((currentRoleIndex + 1) / totalRoles) * 100;

  const handleSingleSelect = (value: string): void => {
    setSelectedExperience(value);
  };

  const handleMultiSelect = (questionId: string, value: string): void => {
    setSelectedMulti((prev) => {
      const currentSet = prev[questionId] || new Set();
      const newSet = new Set(currentSet);

      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }

      return {
        ...prev,
        [questionId]: newSet,
      };
    });
  };

  const handleNext = (): void => {
    if (!selectedExperience) {
      Alert.alert('Validation', 'Please select your work experience');
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
        params: { 
          roleAnswers: updatedAnswers,
          fromJobInfo: true,
        },
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
  const renderChip = ({ label, isSelected, onTap, showIcon }: ChipProps): React.ReactElement => (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onTap}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {label}
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

  const renderQuestion = (question: Question): React.ReactElement => {
    if (question.type === 'single') {
      return (
        <View key={question.id} style={styles.questionSection}>
          <Text style={styles.questionText}>{question.question}</Text>
          <View style={styles.chipsContainer}>
            {question.options.map((option: string) => (
              <View key={option} style={styles.chipWrapper}>
                {renderChip({
                  label: option,
                  isSelected: selectedExperience === option,
                  showIcon: false,
                  onTap: () => handleSingleSelect(option),
                })}
              </View>
            ))}
          </View>
        </View>
      );
    } else {
      return (
        <View key={question.id} style={styles.questionSection}>
          <Text style={styles.questionText}>{question.question}</Text>
          <View style={styles.chipsContainer}>
            {question.options.map((option: string) => (
              <View key={option} style={styles.chipWrapper}>
                {renderChip({
                  label: option,
                  isSelected: (selectedMulti[question.id] || new Set()).has(option),
                  showIcon: true,
                  onTap: () => handleMultiSelect(question.id, option),
                })}
              </View>
            ))}
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
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
            <Text style={styles.jobTitle}>{roleConfig.title}</Text>
          </View>
        </View>
      </View>

      {/* Questions */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {roleConfig.questions.map((question: Question) => renderQuestion(question))}
      </ScrollView>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#f0f0f0',
  },
  jobInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  jobImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15, resizeMode: 'cover' },
  jobTextContainer: { flex: 1 },
  jobTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  scrollView: { flex: 1 },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  questionSection: {
    marginBottom: 25,
  },

  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chipWrapper: {
    marginBottom: 8,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#e3e3e3',
  },

  chipSelected: {
    borderColor: '#ffddb5',
    backgroundColor: '#ffddb5',
  },

  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#929292',
  },

  chipTextSelected: {
    fontWeight: '600',
    color: '#71695f',
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopColor: '#f0f0f0',
  },

  nextButton: {
    height: 50,
    backgroundColor: AppColors.themeColor,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});