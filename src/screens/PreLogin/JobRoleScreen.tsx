import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppColors } from '../../constants/AppColors';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { fetchJobRoles, resetJobRoles } from "../../redux/slices/jobRoleSlice";
import { RootState } from "../../redux/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectJobRoleSchema } from "../../validation/selectJobRoleSchema";


interface JobRole {
  id: string;
  title: string;
  image: any;
}

interface RoleNavigationProp {
  navigation: NativeStackNavigationProp<any>;
}

const SelectJobRoleScreen: React.FC<RoleNavigationProp> = ({ navigation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { roles, page, totalPages, loading, error, hasMore } = useSelector(
    (state: RootState) => state.jobRoles
  );

  const [loadingMore, setLoadingMore] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    initialLoadDone: false,
    rolesInState: 0,
    currentPage: 0,
    totalPages: 0,
  });

  // Reset Redux on mount to ensure fresh start
  useEffect(() => {
    console.log('=== 🎯 COMPONENT MOUNTED ===');
    console.log('Current Redux state - Roles:', roles.length, 'Page:', page);
    dispatch(resetJobRoles() as any);
    
    return () => {
      console.log('=== 🎯 COMPONENT UNMOUNTED ===');
    };
  }, [dispatch]);

  // Initial load - only once after reset
  useEffect(() => {
    console.log('=== 📡 INITIAL FETCH EFFECT ===');
    const timer = setTimeout(() => {
      console.log('Dispatching fetchJobRoles for page 1');
      dispatch(fetchJobRoles({ page: 1, limit: 10 }) as any);
      setDebugInfo(prev => ({ ...prev, initialLoadDone: true }));
    }, 200); // Increased delay to ensure reset completes

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Monitor Redux state changes
  useEffect(() => {
    setDebugInfo({
      initialLoadDone: true,
      rolesInState: roles.length,
      currentPage: page,
      totalPages: totalPages,
    });
    console.log(`📊 Redux State: ${roles.length} roles loaded, Page ${page}/${totalPages}, HasMore: ${hasMore}`);
  }, [roles, page, totalPages, hasMore]);

  const loadMore = () => {
    console.log(`=== LOAD MORE CALLED ===`);
    console.log(`Conditions - loadingMore: ${loadingMore}, loading: ${loading}, hasMore: ${hasMore}, page: ${page}, totalPages: ${totalPages}`);

    if (loadingMore) {
      console.log('❌ Already loading more');
      return;
    }

    if (loading) {
      console.log('❌ Initial load in progress');
      return;
    }

    if (!hasMore) {
      console.log('❌ No more pages');
      return;
    }

    if (page >= totalPages) {
      console.log('❌ Already on last page');
      return;
    }

    console.log(`✅ Fetching page ${page + 1}`);
    setLoadingMore(true);
    dispatch(fetchJobRoles({ page: page + 1, limit: 10 }) as any);
  };

  // Reset loadingMore when loading finishes
  useEffect(() => {
    if (loadingMore && !loading) {
      console.log('✅ Pagination complete, resetting loadingMore');
      setLoadingMore(false);
    }
  }, [loading, loadingMore]);

  const jobRoles = useMemo(() => {
    console.log(`🔄 jobRoles memo recalculated: ${roles.length} items`);
    return roles.map((item: any) => ({
      id: String(item.id),
      title: item.name,
      image: item.image ? { uri: item.image } : require("../../../assets/images/sales-job.jpg"),
    }));
  }, [roles]);

  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(selectJobRoleSchema),
    defaultValues: {
      selectedRoles: [],
    },
  });

  const isMaxSelected = selectedRoles.size >= 4;

  const filteredRoles = useMemo(() => {
    const filtered = jobRoles.filter((role: JobRole) =>
      role.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(`🔍 Filtered: ${filtered.length} from ${jobRoles.length}`);
    return filtered;
  }, [searchQuery, jobRoles]);

  const handleRoleToggle = (roleId: string): void => {
    let newSelected = new Set(selectedRoles);

    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else if (newSelected.size < 4) {
      newSelected.add(roleId);
    }

    setSelectedRoles(newSelected);
    setValue("selectedRoles", Array.from(newSelected));
  };

  const onSubmit = () => {
    const selectedRoleDetails = jobRoles.filter((role) =>
      selectedRoles.has(role.id)
    );

    console.log('Navigating with selected roles:', selectedRoleDetails.length);
    
    navigation.push("JobDetailsScreen", {
      selectedRoles: selectedRoleDetails,
      currentRoleIndex: 0,
      completedRoles: {},
      totalRoles: selectedRoleDetails.length,
    });
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

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>Error: {error}</Text>
          <TouchableOpacity 
            style={{ marginTop: 20, padding: 10, backgroundColor: AppColors.themeColor, borderRadius: 5 }}
            onPress={() => dispatch(fetchJobRoles({ page: 1, limit: 10 }) as any)}
          >
            <Text style={{ color: '#fff' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
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
          <Text style={styles.headerTitle}>{t("selectJobRoles")}</Text>
          <Text style={styles.headerSubtitle}>{t("selectUpToFiveRoles")}</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#999" />
        </View>

        <Text style={styles.selectedCountText}>
          {t("selectedCount", { count: selectedRoles.size })}
        </Text>

        {/* Initial Loading State */}
        {loading && jobRoles.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={AppColors.themeColor} />
            <Text style={{ marginTop: 10, color: '#999', fontSize: 12 }}>
              Loading job roles...
            </Text>
          </View>
        ) : (
          /* Role List */
          <FlatList
            data={filteredRoles}
            renderItem={renderRoleItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {jobRoles.length === 0 ? "No roles loaded from API" : t("noJobRolesFound")}
                </Text>
              </View>
            }
            onEndReachedThreshold={0.5}
            onEndReached={({ distanceFromEnd }) => {
              console.log(`📍 FlatList end reached, distance from end: ${distanceFromEnd}`);
              loadMore();
            }}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ paddingVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size="small" color={AppColors.themeColor} />
                  <Text style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                    Loading more job roles...
                  </Text>
                </View>
              ) : null
            }
            scrollEnabled={true}
          />
        )}

        {errors.selectedRoles && (
          <Text style={{ color: "red", marginTop: 8 }}>
            {errors.selectedRoles.message}
          </Text>
        )}
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedRoles.size === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={selectedRoles.size === 0}
        >
          <Text style={styles.nextButtonText}>{t("next")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SelectJobRoleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 20, paddingVertical: 10 },

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

  headerContainer: { marginBottom: 20 },
  headerIcon: { width: 60, height: 60, marginBottom: 10, resizeMode: 'contain' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#999' },

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
  searchInput: { flex: 1, marginLeft: 10, fontSize: 13, color: '#000' },

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
    backgroundColor: '#E3F2FD',
    elevation: 3,
  },
  roleCardDisabled: { opacity: 0.6 },

  roleImage: { width: 45, height: 45, borderRadius: 8, resizeMode: 'cover' },
  roleImageDisabled: { opacity: 0.5 },

  roleTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#000', marginHorizontal: 14 },
  roleTitleDisabled: { color: '#ccc' },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: AppColors.themeColor,
    borderColor: AppColors.themeColor,
  },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#999', fontWeight: '500' },

  buttonContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  nextButton: {
    height: 50,
    backgroundColor:AppColors.themeColor,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: { backgroundColor: '#ddd' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});