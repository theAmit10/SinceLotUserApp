import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import GradientTextWhite from '../../../components/helpercComponent/GradientTextWhite';
import Loading from '../../../components/helpercComponent/Loading';
import NoDataFound from '../../../components/helpercComponent/NoDataFound';

import {COLORS, FONT} from '../../../../assets/constants';
import Background from '../../../components/background/Background';
import moment from 'moment';
import {useGetHistoryQuery} from '../../../helper/Networkcall';

const UserTransactionHistory = ({route}) => {
  const {item: userdata} = route.params;
  const {accesstoken, user} = useSelector(state => state.user);
  const [expandedItems, setExpandedItems] = useState({});

  console.log('Accesstoken :: ' + accesstoken);
  console.log('User ID :: ' + user.userId);
  // console.log('User ID :: ' + JSON.stringify(userdata));

  const {
    data: historyapidatas,
    error,
    isLoading,
    refetch,
  } = useGetHistoryQuery({accesstoken: accesstoken, userId: userdata.userId});

  useFocusEffect(
    useCallback(() => {
      // Refetch the data when the screen is focused
      refetch();
    }, [refetch]),
  );

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDateTime = dateTimeString => {
    return moment(dateTimeString).format('MMMM DD, YYYY');
  };

  const [alertVisibleReceipt, setAlertVisibleReceipt] = useState(false);

  const showAlertReceipt = item => {
    setAlertVisibleReceipt(true);
  };

  const closeAlertReceipt = () => {
    setAlertVisibleReceipt(false);
  };

  const handleYesReceipt = () => {
    // Handle the Yes action here
    setAlertVisibleReceipt(false);
    console.log('Yes pressed');
  };

  function formatAmount(value) {
    if (typeof value === 'string') {
      value = parseFloat(value); // Convert string to float if necessary
    }

    // Check if the number has decimals
    if (value % 1 === 0) {
      return value; // Return as is if it's a whole number
    } else {
      return parseFloat(value.toFixed(1)); // Return with one decimal point if it has decimals
    }
  }

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
                {userdata.userId}
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
                {userdata.name}
              </Text>
            </View>

            <View style={{margin: heightPercentageToDP(2)}}>
              <GradientTextWhite style={styles.textStyle}>
                Transaction History
              </GradientTextWhite>

              {isLoading ? (
                <View
                  style={{
                    height: heightPercentageToDP(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Loading />
                </View>
              ) : historyapidatas?.transactions.length === 0 ? (
                <View>
                  <NoDataFound data={'No History Found'} />
                </View>
              ) : (
                <FlatList
                  data={historyapidatas?.transactions}
                  renderItem={({item}) => (
                    <LinearGradient
                      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                      start={{x: 0, y: 0}} // start from left
                      end={{x: 1, y: 0}} // end at right
                      style={{
                        justifyContent: 'flex-start',

                        borderRadius: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                      }}>
                      <TouchableOpacity
                        onPress={() => toggleItem(item._id)}
                        style={{
                          flex: 1,
                          borderTopLeftRadius: heightPercentageToDP(2),
                          borderTopEndRadius: heightPercentageToDP(2),
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            width: widthPercentageToDP(68),
                            flexDirection: 'row',
                            borderTopLeftRadius: heightPercentageToDP(2),
                            borderTopEndRadius: heightPercentageToDP(2),
                          }}>
                          <View
                            style={{
                              backgroundColor: COLORS.white_s,
                              padding: heightPercentageToDP(1.5),
                              borderRadius: heightPercentageToDP(1),
                              marginVertical: heightPercentageToDP(2),
                              marginHorizontal: heightPercentageToDP(1),
                            }}>
                            <Image
                              source={
                                item.transactionType === 'Deposit'
                                  ? require('../../../../assets/image/deposit.png')
                                  : require('../../../../assets/image/withdraw.png')
                              }
                              resizeMode="cover"
                              style={{
                                height: 25,
                                width: 25,
                                tintColor:
                                  item.transactionType === 'Deposit'
                                    ? COLORS.result_lightblue
                                    : item.transactionType === 'Withdraw'
                                    ? COLORS.orange
                                    : COLORS.green,
                              }}
                            />
                          </View>

                          <View style={{flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(1.6),
                                  color: COLORS.black,
                                }}>
                                {`Amount : \u00A0`}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Bold,
                                  fontSize: heightPercentageToDP(2),
                                  color: COLORS.black,
                                  width: '70%',
                                }}
                                numberOfLines={2}>
                                {formatAmount(item.amount)}{' '}
                                {userdata?.currency?.countrycurrencysymbol}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(1.8),
                                  color: COLORS.black,
                                }}>
                                {formatDateTime(item.createdAt)}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <View
                            style={{
                              width: '60%',
                              paddingHorizontal: 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <LinearGradient
                              colors={[COLORS.lightWhite, COLORS.white_s]}
                              style={styles.iconContainer}>
                              <AntDesign
                                name={
                                  item.paymentStatus === 'Completed'
                                    ? 'check'
                                    : item.paymentStatus === 'Cancelled'
                                    ? 'closecircleo'
                                    : 'clockcircleo'
                                }
                                size={heightPercentageToDP(2)}
                                color={
                                  item.paymentStatus === 'Completed'
                                    ? COLORS.green
                                    : item.paymentStatus === 'Cancelled'
                                    ? COLORS.red
                                    : COLORS.orange
                                }
                              />
                            </LinearGradient>
                            <Text
                              style={{
                                fontFamily: FONT.Montserrat_Regular,
                                color: COLORS.black,
                                fontSize: heightPercentageToDP(1.1),
                              }}>
                              {item.paymentStatus}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => toggleItem(item._id)}
                            style={{
                              width: '40%',
                              paddingHorizontal: 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginEnd: heightPercentageToDP(2),
                            }}>
                            <LinearGradient
                              colors={[COLORS.lightWhite, COLORS.white_s]}
                              style={styles.expandIconContainer}>
                              <Ionicons
                                name={
                                  expandedItems[item._id]
                                    ? 'remove-outline'
                                    : 'add-outline'
                                }
                                size={heightPercentageToDP(2)}
                                color={COLORS.darkGray}
                              />
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>

                      {expandedItems[item._id] && (
                        <>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: COLORS.white_s,
                              marginHorizontal: heightPercentageToDP(2),
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          />
                          <View
                            style={{
                              flex: 1,
                              borderBottomLeftRadius: heightPercentageToDP(2),
                              borderBottomEndRadius: heightPercentageToDP(2),
                              flexDirection: 'row',
                              padding: heightPercentageToDP(1),
                            }}>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailLabel}>
                                Payment{' '}
                                {item.transactionType === 'AdminUpdate'
                                  ? 'Type'
                                  : 'Method'}
                              </Text>
                              <Text style={styles.detailValue}>
                                {item.transactionType === 'AdminUpdate'
                                  ? `${item?.walletName} W. ${item.paymentType}`
                                  : item.paymentType}
                              </Text>
                            </View>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailLabel}>
                                {item.transactionType === 'Deposit'
                                  ? 'Transaction ID'
                                  : 'Transaction type'}
                              </Text>
                              <Text style={styles.detailValue}>
                                {item.transactionId
                                  ? item.transactionId
                                  : item.transactionType === 'Transfer'
                                  ? 'Game to Withdraw W.'
                                  : item.transactionType}
                              </Text>
                            </View>
                          </View>
                          {item.paymentupdatereceipt && (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  borderBottomLeftRadius:
                                    heightPercentageToDP(2),
                                  borderBottomEndRadius:
                                    heightPercentageToDP(2),
                                  flexDirection: 'row',
                                  padding: heightPercentageToDP(1),
                                }}>
                                <TouchableOpacity
                                  onPress={() => showAlertReceipt()}
                                  style={{
                                    ...styles.detailContainer,
                                    width: '90%',
                                  }}>
                                  <Text style={styles.detailLabel}>
                                    Receipt
                                  </Text>
                                  <Text style={styles.detailValue}>
                                    {item.paymentupdatereceipt
                                      ? 'Show Receipt'
                                      : ''}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <CustomReceiptViewer
                                visible={alertVisibleReceipt}
                                onClose={closeAlertReceipt}
                                onYes={handleYesReceipt}
                                data={item}
                                img={item.paymentupdatereceipt}
                              />
                            </>
                          )}

                          {item.paymentUpdateNote && (
                            <View
                              style={{
                                flex: 1,
                                borderBottomLeftRadius: heightPercentageToDP(2),
                                borderBottomEndRadius: heightPercentageToDP(2),
                                flexDirection: 'row',
                                padding: heightPercentageToDP(1),
                              }}>
                              <View
                                style={{
                                  ...styles.detailContainer,
                                  width: '90%',
                                }}>
                                <Text style={styles.detailLabel}>Note</Text>
                                <Text style={styles.detailValue}>
                                  {item.paymentUpdateNote}
                                </Text>
                              </View>
                            </View>
                          )}
                        </>
                      )}
                    </LinearGradient>
                  )}
                  keyExtractor={item => item._id.toString()}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  ListFooterComponent={() => (
                    <View
                      style={{
                        height: heightPercentageToDP(20),
                      }}></View>
                  )}
                />
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default UserTransactionHistory;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  iconContainer: {
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
  },
  expandIconContainer: {
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    width: '50%',
    justifyContent: 'space-evenly',
    paddingStart: heightPercentageToDP(2),
  },
  detailLabel: {
    fontFamily: FONT.Montserrat_Regular,
    color: COLORS.black,
    fontSize: heightPercentageToDP(2),
  },
  detailValue: {
    fontFamily: FONT.Montserrat_SemiBold,
    color: COLORS.black,
    fontSize: heightPercentageToDP(2),
  },
});
