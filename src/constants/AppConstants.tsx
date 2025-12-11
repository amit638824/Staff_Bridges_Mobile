import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const AppConstants = {
  // 🌐 API URLs
  baseUrl: 'https://api.staffbridges.com',
  
  // ⚙️ App constants
  splashDelay: 3, // seconds
  appName: 'Staff Bridges - Job Seeker', // Application name
  
  // 📱 Screen Dimensions
  screenWidth: width,
  screenHeight: height,
  
  // 🎨 Responsive Spacing
  spacing: {
    xs: width * 0.02,      // 2% of screen width
    sm: width * 0.03,      // 3% of screen width
    md: width * 0.05,      // 5% of screen width
    lg: width * 0.08,      // 8% of screen width
    xl: width * 0.1,       // 10% of screen width
  },
  
  // 📐 Responsive Padding & Margins
  padding: {
    xxs:width*0.01,
    xs: width * 0.02,      // 2% of screen width
    sm: width * 0.03,      // 3% of screen width
    md: width * 0.05,      // 5% of screen width
    lg: width * 0.08,      // 8% of screen width
    xl: width * 0.1,       // 10% of screen width
  },
  
  // 🔤 Responsive Font Sizes
  fontSize: {
    xs: width * 0.03,      // Extra small: ~10px on 375px width
    sm: width * 0.035,     // Small: ~13px on 375px width
    md: width * 0.04,      // Medium: ~15px on 375px width
    lg: width * 0.045,     // Large: ~17px on 375px width
    xl: width * 0.05,      // Extra large: ~18px on 375px width
    xxl: width * 0.055,    // 2X large: ~20px on 375px width
  },
  
  // 📏 Responsive Icon Sizes
  iconSize: {
    xxs:width*0.03,
    xs: width * 0.04,      // ~15px
    sm: width * 0.06,      // ~22px
    md: width * 0.08,      // ~30px
    lg: width * 0.12,      // ~45px
    xl: width * 0.15,      // ~56px
  },
  
  // 🎯 Responsive Button Heights
  buttonHeight: {
    sm: height * 0.04,     // ~32px
    md: height * 0.055,    // ~44px
    lg: height * 0.07,     // ~56px
  },
  
  // 📦 Responsive Input Heights
  inputHeight: {
    sm: height * 0.045,    // ~36px
    md: height * 0.055,    // ~44px
    lg: height * 0.065,    // ~52px
  },
  
  // 🔲 Responsive Border Radius
  borderRadius: {
    sm: width * 0.02,      // ~7px
    md: width * 0.04,      // ~15px
    lg: width * 0.08,      // ~30px
  },
  
  // 📊 Image/Card Dimensions
  image: {
    thumbnailWidth: width * 0.2,
    thumbnailHeight: width * 0.2,
    cardWidth: width * 0.9,
    cardHeight: height * 0.25,
    largeImageHeight: height * 0.35,
  },
  
  // 🔲 Progress Bar
  progressBar: {
    height: height * 0.01,  // ~8px
    borderRadius: width * 0.02,
  },
  
  // 📱 Platform-specific values
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  
  // 📏 Safe Area consideration
  safeAreaPadding: {
    top: Platform.OS === 'ios' ? height * 0.05 : height * 0.02,
    bottom: height * 0.03,
  },
} as const;
