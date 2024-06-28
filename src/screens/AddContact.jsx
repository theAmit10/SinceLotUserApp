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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const AddContact = ({route}) => {
  const {forData} = route.params;
  console.log(forData);

  const [enterValue, setEnterValue] = useState('');
  const {accesstoken} = useSelector(state => state.user);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [showProgressBar, setProgressBar] = useState(false);

  const updateProfileHandler = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

    if (forData === 'Email') {
      if (!enterValue) {
        Toast.show({
          type: 'error',
          text1: 'Please enter your email',
        });
      } else if (!emailRegex.test(enterValue)) {
        Toast.show({
          type: 'error',
          text1: 'Enter valid email address',
        });
      } else {
        setProgressBar(true);

        try {
          const {data} = await axios.put(
            UrlHelper.UPDATE_USER_PROFILE_API,
            {
              contact: enterValue,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accesstoken}`,
              },
            },
          );

          console.log('datat :: ' + data);

          dispatch(loadProfile(accesstoken));

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
    } else {
      if (!enterValue) {
        Toast.show({
          type: 'error',
          text1: 'Please enter your Phone Number',
        });
      } else if (!phoneRegex.test(enterValue)) {
        Toast.show({
          type: 'error',
          text1: 'Enter valid Phone Number',
        });
      } else {
        setProgressBar(true);

        try {
          const {data} = await axios.put(
            UrlHelper.UPDATE_USER_PROFILE_API,
            {
              contact: enterValue,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accesstoken}`,
              },
            },
          );

          console.log('datat :: ' + data);

          dispatch(loadProfile(accesstoken));

          Toast.show({
            type: 'success',
            text1: data.message,
          });
          setProgressBar(false);
          navigation.goBack();
        } catch (error) {
          setProgressBar(false);
          if (error.response.data.message === 'Contact Already exist') {
            Toast.show({
              type: 'error',
              text1: error.response.data.message,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Something went wrong',
            });
          }

          console.log(error);
          console.log(error.response.data.message);
        }
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Background />

      {/** Login Cointainer */}

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
          <GradientTextWhite style={styles.textStyle}>Update {forData}</GradientTextWhite>

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
                marginTop: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
              <LinearGradient
                colors={[COLORS.grayBg, COLORS.white_s]}
                className="rounded-xl p-1">
                {forData === 'Email' ? (
                  <MaterialCommunityIcons
                    name={'account'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.darkGray}
                  />
                ) : (
                  <FontAwesome
                    name={'phone'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.darkGray}
                  />
                )}
              </LinearGradient>

              <TextInput
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.Montserrat_Regular,
                  fontSize: heightPercentageToDP(2),
                  color: COLORS.black,
                }}
                placeholder={forData}
                placeholderTextColor={COLORS.black}
                label="Email"
                value={enterValue}
                onChangeText={text => setEnterValue(text)}
              />
            </View>
          </View>

          {showProgressBar ? (
            <View
              style={{
                padding: heightPercentageToDP(2),
                flex: 1,
                justifyContent: 'center',
              }}>
              <Loading />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingBottom: heightPercentageToDP(5),
              }}>
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

          </ImageBackground>
          </View>

     
    </View>
  );
};

export default AddContact;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
});
