
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import Loading from '../components/helpercComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';
import axios from 'axios';
import UrlHelper from '../helper/UrlHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();
  // const {loading, message, error} = useSelector(state => state.user);

  const dispatch = useDispatch();
  
  // For Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [showProgressbar , setProgressBar] = useState(false);

  // for Submitting Response
  const submitHandler = async () => {
    console.log('Working on login ');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex =  /^(?:\+91|0)?[6-9]\d{9}$/; 

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
    }
    else{
      console.log(email,password)
      dispatch(login(email, password));
    }
    
  };

  const loading = useMessageAndErrorUser(
    navigation,
    dispatch,
    'Home',
  );

  // console.log("Loadingb :: "+loading)

 

  // useEffect(() => {



  //   if (error) {
  //     Toast.show({
  //       type: 'error',
  //       text1: error,
  //     });

  //     dispatch({
  //       type: 'clearError',
  //     });
  //   }

  //   // Project 

  //   if (message) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: 'AdminDashboard'}],
  //     });

  //     Toast.show({
  //       type: 'success',
  //       text1: message,
  //     });

  //     dispatch({
  //       type: 'clearMessage',
  //     });

  //   }
  // }, [error, message,loading, dispatch]);





  return (
    <View style={{flex: 1}}>

      <LoginBackground />

      {/** Login Cointainer */}

      <View
        style={{
          height: heightPercentageToDP(65),
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
          <GradientText style={styles.textStyle}>Log In</GradientText>

          <View
            style={{
              marginTop: heightPercentageToDP(3),
              paddingVertical: heightPercentageToDP(2),
              gap: heightPercentageToDP(2),
            }}>
            {/** Email container */}
            <View
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
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
                  color:COLORS.black
                }}
                placeholder="Email"
                label="Email"
                placeholderTextColor={COLORS.black}
                value={email}
                onChangeText={text => setEmail(text)}
              />
            </View>

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
                  color: COLORS.black
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

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{
                padding: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.black,
                  fontFamily: FONT.Montserrat_Regular,
                }}>
                Forgot Password
              </Text>
            </TouchableOpacity>

            {loading ? (
              <View style={{padding: heightPercentageToDP(2)}}>
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
              }}>
              <Text
                style={{
                  color: COLORS.gray2,
                  fontFamily: FONT.Montserrat_Regular,
                }}>
                Don't have account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    color: COLORS.blue,
                  }}>
                  {' '}
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;

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
// import { useNavigation } from '@react-navigation/native';
// import Loading from '../components/helpercComponent/Loading';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from '../redux/actions/userAction';
// import { useMessageAndErrorUser } from '../utils/hooks';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const navigation  = useNavigation();

//   const dispatch = useDispatch();
  
//   // For Password Visibility
//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };


//   // for Submitting Response
//   const submitHandler = () => {
//     console.log('Working on login ');
//     dispatch(login(email,password))
//   };


//   const loading =  useMessageAndErrorUser(navigation,dispatch,"Home")

  

 

//   return (
//     <View style={{flex: 1}}>
//       <LoginBackground />

//       {/** Login Cointainer */}

//       <View
//         style={{
//           height: heightPercentageToDP(65),
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
//           <GradientText style={styles.textStyle}>Log In</GradientText>

//           <View
//             style={{
//               marginTop: heightPercentageToDP(3),
//               paddingVertical: heightPercentageToDP(2),
//               gap: heightPercentageToDP(2),
//             }}>
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

//             <TouchableOpacity
//               onPress={() => navigation.navigate("Home")}
//               style={{
//                 padding: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//                 alignItems: 'center',
//               }}>
//               <Text
//                 style={{
//                   color: COLORS.black,
//                   fontFamily: FONT.Montserrat_Regular,
//                 }}>
//                 Forgot Password
//               </Text>
//             </TouchableOpacity>

//             {
//               loading ? (<View style={{padding:heightPercentageToDP(2)}}><Loading/></View>) : (<TouchableOpacity
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
//               </TouchableOpacity>)
//             }

            

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
//                 Don't have account?
//               </Text>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('Register')}
//                 style={{justifyContent: 'center', alignItems: 'center'}}>
//                 <Text style={{
//                   color: COLORS.blue
//                 }}> Sign Up</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//   },
// });
