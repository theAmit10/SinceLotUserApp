


import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { COLORS, FONT } from '../../../assets/constants';


const LoginBackground = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.grayBg,
      }}>
        {/** Top View Rectangle View */}
      <View
        style={{
          width: heightPercentageToDP(30),
          height: heightPercentageToDP(30),
          backgroundColor: COLORS.white_s,
          position: 'absolute',
          borderRadius: heightPercentageToDP(5),
          zIndex: 1,
          top: heightPercentageToDP(10),
          left: widthPercentageToDP(20),
        }}>
        <View
          style={{
            width: heightPercentageToDP(15),
            height: heightPercentageToDP(30),
            backgroundColor: COLORS.lightWhite,
            position: 'absolute',
            zIndex: 1,
            borderTopLeftRadius: heightPercentageToDP(5),
            borderBottomLeftRadius: heightPercentageToDP(5),
          }}></View>
      </View>
      <View
        style={{
          backgroundColor: COLORS.grayHalfBg,
          width: widthPercentageToDP(50),
          flex: 1,
          opacity: 80,
        }}>
        <Text
          style={{
            fontFamily: FONT.ZCOOL_Regular,
            fontSize: heightPercentageToDP(2.5),
            padding: heightPercentageToDP(2),
            color: COLORS.white_s,
          }}>
          Since 1984
        </Text>

        <View
          className="rounded-full h-5 w-5"
          style={{
            margin: heightPercentageToDP(3),
            backgroundColor: COLORS.background,
          }}></View>
      </View>

      
    </View>
  );
};

export default LoginBackground;

const styles = StyleSheet.create({});
