import {
  ImageBackground,
  Platform,
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
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {register} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';
import Loading from '../components/helpercComponent/Loading';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [firstNameVal, setFirstName] = useState('');
  const [secondNameVal, setSecondName] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '626784428402-26qav5d8c6gm9l6e8jri81ofdtvtqlie.apps.googleusercontent.com',

      // androidClientId: '191145196270-ru4ac3nj22665k2ldtvqjvd0c4361qiu.apps.googleusercontent.com',
      // offlineAccess: true
    });
  }, []);

  const GoogleSingUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn().then(result => {
        console.log(result);

        setEmail(result.user.email);
        setFirstName(result.user.givenName);
        setSecondName(result.user.familyName);
        setProfileImage(result.user.photo);

        navigation.navigate('GoogleAuthPassword', {data: result});
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('User cancelled the login flow !');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google play services not available or outdated !');
        // play services not available or outdated
      } else {
        console.log(error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibilityConfirmPassword = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const dispatch = useDispatch();
  const loading = useMessageAndErrorUser(navigation, dispatch, 'Login');

  const submitHandler = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{1,14}$/; // E.164 format

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
        dispatch(register(name, email, password));
        Toast.show({
          type: 'success',
          text1: 'Processing',
        });
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
        dispatch(register(name, email, password));
        Toast.show({
          type: 'success',
          text1: 'Processing',
        });
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <LoginBackground />

      {/** Login Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(75),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(75),
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
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Sign Up
              </GradientTextWhite>

              <View
                style={{
                  marginTop: heightPercentageToDP(3),
                  paddingVertical: heightPercentageToDP(2),
                  gap: heightPercentageToDP(2),
                }}>
                {/** Name container */}

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Register', {
                      signupwith: 'emailtype',
                    })
                  }
                  style={{
                    padding: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(1),
                    alignItems: 'center',
                    backgroundColor: COLORS.white_s,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: heightPercentageToDP(2),
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontFamily: FONT.Montserrat_Regular,
                    }}>
                    Sign up with Email
                  </Text>
                  <Fontisto
                    name={'email'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.darkGray}
                  />
                </TouchableOpacity>

                {/** Email container */}

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Register', {
                      signupwith: 'phonetype',
                    })
                  }
                  style={{
                    padding: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(1),
                    alignItems: 'center',
                    backgroundColor: COLORS.white_s,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: heightPercentageToDP(2),
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontFamily: FONT.Montserrat_Regular,
                    }}>
                    Sign up with Phone
                  </Text>
                  <FontAwesome
                    name={'phone'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.darkGray}
                  />
                </TouchableOpacity>

                {/** Password container */}

                {/** Confirm Password container */}
                {Platform.OS === 'android' ? (
                  <TouchableOpacity
                    onPress={GoogleSingUp}
                    style={{
                      padding: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      alignItems: 'center',
                      backgroundColor: COLORS.white_s,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: heightPercentageToDP(2),
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontFamily: FONT.Montserrat_Regular,
                      }}>
                      Sign up with Google
                    </Text>
                    <Fontisto
                      name={'google'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>
                ) : null}

                <View
                  style={{
                    padding: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(1),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontFamily: FONT.Montserrat_Regular,
                    }}>
                    Already have account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: COLORS.blue,
                        fontFamily: FONT.Montserrat_Bold,
                        fontSize: heightPercentageToDP(2),
                      }}>
                      {' '}
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    padding: heightPercentageToDP(0.5),
                    borderRadius: heightPercentageToDP(1),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    marginBottom: heightPercentageToDP(2),
                  }}>
                  <Text
                    style={{
                      color: COLORS.white_s,
                      fontFamily: FONT.Montserrat_Regular,
                    }}>
                    Note : Password reset option is available for accounts with
                    email signup only .
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.white_s,
  },
});
