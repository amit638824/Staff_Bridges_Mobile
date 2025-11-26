import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import { AppColors } from "../constants/AppColors";

const SettingsScreen: React.FC = () => {
  const [smsEnabled, setSmsEnabled] = useState(true);

  const handleBack = () => console.log("Back pressed");
  const handleInvite = () => console.log("Invite Now pressed");
  const handleFeedback = () => console.log("Give Feedback pressed");
  const handleContactUs = () => Linking.openURL("mailto:support@staffbridges.com");
  const handleTerms = () => Linking.openURL("https://staffbridges.com/terms");
  const handlePrivacy = () => Linking.openURL("https://staffbridges.com/privacy");
  const handleDeactivate = () => console.log("Deactivate Account pressed");
  const handleSignOut = () => console.log("Sign Out pressed");

  return (
    <View style={styles.container}>
      <AppHeader
        showLogo={false}
        showLocation={false}
        showNotification={false}
        showBackArrow={true}
        onBackPressed={handleBack}
        customLeftWidget={
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        }
      />
<View style={styles.divider}></View>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SMS Preference Card */}
        <View style={styles.card}>
          <View style={styles.smsRow}>
              <Text style={styles.sectionTitle}>SMS Preference</Text>
           <TouchableOpacity 
              style={[styles.customToggle, smsEnabled && styles.toggleActive]}
              onPress={() => setSmsEnabled(!smsEnabled)}
            >
              <View style={[styles.toggleThumb, smsEnabled && styles.toggleThumbActive]} />
            </TouchableOpacity>
                 
          </View>
            <Text style={styles.smsLabel}>Get notified by Staff Bridges</Text>
      
        </View>

        {/* Like the App Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Like the app?</Text>
          
          <View style={styles.rowWithButton}>
            <Text style={styles.descriptionText}>
              Invite your friends to Staff Bridges and {"\n"}help them find good jobs
            </Text>
            <TouchableOpacity style={styles.outlineButton} onPress={handleInvite}>
              <FontAwesome name="whatsapp" size={16} color={AppColors.themeColor} style={styles.whatsappIcon} />
              <Text style={styles.outlineButtonText}>Invite Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowWithButton}>
            <Text style={styles.descriptionText}>
              Rate your experience on Staff Bridges
            </Text>
            <TouchableOpacity style={styles.outlineButton} onPress={handleFeedback}>
              <Text style={styles.outlineButtonText}>Give Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Need Help Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Need Help?</Text>

          <TouchableOpacity style={styles.linkRow} onPress={handleContactUs}>
            <Text style={styles.linkText}>Contact us - Email</Text>
            <Icon name="open-in-new" size={14} color={AppColors.themeColor} style={styles.linkIcon} />
          </TouchableOpacity>

          <Text style={styles.helpDescription}>
            Our team will get back to you, as soon as possible {"\n"}with the most suitable solution
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkRow} onPress={handleTerms}>
            <Text style={styles.linkText}>Terms and Conditions</Text>
            <Icon name="open-in-new" size={14} color={AppColors.themeColor} style={styles.linkIcon} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkRow} onPress={handlePrivacy}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Icon name="open-in-new" size={14} color={AppColors.themeColor} style={styles.linkIcon} />
          </TouchableOpacity>
        </View>

        {/* Spacer to push bottom content */}
        <View style={styles.spacer} />

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity onPress={handleDeactivate}>
            <Text style={styles.actionText}>Deactivate Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.actionText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App version 1.0.0</Text>
        </View>
      </ScrollView>

      <AppFooter currentIndex={4} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  headerLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingLeft: 8 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#000" 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#96fcfcff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  
  },
  smsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smsLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  customToggle: {
    width: 48,
    height: 24,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: "#d1d1d1",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: AppColors.themeColor,
    alignItems: "flex-end",
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 12,
    margin: 4,
    backgroundColor: "#fff",
  },
  toggleThumbActive: {
    backgroundColor: "#fff",
  },
  rowWithButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descriptionText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
    marginRight: 12,
    lineHeight: 18,
  },
  outlineButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: AppColors.themeColor,
    minWidth: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  whatsappIcon: {
    marginRight: 4,
  },
  outlineButtonText: {
    color: AppColors.themeColor,
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 14,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: AppColors.themeColor,
    fontWeight: "500",
  },
  linkIcon: {
    marginLeft: 6,
  },
  helpDescription: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 17,
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 16,
  },
  actionText: {
    color: AppColors.themeColor,
    fontSize: 14,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    paddingTop: 16,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
});

export default SettingsScreen;