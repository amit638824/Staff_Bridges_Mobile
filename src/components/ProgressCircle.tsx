import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

const ProgressCircle = ({ percentage }: { percentage: number }) => {
  const { t } = useTranslation();

  const radius = 30;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={70} height={70}>
        <Circle
          stroke="#f8cfe0"
          fill="none"
          cx={35}
          cy={35}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#E91E63"
          fill="none"
          cx={35}
          cy={35}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="35,35"
        />
      </Svg>

      <Text
        style={{
          position: 'absolute',
          fontSize: 12,
          fontWeight: '700',
          color: '#E91E63',
          textAlign: 'center',
        }}
      >
        {percentage}%{"\n"}
        {t("progress_done")}
      </Text>
    </View>
  );
};

export default ProgressCircle;
