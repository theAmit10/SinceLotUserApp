import {
  FlatList,
  Image,
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
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import Clipboard from '@react-native-clipboard/clipboard';
import Loading from '../../components/helpercComponent/Loading';
import {TextInput} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import axios from 'axios';
import UrlHelper from '../../helper/UrlHelper';
import {useCreateDepositMutation} from '../../helper/Networkcall';

const upiapidata = [
  {
    name: 'Wasu',
    acccontno: '9876543210@ybl',
    id: '1',
    ifsccode: '837377SBIco',
    bankname: 'SBI',
  },
  {
    name: 'Aman',
    acccontno: '8876543210@ybl',
    id: '2',
    ifsccode: '037377SBIco',
    bankname: 'PND',
  },
  {
    name: 'Zasu',
    acccontno: '7876543210@ybl',
    id: '3',
    ifsccode: '537377SBIco',
    bankname: 'HDFC',
  },
  {
    name: 'Masu',
    acccontno: '1876543210@ybl',
    id: '4',
    ifsccode: '137377SBIco',
    bankname: 'SBI',
  },
  {
    name: 'Kasu',
    acccontno: '2876543210@ybl',
    id: '5',
    ifsccode: '437377SBIco',
    bankname: 'SBI',
  },
];

const BankDeposit = () => {
  const navigation = useNavigation();

  const {accesstoken, user} = useSelector(state => state.user);

  const [upiVisible, setUpiVisible] = useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState(upiapidata[1]);

  const [amountval, setAmountval] = useState('');
  const [transactionval, setTransactionval] = useState('');
  const [remarkval, setRemarkval] = useState('');

  const toggleUpiOptionView = () => {
    setUpiVisible(!upiVisible);
  };

  const copyToClipboard = val => {
    Clipboard.setString(val);
    Toast.show({
      type: 'success',
      text1: 'Text Copied',
      text2: 'The text has been copied to your clipboard!',
    });
  };

  const settingUpiId = item => {
    setSelectedUpiId(item);
    setUpiVisible(false);
  };

  // TO GET ALL THE ADMIN BANK
  const isFocused = useIsFocused();

  useEffect(() => {
    allTheDepositData();
  }, [isFocused, loadingAllData, allDepositdata]);

  const [loadingAllData, setLoadingAllData] = useState(false);
  const [allDepositdata, setAllDepositData] = useState([]);

  const allTheDepositData = async () => {
    try {
      setLoadingAllData(true);

      const url = `${UrlHelper.PARTNER_USER_BANK_API}/${user.rechargePaymentId}`;
      const {data} = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accesstoken}`,
        },
      });

      console.log('datat :: ' + JSON.stringify(data));
      setAllDepositData(data.payments);
      setSelectedUpiId(data.payments[0]);
      setLoadingAllData(false);
    } catch (error) {
      setLoadingAllData(false);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log(error);
    }
  };

  const [imageFileName, setImageFileName] = useState('Choose a file');
  const [mineImage, setMineImage] = useState(null);

  const [createDeposit, {isLoading, error}] = useCreateDepositMutation();

  const [imageSource, setImageSource] = useState(null);

  // For Opening PhoneStorage
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

  const submitDeposit = async () => {
    if (!amountval) {
      Toast.show({type: 'error', text1: 'Enter Deposit Amount'});
      return;
    }
    if (isNaN(amountval)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Please enter valid amount',
      });
    }
    if (!transactionval) {
      Toast.show({type: 'error', text1: 'Enter Transaction Number'});
      return;
    }
    if (!imageSource) {
      Toast.show({type: 'error', text1: 'Add Transaction Screenshot'});
      return;
    }
    try {
      const formData = new FormData();
      formData.append('amount', amountval);
      formData.append('transactionid', transactionval);
      formData.append('remark', remarkval);
      formData.append('paymenttype', 'Bank');
      formData.append('paymenttypeid', selectedUpiId.paymentId);
      formData.append('username', user.name);
      formData.append('userid', user.userId);
      formData.append('paymentstatus', 'Pending');

      formData.append('receipt', {
        uri: mineImage[0].uri,
        name: mineImage[0].name,
        type: mineImage[0].type || 'image/jpeg', // Default to 'image/jpeg' if type is null
      });

      formData.append('transactionType', 'Deposit');
      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await createDeposit({
        accessToken: accesstoken,
        body: formData,
      }).unwrap();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      navigation.goBack();
    } catch (error) {
      console.log('Error during deposit:', error);
      if (error.response) {
        Toast.show({type: 'error', text1: error.response.data});
      } else if (error.request) {
        Toast.show({
          type: 'error',
          text1: 'Request was made, but no response was received',
        });
      } else {
        Toast.show({type: 'error', text1: error.message});
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
                  Bank Deposit
                </GradientTextWhite>
                {!loadingAllData && allDepositdata.length !== 0 && (
                  <TouchableOpacity onPress={toggleUpiOptionView}>
                    <LinearGradient
                      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                      start={{x: 0, y: 0}} // start from left
                      end={{x: 1, y: 0}} // end at right
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        height: heightPercentageToDP(10),
                        borderRadius: heightPercentageToDP(2),
                        alignItems: 'center',
                        gap: heightPercentageToDP(3),
                        paddingStart: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                      }}>
                      <View
                        style={{
                          backgroundColor: COLORS.white_s,
                          padding: heightPercentageToDP(1.5),
                          borderRadius: heightPercentageToDP(1),
                        }}>
                        <Image
                          source={require('../../../assets/image/bank.png')}
                          resizeMode="cover"
                          style={{
                            height: 25,
                            width: 25,
                          }}
                        />
                      </View>
                      <GradientTextWhite style={styles.textStyleContent}>
                        Bank
                      </GradientTextWhite>
                      {/* <GradientTextWhite style={styles.textStyleContent}>
                        {selectedUpiId?.paymentId}
                      </GradientTextWhite> */}
                      <LinearGradient
                        colors={[COLORS.result_orange, COLORS.result_orange]}
                        style={{borderRadius: 20, padding: 10}}>
                        <AntDesign
                          name={'downcircleo'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.white_s}
                        />
                      </LinearGradient>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {loadingAllData ? (
                <View
                  style={{
                    height: heightPercentageToDP(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Loading />
                </View>
              ) : (
                <>
                  {allDepositdata.length === 0 ? (
                    <View
                      style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        margin: heightPercentageToDP(2),
                        borderRadius: heightPercentageToDP(2),
                      }}>
                      <Text
                        style={{
                          color: COLORS.white_s,

                          padding: heightPercentageToDP(1),
                          borderRadius: heightPercentageToDP(1),
                          fontFamily: FONT.Montserrat_SemiBold,
                          maxWidth: widthPercentageToDP(80),
                          fontSize: heightPercentageToDP(2),
                          textAlign: 'center',
                        }}>
                        This Payment option updating shortly. Thank You
                      </Text>
                    </View>
                  ) : (
                    <>
                      {/** FOR UPI ID DEPOSIT OPTION */}
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {upiVisible &&
                          allDepositdata.map(item => (
                            <TouchableOpacity
                              key={item._id}
                              onPress={() => settingUpiId(item)}>
                              <LinearGradient
                                colors={[
                                  COLORS.time_firstblue,
                                  COLORS.time_secondbluw,
                                ]}
                                start={{x: 0, y: 0}} // start from left
                                end={{x: 1, y: 0}} // end at right
                                style={{
                                  borderRadius: heightPercentageToDP(2),
                                  marginHorizontal: heightPercentageToDP(2),
                                  marginVertical: heightPercentageToDP(1),
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    height: heightPercentageToDP(5),
                                    marginVertical: heightPercentageToDP(1),
                                  }}>
                                  <View
                                    style={{
                                      flex: 2,
                                      flexDirection: 'row',
                                      gap: heightPercentageToDP(3),
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <View
                                      style={{
                                        backgroundColor: COLORS.white_s,
                                        padding: heightPercentageToDP(1),
                                        borderRadius: heightPercentageToDP(1),
                                      }}>
                                      <Image
                                        source={require('../../../assets/image/bank.png')}
                                        resizeMode="cover"
                                        style={{
                                          height: 25,
                                          width: 25,
                                        }}
                                      />
                                    </View>
                                    <GradientTextWhite
                                      style={styles.textStyleContent}>
                                      Bank
                                    </GradientTextWhite>
                                    {/* <GradientTextWhite
                                      style={styles.textStyleContent}>
                                      {item.paymentId}
                                    </GradientTextWhite> */}
                                  </View>

                                  <View
                                    style={{
                                      flex: 1,
                                      justifyContent: 'flex-end',
                                      alignItems: 'flex-end',
                                      paddingEnd: heightPercentageToDP(1),
                                    }}>
                                    <LinearGradient
                                      colors={[COLORS.grayBg, COLORS.white_s]}
                                      style={{borderRadius: 10, padding: 5}}>
                                      <AntDesign
                                        name={
                                          selectedUpiId._id === item._id
                                            ? 'checkcircle'
                                            : 'checkcircleo'
                                        }
                                        size={heightPercentageToDP(3)}
                                        color={
                                          selectedUpiId._id === item._id
                                            ? COLORS.green
                                            : COLORS.darkGray
                                        }
                                      />
                                    </LinearGradient>
                                  </View>
                                </View>

                                {/** BANK NAME */}
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    padding: heightPercentageToDP(1),
                                  }}>
                                  <View
                                    style={{
                                      flex: 1,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                    }}>
                                    <Text style={styles.copytitle}>
                                      Bank Name
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                      paddingHorizontal:
                                        heightPercentageToDP(1),
                                    }}>
                                    <Text
                                      style={styles.copycontent}
                                      numberOfLines={2}>
                                      {item.bankname}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 0.5,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        copyToClipboard(item.bankname)
                                      }>
                                      <LinearGradient
                                        colors={[
                                          COLORS.lightWhite,
                                          COLORS.white_s,
                                        ]}
                                        style={{
                                          padding: heightPercentageToDP(0.5),
                                          borderRadius: heightPercentageToDP(1),
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <AntDesign
                                          name={'copy1'}
                                          size={heightPercentageToDP(2.5)}
                                          color={COLORS.darkGray}
                                        />
                                      </LinearGradient>
                                    </TouchableOpacity>
                                  </View>
                                </View>

                                {/** ACCOUNT HOLDER NAME */}
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    padding: heightPercentageToDP(1),
                                  }}>
                                  <View
                                    style={{
                                      flex: 1,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                    }}>
                                    <Text style={styles.copytitle}>
                                      Account Holder Name
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                      paddingHorizontal:
                                        heightPercentageToDP(1),
                                    }}>
                                    <Text
                                      style={styles.copycontent}
                                      numberOfLines={2}>
                                      {item.accountholdername}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 0.5,
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        copyToClipboard(item.accountholdername)
                                      }>
                                      <LinearGradient
                                        colors={[
                                          COLORS.lightWhite,
                                          COLORS.white_s,
                                        ]}
                                        style={{
                                          padding: heightPercentageToDP(0.5),
                                          borderRadius: heightPercentageToDP(1),
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <AntDesign
                                          name={'copy1'}
                                          size={heightPercentageToDP(2.5)}
                                          color={COLORS.darkGray}
                                        />
                                      </LinearGradient>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                {/** ACCOUNT NUMBER */}
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    padding: heightPercentageToDP(1),
                                  }}>
                                  <View
                                    style={{
                                      flex: 1,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                    }}>
                                    <Text style={styles.copytitle}>
                                      Account No.
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                      paddingHorizontal:
                                        heightPercentageToDP(1),
                                    }}>
                                    <Text
                                      style={styles.copycontent}
                                      numberOfLines={2}>
                                      {item.accountnumber}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 0.5,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        copyToClipboard(item.accountnumber)
                                      }>
                                      <LinearGradient
                                        colors={[
                                          COLORS.lightWhite,
                                          COLORS.white_s,
                                        ]}
                                        style={{
                                          padding: heightPercentageToDP(0.5),
                                          borderRadius: heightPercentageToDP(1),
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <AntDesign
                                          name={'copy1'}
                                          size={heightPercentageToDP(2.5)}
                                          color={COLORS.darkGray}
                                        />
                                      </LinearGradient>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                {/** ACCOUNT SWIFT CODE */}
                                {item.swiftcode ? (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      padding: heightPercentageToDP(1),
                                    }}>
                                    <View
                                      style={{
                                        flex: 1,

                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                      }}>
                                      <Text style={styles.copytitle}>
                                        Swift Code
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flex: 2,

                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        paddingHorizontal:
                                          heightPercentageToDP(1),
                                      }}>
                                      <Text
                                        style={styles.copycontent}
                                        numberOfLines={2}>
                                        {item.swiftcode}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flex: 0.5,

                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <TouchableOpacity
                                        onPress={() =>
                                          copyToClipboard(item.swiftcode)
                                        }>
                                        <LinearGradient
                                          colors={[
                                            COLORS.lightWhite,
                                            COLORS.white_s,
                                          ]}
                                          style={{
                                            padding: heightPercentageToDP(0.5),
                                            borderRadius:
                                              heightPercentageToDP(1),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          }}>
                                          <AntDesign
                                            name={'copy1'}
                                            size={heightPercentageToDP(2.5)}
                                            color={COLORS.darkGray}
                                          />
                                        </LinearGradient>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                ) : null}

                                {/** ROUTING/ IFSC CODE */}
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    padding: heightPercentageToDP(1),
                                  }}>
                                  <View
                                    style={{
                                      flex: 1,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                    }}>
                                    <Text style={styles.copytitle}>
                                      Routing / IFSC Code
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                      paddingHorizontal:
                                        heightPercentageToDP(1),
                                    }}>
                                    <Text
                                      style={styles.copycontent}
                                      numberOfLines={2}>
                                      {item.ifsccode}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 0.5,

                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        copyToClipboard(item.ifsccode)
                                      }>
                                      <LinearGradient
                                        colors={[
                                          COLORS.lightWhite,
                                          COLORS.white_s,
                                        ]}
                                        style={{
                                          padding: heightPercentageToDP(0.5),
                                          borderRadius: heightPercentageToDP(1),
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <AntDesign
                                          name={'copy1'}
                                          size={heightPercentageToDP(2.5)}
                                          color={COLORS.darkGray}
                                        />
                                      </LinearGradient>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                {/** NOTE */}

                                <View
                                  style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                    padding: heightPercentageToDP(2),
                                  }}>
                                  <View
                                    style={{
                                      flex: 0.75,
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                    }}>
                                    <Text
                                      style={{
                                        ...styles.copytitle,
                                        paddingLeft: heightPercentageToDP(1),
                                        textAlignVertical: 'center',
                                      }}
                                      numberOfLines={2}>
                                      {item.paymentnote ? 'Note' : ''}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,
                                      paddingStart: heightPercentageToDP(3),
                                    }}>
                                    <Text style={styles.copycontent}>
                                      {item.paymentnote}
                                    </Text>
                                  </View>
                                </View>
                              </LinearGradient>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>

                      {/** FOR UPI DEPOSIT FORM */}

                      {!upiVisible && (
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
                                Send Amount
                              </Text>

                              <LinearGradient
                                colors={[
                                  COLORS.time_firstblue,
                                  COLORS.time_secondbluw,
                                ]}
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
                                  value={amountval}
                                  onChangeText={text => setAmountval(text)}
                                />
                              </LinearGradient>
                            </View>

                            {/** Transaction id */}

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
                                Transaction ID
                              </Text>

                              <LinearGradient
                                colors={[
                                  COLORS.time_firstblue,
                                  COLORS.time_secondbluw,
                                ]}
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
                                  value={transactionval}
                                  onChangeText={text => setTransactionval(text)}
                                />
                              </LinearGradient>
                            </View>

                            {/** Receipt */}

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
                                Upload Receipt
                              </Text>

                              <LinearGradient
                                colors={[
                                  COLORS.time_firstblue,
                                  COLORS.time_secondbluw,
                                ]}
                                start={{x: 0, y: 0}} // start from left
                                end={{x: 1, y: 0}} // end at right
                                style={{
                                  borderRadius: heightPercentageToDP(2),
                                  flexDirection: 'row',
                                  alignItems: 'center', // Ensures vertical alignment of items
                                  padding: heightPercentageToDP(0.5), // Adjust padding for spacing
                                }}>
                                <Text
                                  style={{
                                    backgroundColor: 'transparent',
                                    fontFamily: FONT.HELVETICA_REGULAR,
                                    color: COLORS.black,
                                    fontSize: heightPercentageToDP(2),
                                    textAlign: 'left',
                                    paddingStart: heightPercentageToDP(2), // Padding for spacing on the left
                                    flex: 1, // Let the text take available space
                                  }}>
                                  {imageFileName}
                                </Text>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                                colors={[
                                  COLORS.time_firstblue,
                                  COLORS.time_secondbluw,
                                ]}
                                start={{x: 0, y: 0}} // start from left
                                end={{x: 1, y: 0}} // end at right
                                style={{
                                  borderRadius: heightPercentageToDP(2),
                                }}>
                                <TextInput
                                  underlineColor="transparent"
                                  activeUnderlineColor="transparent"
                                  cursorColor={COLORS.white}
                                  placeholder="Enter amount, currency & method with remarks (e.g. 100 USD BANK)"
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
                                marginBottom: heightPercentageToDP(5),
                                marginTop: heightPercentageToDP(2),
                              }}>
                              {isLoading ? (
                                <Loading />
                              ) : (
                                <TouchableOpacity
                                  onPress={submitDeposit}
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
                      )}
                    </>
                  )}
                </>
              )}
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BankDeposit;

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
