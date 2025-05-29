import {
  FlatList,
  Image,
  ImageBackground,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import GradientTextWhite from '../../../components/helpercComponent/GradientTextWhite';
import {COLORS, FONT} from '../../../../assets/constants';
import {serverName} from '../../../redux/store';
import {
  useCreateOtherPaymentAccountMutation,
  useDeleteOtherPaymentAccountMutation,
  useDeleteUpiAccountMutation,
  useGetOtherPaymentNameQuery,
} from '../../../helper/Networkcall';
import Background from '../../../components/background/Background';
import UrlHelper from '../../../helper/UrlHelper';
import Loading from '../../../components/helpercComponent/Loading';

const AllOtherDepositPayment = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {accesstoken, user, partner} = useSelector(state => state.user);

  const [seletedItem, setSelectedItem] = useState('');

  const copyToClipboard = val => {
    Clipboard.setString(val);
    Toast.show({
      type: 'success',
      text1: 'Text Copied',
      text2: 'The text has been copied to your clipboard!',
    });
  };

  const [loadingAllData, setLoadingAllData] = useState(false);
  const [allDepositdata, setAllDepositData] = useState([]);

  useEffect(() => {
    allTheDepositData();
  }, [isFocused]);

  useEffect(() => {
    console.log(loadingAllData);
  }, [loadingAllData]);

  const [
    deleteOtherAccount,
    {isLoading: deleteIsLoading, isError: deleteIsError},
  ] = useDeleteOtherPaymentAccountMutation();

  const allTheDepositData = async () => {
    try {
      setLoadingAllData(true);
      const url = `${UrlHelper.PARTNER_OTHERPAYMENT_API}/${partner.rechargeModule}`;
      const {data} = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accesstoken}`,
        },
      });

      console.log('datat :: ' + JSON.stringify(data));
      setAllDepositData(data.otherList);
      setLoadingAllData(false);
    } catch (error) {
      setLoadingAllData(false);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
      console.log(error);
    } finally {
      setLoadingAllData(false);
    }
  };

  // FOR DELETING DATA

  const deletingData = async item => {
    console.log('Deleting Data');
    setSelectedItem(item._id);

    const res = await deleteOtherAccount({
      accesstoken: accesstoken,
      id: item._id,
    }).unwrap();

    allTheDepositData();

    Toast.show({type: 'success', text1: 'Success', text2: res.message});
  };

  const {
    isLoading: loadingOtherPayment,
    data: otherPaymentData,
    refetch: refetchOtherPayment,
  } = useGetOtherPaymentNameQuery({accesstoken});

  const [firstInputName, setFirstInputName] = useState('');
  const [secondInputName, setSecondInputName] = useState('');
  const [thirdInputName, setThirdInputName] = useState('');
  const [fourthInputName, setFourthInputName] = useState('');

  useEffect(() => {
    if (!loadingOtherPayment && otherPaymentData) {
      setFirstInputName(otherPaymentData?.inputNames?.firstInputName);
      setSecondInputName(otherPaymentData?.inputNames?.secondInputName);
      setThirdInputName(otherPaymentData?.inputNames?.thirdInputName);
      setFourthInputName(otherPaymentData?.inputNames?.fourthInputName);
    }
  }, [loadingOtherPayment, otherPaymentData]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../../../assets/image/tlwbg.jpg')}
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
                Other Deposit
              </GradientTextWhite>
            </View>

            {/** FOR UPI ID DEPOSIT OPTION */}
            {loadingAllData ? (
              <View
                style={{
                  flex: 1,
                }}>
                <Loading key={'No account found'} color={COLORS.white_s} />
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {allDepositdata.length !== 0 &&
                  allDepositdata.map(item => (
                    <TouchableOpacity key={item._id}>
                      <LinearGradient
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
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
                              <MaterialCommunityIcons
                                color={COLORS.black}
                                name="contactless-payment-circle"
                                size={heightPercentageToDP(3)}
                              />
                            </View>
                            <GradientTextWhite style={styles.textStyleContent}>
                              {item.paymentName
                                ? item.paymentName
                                : 'Other Payment'}
                            </GradientTextWhite>
                            {/* <GradientTextWhite style={styles.textStyleContent}>
                                {item.paymentId}
                              </GradientTextWhite> */}
                          </View>

                          <View
                            style={{
                              flex: 0.2,
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end',
                              paddingEnd: heightPercentageToDP(2),
                              flexDirection: 'row',
                              gap: heightPercentageToDP(2),
                            }}>
                            {/** DELETE BUTTON */}
                            {deleteIsLoading ? (
                              seletedItem === item._id ? (
                                <Loading />
                              ) : (
                                <TouchableOpacity
                                  onPress={() => deletingData(item)}>
                                  <LinearGradient
                                    colors={[COLORS.grayBg, COLORS.white_s]}
                                    style={{borderRadius: 10, padding: 5}}>
                                    <MaterialCommunityIcons
                                      name={'delete'}
                                      size={heightPercentageToDP(3)}
                                      color={COLORS.darkGray}
                                    />
                                  </LinearGradient>
                                </TouchableOpacity>
                              )
                            ) : (
                              <TouchableOpacity
                                onPress={() => deletingData(item)}>
                                <LinearGradient
                                  colors={[COLORS.grayBg, COLORS.white_s]}
                                  style={{borderRadius: 10, padding: 5}}>
                                  <MaterialCommunityIcons
                                    name={'delete'}
                                    size={heightPercentageToDP(3)}
                                    color={COLORS.darkGray}
                                  />
                                </LinearGradient>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: heightPercentageToDP(1),
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
                            {item?.firstInputName && (
                              <Text style={styles.copytitle} numberOfLines={2}>
                                {item?.firstInputName}
                              </Text>
                            )}

                            {item?.secondInputName && (
                              <Text style={styles.copytitle}>
                                {item?.secondInputName}
                              </Text>
                            )}

                            {item?.thirdInputName && (
                              <Text style={styles.copytitle}>
                                {item?.thirdInputName}
                              </Text>
                            )}
                          </View>
                          <View
                            style={{
                              flex: 2,
                              gap: heightPercentageToDP(2),
                            }}>
                            {item.firstInput && (
                              <Text
                                style={styles.copycontent}
                                numberOfLines={2}>
                                {item.firstInput}
                              </Text>
                            )}

                            {item.secondInput && (
                              <Text
                                style={styles.copycontent}
                                numberOfLines={1}>
                                {item.secondInput}
                              </Text>
                            )}

                            {item.thirdInput && (
                              <Text
                                style={styles.copycontent}
                                numberOfLines={1}>
                                {item.thirdInput}
                              </Text>
                            )}
                          </View>
                          <View
                            style={{
                              height: '100%',
                              width: '10%',
                              justifyContent: 'space-between',
                              alignItems: 'flex-end',
                            }}>
                            {item.firstInput && (
                              <TouchableOpacity
                                onPress={() =>
                                  copyToClipboard(item.firstInput)
                                }>
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
                            )}
                            {item.secondInput && (
                              <TouchableOpacity
                                onPress={() =>
                                  copyToClipboard(item.secondInput)
                                }>
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
                            )}

                            {item.thirdInput && (
                              <TouchableOpacity
                                onPress={() =>
                                  copyToClipboard(item.thirdInput)
                                }>
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
                            )}
                          </View>
                        </View>

                        {/** QR code */}
                        {item.qrcode && (
                          <View
                            style={{
                              flex: 2,
                              gap: heightPercentageToDP(2),
                              margin: heightPercentageToDP(2),
                            }}>
                            <View
                              style={{
                                backgroundColor: COLORS.white_s,
                                padding: heightPercentageToDP(1),
                                borderRadius: heightPercentageToDP(1),
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {item.qrcode ? (
                                <Image
                                  source={{
                                    uri: `${serverName}/uploads/otherpaymentqrcode/${item.qrcode}`,
                                  }}
                                  resizeMode="cover"
                                  style={{
                                    height: 150,
                                    width: 150,
                                  }}
                                />
                              ) : (
                                <MaterialCommunityIcons
                                  color={COLORS.black}
                                  name="contactless-payment-circle"
                                  size={heightPercentageToDP(10)}
                                />
                              )}
                            </View>
                          </View>
                        )}

                        {item.paymentnote && (
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
                                flex: 1,
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
                                paddingEnd: heightPercentageToDP(1),
                              }}>
                              <Text style={styles.copycontent}>
                                {item.paymentnote}
                              </Text>
                            </View>
                          </View>
                        )}

                        {/** FOR ACTIVATION STATUS */}
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            padding: heightPercentageToDP(2),
                            gap: heightPercentageToDP(1),
                          }}>
                          <View
                            style={{
                              flex: 1,
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                            }}>
                            <Text
                              style={{
                                ...styles.copytitle,
                                paddingLeft: heightPercentageToDP(2),
                              }}
                              numberOfLines={2}>
                              Activation Status
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 2,
                              backgroundColor:
                                item.paymentStatus === 'Pending'
                                  ? COLORS.orange
                                  : item.paymentStatus === 'Approved'
                                  ? COLORS.green
                                  : COLORS.red,
                              width: widthPercentageToDP(90),
                              padding: heightPercentageToDP(1),
                              borderRadius: heightPercentageToDP(4),
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.copycontent,
                                {color: COLORS.white_s},
                              ]}>
                              {item.paymentStatus}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}

            {/** CREATE A NEW ACCOUNT */}
            <View
              style={{
                marginBottom: heightPercentageToDP(5),
                marginTop: heightPercentageToDP(2),
              }}>
              {!loadingAllData && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateOther')}
                  style={{
                    backgroundColor: COLORS.blue,
                    padding: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(1),
                    margin: heightPercentageToDP(2),
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: FONT.Montserrat_Regular,
                    }}>
                    Create Other
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default AllOtherDepositPayment;

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
