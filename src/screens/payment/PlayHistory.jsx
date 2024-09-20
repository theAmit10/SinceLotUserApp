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
import {useGetPlayHistoryQuery} from '../../helper/Networkcall';
import NoDataFound from '../../components/helpercComponent/NoDataFound';
import {getTimeAccordingToTimezone} from '../SearchTime';

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

  const {
    data: historyapidatas,
    error,
    isLoading,
    refetch,
  } = useGetPlayHistoryQuery(accesstoken);

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
                              color={COLORS.darkGray}
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
                                Amount
                              </Text>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Bold,
                                  fontSize: heightPercentageToDP(2),
                                  color: COLORS.black,
                                  width: '70%',
                                }}
                                numberOfLines={2}>
                                : {calculateTotalAmount(item.playnumbers)}{' '}
                                {user.country.countrycurrencysymbol}
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
                                {formatDate(item.lotdate.lotdate)}
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
                                {item.lotlocation.lotlocation}
                              </Text>
                            </View>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailValue}>Time</Text>
                              <Text
                                numberOfLines={1}
                                style={styles.detailLabel}>
                                {getTimeAccordingToTimezone(
                                  item.lottime.lottime,
                                  user?.country?.timezone,
                                )}
                              </Text>
                            </View>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailValue}>Total Bets</Text>
                              <Text
                                numberOfLines={3}
                                style={styles.detailLabel}>
                                {item.playnumbers.length}
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
                                borderBottomLeftRadius: heightPercentageToDP(2),
                                borderBottomEndRadius: heightPercentageToDP(2),
                                flexDirection: 'row',
                                padding: heightPercentageToDP(1),
                               
                              }}>
                              <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel,fontFamily: FONT.Montserrat_SemiBold}}>
                                  {pitem.playnumber}
                                </Text>
                              </View>
                              <View style={styles.detailContainer}>
                                <Text style={styles.detailLabel}>
                                  {pitem.amount}
                                </Text>
                              </View>
                              <View style={styles.detailContainer}>
                                <Text style={styles.detailLabel}>
                                  {pitem.winningamount}
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
                              marginTop: heightPercentageToDP(1)
                             
                            }}
                          />

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
    textAlign : 'center'
  },
  detailValue: {
    fontFamily: FONT.Montserrat_SemiBold,
    color: COLORS.black,
    fontSize: heightPercentageToDP(2),
    textAlign : 'center'
  },
});
