import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import GradientText from '../../components/helpercComponent/GradientText';
import UpdatePartnerComp from '../../components/partner/updatepartner/UpdatePartnerComp';
import UpdatePartnerInput from '../../components/partner/updatepartner/UpdatePartnerInput';
import Loading from '../../components/helpercComponent/Loading';
import {useUpdateProfitPercentageMutation} from '../../helper/Networkcall';

const UpdatePercentage = ({route}) => {
  const {item} = route.params;

  console.log('Data from update percentage :: ' + JSON.stringify(item));

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);
  const [profitPercentage, setProfitPercentage] = useState(null);

  const [updateProfitPercentage, {isLoading, error}] =
    useUpdateProfitPercentageMutation();

  // TODE: UPDATE PARTNER PERCENTAGE FUNCTION
  const updatePartnerPercentage = async () => {
    if (!profitPercentage) {
      Toast.show({
        type: 'error',
        text1: 'Enter Profit Percentage',
      });
    } else {
      console.log(item.userId);
      console.log(profitPercentage);
      try {
        const res = await updateProfitPercentage({
          accesstoken,
          body: {
            partnerId: item.userId,
            profitPercentage: profitPercentage,
          },
        });

        console.log(res);
        Toast.show({
          type: 'success',
          text1: 'Successfully Updated',
        });
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="height"
        keyboardVerticalOffset={-60}>
        <Background />

        {/** Main Cointainer */}

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ImageBackground
            source={require('../../../assets/image/tlwbg.jpg')}
            style={{
              width: '100%',
              height: heightPercentageToDP(80),
            }}
            imageStyle={{
              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
            }}>
            <View
              style={{
                height: heightPercentageToDP(80),
                width: widthPercentageToDP(100),

                borderTopLeftRadius: heightPercentageToDP(5),
                borderTopRightRadius: heightPercentageToDP(5),
              }}>
              {/** Top Style View */}
              <View
                style={{
                  height: heightPercentageToDP(5),
                  width: widthPercentageToDP(100),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: heightPercentageToDP(3),
                }}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_SemiBold,
                    color: COLORS.white_s,
                    fontSize: heightPercentageToDP(2),
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}>
                  {item.userId}
                </Text>
                <View
                  style={{
                    width: widthPercentageToDP(20),
                    height: heightPercentageToDP(0.8),
                    backgroundColor: COLORS.grayBg,
                    borderRadius: heightPercentageToDP(2),
                  }}></View>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_SemiBold,
                    color: COLORS.white_s,
                    fontSize: heightPercentageToDP(2),
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}>
                  {item.name}
                </Text>
              </View>

              <GradientTextWhite
                style={{
                  ...styles.textStyle,
                  paddingLeft: heightPercentageToDP(2),
                }}>
                Update Partner
              </GradientTextWhite>

              {/** Content Container */}

              <View
                style={{
                  flex: 1,
                  padding: heightPercentageToDP(1),
                }}>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1, // Ensures the content container grows to fill the available space
                    paddingBottom: heightPercentageToDP(2),
                  }}
                  showsVerticalScrollIndicator={false}>
                  {/** USER PLAY HISTORY DETAILS */}
                  <UpdatePartnerComp
                    title={'Old Profit Percentage'}
                    value={item.profitPercentage}
                  />
                  {/* <UpdatePartnerComp title={'Name'} value={'Aryan Singh'} /> */}

                  <UpdatePartnerInput
                    title="New Profit Percentage"
                    value={profitPercentage}
                    onChangeText={text => setProfitPercentage(text)} // Updates inputValue state
                    placeholder="Enter new profit percentage"
                    keyboardType="numeric"
                  />

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                    }}>
                    <View
                      style={{
                        marginBottom: heightPercentageToDP(5),
                        marginTop: heightPercentageToDP(2),
                      }}>
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <TouchableOpacity
                          onPress={updatePartnerPercentage}
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
                </ScrollView>
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdatePercentage;

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
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(2),
    alignItems: 'center',
    gap: heightPercentageToDP(3),
    paddingStart: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  iconContainer: {
    backgroundColor: COLORS.white_s,
    padding: heightPercentageToDP(1.5),
    borderRadius: heightPercentageToDP(1),
  },
  icon: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyleContent: {
    fontSize: heightPercentageToDP(3),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
});
