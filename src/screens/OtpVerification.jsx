import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import LoginBackground from '../components/login/LoginBackground';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import UrlHelper from '../helper/UrlHelper';
import Loading from '../components/helpercComponent/Loading';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const OtpVerification = () => {
  const navigation = useNavigation();

  const inputs = Array(6)
    .fill(0)
    .map((_, index) => useRef(null));
  const [otp, setOtp] = useState('');
  const [showProgressBar, setProgressBar] = useState(false);

  const handleChangeText = (text, index) => {
    const newOtp = otp.slice(0, index) + text + otp.slice(index + 1);
    setOtp(newOtp);
    if (text.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].current.focus();
    }
  };

  const handleCheckOtp = () => {
    if (otp.length === 6) {
      submitHandler();
      // Alert.alert('Success', 'OTP Entered Successfully :: ' + otp);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please enter all six digits of the OTP',
      });
    }
  };

  const submitHandler = async () => {
    console.log('Working on OTP verifcation ');

    Toast.show({
      type: 'info',
      text1: 'Processing',
    });
    setProgressBar(true);

    try {
      console.log('OTP :: ' + otp);

      const {data} = await axios.put(
        UrlHelper.FORGOT_PASSWORD_API,
        {
          otp: parseInt(otp),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('datat :: ' + data);

      setProgressBar(false);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      setProgressBar(false);

      if (error.response.data.message === 'Please enter new password ') {
        navigation.navigate('ResetPassword', {
          otp: otp,
        });
      } else if (
        error.response.data.message === 'Incorrect OTP or OTP has been expired'
      ) {
        Toast.show({
          type: 'error',
          text1: error.response.data.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <LoginBackground />

      {/** Login Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(55),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(55),
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

            {/** Login Main Container */}
            <View
              style={{
                flex: 1,
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Otp Verification
              </GradientTextWhite>

              <View
                style={{
                  marginTop: heightPercentageToDP(3),
                  paddingVertical: heightPercentageToDP(2),
                  gap: heightPercentageToDP(2),
                }}>
                <View
                  style={{
                    padding: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(1),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.white_s,
                    borderRadius: heightPercentageToDP(4)
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontFamily: FONT.Montserrat_Regular,
                      textAlign: 'center',
                    }}>
                    Enter the One time password sent to your Account
                  </Text>
                </View>
                {/** Otp container */}

                <View style={styles.otpContainer}>
                  {inputs.map((input, index) => (
                    <TextInput
                      key={index}
                      style={{
                        color: COLORS.black,
                        borderColor: COLORS.gray2,
                        backgroundColor: COLORS.white,
                        ...styles.userOtpInput,
                      }}
                      maxLength={1}
                      keyboardType="numeric"
                      onChangeText={text => handleChangeText(text, index)}
                      ref={input}
                      autoFocus={index === 0}
                    />
                  ))}
                </View>

                {showProgressBar ? (
                  <View
                    style={{
                      height: heightPercentageToDP(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Loading />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleCheckOtp}
                    style={{
                      backgroundColor: COLORS.blue,
                      padding: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      alignItems: 'center',
                      marginTop: heightPercentageToDP(5),
                    }}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontFamily: FONT.Montserrat_Regular,
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  userOtpInput: {
    fontFamily: FONT.Montserrat_Bold,
    padding: heightPercentageToDP(1),
    fontSize: heightPercentageToDP(3),
    borderWidth: 2,
    borderRadius: heightPercentageToDP(1),
    margin: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(1),
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(2),
  },
});
