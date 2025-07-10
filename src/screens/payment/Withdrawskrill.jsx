import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import Loading from '../../components/helpercComponent/Loading';
import {TextInput} from 'react-native-paper';

import {useCreateWithdrawMutation} from '../../helper/Networkcall';
import {canPlaceWithdraw} from './Withdrawpaypal';

const Withdrawskrill = () => {
  const navigation = useNavigation();
  const {accesstoken, user} = useSelector(state => state.user);

  const [amountval, setAmountval] = useState('');
  const [skrillContact, setskrillContact] = useState('');

  const [remarkval, setRemarkval] = useState('');
  const [showProgressBar, setProgressBar] = useState(false);
  const [createWithdraw, {isLoading, error}] = useCreateWithdrawMutation();
  console.log('MOINEE:: ' + isLoading);

  const MIN_WITHDRAW_AMOUNT = 10;

  const submitHandler = async () => {
    if (!amountval) {
      Toast.show({type: 'error', text1: 'Enter Amount'});
    } else if (isNaN(amountval)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Please enter valid amount',
      });
    } else if (parseFloat(amountval) < MIN_WITHDRAW_AMOUNT) {
      Toast.show({
        type: 'error',
        text1: `Minimum Amount to withdraw is ${MIN_WITHDRAW_AMOUNT}`,
      });
    } else if (parseFloat(user?.walletOne?.balance) < parseFloat(amountval)) {
      Toast.show({
        type: 'error',
        text1: `Insufficent Balance`,
        text2: `You have insufficent balance in ${user?.walletOne?.walletName} wallet`,
      });
    } else if (!skrillContact) {
      Toast.show({
        type: 'error',
        text1: 'Please enter phone number or email address',
      });
    } else if (!canPlaceWithdraw(user.walletOne.balance, amountval)) {
      Toast.show({
        type: 'error',
        text1: 'Insufficent Balance',
        text2: 'Add balance to ' + user.walletOne.walletName,
      });
    } else {
      setProgressBar(true);
      try {
        const body = {
          amount: amountval,
          remark: remarkval,
          paymenttype: 'Skrill',
          username: user.name,
          userid: user.userId,
          paymentstatus: 'Pending',
          transactionType: 'Withdraw',
          skrillContact,
        };

        console.log('Request body :: ' + JSON.stringify(body));

        const res = await createWithdraw({
          accessToken: accesstoken,
          body,
        }).unwrap();
        console.log('Withdraw res :: ' + JSON.stringify(res));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message,
        });

        navigation.goBack();
        setProgressBar(false);
      } catch (error) {
        console.log('Error during withdraw:', error);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
        setProgressBar(false);
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
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
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
              <View style={{margin: heightPercentageToDP(2)}}>
                <GradientTextWhite style={styles.textStyle}>
                  Skrill Withdraw
                </GradientTextWhite>
              </View>

              {/** FOR UPI DEPOSIT FORM */}

              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    height: heightPercentageToDP(70),
                    padding: heightPercentageToDP(2),
                  }}>
                  {/** Amount */}
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
                        }}
                        textColor={COLORS.black}
                        fontFamily={FONT.Montserrat_Bold}
                        value={amountval}
                        inputMode="decimal"
                        onChangeText={text => setAmountval(text)}
                      />
                    </LinearGradient>
                  </View>

                  {/** skrill Phone number or email address*/}
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
                      Skrill ID or email
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
                        }}
                        value={skrillContact}
                        onChangeText={text => setskrillContact(text)}
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

                  {/** SUBMIT CONTAINER */}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Withdrawskrill;

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
