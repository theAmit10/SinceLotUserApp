import {
  FlatList,
  ImageBackground,
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
import Fontisto from 'react-native-vector-icons/Fontisto';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import Wallet from '../../components/home/Wallet';
import {HOVER} from 'nativewind/dist/utils/selector';
import Loading from '../../components/helpercComponent/Loading';
import GradientText from '../../components/helpercComponent/GradientText';
import {useTransferWalletBalanceMutation} from '../../helper/Networkcall';
import {loadProfile} from '../../redux/actions/userAction';

const BalanceTransfer = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken, user} = useSelector(state => state.user);
  const [amountval, setAmountval] = useState('');

  const [transferWalletBalance, {isLoading, error}] =
    useTransferWalletBalanceMutation();

  const submitHandler = async () => {
    if (!amountval) {
      Toast.show({type: 'error', text1: 'Enter Amount'});
    }
    if (isNaN(amountval)) {
      Toast.show({type: 'error', text1: 'Invalid Amount',text2: 'Please enter valid amount'});
    }
     else {
      try {
        const body = {
          amount: amountval,
          userid: user._id,
        };

        console.log('Request body :: ' + JSON.stringify(body));

        const res = await transferWalletBalance({
          accessToken: accesstoken,
          body,
        }).unwrap();

        console.log('Withdraw res :: ' + JSON.stringify(res));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message,
        });

        dispatch(loadProfile(accesstoken));
      } catch (error) {
        console.log('Error during withdraw:', error);
        Toast.show({
          type: 'error',
          text1: 'Balance transfer failed',
          text2: error.data.message,
        });
      }
    }
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
                height: heightPercentageToDP(6),
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Balance Transfer
              </GradientTextWhite>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: heightPercentageToDP(2),
                }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      paddingStart: heightPercentageToDP(2),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {user.walletOne.visibility && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('WalletBalance', {
                            data: user.walletOne,
                          })
                        }>
                        <Wallet wallet={user.walletOne} />
                      </TouchableOpacity>
                    )}

                    {user.walletTwo.visibility && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('WalletBalance', {
                            data: user.walletTwo,
                          })
                        }>
                        <Wallet wallet={user.walletTwo} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View
                    style={{
                      height: heightPercentageToDP(30),
                      marginTop: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(2),
                      backgroundColor: COLORS.grayHalfBg,
                      padding: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <GradientText
                      style={{
                        fontSize: heightPercentageToDP(3),
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}>
                      Transfer Amount
                    </GradientText>

                    {/** Amount */}
                    <View
                      style={{
                        borderRadius: heightPercentageToDP(2),
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_SemiBold,
                          color: COLORS.black,
                          fontSize: heightPercentageToDP(2),
                          paddingStart: heightPercentageToDP(1),
                          marginVertical: heightPercentageToDP(2),
                        }}>
                        {user.walletOne.walletName} to{' '}
                        {user.walletTwo.walletName}
                      </Text>

                      <LinearGradient
                        colors={[COLORS.grayHalfBg, COLORS.white_s]}
                        start={{x: 0, y: 0}} // start from left
                        end={{x: 1, y: 0}} // end at right
                        style={{
                          borderRadius: heightPercentageToDP(2),
                        }}>
                        <TextInput
                          underlineColor="transparent"
                          activeUnderlineColor="transparent"
                          cursorColor={COLORS.black}
                          placeholderTextColor={COLORS.black}
                          style={{
                            backgroundColor: 'transparent',
                            fontFamily: FONT.Montserrat_Bold,
                            color: COLORS.black,
                            paddingStart: heightPercentageToDP(2),
                            minHeight: heightPercentageToDP(7)
                          }}
                          placeholder="Amount"
                          textColor={COLORS.black}
                          fontFamily={FONT.Montserrat_Bold}
                          value={amountval}
                          inputMode="decimal"
                          onChangeText={text => setAmountval(text)}
                        />
                      </LinearGradient>
                    </View>

                    {/** Submit */}

                    <View
                      style={{
                        marginBottom: heightPercentageToDP(5),
                        marginTop: heightPercentageToDP(2),
                      }}>
                      {isLoading ? (
                        <Loading />
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
                            Send
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default BalanceTransfer;

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
