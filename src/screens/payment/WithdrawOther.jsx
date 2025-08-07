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
import DocumentPicker from 'react-native-document-picker';
import {useCreateWithdrawMutation} from '../../helper/Networkcall';
import {canPlaceWithdraw} from './Withdrawpaypal';
import AntDesign from 'react-native-vector-icons/AntDesign';
const WithdrawOther = () => {
  const navigation = useNavigation();
  const {accesstoken, user} = useSelector(state => state.user);

  const [amountval, setAmountval] = useState('');
  const [upiHolderName, setUpiHolderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [remarkval, setRemarkval] = useState('');
  const [showProgressBar, setProgressBar] = useState(false);

  const [paymentName, setPaymentName] = useState('');
  const [firstInputName, setFirstInputName] = useState('');
  const [firstInput, setFirstInput] = useState('');

  const [secondInputName, setSecondInputName] = useState('');
  const [secondInput, setSecondInput] = useState('');

  const [thirdInputName, setThirdInputName] = useState('');
  const [thirdInput, setThirdInput] = useState('');
  const [imageSource, setImageSource] = useState(null);

  const [imageFileName, setImageFileName] = useState('Choose a file');
  const [mineImage, setMineImage] = useState(null);

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      if (doc) {
        console.log(doc);

        setMineImage(doc);
        setImageSource({uri: doc[0].uri});
        setImageFileName(doc[0].name);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log('User cancelled the upload', err);
      else console.log(err);
    }
  };

  const [createWithdraw, {isLoading, error}] = useCreateWithdrawMutation();
  console.log('MOINEE:: ' + isLoading);

  const MIN_WITHDRAW_AMOUNT = 100;

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
    } else if (!paymentName) {
      Toast.show({
        type: 'error',
        text1: 'Please enter payment name',
      });
      return;
    } else if (firstInputName && !firstInput) {
      Toast.show({
        type: 'error',
        text1: `Enter ${'first value'}`,
      });
      return;
    } else if (secondInputName && !secondInput) {
      Toast.show({
        type: 'error',
        text1: `Enter ${'second value'}`,
      });
      return;
    } else if (thirdInputName && !thirdInput) {
      Toast.show({
        type: 'error',
        text1: `Enter ${'third value'}`,
      });
      return;
    } else if (!canPlaceWithdraw(user.walletOne.balance, amountval)) {
      Toast.show({
        type: 'error',
        text1: 'Insufficent Balance',
        text2: 'Add balance to ' + user.walletOne.walletName,
      });
    } else {
      setProgressBar(true);
      try {
        // const body = {
        //   amount: amountval,
        //   remark: remarkval,
        //   paymenttype: 'Upi',
        //   username: user.name,
        //   userid: user.userId,
        //   paymentstatus: 'Pending',
        //   transactionType: 'Withdraw',
        //   upiHolderName,
        //   upiId,
        // };

        const formData = new FormData();

        formData.append('amount', amountval);
        formData.append('remark', remarkval);
        formData.append('paymenttype', 'Other');
        formData.append('username', user.name);
        formData.append('userid', user.userId);
        formData.append('paymentstatus', 'Pending');
        formData.append('transactionType', 'Withdraw');

        // ✅ Append fields dynamically only if they have data
        console.log('FORM DATA creating :: ');
        if (paymentName) formData.append('paymentName', paymentName);
        if (firstInput) formData.append('firstInput', firstInput);
        if (firstInputName) formData.append('firstInputName', firstInputName);
        if (secondInput) formData.append('secondInput', secondInput);
        if (secondInputName)
          formData.append('secondInputName', secondInputName);
        if (thirdInput) formData.append('thirdInput', thirdInput);
        if (thirdInputName) formData.append('thirdInputName', thirdInputName);
        if (imageSource) {
          formData.append('qrcode', {
            uri: mineImage[0].uri,
            name: mineImage[0].name,
            type: mineImage[0].type || 'image/jpeg', // Default to 'image/jpeg' if type is null
          });
        }

        // console.log('Request body :: ' + JSON.stringify(body));

        const res = await createWithdraw({
          accessToken: accesstoken,
          body: formData,
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
                  Other Withdraw
                </GradientTextWhite>
              </View>

              {/** FOR UPI DEPOSIT FORM */}

              <ScrollView showsVerticalScrollIndicator={false}>
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
                    Payment Method Name
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
                      placeholder="Payment Header name: Exm - Paypal, Skill, etc."
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      textColor={COLORS.black}
                      fontFamily={FONT.Montserrat_Bold}
                      value={paymentName}
                      inputMode="text"
                      onChangeText={text => setPaymentName(text)}
                    />
                  </LinearGradient>
                </View>

                {/** first */}

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
                    First Input Name
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
                      placeholder="1st Head line name: Exm - [ Paypal ID ]"
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      textColor={COLORS.black}
                      fontFamily={FONT.Montserrat_Bold}
                      value={firstInputName}
                      inputMode="text"
                      onChangeText={text => setFirstInputName(text)}
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
                    First Input Value
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
                      placeholder="Payment Receiving ID: Exm- Paypal@gmail.com"
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      textColor={COLORS.black}
                      fontFamily={FONT.Montserrat_Bold}
                      value={firstInput}
                      inputMode="text"
                      onChangeText={text => setFirstInput(text)}
                    />
                  </LinearGradient>
                </View>

                {/** second */}
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
                    Second Input Name
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
                      placeholder="2nd Head line name: Exm - [ Paypal ID ] Other field to add ( Optional )"
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={secondInputName}
                      onChangeText={text => setSecondInputName(text)}
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
                    Second Input Value
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
                      placeholder="2nd input value if your payment option have update in this field ( Optional )"
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={secondInput}
                      onChangeText={text => setSecondInput(text)}
                    />
                  </LinearGradient>
                </View>

                {/** third */}

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
                    Third Input Name
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
                      placeholder="3rd Head line name: Exm - [ Paypal ID ] Other field to add ( Optional )"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={thirdInputName}
                      onChangeText={text => setThirdInputName(text)}
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
                    Third Input Value
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
                      placeholder="3rd input value if your payment option have update in this field ( Optional )"
                      cursorColor={COLORS.white}
                      placeholderTextColor={COLORS.black}
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.black,
                      }}
                      value={thirdInput}
                      onChangeText={text => setThirdInput(text)}
                    />
                  </LinearGradient>
                </View>

                {/** qr code */}

                <TouchableOpacity
                  onPress={selectDoc}
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
                    Qr code
                  </Text>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={{
                      borderRadius: heightPercentageToDP(2),
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        backgroundColor: 'transparent',
                        fontFamily: FONT.HELVETICA_REGULAR,
                        color: COLORS.black,
                        height: heightPercentageToDP(7),
                        textAlignVertical: 'center',
                        paddingStart: heightPercentageToDP(2),
                        fontSize: heightPercentageToDP(2),
                      }}>
                      {imageFileName}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        paddingEnd: heightPercentageToDP(2),
                      }}>
                      <LinearGradient
                        colors={[COLORS.grayBg, COLORS.white_s]}
                        style={{borderRadius: 20, padding: 10}}>
                        <AntDesign
                          name={'upload'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </LinearGradient>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

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
              </ScrollView>

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
                      margin: heightPercentageToDP(1),
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
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WithdrawOther;

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
