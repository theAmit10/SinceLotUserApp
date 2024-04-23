import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  BackHandler,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Countdown from 'react-native-countdown-component';
import {COLORS, FONT} from '../../assets/constants';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import GradientText from '../components/helpercComponent/GradientText';
import Wallet from '../components/home/Wallet';
import {useDispatch, useSelector} from 'react-redux';
import {loadAllPromotion, loadProfile} from '../redux/actions/userAction';
import HomeLoading from '../components/background/HomeLoading';
import NoDataFound from '../components/helpercComponent/NoDataFound';
import {
  getAllResult,
  getAllResultAccordingToLocation,
  getNextResult,
} from '../redux/actions/resultAction';
import Loading from '../components/helpercComponent/Loading';
import Toast from 'react-native-toast-message';
import moment from 'moment';
const {height, width} = Dimensions.get('window');
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {serverName} from '../redux/store';
import LinearGradient from 'react-native-linear-gradient';

const images = [
  'https://imgs.search.brave.com/PvhNVIxs9m8r1whelc9RPX2dMQ371Xcsk3Lf2dCiVHQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmlnLXNhbGUt/YmFubmVyLWRlc2ln/bi1zcGVjaWFsLW9m/ZmVyLXVwLTUwLW9m/Zi1yZWFkeS1wcm9t/b3Rpb24tdGVtcGxh/dGUtdXNlLXdlYi1w/cmludC1kZXNpZ25f/MTEwNDY0LTU3MC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw',
  'https://imgs.search.brave.com/0_WERhkh6NjaGafm4qPeYRM1WbUdabgTpK7LCJ8EKFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaG90LXNhbGUt/aG9yaXpvbnRhbC1i/YW5uZXItd2l0aC1z/ZWFzb25hbC1vZmZl/cl80MTkzNDEtNjA1/LmpwZz9zaXplPTYy/NiZleHQ9anBn',
  'https://imgs.search.brave.com/pBRUab3Kras4ziV_cQdR0AtRiSrOuJKwhMTmHY988d8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BlY2lhbC1v/ZmZlci1maW5hbC1z/YWxlLXRhZy1iYW5u/ZXItZGVzaWduLXRl/bXBsYXRlLW1hcmtl/dGluZy1zcGVjaWFs/LW9mZmVyLXByb21v/dGlvbl82ODA1OTgt/MTk1LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
];

