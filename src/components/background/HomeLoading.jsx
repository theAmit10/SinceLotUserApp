import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../../assets/constants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import Loading from '../helpercComponent/Loading';

const HomeLoading = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'row'}}>
          <LinearGradient
            colors={[COLORS.lightDarkGray, COLORS.white_s]}
            style={{
              height: heightPercentageToDP(10),
              width: heightPercentageToDP(10),
              margin: heightPercentageToDP(1),
              borderRadius: heightPercentageToDP(1),
            }}
            className="rounded-full"></LinearGradient>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LinearGradient
            colors={[COLORS.grayBg, COLORS.gray2]}
            style={{
              height: heightPercentageToDP(5),
              width: heightPercentageToDP(5),
              margin: heightPercentageToDP(1),
              borderRadius: heightPercentageToDP(1),
            }}
            className="rounded-full"></LinearGradient>

          <LinearGradient
            colors={[COLORS.grayBg, COLORS.gray2]}
            style={{
              height: heightPercentageToDP(5),
              width: heightPercentageToDP(5),
              margin: heightPercentageToDP(1),
              marginEnd: heightPercentageToDP(2),
              borderRadius: heightPercentageToDP(1),
            }}
            className="rounded-full"></LinearGradient>
        </View>
      </View>

      <LinearGradient
        colors={[COLORS.grayBg, COLORS.gray2]}
        style={{
          height: heightPercentageToDP(8),
          margin: heightPercentageToDP(1),
          borderRadius: heightPercentageToDP(1),
        }}></LinearGradient>

      <LinearGradient
        colors={[COLORS.grayBg, COLORS.gray2]}
        style={{
          height: heightPercentageToDP(15),
          margin: heightPercentageToDP(1),
          borderRadius: heightPercentageToDP(1),
        }}></LinearGradient>

      <Loading />

      <LinearGradient
        colors={[COLORS.grayBg, COLORS.gray2]}
        style={{
          height: heightPercentageToDP(30),
          margin: heightPercentageToDP(1),
          borderRadius: heightPercentageToDP(1),
        }}></LinearGradient>

      <LinearGradient
        colors={[COLORS.grayBg, COLORS.gray2]}
        style={{
          height: heightPercentageToDP(10),
          margin: heightPercentageToDP(1),
          borderRadius: heightPercentageToDP(1),
        }}></LinearGradient>
    </SafeAreaView>
  );
};

export default HomeLoading;

const styles = StyleSheet.create({});
