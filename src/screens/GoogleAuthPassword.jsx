import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import LoginBackground from '../components/login/LoginBackground';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {register} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';
import Loading from '../components/helpercComponent/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UrlHelper from '../helper/UrlHelper';

const GoogleAuthPassword = ({route}) => {
  const {data} = route.params;
  console.log('signuptype :: ' + data);

  console.log(data?.user?.email);

  const full_name = `${data?.user?.givenName} ${
    data?.user?.familyName ? data?.user?.familyName : ''
  }`;
  console.log(full_name);

  const [name, setName] = useState(full_name);
  const [email, setEmail] = useState(data?.user?.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [userDeviceToken, setUserDeviceToken] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Select Country');
  const [parentId, setParentId] = useState('');
  const navigation = useNavigation();
  const [showProgressBar, setProgressBar] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibilityConfirmPassword = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const dispatch = useDispatch();
  // const loading = useMessageAndErrorUser(navigation, dispatch, 'Login');

  useEffect(() => {
    getDeviceAccessToken();
  }, []);

  const getDeviceAccessToken = async () => {
    try {
      const val = await AsyncStorage.getItem('fcm_token');
      console.log('Device Token :: ' + val);
      setUserDeviceToken(val);
    } catch (error) {
      console.log('error' + error);
    }
  };

  const submitHandler = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    } else if (!confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Enter confirm password',
      });
    } else if (password != confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password and Confirm Password Not Matched',
      });
    } else if (!selectedCountry === 'Select Country') {
      Toast.show({
        type: 'error',
        text1: 'Please select your country',
      });
    } else {
      // dispatch(register(name, email, password));
      // Toast.show({
      //   type: 'success',
      //   text1: 'Processing',
      // });

      Toast.show({
        type: 'success',
        text1: 'Processing',
      });
      setProgressBar(true);
      try {
        let body = {};

        if (parentId) {
          body = {
            name,
            email,
            password,
            devicetoken: userDeviceToken,
            role: 'user',
            country: route.params?.country._id,
            parentId,
          };
        } else {
          body = {
            name,
            email,
            password,
            devicetoken: userDeviceToken,
            role: 'user',
            country: route.params?.country._id,
          };
        }

        const {data} = await axios.post(UrlHelper.REGISTER_API, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('datat :: ' + JSON.stringify(data));

        Toast.show({
          type: 'success',
          text1: data.message,
        });
        setProgressBar(false);
        navigation.navigate('Login');
      } catch (error) {
        setProgressBar(false);
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message,
        });
      }
    }
  };

  useEffect(() => {
    if (route.params?.country) {
      setSelectedCountry(route.params.country.countryname);
      console.log('Country :: ' + JSON.stringify(route.params?.country));
    }
  }, [route.params?.country]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <LoginBackground />

      {/** Login Cointainer */}

      <View
        style={{
          height: heightPercentageToDP(75),
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
          <GradientText style={styles.textStyle}>Create Password</GradientText>

          <View
            style={{
              marginTop: heightPercentageToDP(3),
              paddingVertical: heightPercentageToDP(2),
              gap: heightPercentageToDP(2),
            }}>
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
                value={password}
                placeholderTextColor={COLORS.black}
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

            {/** Confirm Password container */}
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
                placeholder="Confirm Password"
                value={confirmPassword}
                placeholderTextColor={COLORS.black}
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry={!confirmPasswordVisible}
              />
              <Entypo
                onPress={togglePasswordVisibilityConfirmPassword}
                name={passwordVisible ? 'eye' : 'eye-with-line'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
            </View>

            {/** Country container */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SelectCountry', {
                  fromScreen: 'GoogleAuthPassword',
                  signupwith: 'emailtype',
                })
              }
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
                marginBottom: heightPercentageToDP(2),
              }}>
              <Entypo
                name={'location'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                  color: COLORS.black,
                }}>
                {selectedCountry}
              </Text>
              <Entypo
                name={'chevron-with-circle-down'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
            </TouchableOpacity>

            {/* PARTNER ID */}

            <View
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
                marginBottom: heightPercentageToDP(2),
              }}>
              <MaterialCommunityIcons
                name={'account-group-outline'}
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
                placeholder="Partner ID (Optional)"
                placeholderTextColor={COLORS.black}
                value={parentId}
                onChangeText={text => setParentId(text)}
              />
            </View>

            {showProgressBar ? (
              <View
                style={{
                  padding: heightPercentageToDP(2),
                  marginTop: heightPercentageToDP(4),
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
                  marginTop: heightPercentageToDP(4),
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

export default GoogleAuthPassword;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
  },
});
