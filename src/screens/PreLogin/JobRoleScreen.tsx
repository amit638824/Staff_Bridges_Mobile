// src/screens/PreLogin/SelectJobRoleScreen.tsx

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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppColors } from '../../constants/AppColors';
import App from '../../../App';

// Type definitions
interface JobRole {
  id: string;
  title: string;
  image: any;
}

interface RoleNavigationProp {
  navigation: NativeStackNavigationProp<any>;
}

const SelectJobRoleScreen: React.FC<RoleNavigationProp> = ({ navigation }) => {
  const jobRoles: JobRole[] = [
    {
      id: 'delivery',
      title: 'Delivery',
      image: require('../../../assets/images/delvery.jpg'),
    },
    {
      id: 'customer_support',
      title: 'Customer Support / Telecaller',
      image: require('../../../assets/images/cs_and_telecler.jpg'),
    },
    {
      id: 'field_sales',
      title: 'Field Sales',
      image: require('../../../assets/images/field_sales.jpg'),
    },
    {
      id: 'sales_bd',
      title: 'Sales / Business Development',
      image: require('../../../assets/images/sales-job.jpg'),
    },
    {
      id: 'digital_marketing',
      title: 'Digital Marketing',
      image: require('../../../assets/images/backoffice.jpg'),
    },
    {
      id: 'retail_sales',
      title: 'Retail / Counter Sales',
      image: require('../../../assets/images/counter-sales.jpg'),
    },
    {
      id: 'recruiter_hr',
      title: 'Recruiter / HR Admin',
      image: require('../../../assets/images/hradmin.jpg'),
    },
  ];

  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isMaxSelected = selectedRoles.size >= 5;

  const filteredRoles = useMemo(() => {
    return jobRoles.filter((role: JobRole) =>
      role.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleRoleToggle = (roleId: string): void => {
    const newSelectedRoles = new Set(selectedRoles);
    if (newSelectedRoles.has(roleId)) {
      newSelectedRoles.delete(roleId);
    } else if (newSelectedRoles.size < 5) {
      newSelectedRoles.add(roleId);
    }
    setSelectedRoles(newSelectedRoles);
  };

  const handleNext = (): void => {
    if (selectedRoles.size > 0) {
      const selectedRoleDetails = jobRoles.filter((role) =>
        selectedRoles.has(role.id)
      );
      navigation.push('JobDetailsScreen', {
        selectedRoles: selectedRoleDetails,
        currentRoleIndex: 0,
        completedRoles: {},
        totalRoles: selectedRoleDetails.length,
      });
    }
  };

  const renderRoleItem = ({ item }: { item: JobRole }): React.ReactElement => {
    const isSelected = selectedRoles.has(item.id);
    const isDisabled = isMaxSelected && !isSelected;

    return (
      <TouchableOpacity
        onPress={() => !isDisabled && handleRoleToggle(item.id)}
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
            style={[styles.roleImage, isDisabled && styles.roleImageDisabled]}
          />

          <Text
            style={[styles.roleTitle, isDisabled && styles.roleTitleDisabled]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '20%' }]} />
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../../assets/images/job.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Select Job Roles</Text>
          <Text style={styles.headerSubtitle}>Select up to 5 job categories</Text>
        </View>

        {/* Search */}
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

        {/* Role List */}
        <FlatList
          data={filteredRoles}
          renderItem={renderRoleItem}
          keyExtractor={(item: JobRole) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No job roles found</Text>
            </View>
          }
        />
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedRoles.size === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedRoles.size === 0}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SelectJobRoleScreen;

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
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: AppColors.themeColor,
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
    color: AppColors.themeColor,
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
    borderColor: AppColors.themeColor,
    backgroundColor: AppColors.themeColorLight ,
    shadowColor: AppColors.themeColor,
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
    borderColor: AppColors.lightBorder,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  checkboxSelected: {
    backgroundColor: AppColors.themeColor,
    borderColor: AppColors.themeColor,
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

  nextButtonDisabled: {
    backgroundColor: '#ddd',
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});