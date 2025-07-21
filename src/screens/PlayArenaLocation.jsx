import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
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
import {COLORS, FONT} from '../../assets/constants';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Background from '../components/background/Background';
import Loading from '../components/helpercComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import LinearGradient from 'react-native-linear-gradient';
import {useGetAllLocationWithTimeQuery} from '../helper/Networkcall';
import {loadProfile} from '../redux/actions/userAction';
import {getTimeAccordingToTimezone} from './SearchTime';
import moment from 'moment-timezone';
import Toast from 'react-native-toast-message';
import {extractMultiplerFromLocation} from '../helper/HelperFunction';

const PlayArenaLocation = () => {
  const navigation = useNavigation();
  const {accesstoken, user} = useSelector(state => state.user);
  const [alldatafiler, setalldatafilter] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const dispatch = useDispatch();

  const isFocused = useIsFocused();
  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [isFocused]);

  const {data, error, isLoading} = useGetAllLocationWithTimeQuery(accesstoken);

  // FOR ALL FILTER TYPE DATA
  useEffect(() => {
    if (!isLoading && data) {
      const uniqueItems = new Set();
      const filtertype = [{_id: '123', maximumReturn: 'All'}]; // Default element

      data.locationData.forEach(item => {
        const key = extractMultiplerFromLocation(item.limit);
        if (!uniqueItems.has(key)) {
          uniqueItems.add(key);
          filtertype.push({
            _id: item._id,
            maximumReturn: extractMultiplerFromLocation(item.limit),
          });
        }
      });

      // Sorting the filtertype array
      filtertype.sort((a, b) => {
        if (a.maximumReturn === 'All') return -1;
        if (b.maximumReturn === 'All') return 1;
        const aReturn = parseFloat(a.maximumReturn.replace('x', ''));
        const bReturn = parseFloat(b.maximumReturn.replace('x', ''));
        return aReturn - bReturn;
      });

      setalldatafilter(filtertype);
      setSelectedFilter(filtertype[0]._id);

      console.log(filtertype);
    }
  }, [isLoading, data]);

  // const settingFilterData = itemf => {
  //   setSelectedFilter(itemf._id);
  //   if (itemf.maximumReturn.toLowerCase() === 'all') {
  //     setFilteredData(data?.locationData);
  //   } else {
  //     const filtered = data?.locationData.filter(item =>
  //       item.maximumReturn
  //         .toLowerCase()
  //         .includes(itemf.maximumReturn.toLowerCase()),
  //     );
  //     setFilteredData(filtered);
  //   }
  // };

  const settingFilterData = itemf => {
    setSelectedFilter(itemf._id);

    if (itemf.maximumReturn.toLowerCase() === 'all') {
      // Sort the data from highest to lowest when 'All' is selected
      const sortedData = [...(data?.locationData || [])].sort((a, b) => {
        const aReturn = parseFloat(a.maximumReturn.replace('x', ''));
        const bReturn = parseFloat(b.maximumReturn.replace('x', ''));
        return bReturn - aReturn; // Sort from highest to lowest
      });
      setFilteredData(sortedData);
    } else {
      const filtered = data?.locationData.filter(item =>
        extractMultiplerFromLocation(item.limit)
          .toLowerCase()
          .includes(itemf.maximumReturn.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navigationHandler = (item, timeItem) => {
    const now = moment.tz(user?.country?.timezone);
    console.log('Current Time: ', now.format('hh:mm A'));
    console.log('Current Date: ', now.format('DD-MM-YYYY'));

    const lotTimeMoment = moment.tz(
      getTimeAccordingToTimezone(timeItem?.time, user?.country?.timezone),
      'hh:mm A',
      user?.country?.timezone,
    );
    console.log(`Lot Time for location : ${lotTimeMoment.format('hh:mm A')}`);

    // Subtract 15 minutes from the lotTimeMoment
    const lotTimeMinus15Minutes = lotTimeMoment.clone().subtract(10, 'minutes');

    const isLotTimeClose =
      now.isSameOrAfter(lotTimeMinus15Minutes) && now.isBefore(lotTimeMoment);
    console.log(`Is it within 15 minutes of the lot time? ${isLotTimeClose}`);

    if (isLotTimeClose) {
      console.log('Navigating to PlayArena...');
      Toast.show({
        type: 'info',
        text1: 'Entry is close for this session',
        text2: 'Please choose next available time',
      });
    } else {
      console.log("It's too early or past the lot time.");
      navigation.navigate('PlayArena', {
        locationdata: item,
        timedata: timeItem,
      });
    }
  };

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = text => {
    const filtered = data?.locationData.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  // const getNextTimeForHighlights = times => {
  //   if (times.length === 1) {
  //     return times[0];
  //   }

  //   const currentISTTime = moment()
  //     .tz(user?.country?.timezone)
  //     .format('hh:mm A');
  //   const sortedTimes = [...times].sort((a, b) =>
  //     moment(a.time, 'hh:mm A').diff(moment(b.time, 'hh:mm A')),
  //   );

  //   for (let i = 0; i < sortedTimes.length; i++) {
  //     if (
  //       moment(currentISTTime, 'hh:mm A').isBefore(
  //         moment(sortedTimes[i].time, 'hh:mm A'),
  //       )
  //     ) {
  //       return sortedTimes[i];
  //     }
  //   }

  //   return sortedTimes[0];
  // };

  useEffect(() => {
    if (!isLoading && data) {
      const sortedData = [...(data?.locationData || [])].sort((a, b) => {
        const aReturn = parseFloat(a.maximumReturn.replace('x', ''));
        const bReturn = parseFloat(b.maximumReturn.replace('x', ''));
        return bReturn - aReturn; // Sort from highest to lowest
      });
      setFilteredData(sortedData); // Update filteredData whenever locations change
      // console.log(sortedData);
    }
  }, [data]);

  const mineTime = [
    {
      _id: '670e8fd50f88336e66f768f7',
      time: '09:00 AM',
      createdAt: '2024-10-15T15:52:53.843Z',
    },
    {
      _id: '670e8fe90f88336e66f7691b',
      time: '10:00 AM',
      createdAt: '2024-10-15T15:53:13.431Z',
    },
    {
      _id: '670e8ffd0f88336e66f76944',
      time: '11:00 AM',
      createdAt: '2024-10-15T15:53:33.059Z',
    },
    {
      _id: '670e90110f88336e66f76968',
      time: '12:00 PM',
      createdAt: '2024-10-15T15:53:53.407Z',
    },
    {
      _id: '670e90250f88336e66f769f4',
      time: '01:00 PM',
      createdAt: '2024-10-15T15:54:13.031Z',
    },
    {
      _id: '670e903d0f88336e66f76ad5',
      time: '02:00 PM',
      createdAt: '2024-10-15T15:54:37.328Z',
    },
    {
      _id: '670e90530f88336e66f76b02',
      time: '03:00 PM',
      createdAt: '2024-10-15T15:54:59.785Z',
    },
    {
      _id: '670e90a70f88336e66f76cdf',
      time: '04:00 PM',
      createdAt: '2024-10-15T15:56:23.596Z',
    },
    {
      _id: '670e90be0f88336e66f76d57',
      time: '05:00 PM',
      createdAt: '2024-10-15T15:56:46.347Z',
    },
    {
      _id: '670e90d00f88336e66f76d7b',
      time: '06:00 PM',
      createdAt: '2024-10-15T15:57:04.009Z',
    },
    {
      _id: '670e90ec0f88336e66f76da9',
      time: '07:00 PM',
      createdAt: '2024-10-15T15:57:32.637Z',
    },
    {
      _id: '670e910e0f88336e66f76e07',
      time: '08:00 PM',
      createdAt: '2024-10-15T15:58:06.613Z',
    },
    {
      _id: '670e91210f88336e66f76ebc',
      time: '09:00 PM',
      createdAt: '2024-10-15T15:58:25.305Z',
    },
    {
      _id: '670e91300f88336e66f76f4c',
      time: '10:00 PM',
      createdAt: '2024-10-15T15:58:40.841Z',
    },
    {
      _id: '670e91460f88336e66f76f73',
      time: '11:00 PM',
      createdAt: '2024-10-15T15:59:02.819Z',
    },
  ];

  // const getNextTimeForHighlights = times => {
  //   if (times.length === 1) {
  //     return times[0]; // If only one time, return that
  //   }

  //   // Get the current time in the user's timezone
  //   const currentISTTime = moment()
  //     .tz(user?.country?.timezone)
  //     .format('hh:mm A');

  //   // console.log("User's Timezone:", user?.country?.timezone); // Log the user's timezone
  //   console.log("Current Time in User's Timezone:", currentISTTime); // Log the current time

  //   // Sort the times based on the given time values
  //   const sortedTimes = [...times].sort((a, b) =>
  //     moment(a.time, 'hh:mm A').diff(moment(b.time, 'hh:mm A')),
  //   );

  //   // console.log("Sorted Times:", sortedTimes); // Log the sorted times for verification

  //   // Iterate over sorted times to find the next available time
  //   for (let i = 0; i < sortedTimes.length; i++) {
  //     const timeToCheck = moment(sortedTimes[i].time, 'hh:mm A');
  //     // console.log(`Checking time: ${sortedTimes[i].time}, formatted as: ${timeToCheck.format('hh:mm A')}`);

  //     if (moment(currentISTTime, 'hh:mm A').isBefore(timeToCheck)) {
  //       // console.log("Next available time found:", sortedTimes[i]);
  //       return sortedTimes[i]; // Return the first future time
  //     }
  //   }

  //   console.log(
  //     'No future time found, returning the first sorted time:',
  //     sortedTimes[0],
  //   );
  //   // If no future time found, return the first time (next day scenario)
  //   return sortedTimes[0];
  // };

  const getNextTimeForHighlights = (times, userTimezone) => {
    if (times.length === 1) {
      return times[0];
    }

    // Get the current time in the user's timezone
    const currentRiyadhTime = moment().tz(userTimezone).format('hh:mm A');
    console.log('Current time in usertimezone timezone:', currentRiyadhTime);

    // Convert each time from IST to user timezone (Asia/Riyadh)
    const convertedTimes = times.map(item => {
      const timeInIST = moment.tz(item.time, 'hh:mm A', 'Asia/Kolkata');
      const timeInRiyadh = timeInIST.clone().tz(userTimezone).format('hh:mm A');
      return {...item, convertedTime: timeInRiyadh};
    });

    // console.log('Converted times to Riyadh timezone:', convertedTimes);

    // Sort the times in the user's timezone
    const sortedTimes = convertedTimes.sort((a, b) =>
      moment(a.convertedTime, 'hh:mm A').diff(
        moment(b.convertedTime, 'hh:mm A'),
      ),
    );

    // console.log('Sorted times:', sortedTimes);

    // Find the next available time
    for (let i = 0; i < sortedTimes.length; i++) {
      if (
        moment(currentRiyadhTime, 'hh:mm A').isBefore(
          moment(sortedTimes[i].convertedTime, 'hh:mm A'),
        )
      ) {
        // console.log('Next available time found:', sortedTimes[i]);
        return sortedTimes[i]; // Return the first future time
      }
    }

    // console.log(
    //   'No future time found, returning the first sorted time:',
    //   sortedTimes[0],
    // );
    // If no future time found, return the first time (next day scenario)
    return sortedTimes[0];
  };

  // // Call the function with mineTime and user timezone
  // const nextTime = getNextTimeForHighlights(mineTime, 'Asia/Riyadh');
  // console.log("Next time:", nextTime);
  // console.log('check time');
  // console.log('time :: ', JSON.stringify(getNextTimeForHighlights(mineTime,"Asia/Riyadh")));
  // console.log(
  //   'time Arabia :: ',
  //   getTimeAccordingToTimezone(
  //     getNextTimeForHighlights(mineTime).time,
  //     user?.country?.timezone,
  //   ),
  // );

  const renderItem = ({item, index}) => {
    const groupedTimes = [];
    // for (let i = 0; i < item.times.length; i += 2) {
    //   groupedTimes.push(item.times.slice(i, i + 2));
    // }

    let alltime = [];

    alltime = [...item.times].sort((a, b) => {
      // Helper function to convert time to minutes for comparison
      const timeToMinutes = timeStr => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let total = hours * 60 + minutes;
        if (period === 'PM' && hours !== 12) total += 12 * 60;
        if (period === 'AM' && hours === 12) total -= 12 * 60;
        return total;
      };

      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
    for (let i = 0; i < alltime.length; i += 2) {
      groupedTimes.push(alltime.slice(i, i + 2));
    }

    const nextTime = getNextTimeForHighlights(
      item?.times,
      user?.country?.timezone,
    );

    return (
      <>
        <TouchableOpacity onPress={() => toggleItem(item._id)}>
          <LinearGradient
            colors={
              index % 2 === 0
                ? [COLORS.lightblue, COLORS.midblue]
                : [COLORS.lightyellow, COLORS.darkyellow]
            }
            start={{x: 0, y: 0}} // start from left
            end={{x: 1, y: 0}} // end at right
            style={styles.item}>
            <View style={{flex: 1.5}}>
              <Text
                style={{
                  color: COLORS.black,
                  fontFamily: FONT.Montserrat_SemiBold,
                  fontSize: heightPercentageToDP(2.5),
                }}>
                {item.name}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: COLORS.black,
                  fontFamily: FONT.Montserrat_Regular,
                  fontSize: heightPercentageToDP(2),
                  textAlignVertical: 'center',
                  alignSelf: 'flex-end',
                }}>
                {extractMultiplerFromLocation(item.limit)} Win
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {expandedItems[item._id] && (
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <ImageBackground
              source={require('../../assets/image/tlwbg.jpg')}
              imageStyle={{
                borderRadius: heightPercentageToDP(3),
                margin: heightPercentageToDP(2),
              }}
              style={{flex: 1}} // Ensures the overlay covers the entire image
            >
              {/* Transparent Black Overlay */}
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
                  borderRadius: heightPercentageToDP(3),
                  margin: heightPercentageToDP(2),
                }}
              />

              <View
                style={{
                  backgroundColor: 'transparent',
                  margin: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(5),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {groupedTimes.length === 0 ? (
                  <GradientTextWhite
                    style={{
                      ...styles.textStyle,
                      height: heightPercentageToDP(15),
                      textAlignVertical: 'center',
                      textAlign: 'center',
                      alignItems: 'center',
                    }}>
                    No Available time
                  </GradientTextWhite>
                ) : (
                  groupedTimes.map((pair, idx) => (
                    <View key={idx} style={[styles.timeRow]}>
                      {pair.map(timeItem => (
                        <TouchableOpacity
                          key={timeItem._id}
                          onPress={() => navigationHandler(item, timeItem)}
                          style={{
                            borderColor:
                              timeItem.time === nextTime.time
                                ? COLORS.red
                                : 'transparent',
                            borderWidth:
                              timeItem.time === nextTime.time ? 2 : 2,
                            borderRadius: heightPercentageToDP(2),
                            overflow: 'hidden',
                          }}>
                          <LinearGradient
                            colors={
                              idx % 2 === 0
                                ? [COLORS.lightblue, COLORS.midblue]
                                : [COLORS.lightyellow, COLORS.darkyellow]
                            }
                            start={{x: 0, y: 0}} // start from left
                            end={{x: 1, y: 0}} // end at right
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: heightPercentageToDP(2),
                              opacity: 1,
                              paddingVertical: heightPercentageToDP(2),
                              paddingHorizontal: heightPercentageToDP(2),
                              borderRadius: heightPercentageToDP(1),
                            }}>
                            <Text
                              style={{
                                color: COLORS.black,
                                fontFamily: FONT.Montserrat_Regular,
                                fontSize: heightPercentageToDP(1.8),
                                textAlignVertical: 'center',
                              }}>
                              {getTimeAccordingToTimezone(
                                timeItem.time,
                                user?.country?.timezone,
                              )}
                            </Text>
                            <Text
                              style={{
                                color: COLORS.black,
                                fontFamily: FONT.Montserrat_Regular,
                                fontSize: heightPercentageToDP(1.8),
                                textAlignVertical: 'center',
                              }}>
                              Play
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        //   <TouchableOpacity
                        //   key={timeItem._id}
                        //   onPress={() => navigationHandler(item, timeItem)}
                        //   style={{
                        //     borderRadius: heightPercentageToDP(2), // Move borderRadius here
                        //     overflow: 'hidden', // Ensure content stays inside rounded corners
                        //     borderColor:
                        //       timeItem.time === nextTime.time ? COLORS.red : COLORS.transparent,
                        //     borderWidth: timeItem.time === nextTime.time ? 2 : 0,
                        //   }}>
                        //   <LinearGradient
                        //     colors={
                        //       idx % 2 === 0
                        //         ? [COLORS.lightblue, COLORS.midblue]
                        //         : [COLORS.lightyellow, COLORS.darkyellow]
                        //     }
                        //     start={{ x: 0, y: 0 }}
                        //     end={{ x: 1, y: 0 }}
                        //     style={{
                        //       flexDirection: 'row',
                        //       justifyContent: 'space-between',
                        //       alignItems: 'center',
                        //       // Fixed height for container
                        //       paddingVertical: heightPercentageToDP(2),
                        //       paddingHorizontal: heightPercentageToDP(2), // Control horizontal padding for content
                        //     }}>
                        //     <Text
                        //       style={{
                        //         color: COLORS.black,
                        //         fontFamily: FONT.Montserrat_Regular,
                        //         fontSize: heightPercentageToDP(1.8),
                        //         textAlignVertical: 'center',
                        //       }}>
                        //       {getTimeAccordingToTimezone(timeItem.time, user?.country?.timezone)}
                        //     </Text>
                        //     <Text
                        //       style={{
                        //         color: COLORS.black,
                        //         fontFamily: FONT.Montserrat_Regular,
                        //         fontSize: heightPercentageToDP(1.8),
                        //         textAlignVertical: 'center',
                        //       }}>
                        //       Play
                        //     </Text>
                        //   </LinearGradient>
                        // </TouchableOpacity>
                      ))}
                    </View>
                  ))
                )}
              </View>
            </ImageBackground>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
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
                }}></View>
            </View>

            <View
              style={{
                height: heightPercentageToDP(21),
                margin: heightPercentageToDP(2),
                marginTop: heightPercentageToDP(-1.5),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Search
              </GradientTextWhite>

              <View
                style={{
                  height: heightPercentageToDP(7),
                  flexDirection: 'row',
                  backgroundColor: COLORS.white_s,
                  alignItems: 'center',
                  paddingHorizontal: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(1),
                  marginTop: heightPercentageToDP(1),
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
                  placeholder="Search for location"
                  placeholderTextColor={COLORS.black}
                  label="Search"
                  onChangeText={handleSearch}
                />
              </View>

              {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  alignItems: 'center',
                  paddingHorizontal: heightPercentageToDP(3),
                 
                }}
                style={{
                  height: heightPercentageToDP(7),
                  backgroundColor: COLORS.white_s,
                  borderRadius: heightPercentageToDP(3),
                  marginTop: heightPercentageToDP(2),
                  overflow: 'hidden',
                }}>
                {alldatafiler.map(item => (
                  <TouchableOpacity
                    onPress={() => settingFilterData(item)}
                    key={item._id}
                    style={{
                      backgroundColor: COLORS.grayHalfBg,
                      padding: heightPercentageToDP(1),
                      margin: heightPercentageToDP(0.2),
                      borderRadius: heightPercentageToDP(1),
                      borderColor:
                        selectedFilter == item._id
                          ? COLORS.green
                          : COLORS.grayHalfBg,
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(1.5),
                        color: COLORS.black,
                        paddingHorizontal: heightPercentageToDP(0.5),
                      }}>
                      {item.maximumReturn}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView> */}

              <View
                style={{
                  height: heightPercentageToDP(6),
                  backgroundColor: COLORS.white_s,
                  borderRadius: heightPercentageToDP(3),
                  marginTop: heightPercentageToDP(2),
                  overflow: 'hidden', // Ensures content stays inside the rounded container
                }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    alignItems: 'center',
                    paddingHorizontal: heightPercentageToDP(1),
                  }}>
                  {alldatafiler.map(item => (
                    <TouchableOpacity
                      onPress={() => settingFilterData(item)}
                      key={item._id}
                      style={{
                        backgroundColor: COLORS.grayHalfBg,
                        padding: heightPercentageToDP(1),
                        margin: heightPercentageToDP(0.2),
                        borderRadius: heightPercentageToDP(1),
                        borderColor:
                          selectedFilter == item._id
                            ? COLORS.green
                            : COLORS.grayHalfBg,
                        borderWidth: 1,
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(1.5),
                          color: COLORS.black,
                          paddingHorizontal: heightPercentageToDP(0.5),
                        }}>
                        {item.maximumReturn}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={{flex: 2}}>
              {isLoading ? (
                <Loading />
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={renderItem}
                  keyExtractor={item => item._id}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  ListFooterComponent={() => (
                    <View style={{height: 100}}></View>
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

export default PlayArenaLocation;

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
    flexDirection: 'row',
  },
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },
  timeRow: {
    flexDirection: 'row',
    marginBottom: 4,
    borderRadius: 4,
    padding: 4,
    gap: heightPercentageToDP(2),
    margin: heightPercentageToDP(2),
  },
  time: {
    fontSize: 14,
    marginRight: 8,
    padding: 4,
    backgroundColor: '#ccc',
    borderRadius: 4,
    flex: 1,
    textAlign: 'center',
  },
});

// import {
//   FlatList,
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../assets/constants';
// import GradientText from '../components/helpercComponent/GradientText';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import Toast from 'react-native-toast-message';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import Background from '../components/background/Background';
// import Loading from '../components/helpercComponent/Loading';
// import {useDispatch, useSelector} from 'react-redux';
// import {getAllLocations} from '../redux/actions/locationAction';
// import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
// import LinearGradient from 'react-native-linear-gradient';
// import {getTimeAccordingLocation} from '../redux/actions/timeAction';

// const datatypefilter = [
//   {
//     id: 'all',
//     val: 'All',
//   },
//   {
//     id: '2x',
//     val: '2X',
//   },
//   {
//     id: '5x',
//     val: '5X',
//   },
//   {
//     id: '10x',
//     val: '10X',
//   },
//   {
//     id: '50x',
//     val: '50X',
//   },
//   {
//     id: '100x',
//     val: '100X',
//   },
//   {
//     id: '200x',
//     val: '200X',
//   },
// ];

// const locationdata = [
//   {
//     id: '1',
//     name: 'Canada',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '2',
//     name: 'Japan',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '3',
//     name: 'Punjab',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '4',
//     name: 'Pune',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '5',
//     name: 'China',
//     limit: '100 - 100X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },

//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '6',
//     name: 'India',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },

//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '7',
//     name: 'USA',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//     ],
//   },
//   {
//     id: '8',
//     name: 'Korea',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
// ];

// const PlayArenaLocation = () => {
//   const navigation = useNavigation();
//   const [selectedFilter, setSelectedFilter] = useState(datatypefilter[0].id);
//   // For Selecting filter based data
//   const settingFilterData = item => {
//     setSelectedFilter(item.id);
//   };

//   const [expandedItems, setExpandedItems] = useState({});

//   const toggleItem = id => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Background />

//       {/** Main Cointainer */}

//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         <ImageBackground
//           source={require('../../assets/image/tlwbg.jpg')}
//           style={{
//             width: '100%',
//             height: heightPercentageToDP(85),
//           }}
//           imageStyle={{
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderTopRightRadius: heightPercentageToDP(5),
//           }}>
//           <View
//             style={{
//               height: heightPercentageToDP(85),
//               width: widthPercentageToDP(100),

//               borderTopLeftRadius: heightPercentageToDP(5),
//               borderTopRightRadius: heightPercentageToDP(5),
//             }}>
//             {/** Top Style View */}
//             <View
//               style={{
//                 height: heightPercentageToDP(5),
//                 width: widthPercentageToDP(100),
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <View
//                 style={{
//                   width: widthPercentageToDP(20),
//                   height: heightPercentageToDP(0.8),
//                   backgroundColor: COLORS.grayBg,
//                   borderRadius: heightPercentageToDP(2),
//                 }}></View>
//             </View>

//             {/** Content Container */}

//             <View
//               style={{
//                 height: heightPercentageToDP(21),
//                 margin: heightPercentageToDP(2),
//               }}>
//               <GradientTextWhite style={styles.textStyle}>
//                 Search
//               </GradientTextWhite>

//               <View
//                 style={{
//                   height: heightPercentageToDP(7),
//                   flexDirection: 'row',
//                   backgroundColor: COLORS.white_s,
//                   alignItems: 'center',
//                   paddingHorizontal: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(1),
//                   marginTop: heightPercentageToDP(1),
//                 }}>
//                 <Fontisto
//                   name={'search'}
//                   size={heightPercentageToDP(3)}
//                   color={COLORS.darkGray}
//                 />
//                 <TextInput
//                   style={{
//                     marginStart: heightPercentageToDP(1),
//                     flex: 1,
//                     fontFamily: FONT.Montserrat_Regular,
//                     fontSize: heightPercentageToDP(2.5),
//                     color: COLORS.black,
//                   }}
//                   placeholder="Search for location"
//                   placeholderTextColor={COLORS.black}
//                   label="Search"
//                 />
//               </View>

//               {/** Filter Data based upon power */}
//               <View
//                 style={{
//                   height: heightPercentageToDP(7),
//                   flexDirection: 'row',
//                   backgroundColor: COLORS.white_s,
//                   alignItems: 'center',
//                   justifyContent: 'center',

//                   borderRadius: heightPercentageToDP(3),
//                   marginTop: heightPercentageToDP(2),
//                 }}>
//                 {datatypefilter.map((item, index) => (
//                   <TouchableOpacity
//                     onPress={() => settingFilterData(item)}
//                     key={item.id}
//                     style={{
//                       backgroundColor: COLORS.grayHalfBg,
//                       padding: heightPercentageToDP(1),
//                       margin: heightPercentageToDP(0.2),
//                       borderRadius: heightPercentageToDP(1),
//                       borderColor:
//                         selectedFilter == item.id
//                           ? COLORS.green
//                           : COLORS.grayHalfBg,
//                       borderWidth: 1,
//                     }}>
//                     <Text
//                       style={{
//                         fontFamily: FONT.Montserrat_Regular,
//                         fontSize: heightPercentageToDP(1.5),
//                         color: COLORS.black,
//                         paddingHorizontal: heightPercentageToDP(0.5),
//                       }}>
//                       {item.val}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             <View
//               style={{
//                 flex: 2,
//               }}>
//               {false ? (
//                 <Loading />
//               ) : (
//                 <FlatList
//                   data={locationdata}
//                   renderItem={({item, index}) => (
//                     <>
//                       <TouchableOpacity onPress={() => toggleItem(item.id)}>
//                         <LinearGradient
//                           colors={
//                             index % 2 === 0
//                               ? [COLORS.lightblue, COLORS.midblue]
//                               : [COLORS.lightyellow, COLORS.darkyellow]
//                           }
//                           style={{
//                             ...styles.item,
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                           }}>
//                           <View
//                             style={{
//                               flex: 1.5,
//                             }}>
//                             <Text
//                               style={{
//                                 color: COLORS.black,
//                                 fontFamily: FONT.Montserrat_SemiBold,
//                                 fontSize: heightPercentageToDP(2.5),
//                               }}>
//                               {item.name}
//                             </Text>
//                           </View>

//                           <View
//                             style={{
//                               flex: 1,
//                             }}>
//                             <Text
//                               style={{
//                                 color: COLORS.black,
//                                 fontFamily: FONT.Montserrat_Regular,
//                                 fontSize: heightPercentageToDP(2),
//                               }}>
//                               Max {item.limit}
//                             </Text>
//                           </View>
//                         </LinearGradient>
//                       </TouchableOpacity>

//                       {expandedItems[item.id] && (
//                         <View
//                           style={{
//                             backgroundColor: 'cyan',
//                             margin: heightPercentageToDP(2),
//                             borderRadius: heightPercentageToDP(2),
//                           }}>
//                           {item.times.map((item, index) => (
//                             <LinearGradient
//                               colors={[COLORS.lightblue, COLORS.midblue]}
//                               style={{
//                                 ...styles.item,
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                               }}>
//                               <View
//                                 style={{
//                                   flex: 1.5,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_SemiBold,
//                                     fontSize: heightPercentageToDP(2.5),
//                                   }}>
//                                   {item.time}
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                           ))}
//                         </View>
//                       )}
//                     </>
//                   )}
//                   keyExtractor={item => item._id}
//                   initialNumToRender={10} // Render initial 10 items
//                   maxToRenderPerBatch={10} // Batch size to render
//                   windowSize={10} // Number of items kept in memory
//                 />
//               )}
//             </View>
//           </View>
//         </ImageBackground>
//       </View>
//     </View>
//   );
// };

// export default PlayArenaLocation;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     height: heightPercentageToDP(20),
//   },
//   item: {
//     padding: heightPercentageToDP(2),
//     marginVertical: heightPercentageToDP(1),
//     marginHorizontal: heightPercentageToDP(2),
//     borderRadius: heightPercentageToDP(1),
//   },
//   title: {
//     color: COLORS.white_s,
//     fontFamily: FONT.SF_PRO_MEDIUM,
//   },
// });

// // import {
// //   FlatList,
// //   ImageBackground,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from 'react-native';
// // import React, {useEffect, useState} from 'react';
// // import {
// //   heightPercentageToDP,
// //   widthPercentageToDP,
// // } from 'react-native-responsive-screen';
// // import {COLORS, FONT} from '../../assets/constants';
// // import GradientText from '../components/helpercComponent/GradientText';
// // import Fontisto from 'react-native-vector-icons/Fontisto';
// // import Toast from 'react-native-toast-message';
// // import {useIsFocused, useNavigation} from '@react-navigation/native';
// // import Background from '../components/background/Background';
// // import Loading from '../components/helpercComponent/Loading';
// // import {useDispatch, useSelector} from 'react-redux';
// // import {getAllLocations} from '../redux/actions/locationAction';
// // import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { getTimeAccordingLocation } from '../redux/actions/timeAction';

// // const datatypefilter = [
// //   {
// //     id: 'all',
// //     val: 'All',
// //   },
// //   {
// //     id: '2x',
// //     val: '2X',
// //   },
// //   {
// //     id: '5x',
// //     val: '5X',
// //   },
// //   {
// //     id: '10x',
// //     val: '10X',
// //   },
// //   {
// //     id: '50x',
// //     val: '50X',
// //   },
// //   {
// //     id: '100x',
// //     val: '100X',
// //   },
// //   {
// //     id: '200x',
// //     val: '200X',
// //   },
// // ];

// // const PlayArenaLocation = () => {
// //   const navigation = useNavigation();
// //   const dispatch = useDispatch();

// //   const [selectedFilter, setSelectedFilter] = useState(datatypefilter[0].id);

// //   const {accesstoken} = useSelector(state => state.user);
// //   const {loading, locations} = useSelector(state => state.location);

// //   // const [filteredData, setFilteredData] = useState(locations);
// //   const [filteredData, setFilteredData] = useState([]);

// //   const handleSearch = text => {
// //     const filtered = locations.filter(item =>
// //       item.lotlocation.toLowerCase().includes(text.toLowerCase()),
// //     );
// //     setFilteredData(filtered);
// //   };

// //   const focused = useIsFocused();

// //   useEffect(() => {
// //     dispatch(getAllLocations(accesstoken));
// //   }, [dispatch, focused]);

// //   useEffect(() => {
// //     setFilteredData(locations); // Update filteredData whenever locations change
// //   }, [locations]);

// //   const submitHandler = () => {
// //     Toast.show({
// //       type: 'success',
// //       text1: 'Searching',
// //     });
// //   };

// // // For Selecting filter based data
// // const settingFilterData = item => {
// //   setSelectedFilter(item.id);
// // };

// //   useEffect(() => {
// //     console.log('useEffect Running');
// //   }, [selectedFilter]);

// //   const data = [
// //     'Item 1', 'Item 2', 'Item 3', 'Item 4',
// //     'Item 5', 'Item 6', 'Item 7', 'Item 8',
// //   ];

// //   const groupedData = [];
// //   for (let i = 0; i < data.length; i += 2) {
// //     groupedData.push(data.slice(i, i + 2));
// //   }

// //   useEffect(() => {

// //   }, [dispatch]);

// //   const getTimeOFLocation = () => {
// //     dispatch(getTimeAccordingLocation(accesstoken, locationdata._id));
// //   }

// //   return (
// //     <View style={{flex: 1}}>
// //       <Background />

// //       {/** Main Cointainer */}

// //       <View style={{flex: 1, justifyContent: 'flex-end'}}>
// //         <ImageBackground
// //           source={require('../../assets/image/tlwbg.jpg')}
// //           style={{
// //             width: '100%',
// //             height: heightPercentageToDP(85),
// //           }}
// //           imageStyle={{
// //             borderTopLeftRadius: heightPercentageToDP(5),
// //             borderTopRightRadius: heightPercentageToDP(5),
// //           }}>
// //           <View
// //             style={{
// //               height: heightPercentageToDP(85),
// //               width: widthPercentageToDP(100),

// //               borderTopLeftRadius: heightPercentageToDP(5),
// //               borderTopRightRadius: heightPercentageToDP(5),
// //             }}>
// //             {/** Top Style View */}
// //             <View
// //               style={{
// //                 height: heightPercentageToDP(5),
// //                 width: widthPercentageToDP(100),
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //               }}>
// //               <View
// //                 style={{
// //                   width: widthPercentageToDP(20),
// //                   height: heightPercentageToDP(0.8),
// //                   backgroundColor: COLORS.grayBg,
// //                   borderRadius: heightPercentageToDP(2),
// //                 }}></View>
// //             </View>

// //             {/** Content Container */}

// //             <View
// //               style={{
// //                 height: heightPercentageToDP(21),
// //                 margin: heightPercentageToDP(2),
// //               }}>
// //               <GradientTextWhite style={styles.textStyle}>
// //                 Search
// //               </GradientTextWhite>

// //               <View
// //                 style={{
// //                   height: heightPercentageToDP(7),
// //                   flexDirection: 'row',
// //                   backgroundColor: COLORS.white_s,
// //                   alignItems: 'center',
// //                   paddingHorizontal: heightPercentageToDP(2),
// //                   borderRadius: heightPercentageToDP(1),
// //                   marginTop: heightPercentageToDP(1),
// //                 }}>
// //                 <Fontisto
// //                   name={'search'}
// //                   size={heightPercentageToDP(3)}
// //                   color={COLORS.darkGray}
// //                 />
// //                 <TextInput
// //                   style={{
// //                     marginStart: heightPercentageToDP(1),
// //                     flex: 1,
// //                     fontFamily: FONT.Montserrat_Regular,
// //                     fontSize: heightPercentageToDP(2.5),
// //                     color: COLORS.black,
// //                   }}
// //                   placeholder="Search for location"
// //                   placeholderTextColor={COLORS.black}
// //                   label="Search"
// //                   onChangeText={handleSearch}
// //                 />
// //               </View>

// //               {/** Filter Data based upon power */}
// //               <View
// //                 style={{
// //                   height: heightPercentageToDP(7),
// //                   flexDirection: 'row',
// //                   backgroundColor: COLORS.white_s,
// //                   alignItems: 'center',
// //                   justifyContent: 'center',

// //                   borderRadius: heightPercentageToDP(3),
// //                   marginTop: heightPercentageToDP(2),
// //                 }}>
// //                 {datatypefilter.map((item, index) => (
// //                   <TouchableOpacity
// //                     onPress={() => settingFilterData(item)}
// //                     key={item.id}
// //                     style={{
// //                       backgroundColor: COLORS.grayHalfBg,
// //                       padding: heightPercentageToDP(1),
// //                       margin: heightPercentageToDP(0.2),
// //                       borderRadius: heightPercentageToDP(1),
// //                       borderColor:
// //                         selectedFilter == item.id
// //                           ? COLORS.green
// //                           : COLORS.grayHalfBg,
// //                       borderWidth: 1,
// //                     }}>
// //                     <Text
// //                       style={{
// //                         fontFamily: FONT.Montserrat_Regular,
// //                         fontSize: heightPercentageToDP(1.5),
// //                         color: COLORS.black,
// //                         paddingHorizontal: heightPercentageToDP(0.5),
// //                       }}>
// //                       {item.val}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //             </View>

// //             <View
// //               style={{
// //                 flex: 2,
// //               }}>
// //               {loading ? (
// //                 <Loading />
// //               ) : (
// //                 <FlatList
// //                   data={filteredData}
// //                   renderItem={({item, index}) => (
// //                     <>
// //                     <TouchableOpacity
// //                       onPress={() =>
// //                         navigation.navigate('SearchTime', {
// //                           locationdata: item,
// //                         })
// //                       }>
// //                       <LinearGradient
// //                         colors={
// //                           index % 2 === 0
// //                             ? [COLORS.lightblue, COLORS.midblue]
// //                             : [COLORS.lightyellow, COLORS.darkyellow]
// //                         }
// //                         style={{
// //                           ...styles.item,
// //                           flexDirection: 'row',
// //                           justifyContent: 'space-between',
// //                         }}>
// //                         <View
// //                           style={{
// //                             flex: 1.5,
// //                           }}>
// //                           <Text
// //                             style={{
// //                               color: COLORS.black,
// //                               fontFamily: FONT.Montserrat_SemiBold,
// //                               fontSize: heightPercentageToDP(2.5),
// //                             }}>
// //                             {item.lotlocation}
// //                           </Text>
// //                         </View>

// //                         <View
// //                           style={{
// //                             flex: 1,
// //                           }}>
// //                           <Text
// //                             style={{
// //                               color: COLORS.black,
// //                               fontFamily: FONT.Montserrat_Regular,
// //                               fontSize: heightPercentageToDP(2),
// //                             }}>
// //                             Max {item.maximumRange}
// //                           </Text>
// //                         </View>
// //                       </LinearGradient>
// //                     </TouchableOpacity>

// //                     <View
// //                     style={{height: heightPercentageToDP(20),
// //                     backgroundColor: 'cyan',
// //                   margin: heightPercentageToDP(2),
// //                 borderRadius: heightPercentageToDP(2)}}
// //                     >

// //                     </View>

// //                     </>
// //                   )}
// //                   keyExtractor={item => item._id}
// //                   initialNumToRender={10} // Render initial 10 items
// //                   maxToRenderPerBatch={10} // Batch size to render
// //                   windowSize={10} // Number of items kept in memory
// //                 />
// //               )}
// //             </View>
// //           </View>
// //         </ImageBackground>
// //       </View>
// //     </View>
// //   );
// // };

// // export default PlayArenaLocation;

// // const styles = StyleSheet.create({
// //   textStyle: {
// //     fontSize: heightPercentageToDP(4),
// //     fontFamily: FONT.Montserrat_Bold,
// //     color: COLORS.black,
// //   },
// //   container: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginTop: 20,
// //     height: heightPercentageToDP(20),
// //   },
// //   item: {
// //     padding: heightPercentageToDP(2),
// //     marginVertical: heightPercentageToDP(1),
// //     marginHorizontal: heightPercentageToDP(2),
// //     borderRadius: heightPercentageToDP(1),
// //   },
// //   title: {
// //     color: COLORS.white_s,
// //     fontFamily: FONT.SF_PRO_MEDIUM,
// //   },
// // });
