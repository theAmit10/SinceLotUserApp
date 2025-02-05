import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Background from '../components/background/Background';
import Loading from '../components/helpercComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import LinearGradient from 'react-native-linear-gradient';
import {useGetAllLocationWithTimeQuery} from '../helper/Networkcall';
import {loadProfile} from '../redux/actions/userAction';
import {getTimeAccordingToTimezone} from './SearchTime';
import moment from 'moment-timezone';
import Toast from 'react-native-toast-message';

const Play = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height:
              Platform.OS === 'android'
                ? heightPercentageToDP(85)
                : heightPercentageToDP(80),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height:
                Platform.OS === 'android'
                  ? heightPercentageToDP(85)
                  : heightPercentageToDP(80),
              width: widthPercentageToDP(100),
              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
            }}>
            <View
              style={{
                height: heightPercentageToDP(5),
                width: widthPercentageToDP(100),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: widthPercentageToDP(20),
                  height: heightPercentageToDP(0.8),
                  backgroundColor: COLORS.grayBg,
                  borderRadius: heightPercentageToDP(2),
                }}></View>
            </View>

            <View
              style={{
                margin: heightPercentageToDP(2),
                marginTop: heightPercentageToDP(-1.5),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Play
              </GradientTextWhite>
            </View>

            {/** PLAY ARENA */}
            <TouchableOpacity
              onPress={() => navigation.navigate('PlayArenaLocation')}>
              <LinearGradient
                colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                start={{x: 0, y: 0}} // start from left
                end={{x: 1, y: 0}} // end at right
                style={styles.paymentOption}>
                <View>
                  <GradientTextWhite style={styles.textStyleContent}>
                    Play Arena
                  </GradientTextWhite>
                  <Text
                    style={{
                      color: COLORS.white_s,
                      fontSize: heightPercentageToDP(2),
                      fontFamily: FONT.Montserrat_Regular,
                    }}>
                    Get your lucky number
                  </Text>
                </View>

                <LinearGradient
                  colors={[COLORS.grayBg, COLORS.white_s]}
                  className="rounded-xl p-1">
                  <MaterialCommunityIcons
                    size={heightPercentageToDP(4)}
                    color={COLORS.darkGray}
                    name={'play-circle-outline'}
                  />
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
            {/** POWERBALL */}

            <TouchableOpacity
              onPress={() => navigation.navigate('PowerballDashboard')}>
              <LinearGradient
                colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                start={{x: 0, y: 0}} // start from left
                end={{x: 1, y: 0}} // end at right
                style={styles.paymentOption}>
                <View>
                  <GradientTextWhite style={styles.textStyleContent}>
                    Powerball
                  </GradientTextWhite>
                  <Text
                    style={{
                      color: COLORS.white_s,
                      fontSize: heightPercentageToDP(2),
                      fontFamily: FONT.Montserrat_Regular,
                    }}>
                    Get your tickets
                  </Text>
                </View>

                <LinearGradient
                  colors={[COLORS.grayBg, COLORS.white_s]}
                  className="rounded-xl p-1">
                  <MaterialCommunityIcons
                    name={'trophy-award'}
                    size={heightPercentageToDP(4)}
                    color={COLORS.darkGray}
                  />
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Play;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: heightPercentageToDP(20),
  },
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightPercentageToDP(12),
    borderRadius: heightPercentageToDP(2),
    alignItems: 'center',
    gap: heightPercentageToDP(3),
    paddingStart: heightPercentageToDP(2),
    margin: heightPercentageToDP(2),
  },
  iconContainer: {
    backgroundColor: COLORS.white_s,
    padding: heightPercentageToDP(1.5),
    borderRadius: heightPercentageToDP(1),
  },
  icon: {
    height: 25,
    width: 25,
  },
  textStyleContent: {
    fontSize: heightPercentageToDP(3),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
});
