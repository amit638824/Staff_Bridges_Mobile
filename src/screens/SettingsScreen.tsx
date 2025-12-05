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
import { useTranslation } from 'react-i18next';

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
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
            <Text style={styles.headerTitle}>{t('settings_header_title')}</Text>
          </View>
        }
      />
      <View style={styles.divider}></View>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.smsRow}>
            <Text style={styles.sectionTitle}>{t('settings_sms_preference')}</Text>
            <TouchableOpacity 
              style={[styles.customToggle, smsEnabled && styles.toggleActive]}
              onPress={() => setSmsEnabled(!smsEnabled)}
            >
              <View style={[styles.toggleThumb, smsEnabled && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.smsLabel}>{t('settings_sms_label')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('settings_like_app_title')}</Text>
          
          <View style={styles.rowWithButton}>
            <Text style={styles.descriptionText}>
              {t('settings_invite_description')}
            </Text>
            <TouchableOpacity style={styles.outlineButton} onPress={handleInvite}>
              <FontAwesome name="whatsapp" size={16} color={AppColors.themeColor} style={styles.whatsappIcon} />
              <Text style={styles.outlineButtonText}>{t('settings_invite_button')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowWithButton}>
            <Text style={styles.descriptionText}>
              {t('settings_rate_experience')}
            </Text>
            <TouchableOpacity style={styles.outlineButton} onPress={handleFeedback}>
              <Text style={styles.outlineButtonText}>{t('settings_feedback_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('settings_need_help')}</Text>

          <TouchableOpacity style={styles.linkRow} onPress={handleContactUs}>
            <Text style={styles.linkText}>{t('settings_contact_us')}</Text>
            <Icon name="open-in-new" size={14} color={AppColors.themeColor} style={styles.linkIcon} />
          </TouchableOpacity>

          <Text style={styles.helpDescription}>
            {t('settings_help_description')}
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkRow} onPress={handleTerms}>
            <Text style={styles.linkText}>{t('settings_terms')}</Text>
            <Icon name="open-in-new" size={14} color={AppColors.themeColor} style={styles.linkIcon} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkRow} onPress={handlePrivacy}>
            <Text style={styles.linkText}>{t('settings_privacy')}</Text>
            <Icon name="open-in-new" size={14} color={AppColors.themeColor} style={styles.linkIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <View style={styles.bottomActions}>
          <TouchableOpacity onPress={handleDeactivate}>
            <Text style={styles.actionText}>{t('settings_deactivate_account')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.actionText}>{t('settings_sign_out')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>{t('settings_app_version')}</Text>
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