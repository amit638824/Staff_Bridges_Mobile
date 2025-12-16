import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../../constants/AppColors';
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get('window');
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const SplashScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [dotIndex, setDotIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Logo fade-in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Dot animation
    const dotInterval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % 3);
    }, 600);

    // Navigation timeout
    const timer = setTimeout(() => {
      navigation.replace('MainApp');
    }, 3500);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.themeColor} />

      <LinearGradient
        colors={[AppColors.themeColor, AppColors.themeColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.logoBg}>
              <Image
                source={require('../../../assets/images/logo-removebg-preview.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.subText}>
            {t('splashSubText1')}
          </Text>
          <Text style={styles.subText}>
            {t('splashSubText2')}
          </Text>
        </View>

        {/* Dot Indicators */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, dotIndex === 0 && styles.activeDot]} />
          <View style={[styles.dot, dotIndex === 1 && styles.activeDot]} />
          <View style={[styles.dot, dotIndex === 2 && styles.activeDot]} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.themeColor,
  },

  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(50),
  },

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(30),
  },

  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoBg: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: scale(8),
    shadowOffset: { width: 0, height: scale(3) },
    elevation: 4,
  },

  logo: {
    width: scale(80),
    height: scale(80),
    resizeMode: 'contain',
  },

  textContainer: {
    paddingHorizontal: scale(20),
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },

  mainText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: verticalScale(6),
    lineHeight: moderateScale(24),
  },

  subText: {
    fontSize: moderateScale(13),
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },

  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  activeDot: {
    backgroundColor: '#fff',
    width: scale(20),
  },
});
