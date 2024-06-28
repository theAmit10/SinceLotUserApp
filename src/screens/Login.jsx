import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LoginBackground from '../components/login/LoginBackground';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Loading from '../components/helpercComponent/Loading';
import {useDispatch} from 'react-redux';
import {login} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  // For Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // for Submitting Response
  const submitHandler = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Enter email address',
      });
    } else if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Enter valid email address or phone number',
      });
    } else if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Enter password',
      });
    } else {
      dispatch(login(email, password));
    }
  };

  const loading = useMessageAndErrorUser(navigation, dispatch, 'Home');

  return (
    <SafeAreaView style={{flex: 1}}>
      <LoginBackground />
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={styles.imageBackground}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View style={styles.content}>
            <View style={styles.topIndicator}>
              <View style={styles.indicatorBar} />
            </View>
            <GradientTextWhite style={styles.textStyle}>
              Log In
            </GradientTextWhite>

            <View style={styles.inputContainer}>
              <View style={styles.input}>
                <Fontisto
                  name={'email'}
                  size={heightPercentageToDP(3)}
                  color={COLORS.darkGray}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email or Phone Number"
                  label="Email"
                  placeholderTextColor={COLORS.black}
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
              </View>

              <View style={styles.input}>
                <Entypo
                  name={'lock'}
                  size={heightPercentageToDP(3)}
                  color={COLORS.darkGray}
                />
                <TextInput
                  style={styles.textInput}
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

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>

              {loading ? (
                <View style={styles.loading}>
                  <Loading />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={submitHandler}
                  style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              )}

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignUp')}
                  style={styles.signupButton}>
                  <Text style={styles.signupButtonText}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topIndicator: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorBar: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(0.8),
    backgroundColor: COLORS.grayBg,
    borderRadius: heightPercentageToDP(2),
  },
  imageBackground: {
    width: '100%',
    height: heightPercentageToDP(65),
    
  },
  content: {
    flex: 1,
    borderTopLeftRadius: heightPercentageToDP(5),
    borderTopRightRadius: heightPercentageToDP(5),
    padding: heightPercentageToDP(2),

  },
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.white_s,
  },
  inputContainer: {
    marginTop: heightPercentageToDP(3),
    paddingVertical: heightPercentageToDP(2),
    gap: heightPercentageToDP(2),
  },
  input: {
    height: heightPercentageToDP(7),
    flexDirection: 'row',
    backgroundColor: COLORS.white_s,
    alignItems: 'center',
    paddingHorizontal: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
  },
  textInput: {
    marginStart: heightPercentageToDP(1),
    flex: 1,
    fontFamily: FONT.SF_PRO_REGULAR,
    color: COLORS.black,
  },
  forgotPassword: {
    padding: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  loading: {
    padding: heightPercentageToDP(2),
  },
  submitButton: {
    backgroundColor: COLORS.blue,
    padding: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: FONT.Montserrat_Regular,
  },
  signupContainer: {
    padding: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  signupButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: COLORS.blue,
  },
});

// import {
//   ImageBackground,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import LoginBackground from '../components/login/LoginBackground';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../assets/constants';
// import GradientText from '../components/helpercComponent/GradientText';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import Entypo from 'react-native-vector-icons/Entypo';
// import Toast from 'react-native-toast-message';
// import {useNavigation} from '@react-navigation/native';
// import Loading from '../components/helpercComponent/Loading';
// import {useDispatch, useSelector} from 'react-redux';
// import {login} from '../redux/actions/userAction';
// import {useMessageAndErrorUser} from '../utils/hooks';
// import axios from 'axios';
// import UrlHelper from '../helper/UrlHelper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const navigation = useNavigation();
//   // const {loading, message, error} = useSelector(state => state.user);

//   const dispatch = useDispatch();

//   // For Password Visibility
//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const [showProgressbar, setProgressBar] = useState(false);

//   // for Submitting Response
//   const submitHandler = async () => {
//     console.log('Working on login ');

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

//     if (!email) {
//       Toast.show({
//         type: 'error',
//         text1: 'Enter email address',
//       });
//     } else if (!emailRegex.test(email) && !phoneRegex.test(email)) {
//       Toast.show({
//         type: 'error',
//         text1: 'Enter valid email address or phone number',
//       });
//     } else if (!password) {
//       Toast.show({
//         type: 'error',
//         text1: 'Enter password',
//       });
//     } else {
//       console.log(email, password);
//       dispatch(login(email, password));
//     }
//   };

//   const loading = useMessageAndErrorUser(navigation, dispatch, 'Home');

//   // console.log("Loadingb :: "+loading)

//   // useEffect(() => {

//   //   if (error) {
//   //     Toast.show({
//   //       type: 'error',
//   //       text1: error,
//   //     });

//   //     dispatch({
//   //       type: 'clearError',
//   //     });
//   //   }

//   //   // Project

//   //   if (message) {
//   //     navigation.reset({
//   //       index: 0,
//   //       routes: [{name: 'AdminDashboard'}],
//   //     });

//   //     Toast.show({
//   //       type: 'success',
//   //       text1: message,
//   //     });

//   //     dispatch({
//   //       type: 'clearMessage',
//   //     });

