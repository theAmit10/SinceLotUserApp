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
import TextAreaInput from '../../components/partner/updatepartner/TextAreaInput';
import {useDecreasePartnerProfitMutation} from '../../helper/Networkcall';

const DecresePercentage = ({route}) => {
  const navigation = useNavigation();
  const {item} = route.params;
  const dispatch = useDispatch();

  const {accesstoken, user} = useSelector(state => state.user);
  const [decreasePartnerProfit, {isLoading, data, error}] =
    useDecreasePartnerProfitMutation();

  const [inputValue, setInputValue] = useState('');

  const [profitPercentage, setProfitPercentage] = useState('');
  const [reason, setReason] = useState('');

  const submitDecreasePercentage = async () => {
    if (!profitPercentage) {
      Toast.show({
        type: 'error',
        text1: 'Enter Profit Percentage',
      });
    }
    if (!reason) {
      Toast.show({
        type: 'error',
        text1: 'Enter Reason',
      });
    }
    if (isNaN(profitPercentage)) {
      Toast.show({
        type: 'error',
        text1: 'Please enter valid new profit percentage',
      });
    } else if (
      Number.parseInt(item.profitPercentage) <=
      Number.parseInt(profitPercentage)
    ) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Profit Percentage',
        text2: 'New percentage must be lower than the current one.',
      });
    } else {
      try {
        const res = await decreasePartnerProfit({
          accesstoken,
          body: {
            userId: item.userId,
            partnerId: user.userId,
            profitPercentage: profitPercentage,
            reason: reason,
          },
        });

        console.log(res.data.message);

        Toast.show({
          type: 'success',
          text1: res.data.message,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.data.message,
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
                Decrese Percentage
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
                  {/* <UpdatePartnerComp title={'User ID'} value={'1090'} /> */}
                  <UpdatePartnerComp
                    title={'Old Profit Percentage'}
                    value={item.profitPercentage}
                  />

                  <UpdatePartnerInput
                    title="New Percentage"
                    value={profitPercentage}
                    onChangeText={text => setProfitPercentage(text)} // Updates inputValue state
                    placeholder="Enter new reduced percentage"
                    keyboardType="numeric"
                  />

                  <TextAreaInput
                    title="Reason"
                    value={reason}
                    onChangeText={text => setReason(text)} // Updates inputValue state
                    placeholder="Enter profit deduction reason"
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
                          style={{
                            backgroundColor: COLORS.blue,
                            padding: heightPercentageToDP(2),
                            borderRadius: heightPercentageToDP(1),
                            alignItems: 'center',
                          }}
                          onPress={submitDecreasePercentage}>
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

export default DecresePercentage;

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
