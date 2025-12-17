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
import { fetchJobRoles, resetJobRoles, setSearchQuery } from "../../redux/slices/jobRoleSlice";
import { deleteSeekerCategory, fetchSeekerCategories } from "../../redux/slices/seekerCategorySlice";
import { RootState } from "../../redux/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectJobRoleSchema } from "../../validation/selectJobRoleSchema";
import { createSeekerCategory } from "../../redux/slices/seekerCategorySlice";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

interface JobRole {
  id: string;
  title: string;
  image: any;
  categoryId?: number;
}

interface RoleNavigationProp {
  navigation: NativeStackNavigationProp<any>;
}

const SelectJobRoleScreen: React.FC<RoleNavigationProp> = ({ navigation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { roles, page, totalPages, loading, error, hasMore, searchQuery } = useSelector(
    (state: RootState) => state.jobRoles
  );

  // Add this - get categories from Redux
  const { categories } = useSelector(
    (state: RootState) => state.seekerCategory
  );

  const userId = useSelector((state: RootState) => state.auth.userId);

  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQueryLocal, setSearchQueryLocal] = useState<string>('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const [categoryIdMap, setCategoryIdMap] = useState<Record<string, number>>({});

  const [debugInfo, setDebugInfo] = useState({
    initialLoadDone: false,
    rolesInState: 0,
    currentPage: 0,
    totalPages: 0,
  });

  // Reset Redux on mount to ensure fresh start
  useEffect(() => {
    dispatch(resetJobRoles() as any);
    
    return () => {
    };
  }, [dispatch]);

  // Initial load - only once after reset
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchJobRoles({ page: 1, limit: 10 }) as any);
      setDebugInfo(prev => ({ ...prev, initialLoadDone: true }));
    }, 200);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Fetch seeker categories when userId is available
  useEffect(() => {
    if (userId) {
      dispatch(fetchSeekerCategories({ page: 1, limit: 100, userId: Number(userId) }) as any);
    }
  }, [dispatch, userId]);


  // Initialize selected roles from existing categories
useEffect(() => {
  if (categories && categories.length > 0) {
    const initialSelected = new Set<string>();
    const initialCategoryMap: Record<string, number> = {};

    categories.forEach((cat) => {
      if (cat.job_categoryid) {
        initialSelected.add(String(cat.job_categoryid));
        initialCategoryMap[String(cat.job_categoryid)] = cat.job_id; // store seeker-category ID
      }
    });

    setSelectedRoles(initialSelected);
    setCategoryIdMap(initialCategoryMap);
    setValue("selectedRoles", Array.from(initialSelected));
  }
}, [categories]);

  // Monitor Redux state changes
  useEffect(() => {
    setDebugInfo({
      initialLoadDone: true,
      rolesInState: roles.length,
      currentPage: page,
      totalPages: totalPages,
    });
  }, [roles, page, totalPages, hasMore]);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      dispatch(setSearchQuery(searchQueryLocal) as any);
      dispatch(resetJobRoles() as any);
      
      // Fetch with search query
      dispatch(
        fetchJobRoles({ 
          page: 1, 
          limit: 10,
          name: searchQueryLocal
        }) as any
      );
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQueryLocal, dispatch]);

  const loadMore = () => {

    if (loadingMore) {
      return;
    }

    if (loading) {
      return;
    }

    if (!hasMore) {
      return;
    }

    if (page >= totalPages) {
      return;
    }

    setLoadingMore(true);
    dispatch(
      fetchJobRoles({ 
        page: page + 1, 
        limit: 10,
        name: searchQueryLocal
      }) as any
    );
  };

  // Reset loadingMore when loading finishes
  useEffect(() => {
    if (loadingMore && !loading) {
      setLoadingMore(false);
    }
  }, [loading, loadingMore]);

const jobRoles = useMemo(() => {
  const unique = new Map();
  roles.forEach((item: any) => {
    unique.set(String(item.id), {
      id: String(item.id),
      title: item.name,
      image: item.image ? { uri: item.image } : require("../../../assets/images/sales-job.jpg"),
    });
  });
  return Array.from(unique.values());
}, [roles]);


  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

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

