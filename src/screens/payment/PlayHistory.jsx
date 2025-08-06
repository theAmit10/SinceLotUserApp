import {
  ActivityIndicator,
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
import React, {useCallback, useEffect, useState} from 'react';
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
  useGetPowerballQuery,
  useGetSingleUserPlayHistoryQuery,
} from '../../helper/Networkcall';
import NoDataFound from '../../components/helpercComponent/NoDataFound';
import {getTimeAccordingToTimezone} from '../SearchTime';
import moment from 'moment-timezone';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';

const PlayHistory = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {accesstoken, user} = useSelector(state => state.user);
  const [expandedItems, setExpandedItems] = useState({});

  const [partners, setPartners] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch Paginated Data
  const {
    data: paginatedData,
    refetch: refetchPaginated,
    isFetching: fetchingPaginated,
    isLoading: isInitialLoading,
  } = useGetSingleUserPlayHistoryQuery({
    accesstoken,
    userId: user.userId,
    page,
    limit,
  });

  // Reset State on Navigation Back
  useFocusEffect(
    useCallback(() => {
      setPartners([]); // ✅ Reset Data
      setPage(1); // ✅ Reset Page
      setHasMore(true); // ✅ Reset Load More
      setIsLoadingMore(false); // ✅ Reset loading more state
      refetchPaginated(); // ✅ Ensure Fresh Data
    }, [refetchPaginated]),
  );

  useEffect(() => {
    if (paginatedData?.playbets) {
      setPartners(prev => {
        // For page 1, replace all data
        if (page === 1) {
          return paginatedData.playbets;
        }

        // For subsequent pages, filter out duplicates before appending
        const newData = paginatedData.playbets.filter(
          newItem => !prev.some(prevItem => prevItem._id === newItem._id),
        );
        return [...prev, ...newData];
      });

      // Update `hasMore` based on the length of the new data
      if (paginatedData.playbets.length < limit) {
        setHasMore(false); // No more data to fetch
      } else {
        setHasMore(true); // More data available
      }
    }

    // Reset loading more state after data is processed
    setIsLoadingMore(false);
  }, [paginatedData, page, limit]);

  const loadMore = useCallback(() => {
    // Prevent multiple simultaneous requests
    if (!isLoadingMore && !fetchingPaginated && hasMore) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [isLoadingMore, fetchingPaginated, hasMore]);

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

  const [gameName, setGameName] = useState('');
  // Network call
  const {data, isLoading: powerballIsLoading} = useGetPowerballQuery(
    {accesstoken},
    {skip: !accesstoken},
  );

  useEffect(() => {
    if (!powerballIsLoading && data) {
      setGameName(data.games[0].name);
      console.log(data?.games[0].name);
    }
  }, [data, powerballIsLoading]); // Correct dependencies

  // Render footer component for loading more
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View
        style={{
          paddingVertical: heightPercentageToDP(2),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={COLORS.white_s} />
        <Text
          style={{
            color: COLORS.white_s,
            fontFamily: FONT.Montserrat_Regular,
            fontSize: heightPercentageToDP(1.8),
            marginTop: heightPercentageToDP(1),
          }}>
          Loading more...
        </Text>
      </View>
    );
  };

  return (
    <MainBackgroundWithoutScrollview title="Play History">
      <View style={{flex: 1}}>
        {/* PARTNER USER LIST */}
        <View style={{flex: 1, padding: heightPercentageToDP(1)}}>
          {isInitialLoading && page === 1 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color={COLORS.white_s} />
            </View>
          ) : (
            <FlatList
              data={partners}
              keyExtractor={item => item._id.toString()} // Ensure _id is unique
              renderItem={({item}) => (
                <>
                  {item.gameType === 'playarena' ? (
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
                            {item?.walletName ? (
                              item?.forProcess === 'partnercredit' ? (
                                <FontAwesome6
                                  name={'handshake-simple'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.orange}
                                />
                              ) : (
                                <MaterialCommunityIcons
                                  name={'play-circle-outline'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.orange}
                                />
                              )
                            ) : (
                              <MaterialCommunityIcons
                                name={'play-circle-outline'}
                                size={heightPercentageToDP(3)}
                                color={COLORS.darkGray}
                              />
                            )}
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
                              borderBottomLeftRadius: heightPercentageToDP(2),
                              borderBottomEndRadius: heightPercentageToDP(2),
                              flexDirection: 'row',
                              padding: heightPercentageToDP(1),
                            }}>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailValue}>Location</Text>
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
                                <Text style={styles.detailValue}>Partner</Text>
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
                                    ? item?.forProcess === 'partnercredit'
                                      ? 'Partner'
                                      : 'Winner No.'
                                    : 'Total bets'}
                                </Text>
                                <Text
                                  numberOfLines={3}
                                  style={styles.detailLabel}>
                                  {item?.walletName
                                    ? item?.forProcess === 'partnercredit'
                                      ? 'Profit Credit'
                                      : item?.playnumbers[0]?.playnumber
                                    : item?.playnumbers?.length}
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
                                  <Text style={styles.detailValue}>Number</Text>
                                </View>
                                <View style={styles.detailContainer}>
                                  <Text style={styles.detailValue}>Amount</Text>
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
                                        fontFamily: FONT.Montserrat_SemiBold,
                                      }}>
                                      {pitem?.playnumber}
                                    </Text>
                                  </View>
                                  <View style={styles.detailContainer}>
                                    <Text style={styles.detailLabel}>
                                      {item?.walletName
                                        ? item?.forProcess === 'partnercredit'
                                          ? '0'
                                          : formatAmount(
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
                            {item?.walletName ? (
                              item?.forProcess === 'partnercredit' ? (
                                <FontAwesome6
                                  name={'handshake-simple'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.orange}
                                />
                              ) : (
                                <MaterialCommunityIcons
                                  name={'trophy-award'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.orange}
                                />
                              )
                            ) : (
                              <MaterialCommunityIcons
                                name={'trophy-award'}
                                size={heightPercentageToDP(3)}
                                color={COLORS.darkGray}
                              />
                            )}
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
                              borderBottomLeftRadius: heightPercentageToDP(2),
                              borderBottomEndRadius: heightPercentageToDP(2),
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
                              <Text style={styles.detailValue}>Playing</Text>
                              <Text
                                numberOfLines={1}
                                style={styles.detailLabel}>
                                {gameName}
                              </Text>
                            </View>
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
                              borderBottomLeftRadius: heightPercentageToDP(2),
                              borderBottomEndRadius: heightPercentageToDP(2),
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
                              <Text style={styles.detailValue}>Tickets</Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                paddingStart: heightPercentageToDP(1),
                              }}>
                              <Text style={styles.detailValue}>Amount</Text>
                            </View>
                          </View>
                          {item.tickets.map((pitem, pindex) => (
                            <View
                              key={pindex}
                              style={{
                                borderBottomLeftRadius: heightPercentageToDP(2),
                                borderBottomEndRadius: heightPercentageToDP(2),
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
                                  alignItems: 'center',
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
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3} // Trigger earlier for better UX
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true} // Optimize performance
              maxToRenderPerBatch={10} // Render 10 items per batch
              windowSize={10} // Keep 10 screens worth of items in memory
              initialNumToRender={10} // Initial render count matches limit
            />
          )}

          {/* Show message when no data */}
          {!isInitialLoading && partners.length === 0 && <NoDataFound />}
        </View>
      </View>
    </MainBackgroundWithoutScrollview>
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

// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   ImageBackground,
//   Platform,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import Background from '../../components/background/Background';
// import {COLORS, FONT} from '../../../assets/constants';
// import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
// import Loading from '../../components/helpercComponent/Loading';
// import {
//   useGetPlayHistoryQuery,
//   useGetPowerballQuery,
//   useGetSingleUserPlayHistoryQuery,
// } from '../../helper/Networkcall';
// import NoDataFound from '../../components/helpercComponent/NoDataFound';
// import {getTimeAccordingToTimezone} from '../SearchTime';
// import moment from 'moment-timezone';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';

// const historyapidata = [
//   {
//     id: 1,
//     amount: '638383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     time: '09:00 AM',
//     location: 'Japan',
//     number: '84',
//   },
//   {
//     id: 2,
//     amount: '8383',
//     currency: 'INR',
//     date: 'Apr 09, 2024 05:36 PM',
//     time: '01:00 AM',
//     location: 'Korea',
//     number: '84',
//   },
//   {
//     id: 3,
//     amount: '9638383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     time: '09:00 AM',
//     location: 'Japan',
//     number: '84',
//   },
//   {
//     id: 4,
//     amount: '238383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     time: '09:00 AM',
//     location: 'Japan',
//     number: '84',
//   },
//   {
//     id: 5,
//     amount: '138383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     time: '09:00 AM',
//     location: 'Japan',
//     number: '84',
//   },
// ];

// const PlayHistory = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const {accesstoken, user} = useSelector(state => state.user);
//   const [expandedItems, setExpandedItems] = useState({});

//   const [partners, setPartners] = useState([]);
//   const [page, setPage] = useState(1);
//   const limit = 7;
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // const {
//   //   data: historyapidatas,
//   //   error,
//   //   isLoading,
//   //   refetch,
//   // } = useGetSingleUserPlayHistoryQuery({
//   //   accesstoken: accesstoken,
//   //   userId: user.userId,
//   // });

//   // Fetch Paginated Data
//   const {
//     data: paginatedData,
//     refetch: refetchPaginated,
//     isFetching: fetchingPaginated,
//   } = useGetSingleUserPlayHistoryQuery({
//     accesstoken,
//     userId: user.userId,
//     page,
//     limit,
//   });

//   // Reset State on Navigation Back
//   useFocusEffect(
//     useCallback(() => {
//       // setPartners([]); // ✅ Reset Data
//       setPage(1); // ✅ Reset Page
//       setHasMore(true); // ✅ Reset Load More
//       refetchPaginated(); // ✅ Ensure Fresh Data
//     }, [refetchPaginated]),
//   );

//   useEffect(() => {
//     setLoading(true);

//     if (paginatedData?.playbets) {
//       // For paginated data, filter out duplicates before appending
//       setPartners(prev => {
//         const newData = paginatedData.playbets.filter(
//           newItem => !prev.some(prevItem => prevItem._id === newItem._id),
//         );
//         return page === 1 ? paginatedData.playbets : [...prev, ...newData];
//       });

//       // Update `hasMore` based on the length of the new data
//       if (paginatedData.playbets.length < limit) {
//         setHasMore(false); // No more data to fetch
//       } else {
//         setHasMore(true); // More data available
//       }
//     }

//     setLoading(false);
//   }, [paginatedData, page]);

//   const loadMore = () => {
//     if (!loading && hasMore) {
//       setPage(prev => prev + 1);
//     }
//   };

//   // Combined Loading State
//   const isLoading = fetchingPaginated || loading;

//   const getPlaynumbersString = playbets => {
//     // Map the array to extract playnumber and join them with ', '
//     return playbets.map(playbet => playbet.playnumber).join(' , ');
//   };

//   const calculateTotalAmount = playbets => {
//     // Use reduce to accumulate the total amount
//     return playbets.reduce((total, playbet) => total + playbet.amount, 0);
//   };

//   const formatDate = dateString => {
//     // Split the date string into parts
//     const [day, month, year] = dateString.split('-');

//     // Create a Date object from the parts
//     const date = new Date(`${year}-${month}-${day}`);

//     // Use Intl.DateTimeFormat to format the date
//     const options = {year: 'numeric', month: 'short', day: 'numeric'};
//     const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
//       date,
//     );

//     return formattedDate;
//   };

//   const toggleItem = id => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   function extractNumberFromString(input) {
//     // Remove the last character (assuming it's always 'X') and convert the result to a number
//     return parseInt(input.slice(0, -1), 10);
//   }

//   function formatAmount(value) {
//     if (typeof value === 'string') {
//       value = parseFloat(value); // Convert string to float if necessary
//     }

//     // Check if the number has decimals
//     if (value % 1 === 0) {
//       return value; // Return as is if it's a whole number
//     } else {
//       return parseFloat(value.toFixed(1)); // Return with one decimal point if it has decimals
//     }
//   }

//   function getDateTimeAccordingToUserTimezone(time, date, userTimeZone) {
//     // Combine the passed date and time into a full datetime string in IST
//     const dateTimeIST = `${date} ${time}`;

//     // Convert the combined date and time to a moment object in the IST timezone
//     const istDateTime = moment.tz(
//       dateTimeIST,
//       'DD-MM-YYYY hh:mm A',
//       'Asia/Kolkata',
//     );

//     // Convert the IST datetime to the user's target timezone
//     const userTimeDateTime = istDateTime.clone().tz(userTimeZone);

//     // Format the date and time in the target timezone and return it
//     return userTimeDateTime.format('DD-MM-YYYY');
//   }

//   const [currentGame, setCurrentGame] = useState('powerball');

//   const [gameName, setGameName] = useState('');
//   // Network call
//   const {data, isLoading: powerballIsLoading} = useGetPowerballQuery(
//     {accesstoken},
//     {skip: !accesstoken},
//   );

//   useEffect(() => {
//     if (!powerballIsLoading && data) {
//       setGameName(data.games[0].name);
//       console.log(data?.games[0].name);
//     }
//   }, [data, powerballIsLoading]); // Correct dependencies

//   return (
//     <MainBackgroundWithoutScrollview title="Play History">
//       <View style={{flex: 1}}>
//         {/* PARTNER USER LIST */}
//         <View style={{flex: 1, padding: heightPercentageToDP(1)}}>
//           {isLoading && page === 1 ? (
//             <ActivityIndicator size="large" color={COLORS.white_s} />
//           ) : (
//             <FlatList
//               data={partners}
//               keyExtractor={item => item._id.toString()} // Ensure _id is unique
//               renderItem={({item}) => (
//                 <>
//                   {item.gameType === 'playarena' ? (
//                     <LinearGradient
//                       colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                       start={{x: 0, y: 0}} // start from left
//                       end={{x: 1, y: 0}} // end at right
//                       style={{
//                         justifyContent: 'flex-start',
//                         borderRadius: heightPercentageToDP(2),
//                         marginTop: heightPercentageToDP(2),
//                       }}>
//                       <TouchableOpacity
//                         onPress={() => toggleItem(item._id)}
//                         style={{
//                           flex: 1,
//                           borderTopLeftRadius: heightPercentageToDP(2),
//                           borderTopEndRadius: heightPercentageToDP(2),
//                           flexDirection: 'row',
//                         }}>
//                         <View
//                           style={{
//                             width: widthPercentageToDP(78),
//                             flexDirection: 'row',
//                             borderTopLeftRadius: heightPercentageToDP(2),
//                             borderTopEndRadius: heightPercentageToDP(2),
//                           }}>
//                           <View
//                             style={{
//                               backgroundColor: COLORS.white_s,
//                               padding: heightPercentageToDP(1),
//                               borderRadius: heightPercentageToDP(1),
//                               marginVertical: heightPercentageToDP(2),
//                               marginHorizontal: heightPercentageToDP(1),
//                             }}>
//                             {item?.walletName ? (
//                               item?.forProcess === 'partnercredit' ? (
//                                 <FontAwesome6
//                                   name={'handshake-simple'}
//                                   size={heightPercentageToDP(3)}
//                                   color={COLORS.orange}
//                                 />
//                               ) : (
//                                 <MaterialCommunityIcons
//                                   name={'play-circle-outline'}
//                                   size={heightPercentageToDP(3)}
//                                   color={COLORS.orange}
//                                 />
//                               )
//                             ) : (
//                               <MaterialCommunityIcons
//                                 name={'play-circle-outline'}
//                                 size={heightPercentageToDP(3)}
//                                 color={COLORS.darkGray}
//                               />
//                             )}
//                           </View>

//                           <View style={{flex: 1}}>
//                             <View
//                               style={{
//                                 flexDirection: 'row',
//                                 flex: 1,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'center',
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(1.6),
//                                   color: COLORS.black,
//                                 }}>
//                                 {`Amount \u00A0`}
//                               </Text>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Bold,
//                                   fontSize: heightPercentageToDP(2),
//                                   color: COLORS.black,
//                                   width: '70%',
//                                 }}
//                                 numberOfLines={2}>
//                                 :{' '}
//                                 {formatAmount(
//                                   calculateTotalAmount(item?.playnumbers),
//                                 )}{' '}
//                                 {user?.country?.countrycurrencysymbol}
//                               </Text>
//                             </View>

//                             <View
//                               style={{
//                                 flexDirection: 'row',
//                                 flex: 1,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'center',
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(1.8),
//                                   color: COLORS.black,
//                                 }}>
//                                 {item?.lotdate?.lotdate
//                                   ? formatDate(
//                                       getDateTimeAccordingToUserTimezone(
//                                         item?.lottime?.lottime,
//                                         item?.lotdate?.lotdate,
//                                         user?.country?.timezone,
//                                       ),
//                                     )
//                                   : ''}
//                               </Text>
//                             </View>
//                           </View>
//                         </View>

//                         <View style={{flex: 1, flexDirection: 'row'}}>
//                           <TouchableOpacity
//                             onPress={() => toggleItem(item._id)}
//                             style={{
//                               paddingHorizontal: 4,
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                             }}>
//                             <LinearGradient
//                               colors={[COLORS.lightWhite, COLORS.white_s]}
//                               style={styles.expandIconContainer}>
//                               <Ionicons
//                                 name={
//                                   expandedItems[item._id]
//                                     ? 'remove-outline'
//                                     : 'add-outline'
//                                 }
//                                 size={heightPercentageToDP(2)}
//                                 color={COLORS.darkGray}
//                               />
//                             </LinearGradient>
//                           </TouchableOpacity>
//                         </View>
//                       </TouchableOpacity>

