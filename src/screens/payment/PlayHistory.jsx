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
import React, {useCallback, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import Loading from '../../components/helpercComponent/Loading';
import {
  useGetPlayHistoryQuery,
  useGetSingleUserPlayHistoryQuery,
} from '../../helper/Networkcall';
import NoDataFound from '../../components/helpercComponent/NoDataFound';
import {getTimeAccordingToTimezone} from '../SearchTime';
import moment from 'moment-timezone';

const historyapidata = [
  {
    id: 1,
    amount: '638383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    time: '09:00 AM',
    location: 'Japan',
    number: '84',
  },
  {
    id: 2,
    amount: '8383',
    currency: 'INR',
    date: 'Apr 09, 2024 05:36 PM',
    time: '01:00 AM',
    location: 'Korea',
    number: '84',
  },
  {
    id: 3,
    amount: '9638383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    time: '09:00 AM',
    location: 'Japan',
    number: '84',
  },
  {
    id: 4,
    amount: '238383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    time: '09:00 AM',
    location: 'Japan',
    number: '84',
  },
  {
    id: 5,
    amount: '138383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    time: '09:00 AM',
    location: 'Japan',
    number: '84',
  },
];

const PlayHistory = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {accesstoken, user} = useSelector(state => state.user);
  const [expandedItems, setExpandedItems] = useState({});

  // const {
  //   data: historyapidatas,
  //   error,
  //   isLoading,
  //   refetch,
  // } = useGetPlayHistoryQuery(accesstoken);

  const {
    data: historyapidatas,
    error,
    isLoading,
    refetch,
  } = useGetSingleUserPlayHistoryQuery({
    accesstoken: accesstoken,
    userId: user.userId,
  });

  console.log(JSON.stringify(historyapidatas?.playbets));

  useFocusEffect(
    useCallback(() => {
      // Refetch the data when the screen is focused
      refetch();
    }, [refetch]),
  );

  const getPlaynumbersString = playbets => {
    // Map the array to extract playnumber and join them with ', '
    return playbets.map(playbet => playbet.playnumber).join(' , ');
  };

  const calculateTotalAmount = playbets => {
    // Use reduce to accumulate the total amount
    return playbets.reduce((total, playbet) => total + playbet.amount, 0);
  };

  const formatDate = dateString => {
    // Split the date string into parts
    const [day, month, year] = dateString.split('-');

    // Create a Date object from the parts
    const date = new Date(`${year}-${month}-${day}`);

    // Use Intl.DateTimeFormat to format the date
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date,
    );

    return formattedDate;
  };

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  function extractNumberFromString(input) {
    // Remove the last character (assuming it's always 'X') and convert the result to a number
    return parseInt(input.slice(0, -1), 10);
  }

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

  function getDateTimeAccordingToUserTimezone(time, date, userTimeZone) {
    // Combine the passed date and time into a full datetime string in IST
    const dateTimeIST = `${date} ${time}`;

    // Convert the combined date and time to a moment object in the IST timezone
    const istDateTime = moment.tz(
      dateTimeIST,
      'DD-MM-YYYY hh:mm A',
      'Asia/Kolkata',
    );

    // Convert the IST datetime to the user's target timezone
    const userTimeDateTime = istDateTime.clone().tz(userTimeZone);

    // Format the date and time in the target timezone and return it
    return userTimeDateTime.format('DD-MM-YYYY');
  }

  const [currentGame, setCurrentGame] = useState('powerball');

  return (
    <SafeAreaView style={{flex: 1}}>
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
                Play History
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
              ) : historyapidatas?.playbets?.length === 0 ? (
                <View>
                  <NoDataFound data={'No History Found'} />
                </View>
              ) : (
                <FlatList
                  data={historyapidatas?.playbets}
                  renderItem={({item}) => {
                    return (
                      <>
                        {item.gameType === 'playarena' ? (
                          <LinearGradient
                            colors={[
                              COLORS.time_firstblue,
                              COLORS.time_secondbluw,
                            ]}
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
                                  width: widthPercentageToDP(78),
                                  flexDirection: 'row',
                                  borderTopLeftRadius: heightPercentageToDP(2),
                                  borderTopEndRadius: heightPercentageToDP(2),
                                }}>
                                <View
                                  style={{
                                    backgroundColor: COLORS.white_s,
                                    padding: heightPercentageToDP(1),
                                    borderRadius: heightPercentageToDP(1),
                                    marginVertical: heightPercentageToDP(2),
                                    marginHorizontal: heightPercentageToDP(1),
                                  }}>
                                  <MaterialCommunityIcons
                                    name={'play-circle-outline'}
                                    size={heightPercentageToDP(3)}
                                    color={
                                      item?.walletName
                                        ? COLORS.green
                                        : COLORS.darkGray
                                    }
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
                                      {`Amount \u00A0`}
                                    </Text>
                                    <Text
                                      style={{
                                        fontFamily: FONT.Montserrat_Bold,
                                        fontSize: heightPercentageToDP(2),
                                        color: COLORS.black,
                                        width: '70%',
                                      }}
                                      numberOfLines={2}>
                                      :{' '}
                                      {formatAmount(
                                        calculateTotalAmount(item?.playnumbers),
                                      )}{' '}
                                      {user?.country?.countrycurrencysymbol}
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
                                      {item?.lotdate?.lotdate
                                        ? formatDate(
                                            getDateTimeAccordingToUserTimezone(
                                              item?.lottime?.lottime,
                                              item?.lotdate?.lotdate,
                                              user?.country?.timezone,
                                            ),
                                          )
                                        : ''}
                                    </Text>
                                  </View>
                                </View>
                              </View>

                              <View style={{flex: 1, flexDirection: 'row'}}>
                                <TouchableOpacity
                                  onPress={() => toggleItem(item._id)}
                                  style={{
                                    paddingHorizontal: 4,
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                                  }}
                                />
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
                                  <View style={styles.detailContainer}>
                                    <Text style={styles.detailValue}>
                                      Location
                                    </Text>
                                    <Text
                                      numberOfLines={1}
                                      style={styles.detailLabel}>
                                      {item?.lotlocation?.lotlocation}
                                    </Text>
                                  </View>
                                  <View style={styles.detailContainer}>
                                    <Text style={styles.detailValue}>Time</Text>
                                    <Text
                                      numberOfLines={1}
                                      style={styles.detailLabel}>
                                      {getTimeAccordingToTimezone(
                                        item?.lottime?.lottime,
                                        user?.country?.timezone,
                                      )}
                                    </Text>
                                  </View>
                                  {item?.forProcess ? (
                                    <View style={styles.detailContainer}>
                                      <Text style={styles.detailValue}>
                                        Partner
                                      </Text>
                                      <Text
                                        numberOfLines={3}
                                        style={styles.detailLabel}>
                                        Profit
                                      </Text>
                                    </View>
                                  ) : (
                                    <View style={styles.detailContainer}>
                                      <Text style={styles.detailValue}>
                                        {item?.walletName
                                          ? 'Winning No.'
                                          : 'Total bets'}
                                      </Text>
                                      <Text
                                        numberOfLines={3}
                                        style={styles.detailLabel}>
                                        {item?.walletName
                                          ? item.playnumbers[0]?.playnumber
                                          : item?.playnumbers.length}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                                {/** PLAY NUMBER */}
                                {item?.forProcess ? null : (
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
                                      <View style={styles.detailContainer}>
                                        <Text style={styles.detailValue}>
                                          Number
                                        </Text>
                                      </View>
                                      <View style={styles.detailContainer}>
                                        <Text style={styles.detailValue}>
                                          Amount
                                        </Text>
                                      </View>
                                      <View style={styles.detailContainer}>
                                        <Text style={styles.detailValue}>
                                          Win Amt.
                                        </Text>
                                      </View>
                                    </View>
                                    {item.playnumbers.map((pitem, pindex) => (
                                      <View
                                        key={pindex}
                                        style={{
                                          borderBottomLeftRadius:
                                            heightPercentageToDP(2),
                                          borderBottomEndRadius:
                                            heightPercentageToDP(2),
                                          flexDirection: 'row',
                                          padding: heightPercentageToDP(1),
                                        }}>
                                        <View style={styles.detailContainer}>
                                          <Text
                                            style={{
                                              ...styles.detailLabel,
                                              fontFamily:
                                                FONT.Montserrat_SemiBold,
                                            }}>
                                            {pitem?.playnumber}
                                          </Text>
                                        </View>
                                        <View style={styles.detailContainer}>
                                          <Text style={styles.detailLabel}>
                                            {/* {pitem?.amount} */}
                                            {item?.walletName
                                              ? formatAmount(
                                                  pitem?.amount /
                                                    extractNumberFromString(
                                                      item?.lotlocation
                                                        ?.maximumReturn,
                                                    ),
                                                )
                                              : formatAmount(pitem?.amount)}
                                          </Text>
                                        </View>
                                        <View style={styles.detailContainer}>
                                          <Text style={styles.detailLabel}>
                                            {formatAmount(pitem?.winningamount)}
                                          </Text>
                                        </View>
                                      </View>
                                    ))}
                                  </>
                                )}

                                <View
                                  style={{
                                    height: 1,
                                    backgroundColor: COLORS.white_s,
                                    marginHorizontal: heightPercentageToDP(2),
                                    marginBottom: heightPercentageToDP(3),
                                    marginTop: heightPercentageToDP(1),
                                  }}
                                />
                              </>
                            )}
                          </LinearGradient>
                        ) : (
                          <LinearGradient
                            colors={[
                              COLORS.time_firstblue,
                              COLORS.time_secondbluw,
                            ]}
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
                                  width: widthPercentageToDP(78),
                                  flexDirection: 'row',
                                  borderTopLeftRadius: heightPercentageToDP(2),
                                  borderTopEndRadius: heightPercentageToDP(2),
                                }}>
                                <View
                                  style={{
                                    backgroundColor: COLORS.white_s,
                                    padding: heightPercentageToDP(1),
                                    borderRadius: heightPercentageToDP(1),
                                    marginVertical: heightPercentageToDP(2),
                                    marginHorizontal: heightPercentageToDP(1),
                                  }}>
                                  <MaterialCommunityIcons
                                    name={'trophy-award'}
                                    size={heightPercentageToDP(3)}
                                    color={
                                      item?.walletName
                                        ? COLORS.green
                                        : COLORS.darkGray
                                    }
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
                                      {`Amount \u00A0`}
                                    </Text>
                                    <Text
                                      style={{
                                        fontFamily: FONT.Montserrat_Bold,
                                        fontSize: heightPercentageToDP(2),
                                        color: COLORS.black,
                                        width: '70%',
                                      }}
                                      numberOfLines={2}>
                                      :{' '}
                                      {formatAmount(
                                        calculateTotalAmount(item?.tickets),
                                      )}{' '}
                                      {user?.country?.countrycurrencysymbol}
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
                                      {item?.powerdate?.powerdate
                                        ? formatDate(
                                            getDateTimeAccordingToUserTimezone(
                                              item?.powertime?.powertime,
                                              item?.powerdate?.powerdate,
                                              user?.country?.timezone,
                                            ),
                                          )
                                        : ''}
                                    </Text>
                                  </View>
                                </View>
                              </View>

                              <View style={{flex: 1, flexDirection: 'row'}}>
                                <TouchableOpacity
                                  onPress={() => toggleItem(item._id)}
                                  style={{
                                    paddingHorizontal: 4,
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                                  }}
                                />
                                <View
                                  style={{
                                    flex: 1,
                                    borderBottomLeftRadius:
                                      heightPercentageToDP(2),
                                    borderBottomEndRadius:
                                      heightPercentageToDP(2),
                                    flexDirection: 'row',
                                    padding: heightPercentageToDP(1),
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      paddingStart: heightPercentageToDP(1),
                                    }}>
                                    <Text style={styles.detailValue}>Time</Text>
                                    <Text
                                      numberOfLines={1}
                                      style={styles.detailLabel}>
                                      {getTimeAccordingToTimezone(
                                        item?.powertime?.powertime,
                                        user?.country?.timezone,
                                      )}
                                    </Text>
                                  </View>
                                  <View style={styles.detailContainer}>
                                    <Text style={styles.detailValue}>
                                      {item?.walletName
                                        ? item?.forProcess === 'partnercredit'
                                          ? 'Partner'
                                          : 'Winner'
                                        : 'Total Ticket'}
                                    </Text>
                                    <Text
                                      numberOfLines={3}
                                      style={styles.detailLabel}>
                                      {item?.walletName
                                        ? item?.forProcess === 'partnercredit'
                                          ? 'Profit Credit'
                                          : 'Ticket'
                                        : item?.tickets.length}
                                    </Text>
                                  </View>
                                </View>
                                {/** PLAY NUMBER */}
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
                                  <View
                                    style={{
                                      flex: 0.5,
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      paddingStart: heightPercentageToDP(1),
                                    }}>
                                    <Text style={styles.detailValue}>No.</Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      paddingStart: heightPercentageToDP(1),
                                    }}>
                                    <Text style={styles.detailValue}>
                                      Tickets
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 1,
                                      justifyContent: 'flex-end',
                                      alignItems: 'flex-end',
                                      paddingStart: heightPercentageToDP(1),
                                    }}>
                                    <Text style={styles.detailValue}>
                                      Amount
                                    </Text>
                                  </View>
                                </View>
                                {item.tickets.map((pitem, pindex) => (
                                  <View
                                    key={pindex}
                                    style={{
                                      borderBottomLeftRadius:
                                        heightPercentageToDP(2),
                                      borderBottomEndRadius:
                                        heightPercentageToDP(2),
                                      flexDirection: 'row',
                                      padding: heightPercentageToDP(1),
                                    }}>
                                    <View
                                      style={{
                                        flex: 0.5,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        paddingStart: heightPercentageToDP(1),
                                      }}>
                                      <Text
                                        style={{
                                          ...styles.detailLabel,
                                          fontFamily: FONT.Montserrat_SemiBold,
                                        }}>
                                        {pindex + 1}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flex: 2,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        paddingStart: heightPercentageToDP(1),
                                      }}>
                                      <Text style={styles.detailLabel}>
                                        {pitem.usernumber.join(', ')}
                                        {pitem.multiplier > 1
                                          ? ` - ${pitem.multiplier}X `
                                          : ''}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        paddingStart: heightPercentageToDP(1),
                                      }}>
                                      <Text style={styles.detailLabel}>
                                        {pitem.amount}
                                      </Text>
                                    </View>
                                  </View>
                                ))}
                                <View
                                  style={{
                                    height: 1,
                                    backgroundColor: COLORS.white_s,
                                    marginHorizontal: heightPercentageToDP(2),
                                    marginBottom: heightPercentageToDP(3),
                                    marginTop: heightPercentageToDP(1),
                                  }}
                                />
                              </>
                            )}
                          </LinearGradient>
                        )}
                      </>
                    );
                  }}
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

export default PlayHistory;

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
    width: '32%',
    justifyContent: 'space-evenly',
    paddingStart: heightPercentageToDP(2),
  },
  detailLabel: {
    fontFamily: FONT.Montserrat_Regular,
    color: COLORS.black,
    fontSize: heightPercentageToDP(2),
    textAlign: 'center',
  },
  detailValue: {
    fontFamily: FONT.Montserrat_SemiBold,
    color: COLORS.black,
    fontSize: heightPercentageToDP(2),
    textAlign: 'center',
  },
});