const handleRoleToggle = (roleId: string): void => {
  let newSelected = new Set(selectedRoles);

  // ================== DESELECT ==================
  if (newSelected.has(roleId)) {
    newSelected.delete(roleId);

    const seekerCategoryId = categoryIdMap[roleId];

    if (seekerCategoryId) {
      dispatch(deleteSeekerCategory(seekerCategoryId) as any)
        .unwrap()
        .then(() => {
          setCategoryIdMap((prev) => {
            const updated = { ...prev };
            delete updated[roleId];
            return updated;
          });
        })
        .catch(() => {
          Alert.alert("Error", "Failed to remove category");
        });
    }
  }

  // ================== SELECT ==================
  else if (newSelected.size < 4) {
    newSelected.add(roleId);

    const payload = {
      categoryId: Number(roleId),
      userId: Number(userId),
      status: 1,
      createdBy: Number(userId),
    };

    dispatch(createSeekerCategory(payload) as any)
      .unwrap()
      .then((res: any) => {
        // 🔥 Store seeker-category id returned by API
        setCategoryIdMap((prev) => ({
          ...prev,
          [roleId]: res.data.id,
        }));
      })
      .catch(() => {
        Alert.alert("Error", "Failed to add category");
      });
  }

  setSelectedRoles(newSelected);
  setValue("selectedRoles", Array.from(newSelected));
};

  // Updated onSubmit function with proper category matching
  const onSubmit = () => {
    const selectedRoleDetails = jobRoles.filter((role) =>
      selectedRoles.has(role.id)
    );

    
    // Map selected roles to include categoryId from the fetched categories
    const enrichedRoles = selectedRoleDetails.map((role) => {
      // Try to find matching category by job_categoryid
      const matchingCategory = categories?.find(
        (cat: any) => String(cat.job_categoryid) === role.id
      );
      

      return {
        ...role,
        categoryId: matchingCategory?.job_categoryid || Number(role.id),
        userId: Number(userId), // Pass userId here as well
      };
    });


navigation.push("JobDetailsScreen", {
  selectedRoles: enrichedRoles.map(r => ({
    ...r,
    id: String(r.id),           // ensure serializable
    title: r.title,
    image: r.image,             // already serializable (uri / require)
    categoryId: r.categoryId,
    userId: r.userId,
  })),
  currentRoleIndex: 0,
  completedRoles: {},
  totalRoles: enrichedRoles.length,
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
 {/* Progress Bar */}
<View style={styles.progressContainer}>
  <View style={styles.progressFill} />
</View>

{/* Image */}
<View style={styles.imageContainer}>
  <Image
    source={require('../../../assets/images/job.png')}
    style={styles.icon}
  />
</View>

{/* Title */}
<Text style={styles.title}>{t("selectJobRoles")}</Text>

          <Text style={styles.headerSubtitle}>{t("selectUpToFiveRoles")}</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor="#999"
            value={searchQueryLocal}
            onChangeText={setSearchQueryLocal}
          />
          <Ionicons name="search" size={20} color="#999" style={{marginRight: scale(8)}} />
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
            data={jobRoles}
            renderItem={renderRoleItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {jobRoles.length === 0 && searchQueryLocal.length > 0 
                    ? t("noJobRolesFound") 
                    : jobRoles.length === 0 
                    ? "No roles found" 
                    : t("noJobRolesFound")}
                </Text>
              </View>
            }
            onEndReachedThreshold={0.5}
            onEndReached={({ distanceFromEnd }) => {
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
  container: { flex: 1, backgroundColor: "#fff" },

  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },

progressContainer: {
  height: verticalScale(6),
  width: "100%",
  backgroundColor: "#cacaca",
  borderRadius: scale(4),
  marginBottom: verticalScale(12),
},

progressFill: {
  height: "100%",
  width: "40%", // ✅ 40% as requested
  backgroundColor: AppColors.themeColor,
  borderRadius: scale(4),
},

imageContainer: {
  marginBottom: verticalScale(6),
  alignItems: "flex-start",
},

icon: {
  width: scale(45),
  height: scale(45),
  resizeMode: "contain",
},

title: {
  fontSize: moderateScale(15),
  fontWeight: "bold",
  marginTop: verticalScale(12),
},


  headerSubtitle: {
    fontSize: moderateScale(12),
    color: "#999",
      marginBottom: verticalScale(12),
      marginTop: verticalScale(2),

  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: scale(1),
    borderColor: "#ccc",
    borderRadius: scale(24),
    // paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(12),
    backgroundColor: "#fff",
  },

  searchInput: {
    flex: 1,
    marginLeft: scale(8),
    fontSize: moderateScale(12),
    color: "#000",
  },

  selectedCountText: {
    fontSize: moderateScale(11),
    color: AppColors.themeColor,
    fontWeight: "600",
    marginBottom: verticalScale(10),
  },

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(8),
    borderWidth: scale(1),
    borderColor: "#ddd",
    borderRadius: scale(8),
    backgroundColor: "#fff",
  },

  roleCardSelected: {
    borderColor: AppColors.themeColor,
    backgroundColor: "#E3F2FD",
    elevation: 2,
  },

  roleCardDisabled: {
    opacity: 0.5,
  },

  roleImage: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(6),
    resizeMode: "cover",
  },

  roleImageDisabled: {
    opacity: 0.4,
  },

  roleTitle: {
    flex: 1,
    fontSize: moderateScale(13),
    fontWeight: "500",
    color: "#000",
    marginHorizontal: scale(10),
  },

  roleTitleDisabled: {
    color: "#ccc",
  },

  checkbox: {
    width: scale(14),
    height: scale(14),
    borderWidth: scale(1),
    borderColor: "#aaa",
    borderRadius: scale(2),
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxSelected: {
    backgroundColor: AppColors.themeColor,
    borderColor: AppColors.themeColor,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(30),
  },

  emptyText: {
    fontSize: moderateScale(12),
    color: "#999",
    fontWeight: "500",
  },

  buttonContainer: {
    paddingHorizontal: scale(16),
    // paddingVertical: verticalScale(12),
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