//                       {expandedItems[item._id] && (
//                         <>
//                           <View
//                             style={{
//                               height: 1,
//                               backgroundColor: COLORS.white_s,
//                               marginHorizontal: heightPercentageToDP(2),
//                             }}
//                           />
//                           <View
//                             style={{
//                               flex: 1,
//                               borderBottomLeftRadius: heightPercentageToDP(2),
//                               borderBottomEndRadius: heightPercentageToDP(2),
//                               flexDirection: 'row',
//                               padding: heightPercentageToDP(1),
//                             }}>
//                             <View style={styles.detailContainer}>
//                               <Text style={styles.detailValue}>Location</Text>
//                               <Text
//                                 numberOfLines={1}
//                                 style={styles.detailLabel}>
//                                 {item?.lotlocation?.lotlocation}
//                               </Text>
//                             </View>
//                             <View style={styles.detailContainer}>
//                               <Text style={styles.detailValue}>Time</Text>
//                               <Text
//                                 numberOfLines={1}
//                                 style={styles.detailLabel}>
//                                 {getTimeAccordingToTimezone(
//                                   item?.lottime?.lottime,
//                                   user?.country?.timezone,
//                                 )}
//                               </Text>
//                             </View>
//                             {item?.forProcess ? (
//                               <View style={styles.detailContainer}>
//                                 <Text style={styles.detailValue}>Partner</Text>
//                                 <Text
//                                   numberOfLines={3}
//                                   style={styles.detailLabel}>
//                                   Profit
//                                 </Text>
//                               </View>
//                             ) : (
//                               <View style={styles.detailContainer}>
//                                 <Text style={styles.detailValue}>
//                                   {/* {item?.walletName
//                                           ? 'Winning No.'
//                                           : 'Total bets'} */}
//                                   {item?.walletName
//                                     ? item?.forProcess === 'partnercredit'
//                                       ? 'Partner'
//                                       : 'Winner No.'
//                                     : 'Total bets'}
//                                 </Text>
//                                 <Text
//                                   numberOfLines={3}
//                                   style={styles.detailLabel}>
//                                   {/* {item?.walletName
//                                           ? item.playnumbers[0]?.playnumber
//                                           : item?.playnumbers.length} */}
//                                   {item?.walletName
//                                     ? item?.forProcess === 'partnercredit'
//                                       ? 'Profit Credit'
//                                       : item?.playnumbers[0]?.playnumber
//                                     : item?.playnumbers?.length}
//                                 </Text>
//                               </View>
//                             )}
//                           </View>
//                           {/** PLAY NUMBER */}
//                           {item?.forProcess ? null : (
//                             <>
//                               <View
//                                 style={{
//                                   flex: 1,
//                                   borderBottomLeftRadius:
//                                     heightPercentageToDP(2),
//                                   borderBottomEndRadius:
//                                     heightPercentageToDP(2),
//                                   flexDirection: 'row',
//                                   padding: heightPercentageToDP(1),
//                                 }}>
//                                 <View style={styles.detailContainer}>
//                                   <Text style={styles.detailValue}>Number</Text>
//                                 </View>
//                                 <View style={styles.detailContainer}>
//                                   <Text style={styles.detailValue}>Amount</Text>
//                                 </View>
//                                 <View style={styles.detailContainer}>
//                                   <Text style={styles.detailValue}>
//                                     Win Amt.
//                                   </Text>
//                                 </View>
//                               </View>
//                               {item.playnumbers.map((pitem, pindex) => (
//                                 <View
//                                   key={pindex}
//                                   style={{
//                                     borderBottomLeftRadius:
//                                       heightPercentageToDP(2),
//                                     borderBottomEndRadius:
//                                       heightPercentageToDP(2),
//                                     flexDirection: 'row',
//                                     padding: heightPercentageToDP(1),
//                                   }}>
//                                   <View style={styles.detailContainer}>
//                                     <Text
//                                       style={{
//                                         ...styles.detailLabel,
//                                         fontFamily: FONT.Montserrat_SemiBold,
//                                       }}>
//                                       {pitem?.playnumber}
//                                     </Text>
//                                   </View>
//                                   <View style={styles.detailContainer}>
//                                     <Text style={styles.detailLabel}>
//                                       {/* {pitem?.amount} */}

