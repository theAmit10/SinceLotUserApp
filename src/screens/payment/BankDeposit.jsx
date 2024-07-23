
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
    {name: 'Wasu', acccontno: '9876543210@ybl', id: '1',ifsccode: '837377SBIco',bankname: 'SBI'},
    {name: 'Aman', acccontno: '8876543210@ybl', id: '2',ifsccode: '037377SBIco',bankname: 'PND'},
    {name: 'Zasu', acccontno: '7876543210@ybl', id: '3',ifsccode: '537377SBIco',bankname: 'HDFC'},
    {name: 'Masu', acccontno: '1876543210@ybl', id: '4',ifsccode: '137377SBIco',bankname: 'SBI'},
    {name: 'Kasu', acccontno: '2876543210@ybl', id: '5',ifsccode: '437377SBIco',bankname: 'SBI'},
  ];
  
  const BankDeposit = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {accesstoken} = useSelector(state => state.user);
    const [upioption, setUpiOption] = useState('1');
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
  
    const [imageSource, setImageSource] = useState(null);
    const [showProgressBar, setProgressBar] = useState(false);
  
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
          setImageSource({ uri: doc[0].uri });
          setImageFileName(doc[0].name);
        }
  
      } catch (err) {
        if (DocumentPicker.isCancel(err))
          console.log('User cancelled the upload', err);
        else console.log(err);
      }
    };
  
    // for uploading Transaction content
    const submitDeposit = async () => {
      // if (!amountVal) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Enter Deposit Amount',
      //   });
      //   // console.error('Enter amount');
      // } else if (!transactionVal) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Enter Transaction Number',
      //   });
      //   // console.error('Enter transaction number');
      // } else if (!imageSource) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Add Transaction Screenshot',
      //   });
      //   // console.error('Add Transaction Screenshot');
      // } else {
      //   setProgressBar(true);
  
      //   try {
      //     const bearerToken =
      //       'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMGE5ZTY1YTM2ZWQ2NDNlOWYzZDRhOGNlZTAwMDQ3Y2U1ZTE1ZDQyYWRjNzVmZTQ0NjBjMTBjNjFjOTVhOWY3NzA4NmRmYTYyOWQ3N2JlZTciLCJpYXQiOjE2OTgwNjIzMTkuNzQ2OTcxLCJuYmYiOjE2OTgwNjIzMTkuNzQ2OTc1LCJleHAiOjE3Mjk2ODQ3MTkuNzQ2MTAzLCJzdWIiOiIxMCIsInNjb3BlcyI6W119.TkRGB7JiajYr_zVD30uiT30Xe1XOKFdTR5Tdhp9w8V7gsXS1nVPWDhKzg5g4H0aZwgAs_ROmrrk32PcsQXQF4mkdAZDzxJAZJOjhsAUpzHXnmF_o4ls-YejbqV1P1cvpLIJNYm5TUV2c4H2huC4QKqD3B6Cb_p8t49G0UdB8Hl7xd39A4TqWxsbTBi_GqrX6Hm33Tmf7VvRwYEiOMpKN91lVwSRWJISMMV9q0ndKvbMerw5DtHKdAa4DWlalBOmkvRY5qJzAmYBV9-5bczKFJ1IfKtHV7072q08Ie1J7IVcXoLwSmjxtodd55PN0YCE8mCbY65qLCtD0MVTYHhQMODVpIkFz9av37veldCqcaATSzh_bkD4M1TyzVfzQ9y5f-9GW4n1DFOQ9UTGIe0NQxL33qbEyJVvsDbt4Zm_moF_MrxFPS6ZpRcuy7DYTWIgF1rMDBsAKnmHdySClsXFQFnueiVwZ3ceAf9kNCf9u1mkNR1-FTqcvm6ZQwELe5P4Nz9Y8oRMvvIDA6egK7wZi5w2iiycoTkK8m_H7yNZ5I585_a1ebL9Qx46FHd3ujNi1nIELocn7u89Y0MN_RwgyGWJ4JuP2IZatB7wrU9Be6K3mCdNmbLbZlbnN4lC2FqSFflg94jhh7VGUrFqcggMxkYr-BaY0NR8PzULK_3wHta4';
  
      //     const formData = new FormData();
      //     formData.append('payment_method_id', 3);
      //     formData.append('amount', amountVal);
      //     formData.append('transaction_id', transactionVal);
      //     // formData.append('bank_receipt', imageSource);
      //     formData.append('remarks', remarkVal);
      //     formData.append('bank_id', selectedBankAccount);
      //     formData.append('currency', 'INR');
  
      //     console.log('Image URI :: ' + imageSource.uri);
  
      //     // Resize the image
      //     try {
      //       console.log('Started Compressing Image');
      //       const resizedImage = await ImageResizer.createResizedImage(
      //         imageSource.uri,
      //         1000, // Adjust the dimensions as needed
      //         1000, // Adjust the dimensions as needed
      //         'JPEG',
      //         100, // Image quality (0-100)
      //         0, // Rotation (0 = no rotation)
      //         null,
      //       );
  
      //       console.log('Compressed Image :: ' + resizedImage.size);
      //       setImageSource(resizedImage);
  
      //       if (imageSource) {
      //         formData.append('bank_receipt', {
      //           uri: imageSource.uri,
      //           type: 'image/jpeg',
      //           name: 'bank_receipt.jpg',
      //         });
      //       }
      //     } catch (error) {
      //       // console.error('Error resizing the image:', error);
      //       Toast.show({
      //         type: 'error',
      //         text1: 'Error resizing the image:',
      //         text2: error,
      //       });
      //     }
  
      //     const response = await axios.post(URLHelper.DEPOSIT_API, formData, {
      //       headers: {
      //         userapisecret: 'h0vWu6MkInNlWHJVfIXmHbIbC66cQvlbSUQI09Whbp',
      //         Authorization: `Bearer ${ACCESS_TOKEN.data}`,
      //         'Content-Type': 'multipart/form-data',
      //       },
      //     });
  
      //     console.log('Transaction Image updated successfully:', response.data);
  
      //     // if (response.data.status == 'true') {
      //       Toast.show({
      //         type: 'success',
      //         text1: 'Success',
      //         text2: 'UPI deposit request submitted successfully.',
      //       });
      //       navigation.goBack();
      //     // } else {
      //     //   Toast.show({
      //     //     type: 'error',
      //     //     text1: 'Something went wrong',
      //     //     text2: response.data.message
      //     //   });
      //     // }
      //     // console.warn('Transaction Image updated successfully:');
      //     setProgressBar(false);
  
      //   } catch (error) {
      //     if (error.response) {
      //       Toast.show({
      //         type: 'error',
      //         text1: error.response.data,
      //       });
      //     } else if (error.request) {
      //       Toast.show({
      //         type: 'error',
      //         text1: 'Request was made, but no response was received',
      //       });
      //     } else {
      //       Toast.show({
      //         type: 'error',
      //         text1: error.message,
      //       });
      //     }
      //   }
      // }
    };


    // TO GET ALL THE ADMIN BANK

    const isFocused = useIsFocused();

    useEffect(() => {
      // dispatch(loadProfile(accesstoken));
      allTheDepositData();
    }, [isFocused, loadingAllData, allDepositdata]);
  
    const [loadingAllData, setLoadingAllData] = useState(false);
    const [allDepositdata, setAllDepositData] = useState([]);
  
    const allTheDepositData = async () => {
      try {
        setLoadingAllData(true);
        const {data} = await axios.get(UrlHelper.ALL_BANK_API, {
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
                  Bank Deposit
                </GradientTextWhite>
                <TouchableOpacity onPress={toggleUpiOptionView}>
                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
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
                    <GradientTextWhite style={styles.textStyleContent}>
                      {selectedUpiId.id}
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
              </View>
  
              {/** FOR UPI ID DEPOSIT OPTION */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {upiVisible &&
                  upiapidata.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => settingUpiId(item)}>
                      <LinearGradient
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                        style={{
                          height: heightPercentageToDP(34),
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
                            <GradientTextWhite style={styles.textStyleContent}>
                              Bank
                            </GradientTextWhite>
                            <GradientTextWhite style={styles.textStyleContent}>
                              {item.id}
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
                                  selectedUpiId.id === item.id
                                    ? 'checkcircle'
                                    : 'checkcircleo'
                                }
                                size={heightPercentageToDP(3)}
                                color={
                                  selectedUpiId.id === item.id
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
                            paddingHorizontal: heightPercentageToDP(1),
                            borderRadius: heightPercentageToDP(2),
                          }}>
                          <View
                            style={{
                              flex: 1,
                              gap: heightPercentageToDP(2),
                              justifyContent: 'space-between',
                             
                            }}>

                            <Text style={styles.copytitle}>Bank Name</Text>
                            <Text style={styles.copytitle} numberOfLines={2}>
                              Account Holder Name
                            </Text>
                            <Text style={styles.copytitle}>Account No.</Text>
                            <Text style={styles.copytitle}>IFSC Code</Text>
                          </View>
                          <View
                            style={{
                              flex: 2,
                              gap: heightPercentageToDP(2),
                         
                              justifyContent: 'space-between'
                                
                            }}>
                            <Text style={styles.copycontent} numberOfLines={2}>
                              {item.bankname}
                            </Text>
                            <Text style={styles.copycontent} numberOfLines={2}>
                              {item.name}
                            </Text>
                            <Text style={styles.copycontent} numberOfLines={1}>
                              {item.acccontno}
                            </Text>
                            <Text style={styles.copycontent} numberOfLines={1}>
                              {item.ifsccode}
                            </Text>
                          </View>
                          <View style={{gap: heightPercentageToDP(0.5)}}>
                          <TouchableOpacity
                              onPress={() => copyToClipboard(item.bankname)}>
                              <LinearGradient
                                colors={[COLORS.lightWhite, COLORS.white_s]}
                                style={{borderRadius: 20, padding: 10}}>
                                <AntDesign
                                  name={'copy1'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.darkGray}
                                />
                              </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => copyToClipboard(item.name)}>
                              <LinearGradient
                                colors={[COLORS.lightWhite, COLORS.white_s]}
                                style={{borderRadius: 20, padding: 10}}>
                                <AntDesign
                                  name={'copy1'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.darkGray}
                                />
                              </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => copyToClipboard(item.acccontno)}>
                              <LinearGradient
                                colors={[COLORS.lightWhite, COLORS.white_s]}
                                style={{borderRadius: 20, padding: 10}}>
                                <AntDesign
                                  name={'copy1'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.darkGray}
                                />
                              </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => copyToClipboard(item.ifsccode)}>
                              <LinearGradient
                                colors={[COLORS.lightWhite, COLORS.white_s]}
                                style={{borderRadius: 20, padding: 10}}>
                                <AntDesign
                                  name={'copy1'}
                                  size={heightPercentageToDP(3)}
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
  
              {
                  !upiVisible &&
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
                        style={{
                          borderRadius: heightPercentageToDP(2),
                        }}>
                        <TextInput
                          underlineColor="transparent"
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
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                        style={{
                          borderRadius: heightPercentageToDP(2),
                        }}>
                        <TextInput
                          underlineColor="transparent"
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
                          Choose a file
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
                        style={{
                          borderRadius: heightPercentageToDP(2),
                        }}>
                        <TextInput
                          underlineColor="transparent"
                          placeholderTextColor={COLORS.black}
                          style={{
                            backgroundColor: 'transparent',
                            fontFamily: FONT.Montserrat_Bold,
                            color: COLORS.black,
                            minHeight: heightPercentageToDP(10)
                          }}
                          multiline={true}
                          value={amountval}
                          numberOfLines={4}
                          onChangeText={text => setAmountval(text)}
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
              }
  
             
  
            
            </View>
          </ImageBackground>
        </View>
      </View>
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
      height: heightPercentageToDP(5)
    },
    copytitle: {
      fontSize: heightPercentageToDP(2),
      color: COLORS.black,
      fontFamily: FONT.Montserrat_SemiBold,
      height: heightPercentageToDP(5)
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
  
