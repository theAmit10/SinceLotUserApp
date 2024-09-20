import {
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import { COLORS, FONT } from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import Loading from '../../components/helpercComponent/Loading';
import { TextInput } from 'react-native-paper';

import { useCreateWithdrawMutation } from '../../helper/Networkcall';
import { canPlaceWithdraw } from './Withdrawpaypal';

const Withdrawbank = () => {
  const navigation = useNavigation();
  const { accesstoken, user } = useSelector(state => state.user);

  const [amountval, setAmountval] = useState('');

  const [remarkval, setRemarkval] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankIFSC, setBankIFSC] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const [showProgressBar, setProgressBar] = useState(false);
  const [createWithdraw, { isLoading, error }] = useCreateWithdrawMutation();

  const submitHandler = async () => {
    if (!amountval) {
      Toast.show({ type: 'error', text1: 'Enter Amount' });
    } else if (!bankName) {
      Toast.show({ type: 'error', text1: 'Enter Bank Name' });
    } else if (!accountHolderName) {
      Toast.show({ type: 'error', text1: 'Enter account holder name' });
    } else if (!bankIFSC) {
      Toast.show({ type: 'error', text1: 'Enter Bank IFSC code' });
    } else if (!bankAccountNumber) {
      Toast.show({ type: 'error', text1: 'Enter Account Number' });
    }else if (!canPlaceWithdraw(user.walletOne.balance, amountval)) {
      Toast.show({
        type: 'error',
        text1: 'Insufficent Balance',
        text2: 'Add balance to '+user.walletOne.walletName,
      });
    }  
    else {
      setProgressBar(true);
      try {
        const body = {
          amount: amountval,
          remark: remarkval,
          paymenttype: 'Bank',
          username: user.name,
          userid: user.userId,
          paymentstatus: 'Pending',
          transactionType: 'Withdraw',
          bankName,
          accountHolderName,
          bankIFSC,
          bankAccountNumber,
        };

        const res = await createWithdraw({
          accessToken: accesstoken,
          body,
        }).unwrap();

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message,
        });

        navigation.goBack();
        setProgressBar(false);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
        setProgressBar(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Background />
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <ImageBackground
          source={require('../../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height:
            Platform.OS === 'android'
              ? heightPercentageToDP(85)
              : heightPercentageToDP(80),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height:
              Platform.OS === 'android'
                ? heightPercentageToDP(85)
                : heightPercentageToDP(80),
              width: widthPercentageToDP(100),
              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
               // Add padding to prevent cut off at the bottom
            }}>
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
                }}
              />
            </View>
            <View style={{ margin: heightPercentageToDP(2) }}>
              <GradientTextWhite style={styles.textStyle}>
                Bank Withdraw
              </GradientTextWhite>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: heightPercentageToDP(10) }} showsVerticalScrollIndicator={false}>
              <View
                style={{
                  padding: heightPercentageToDP(2),
                }}>
                <View
                  style={{
                    borderRadius: heightPercentageToDP(2),
                    padding: heightPercentageToDP(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                    }}>
                    Amount
                  </Text>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <TextInput
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      textColor={COLORS.black}
                      fontFamily={FONT.Montserrat_Bold}
                      value={amountval}
                      inputMode="decimal"
                      onChangeText={text => setAmountval(text)}
                    />
                  </LinearGradient>
                </View>

                <View
                  style={{
                    borderRadius: heightPercentageToDP(2),
                    padding: heightPercentageToDP(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                    }}>
                    Bank Name
                  </Text>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <TextInput
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={bankName}
                      onChangeText={text => setBankName(text)}
                    />
                  </LinearGradient>
                </View>

                <View
                  style={{
                    borderRadius: heightPercentageToDP(2),
                    padding: heightPercentageToDP(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                    }}>
                    Account Holder Name
                  </Text>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <TextInput
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={accountHolderName}
                      onChangeText={text => setAccountHolderName(text)}
                    />
                  </LinearGradient>
                </View>

                <View
                  style={{
                    borderRadius: heightPercentageToDP(2),
                    padding: heightPercentageToDP(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                    }}>
                    Bank IFSC
                  </Text>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <TextInput
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={bankIFSC}
                      onChangeText={text => setBankIFSC(text)}
                    />
                  </LinearGradient>
                </View>

                <View
                  style={{
                    borderRadius: heightPercentageToDP(2),
                    padding: heightPercentageToDP(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                    }}>
                    Bank Account Number
                  </Text>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <TextInput
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={bankAccountNumber}
                      onChangeText={text => setBankAccountNumber(text)}
                    />
                  </LinearGradient>
                </View>

                 {/** Remark */}

                 <View
                  style={{
                    borderRadius: heightPercentageToDP(2),
                    padding: heightPercentageToDP(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_SemiBold,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                      paddingStart: heightPercentageToDP(1),
                    }}>
                    Remark
                  </Text>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={{
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <TextInput
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                        minHeight: heightPercentageToDP(10),
                      }}
                      multiline={true}
                      value={remarkval}
                      numberOfLines={4}
                      onChangeText={text => setRemarkval(text)}
                    />
                  </LinearGradient>
                </View>

                <View
                  style={{
                    marginBottom: heightPercentageToDP(2),
                    marginTop: heightPercentageToDP(2),
                  }}>
                  {showProgressBar ? (
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
                        Submit
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Withdrawbank;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  textStyleContent: {
    fontSize: heightPercentageToDP(3),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  copycontent: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  copytitle: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_SemiBold,
  },
  inputContainer: {
    marginTop: heightPercentageToDP(3),
    paddingVertical: heightPercentageToDP(2),
    gap: heightPercentageToDP(2),
  },
  input: {
    height: heightPercentageToDP(7),
    flexDirection: 'row',
    backgroundColor: COLORS.white_s,
    alignItems: 'center',
    paddingHorizontal: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
  },
  textInput: {
    marginStart: heightPercentageToDP(1),
    flex: 1,
    fontFamily: FONT.SF_PRO_REGULAR,
    color: COLORS.black,
  },
  subtitle: {
    fontFamily: FONT.Montserrat_SemiBold,
    fontSize: heightPercentageToDP(1.5),
    margin: 5,
  },
  userNameInput: {
    fontFamily: FONT.Montserrat_Regular,
    fontSize: heightPercentageToDP(2),
    borderWidth: 1,
  },
});
