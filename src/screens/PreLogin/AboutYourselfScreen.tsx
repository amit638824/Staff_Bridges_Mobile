import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { AppColors } from "../../constants/AppColors";

const educationOptions = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post Graduate",
];

export default function AboutYourselfScreen() {
  const navigation = useNavigation<any>();

  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");

  const handleNext = () => {
    navigation.navigate("WorkLocationScreen");
  };

  return (
    <SafeAreaView 
      style={[
        styles.safeArea, 
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }
      ]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Progress Bar */}
<View style={styles.progressContainer}>
  <View style={styles.progressFill} />
</View>

        {/* Icon */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/list.png")}
            style={styles.icon}
          />
        </View>

        <Text style={styles.title}>About yourself</Text>

        {/* Full Name */}
        <Text style={styles.label}>Your Name</Text>
        <TextInput placeholder="Full Name" style={styles.input} />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.row}>
          {["Male", "Female"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, gender === item && styles.chipSelected]}
              onPress={() => setGender(item)}
            >
              <Icon name={item === "Male" ? "male" : "female"} size={16} color="black" />
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Education */}
        <Text style={styles.label}>Education</Text>
        <View style={styles.wrap}>
          {educationOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, education === item && styles.chipSelected]}
              onPress={() => setEducation(item)}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Experience */}
        <Text style={styles.label}>Work Experience</Text>
        <View style={styles.row}>
          {["I have experience", "I am a fresher"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, experience === item && styles.chipSelected]}
              onPress={() => setExperience(item)}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Salary */}
        <Text style={styles.label}>Monthly Salary</Text>

        <View style={styles.salaryBox}>
          <TextInput
            style={styles.salaryInputField}
            placeholder="Eg. ₹12,000"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
          />

          <Text style={styles.suffixText}>Per month</Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    padding: 20,
  },

progressContainer: {
  height: 10,
  width: "100%",
  backgroundColor: "#cacaca",
  borderRadius: 5,
  marginBottom: 20,
},

progressFill: {
  height: "100%",
  width: "20%",  // progress percentage
  backgroundColor: AppColors.buttons,
  borderRadius: 5,
},

  imageContainer: { marginBottom: 10 },
  icon: { width: 60, height: 60 },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 20 },
  label: { marginTop: 10, fontSize: 15, fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    color: "black",
  },

  row: { flexDirection: "row", gap: 10, marginVertical: 8 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 10 },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: "#ccc",
  },

  chipSelected: {
    backgroundColor: "#e7f6f6",
    borderColor: "#099ca4",
  },

  chipText: { marginLeft: 5, fontSize: 13 },

  salaryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 6,
  },

  salaryInputField: {
    flex: 1,
    paddingVertical: 12,
    color: "black",
    fontSize: 15,
  },

  suffixText: {
    color: "#555",
    fontSize: 14,
    marginLeft: 5,
  },

  primaryButton: {
    backgroundColor: AppColors.buttons,
    padding: 16,
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 25,
  },

  btnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
