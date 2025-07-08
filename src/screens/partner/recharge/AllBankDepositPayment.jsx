import {
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
import Background from '../../../components/background/Background';
import {COLORS, FONT} from '../../../../assets/constants';
import GradientTextWhite from '../../../components/helpercComponent/GradientTextWhite';
import Clipboard from '@react-native-clipboard/clipboard';
import Loading from '../../../components/helpercComponent/Loading';
import axios from 'axios';
import UrlHelper from '../../../helper/UrlHelper';
import {useDeleteBankAccountMutation} from '../../../helper/Networkcall';

const AllBankDepositPayment = () => {
  const navigation = useNavigation();

  const {accesstoken, user, partner} = useSelector(state => state.user);

  const copyToClipboard = val => {
    Clipboard.setString(val);
    Toast.show({
      type: 'success',
      text1: 'Text Copied',
      text2: 'The text has been copied to your clipboard!',
    });
  };

  // TO GET ALL THE ADMIN BANK
  const isFocused = useIsFocused();

  useEffect(() => {
    allTheDepositData();
  }, [isFocused, loadingAllData, allDepositdata]);

  const [loadingAllData, setLoadingAllData] = useState(false);
  const [allDepositdata, setAllDepositData] = useState([]);

  const [seletedItem, setSelectedItem] = useState('');

  const [
    deleteBankAccount,
    {isLoading: deleteIsLoading, isError: deleteIsError},
  ] = useDeleteBankAccountMutation();

  const allTheDepositData = async () => {
    try {
      const url = `${UrlHelper.PARTNER_BANK_API}/${partner.rechargeModule}`;
      setLoadingAllData(true);
      const {data} = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accesstoken}`,
        },
      });

      console.log('datat :: ' + JSON.stringify(data));
      setAllDepositData(data.bankList);
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

  // FOR DELETING DATA

  const deletingData = async item => {
    console.log('Deleting Data');
    setSelectedItem(item._id);

    const res = await deleteBankAccount({
      accesstoken: accesstoken,
      id: item._id,
    }).unwrap();

    allTheDepositData();

    Toast.show({type: 'success', text1: 'Success', text2: res.message});
  };

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
                Bank Deposit
              </GradientTextWhite>
            </View>

            {/** FOR UPI ID DEPOSIT OPTION */}

            {loadingAllData ? (
              <View
                style={{
                  flex: 1,
                }}>
                <Loading key={'No account found'} />
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
                                source={require('../../../../assets/image/bank.png')}
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
                              {item.paymentId}
                            </GradientTextWhite> */}
                          </View>

                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end',
                              paddingEnd: heightPercentageToDP(2),
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
                            <Text style={styles.copytitle}>Bank Name</Text>
                          </View>
                          <View
                            style={{
                              flex: 2,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              paddingHorizontal: heightPercentageToDP(1),
                            }}>
                            <Text style={styles.copycontent} numberOfLines={2}>
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
                              onPress={() => copyToClipboard(item.bankname)}>
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
                              paddingHorizontal: heightPercentageToDP(1),
                            }}>
                            <Text style={styles.copycontent} numberOfLines={2}>
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
                            <Text style={styles.copytitle}>Account No.</Text>
                          </View>
                          <View
                            style={{
                              flex: 2,

                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              paddingHorizontal: heightPercentageToDP(1),
                            }}>
                            <Text style={styles.copycontent} numberOfLines={2}>
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
                              <Text style={styles.copytitle}>Swift Code</Text>
                            </View>
                            <View
                              style={{
                                flex: 2,

                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                paddingHorizontal: heightPercentageToDP(1),
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
                                onPress={() => copyToClipboard(item.swiftcode)}>
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
                              paddingHorizontal: heightPercentageToDP(1),
                            }}>
                            <Text style={styles.copycontent} numberOfLines={2}>
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
                              onPress={() => copyToClipboard(item.ifsccode)}>
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
                            }}>
                            <Text style={styles.copycontent}>
                              {item.paymentnote}
                            </Text>
                          </View>
                        </View>
                        {/** FOR ACTIVATION STATUS */}
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            paddingBottom: heightPercentageToDP(2),
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
                              numberOfLines={1}>
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

            <View
              style={{
                margin: heightPercentageToDP(2),
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateBank')}
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
                  Add new bank details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default AllBankDepositPayment;

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
    height: heightPercentageToDP(5),
  },
  copytitle: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_SemiBold,
    height: heightPercentageToDP(5),
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
