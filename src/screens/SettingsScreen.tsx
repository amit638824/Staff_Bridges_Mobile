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
import { scale, verticalScale, moderateScale, moderateVerticalScale } from "react-native-size-matters";
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
  marginLeft: moderateScale(-5),   // <-- Pull the title closer to the back arrow
},


  headerTitle: { 
    fontSize: scale(13.5), 
    fontWeight: "600", 
    color: "#000" 
  },

  scrollView: { 
    flex: 1 
  },

  scrollContent: {
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateVerticalScale(8),
    paddingBottom: moderateVerticalScale(10),
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    shadowColor: "#96fcfcff",
    shadowOffset: { width: 0, height: moderateScale(1) },
    shadowOpacity: 0.16,
    shadowRadius: moderateScale(2.5),
    elevation: 3,
    marginBottom: moderateVerticalScale(8),
    borderWidth: moderateScale(0.8),
    borderColor: "#E8E8E8",
  },

  smsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smsLabel: {
    fontSize: scale(10.5),
    color: "#666",
    flex: 1,
  },

  sectionTitle: {
    fontSize: scale(11.5),
    fontWeight: "600",
    color: "#000",
    marginBottom: moderateVerticalScale(8),
  },

  customToggle: {
    width: moderateScale(34),
    height: moderateScale(17),
    marginTop: moderateVerticalScale(6),
    borderRadius: moderateScale(10),
    backgroundColor: "#d1d1d1",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: moderateScale(2),
  },

  toggleActive: {
    backgroundColor: AppColors.themeColor,
    alignItems: "flex-end",
  },

  toggleThumb: {
    width: moderateScale(11),
    height: moderateScale(11),
    borderRadius: moderateScale(8),
    margin: moderateScale(2.5),
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
    fontSize: scale(10),
    color: "#666",
    flex: 1,
    marginRight: moderateScale(8),
    lineHeight: moderateVerticalScale(13),
  },

  outlineButton: {
    paddingVertical: moderateVerticalScale(5),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(14),
    borderWidth: moderateScale(1),
    borderColor: AppColors.themeColor,
    minWidth: moderateScale(70),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(3),
  },

  whatsappIcon: {
    marginRight: moderateScale(3),
  },

  outlineButtonText: {
    color: AppColors.themeColor,
    fontSize: scale(9.5),
    fontWeight: "600",
  },

  divider: {
    height: moderateScale(1),
    backgroundColor: "#E8E8E8",
    marginVertical: moderateVerticalScale(10),
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  linkText: {
    fontSize: scale(10.5),
    color: AppColors.themeColor,
    fontWeight: "500",
  },

  linkIcon: {
    marginLeft: moderateScale(4),
  },

  helpDescription: {
    fontSize: scale(10),
    color: "#888",
    marginTop: moderateVerticalScale(3),
    marginBottom: moderateVerticalScale(3),
    lineHeight: moderateVerticalScale(12),
  },

  spacer: {
    flex: 1,
    minHeight: moderateVerticalScale(14),
  },

  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(3),
    marginTop: moderateVerticalScale(10),
  },

  actionText: {
    color: AppColors.themeColor,
    fontSize: scale(11),
    fontWeight: "600",
  },

  versionContainer: {
    alignItems: "center",
    paddingTop: moderateVerticalScale(10),
  },

  versionText: {
    fontSize: scale(9),
    color: "#999",
  },
});

export default SettingsScreen;