//                                       {item?.walletName
//                                         ? item?.forProcess === 'partnercredit'
//                                           ? '0'
//                                           : formatAmount(
//                                               pitem?.amount /
//                                                 extractNumberFromString(
//                                                   item?.lotlocation
//                                                     ?.maximumReturn,
//                                                 ),
//                                             )
//                                         : formatAmount(pitem?.amount)}
//                                     </Text>
//                                   </View>
//                                   <View style={styles.detailContainer}>
//                                     <Text style={styles.detailLabel}>
//                                       {formatAmount(pitem?.winningamount)}
//                                     </Text>
//                                   </View>
//                                 </View>
//                               ))}
//                             </>
//                           )}

//                           <View
//                             style={{
//                               height: 1,
//                               backgroundColor: COLORS.white_s,
//                               marginHorizontal: heightPercentageToDP(2),
//                               marginBottom: heightPercentageToDP(3),
//                               marginTop: heightPercentageToDP(1),
//                             }}
//                           />
//                         </>
//                       )}
//                     </LinearGradient>
//                   ) : (
//                     <LinearGradient
//                       colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                       start={{x: 0, y: 0}} // start from left
//                       end={{x: 1, y: 0}} // end at right
//                       style={{
//                         justifyContent: 'flex-start',
//                         borderRadius: heightPercentageToDP(2),
//                         marginTop: heightPercentageToDP(2),
//                       }}>
//                       <TouchableOpacity
//                         onPress={() => toggleItem(item._id)}
//                         style={{
//                           flex: 1,
//                           borderTopLeftRadius: heightPercentageToDP(2),
//                           borderTopEndRadius: heightPercentageToDP(2),
//                           flexDirection: 'row',
//                         }}>
//                         <View
//                           style={{
//                             width: widthPercentageToDP(78),
//                             flexDirection: 'row',
//                             borderTopLeftRadius: heightPercentageToDP(2),
//                             borderTopEndRadius: heightPercentageToDP(2),
//                           }}>
//                           <View
//                             style={{
//                               backgroundColor: COLORS.white_s,
//                               padding: heightPercentageToDP(1),
//                               borderRadius: heightPercentageToDP(1),
//                               marginVertical: heightPercentageToDP(2),
//                               marginHorizontal: heightPercentageToDP(1),
//                             }}>
//                             {item?.walletName ? (
//                               item?.forProcess === 'partnercredit' ? (
//                                 <FontAwesome6
//                                   name={'handshake-simple'}
//                                   size={heightPercentageToDP(3)}
//                                   color={COLORS.orange}
//                                 />
//                               ) : (
//                                 <MaterialCommunityIcons
//                                   name={'trophy-award'}
//                                   size={heightPercentageToDP(3)}
//                                   color={COLORS.orange}
//                                 />
//                               )
//                             ) : (
//                               <MaterialCommunityIcons
//                                 name={'trophy-award'}
//                                 size={heightPercentageToDP(3)}
//                                 color={COLORS.darkGray}
//                               />
//                             )}
//                           </View>

