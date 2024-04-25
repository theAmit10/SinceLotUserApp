

import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONT} from '../../assets/constants';
import SplashScreenGradientText from '../components/helpercComponent/SplashScreenGradientText';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    getUserAccessToken();
  }, []);

  const getUserAccessToken = async () => {
    try {
      const val = await AsyncStorage.getItem('accesstoken');
      console.log('From SS Access Token :: ' + val);
      // dispatch(getUserAccessToken(val));
      dispatch({
        type: 'getaccesstoken',
        payload: val,
      });

      const timer = setTimeout(() => {
        if (val) {

          navigation.navigate('Home');
        } else {
          navigation.navigate('Login');
          // navigation.navigate('Login');
        }
      }, 3000);
    } catch (error) {
      console.log('error' + error);
    }
  };



  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_s,
      }}>
      {/** Top View Rectangle View */}
      <View
        style={{
          width: heightPercentageToDP(30),
          height: heightPercentageToDP(30),
          backgroundColor: COLORS.white_s,
          position: 'absolute',
          borderRadius: heightPercentageToDP(5),
          zIndex: 0,
          top: heightPercentageToDP(29),
          left: widthPercentageToDP(20),
          elevation: heightPercentageToDP(2),
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
          elevation: heightPercentageToDP(2),
        }}>
        <View
          className="rounded-full h-5 w-5"
          style={{
            margin: heightPercentageToDP(3),
            backgroundColor: COLORS.background,
          }}></View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.grayHalfBg,
          position: 'absolute',
          top: '35%',
          left: '30%',
          padding: heightPercentageToDP(2),
          height: heightPercentageToDP(20),
          width: heightPercentageToDP(20),
        }}
        className="rounded-full ">
        <View
          style={{
            height: heightPercentageToDP(15),
            width: heightPercentageToDP(15),
            backgroundColor: COLORS.white_s,
            padding: heightPercentageToDP(2),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
          className="rounded-full ">
           <Image
              source={require('../../assets/image/sincelogo.png')}
              resizeMode="contain"
              style={{
                height: heightPercentageToDP(15),
                width: heightPercentageToDP(15),
              }}
            />
        </View>
      </View>

      <View
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          transform: [{rotate: '90deg'}],
          bottom: heightPercentageToDP(18),
          left: heightPercentageToDP(-14),
          zIndex: 2,
        }}>
        <SplashScreenGradientText
          style={{
            fontFamily: FONT.Montserrat_SemiBold,
            fontSize: heightPercentageToDP(6),
            marginStart: heightPercentageToDP(1),
            color: COLORS.golden,
          }}>
          SINCE 1927
        </SplashScreenGradientText>
      </View>

      <View
        style={{
          backgroundColor: 'transparent',
          transform: [{rotate: '90deg'}],
          position: 'absolute',
          zIndex: 2,
          top: heightPercentageToDP(42),
          right: widthPercentageToDP(-16)
        }}>
        <Text
          style={{
            fontFamily: FONT.ELEPHANT,
            fontSize: heightPercentageToDP(2.6),
            color: COLORS.golden,
          }}>
          THE LION WORLD
        </Text>
      </View>

    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
