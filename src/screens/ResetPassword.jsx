import {
  SafeAreaView,
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

const ResetPassword = ({route}) => {

    const {otp} = route.params

  const navigation = useNavigation();
  const [password, setPassword] = useState('');

  const [showProgressBar, setProgressBar] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  // For Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const submitHandler = async () => {
    console.log('Working on Reset Password ');

    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Enter password',
      });
    } else if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password must be atleast 6 characters long',
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Processing',
      });
      setProgressBar(true);

      try {
        const {data} = await axios.put(
          UrlHelper.FORGOT_PASSWORD_API,
          {
            otp: otp,
            password: password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('datat :: ' + data);

        Toast.show({
          type: 'success',
          text1: 'OTP sent to mail',
          text2: data.message,
        });
        setProgressBar(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      } catch (error) {
        setProgressBar(false);
        console.log(error)
        console.log(error.response.data.message)
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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
          <GradientText style={styles.textStyle}>Reset Password</GradientText>

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
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}>
              <Text
                style={{
                  color: COLORS.black,
                  fontFamily: FONT.Montserrat_Regular,
                }}>
                Please enter a new password
              </Text>
            </View>
            {/** Otp container */}

            {/** Password container */}
            <View
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
              <Entypo
                name={'lock'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
              <TextInput
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                  color: COLORS.black,
                }}
                placeholder="Password"
                placeholderTextColor={COLORS.black}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={!passwordVisible}
              />
              <Entypo
                onPress={togglePasswordVisibility}
                name={passwordVisible ? 'eye' : 'eye-with-line'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
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
                onPress={submitHandler}
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
    </SafeAreaView>
  );
};

export default ResetPassword;

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
