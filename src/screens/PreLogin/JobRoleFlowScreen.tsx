import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const JobRoleFlowScreen = ({ navigation }: any) => {
  // Step tracking: 'select' -> role selection, then loop through each role for details
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  // State for each role's details
  const [roleDetails, setRoleDetails] = useState<
    Record<
      string,
      {
        experience: string | null;
        workExperience: Set<string>;
        haveOptions: Set<string>;
        documents: Set<string>;
      }
    >
  >({});

  const jobRoles = [
    {
      title: 'Field Sales',
      image: require('../../../assets/images/field_sales.jpg'),
    },
    {
      title: 'Delivery',
      image: require('../../../assets/images/delvery.jpg'),
    },
    {
      title: 'Computer Support / Telecaller',
      image: require('../../../assets/images/cs_and_telecler.jpg'),
    },
    {
      title: 'Sales / Business Development',
      image: require('../../../assets/images/sales-job.jpg'),
    },
    {
      title: 'Digital Marketing',
      image: require('../../../assets/images/backoffice.jpg'),
    },
    {
      title: 'Retail / Counter Sales',
      image: require('../../../assets/images/counter-sales.jpg'),
    },
    {
      title: 'Recruiter / Hr Admin',
      image: require('../../../assets/images/hradmin.jpg'),
    },
  ];

  const experienceOptions = [
    'Fresher',
    '1-6 Months',
    '1 Year',
    '2 Years',
    '3 Years',
    '4 Years',
    '5+ Years',
  ];

  const workExperienceOptions = [
    'Computer Knowledge',
    'Domestic Calling',
    'International Calling',
    'Query Resolution',
    'Non-voice/Chat Process',
    'None of These',
  ];

  const haveOptions = [
    'Bike',
    'Internet Connection',
    'Laptop/Desktop',
    'None of These',
  ];

  const documentOptions = [
    'Aadhar',
    'Pan Card',
    'Voter Id',
    '2 Wheeler Driving Licence',
    'Passport',
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const isMaxSelected = selectedRoles.size >= 5;

  const filteredRoles = useMemo(() => {
    return jobRoles.filter((role) =>
      role.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Role selection handlers
  const handleRoleToggle = (roleTitle: string) => {
    const newSelectedRoles = new Set(selectedRoles);
    if (newSelectedRoles.has(roleTitle)) {
      newSelectedRoles.delete(roleTitle);
    } else if (newSelectedRoles.size < 5) {
      newSelectedRoles.add(roleTitle);
    }
    setSelectedRoles(newSelectedRoles);
  };

  // Initialize role details if not exists
  const initializeRoleDetails = (roleName: string) => {
    if (!roleDetails[roleName]) {
      setRoleDetails({
        ...roleDetails,
        [roleName]: {
          experience: null,
          workExperience: new Set(),
          haveOptions: new Set(),
          documents: new Set(),
        },
      });
    }
  };

  // Get current role
  const selectedRolesArray = Array.from(selectedRoles);
  const currentRole = selectedRolesArray[currentRoleIndex];
  const currentDetails = roleDetails[currentRole] || {
    experience: null,
    workExperience: new Set(),
    haveOptions: new Set(),
    documents: new Set(),
  };

  // Handlers for details
  const handleExperienceSelect = (value: string) => {
    const updated = {
      ...roleDetails,
      [currentRole]: {
        ...currentDetails,
        experience: value,
      },
    };
    setRoleDetails(updated);
  };

  const handleMultiSelect = (
    value: string,
    key: 'workExperience' | 'haveOptions' | 'documents'
  ) => {
    const newSet = new Set(currentDetails[key]);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    const updated = {
      ...roleDetails,
      [currentRole]: {
        ...currentDetails,
        [key]: newSet,
      },
    };
    setRoleDetails(updated);
  };

  const handleNextFromSelect = () => {
    if (selectedRoles.size > 0) {
      initializeRoleDetails(selectedRolesArray[0]);
      setStep('details');
    }
  };

  const handleNextFromDetails = () => {
    if (currentRoleIndex < selectedRolesArray.length - 1) {
      initializeRoleDetails(selectedRolesArray[currentRoleIndex + 1]);
      setCurrentRoleIndex(currentRoleIndex + 1);
    } else {
      // All roles completed - navigate to home
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'HomeScreen',
            params: { showJobModal: true },
          },
        ],
      });
    }
  };

  const handleBackFromDetails = () => {
    if (currentRoleIndex > 0) {
      setCurrentRoleIndex(currentRoleIndex - 1);
    } else {
      setStep('select');
      setCurrentRoleIndex(0);
    }
  };

  // Progress calculation
  const totalSteps = selectedRoles.size + 1; // +1 for role selection
  const currentProgress =
    step === 'select'
      ? (1 / totalSteps) * 100
      : ((currentRoleIndex + 2) / totalSteps) * 100;

  // Render chip component
  const renderChip = ({
    label,
    isSelected,
    onTap,
    showIcon,
  }: {
    label: string;
    isSelected: boolean;
    onTap: () => void;
    showIcon: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onTap}
    >
      <Text
        style={[styles.chipText, isSelected && styles.chipTextSelected]}
      >
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

  // Render question section
  const renderQuestionSection = ({
    question,
    options,
    showIcon,
    isSelected,
    onSelect,
  }: {
    question: string;
    options: string[];
    showIcon: boolean;
    isSelected: (value: string) => boolean;
    onSelect: (value: string) => void;
  }) => (
    <View style={styles.questionSection}>
      <Text style={styles.questionText}>{question}</Text>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <View key={option} style={styles.chipWrapper}>
            {renderChip({
              label: option,
              isSelected: isSelected(option),
              showIcon,
              onTap: () => onSelect(option),
            })}
          </View>
        ))}
      </View>
    </View>
  );

  // Render role card
  const renderRoleItem = ({ item }: { item: (typeof jobRoles)[0] }) => {
    const isSelected = selectedRoles.has(item.title);
    const isDisabled = isMaxSelected && !isSelected;
    return (
      <TouchableOpacity
        onPress={() => !isDisabled && handleRoleToggle(item.title)}
        activeOpacity={isDisabled ? 1 : 0.7}
      >
        <View
          style={[
            styles.roleCard,
            isSelected && styles.roleCardSelected,
            isDisabled && styles.roleCardDisabled,
          ]}
        >
          <Image
            source={item.image}
            style={[
              styles.roleImage,
              isDisabled && styles.roleImageDisabled,
            ]}
          />

          <Text
            style={[
              styles.roleTitle,
              isDisabled && styles.roleTitleDisabled,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={12} color="#fff" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (step === 'select') {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop:
              Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View style={styles.content}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '40%' }]} />
          </View>

          <View style={styles.headerContainer}>
            <Image
              source={require('../../../assets/images/job.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Select Job Role</Text>
            <Text style={styles.headerSubtitle}>
              Select up to 5 job categories
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search job roles, categories, skills etc.."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={20} color="#999" />
          </View>

          <Text style={styles.selectedCountText}>
            {selectedRoles.size} of 5 selected
          </Text>

          <FlatList
            data={filteredRoles}
            renderItem={renderRoleItem}
            keyExtractor={(item) => item.title}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No job roles found</Text>
              </View>
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedRoles.size === 0 && styles.nextButtonDisabled,
            ]}
            onPress={handleNextFromSelect}
            disabled={selectedRoles.size === 0}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Details step
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${currentProgress}%` }]} />
      </View>

      {/* Job Info Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackFromDetails}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.jobInfoContainer}>
          <Image
            source={
              jobRoles.find((r) => r.title === currentRole)?.image ||
              require('../../../assets/images/cs_and_telecler.jpg')
            }
            style={styles.jobImage}
          />
          <View style={styles.jobTextContainer}>
            <Text style={styles.jobTitle}>{currentRole}</Text>
            <Text style={styles.roleCounter}>
              {currentRoleIndex + 1} of {selectedRolesArray.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Questions */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Question 1: Experience (Single Select) */}
        {renderQuestionSection({
          question: 'What is your work experience?',
          options: experienceOptions,
          showIcon: false,
          isSelected: (value) => currentDetails.experience === value,
          onSelect: handleExperienceSelect,
        })}

        {/* Question 2: Work Experience (Multi Select) */}
        {renderQuestionSection({
          question: 'What is your work experience?',
          options: workExperienceOptions,
          showIcon: true,
          isSelected: (value) => currentDetails.workExperience.has(value),
          onSelect: (value) => handleMultiSelect(value, 'workExperience'),
        })}

        {/* Question 3: Have Options (Multi Select) */}
        {renderQuestionSection({
          question: 'Which of these do you have?',
          options: haveOptions,
          showIcon: true,
          isSelected: (value) => currentDetails.haveOptions.has(value),
          onSelect: (value) => handleMultiSelect(value, 'haveOptions'),
        })}

        {/* Question 4: Documents (Multi Select) */}
        {renderQuestionSection({
          question: "Which of these Ids/documents do you have?",
          options: documentOptions,
          showIcon: true,
          isSelected: (value) => currentDetails.documents.has(value),
          onSelect: (value) => handleMultiSelect(value, 'documents'),
        })}
      </ScrollView>

      {/* Fixed Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextFromDetails}
        >
          <Text style={styles.nextButtonText}>
            {currentRoleIndex === selectedRolesArray.length - 1
              ? 'Complete'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobRoleFlowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#cacaca',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#009ca4',
    borderRadius: 5,
  },

  headerContainer: {
    marginBottom: 20,
  },

  headerIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: 'contain',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 16,
    backgroundColor: '#fff',
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#000',
  },

  selectedCountText: {
    fontSize: 12,
    color: '#009ca4',
    fontWeight: '600',
    marginBottom: 12,
  },

  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1.3,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  roleCardSelected: {
    borderColor: '#009ca4',
    backgroundColor: '#E6FAF6',
    shadowColor: '#009ca4',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  roleCardDisabled: {
    opacity: 0.6,
  },

  roleImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    resizeMode: 'cover',
  },

  roleImageDisabled: {
    opacity: 0.5,
  },

  roleTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginHorizontal: 14,
  },

  roleTitleDisabled: {
    color: '#ccc',
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#B2E8E4',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  checkboxSelected: {
    backgroundColor: '#009ca4',
    borderColor: '#009ca4',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  jobInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: 'cover',
  },

  jobTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  roleCounter: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
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
    backgroundColor: '#009ca4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextButtonDisabled: {
    backgroundColor: '#ddd',
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});