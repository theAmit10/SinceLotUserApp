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

        navigation.navigate('GoogleAuthPassword', { data: result });
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

    if (signupwith === "emailtype")
    {

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
    }else{
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
          <GradientText style={styles.textStyle}>Sign Up</GradientText>

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
                backgroundColor: COLORS.grayHalfBg,
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
                backgroundColor: COLORS.grayHalfBg,
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

            <TouchableOpacity
                onPress={GoogleSingUp}
              style={{
                padding: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
                alignItems: 'center',
                backgroundColor: COLORS.grayHalfBg,
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
                  color: COLORS.gray2,
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
                  }}>
                  {' '}
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
  },
});

// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useMemo, useState} from 'react';
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
// import {useDispatch} from 'react-redux';
// import {register} from '../redux/actions/userAction';
// import {useMessageAndErrorUser} from '../utils/hooks';
// import Loading from '../components/helpercComponent/Loading';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   const navigation = useNavigation();

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const togglePasswordVisibilityConfirmPassword = () => {
//     setConfirmPasswordVisible(!confirmPasswordVisible);
//   };

//   const dispatch = useDispatch();
//   const loading = useMessageAndErrorUser(navigation, dispatch, 'Login');

//   const submitHandler = () => {
//     if (!name) {
//       Toast.show({
//         type: 'error',
//         text1: 'Enter name',
//       });
//     } else if (!email) {
//       Toast.show({
//         type: 'error',
//         text1: 'Enter email address',
//       });
//     } else if (!password) {
//       Toast.show({
//         type: 'error',
//         text1: 'Enter password',
//       });
//     } else if (!confirmPassword) {
//       Toast.show({
//         type: 'error',
//         text1: 'Enter confirm password',
//       });
//     } else if (password != confirmPassword) {
//       Toast.show({
//         type: 'error',
//         text1: 'Password and Confirm Password Not Matched',
//       });
//     } else {
//       // const myform = new FormData();

//       // myform.append('name', name);
//       // myform.append('email', email);
//       // myform.append('password', password);

//       // console.log(name, email, password, confirmPassword);

//       dispatch(register(name,email,password));

//       Toast.show({
//         type: 'success',
//         text1: 'Processing',
//       });
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <LoginBackground />

//       {/** Login Cointainer */}

//       <View
//         style={{
//           height: heightPercentageToDP(80),
//           width: widthPercentageToDP(100),
//           backgroundColor: COLORS.white_s,
//           borderTopLeftRadius: heightPercentageToDP(5),
//           borderTopRightRadius: heightPercentageToDP(5),
//         }}>
//         {/** Top Style View */}
//         <View
//           style={{
//             height: heightPercentageToDP(5),
//             width: widthPercentageToDP(100),
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               width: widthPercentageToDP(20),
//               height: heightPercentageToDP(0.8),
//               backgroundColor: COLORS.grayBg,
//               borderRadius: heightPercentageToDP(2),
//             }}></View>
//         </View>

//         {/** Login Main Container */}
//         <View
//           style={{
//             flex: 1,
//             margin: heightPercentageToDP(2),
//           }}>
//           <GradientText style={styles.textStyle}>Register Now</GradientText>

//           <View
//             style={{
//               marginTop: heightPercentageToDP(3),
//               paddingVertical: heightPercentageToDP(2),
//               gap: heightPercentageToDP(2),
//             }}>
//             {/** Name container */}
//             <View
//               style={{
//                 height: heightPercentageToDP(7),
//                 flexDirection: 'row',
//                 backgroundColor: COLORS.grayBg,
//                 alignItems: 'center',
//                 paddingHorizontal: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//               }}>
//               <Entypo
//                 name={'user'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//               <TextInput
//                 style={{
//                   marginStart: heightPercentageToDP(1),
//                   flex: 1,
//                   fontFamily: FONT.SF_PRO_REGULAR,
//                 }}
//                 placeholder="Name"
//                 label="Name"
//                 value={name}
//                 onChangeText={text => setName(text)}
//               />
//             </View>

//             {/** Email container */}
//             <View
//               style={{
//                 height: heightPercentageToDP(7),
//                 flexDirection: 'row',
//                 backgroundColor: COLORS.grayBg,
//                 alignItems: 'center',
//                 paddingHorizontal: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//               }}>
//               <Fontisto
//                 name={'email'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//               <TextInput
//                 style={{
//                   marginStart: heightPercentageToDP(1),
//                   flex: 1,
//                   fontFamily: FONT.SF_PRO_REGULAR,
//                 }}
//                 placeholder="Email"
//                 label="Email"
//                 value={email}
//                 onChangeText={text => setEmail(text)}
//               />
//             </View>

//             {/** Password container */}
//             <View
//               style={{
//                 height: heightPercentageToDP(7),
//                 flexDirection: 'row',
//                 backgroundColor: COLORS.grayBg,
//                 alignItems: 'center',
//                 paddingHorizontal: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//               }}>
//               <Entypo
//                 name={'lock'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//               <TextInput
//                 style={{
//                   marginStart: heightPercentageToDP(1),
//                   flex: 1,
//                   fontFamily: FONT.SF_PRO_REGULAR,
//                 }}
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={text => setPassword(text)}
//                 secureTextEntry={!passwordVisible}
//               />
//               <Entypo
//                 onPress={togglePasswordVisibility}
//                 name={passwordVisible ? 'eye' : 'eye-with-line'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//             </View>

//             {/** Confirm Password container */}
//             <View
//               style={{
//                 height: heightPercentageToDP(7),
//                 flexDirection: 'row',
//                 backgroundColor: COLORS.grayBg,
//                 alignItems: 'center',
//                 paddingHorizontal: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//               }}>
//               <Entypo
//                 name={'lock'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//               <TextInput
//                 style={{
//                   marginStart: heightPercentageToDP(1),
//                   flex: 1,
//                   fontFamily: FONT.SF_PRO_REGULAR,
//                 }}
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChangeText={text => setConfirmPassword(text)}
//                 secureTextEntry={!confirmPasswordVisible}
//               />
//               <Entypo
//                 onPress={togglePasswordVisibilityConfirmPassword}
//                 name={passwordVisible ? 'eye' : 'eye-with-line'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//             </View>

//             <TouchableOpacity
//               onPress={submitHandler}
//               style={{
//                 padding: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//                 alignItems: 'center',
//                 backgroundColor: COLORS.grayHalfBg,
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 gap: heightPercentageToDP(2),
//               }}>
//               <Text
//                 style={{
//                   color: COLORS.black,
//                   fontFamily: FONT.Montserrat_Regular,
//                 }}>
//                 Sign up with Google
//               </Text>
//               <Fontisto
//                 name={'google'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//             </TouchableOpacity>

//             {loading ? (
//               <View style={{padding: heightPercentageToDP(2)}}>
//                 <Loading />
//               </View>
//             ) : (
//               <TouchableOpacity
//                 onPress={submitHandler}
//                 style={{
//                   backgroundColor: COLORS.blue,
//                   padding: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(1),
//                   alignItems: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     color: COLORS.white,
//                     fontFamily: FONT.Montserrat_Regular,
//                   }}>
//                   Submit
//                 </Text>
//               </TouchableOpacity>
//             )}

//             <View
//               style={{
//                 padding: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Text
//                 style={{
//                   color: COLORS.gray2,
//                   fontFamily: FONT.Montserrat_Regular,
//                 }}>
//                 Already have account?
//               </Text>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('Login')}
//                 style={{justifyContent: 'center', alignItems: 'center'}}>
//                 <Text
//                   style={{
//                     color: COLORS.blue,
//                   }}>
//                   {' '}
//                   Sign In
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Register;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//   },
// });
