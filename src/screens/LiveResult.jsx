import {
  Alert,
  FlatList,
  ImageBackground,
  Linking,
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

const LiveResult = () => {
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
        const key = item.maximumReturn;
        if (!uniqueItems.has(key)) {
          uniqueItems.add(key);
          filtertype.push({_id: item._id, maximumReturn: item.maximumReturn});
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
        item.maximumReturn
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

  // const navigationHandler = (item, timeItem) => {
  //   const now = moment.tz(user?.country?.timezone);
  //   console.log('Current Time: ', now.format('hh:mm A'));
  //   console.log('Current Date: ', now.format('DD-MM-YYYY'));

  //   const lotTimeMoment = moment.tz(
  //     getTimeAccordingToTimezone(timeItem?.time, user?.country?.timezone),
  //     'hh:mm A',
  //     user?.country?.timezone,
  //   );
  //   console.log(`Lot Time for location : ${lotTimeMoment.format('hh:mm A')}`);

  //   // Subtract 15 minutes from the lotTimeMoment
  //   const lotTimeMinus15Minutes = lotTimeMoment.clone().subtract(10, 'minutes');

  //   const isLotTimeClose =
  //     now.isSameOrAfter(lotTimeMinus15Minutes) && now.isBefore(lotTimeMoment);
  //   console.log(`Is it within 15 minutes of the lot time? ${isLotTimeClose}`);

  //   if (isLotTimeClose) {
  //     console.log('Navigating to PlayArena...');
  //     Toast.show({
  //       type: 'info',
  //       text1: 'Entry is close for this session',
  //       text2: 'Please choose next available time',
  //     });
  //   } else {
  //     console.log("It's too early or past the lot time.");
  //     navigation.navigate('PlayArena', {
  //       locationdata: item,
  //       timedata: timeItem,
  //     });
  //   }
  // };

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

    const timerinMinutes = timeItem.liveresulttimer;

    // Subtract 15 minutes from the lotTimeMoment
    const lotTimeMinus15Minutes = lotTimeMoment
      .clone()
      .subtract(timerinMinutes, 'minutes');

    const isLotTimeClose =
      now.isSameOrAfter(lotTimeMinus15Minutes) && now.isBefore(lotTimeMoment);
    console.log(`Is it within 15 minutes of the lot time? ${isLotTimeClose}`);

    if (isLotTimeClose) {
      console.log('Navigating to PlayArena...');
      console.log(JSON.stringify(timeItem.liveresultlink));
      openLink(timeItem.liveresultlink);
      Toast.show({
        type: 'info',
        text1: 'Getting Live Result',
        text2: 'Searching for the live result',
      });
    } else {
      console.log("It's too early or past the lot time.");
      // navigation.navigate('PlayArena', {
      //   locationdata: item,
      //   timedata: timeItem,
      // });
      // console.log(JSON.stringify(timeItem.liveresultlink));
      // openLink(timeItem.liveresultlink);
      Toast.show({
        type: 'info',
        text1: 'Live Result',
        text2: 'It too early or past the time.',
      });
    }
  };

  const openLink = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Can't open this URL: ${url}`);
    }
  };

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = text => {
    const filtered = data?.locationData.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

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

  // For Blinking button

  const BlinkingButton = ({
    timeItem,
    nextTime,
    navigationHandler,
    item,
    user,
    idx,
  }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [shouldBlink, setShouldBlink] = useState(false);

    useEffect(() => {
      if (!nextTime || !nextTime.time || !user?.country?.timezone) return;

      const checkTimeDifference = () => {
        const userTimezone = user.country.timezone;
        const nextTimeInUserTZ = moment.tz(
          nextTime.time,
          'hh:mm A',
          userTimezone,
        );
        const currentTimeInUserTZ = moment().tz(userTimezone);

        const timeDifference = nextTimeInUserTZ.diff(
          currentTimeInUserTZ,
          'minutes',
        );

        console.log('Time Difference:', timeDifference); // Debugging

        const timerinMinutes = timeItem.liveresulttimer || 10;

        setShouldBlink(timeDifference > 0 && timeDifference <= timerinMinutes);
      };

      checkTimeDifference();
      const timer = setInterval(checkTimeDifference, 10000); // Check every 10s

      return () => clearInterval(timer);
    }, [nextTime, user]);

    useEffect(() => {
      let interval;
      if (shouldBlink) {
        interval = setInterval(() => {
          setIsBlinking(prev => !prev);
        }, 500); // Blinking interval
      } else {
        setIsBlinking(false);
      }

      return () => clearInterval(interval);
    }, [shouldBlink]);

    return (
      <TouchableOpacity
        key={timeItem._id}
        onPress={() => navigationHandler(item, timeItem)}
        style={{
          borderColor:
            timeItem.time === nextTime.time
              ? isBlinking
                ? 'transparent'
                : COLORS.white_s
              : 'transparent',
          borderWidth: timeItem.time === nextTime.time ? 2 : 2,
          borderRadius: heightPercentageToDP(2),
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={
            idx % 2 === 0
              ? [COLORS.lightblue, COLORS.midblue]
              : [COLORS.lightyellow, COLORS.darkyellow]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
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
            {moment
              .tz(timeItem.time, 'hh:mm A', user?.country?.timezone)
              .format('hh:mm A')}
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
    );
  };

  // const BlinkingButton = ({
  //   timeItem,
  //   nextTime,
  //   navigationHandler,
  //   item,
  //   user,
  //   idx,
  // }) => {
  //   const [isBlinking, setIsBlinking] = useState(false);

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setIsBlinking(prev => !prev); // Toggle the blinking state
  //     }, 500); // Blinking interval in milliseconds

  //     return () => clearInterval(interval); // Cleanup the interval on component unmount
  //   }, []);

  //   return (
  //     <TouchableOpacity
  //       key={timeItem._id}
  //       onPress={() => navigationHandler(item, timeItem)}
  //       style={{
  //         borderColor:
  //           timeItem.time === nextTime.time
  //             ? isBlinking
  //               ? 'transparent' // Off state
  //               : COLORS.white_s // On state
  //             : 'transparent',
  //         borderWidth: timeItem.time === nextTime.time ? 2 : 2,
  //         borderRadius: heightPercentageToDP(2),
  //         overflow: 'hidden',
  //       }}>
  //       <LinearGradient
  //         colors={
  //           idx % 2 === 0
  //             ? [COLORS.lightblue, COLORS.midblue]
  //             : [COLORS.lightyellow, COLORS.darkyellow]
  //         }
  //         start={{x: 0, y: 0}}
  //         end={{x: 1, y: 0}}
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           alignItems: 'center',
  //           gap: heightPercentageToDP(2),
  //           opacity: 1,
  //           paddingVertical: heightPercentageToDP(2),
  //           paddingHorizontal: heightPercentageToDP(2),
  //           borderRadius: heightPercentageToDP(1),
  //         }}>
  //         <Text
  //           style={{
  //             color: COLORS.black,
  //             fontFamily: FONT.Montserrat_Regular,
  //             fontSize: heightPercentageToDP(1.8),
  //             textAlignVertical: 'center',
  //           }}>
  //           {getTimeAccordingToTimezone(timeItem.time, user?.country?.timezone)}
  //         </Text>
  //         <Text
  //           style={{
  //             color: COLORS.black,
  //             fontFamily: FONT.Montserrat_Regular,
  //             fontSize: heightPercentageToDP(1.8),
  //             textAlignVertical: 'center',
  //           }}>
  //           Play
  //         </Text>
  //       </LinearGradient>
  //     </TouchableOpacity>
  //   );
  // };

  const renderItem = ({item, index}) => {
    const groupedTimes = [];
    for (let i = 0; i < item.times.length; i += 2) {
      groupedTimes.push(item.times.slice(i, i + 2));
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
                }}>
                Max {item.limit}
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
                        <BlinkingButton
                          timeItem={timeItem}
                          nextTime={nextTime}
                          navigationHandler={navigationHandler}
                          item={item}
                          user={user}
                          idx={idx}
                        />
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
                Live Result
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

export default LiveResult;

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
//   Alert,
//   FlatList,
//   ImageBackground,
//   Linking,
//   Platform,
//   SafeAreaView,
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
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import Background from '../components/background/Background';
// import Loading from '../components/helpercComponent/Loading';
// import {useDispatch, useSelector} from 'react-redux';
// import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
// import LinearGradient from 'react-native-linear-gradient';
// import {useGetAllLocationWithTimeQuery} from '../helper/Networkcall';
// import {loadProfile} from '../redux/actions/userAction';
// import {getTimeAccordingToTimezone} from './SearchTime';
// import moment from 'moment-timezone';
// import Toast from 'react-native-toast-message';

// const LiveResult = () => {
//   const navigation = useNavigation();
//   const {accesstoken, user} = useSelector(state => state.user);
//   const [alldatafiler, setalldatafilter] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState(null);
//   const dispatch = useDispatch();

//   const isFocused = useIsFocused();
//   useEffect(() => {
//     dispatch(loadProfile(accesstoken));
//   }, [isFocused]);

//   const {data, error, isLoading} = useGetAllLocationWithTimeQuery(accesstoken);

//   // FOR ALL FILTER TYPE DATA
//   useEffect(() => {
//     if (!isLoading && data) {
//       const uniqueItems = new Set();
//       const filtertype = [{_id: '123', maximumReturn: 'All'}]; // Default element

//       data.locationData.forEach(item => {
//         const key = item.maximumReturn;
//         if (!uniqueItems.has(key)) {
//           uniqueItems.add(key);
//           filtertype.push({_id: item._id, maximumReturn: item.maximumReturn});
//         }
//       });

//       // Sorting the filtertype array
//       filtertype.sort((a, b) => {
//         if (a.maximumReturn === 'All') return -1;
//         if (b.maximumReturn === 'All') return 1;
//         const aReturn = parseFloat(a.maximumReturn.replace('x', ''));
//         const bReturn = parseFloat(b.maximumReturn.replace('x', ''));
//         return aReturn - bReturn;
//       });

//       setalldatafilter(filtertype);
//       setSelectedFilter(filtertype[0]._id);

//       console.log(filtertype);
//     }
//   }, [isLoading, data]);

//   const settingFilterData = itemf => {
//     setSelectedFilter(itemf._id);

//     if (itemf.maximumReturn.toLowerCase() === 'all') {
//       // Sort the data from highest to lowest when 'All' is selected
//       const sortedData = [...(data?.locationData || [])].sort((a, b) => {
//         const aReturn = parseFloat(a.maximumReturn.replace('x', ''));
//         const bReturn = parseFloat(b.maximumReturn.replace('x', ''));
//         return bReturn - aReturn; // Sort from highest to lowest
//       });
//       setFilteredData(sortedData);
//     } else {
//       const filtered = data?.locationData.filter(item =>
//         item.maximumReturn
//           .toLowerCase()
//           .includes(itemf.maximumReturn.toLowerCase()),
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const [expandedItems, setExpandedItems] = useState({});

//   const toggleItem = id => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // const navigationHandler = (item, timeItem) => {
//   //   const now = moment.tz(user?.country?.timezone);
//   //   console.log('Current Time: ', now.format('hh:mm A'));
//   //   console.log('Current Date: ', now.format('DD-MM-YYYY'));

//   //   const lotTimeMoment = moment.tz(
//   //     getTimeAccordingToTimezone(timeItem?.time, user?.country?.timezone),
//   //     'hh:mm A',
//   //     user?.country?.timezone,
//   //   );
//   //   console.log(`Lot Time for location : ${lotTimeMoment.format('hh:mm A')}`);

//   //   // Subtract 15 minutes from the lotTimeMoment
//   //   const lotTimeMinus15Minutes = lotTimeMoment.clone().subtract(10, 'minutes');

//   //   const isLotTimeClose =
//   //     now.isSameOrAfter(lotTimeMinus15Minutes) && now.isBefore(lotTimeMoment);
//   //   console.log(`Is it within 15 minutes of the lot time? ${isLotTimeClose}`);

//   //   if (isLotTimeClose) {
//   //     console.log('Navigating to PlayArena...');
//   //     Toast.show({
//   //       type: 'info',
//   //       text1: 'Entry is close for this session',
//   //       text2: 'Please choose next available time',
//   //     });
//   //   } else {
//   //     console.log("It's too early or past the lot time.");
//   //     navigation.navigate('PlayArena', {
//   //       locationdata: item,
//   //       timedata: timeItem,
//   //     });
//   //   }
//   // };

//   const navigationHandler = (item, timeItem) => {
//     const now = moment.tz(user?.country?.timezone);
//     console.log('Current Time: ', now.format('hh:mm A'));
//     console.log('Current Date: ', now.format('DD-MM-YYYY'));

//     const lotTimeMoment = moment.tz(
//       getTimeAccordingToTimezone(timeItem?.time, user?.country?.timezone),
//       'hh:mm A',
//       user?.country?.timezone,
//     );
//     console.log(`Lot Time for location : ${lotTimeMoment.format('hh:mm A')}`);

//     const timerinMinutes = timeItem.liveresulttimer;

//     // Subtract 15 minutes from the lotTimeMoment
//     const lotTimeMinus15Minutes = lotTimeMoment
//       .clone()
//       .subtract(timerinMinutes, 'minutes');

//     const isLotTimeClose =
//       now.isSameOrAfter(lotTimeMinus15Minutes) && now.isBefore(lotTimeMoment);
//     console.log(`Is it within 15 minutes of the lot time? ${isLotTimeClose}`);

//     if (isLotTimeClose) {
//       console.log('Navigating to PlayArena...');
//       Toast.show({
//         type: 'info',
//         text1: 'Entry is close for this session',
//         text2: 'Please choose next available time',
//       });
//     } else {
//       console.log("It's too early or past the lot time.");
//       // navigation.navigate('PlayArena', {
//       //   locationdata: item,
//       //   timedata: timeItem,
//       // });
//       console.log(JSON.stringify(timeItem.liveresultlink));
//       openLink(timeItem.liveresultlink);
//       Toast.show({
//         type: 'info',
//         text1: 'Live Result',
//         text2: 'It too early or past the lot time.',
//       });
//     }
//   };

//   const openLink = async url => {
//     const supported = await Linking.canOpenURL(url);
//     if (supported) {
//       await Linking.openURL(url);
//     } else {
//       Alert.alert(`Can't open this URL: ${url}`);
//     }
//   };

//   const [filteredData, setFilteredData] = useState([]);

//   const handleSearch = text => {
//     const filtered = data?.locationData.filter(item =>
//       item.name.toLowerCase().includes(text.toLowerCase()),
//     );
//     setFilteredData(filtered);
//   };

//   useEffect(() => {
//     if (!isLoading && data) {
//       const sortedData = [...(data?.locationData || [])].sort((a, b) => {
//         const aReturn = parseFloat(a.maximumReturn.replace('x', ''));
//         const bReturn = parseFloat(b.maximumReturn.replace('x', ''));
//         return bReturn - aReturn; // Sort from highest to lowest
//       });
//       setFilteredData(sortedData); // Update filteredData whenever locations change
//       // console.log(sortedData);
//     }
//   }, [data]);

//   const getNextTimeForHighlights = (times, userTimezone) => {
//     if (times.length === 1) {
//       return times[0];
//     }

//     // Get the current time in the user's timezone
//     const currentRiyadhTime = moment().tz(userTimezone).format('hh:mm A');
//     console.log('Current time in usertimezone timezone:', currentRiyadhTime);

//     // Convert each time from IST to user timezone (Asia/Riyadh)
//     const convertedTimes = times.map(item => {
//       const timeInIST = moment.tz(item.time, 'hh:mm A', 'Asia/Kolkata');
//       const timeInRiyadh = timeInIST.clone().tz(userTimezone).format('hh:mm A');
//       return {...item, convertedTime: timeInRiyadh};
//     });

//     // console.log('Converted times to Riyadh timezone:', convertedTimes);

//     // Sort the times in the user's timezone
//     const sortedTimes = convertedTimes.sort((a, b) =>
//       moment(a.convertedTime, 'hh:mm A').diff(
//         moment(b.convertedTime, 'hh:mm A'),
//       ),
//     );

//     // console.log('Sorted times:', sortedTimes);

//     // Find the next available time
//     for (let i = 0; i < sortedTimes.length; i++) {
//       if (
//         moment(currentRiyadhTime, 'hh:mm A').isBefore(
//           moment(sortedTimes[i].convertedTime, 'hh:mm A'),
//         )
//       ) {
//         // console.log('Next available time found:', sortedTimes[i]);
//         return sortedTimes[i]; // Return the first future time
//       }
//     }

//     // console.log(
//     //   'No future time found, returning the first sorted time:',
//     //   sortedTimes[0],
//     // );
//     // If no future time found, return the first time (next day scenario)
//     return sortedTimes[0];
//   };

//   // For Blinking button
//   const BlinkingButton = ({
//     timeItem,
//     nextTime,
//     navigationHandler,
//     item,
//     user,
//     idx,
//   }) => {
//     const [isBlinking, setIsBlinking] = useState(false);

//     useEffect(() => {
//       const interval = setInterval(() => {
//         setIsBlinking(prev => !prev); // Toggle the blinking state
//       }, 500); // Blinking interval in milliseconds

//       return () => clearInterval(interval); // Cleanup the interval on component unmount
//     }, []);

//     return (
//       <TouchableOpacity
//         key={timeItem._id}
//         onPress={() => navigationHandler(item, timeItem)}
//         style={{
//           borderColor:
//             timeItem.time === nextTime.time
//               ? isBlinking
//                 ? 'transparent' // Off state
//                 : COLORS.white_s // On state
//               : 'transparent',
//           borderWidth: timeItem.time === nextTime.time ? 2 : 2,
//           borderRadius: heightPercentageToDP(2),
//           overflow: 'hidden',
//         }}>
//         <LinearGradient
//           colors={
//             idx % 2 === 0
//               ? [COLORS.lightblue, COLORS.midblue]
//               : [COLORS.lightyellow, COLORS.darkyellow]
//           }
//           start={{x: 0, y: 0}}
//           end={{x: 1, y: 0}}
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             gap: heightPercentageToDP(2),
//             opacity: 1,
//             paddingVertical: heightPercentageToDP(2),
//             paddingHorizontal: heightPercentageToDP(2),
//             borderRadius: heightPercentageToDP(1),
//           }}>
//           <Text
//             style={{
//               color: COLORS.black,
//               fontFamily: FONT.Montserrat_Regular,
//               fontSize: heightPercentageToDP(1.8),
//               textAlignVertical: 'center',
//             }}>
//             {getTimeAccordingToTimezone(timeItem.time, user?.country?.timezone)}
//           </Text>
//           <Text
//             style={{
//               color: COLORS.black,
//               fontFamily: FONT.Montserrat_Regular,
//               fontSize: heightPercentageToDP(1.8),
//               textAlignVertical: 'center',
//             }}>
//             Play
//           </Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     );
//   };

//   const renderItem = ({item, index}) => {
//     const groupedTimes = [];
//     for (let i = 0; i < item.times.length; i += 2) {
//       groupedTimes.push(item.times.slice(i, i + 2));
//     }

//     const nextTime = getNextTimeForHighlights(
//       item?.times,
//       user?.country?.timezone,
//     );

//     return (
//       <>
//         <TouchableOpacity onPress={() => toggleItem(item._id)}>
//           <LinearGradient
//             colors={
//               index % 2 === 0
//                 ? [COLORS.lightblue, COLORS.midblue]
//                 : [COLORS.lightyellow, COLORS.darkyellow]
//             }
//             start={{x: 0, y: 0}} // start from left
//             end={{x: 1, y: 0}} // end at right
//             style={styles.item}>
//             <View style={{flex: 1.5}}>
//               <Text
//                 style={{
//                   color: COLORS.black,
//                   fontFamily: FONT.Montserrat_SemiBold,
//                   fontSize: heightPercentageToDP(2.5),
//                 }}>
//                 {item.name}
//               </Text>
//             </View>
//             <View style={{flex: 1}}>
//               <Text
//                 style={{
//                   color: COLORS.black,
//                   fontFamily: FONT.Montserrat_Regular,
//                   fontSize: heightPercentageToDP(2),
//                   textAlignVertical: 'center',
//                 }}>
//                 Max {item.limit}
//               </Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>

//         {expandedItems[item._id] && (
//           <View style={{flex: 1, justifyContent: 'flex-end'}}>
//             <ImageBackground
//               source={require('../../assets/image/tlwbg.jpg')}
//               imageStyle={{
//                 borderRadius: heightPercentageToDP(3),
//                 margin: heightPercentageToDP(2),
//               }}
//               style={{flex: 1}} // Ensures the overlay covers the entire image
//             >
//               {/* Transparent Black Overlay */}
//               <View
//                 style={{
//                   ...StyleSheet.absoluteFillObject,
//                   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
//                   borderRadius: heightPercentageToDP(3),
//                   margin: heightPercentageToDP(2),
//                 }}
//               />

//               <View
//                 style={{
//                   backgroundColor: 'transparent',
//                   margin: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(5),
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 {groupedTimes.length === 0 ? (
//                   <GradientTextWhite
//                     style={{
//                       ...styles.textStyle,
//                       height: heightPercentageToDP(15),
//                       textAlignVertical: 'center',
//                       textAlign: 'center',
//                       alignItems: 'center',
//                     }}>
//                     No Available time
//                   </GradientTextWhite>
//                 ) : (
//                   groupedTimes.map((pair, idx) => (
//                     <View key={idx} style={[styles.timeRow]}>
//                       {pair.map(timeItem => (
//                         <BlinkingButton
//                           timeItem={timeItem}
//                           nextTime={nextTime}
//                           navigationHandler={navigationHandler}
//                           item={item}
//                           user={user}
//                           idx={idx}
//                         />
//                       ))}
//                     </View>
//                   ))
//                 )}
//               </View>
//             </ImageBackground>
//           </View>
//         )}
//       </>
//     );
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <Background />
//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         <ImageBackground
//           source={require('../../assets/image/tlwbg.jpg')}
//           style={{
//             width: '100%',
//             height:
//               Platform.OS === 'android'
//                 ? heightPercentageToDP(85)
//                 : heightPercentageToDP(80),
//           }}
//           imageStyle={{
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderTopRightRadius: heightPercentageToDP(5),
//           }}>
//           <View
//             style={{
//               height:
//                 Platform.OS === 'android'
//                   ? heightPercentageToDP(85)
//                   : heightPercentageToDP(80),
//               width: widthPercentageToDP(100),
//               borderTopLeftRadius: heightPercentageToDP(5),
//               borderTopRightRadius: heightPercentageToDP(5),
//             }}>
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

//             <View
//               style={{
//                 height: heightPercentageToDP(21),
//                 margin: heightPercentageToDP(2),
//                 marginTop: heightPercentageToDP(-1.5),
//               }}>
//               <GradientTextWhite style={styles.textStyle}>
//                 Live Result
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
//                   onChangeText={handleSearch}
//                 />
//               </View>

//               <View
//                 style={{
//                   height: heightPercentageToDP(6),
//                   backgroundColor: COLORS.white_s,
//                   borderRadius: heightPercentageToDP(3),
//                   marginTop: heightPercentageToDP(2),
//                   overflow: 'hidden', // Ensures content stays inside the rounded container
//                 }}>
//                 <ScrollView
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={{
//                     alignItems: 'center',
//                     paddingHorizontal: heightPercentageToDP(1),
//                   }}>
//                   {alldatafiler.map(item => (
//                     <TouchableOpacity
//                       onPress={() => settingFilterData(item)}
//                       key={item._id}
//                       style={{
//                         backgroundColor: COLORS.grayHalfBg,
//                         padding: heightPercentageToDP(1),
//                         margin: heightPercentageToDP(0.2),
//                         borderRadius: heightPercentageToDP(1),
//                         borderColor:
//                           selectedFilter == item._id
//                             ? COLORS.green
//                             : COLORS.grayHalfBg,
//                         borderWidth: 1,
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: FONT.Montserrat_Regular,
//                           fontSize: heightPercentageToDP(1.5),
//                           color: COLORS.black,
//                           paddingHorizontal: heightPercentageToDP(0.5),
//                         }}>
//                         {item.maximumReturn}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             </View>

//             <View style={{flex: 2}}>
//               {isLoading ? (
//                 <Loading />
//               ) : (
//                 <FlatList
//                   data={filteredData}
//                   renderItem={renderItem}
//                   keyExtractor={item => item._id}
//                   initialNumToRender={10}
//                   maxToRenderPerBatch={10}
//                   windowSize={10}
//                   ListFooterComponent={() => (
//                     <View style={{height: 100}}></View>
//                   )}
//                 />
//               )}
//             </View>
//           </View>
//         </ImageBackground>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default LiveResult;

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
//     flexDirection: 'row',
//   },
//   title: {
//     color: COLORS.white_s,
//     fontFamily: FONT.SF_PRO_MEDIUM,
//   },
//   timeRow: {
//     flexDirection: 'row',
//     marginBottom: 4,
//     borderRadius: 4,
//     padding: 4,
//     gap: heightPercentageToDP(2),
//     margin: heightPercentageToDP(2),
//   },
//   time: {
//     fontSize: 14,
//     marginRight: 8,
//     padding: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 4,
//     flex: 1,
//     textAlign: 'center',
//   },
// });
