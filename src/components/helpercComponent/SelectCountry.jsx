import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import {useGetAllCountryQuery} from '../../helper/Networkcall';
import Loading from './Loading';
import {server, serverName} from '../../redux/store';

const SelectCountry = ({route}) => {
  const {signupwith} = route.params;

  console.log(signupwith)
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);

  const {data, isLoading, error} = useGetAllCountryQuery(accesstoken);

  console.log('Curriencies ::' + JSON.stringify(data));

  const selectCountryHandler = (country) => {
    navigation.navigate('Register', { country,signupwith });
  };


  return (
    <View style={{flex: 1}}>
      <Background />

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(85),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(85),
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

            {/** Content Container */}

            <View
              style={{
                height: heightPercentageToDP(10),
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Select Country
              </GradientTextWhite>
            </View>

            {isLoading ? (
              <View
                style={{
                  height: heightPercentageToDP(30),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Loading />
              </View>
            ) : (
              <FlatList
                data={data?.currencies}
                renderItem={({item}) => (
                  <TouchableOpacity
                  onPress={() => selectCountryHandler(item)}
                    style={{
                      height: heightPercentageToDP(7),
                      flexDirection: 'row',
                      backgroundColor: COLORS.white_s,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      marginHorizontal: heightPercentageToDP(2),
                      marginBottom: heightPercentageToDP(1),
                    }}>
                    <View
                      style={{
                        borderRadius: 100,
                        overflow: 'hidden',
                        width: 40,
                        height: 40,
                      }}>
                      {item?.countryicon ? (
                        <Image
                          source={{
                            uri: `${serverName}/uploads/currency/${item.countryicon}`,
                          }}
                          resizeMode="cover"
                          style={{
                            height: 40,
                            width: 40,
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../../assets/image/dark_user.png')}
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
                        color: COLORS.black,
                      }}>
                      {item.countryname}
                    </Text>
                    <Entypo
                      name={'chevron-with-circle-down'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item._id.toString()}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                ListFooterComponent={() => (
                  <View
                    style={{
                      height: heightPercentageToDP(20),
                    }}></View>
                )}
              />
            )}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default SelectCountry;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: heightPercentageToDP(20),
  },
  item: {
    padding: heightPercentageToDP(2),
    marginVertical: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
  },
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },
});