//                           <View style={{flex: 1}}>
//                             <View
//                               style={{
//                                 flexDirection: 'row',
//                                 flex: 1,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'center',
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(1.6),
//                                   color: COLORS.black,
//                                 }}>
//                                 {`Amount \u00A0`}
//                               </Text>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Bold,
//                                   fontSize: heightPercentageToDP(2),
//                                   color: COLORS.black,
//                                   width: '70%',
//                                 }}
//                                 numberOfLines={2}>
//                                 :{' '}
//                                 {formatAmount(
//                                   calculateTotalAmount(item?.tickets),
//                                 )}{' '}
//                                 {user?.country?.countrycurrencysymbol}
//                               </Text>
//                             </View>

//                             <View
//                               style={{
//                                 flexDirection: 'row',
//                                 flex: 1,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'center',
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(1.8),
//                                   color: COLORS.black,
//                                 }}>
//                                 {item?.powerdate?.powerdate
//                                   ? formatDate(
//                                       getDateTimeAccordingToUserTimezone(
//                                         item?.powertime?.powertime,
//                                         item?.powerdate?.powerdate,
//                                         user?.country?.timezone,
//                                       ),
//                                     )
//                                   : ''}
//                               </Text>
//                             </View>
//                           </View>
//                         </View>

//                         <View style={{flex: 1, flexDirection: 'row'}}>
//                           <TouchableOpacity
//                             onPress={() => toggleItem(item._id)}
//                             style={{
//                               paddingHorizontal: 4,
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                             }}>
//                             <LinearGradient
//                               colors={[COLORS.lightWhite, COLORS.white_s]}
//                               style={styles.expandIconContainer}>
//                               <Ionicons
//                                 name={
//                                   expandedItems[item._id]
//                                     ? 'remove-outline'
//                                     : 'add-outline'
//                                 }
//                                 size={heightPercentageToDP(2)}
//                                 color={COLORS.darkGray}
//                               />
//                             </LinearGradient>
//                           </TouchableOpacity>
//                         </View>
//                       </TouchableOpacity>

