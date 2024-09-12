import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ProfileBackground from '../components/background/ProfileBackground';

import {useDispatch, useSelector} from 'react-redux';
import {loadProfile} from '../redux/actions/userAction';
import {useMessageAndErrorUser} from '../utils/hooks';
import LinearGradient from 'react-native-linear-gradient';

import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import {serverName} from '../redux/store';

const UserProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user, accesstoken, loading} = useSelector(state => state.user);

  useMessageAndErrorUser(navigation, dispatch, 'Login');

  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [isFocused]);

 


  return (
    <View style={{flex: 1}}>
      <ProfileBackground />

      {/** Profile Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(52),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(52),
              width: widthPercentageToDP(100),

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

            <GradientTextWhite
              style={{
                fontSize: heightPercentageToDP(3.5),
                fontFamily: FONT.Montserrat_Bold,
                color: COLORS.darkGray,
                marginStart: heightPercentageToDP(2),
              }}>
              About
            </GradientTextWhite>

            <GradientTextWhite
              style={{
                fontSize: heightPercentageToDP(3.5),
                fontFamily: FONT.Montserrat_Bold,
                color: COLORS.darkGray,
                marginStart: heightPercentageToDP(2),
              }}>
              You
            </GradientTextWhite>

            <ScrollView>
              {/** Profile Main Container */}
              <View
                style={{
                  flex: 2,
                  margin: heightPercentageToDP(2),
                }}>
                <View
                  style={{
                    paddingVertical: heightPercentageToDP(2),
                  }}>
                  {/** Country container */}

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                      marginTop: heightPercentageToDP(2),
                    }}>
                    Country
                  </Text>

                  <View
                    style={{
                      height: heightPercentageToDP(7),
                      flexDirection: 'row',
                      backgroundColor: COLORS.white_s,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),

                      borderRadius: heightPercentageToDP(1),
                    }}>
                    <View
                      style={{
                        borderRadius: 100,
                        overflow: 'hidden',
                        width: 40,
                        height: 40,
                      }}>
                      {user.country?.countryicon ? (
                        <Image
                          source={{
                            uri: `${serverName}/uploads/currency/${user.country.countryicon}`,
                          }}
                          resizeMode="cover"
                          style={{
                            height: 40,
                            width: 40,
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/image/dark_user.png')}
                          resizeMode="cover"
                          style={{
                            height: 40,
                            width: 40,
                          }}
                        />
                      )}
                    </View>

                    <Text
                      style={{
                        marginStart: heightPercentageToDP(1),
                        flex: 1,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      {user.country.countryname}
                    </Text>

                   
                  </View>

                  {/** Currency container */}

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                      marginTop: heightPercentageToDP(2),
                    }}>
                    Currency
                  </Text>

                  <View
                    style={{
                      height: heightPercentageToDP(7),
                      flexDirection: 'row',
                      backgroundColor: COLORS.white_s,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),

                      borderRadius: heightPercentageToDP(1),
                    }}>
                    <LinearGradient
                      colors={[COLORS.grayBg, COLORS.white_s]}
                      className="rounded-xl p-1">
                      <FontAwesome
                        name={'money'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        marginStart: heightPercentageToDP(1),
                        flex: 1,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      {user.country.countrycurrencysymbol}
                    </Text>

                
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default UserProfile;

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
