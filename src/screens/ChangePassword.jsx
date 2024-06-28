import {
  ImageBackground,
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
import {loadProfile, login} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';
import Background from '../components/background/Background';
import UrlHelper from '../helper/UrlHelper';
import axios from 'axios';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const {accesstoken} = useSelector(state => state.user);

  const navigation = useNavigation();

  


  const dispatch = useDispatch();

  // For Password Visibility


  const togglePasswordVisibilityForOLDPASSWORD = () => {
    setOldPasswordVisible(!oldPasswordVisible);
  };

  const togglePasswordVisibilityforNEWPASSWORD = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const togglePasswordVisibilityCONFIRMPASSWORD = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const [showProgressbar , setProgressBar] = useState(false);



  const changePasswordHandler = async () => {
    if (!oldPassword) {
     Toast.show({
       type: 'error',
       text1: 'Please enter your old password',
     });
     
   } else if (!newPassword) {
    Toast.show({
      type: 'error',
      text1: 'Please enter your new password',
    });
   
  } else if (!confirmPassword) {
    Toast.show({
      type: 'error',
      text1: 'Please enter your confirm password',
    });
   
  } else if (newPassword != confirmPassword) {
    Toast.show({
      type: 'error',
      text1: 'New password and confirm password not matched',
    });
   
  } 
    else {
     setProgressBar(true);

     try {
  
       const {data} = await axios.put(
        UrlHelper.CHANGE_PASSWORD_API,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accesstoken}`,
          },
        },
      );

      console.log("datat :: "+data)

      dispatch(loadProfile(accesstoken))
      
       Toast.show({
         type: 'success',
         text1: data.message,
       });
       setProgressBar(false);
       navigation.goBack();
     } catch (error) {
      setProgressBar(false);
       Toast.show({
         type: 'error',
         text1: 'Something went wrong',
       });
       console.log(error);

     }
   }
 };

 

  return (
    <View style={{flex: 1}}>
      <Background/>

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(65),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
              <View
        style={{
          height: heightPercentageToDP(65),
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
          <GradientTextWhite style={styles.textStyle}>Change Password</GradientTextWhite>

          <View
            style={{
              marginTop: heightPercentageToDP(3),
              paddingVertical: heightPercentageToDP(2),
              gap: heightPercentageToDP(2),
            }}>
            {/** old password container */}
            <View
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.white_s,
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
                  fontSize: heightPercentageToDP(2),
                  color: COLORS.black
                }}
                placeholder="Old Password"
                placeholderTextColor={COLORS.black}
                value={oldPassword}
                onChangeText={text => setOldPassword(text)}
                secureTextEntry={!oldPasswordVisible}
              />
              <Entypo
                onPress={togglePasswordVisibilityForOLDPASSWORD}
                name={oldPasswordVisible ? 'eye' : 'eye-with-line'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
            </View>

            {/** new  Password container */}

            <View
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.white_s,
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
                  fontSize: heightPercentageToDP(2),
                  color: COLORS.black
                }}
                placeholder="New Password"
                placeholderTextColor={COLORS.black}
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
                secureTextEntry={!newPasswordVisible}
              />
              <Entypo
                onPress={togglePasswordVisibilityforNEWPASSWORD}
                name={newPasswordVisible ? 'eye' : 'eye-with-line'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
            </View>

            {/** Confirm  Password container */}
            <View
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.white_s,
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
                  fontSize: heightPercentageToDP(2),
                  color: COLORS.black
                }}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.black}
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry={!confirmPasswordVisible}
              />
              <Entypo
                onPress={togglePasswordVisibilityCONFIRMPASSWORD}
                name={confirmPasswordVisible ? 'eye' : 'eye-with-line'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
            </View>

            {showProgressbar ? (
              <View style={{padding: heightPercentageToDP(2)}}>
                <Loading />
              </View>
            ) : (
              <TouchableOpacity
                onPress={changePasswordHandler}
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
          </View>
        </View>
      </View>
            </ImageBackground>
          </View>
    
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.darkGray
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
// import {useNavigation} from '@react-navigation/native';
// import Loading from '../components/helpercComponent/Loading';
// import {useDispatch, useSelector} from 'react-redux';
// import {login} from '../redux/actions/userAction';
// import {useMessageAndErrorUser} from '../utils/hooks';
// import Background from '../components/background/Background';

// const ChangePassword = () => {
//   const [password, setPassword] = useState('');
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
//   const [newPasswordVisible, setNewPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const navigation = useNavigation();

//   const loading = false;


//   const dispatch = useDispatch();

//   // For Password Visibility
//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const togglePasswordVisibilityForOLDPASSWORD = () => {
//     setOldPasswordVisible(!oldPasswordVisible);
//   };

//   const togglePasswordVisibilityforNEWPASSWORD = () => {
//     setNewPasswordVisible(!newPasswordVisible);
//   };

//   const togglePasswordVisibilityCONFIRMPASSWORD = () => {
//     setConfirmPasswordVisible(!confirmPasswordVisible);
//   };

//   // for Submitting Response
//   const submitHandler = () => {
//     console.log('Working on login ');
  
//   };

 

//   return (
//     <View style={{flex: 1}}>
//       <Background/>

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
//           <GradientText style={styles.textStyle}>Change Password</GradientText>

//           <View
//             style={{
//               marginTop: heightPercentageToDP(3),
//               paddingVertical: heightPercentageToDP(2),
//               gap: heightPercentageToDP(2),
//             }}>
//             {/** old password container */}
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
//                 placeholder="Old Password"
//                 value={oldPassword}
//                 onChangeText={text => setOldPassword(text)}
//                 secureTextEntry={!oldPasswordVisible}
//               />
//               <Entypo
//                 onPress={togglePasswordVisibility}
//                 name={oldPasswordVisible ? 'eye' : 'eye-with-line'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//             </View>

//             {/** new  Password container */}

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
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChangeText={text => setNewPassword(text)}
//                 secureTextEntry={!newPasswordVisible}
//               />
//               <Entypo
//                 onPress={togglePasswordVisibility}
//                 name={newPasswordVisible ? 'eye' : 'eye-with-line'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//             </View>

//             {/** Confirm  Password container */}
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
//                 onPress={togglePasswordVisibility}
//                 name={confirmPasswordVisible ? 'eye' : 'eye-with-line'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.white}
//               />
//             </View>

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
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default ChangePassword;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//   },
// });
