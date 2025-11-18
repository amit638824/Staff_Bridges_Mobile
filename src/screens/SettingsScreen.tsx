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
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const SettingsScreen: React.FC = () => {
  const [smsEnabled, setSmsEnabled] = useState(true);

  const handleBack = () => {
    // Navigate back
    console.log("Back pressed");
  };

  const handleInvite = () => {
    // Handle invite functionality
    console.log("Invite Now pressed");
  };

  const handleFeedback = () => {
    // Handle feedback functionality
    console.log("Give Feedback pressed");
  };

  const handleContactUs = () => {
    Linking.openURL("mailto:support@staffbridges.com");
  };

  const handleTerms = () => {
    Linking.openURL("https://staffbridges.com/terms");
  };

  const handlePrivacy = () => {
    Linking.openURL("https://staffbridges.com/privacy");
  };

  return (
    <View style={styles.container}>
      <AppHeader
        showLogo={false}
        showLocation={false}
        // showBackArrow={true}
        onBackPressed={handleBack}
        customLeftWidget={
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrow-back" size={24} color="#00A79D" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        }
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* SMS Preference */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>SMS Preference</Text>
              <Text style={styles.sectionSubtitle}>Get notified by Job Hot</Text>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: "#d1d1d1", true: "#00A79D" }}
              thumbColor="#fff"
              ios_backgroundColor="#d1d1d1"
            />
          </View>
        </View>

        {/* Like the app */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Like the app?</Text>
          <Text style={styles.sectionSubtitle}>
            Invite your friends to Staff Bridges and help them find good jobs
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleInvite}>
            <Text style={styles.buttonText}>Invite Now</Text>
          </TouchableOpacity>
        </View>

        {/* Rate Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>
            Rate your experience on Staff Bridges
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleFeedback}>
            <Text style={styles.buttonText}>Give Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Need Help */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          
          <TouchableOpacity style={styles.linkItem} onPress={handleContactUs}>
            <Text style={styles.linkText}>Contact us - Email</Text>
            <Icon name="open-in-new" size={16} color="#00A79D" style={styles.linkIcon} />
          </TouchableOpacity>
          <Text style={styles.helpText}>
            Our team will get back to you as soon as possible with the most suitable solution
          </Text>

          <TouchableOpacity style={styles.linkItem} onPress={handleTerms}>
            <Text style={styles.linkText}>Terms and Conditions</Text>
            <Icon name="open-in-new" size={16} color="#00A79D" style={styles.linkIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={handlePrivacy}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Icon name="open-in-new" size={16} color="#00A79D" style={styles.linkIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AppFooter currentIndex={4} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastSection: {
    borderBottomWidth: 0,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#00A79D",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  buttonText: {
    color: "#00A79D",
    fontSize: 14,
    fontWeight: "600",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
    color: "#00A79D",
    fontWeight: "500",
  },
  linkIcon: {
    marginLeft: 6,
  },
  helpText: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
    lineHeight: 16,
  },
});

export default SettingsScreen;