const Home = () => {
  const {user, accesstoken, loading} = useSelector(state => state.user);

  const [showDate, setShowDate] = useState(true);

  const [nextResultTime, setNextResultTime] = useState(10);
  const [timeDifference, setTimeDifference] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAllPromotion(accesstoken));
  }, [dispatch, focused]);

  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [dispatch]);

  const [currentScreen, setCurrentScreen] = useState('');
  const [firstTimeClick, setFirstTimeClick] = useState(true);

  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'Home') {
      

        if(!showDate)
        {
          setShowDate(true)
          console.log("Backbutton pressed ")
        }else{
          Alert.alert('Hold on!', 'Are you sure you want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'YES', onPress: () => BackHandler.exitApp()},
          ]);
        }
        

        // BackHandler.exitApp();
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentScreen, navigation,showDate]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreen('Home'); // Set the current screen to 'HomeScreen' when this screen is focused
      return () => setCurrentScreen(''); // Reset the current screen when the screen is blurred
    }, []),
  );

  console.log("Show date :: "+showDate)

  const {
    results,
    resultAccordingLocation,
    loadingForResultAccordingLocation,
    nextResult,
    loaderForNextResult,
  } = useSelector(state => state.result);

  const {loadingPromotion, promotions} = useSelector(state => state.promotion);
  const [filteredData, setFilteredData] = useState([]);

  // For Big Result
  const [homeResult, setHomeResult] = useState([]);

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(getAllResult(accesstoken));
    dispatch(
      getAllResultAccordingToLocation(
        accesstoken,
        homeResult?.lotlocation?._id,
      ),
    );
    dispatch(getNextResult(accesstoken, homeResult?.lotlocation?._id));
    setHomeResult(results[0]);
  }, [dispatch, focused]);

  useEffect(() => {
    const firstThreeElements = results;
    if (firstTimeClick) {
      setHomeResult(firstThreeElements[0]);
    }

    setFilteredData(firstThreeElements); // Update filteredData whenever locations change
    // settingHomeResultUsingLocation(results[0])
  }, [
    results,
    homeResult,
    loadingForResultAccordingLocation,
    nextResult,
    loaderForNextResult,
    filteredData,
    nextResultTime,
    timeDifference,
  ]);

 
  const toogleView = () => {
    setShowDate(false);
  };

  const settingHomeResultUsingLocation = item => {
    setHomeResult(item);
    setFirstTimeClick(false);
    console.log('Mine time');
    console.log(extractTime(item.nextresulttime));

    const {hour, minute, period} = extractTime(item.nextresulttime);
    console.log(hour);
    console.log(minute);
    console.log(period);
    // setNextResultTime(hour);
    const hour_time = hour + ' ' + period;
    console.log('Hour_time :: ' + hour_time);
    settingTimerForNextResult(hour, minute, period);

    dispatch(
      getAllResultAccordingToLocation(accesstoken, item.lotlocation._id),
    );
    // dispatch(getNextResult(accesstoken, item.lotlocation._id));
  };

  // For Promotion Image Slider
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef();

  // Commenting this for Testing next result
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % images.length;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({x: width * nextPage, animated: true});
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPage]);

  const handlePageChange = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const page = Math.round(contentOffset / width);
    setCurrentPage(page);
  };

  // console.log('Promotion :: ' + promotions.length);
  // console.log('Next result  :: ' + nextResult.length);

  // For Countdown Timer

  // Function to determine if the given time has passed
  function hasTimePassed(timeString) {
    if (timeString) {
      // Parse the given time string using moment.js
      const timeFormat = timeString.includes('-') ? 'hh-mm A' : 'hh:mm A';
      const givenTime = moment(timeString, timeFormat);

      // Get the current device time
      const currentTime = moment();

      // Compare the given time with the current time
      return givenTime.isBefore(currentTime);
    }
  }

  function extractTime(timeString) {
    // Remove whitespace from the time string and split it into time and period (AM/PM)
    const [timePart, period] = timeString.trim().split(/\s+/);

    // Determine the separator used in the time part (either "-" or ":")
    const separator = timePart.includes('-') ? '-' : ':';

    // Split the time part using the determined separator
    const [hour, minute] = timePart.split(separator);

    return {
      hour,
      minute,
      period,
    };
  }

  //

  //   // Example usage:
  // const timeString1 = "09-00 AM";
  // const timeString2 = "09:00 AM";

  //  console.log(extractTime(timeString1)); // { hour: "09", minute: "00", period: "AM" }
  // console.log(extractTime(timeString2)); // { hour: "09", minute: "00", period: "AM" }

  useEffect(() => {
    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [homeResult, currentTime, timeDifference]);

  // Current time
  // const [currentTime, setCurrentTime] = useState(new Date());
  // // Lot time (time you want to count down to)
  // const lotTime = new Date();
  // lotTime.setHours(nextResultTime); // Set lot time hours (example: 8 AM)
  // lotTime.setMinutes(0); // Set lot time minutes (example: 00)
  // lotTime.setSeconds(0); // Set lot time seconds (example: 00)

  // useEffect(() => {
  //   // Update current time every second
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   // Clear interval on component unmount
  //   return () => clearInterval(interval);
  // }, []);

  // // Calculate time difference between current time and lot time
  // const timeDifference = lotTime.getTime() - currentTime.getTime();

  // const settingTimerForNextResult = (hour, minute,period) => {
  //   const lotTime = new Date();

  //   lotTime.setHours(hour); // Set lot time hours (example: 8 AM)
  //   lotTime.setMinutes(minute); // Set lot time minutes (example: 00)
  //   lotTime.setSeconds(0); // Set lot time seconds (example: 00)

  //   console.log("Setting timer")
  //   console.log("lottime :: "+lotTime.getTime())
  //   console.log("currenttime :: "+currentTime.getTime())
  //   console.log("Both Difference :: ",lotTime.getTime() - currentTime.getTime())

  //   // Calculate time difference between current time and lot time
  //   setTimeDifference(lotTime.getTime() - currentTime.getTime());
  // };

  const settingTimerForNextResult = async (hour, minute, period) => {
    let hour24 = parseInt(hour);

    if (period.toLowerCase() === 'pm' && hour24 < 12) {
      hour24 += 12;
    } else if (period.toLowerCase() === 'am' && hour24 === 12) {
      hour24 = 0;
    }

    const lotTime = new Date();
    lotTime.setHours(hour24);
    lotTime.setMinutes(parseInt(minute));
    lotTime.setSeconds(0);

    setTimeDifference(lotTime.getTime() - currentTime.getTime());

    // const lotTime = new Date();

    // lotTime.setHours(hour); // Set lot time hours (example: 8 AM)
    // lotTime.setMinutes(minute); // Set lot time minutes (example: 00)
    // lotTime.setSeconds(0); // Set lot time seconds (example: 00)

    console.log('Setting timer');
    console.log('lottime :: ' + lotTime.getTime());
    console.log('currenttime :: ' + currentTime.getTime());
    console.log(
      'Both Difference :: ',
      lotTime.getTime() - currentTime.getTime(),
    );

    // Calculate time difference between current time and lot time
    setTimeDifference(lotTime.getTime() - currentTime.getTime());

    // Ensure that data is loaded before setting the timer
    await dispatch(getAllResult(accesstoken));
    await dispatch(
      getAllResultAccordingToLocation(
        accesstoken,
        homeResult?.lotlocation?._id,
      ),
    );
    await dispatch(getNextResult(accesstoken, homeResult?.lotlocation?._id));
  };

  // FOR DOWNLOAD PDF

  const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>Result</title>
            <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
            <style>
              ${htmlStyles}
            </style>
          </head>
          <body>
            <header>
              <h1>RESULT</h1>
            </header>
            <article>
          
              <table class="inventory">
                <thead>
                  <tr>
                    <th><span>Location</span></th>
                    <th><span>Date</span></th>
                    <th><span>Time</span></th>
                    <th><span>Result</span></th>
                  </tr>
                </thead>
                <tbody>
                ${resultAccordingLocation
                  ?.map(
                    item => `
                <tr>
                  <td><span>${item.lotlocation?.lotlocation}</span></td>
                  <td><span>${item.lotdate?.lotdate}</span></td>
                  <td><span>${item.lottime?.lottime}</span></td>
                  <td><span>${item.resultNumber}</span></td>
                </tr>
              `,
                  )
                  .join('')}
                </tbody>
              </table>
              
            </article>
            <aside>
              <h1><span>Since 1984</span></h1>
              <div>
                <p>A Mobile Lottery App</p>
              </div>
            </aside>
          </body>
        </html>
      `;

  const checkAndRequestPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

    if (result === RESULTS.DENIED) {
      if (Platform.OS === 'android' && Platform.Version <= 29) {
        // Target Android 10 and above
        const permissionResult = await request(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        if (permissionResult !== RESULTS.GRANTED) {
          console.log('Permission not granted!');
          Toast.show({
            type: 'info',
            text1: 'Permission not granted!',
          });
          return;
        }
      }
    }

    // Call your DocumentPicker.pick() function here

    console.log('Permission status');
    createPDF();
  };

  const createPDF = async () => {
    let options = {
      //Content to print
      html: htmlContent,
      //File Name
      fileName: `${homeResult.lotdate.lotdate}${homeResult.lottime.lottime}`,
      //File directory
      directory: 'Download',

      base64: true,
    };

    let file = await RNHTMLtoPDF.convert(options);
    // console.log(file.filePath);
    Alert.alert(
      'Successfully Exported',
      'Path:' + file.filePath,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open', onPress: () => openFile(file.filePath)},
      ],
      {cancelable: true},
    );
  };

  const openFile = filepath => {
    const path = filepath; // absolute-path-to-my-local-file.
    FileViewer.open(path)
      .then(() => {
        // success
        console.log('All Good no error found');
      })
      .catch(error => {
        // error
        console.log('Found error :: ' + error);
      });
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: COLORS.white,
        padding: heightPercentageToDP(2),
      }}>
      {loading ? (
        <HomeLoading />
      ) : (
        user && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/** TOP HEADER CONTAINER */}
            <View
              style={{
                height: heightPercentageToDP(10),
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 3,

                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: heightPercentageToDP(1),
                }}>
                {/** Profile Image Container */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('UpdateProfile')}
                  style={{
                    borderRadius: 100,
                    overflow: 'hidden',
                    width: 70,
                    height: 70,
                  }}>
                  {user?.avatar?.url ? (
                    <Image
                      source={{
                        uri: `${serverName}/uploads/${user?.avatar.url}`,
                      }}
                      resizeMode="cover"
                      style={{
                        height: 70,
                        width: 70,
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/image/dark_user.png')}
                      resizeMode="cover"
                      style={{
                        height: 70,
                        width: 70,
                      }}
                    />
                  )}
                </TouchableOpacity>

                {/** Profile name Container */}
                <View>
                  <GradientText
                    style={{
                      fontSize: heightPercentageToDP(2),
                      fontFamily: FONT.Montserrat_Bold,
                      color: COLORS.darkGray,
                    }}>
                    User ID - {user ? user.userId : ''}
                  </GradientText>

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      color: COLORS.black,
                    }}>
                    Hello
                    <Text
                      style={{
                        fontFamily: FONT.HELVETICA_BOLD,
                        color: COLORS.black,
                        fontSize: heightPercentageToDP(2),
                      }}>
                      , {user.name}
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: heightPercentageToDP(2),
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notification')}>
                  <Ionicons
                    name={'notifications'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.black}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Setting')}>
                  <Entypo
                    name={'menu'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/** SEARCH CONTAINER */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayHalfBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
                marginTop: heightPercentageToDP(2),
              }}>
              <Fontisto
                name={'search'}
                size={heightPercentageToDP(3)}
                color={COLORS.darkGray}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.Montserrat_Regular,
                  fontSize: heightPercentageToDP(2),
                  color: COLORS.black,
                }}>
                Search for location
              </Text>
            </TouchableOpacity>

            {/** BIG RESULT  homeResult && homeResult.length === 0 */}

            {homeResult && homeResult.length === 0 ? (
              <NoDataFound data={'No Result Available'} />
            ) : showDate ? (
              <View
                style={{
                  height: heightPercentageToDP(40),
                  backgroundColor: COLORS.grayHalfBg,
                  marginTop: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(2),
                  elevation: heightPercentageToDP(1),
                }}>
                <View
                  style={{
                    height: heightPercentageToDP(30),
                    borderRadius: heightPercentageToDP(1),
                    flexDirection: 'row',
                  }}>
                  {/** Top view left container */}
                  <View
                    style={{
                      flex: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        paddingStart: heightPercentageToDP(2),
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_SemiBold,
                          fontSize: heightPercentageToDP(4),
                          marginTop: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}
                        numberOfLines={1}>
                        {homeResult?.lotlocation?.lotlocation}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: FONT.SF_PRO_REGULAR,
                        fontSize: heightPercentageToDP(14),
                        color: COLORS.black,
                        marginTop: heightPercentageToDP(-2),
                        color: COLORS.black,
                      }}
                      numberOfLines={1}>
                      {homeResult?.resultNumber}
                    </Text>
                  </View>

                  {/** Top view right container */}

                  {loaderForNextResult ? (
                    <View
                      style={{
                        flex: 1,

                        justifyContent: 'center',
                      }}>
                      <Loading />
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          position: 'absolute',
                          top: 2,
                          zIndex: 1,
                          borderRadius: heightPercentageToDP(2),
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: FONT.Montserrat_Regular,
                              color: COLORS.black,
                            }}>
                            {hasTimePassed(homeResult?.nextresulttime)
                              ? ''
                              : 'Next'}
                          </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: FONT.Montserrat_Regular,
                              color: COLORS.black,
                            }}>
                            {hasTimePassed(homeResult?.nextresulttime)
                              ? ''
                              : 'Result'}
                          </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: COLORS.black,
                              fontFamily: FONT.HELVETICA_BOLD,
                              color: COLORS.black,
                            }}>
                            {hasTimePassed(homeResult?.nextresulttime)
                              ? ''
                              : homeResult?.nextresulttime}
                          </Text>
                        </View>
                      </View>

                      {hasTimePassed(homeResult?.nextresulttime) ? null : (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            borderRadius: heightPercentageToDP(2),
                          }}>
                            <Countdown
    until={timeDifference / 1000}
    onFinish={() => console.log('Timer Completed...')}
    size={12}
    timeToShow={['H', 'M', 'S']}
    digitStyle={{
        backgroundColor: 'transparent', // Set background to transparent
        borderWidth: 0, // Remove border
        paddingHorizontal: 0, // Remove horizontal padding
        paddingVertical: 0, // Remove vertical padding
        margin: 0, // Remove margin
    }}
    digitTxtStyle={{ color: COLORS.black }}
    timeLabelStyle={{
        color: COLORS.grayHalfBg,
        fontWeight: 'bold',
    }}
    separatorStyle={{
        color: COLORS.black,
        marginTop: heightPercentageToDP(-2),
        marginHorizontal: heightPercentageToDP(-8),
        
        paddingHorizontal: 0, // Remove horizontal padding
    }}
    timeLabels={{
        h: 'Hours',
        m: 'Minutes',
        s: 'Seconds',
    }}
    showSeparator
    style={{
        flexDirection: 'row',
        alignItems: 'center', // Align items to center
        transform: [{ rotate: '90deg' }],
        color: COLORS.black,
        fontFamily: FONT.Montserrat_SemiBold,
        fontSize: heightPercentageToDP(3),
        marginStart: heightPercentageToDP(-4),
        marginBottom: heightPercentageToDP(9),
    }}
/>



                          {/* <Countdown
                            until={timeDifference / 1000} // Pass time difference in seconds
                            onFinish={() => console.log('Timer Completed...')} // Callback when countdown finishes
                            size={12}
                            timeToShow={['H', 'M', 'S']}
                            digitStyle={{
                              backgroundColor: COLORS.grayHalfBg,
                              borderWidth: 1,
                              borderColor: COLORS.grayHalfBg,
                            }}
                            digitTxtStyle={{color: COLORS.black}}
                            timeLabelStyle={{
                              color: COLORS.grayHalfBg,
                              fontWeight: 'bold',
                            }}
                            separatorStyle={{
                              color: COLORS.black,
                              marginTop: heightPercentageToDP(-2),
                            }}
                            timeLabels={{
                              h: 'Hours',
                              m: 'Minutes',
                              s: 'Seconds',
                            }}
                            showSeparator
                            style={{
                              flexDirection: 'row',
                              transform: [{rotate: '90deg'}],
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_SemiBold,
                              fontSize: heightPercentageToDP(3),

                              marginStart: heightPercentageToDP(-4),
                              marginBottom: heightPercentageToDP(8),
                            }}
                          /> */}
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/** Big Result bottom container */}

                <TouchableOpacity
                  onPress={toogleView}
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.white_s,
                    margin: heightPercentageToDP(1),
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: heightPercentageToDP(1),
                    zIndex: 2,
                    borderRadius: heightPercentageToDP(1),
                  }}>
                  <View
                    style={{
                      backgroundColor: COLORS.grayHalfBg,
                      padding: heightPercentageToDP(1),
                      borderRadius: heightPercentageToDP(1),
                      marginStart: heightPercentageToDP(2),
                    }}>
                    <Ionicons
                      name={'calendar'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.darkGray}
                    />
                  </View>

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(2),
                      color: COLORS.black,
                    }}>
                    {homeResult?.lotdate?.lotdate}
                  </Text>

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(2),
                      color: COLORS.black,
                    }}>
                    {homeResult?.lottime?.lottime}
                  </Text>

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(2),
                      color: COLORS.black,
                    }}>
                    {homeResult?.resultNumber}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      paddingEnd: heightPercentageToDP(3),

                    }}>
                    <View
                      style={{
                        backgroundColor: COLORS.grayHalfBg,
                        padding: heightPercentageToDP(0.5),
                        borderRadius: heightPercentageToDP(1),
                        alignSelf: 'flex-end',
                      }}>
                      <Ionicons
                        name={'caret-down-circle-sharp'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  height: heightPercentageToDP(45),
                  backgroundColor: COLORS.grayHalfBg,
                  marginTop: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(2),
                  elevation: heightPercentageToDP(1),
                  justifyContent: 'space-evenly',
                }}>
                <View
                  style={{
                    height: heightPercentageToDP(40),
                    borderRadius: heightPercentageToDP(1),
                    flexDirection: 'row',
                  }}>
                  {/** Top view left container */}
                  <View
                    style={{
                      flex: 5,
                      padding: heightPercentageToDP(1),
                    }}>
                    {/** Top Locaton With Result */}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: heightPercentageToDP(1),
                      }}>
                      <GradientText
                        style={{
                          fontSize: heightPercentageToDP(3),
                          fontFamily: FONT.Montserrat_Bold,
                          color: COLORS.black,
                        }}>
                        {homeResult?.lotlocation?.lotlocation}
                      </GradientText>

                      <GradientText
                        style={{
                          fontSize: heightPercentageToDP(3),
                          fontFamily: FONT.Montserrat_Bold,
                          color: COLORS.black,
                          marginEnd: heightPercentageToDP(1),
                        }}>
                        {homeResult?.resultNumber}
                      </GradientText>
                    </View>

                    {/** List of result in flatlist */}

                    <ScrollView nestedScrollEnabled={true}>
                      <LinearGradient
                        colors={[
                            COLORS.white_s,
                            COLORS.grayHalfBg,
                        ]}
                        style={{
                          backgroundColor: COLORS.white,
                          height: heightPercentageToDP(27),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: heightPercentageToDP(1),
                        }}>
                        {/** All Date for a specific location */}

                        {resultAccordingLocation.length === 0 ? (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>No Data Available</Text>
                          </View>
                        ) : loadingForResultAccordingLocation ? (
                          <View>
                            <Loading />
                          </View>
                        ) : (
                          resultAccordingLocation.map((item, index) => (
                            <TouchableOpacity
                              onPress={() => {
                                setHomeResult(item);
                                setShowDate(true);
                              }}
                              key={index}
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'stretch',
                                gap: heightPercentageToDP(2.5),
                              }}>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(2),
                                  textAlign: 'left',
                                  color: COLORS.black,
                                }}>
                                {item.lotdate.lotdate}
                              </Text>

                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(2),
                                  color: COLORS.black,
                                }}>
                                {item.lottime.lottime}
                              </Text>

                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(2),
                                  textAlign: 'right',
                                  color: COLORS.black,
                                }}>
                                {item.resultNumber}
                              </Text>
                            </TouchableOpacity>
                          ))
                        )}
                      </LinearGradient>
                    </ScrollView>
                  </View>

                  {/** Top view right container */}
                  {loaderForNextResult ? (
                    <View
                      style={{
                        flex: 1,

                        justifyContent: 'center',
                      }}>
                      <Loading />
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,

                        justifyContent: 'center',
                      }}>
                         {hasTimePassed(homeResult?.nextresulttime) ? null : (<View style={{position: 'absolute', top: 10, zIndex: 1}}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: FONT.Montserrat_Regular,
                              color: COLORS.black,
                            }}>
                            Next
                          </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: FONT.Montserrat_Regular,
                              color: COLORS.black,
                            }}>
                            Result
                          </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: COLORS.black,
                              fontFamily: FONT.HELVETICA_BOLD,
                            }}>
                            {homeResult?.nextresulttime}
                          </Text>
                        </View>
                      </View>)}

                      

                      {hasTimePassed(homeResult?.nextresulttime) ? null : (<View
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          borderRadius: heightPercentageToDP(2),
                        }}>

<Countdown
    until={timeDifference / 1000}
    onFinish={() => console.log('Timer Completed...')}
    size={12}
    timeToShow={['H', 'M', 'S']}
    digitStyle={{
        backgroundColor: 'transparent', // Set background to transparent
        borderWidth: 0, // Remove border
        paddingHorizontal: 0, // Remove horizontal padding
        paddingVertical: 0, // Remove vertical padding
        margin: 0, // Remove margin
    }}
    digitTxtStyle={{ color: COLORS.black }}
    timeLabelStyle={{
        color: COLORS.grayHalfBg,
        fontWeight: 'bold',
    }}
    separatorStyle={{
        color: COLORS.black,
        marginTop: heightPercentageToDP(-2),
        marginHorizontal: heightPercentageToDP(-8),
        
        paddingHorizontal: 0, // Remove horizontal padding
    }}
    timeLabels={{
        h: 'Hours',
        m: 'Minutes',
        s: 'Seconds',
    }}
    showSeparator
    style={{
        flexDirection: 'row',
        alignItems: 'center', // Align items to center
        transform: [{ rotate: '90deg' }],
        color: COLORS.black,
        fontFamily: FONT.Montserrat_SemiBold,
        fontSize: heightPercentageToDP(3),
        marginStart: heightPercentageToDP(-4),
        marginBottom: heightPercentageToDP(15),
    }}
/>

                        {/* <Countdown
                          until={timeDifference / 1000} // Pass time difference in seconds
                          onFinish={() => console.log('Timer Completed...')} // Callback when countdown finishes
                          size={14}
                          timeToShow={['H', 'M', 'S']}
                          digitStyle={{
                            backgroundColor: COLORS.grayHalfBg,
                            borderWidth: 1,
                            borderColor: COLORS.grayHalfBg,
                          }}
                          digitTxtStyle={{color: COLORS.black}}
                          timeLabelStyle={{
                            color: COLORS.grayHalfBg,
                            fontWeight: 'bold',
                          }}
                          separatorStyle={{
                            color: COLORS.black,
                            marginTop: heightPercentageToDP(-2),
                          }}
                          timeLabels={{
                            h: 'Hours',
                            m: 'Minutes',
                            s: 'Seconds',
                          }}
                          showSeparator
                          style={{
                            flexDirection: 'row',
                            transform: [{rotate: '90deg'}],
                            color: COLORS.black,
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(4),

                            marginStart: heightPercentageToDP(-4),
                            marginBottom: heightPercentageToDP(10),
                          }}
                        /> */}
                      </View>)}

                      
                    </View>
                  )}
                </View>

                {/** Big Result bottom container */}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
               
                  }}>
                  <TouchableOpacity
                    onPress={() => setShowDate(true)}
                    className="rounded-md p-2"
                    style={{
                      backgroundColor: COLORS.white_s,
                      marginBottom: heightPercentageToDP(2),
                      marginHorizontal: heightPercentageToDP(2),

                    }}>
                    <Ionicons
                      name={'chevron-back'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.black}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={checkAndRequestPermission}
                    style={{
                      backgroundColor: COLORS.blue,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: heightPercentageToDP(1),
                      zIndex: 2,
                      borderRadius: heightPercentageToDP(1),
                      height: heightPercentageToDP(5),
                      marginBottom: heightPercentageToDP(2),
                      marginHorizontal: heightPercentageToDP(2),
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.white_s,
                      }}>
                      Download
                    </Text>
                  </TouchableOpacity>
                </View>
                 {/* <TouchableOpacity
                    onPress={checkAndRequestPermission}
                    style={{
                      backgroundColor: COLORS.blue,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: heightPercentageToDP(1),
                      zIndex: 2,
                      borderRadius: heightPercentageToDP(1),
                      height: heightPercentageToDP(5),
                      marginBottom: heightPercentageToDP(2),
                      marginHorizontal: heightPercentageToDP(2),
                    }}>
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.white_s,
                      }}>
                      Download
                    </Text>
                  </TouchableOpacity> */}
              </View>
            )}

            {/** BOTTOM RESULT CONTAINER */}

            <View
              style={{
                height: heightPercentageToDP(5),
                marginVertical: heightPercentageToDP(2),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <GradientText
                style={{
                  fontSize: heightPercentageToDP(4),
                  fontFamily: FONT.Montserrat_Bold,
                  color: COLORS.black,
                }}>
                Results
              </GradientText>

              <Text
                onPress={() => navigation.navigate('AllResult')}
                style={{
                  fontFamily: FONT.Montserrat_Regular,
                  fontSize: heightPercentageToDP(2),
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: COLORS.black,
                }}>
                See all
              </Text>
            </View>

            {/** BOTTOM RESULT CONTENT CONTAINER */}

            {filteredData.length === 0 ? (
              <NoDataFound data={'No Result Available'} />
            ) : (
              <View
                style={{
                  height: heightPercentageToDP(25),
                  borderRadius: heightPercentageToDP(1),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: heightPercentageToDP(2),
                  marginBottom: heightPercentageToDP(2),
                }}>
                <ScrollView
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}>
                  {filteredData.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => settingHomeResultUsingLocation(item)}
                      key={index}
                      style={{
                        height: heightPercentageToDP(20),
                        width: widthPercentageToDP(30),
                        borderRadius: heightPercentageToDP(1),
                        backgroundColor: 'gray',
                        ...styles.resultContentContainer,
                        position: 'relative',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor:
                            index % 2 === 0
                              ? COLORS.grayHalfBg
                              : COLORS.lightDarkGray,
                          borderTopRightRadius: heightPercentageToDP(1),
                          borderTopLeftRadius: heightPercentageToDP(1),
                          paddingTop: heightPercentageToDP(1),
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(2),
                            textAlign: 'center',
                            color: COLORS.black,
                          }}>
                          {item.lotlocation.lotlocation}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: 'transparent',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(5),
                            textAlign: 'center',
                            color: COLORS.black,
                          }}>
                          {item.resultNumber}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.white_s,
                          borderBottomRightRadius: heightPercentageToDP(1),
                          borderBottomLeftRadius: heightPercentageToDP(1),
                          justifyContent: 'flex-end',
                          margin: heightPercentageToDP(0.5),
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_Regular,
                            fontSize: heightPercentageToDP(2),
                            textAlign: 'center',
                            padding: heightPercentageToDP(0.5),
                            color: COLORS.black,
                          }}>
                          {item.lottime.lottime}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/** PROMOTION CONTAINER */}

            {loadingPromotion ? (
              <View
                style={{
                  height: heightPercentageToDP(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Loading />
              </View>
            ) : (
              <View style={styles.container}>
                <View>
                  <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handlePageChange}
                    scrollEventThrottle={16}>
                    {/* https://sincelott.onrender.com/uploads/promotion/ */}
                    {promotions.map((image, index) => (
                      <Image
                        key={index}
                        source={{
                          uri:
                            'https://sincelott.onrender.com/uploads/promotion/' +
                            image.url,
                        }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.indicatorContainer}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        {
                          backgroundColor:
                            currentPage === index
                              ? COLORS.darkGray
                              : COLORS.grayHalfBg,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            {/** WALLET CONTAINER */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {user.walletOne.visibility && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('WalletBalance', {
                        data: user.walletOne,
                      })
                    }>
                    <Wallet wallet={user.walletOne} />
                  </TouchableOpacity>
                )}

                {user.walletTwo.visibility && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('WalletBalance', {
                        data: user.walletTwo,
                      })
                    }>
                    <Wallet wallet={user.walletTwo} />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        )
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  resultContentContainer: {
    // Add shadow properties
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
    // Add border radius and margin properties
    borderRadius: 8,
    margin: 10,
    // Add background color and any other styles you need
    backgroundColor: '#fff',
  },
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightPercentageToDP(4),
    height: heightPercentageToDP(20),
  },
  item: {
    padding: heightPercentageToDP(2),
    marginVertical: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
  },
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },
  container: {
    flex: 1,
  },
  image: {
    width,
    height: heightPercentageToDP(20), // adjust the height as needed
    borderRadius: heightPercentageToDP(1),
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

const htmlStyles = `
*{
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}

h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }

