import {
  SafeAreaView,
  ScrollView,
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
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import ProfileBackground from '../components/background/ProfileBackground';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wallet from '../components/home/Wallet';
import {Consumer} from 'react-native-paper/lib/typescript/core/settings';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';
import Loading from '../components/helpercComponent/Loading';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user, accesstoken, loading} = useSelector(state => state.user);

  useMessageAndErrorUser(navigation, dispatch, 'Login');

  // Function to clear AsyncStorage data when the user logs out
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage data cleared successfully.');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error,
      });
    }
  };

  const logoutHandler = () => {
    console.log('Logging Off...');

    Toast.show({
      type: 'success',
      text1: 'Logging Out ',
      text2: 'Please wait...',
    });

    setTimeout(() => {
      clearAsyncStorage();
    }, 1000);
  };

  const updateProfileHandler = () => {
    console.log('Updating profile');
    navigation.navigate('UpdateProfile');

    Toast.show({
      type: 'success',
      text1: 'Updating Profile',
    });
  };

  const ChangePasswordHandler = () => {
    Toast.show({
      type: 'success',
      text1: 'change password precessing',
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ProfileBackground />

      {/** Profile Cointainer */}

      <View
        style={{
          height: heightPercentageToDP(19),
          backgroundColor: COLORS.white_s,
          marginBottom: heightPercentageToDP(1),
        }}>
        {loading ? (
          <Loading />
        ) : (
          user && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: heightPercentageToDP(1),
                  }}>
                  {user.walletOne.visibility && (
                    <Wallet wallet={user.walletOne} />
                  )}
                  {user.walletTwo.visibility && (
                    <Wallet wallet={user.walletTwo} />
                  )}
                </View>
              </ScrollView>
            </View>
          )
        )}
      </View>

      <View
        style={{
          height: heightPercentageToDP(30),
          width: widthPercentageToDP(100),
          backgroundColor: COLORS.white_s,
          borderTopLeftRadius: heightPercentageToDP(5),
          borderTopRightRadius: heightPercentageToDP(5),
          elevation: heightPercentageToDP(3),
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

        {/** Profile Main Container */}
        <View
          style={{
            flex: 2,
            margin: heightPercentageToDP(2),
          }}>
          <View
            style={{
              paddingVertical: heightPercentageToDP(2),
              gap: heightPercentageToDP(2),
            }}>
            {/** Update Profile container */}
            <TouchableOpacity
              onPress={updateProfileHandler}
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
              <MaterialCommunityIcons
                name={'account'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                  color: COLORS.darkGray
                }}>
                Update Profile
              </Text>

              <Ionicons
                name={'chevron-forward-outline'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
            </TouchableOpacity>

            {/** Change Password container */}
            {/* <TouchableOpacity
              onPress={ChangePasswordHandler}
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
                color={COLORS.white}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                  color: COLORS.darkGray
                }}>
                Change Password
              </Text>

              <Ionicons
                name={'chevron-forward-outline'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
            </TouchableOpacity> */}

            {/** Logout container */}
            <TouchableOpacity
              onPress={logoutHandler}
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
              <AntDesign
                name={'logout'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                  color: COLORS.darkGray
                }}>
                Logout
              </Text>

              <Ionicons
                name={'chevron-forward-outline'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
  },
  textStyleEmail: {
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
  },
});

// {
//   loading ? (<Loading />) : (user && <>
//     <View
//       style={{
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'cyan'

//       }}>
//       <GradientText style={styles.textStyle}>Wasu</GradientText>
//       <GradientText style={styles.textStyleEmail}>
//         {user.email}
//       </GradientText>
//     </View>

//     <ScrollView
//       horizontal={true}
//       showsHorizontalScrollIndicator={false}>
//       <View style={{ margin: heightPercentageToDP(1), flexDirection:'row' }}>
//         <Wallet wallet={user.walletOne} />
//         <Wallet wallet={user.walletTwo} />
//       </View>

//     </ScrollView>

//   </>)
// }
