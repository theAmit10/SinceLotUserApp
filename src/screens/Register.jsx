import {
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
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
import Fontisto from 'react-native-vector-icons/Fontisto';
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
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Register = ({route}) => {
  const {signupwith} = route.params;
  console.log('signuptype :: ' + signupwith);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [userDeviceToken, setUserDeviceToken] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Select Country');
  const [parentId, setParentId] = useState('');
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibilityConfirmPassword = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const dispatch = useDispatch();
  const loading = useMessageAndErrorUser(navigation, dispatch, 'Login');

  const [showProgressBar, setProgressBar] = useState(false);

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
    // const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    const phoneRegex =
      /^(?:\+?\d{1,3})?[-.\s]?(\(?\d{1,4}?\)?)[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    if (signupwith === 'emailtype') {
      if (!name) {
        Toast.show({
          type: 'error',
          text1: 'Enter name',
        });
      } else if (!email) {
        Toast.show({
          type: 'error',
          text1: 'Enter email address',
        });
      } else if (!emailRegex.test(email)) {
        Toast.show({
          type: 'error',
          text1: 'Enter valid email address',
        });
      } else if (!selectedCountry === 'Select Country') {
        Toast.show({
          type: 'error',
          text1: 'Please select your country',
        });
      } else if (!password) {
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
      } else {
        console.log('Email :: ' + email);
        console.log('name :: ' + name);
        console.log('devicetoken :: ' + userDeviceToken);

        // dispatch(register(name, email, password,userDeviceToken));
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
            text1: error.response.data.message,
          });
          console.log(error);
          console.log(error.response);
          console.log(error.response.data.message);
          console.log(error.response);
        }
      }
    } else {
      if (!name) {
        Toast.show({
          type: 'error',
          text1: 'Enter name',
        });
      } else if (!email) {
        Toast.show({
          type: 'error',
          text1: 'Enter email address',
        });
      } else if (!phoneRegex.test(email)) {
        Toast.show({
          type: 'error',
          text1: 'Enter valid Phone number',
        });
      } else if (!selectedCountry === 'Select Country') {
        Toast.show({
          type: 'error',
          text1: 'Please select your country',
        });
      } else if (!password) {
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
      } else {
        // dispatch(register(name, email, password,userDeviceToken));
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

          console.log('datat :: ' + data);

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
            text1: 'Something went wrong',
          });
          console.log(error);
          console.log(error.response.data.message);
          console.log(error.response);
        }
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
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="height"
        keyboardVerticalOffset={-60}>
        <LoginBackground />

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
                    backgroundColor: COLORS.white_s,
                    borderRadius: heightPercentageToDP(2),
                  }}></View>
              </View>

              {/** Login Main Container */}
              <View
                style={{
                  flex: 1,
                  marginHorizontal: heightPercentageToDP(2),
                }}>
                <GradientTextWhite style={styles.textStyle}>
                  Register Now
                </GradientTextWhite>

                <View
                  style={{
                    marginTop: heightPercentageToDP(1),
                    paddingVertical: heightPercentageToDP(2),
                    gap: heightPercentageToDP(2),
                  }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/** Name container */}
                    <View
                      style={{
                        height: heightPercentageToDP(7),
                        flexDirection: 'row',
                        backgroundColor: COLORS.white_s,
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                        marginBottom: heightPercentageToDP(2),
                      }}>
                      <Entypo
                        name={'user'}
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
                        placeholder="Name"
                        placeholderTextColor={COLORS.black}
                        label="Name"
                        value={name}
                        onChangeText={text => setName(text)}
                      />
                    </View>

                    {/** Email container */}
                    {signupwith === 'emailtype' ? (
                      <View
                        style={{
                          height: heightPercentageToDP(7),
                          flexDirection: 'row',
                          backgroundColor: COLORS.white_s,
                          alignItems: 'center',
                          paddingHorizontal: heightPercentageToDP(2),
                          borderRadius: heightPercentageToDP(1),
                          marginBottom: heightPercentageToDP(2),
                        }}>
                        <Fontisto
                          name={'email'}
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
                          placeholder="Email"
                          placeholderTextColor={COLORS.black}
                          label="Email"
                          value={email}
                          onChangeText={text => setEmail(text)}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          height: heightPercentageToDP(7),
                          flexDirection: 'row',
                          backgroundColor: COLORS.white_s,
                          alignItems: 'center',
                          paddingHorizontal: heightPercentageToDP(2),
                          borderRadius: heightPercentageToDP(1),
                          marginBottom: heightPercentageToDP(2),
                        }}>
                        <FontAwesome
                          name={'phone'}
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
                          placeholder="Phone number"
                          placeholderTextColor={COLORS.black}
                          label="Phone number"
                          value={email}
                          onChangeText={text => setEmail(text)}
                        />
                      </View>
                    )}

                    {/** Password container */}
                    <View
                      style={{
                        height: heightPercentageToDP(7),
                        flexDirection: 'row',
                        backgroundColor: COLORS.white_s,
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                        marginBottom: heightPercentageToDP(2),
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
                        backgroundColor: COLORS.white_s,
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                        marginBottom: heightPercentageToDP(2),
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
                        name={confirmPasswordVisible ? 'eye' : 'eye-with-line'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </View>

                    {/** Country container */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('SelectCountry', {
                          fromScreen: 'Register',
                          signupwith: signupwith,
                        })
                      }
                      style={{
                        height: heightPercentageToDP(7),
                        flexDirection: 'row',
                        backgroundColor: COLORS.white_s,
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
                        backgroundColor: COLORS.white_s,
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

                    <View
                      style={{
                        padding: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(1),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: heightPercentageToDP(10),
                      }}>
                      <Text
                        style={{
                          color: COLORS.white_s,
                          fontFamily: FONT.Montserrat_Regular,
                        }}>
                        Already have account?
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: COLORS.blue,
                          }}>
                          {' '}
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.white_s,
  },
});
