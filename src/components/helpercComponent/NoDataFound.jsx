import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { COLORS, FONT } from '../../../assets/constants';
import GradientText from './GradientText';

const NoDataFound = ({data}) => {
  return (
    <View
      style={{
        height: heightPercentageToDP(25),
        backgroundColor: COLORS.grayHalfBg,
        marginTop: heightPercentageToDP(2),
        borderRadius: heightPercentageToDP(1),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: heightPercentageToDP(2),
      }}>
      <GradientText
        style={{
          fontSize: heightPercentageToDP(4),
          fontFamily: FONT.Montserrat_Bold,
        }}>
        {data}
      </GradientText>
    </View>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({});
