import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
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

const GoogleAuthPassword = ({route}) => {
  const {data} = route.params;
  console.log('signuptype :: ' + data);

  console.log(data.user.email)

  const full_name = `${data.user.givenName} ${data.user.familyName}`
  console.log(full_name)

  const [name, setName] = useState(full_name);
  const [email, setEmail] = useState(data.user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigation = useNavigation();

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
    } else {
      dispatch(register(name, email, password));
      Toast.show({
        type: 'success',
        text1: 'Processing',
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <LoginBackground />

      {/** Login Cointainer */}

      <View
        style={{
          height: heightPercentageToDP(60),
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

            {loading ? (
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
