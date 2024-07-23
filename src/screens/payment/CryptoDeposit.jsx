import {
  FlatList,
  Image,
  ImageBackground,
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
import mime from 'mime';
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

const upiapidata = [
  {name: 'Wasu', upiid: '9876543210@ybl', id: '1'},
  {name: 'Aman', upiid: '8876543210@ybl', id: '2'},
  {name: 'Zasu', upiid: '7876543210@ybl', id: '3'},
  {name: 'Masu', upiid: '1876543210@ybl', id: '4'},
  {name: 'Kasu', upiid: '2876543210@ybl', id: '5'},
];

const CryptoDeposit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {accesstoken, user} = useSelector(state => state.user);
  const [upioption, setUpiOption] = useState('1');
  const [upiVisible, setUpiVisible] = useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState(upiapidata[1]);

  const [amountval, setAmountval] = useState('');
  const [transactionval, setTransactionval] = useState('');
  const [remarkval, setRemarkval] = useState('');
  const [imageFileName, setImageFileName] = useState('Choose a file');

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

  const [imageSource, setImageSource] = useState(null);
  const [showProgressBar, setProgressBar] = useState(false);

 
  const submitDeposit = async () => {
    if (!amountval) {
      Toast.show({
        type: 'error',
        text1: 'Enter Deposit Amount',
      });
    } else if (!transactionval) {
      Toast.show({
        type: 'error',
        text1: 'Enter Transaction Number',
      });
    } else if (!imageSource) {
      Toast.show({
        type: 'error',
        text1: 'Add Transaction Screenshot',
      });
    } else {
      setProgressBar(true);
      try {
        const formData = new FormData();

        formData.append('amount', amountval);
        formData.append('transactionid', transactionval);
        formData.append('remark', remarkval);
        formData.append('paymenttype', 'Upi');
        formData.append('paymenttypeid', selectedUpiId.paymentId);
        formData.append('username', user.name);
        formData.append('userid', user.userId);
        formData.append('paymentstatus', 'Pending');
        formData.append('transactionType', 'Deposit');

        console.log('Image URI :: ' + imageSource.uri);

        if (imageSource) {
          formData.append('file', {
            uri: resizedImage.uri,
            type: mime.getType(resizedImage.uri),
            name: 'proj.jpg',
          });
        }

        // try {
        //   console.log('Started Compressing Image');
        //   const resizedImage = await ImageResizer.createResizedImage(
        //     imageSource.uri,
        //     1000, // Adjust the dimensions as needed
        //     1000, // Adjust the dimensions as needed
        //     'JPEG',
        //     100, // Image quality (0-100)
        //     0, // Rotation (0 = no rotation)
        //     null,
        //   );
        //   console.log('Compressed Image :: ' + resizedImage.size);

        //   if (resizedImage) {
        //     formData.append('receipt', {
        //       uri: resizedImage.uri,
        //       type: imageSource.type || 'image/jpeg', // Use original type if available
        //       name: imageSource.name || 'bank_receipt.jpg', // Use original name if available
        //     });
        //   }

        // } catch (error) {
        //   Toast.show({
        //     type: 'error',
        //     text1: 'Error resizing the image:',
        //     text2: error.message,
        //   });
        // }

        // formData.append('receipt', {
        //   uri: imageSource.uri,
        //   type: imageSource.type || 'image/jpeg', // Use original type if available
        //   name: imageSource.name || 'bank_receipt.jpg', // Use original name if available
        // });

        // Resize the image
        // try {
        //   console.log('Started Compressing Image');
        //   const resizedImage = await ImageResizer.createResizedImage(
        //     imageSource.uri,
        //     200, // Adjust the dimensions as needed
        //     200, // Adjust the dimensions as needed
        //     'JPEG',
        //     80, // Image quality (0-100)
        //     0, // Rotation (0 = no rotation)
        //     null,
        //   );

        //   console.log('Compressed Image :: ' + resizedImage.size);
        //   setImageSource(resizedImage);

        //   if (imageSource) {
        //     formData.append('file', {
        //       uri: resizedImage.uri,
        //       type: mime.getType(resizedImage.uri),
        //       name: 'proj.jpg',
        //     });
        //   }
        // } catch (error) {
        //   Toast.show({
        //     type: 'error',
        //     text1: 'Error resizing the image',
        //     text2: error,
        //   });
        //   // console.error('Error resizing the image:', error);
        // }

        console.log('Form data :: ' + JSON.stringify(formData));

        const response = await axios.post(UrlHelper.DEPOSIT_UPI_API, formData, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accesstoken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Transaction Image updated successfully:', response.data);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'UPI deposit request submitted successfully.',
        });
        navigation.goBack();
        setProgressBar(false);
      } catch (error) {
        console.log('Error during deposit:', error);
        if (error.response) {
          Toast.show({
            type: 'error',
            text1: error.response.data,
          });
        } else if (error.request) {
          Toast.show({
            type: 'error',
            text1: 'Request was made, but no response was received',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: error.message,
          });
        }
        setProgressBar(false);
      }
    }
  };

  // For Opening PhoneStorage
  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      if (doc) {
        console.log(doc);
        console.log(doc[0].uri);
        const ty = mime.getType(doc[0].uri);

        console.log('Image type :: ' + ty);
        console.log('Image type :: ' + doc[0].type);

        setImageSource({uri: doc[0].uri});
        setImageFileName(doc[0].name);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log('User cancelled the upload', err);
      else console.log(err);
    }
  };


  



  
  useEffect(() => {
    allTheDepositData();
  }, [isFocused, loadingAllData, allDepositdata]);

  const [loadingAllData, setLoadingAllData] = useState(false);
  const [allDepositdata, setAllDepositData] = useState([]);

  const allTheDepositData = async () => {
    try {
      setLoadingAllData(true);
      const {data} = await axios.get(UrlHelper.ALL_UPI_API, {
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

  return (
    <View style={{flex: 1}}>
      <Background />
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
              Crypto Deposit
              </GradientTextWhite>

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
                        source={require('../../../assets/image/crypto.png')}
                        resizeMode="cover"
                        style={{
                          height: 25,
                          width: 25,
                        }}
                      />
                    </View>
                    <GradientTextWhite style={styles.textStyleContent}>
                      UPI
                    </GradientTextWhite>
                    <GradientTextWhite style={styles.textStyleContent}>
                      {selectedUpiId.paymentId}
                    </GradientTextWhite>
                    <LinearGradient
                      colors={[COLORS.grayBg, COLORS.white_s]}
                      style={{borderRadius: 20, padding: 10}}>
                      <AntDesign
                        name={'downcircleo'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/** FOR UPI ID DEPOSIT OPTION */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {upiVisible &&
                allDepositdata.length !== 0 &&
                allDepositdata.map(item => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => settingUpiId(item)}>
                    <LinearGradient
                      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                      start={{x: 0, y: 0}} // start from left
                      end={{x: 1, y: 0}} // end at right
                      style={{
                        height: heightPercentageToDP(20),
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
                            flex: 1,
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
                              source={require('../../../assets/image/crypto.png')}
                              resizeMode="cover"
                              style={{
                                height: 25,
                                width: 25,
                              }}
                            />
                          </View>
                          <GradientTextWhite style={styles.textStyleContent}>
                            Paypal
                          </GradientTextWhite>
                          <GradientTextWhite style={styles.textStyleContent}>
                            {item.paymentId}
                          </GradientTextWhite>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            paddingEnd: heightPercentageToDP(2),
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
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: heightPercentageToDP(1),
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                          paddingHorizontal: heightPercentageToDP(2),
                          borderRadius: heightPercentageToDP(2),
                        }}>
                        <View
                          style={{
                            flex: 1,
                            gap: heightPercentageToDP(2),
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.copytitle} numberOfLines={2}>
                            UPI Holder Name
                          </Text>
                          <Text style={styles.copytitle}>UPI ID</Text>
                        </View>
                        <View
                          style={{
                            flex: 2,
                            gap: heightPercentageToDP(2),
                          }}>
                          <Text style={styles.copycontent} numberOfLines={2}>
                            {item.upiholdername}
                          </Text>
                          <Text style={styles.copycontent} numberOfLines={1}>
                            {item.upiid}
                          </Text>
                        </View>
                        <View style={{gap: heightPercentageToDP(0.5)}}>
                          <TouchableOpacity
                            onPress={() => copyToClipboard(item.name)}>
                            <LinearGradient
                              colors={[COLORS.lightWhite, COLORS.white_s]}
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
                          <TouchableOpacity
                            onPress={() => copyToClipboard(item.upiid)}>
                            <LinearGradient
                              colors={[COLORS.lightWhite, COLORS.white_s]}
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
                      Receipt
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

                    <View
                      style={{
                        marginBottom: heightPercentageToDP(5),
                        marginTop: heightPercentageToDP(2),
                      }}>
                      {false ? (
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
                </View>
              </ScrollView>
            )}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default CryptoDeposit;

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