//                       {expandedItems[item._id] && (
//                         <>
//                           <View
//                             style={{
//                               height: 1,
//                               backgroundColor: COLORS.white_s,
//                               marginHorizontal: heightPercentageToDP(2),
//                             }}
//                           />
//                           <View
//                             style={{
//                               flex: 1,
//                               borderBottomLeftRadius: heightPercentageToDP(2),
//                               borderBottomEndRadius: heightPercentageToDP(2),
//                               flexDirection: 'row',
//                               padding: heightPercentageToDP(1),
//                               justifyContent: 'space-between',
//                               alignItems: 'center',
//                             }}>
//                             <View
//                               style={{
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'flex-start',
//                                 paddingStart: heightPercentageToDP(1),
//                               }}>
//                               <Text style={styles.detailValue}>Playing</Text>
//                               <Text
//                                 numberOfLines={1}
//                                 style={styles.detailLabel}>
//                                 {gameName}
//                               </Text>
//                             </View>
//                             <View
//                               style={{
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'flex-start',
//                                 paddingStart: heightPercentageToDP(1),
//                               }}>
//                               <Text style={styles.detailValue}>Time</Text>
//                               <Text
//                                 numberOfLines={1}
//                                 style={styles.detailLabel}>
//                                 {getTimeAccordingToTimezone(
//                                   item?.powertime?.powertime,
//                                   user?.country?.timezone,
//                                 )}
//                               </Text>
//                             </View>
//                             <View style={styles.detailContainer}>
//                               <Text style={styles.detailValue}>
//                                 {item?.walletName
//                                   ? item?.forProcess === 'partnercredit'
//                                     ? 'Partner'
//                                     : 'Winner'
//                                   : 'Total Ticket'}
//                               </Text>
//                               <Text
//                                 numberOfLines={3}
//                                 style={styles.detailLabel}>
//                                 {item?.walletName
//                                   ? item?.forProcess === 'partnercredit'
//                                     ? 'Profit Credit'
//                                     : 'Ticket'
//                                   : item?.tickets.length}
//                               </Text>
//                             </View>
//                           </View>
//                           {/** PLAY NUMBER */}
//                           <View
//                             style={{
//                               flex: 1,
//                               borderBottomLeftRadius: heightPercentageToDP(2),
//                               borderBottomEndRadius: heightPercentageToDP(2),
//                               flexDirection: 'row',
//                               padding: heightPercentageToDP(1),
//                             }}>
//                             <View
//                               style={{
//                                 flex: 0.5,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'flex-start',
//                                 paddingStart: heightPercentageToDP(1),
//                               }}>
//                               <Text style={styles.detailValue}>No.</Text>
//                             </View>
//                             <View
//                               style={{
//                                 flex: 2,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'flex-start',
//                                 paddingStart: heightPercentageToDP(1),
//                               }}>
//                               <Text style={styles.detailValue}>Tickets</Text>
//                             </View>
//                             <View
//                               style={{
//                                 flex: 1,
//                                 justifyContent: 'flex-end',
//                                 alignItems: 'flex-end',
//                                 paddingStart: heightPercentageToDP(1),
//                               }}>
//                               <Text style={styles.detailValue}>Amount</Text>
//                             </View>
//                           </View>
//                           {item.tickets.map((pitem, pindex) => (
//                             <View
//                               key={pindex}
//                               style={{
//                                 borderBottomLeftRadius: heightPercentageToDP(2),
//                                 borderBottomEndRadius: heightPercentageToDP(2),
//                                 flexDirection: 'row',
//                                 padding: heightPercentageToDP(1),
//                               }}>
//                               <View
//                                 style={{
//                                   flex: 0.5,
//                                   justifyContent: 'flex-start',
//                                   alignItems: 'flex-start',
//                                   paddingStart: heightPercentageToDP(1),
//                                 }}>
//                                 <Text
//                                   style={{
//                                     ...styles.detailLabel,
//                                     fontFamily: FONT.Montserrat_SemiBold,
//                                   }}>
//                                   {pindex + 1}
//                                 </Text>
//                               </View>
//                               <View
//                                 style={{
//                                   flex: 2,
//                                   justifyContent: 'flex-start',
//                                   alignItems: 'flex-start',
//                                   paddingStart: heightPercentageToDP(1),
//                                 }}>
//                                 <Text style={styles.detailLabel}>
//                                   {pitem.usernumber.join(', ')}
//                                   {pitem.multiplier > 1
//                                     ? ` - ${pitem.multiplier}X `
//                                     : ''}
//                                 </Text>
//                               </View>
//                               <View
//                                 style={{
//                                   flex: 1,
//                                   justifyContent: 'flex-end',
//                                   alignItems: 'center',
//                                   paddingStart: heightPercentageToDP(1),
//                                 }}>
//                                 <Text style={styles.detailLabel}>
//                                   {pitem.amount}
//                                 </Text>
//                               </View>
//                             </View>
//                           ))}
//                           <View
//                             style={{
//                               height: 1,
//                               backgroundColor: COLORS.white_s,
//                               marginHorizontal: heightPercentageToDP(2),
//                               marginBottom: heightPercentageToDP(3),
//                               marginTop: heightPercentageToDP(1),
//                             }}
//                           />
//                         </>
//                       )}
//                     </LinearGradient>
//                   )}
//                 </>
//               )}
//               onEndReached={loadMore}
//               onEndReachedThreshold={0.4}
//               ListFooterComponent={() =>
//                 hasMore && isLoading ? (
//                   <ActivityIndicator size="large" color={COLORS.white_s} />
//                 ) : null
//               }
//             />
//           )}
//         </View>
//       </View>
//     </MainBackgroundWithoutScrollview>
//   );
// };

// export default PlayHistory;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
//   iconContainer: {
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(1),
//   },
//   expandIconContainer: {
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(0.6),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   detailContainer: {
//     width: '32%',
//     justifyContent: 'space-evenly',
//     paddingStart: heightPercentageToDP(2),
//   },
//   detailLabel: {
//     fontFamily: FONT.Montserrat_Regular,
//     color: COLORS.black,
//     fontSize: heightPercentageToDP(2),
//     textAlign: 'center',
//   },
//   detailValue: {
//     fontFamily: FONT.Montserrat_SemiBold,
//     color: COLORS.black,
//     fontSize: heightPercentageToDP(2),
//     textAlign: 'center',
//   },
// });
