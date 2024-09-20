import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';

import {useNavigation} from '@react-navigation/native';

import {useDispatch} from 'react-redux';

import Background from '../components/background/Background';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const GameDescritptionDetails = ({route}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {locationdata} = route.params;

  console.log(locationdata);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  // For Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // for Submitting Response
  const submitHandler = () => {
    console.log('Working on login ');
  };

  const loading = false;

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />

      {/** main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(80),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(80),
              width: widthPercentageToDP(100),

              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
            }}>
            {/** Top Style View */}
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

            {/** Game Description Main Container */}
            <View
              style={{
                flex: 1,
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                {locationdata.lotlocation}
              </GradientTextWhite>
              <GradientTextWhite style={styles.textStyle}>Details</GradientTextWhite>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    marginTop: heightPercentageToDP(3),
                    paddingVertical: heightPercentageToDP(2),
                    gap: heightPercentageToDP(2),
                  }}>
                  {/** Title container */}
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: COLORS.white_s,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      padding: heightPercentageToDP(2),
                    }}>
                    <Text
                      style={{
                        marginStart: heightPercentageToDP(1),
                        flex: 1,
                        fontFamily: FONT.Montserrat_SemiBold,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      {locationdata?.locationTitle === ''
                        ? 'No Title Available'
                        : locationdata?.locationTitle}
                    </Text>
                  </View>

                  {/** Description Containter */}

                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: COLORS.white_s,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      padding: heightPercentageToDP(2),
                    }}>
                    <Text
                      style={{
                        marginStart: heightPercentageToDP(1),
                        flex: 1,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      {locationdata?.locationDescription === ''
                        ? 'No Description Available'
                        : locationdata?.locationDescription}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default GameDescritptionDetails;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
});