/* table */

table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }

/* page */

html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
html { background: #999; cursor: default; }

body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

/* header */

header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }

header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }

/* article */

article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }

article address { float: left; font-size: 125%; font-weight: bold; }

/* table meta & balance */

table.meta, table.balance { float: right; width: 36%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

/* table meta */

table.meta th { width: 40%; }
table.meta td { width: 60%; }

/* table items */

table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }

table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: right; width: 12%; }
table.inventory td:nth-child(4) { text-align: right; width: 12%; }
table.inventory td:nth-child(5) { text-align: right; width: 12%; }

/* table balance */

table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }

/* aside */

aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`;

// Starting from here

// import {
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Platform,
//   Alert,
//   BackHandler,
//   Dimensions,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import Countdown from 'react-native-countdown-component';
// import {COLORS, FONT} from '../../assets/constants';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Entypo from 'react-native-vector-icons/Entypo';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import {
//   useFocusEffect,
//   useIsFocused,
//   useNavigation,
// } from '@react-navigation/native';
// import GradientText from '../components/helpercComponent/GradientText';
// import Wallet from '../components/home/Wallet';
// import {useDispatch, useSelector} from 'react-redux';
// import {loadAllPromotion, loadProfile} from '../redux/actions/userAction';
// import HomeLoading from '../components/background/HomeLoading';
// import NoDataFound from '../components/helpercComponent/NoDataFound';
// import {
//   getAllResult,
//   getAllResultAccordingToLocation,
//   getNextResult,
// } from '../redux/actions/resultAction';
// import Loading from '../components/helpercComponent/Loading';
// import Toast from 'react-native-toast-message';
// const {height, width} = Dimensions.get('window');

// const images = [
//   'https://imgs.search.brave.com/PvhNVIxs9m8r1whelc9RPX2dMQ371Xcsk3Lf2dCiVHQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmlnLXNhbGUt/YmFubmVyLWRlc2ln/bi1zcGVjaWFsLW9m/ZmVyLXVwLTUwLW9m/Zi1yZWFkeS1wcm9t/b3Rpb24tdGVtcGxh/dGUtdXNlLXdlYi1w/cmludC1kZXNpZ25f/MTEwNDY0LTU3MC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw',
//   'https://imgs.search.brave.com/0_WERhkh6NjaGafm4qPeYRM1WbUdabgTpK7LCJ8EKFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaG90LXNhbGUt/aG9yaXpvbnRhbC1i/YW5uZXItd2l0aC1z/ZWFzb25hbC1vZmZl/cl80MTkzNDEtNjA1/LmpwZz9zaXplPTYy/NiZleHQ9anBn',
//   'https://imgs.search.brave.com/pBRUab3Kras4ziV_cQdR0AtRiSrOuJKwhMTmHY988d8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BlY2lhbC1v/ZmZlci1maW5hbC1z/YWxlLXRhZy1iYW5u/ZXItZGVzaWduLXRl/bXBsYXRlLW1hcmtl/dGluZy1zcGVjaWFs/LW9mZmVyLXByb21v/dGlvbl82ODA1OTgt/MTk1LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
// ];

// const Home = () => {
//   const {user, accesstoken, loading} = useSelector(state => state.user);

//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(loadAllPromotion(accesstoken));
//   }, [dispatch, focused]);

//   useEffect(() => {
//     dispatch(loadProfile(accesstoken));
//   }, [dispatch]);

//   const [currentScreen, setCurrentScreen] = useState('');

//   useEffect(() => {
//     const backAction = () => {
//       if (currentScreen === 'Home') {
//         Alert.alert('Hold on!', 'Are you sure you want to exit?', [
//           {
//             text: 'Cancel',
//             onPress: () => null,
//             style: 'cancel',
//           },
//           {text: 'YES', onPress: () => BackHandler.exitApp()},
//         ]);

//         // BackHandler.exitApp();
//         return true;
//       } else {
//         navigation.goBack();
//         return true;
//       }
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, [currentScreen, navigation]);

//   useFocusEffect(
//     React.useCallback(() => {
//       setCurrentScreen('Home'); // Set the current screen to 'HomeScreen' when this screen is focused
//       return () => setCurrentScreen(''); // Reset the current screen when the screen is blurred
//     }, []),
//   );

//   const {
//     results,
//     resultAccordingLocation,
//     loadingForResultAccordingLocation,
//     nextResult,
//     loaderForNextResult,
//   } = useSelector(state => state.result);

//   const {loadingPromotion, promotions} = useSelector(state => state.promotion);
//   const [filteredData, setFilteredData] = useState([]);

//   // For Big Result
//   const [homeResult, setHomeResult] = useState([]);

//   const focused = useIsFocused();

//   useEffect(() => {
//     dispatch(getAllResult(accesstoken));
//     dispatch(
//       getAllResultAccordingToLocation(
//         accesstoken,
//         homeResult?.lotlocation?._id,
//       ),
//     );
//     dispatch(getNextResult(accesstoken, homeResult?.lotlocation?._id));
//     setHomeResult(results[0]);
//   }, [dispatch, focused]);

//   useEffect(() => {
//     const firstThreeElements = results;
//     setFilteredData(firstThreeElements); // Update filteredData whenever locations change
//     // settingHomeResultUsingLocation(results[0])
//   }, [
//     results,
//     homeResult,
//     loadingForResultAccordingLocation,
//     nextResult,
//     loaderForNextResult,
//     filteredData,
//   ]);

//   const [showDate, setShowDate] = useState(true);
//   const toogleView = () => {
//     setShowDate(false);
//   };

//   const settingHomeResultUsingLocation = item => {
//     setHomeResult(item);
//     dispatch(
//       getAllResultAccordingToLocation(accesstoken, item?.lotlocation?._id),
//     );
//     dispatch(getNextResult(accesstoken, item?.lotlocation?._id));
//   };

//   // For Promotion Image Slider
//   const [currentPage, setCurrentPage] = useState(0);
//   const scrollViewRef = useRef();

//   // Commenting this for Testing next result
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const nextPage = (currentPage + 1) % images.length;
//       setCurrentPage(nextPage);
//       scrollViewRef.current?.scrollTo({x: width * nextPage, animated: true});
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [currentPage]);

//   const handlePageChange = event => {
//     const contentOffset = event.nativeEvent.contentOffset.x;
//     const page = Math.round(contentOffset / width);
//     setCurrentPage(page);
//   };

//   console.log('Promotion :: ' + promotions.length);
//   console.log('Next result  :: ' + nextResult.length);

//   // For Countdown Timer

//   const [nextResultTime, setNextResultTime] = useState(9);

//   // Current time
//   const [currentTime, setCurrentTime] = useState(new Date());
//   // Lot time (time you want to count down to)
//   const lotTime = new Date();
//   lotTime.setHours(nextResultTime); // Set lot time hours (example: 8 AM)
//   lotTime.setMinutes(0); // Set lot time minutes (example: 00)
//   lotTime.setSeconds(0); // Set lot time seconds (example: 00)

//   useEffect(() => {
//     // Update current time every second
//     const interval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     // Clear interval on component unmount
//     return () => clearInterval(interval);
//   }, []);

//   // Calculate time difference between current time and lot time
//   const timeDifference = lotTime.getTime() - currentTime.getTime();

//   return (
//     <SafeAreaView
//       className="flex-1"
//       style={{
//         backgroundColor: COLORS.white,
//         padding: heightPercentageToDP(2),
//       }}>
//       {loading ? (
//         <HomeLoading />
//       ) : (
//         user && (
//           <ScrollView showsVerticalScrollIndicator={false}>
//             {/** TOP HEADER CONTAINER */}
//             <View
//               style={{
//                 height: heightPercentageToDP(10),
//                 flexDirection: 'row',
//               }}>
//               <View
//                 style={{
//                   flex: 3,

//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   gap: heightPercentageToDP(1),
//                 }}>
//                 {/** Profile Image Container */}
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('Test')}
//                   style={{
//                     borderRadius: 100,
//                     overflow: 'hidden',
//                     width: 70,
//                     height: 70,
//                   }}>
//                   <Image
//                     // source={{ uri: 'https://imgs.search.brave.com/bNjuaYsTPw2b4yerAkKyk82fwZ9sNFwkwb3JMnX7qBg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NDU5OTYxMjQtMDUw/MWViYWU4NGQwP3E9/ODAmdz0xMDAwJmF1/dG89Zm9ybWF0JmZp/dD1jcm9wJml4bGli/PXJiLTQuMC4zJml4/aWQ9TTN3eE1qQTNm/REI4TUh4elpXRnlZ/Mmg4TWpCOGZHWmhZ/MlY4Wlc1OE1IeDhN/SHg4ZkRBPQ.jpeg' }}
//                     source={require('../../assets/image/dark_user.png')}
//                     resizeMode="cover"
//                     style={{
//                       height: 70,
//                       width: 70,
//                     }}
//                   />
//                 </TouchableOpacity>

//                 {/** Profile name Container */}
//                 <View>
//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       color: COLORS.black,
//                     }}>
//                     Hello
//                   </Text>
//                   <Text
//                     style={{
//                       fontFamily: FONT.HELVETICA_BOLD,
//                       color: COLORS.black,
//                       fontSize: heightPercentageToDP(2),
//                     }}>
//                     {user.name}
//                   </Text>
//                 </View>
//               </View>

//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: 'center',
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   gap: heightPercentageToDP(2),
//                 }}>
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('Notification')}>
//                   <Ionicons
//                     name={'notifications'}
//                     size={heightPercentageToDP(3)}
//                     color={COLORS.black}
//                   />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => navigation.navigate('Setting')}>
//                   <Entypo
//                     name={'menu'}
//                     size={heightPercentageToDP(3)}
//                     color={COLORS.black}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/** SEARCH CONTAINER */}
//             <TouchableOpacity
//               onPress={() => navigation.navigate('Search')}
//               style={{
//                 height: heightPercentageToDP(7),
//                 flexDirection: 'row',
//                 backgroundColor: COLORS.grayHalfBg,
//                 alignItems: 'center',
//                 paddingHorizontal: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(1),
//                 marginTop: heightPercentageToDP(2),
//               }}>
//               <Fontisto
//                 name={'search'}
//                 size={heightPercentageToDP(3)}
//                 color={COLORS.darkGray}
//               />
//               <Text
//                 style={{
//                   marginStart: heightPercentageToDP(1),
//                   flex: 1,
//                   fontFamily: FONT.Montserrat_Regular,
//                   fontSize: heightPercentageToDP(2),
//                   color: COLORS.black,
//                 }}>
//                 Search for location
//               </Text>
//             </TouchableOpacity>

//             {/** BIG RESULT  */}

//             {homeResult && homeResult.length == 0 ? (
//               <NoDataFound data={'No Result Available'} />
//             ) : showDate ? (
//               <View
//                 style={{
//                   height: heightPercentageToDP(40),
//                   backgroundColor: COLORS.grayHalfBg,
//                   marginTop: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(2),
//                   elevation: heightPercentageToDP(1),
//                 }}>
//                 <View
//                   style={{
//                     height: heightPercentageToDP(30),
//                     borderRadius: heightPercentageToDP(1),
//                     flexDirection: 'row',
//                   }}>
//                   {/** Top view left container */}
//                   <View
//                     style={{
//                       flex: 5,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}>
//                     <Text
//                       style={{
//                         fontFamily: FONT.Montserrat_SemiBold,
//                         fontSize: heightPercentageToDP(3),
//                         marginTop: heightPercentageToDP(2),
//                         color: COLORS.darkGray
//                       }}
//                       numberOfLines={1}>
//                       {homeResult?.lotlocation?.lotlocation}
//                     </Text>
//                     <Text
//                       style={{
//                         fontFamily: FONT.SF_PRO_REGULAR,
//                         fontSize: heightPercentageToDP(14),
//                         color: COLORS.black,
//                         marginTop: heightPercentageToDP(-2),
//                         color: COLORS.black
//                       }}
//                       numberOfLines={1}>
//                       {homeResult?.resultNumber}
//                     </Text>
//                   </View>

//                   {/** Top view right container */}

//                   {loaderForNextResult ? (
//                     <View
//                       style={{
//                         flex: 1,

//                         justifyContent: 'center',
//                       }}>
//                       <Loading />
//                     </View>
//                   ) : (
//                     <View
//                       style={{
//                         flex: 1,
//                         justifyContent: 'center',
//                       }}>
//                       <View
//                         style={{
//                           position: 'absolute',
//                           top: 2,
//                           zIndex: 1,
//                           borderRadius: heightPercentageToDP(2),
//                         }}>
//                         <View
//                           style={{
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               fontFamily: FONT.Montserrat_Regular,
//                               color: COLORS.black,
//                             }}>
//                             Next
//                           </Text>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               fontFamily: FONT.Montserrat_Regular,
//                               color: COLORS.black,
//                             }}>
//                             Result
//                           </Text>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               color: COLORS.black,
//                               fontFamily: FONT.HELVETICA_BOLD,
//                               color: COLORS.black
//                             }}>
//                             {nextResult.length === 0
//                               ? '...'
//                               : nextResult[0].lottime.lottime}
//                           </Text>
//                         </View>
//                       </View>

//                       <View
//                         style={{
//                           flex: 1,
//                           justifyContent: 'flex-end',
//                           borderRadius: heightPercentageToDP(2),
//                         }}>
//                         <Countdown
//                           until={timeDifference / 1000} // Pass time difference in seconds
//                           onFinish={() =>
//                             Toast.show({
//                               text1: 'Result Declear',
//                             })
//                           } // Callback when countdown finishes
//                           size={12}
//                           timeToShow={['H', 'M', 'S']}
//                           digitStyle={{
//                             backgroundColor: '#FFF',
//                             borderWidth: 1,
//                             borderColor: COLORS.black,
//                           }}
//                           digitTxtStyle={{color: COLORS.black}}
//                           timeLabelStyle={{
//                             color: COLORS.black,
//                             fontWeight: 'bold',
//                           }}
//                           separatorStyle={{color: COLORS.black}}
//                           timeLabels={{h: 'Hours', m: 'Minutes', s: 'Seconds'}}
//                           showSeparator
//                           style={{
//                             flexDirection: 'row',
//                             transform: [{rotate: '90deg'}],
//                             color: COLORS.black,
//                             fontFamily: FONT.Montserrat_SemiBold,
//                             fontSize: heightPercentageToDP(2),
//                             paddingHorizontal: heightPercentageToDP(1),
//                             marginStart: heightPercentageToDP(-4),
//                             marginBottom: heightPercentageToDP(4),
//                           }}
//                         />
//                       </View>
//                     </View>
//                   )}
//                 </View>

//                 {/** Big Result bottom container */}

//                 <TouchableOpacity
//                   onPress={toogleView}
//                   style={{
//                     flex: 1,
//                     backgroundColor: COLORS.white_s,
//                     margin: heightPercentageToDP(1),
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     flexDirection: 'row',
//                     gap: heightPercentageToDP(1),
//                     zIndex: 2,
//                     borderRadius: heightPercentageToDP(1),
//                   }}>
//                   <View
//                     style={{
//                       backgroundColor: COLORS.grayHalfBg,
//                       padding: heightPercentageToDP(1),
//                       borderRadius: heightPercentageToDP(1),
//                       marginStart: heightPercentageToDP(-3),
//                     }}>
//                     <Ionicons
//                       name={'calendar'}
//                       size={heightPercentageToDP(3)}
//                       color={COLORS.darkGray}
//                     />
//                   </View>

//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       fontSize: heightPercentageToDP(2),
//                       color: COLORS.black
//                     }}>
//                     {homeResult?.lotdate?.lotdate}
//                   </Text>

//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       fontSize: heightPercentageToDP(2),
//                       color: COLORS.black
//                     }}>
//                     {homeResult?.lottime?.lottime}
//                   </Text>

//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       fontSize: heightPercentageToDP(2),
//                       color: COLORS.black
//                     }}>
//                     {homeResult?.resultNumber}
//                   </Text>

//                   <View
//                     style={{
//                       backgroundColor: COLORS.grayHalfBg,
//                       padding: heightPercentageToDP(0.5),
//                       borderRadius: heightPercentageToDP(1),
//                     }}>
//                     <Ionicons
//                       name={'caret-down-circle-sharp'}
//                       size={heightPercentageToDP(3)}
//                       color={COLORS.darkGray}
//                     />
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View
//                 style={{
//                   height: heightPercentageToDP(45),
//                   backgroundColor: COLORS.grayHalfBg,
//                   marginTop: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(2),
//                   elevation: heightPercentageToDP(1),
//                   justifyContent: 'space-evenly',
//                 }}>
//                 <View
//                   style={{
//                     height: heightPercentageToDP(40),
//                     borderRadius: heightPercentageToDP(1),
//                     flexDirection: 'row',
//                   }}>
//                   {/** Top view left container */}
//                   <View
//                     style={{
//                       flex: 5,
//                       padding: heightPercentageToDP(1),
//                     }}>
//                     {/** Top Locaton With Result */}
//                     <View
//                       style={{
//                         flex: 1,
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         gap: heightPercentageToDP(1),
//                       }}>
//                       <GradientText
//                         style={{
//                           fontSize: heightPercentageToDP(3),
//                           fontFamily: FONT.Montserrat_Bold,
//                           color: COLORS.black
//                         }}>
//                         {homeResult?.lotlocation?.lotlocation}
//                       </GradientText>

//                       <GradientText
//                         style={{
//                           fontSize: heightPercentageToDP(3),
//                           fontFamily: FONT.Montserrat_Bold,
//                           color: COLORS.black,
//                           marginEnd: heightPercentageToDP(1),
//                         }}>
//                         {homeResult?.resultNumber}
//                       </GradientText>
//                     </View>

//                     {/** List of result in flatlist */}

//                     <ScrollView nestedScrollEnabled={true}>
//                       <View
//                         style={{
//                           backgroundColor: COLORS.white,
//                           height: heightPercentageToDP(27),
//                           justifyContent: 'center',
//                           alignItems: 'center',
//                           borderRadius: heightPercentageToDP(1),
//                         }}>
//                         {/** All Date for a specific location */}

//                         {resultAccordingLocation.length === 0 ? (
//                           <View
//                             style={{
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                             }}>
//                             <Text>No Data Available</Text>
//                           </View>
//                         ) : loadingForResultAccordingLocation ? (
//                           <View>
//                             <Loading />
//                           </View>
//                         ) : (
//                           resultAccordingLocation.map((item, index) => (
//                             <TouchableOpacity
//                               onPress={() => {
//                                 setHomeResult(item);
//                                 setShowDate(true);
//                               }}
//                               key={index}
//                               style={{
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-evenly',
//                                 alignItems: 'stretch',
//                                 gap: heightPercentageToDP(2.5),
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(2),
//                                   textAlign: 'left',
//                                   color: COLORS.black
//                                 }}>
//                                 {item.lotdate.lotdate}
//                               </Text>

//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(2),
//                                   color: COLORS.black
//                                 }}>
//                                 {item.lottime.lottime}
//                               </Text>

//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(2),
//                                   textAlign: 'right',
//                                   color: COLORS.black
//                                 }}>
//                                 {item.resultNumber}
//                               </Text>
//                             </TouchableOpacity>
//                           ))
//                         )}
//                       </View>
//                     </ScrollView>
//                   </View>

//                   {/** Top view right container */}
//                   {loaderForNextResult ? (
//                     <View
//                       style={{
//                         flex: 1,

//                         justifyContent: 'center',
//                       }}>
//                       <Loading />
//                     </View>
//                   ) : (
//                     <View
//                       style={{
//                         flex: 1,

//                         justifyContent: 'center',
//                       }}>
//                       <View style={{position: 'absolute', top: 10, zIndex: 1}}>
//                         <View
//                           style={{
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               fontFamily: FONT.Montserrat_Regular,
//                               color: COLORS.black,
//                             }}>
//                             Next
//                           </Text>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               fontFamily: FONT.Montserrat_Regular,
//                               color: COLORS.black,
//                             }}>
//                             Result
//                           </Text>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               color: COLORS.black,
//                               fontFamily: FONT.HELVETICA_BOLD,
//                             }}>
//                             {nextResult.length === 0
//                               ? ''
//                               : nextResult[0].lottime.lottime}
//                           </Text>
//                         </View>
//                       </View>

//                       <View
//                         style={{
//                           flex: 1,
//                           justifyContent: 'flex-end',
//                           borderRadius: heightPercentageToDP(2),
//                         }}>
//                         <Countdown
//                           until={timeDifference / 1000} // Pass time difference in seconds
//                           onFinish={() =>
//                             Toast.show({
//                               text1: 'Result Declear',
//                             })
//                           } // Callback when countdown finishes
//                           size={12}
//                           timeToShow={['H', 'M', 'S']}
//                           digitStyle={{
//                             backgroundColor: '#FFF',
//                             borderWidth: 1,
//                             borderColor: COLORS.black,
//                           }}
//                           digitTxtStyle={{color: COLORS.black}}
//                           timeLabelStyle={{
//                             color: COLORS.black,
//                             fontWeight: 'bold',
//                           }}
//                           separatorStyle={{color: COLORS.black}}
//                           timeLabels={{h: 'Hours', m: 'Minutes', s: 'Seconds'}}
//                           showSeparator
//                           style={{
//                             flexDirection: 'row',
//                             transform: [{rotate: '90deg'}],
//                             color: COLORS.black,
//                             fontFamily: FONT.Montserrat_SemiBold,
//                             fontSize: heightPercentageToDP(2),
//                             paddingHorizontal: heightPercentageToDP(1),
//                             marginStart: heightPercentageToDP(-2),
//                             marginBottom: heightPercentageToDP(7),
//                           }}
//                         />
//                       </View>
//                     </View>
//                   )}
//                 </View>

//                 {/** Big Result bottom container */}

//                 <TouchableOpacity
//                   onPress={() => setShowDate(true)}
//                   style={{
//                     backgroundColor: COLORS.white_s,

//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     flexDirection: 'row',
//                     gap: heightPercentageToDP(1),
//                     zIndex: 2,
//                     borderRadius: heightPercentageToDP(1),
//                     height: heightPercentageToDP(5),
//                     marginBottom: heightPercentageToDP(2),
//                     marginHorizontal: heightPercentageToDP(2),
//                   }}>
//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       fontSize: heightPercentageToDP(2),
//                       color: COLORS.black,
//                     }}>
//                     Download
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/** BOTTOM RESULT CONTAINER */}

//             <View
//               style={{
//                 height: heightPercentageToDP(5),
//                 marginVertical: heightPercentageToDP(2),
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//               }}>
//               <GradientText
//                 style={{
//                   fontSize: heightPercentageToDP(4),
//                   fontFamily: FONT.Montserrat_Bold,
//                   color: COLORS.black
//                 }}>
//                 Results
//               </GradientText>

//               <Text
//                 onPress={() => navigation.navigate('AllResult')}
//                 style={{
//                   fontFamily: FONT.Montserrat_Regular,
//                   fontSize: heightPercentageToDP(2),
//                   textAlign: 'center',
//                   textAlignVertical: 'center',
//                   color: COLORS.black
//                 }}>
//                 See all
//               </Text>
//             </View>

//             {/** BOTTOM RESULT CONTENT CONTAINER */}

//             {filteredData.length === 0 ? (
//               <NoDataFound data={'No Result Available'} />
//             ) : (
//               <View
//                 style={{
//                   height: heightPercentageToDP(25),
//                   borderRadius: heightPercentageToDP(1),
//                   flexDirection: 'row',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   gap: heightPercentageToDP(2),
//                   marginBottom: heightPercentageToDP(2)
//                 }}>
//                 <ScrollView
//                   horizontal={true}
//                   showsVerticalScrollIndicator={false}
//                   showsHorizontalScrollIndicator={false}>
//                   {filteredData.map((item, index) => (
//                     <TouchableOpacity
//                       onPress={() => settingHomeResultUsingLocation(item)}
//                       key={index}
//                       style={{
//                         height: heightPercentageToDP(20),
//                         width: widthPercentageToDP(30),
//                         borderRadius: heightPercentageToDP(1),
//                         backgroundColor: 'gray',
//                         ...styles.resultContentContainer,
//                         position: 'relative',
//                       }}>
//                       <View
//                         style={{
//                           flex: 1,
//                           backgroundColor:
//                             index % 2 === 0
//                               ? COLORS.grayHalfBg
//                               : COLORS.lightDarkGray,
//                           borderTopRightRadius: heightPercentageToDP(1),
//                           borderTopLeftRadius: heightPercentageToDP(1),
//                           paddingTop: heightPercentageToDP(1),
//                         }}>
//                         <Text
//                           style={{
//                             fontFamily: FONT.Montserrat_SemiBold,
//                             fontSize: heightPercentageToDP(2),
//                             textAlign: 'center',
//                             color: COLORS.black
//                           }}>
//                           {item.lotlocation.lotlocation}
//                         </Text>
//                       </View>

//                       <View
//                         style={{
//                           backgroundColor: 'transparent',
//                         }}>
//                         <Text
//                           style={{
//                             fontFamily: FONT.Montserrat_SemiBold,
//                             fontSize: heightPercentageToDP(5),
//                             textAlign: 'center',
//                             color: COLORS.black
//                           }}>
//                           {item.resultNumber}
//                         </Text>
//                       </View>

//                       <View
//                         style={{
//                           flex: 1,
//                           backgroundColor: COLORS.white_s,
//                           borderBottomRightRadius: heightPercentageToDP(1),
//                           borderBottomLeftRadius: heightPercentageToDP(1),
//                           justifyContent: 'flex-end',
//                           margin: heightPercentageToDP(0.5),
//                         }}>
//                         <Text
//                           style={{
//                             fontFamily: FONT.Montserrat_Regular,
//                             fontSize: heightPercentageToDP(2),
//                             textAlign: 'center',
//                             padding: heightPercentageToDP(0.5),
//                             color: COLORS.black
//                           }}>
//                           {item.lottime.lottime}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             )}

//             {/** PROMOTION CONTAINER */}

//             {loadingPromotion ? (
//               <View
//                 style={{
//                   height: heightPercentageToDP(20),
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <Loading />
//               </View>
//             ) : (
//               <View style={styles.container}>
//                 <View>
//                   <ScrollView
//                     ref={scrollViewRef}
//                     horizontal
//                     pagingEnabled
//                     showsHorizontalScrollIndicator={false}
//                     onScroll={handlePageChange}
//                     scrollEventThrottle={16}>
//                     {/* https://sincelott.onrender.com/uploads/promotion/ */}
//                     {promotions.map((image, index) => (
//                       <Image
//                         key={index}
//                         source={{uri: "https://sincelott.onrender.com/uploads/promotion/"+image.url}}
//                         style={styles.image}
//                         resizeMode="cover"
//                       />
//                     ))}
//                   </ScrollView>
//                 </View>

//                 <View style={styles.indicatorContainer}>
//                   {images.map((_, index) => (
//                     <View
//                       key={index}
//                       style={[
//                         styles.indicator,
//                         {
//                           backgroundColor:
//                             currentPage === index
//                               ? COLORS.darkGray
//                               : COLORS.grayHalfBg,
//                         },
//                       ]}
//                     />
//                   ))}
//                 </View>
//               </View>
//             )}

//             {/** WALLET CONTAINER */}
//             <View style={{justifyContent: 'center',alignItems: 'center'}}>
//             <ScrollView
//               horizontal={true}
//               showsHorizontalScrollIndicator={false}>
//               {user.walletOne.visibility && (
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate('WalletBalance', {data: user.walletOne})
//                   }>
//                   <Wallet wallet={user.walletOne} />
//                 </TouchableOpacity>
//               )}

//               {
//                 user.walletTwo.visibility &&

//                 <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate('WalletBalance', {data: user.walletTwo})
//                 }>
//                 <Wallet wallet={user.walletTwo} />
//               </TouchableOpacity>
//               }

//             </ScrollView>

//             </View>

//           </ScrollView>
//         )
//       )}
//     </SafeAreaView>
//   );
// };

// export default Home;

// // <View>
// // <ScrollView
// //   horizontal={true}
// //   showsHorizontalScrollIndicator={false}>
// //   {promotiondata.map((item, index) => (
// //     <TouchableOpacity
// //       key={index}
// //       style={{marginEnd: heightPercentageToDP(2)}}>
// //       <View
// //         style={{
// //           height: heightPercentageToDP(25),
// //           width: widthPercentageToDP(90),
// //           backgroundColor: COLORS.grayHalfBg,
// //           marginTop: heightPercentageToDP(2),
// //           borderRadius: heightPercentageToDP(1),
// //           flexDirection: 'row',
// //           justifyContent: 'center',
// //           alignItems: 'center',
// //           gap: heightPercentageToDP(2),
// //         }}>
// //         <GradientText
// //           style={{
// //             fontSize: heightPercentageToDP(4),
// //             fontFamily: FONT.Montserrat_Bold,
// //           }}>
// //           Promotions
// //         </GradientText>
// //       </View>
// //     </TouchableOpacity>
// //   ))}
// // </ScrollView>
// // </View>

// const styles = StyleSheet.create({
//   resultContentContainer: {
//     // Add shadow properties
//     ...Platform.select({
//       ios: {
//         shadowColor: 'rgba(0, 0, 0, 0.2)',
//         shadowOffset: {
//           width: 0,
//           height: 2,
//         },
//         shadowOpacity: 1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//     // Add border radius and margin properties
//     borderRadius: 8,
//     margin: 10,
//     // Add background color and any other styles you need
//     backgroundColor: '#fff',
//   },
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//   },
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: heightPercentageToDP(4),
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
//   container: {
//     flex: 1,
//   },
//   image: {
//     width,
//     height: heightPercentageToDP(20), // adjust the height as needed
//     borderRadius: heightPercentageToDP(1),
//   },
//   indicatorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: heightPercentageToDP(1),
//   },
//   indicator: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginHorizontal: 5,
//   },
// });
