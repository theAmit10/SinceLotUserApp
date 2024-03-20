import {
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
      otpVerification();
      // Alert.alert('Success', 'OTP Entered Successfully :: ' + otp);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please enter all six digits of the OTP',
      });
    }
  };

  const submitHandler = () => {
    console.log('Working on login ');
    Toast.show({
      type: 'success',
      text1: 'Processing',
    });
    navigation.navigate("Home")
  };

  return (
    <View style={{flex: 1}}>
      <LoginBackground />

      {/** Login Cointainer */}

      <View
        style={{
          height: heightPercentageToDP(55),
          width: widthPercentageToDP(100),
          backgroundColor: COLORS.white_s,
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
          <GradientText style={styles.textStyle}>Otp Verification</GradientText>

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
                justifyContent: 'center'
              }}>
              <Text
                style={{
                  color: COLORS.black,
                  fontFamily: FONT.Montserrat_Regular,
                  textAlign: 'center'
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
                    color: COLORS.darkGrays,
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

            <TouchableOpacity
              onPress={submitHandler}
              style={{
                backgroundColor: COLORS.blue,
                padding: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
                alignItems: 'center',
                marginTop: heightPercentageToDP(5)
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONT.Montserrat_Regular,
                }}>
                Submit
              </Text>
            </TouchableOpacity>

            
          </View>
        </View>
      </View>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
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
