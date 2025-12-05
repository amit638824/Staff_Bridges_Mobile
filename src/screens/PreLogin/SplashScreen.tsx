import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../../constants/AppColors';

const { width, height } = Dimensions.get('window');

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
    paddingVertical: 60,
  },

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  logo: {
    width: 100,
    height: 100,
  },

  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 40,
  },

  mainText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },

  subText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
});