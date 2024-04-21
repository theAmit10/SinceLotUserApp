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
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import Entypo from 'react-native-vector-icons/Entypo';
  import Toast from 'react-native-toast-message';
  import {useNavigation} from '@react-navigation/native';
  import Loading from '../components/helpercComponent/Loading';
  import {useDispatch, useSelector} from 'react-redux';
  import {loadProfile, login} from '../redux/actions/userAction';
  import {useMessageAndErrorUser} from '../utils/hooks';
  import Background from '../components/background/Background';
  import UrlHelper from '../helper/UrlHelper';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
  
  const ForgotPassword = () => {
    const [enterValue, setEnterValue] = useState('');
    const navigation = useNavigation();
    const [showProgressBar,setProgressBar] = useState(false); 

  const updateProfileHandler  = async () => {
    if (!enterValue) {
     Toast.show({
       type: 'error',
       text1: 'Please enter your email',
     });
     
   } else {
    Toast.show({
        type: 'info',
        text1: 'Processing',
      });
     setProgressBar(true);

     try {
  
       const {data} = await axios.post(
        UrlHelper.FORGOT_PASSWORD_API,
        {
          email: enterValue,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log("datat :: "+data)

      
      
      
       Toast.show({
         type: 'success',
         text1: 'OTP sent to mail',
         text2: data.message
       });
       setProgressBar(false);
       navigation.navigate("OtpVerification");
       
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
            <GradientText style={styles.textStyle}>Forgot Password</GradientText>
  
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
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                marginTop: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
                <LinearGradient
                colors={[COLORS.lightWhite, COLORS.white_s]}
                className="rounded-xl p-1">
                <MaterialCommunityIcons
                  name={'account'}
                  size={heightPercentageToDP(3)}
                  color={COLORS.darkGray}
                />
              </LinearGradient>
             
              <TextInput
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.Montserrat_Regular,
                  fontSize: heightPercentageToDP(2),
                  color: COLORS.black,
                }}
                placeholder="Enter email"
                placeholderTextColor={COLORS.black}
                label="Email"
                value={enterValue}
                onChangeText={text => setEnterValue(text)}
              />
            </View>
  
            
            </View>


            {showProgressBar ? (
                <View style={{padding: heightPercentageToDP(2), flex: 1, justifyContent: 'center'}}>
                  <Loading />
                </View>
              ) : (
                <View style={{flex: 1, justifyContent: 'flex-end',paddingBottom: heightPercentageToDP(5)}}>
                <TouchableOpacity
                  onPress={updateProfileHandler}
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
                </View>
              )}
          </View>
        </View>
      </View>
    );
  };
  
  export default ForgotPassword;
  
  const styles = StyleSheet.create({
    textStyle: {
      fontSize: heightPercentageToDP(4),
      fontFamily: FONT.Montserrat_Bold,
      color:COLORS.black
    },
  });
  