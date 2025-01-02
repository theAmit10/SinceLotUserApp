


import {ImageBackground, StyleSheet, Text, View} from 'react-native';
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

        <ImageBackground
        source={require("../../../assets/image/tlwbg.jpg")}
        style={{
          width: '100%',
          height: '100%',
        }}
        >

        
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
          backgroundColor: 'rgba(128, 128, 128, 0.5)',
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
          Since 2001
        </Text>

        <View
          className="rounded-full h-5 w-5"
          style={{
            margin: heightPercentageToDP(3),
            backgroundColor: COLORS.background,
          }}></View>
      </View>
      </ImageBackground>
      
    </View>
  );
};

export default LoginBackground;

const styles = StyleSheet.create({});
