import {
  FlatList,
  Image,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import GradientText from '../../components/helpercComponent/GradientText';
import Loading from '../../components/helpercComponent/Loading';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';
import {
  useGetAllRechargeQuery,
  useUpdateDepositPaymentStatusMutation,
} from '../../helper/Networkcall';
import CustomReceiptViewer from '../../components/helpercComponent/CustomReceiptViewer';
import CustomAlertForDeposit from '../../components/helpercComponent/CustomAlertForDeposit';

export const multiplyStringNumbers = (str1, str2) => {
  // Convert the strings to numbers
  const num1 = Number(str1);
  const num2 = Number(str2);

  // Check if the conversion was successful
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both inputs must be valid numbers');
  }

  // Multiply the numbers and return the result
  return num1 * num2;
};

const AllRecharge = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken, user, partner} = useSelector(state => state.user);
  const [filteredData, setFilteredData] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const handleSearch = text => {
    const filtered = times.filter(item =>
      item.lottime.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  // const toggleItem = id => {
  //   setExpandedItems(prev => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };

  const {
    isLoading: allRechargeLoading,
    data: allRechargeData,
    error: allRechargeError,
    refetch,
  } = useGetAllRechargeQuery({
    accesstoken,
    userId: user.userId,
  });

  useEffect(() => {
    if (!allRechargeLoading && allRechargeData) {
      console.log('Getting all reacharge data');
      console.log('All Recharge Data :: ' + JSON.stringify(allRechargeData));
      setFilteredData(allRechargeData.recharges);
    }
  }, [allRechargeData, allRechargeLoading, allRechargeError]);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateKey, setUpdateKey] = useState(0);

  const [seletedImageId, setSelectedImageId] = useState('');

  const [page, setPage] = useState(1); // Current page
  const [dataList, setDataList] = useState([]); // List of all data
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // const {isLoading, data, isError, refetch} = useGetAllDepositQuery({
  //   accesstoken,
  //   page, // current page number
  //   limit: 100, // number of items per page
  // });

  // FOR UPDATING PAYMENT STATUS
  const [
    updateDepositPaymentStatus,
    {isLoading: updateStatusIsLoading, error: updateStatusError},
  ] = useUpdateDepositPaymentStatusMutation();

  const isFocused = useIsFocused();

  useEffect(() => {
    refetch();
  }, [updateKey, isFocused]);

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // useEffect(() => {
  //   if (!isLoading) {
  //     console.log('USE Effect running');
  //     setFilteredData(data?.deposits);
  //   }
  // }, [isLoading, isFocused, refetch, updateKey]);

  // const handleSearch = text => {
  //   if (data) {
  //     const filtered = data.deposits.filter(item =>
  //       item.userId.toLowerCase().includes(text.toLowerCase()),
  //     );
  //     setFilteredData(filtered);
  //   }
  // };

  // FOR ACCEPTING

  const acceptingData = async (
    item,
    paymentUpdateNote,
    imageSource,
    amount,
  ) => {
    console.log('Accepting Data');

    setSelectedItem(item._id);
    if (isNaN(amount)) {
      Toast.show({
        type: 'error',
        text1: 'Invaid amount',
        text2: 'Enter valid amount',
      });
    } else if (paymentUpdateNote && imageSource) {
      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('paymentStatus', 'Completed');
      formData.append('paymentUpdateNote', paymentUpdateNote);
      formData.append('amount', amount);

      formData.append('paymentupdatereceipt', {
        uri: imageSource[0].uri,
        name: imageSource[0].name,
        type: imageSource[0].type || 'image/jpeg', // Default to 'image/jpeg' if type is null
      });

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);
      if (updateStatusError) {
        console.log(updateStatusError);
      }
    } else if (paymentUpdateNote) {
      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('paymentStatus', 'Completed');
      formData.append('amount', amount);
      formData.append('paymentUpdateNote', paymentUpdateNote);

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);
      if (updateStatusError) {
        console.log(updateStatusError);
      }
    } else if (imageSource) {
      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('paymentStatus', 'Completed');
      formData.append('amount', amount);
      formData.append('paymentupdatereceipt', {
        uri: imageSource[0].uri,
        name: imageSource[0].name,
        type: imageSource[0].type || 'image/jpeg', // Default to 'image/jpeg' if type is null
      });

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);
    } else {
      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('amount', amount);
      formData.append('paymentStatus', 'Completed');

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);

      if (updateStatusError) {
        console.log(updateStatusError);
      }
    }
  };

  // FOR CANCELLING

  const cancellingData = async (
    item,
    paymentUpdateNote,
    imageSource,
    amount,
  ) => {
    console.log('Cancelling Data');
    setSelectedItem(item._id);
    if (isNaN(amount)) {
      Toast.show({
        type: 'error',
        text1: 'Invaid amount',
        text2: 'Enter valid amount',
      });
    } else if (paymentUpdateNote && imageSource) {
      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('paymentStatus', 'Cancelled');
      formData.append('paymentUpdateNote', paymentUpdateNote);
      formData.append('amount', amount);
      formData.append('paymentupdatereceipt', {
        uri: imageSource[0].uri,
        name: imageSource[0].name,
        type: imageSource[0].type || 'image/jpeg', // Default to 'image/jpeg' if type is null
      });

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);
    } else if (paymentUpdateNote) {
      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('paymentStatus', 'Cancelled');
      formData.append('amount', amount);
      formData.append('paymentUpdateNote', paymentUpdateNote);

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);
    } else if (imageSource) {
      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('paymentStatus', 'Cancelled');
      formData.append('amount', amount);
      formData.append('paymentupdatereceipt', {
        uri: imageSource[0].uri,
        name: imageSource[0].name,
        type: imageSource[0].type || 'image/jpeg', // Default to 'image/jpeg' if type is null
      });

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);
    } else {
      // const body = {
      //   transactionId: item._id,
      //   paymentStatus: "Completed",
      // };

      const formData = new FormData();
      formData.append('transactionId', item._id);
      formData.append('amount', amount);
      formData.append('paymentStatus', 'Cancelled');

      console.log('FORM DATA :: ' + JSON.stringify(formData));

      const res = await updateDepositPaymentStatus({
        accesstoken: accesstoken,
        body: formData,
      }).unwrap();

      await refetch();

      Toast.show({type: 'success', text1: 'Success', text2: res.message});
      setUpdateKey(prevKey => prevKey + 1);
    }
  };

  const [alertVisibleAccepted, setAlertVisibleAccepted] = useState(false);
  const [alertVisibleRejected, setAlertVisibleRejected] = useState(false);

  const showAlertAccepted = item => {
    setAlertVisibleAccepted(true);
    setSelectedItemId(item._id);
    setSelectedItem(item);

    // console.log("Transaction :: "+JSON.stringify(item))
  };

  const closeAlertAccepted = () => {
    setAlertVisibleAccepted(false);
  };

  const handleYesAccepted = ({paymentUpdateNote, imageSource, amount}) => {
    // Handle the Yes action here
    setAlertVisibleAccepted(false);
    acceptingData(selectedItem, paymentUpdateNote, imageSource, amount);
    console.log('Yes pressed');
  };

  const [calculatedAmount, setCalculatedAmount] = useState(null);
  const [usercountry, setUserCountry] = useState(null);

  const showAlertRejected = item => {
    setAlertVisibleRejected(true);
    setSelectedItemId(item._id);
    setSelectedItem(item);

    const calculatedAmount = item.amount;

    // Set the calculated amount and country
    setCalculatedAmount(calculatedAmount);
    setUserCountry(item.currency);

    console.log('Selceted data');
    console.log(calculatedAmount);
    console.log(JSON.stringify(usercountry));
  };

  const closeAlertRejected = () => {
    setAlertVisibleRejected(false);
  };

  const handleYesRejected = ({paymentUpdateNote, imageSource, amount}) => {
    // Handle the Yes action here
    setAlertVisibleRejected(false);
    cancellingData(selectedItem, paymentUpdateNote, imageSource, amount);
    console.log('Yes pressed');
  };

  //  FOR SHOWING RECEIPT

  const [alertVisibleReceipt, setAlertVisibleReceipt] = useState(false);

  const showAlertReceipt = item => {
    setSelectedImageId(item._id);
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
    <MainBackgroundWithoutScrollview title={'All Recharge'}>
      <View
        style={{
          height: heightPercentageToDP(7),
          flexDirection: 'row',
          backgroundColor: COLORS.white_s,
          alignItems: 'center',
          paddingHorizontal: heightPercentageToDP(2),
          borderRadius: heightPercentageToDP(1),
          marginHorizontal: heightPercentageToDP(1),
        }}>
        <Fontisto
          name={'search'}
          size={heightPercentageToDP(3)}
          color={COLORS.darkGray}
        />
        <TextInput
          style={{
            marginStart: heightPercentageToDP(1),
            flex: 1,
            fontFamily: FONT.Montserrat_Regular,
            fontSize: heightPercentageToDP(2.5),
            color: COLORS.black,
          }}
          placeholder="Search for User"
          placeholderTextColor={COLORS.black}
          label="Search"
          onChangeText={handleSearch}
        />
      </View>
      {/** Content Container */}

      <View
        style={{
          flex: 1,
          padding: heightPercentageToDP(1),
        }}>
        <FlatList
          data={filteredData}
          renderItem={({item, index}) => {
            const calculatedAmount = item.amount;
            const usercountry = item.currency;
            const paymentType = item.paymentType;

            return (
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
                  style={styles.paymentOption}
                  onPress={() => toggleItem(item._id)}>
                  <View
                    style={{
                      flex: 1,
                      height: '100%',
                      paddingEnd: heightPercentageToDP(2),
                    }}>
                    <View style={styles.topContainer}>
                      <View
                        style={{
                          flex: 0.5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.titleRegular}>User ID</Text>
                        <Text style={styles.titleBold}>{item.userId}</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.titleRegular}>Amount</Text>
                        <Text style={styles.titleBold} numberOfLines={1}>
                          {item.convertedAmount} INR
                        </Text>
                      </View>
                      {/* <View
                        style={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.titleRegular}>Status</Text>
                        <Text style={styles.titleBold} numberOfLines={1}>
                          Pending
                        </Text>
                      </View> */}
                      {/** Right View */}
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        {updateStatusIsLoading &&
                        item._id === selectedItemId ? (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Loading />
                          </View>
                        ) : (
                          <>
                            {item.paymentStatus === 'Pending' && (
                              <TouchableOpacity
                                onPress={() => showAlertAccepted(item)}
                                style={{
                                  width: '40%',
                                  paddingHorizontal: 4,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <LinearGradient
                                  colors={[COLORS.lightWhite, COLORS.white_s]}
                                  style={styles.iconContainer}>
                                  <AntDesign
                                    name={'check'}
                                    size={heightPercentageToDP(2)}
                                    color={COLORS.green}
                                  />
                                </LinearGradient>
                              </TouchableOpacity>
                            )}

                            {/** PAYMENT STATUS TEXT */}
                            {item.paymentStatus === 'Pending' ? (
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  color: COLORS.black,
                                  fontSize: heightPercentageToDP(1.2),
                                  textAlignVertical: 'center',
                                  alignSelf: 'center',
                                }}>
                                {item.paymentStatus}
                              </Text>
                            ) : item.paymentStatus === 'Completed' ? (
                              <View
                                style={{
                                  backgroundColor: COLORS.green,
                                  borderRadius: heightPercentageToDP(1),
                                  margin: heightPercentageToDP(2),
                                  alignSelf: 'center',
                                  padding: heightPercentageToDP(1),
                                  flex: 1, // Ensure the view takes up space if necessary
                                }}>
                                <Text
                                  style={{
                                    fontFamily: FONT.Montserrat_SemiBold,
                                    color: COLORS.white_s,
                                    fontSize: heightPercentageToDP(1.5),
                                    textAlignVertical: 'center',
                                    textAlign: 'center',
                                  }}>
                                  {item.paymentStatus}
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={{
                                  flex: 1,
                                  backgroundColor: COLORS.red,
                                  borderRadius: heightPercentageToDP(2),
                                  margin: heightPercentageToDP(2),
                                  alignSelf: 'center',
                                  padding: heightPercentageToDP(1),
                                }}>
                                <Text
                                  style={{
                                    fontFamily: FONT.Montserrat_SemiBold,
                                    color: COLORS.white_s,
                                    fontSize: heightPercentageToDP(1.5),
                                    textAlignVertical: 'center',
                                    textAlign: 'center',
                                  }}>
                                  {item.paymentStatus}
                                </Text>
                              </View>
                            )}

                            {selectedItemId === item._id && (
                              <>
                                {/** FOR ACCEPTING */}
                                <CustomAlertForDeposit
                                  visible={alertVisibleAccepted}
                                  onClose={closeAlertAccepted}
                                  onYes={handleYesAccepted}
                                  defaultAmount={calculatedAmount}
                                  usercountry={usercountry}
                                  paymentType={paymentType}
                                />

                                {/** FOR REJECTING */}
                                <CustomAlertForDeposit
                                  visible={alertVisibleRejected}
                                  onClose={closeAlertRejected}
                                  onYes={handleYesRejected}
                                  defaultAmount={calculatedAmount}
                                  usercountry={usercountry}
                                  paymentType={paymentType}
                                />
                              </>
                            )}

                            {item.paymentStatus === 'Pending' && (
                              <TouchableOpacity
                                onPress={() => showAlertRejected(item)}
                                style={{
                                  width: '40%',
                                  paddingHorizontal: 4,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <LinearGradient
                                  colors={[COLORS.lightWhite, COLORS.white_s]}
                                  style={styles.iconContainer}>
                                  <AntDesign
                                    name={'close'}
                                    size={heightPercentageToDP(2)}
                                    color={COLORS.red}
                                  />
                                </LinearGradient>
                              </TouchableOpacity>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {expandedItems[item._id] && (
                  <View
                    style={{
                      padding: heightPercentageToDP(2),
                    }}>
                    <View style={styles.centerLine}></View>
                    <View style={styles.bottomContainer}>
                      <View
                        style={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.titleRegular}>Name</Text>
                        <Text style={styles.titleBold}>{item.username}</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.titleRegular}>Payment Method</Text>
                        <Text style={styles.titleBold}>{item.paymentType}</Text>
                      </View>
                    </View>
                    <View style={styles.bottomContainer}>
                      <View
                        style={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.titleRegular}>Transaction ID</Text>
                        <Text style={styles.titleBold}>
                          {item.transactionId}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.titleRegular}>Receipt</Text>
                        <Text
                          onPress={() => showAlertReceipt(item)}
                          style={styles.titleBold}>
                          Show Receipt
                        </Text>
                      </View>
                    </View>

                    {seletedImageId === item._id && (
                      <CustomReceiptViewer
                        visible={alertVisibleReceipt}
                        onClose={closeAlertReceipt}
                        onYes={handleYesReceipt}
                        data={item}
                        img={item.receipt}
                      />
                    )}

                    <View
                      style={{
                        flex: 1,
                        borderBottomLeftRadius: heightPercentageToDP(2),
                        borderBottomEndRadius: heightPercentageToDP(2),
                        flexDirection: 'row',
                        padding: heightPercentageToDP(1),
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          ...styles.detailContainer,
                          flex: 1,
                          paddingBottom: heightPercentageToDP(1),
                          paddingLeft: heightPercentageToDP(-1),
                        }}>
                        <Text style={styles.titleRegular}>Remark</Text>
                        <Text
                          style={{
                            ...styles.titleBold,
                            paddingEnd: heightPercentageToDP(1),
                            fontSize: heightPercentageToDP(1.8),
                          }}>
                          {item.remark === '' ? 'NA' : item.remark}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </LinearGradient>
            );
          }}
        />
      </View>
    </MainBackgroundWithoutScrollview>
  );
};

export default AllRecharge;

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
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: heightPercentageToDP(8),
    borderRadius: heightPercentageToDP(2),
    alignItems: 'center',
    gap: heightPercentageToDP(3),
    paddingStart: heightPercentageToDP(2),
  },
  iconContainer: {
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
  },
  icon: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyleContent: {
    fontSize: heightPercentageToDP(3),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  topContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: heightPercentageToDP(1),
  },
  centerLine: {
    height: 1,
    backgroundColor: COLORS.white_s,
    marginTop: heightPercentageToDP(-1),
    marginBottom: heightPercentageToDP(1),
  },
  titleRegular: {
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  titleBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Bold,
  },
  titleSemiBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.white_s,
    fontFamily: FONT.Montserrat_Bold,
  },
  acceptBtn: {
    backgroundColor: COLORS.green,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(2),
  },
});