//   //   }
//   // }, [error, message,loading, dispatch]);

//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: 'pink'}}>
//       <LoginBackground />

//       {/** Login Cointainer */}

//       <View
//         style={{
//           height: heightPercentageToDP(65),
//           width: widthPercentageToDP(100),
//           backgroundColor: 'transparent',

//         }}
//         imageStyle={{
//           borderTopLeftRadius: heightPercentageToDP(5),
//           borderTopRightRadius: heightPercentageToDP(5)
//         }}
//         >
// <ImageBackground
//   source={require('../../assets/image/tlwbg.jpg')}
//   style={{
//     width: '100%',
//     height: '100%',
//   }}
//   imageStyle={{
//     borderTopLeftRadius: heightPercentageToDP(5),
//     borderTopRightRadius: heightPercentageToDP(5)
//   }}
//   >
//           {/** Top Style View */}
//           <View
//             style={{
//               height: heightPercentageToDP(5),
//               width: widthPercentageToDP(100),
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <View
//               style={{
//                 width: widthPercentageToDP(20),
//                 height: heightPercentageToDP(0.8),
//                 backgroundColor: COLORS.grayBg,
//                 borderRadius: heightPercentageToDP(2),
//               }}></View>
//           </View>

//           {/** Login Main Container */}
//           <View
//             style={{
//               flex: 1,
//               margin: heightPercentageToDP(2),
//             }}>
//             <GradientTextWhite style={styles.textStyle}>Log In</GradientTextWhite>

//             <View
//               style={{
//                 marginTop: heightPercentageToDP(3),
//                 paddingVertical: heightPercentageToDP(2),
//                 gap: heightPercentageToDP(2),
//               }}>
//               {/** Email container */}
//               <View
//                 style={{
//                   height: heightPercentageToDP(7),
//                   flexDirection: 'row',
//                   backgroundColor: COLORS.white_s,
//                   alignItems: 'center',
//                   paddingHorizontal: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(1),
//                 }}>
//                 <Fontisto
//                   name={'email'}
//                   size={heightPercentageToDP(3)}
//                   color={COLORS.darkGray}
//                 />
//                 <TextInput
//                   style={{
//                     marginStart: heightPercentageToDP(1),
//                     flex: 1,
//                     fontFamily: FONT.SF_PRO_REGULAR,
//                     color: COLORS.black,
//                   }}
//                   placeholder="Email or Phone Number"
//                   label="Email"
//                   placeholderTextColor={COLORS.black}
//                   value={email}
//                   onChangeText={text => setEmail(text)}
//                 />
//               </View>

//               {/** Password container */}
//               <View
//                 style={{
//                   height: heightPercentageToDP(7),
//                   flexDirection: 'row',
//                   backgroundColor: COLORS.white_s,
//                   alignItems: 'center',
//                   paddingHorizontal: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(1),
//                 }}>
//                 <Entypo
//                   name={'lock'}
//                   size={heightPercentageToDP(3)}
//                   color={COLORS.darkGray}
//                 />
//                 <TextInput
//                   style={{
//                     marginStart: heightPercentageToDP(1),
//                     flex: 1,
//                     fontFamily: FONT.SF_PRO_REGULAR,
//                     color: COLORS.black,
//                   }}
//                   placeholder="Password"
//                   placeholderTextColor={COLORS.black}
//                   value={password}
//                   onChangeText={text => setPassword(text)}
//                   secureTextEntry={!passwordVisible}
//                 />
//                 <Entypo
//                   onPress={togglePasswordVisibility}
//                   name={passwordVisible ? 'eye' : 'eye-with-line'}
//                   size={heightPercentageToDP(3)}
//                   color={COLORS.darkGray}
//                 />
//               </View>

//               <TouchableOpacity
//                 onPress={() => navigation.navigate('ForgotPassword')}
//                 style={{
//                   padding: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(1),
//                   alignItems: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     color: COLORS.black,
//                     fontFamily: FONT.Montserrat_Regular,
//                   }}>
//                   Forgot Password
//                 </Text>
//               </TouchableOpacity>

//               {loading ? (
//                 <View style={{padding: heightPercentageToDP(2)}}>
//                   <Loading />
//                 </View>
//               ) : (
//                 <TouchableOpacity
//                   onPress={submitHandler}
//                   style={{
//                     backgroundColor: COLORS.blue,
//                     padding: heightPercentageToDP(2),
//                     borderRadius: heightPercentageToDP(1),
//                     alignItems: 'center',
//                   }}>
//                   <Text
//                     style={{
//                       color: COLORS.white,
//                       fontFamily: FONT.Montserrat_Regular,
//                     }}>
//                     Submit
//                   </Text>
//                 </TouchableOpacity>
//               )}

//               <View
//                 style={{
//                   padding: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(1),
//                   flexDirection: 'row',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     color: COLORS.black,
//                     fontFamily: FONT.Montserrat_Regular,
//                   }}>
//                   Don't have account?
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('SignUp')}
//                   style={{justifyContent: 'center', alignItems: 'center'}}>
//                   <Text
//                     style={{
//                       color: COLORS.blue,
//                     }}>
//                     {' '}
//                     Sign Up
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </ImageBackground>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.white_s
//   },
// });
