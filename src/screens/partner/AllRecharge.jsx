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
import {useGetAllRechargeQuery} from '../../helper/Networkcall';

const AllRecharge = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken, user, partner} = useSelector(state => state.user);

  const dummeyAllUsers = [
    {
      userid: '1090',
      name: 'Babu Roa',
      partner: true,
      paymentStatus: 'Pending',
    },
    {
      userid: '1091',
      name: 'Arjuna',
      partner: true,
      paymentStatus: 'Pending',
    },
    {
      userid: '1092',
      name: 'Mark Jone',
      partner: false,
      paymentStatus: 'Completed',
    },
    {
      userid: '1093',
      name: 'Janny Mona',
      partner: true,
      paymentStatus: 'Cancelled',
    },
    {
      userid: '1094',
      name: 'Lucy cina',
      partner: true,
      paymentStatus: 'Completed',
    },
  ];

  const [filteredData, setFilteredData] = useState([]);

  // Example usage:
  // This will return the date and time in 'America/New_York' timezone.
  // This will return the date and time in 'America/New_York' timezone.

  const handleSearch = text => {
    const filtered = times.filter(item =>
      item.lottime.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const {
    isLoading: allRechargeLoading,
    data: allRechargeData,
    error: allRechargeError,
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

  console.log('From all recharge');
  console.log(allRechargeData);

  return (
    <MainBackgroundWithoutScrollview title={'All Recharge'}>
      {/* <View
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
      </View> */}

      {/** Content Container */}

      <View
        style={{
          flex: 1,
          padding: heightPercentageToDP(1),
        }}>
        <FlatList
          data={filteredData}
          renderItem={({item, index}) => (
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
                onPress={() => toggleItem(index)}>
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
                        200 INR
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
                      {false && false ? (
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

                          {item.paymentStatus === 'Pending' && (
                            <TouchableOpacity
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

              {expandedItems[index] && (
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
                      <Text style={styles.titleBold}>{item.transactionId}</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={styles.titleRegular}>Receipt</Text>
                      <Text style={styles.titleBold}>Show Receipt</Text>
                    </View>
                  </View>
                </View>
              )}
            </LinearGradient>
          )}
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
