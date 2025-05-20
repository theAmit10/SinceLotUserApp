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
  ImageBackground,
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import GradientText from '../components/helpercComponent/GradientText';
import Wallet from '../components/home/Wallet';
import {useDispatch, useSelector} from 'react-redux';
import {
  loadAllNotification,
  loadAllPromotion,
  loadProfile,
} from '../redux/actions/userAction';
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
import {ImageSlider} from '@pembajak/react-native-image-slider-banner';
import {onDisplayNotification} from '../helper/NotificationServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import {
  getDateTimeAccordingToUserTimezone,
  getTimeAccordingToTimezone,
} from './SearchTime';
import Test from './Test';
import TimerTest from './TimerTest';
import SelectYearAndMonth from '../components/helpercComponent/SelectYearAndMonth';

const images = [
  'https://imgs.search.brave.com/PvhNVIxs9m8r1whelc9RPX2dMQ371Xcsk3Lf2dCiVHQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmlnLXNhbGUt/YmFubmVyLWRlc2ln/bi1zcGVjaWFsLW9m/ZmVyLXVwLTUwLW9m/Zi1yZWFkeS1wcm9t/b3Rpb24tdGVtcGxh/dGUtdXNlLXdlYi1w/cmludC1kZXNpZ25f/MTEwNDY0LTU3MC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw',
  'https://imgs.search.brave.com/0_WERhkh6NjaGafm4qPeYRM1WbUdabgTpK7LCJ8EKFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaG90LXNhbGUt/aG9yaXpvbnRhbC1i/YW5uZXItd2l0aC1z/ZWFzb25hbC1vZmZl/cl80MTkzNDEtNjA1/LmpwZz9zaXplPTYy/NiZleHQ9anBn',
  'https://imgs.search.brave.com/pBRUab3Kras4ziV_cQdR0AtRiSrOuJKwhMTmHY988d8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BlY2lhbC1v/ZmZlci1maW5hbC1z/YWxlLXRhZy1iYW5u/ZXItZGVzaWduLXRl/bXBsYXRlLW1hcmtl/dGluZy1zcGVjaWFs/LW9mZmVyLXByb21v/dGlvbl82ODA1OTgt/MTk1LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
];

const COLORS_LIST = [
  COLORS.result_lightblue,
  COLORS.result_green,
  COLORS.result_yellow,
  COLORS.result_orange,
  COLORS.result_pink,
  COLORS.result_darkblue,
  COLORS.result_purple,
  COLORS.result_cyan,
];

const Home = () => {
  const {user, accesstoken, loading} = useSelector(state => state.user);
  const focused = useIsFocused();
  const [showDate, setShowDate] = useState(true);

  const [nextResultTime, setNextResultTime] = useState(10);
  const [timeDifference, setTimeDifference] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth(); // 0-based index (0 = January, 11 = December)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showSelectYear, setShowSelectYear] = useState(false);
  const [showSelectMonth, setShowSelectMonth] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const setDefaultMonthAndYearForResult = () => {
    setSelectedMonth(months[currentMonthIndex]);
    setSelectedYear(currentYear);
  };

  useEffect(() => {
    dispatch(loadAllPromotion(accesstoken));
  }, [dispatch, focused]);

  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [dispatch, focused]);

  const [currentScreen, setCurrentScreen] = useState('');
  const [firstTimeClick, setFirstTimeClick] = useState(true);

  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'Home') {
        if (!showDate) {
          setShowDate(true);
          console.log('Backbutton pressed ');
        } else {
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
  }, [currentScreen, navigation, showDate]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreen('Home'); // Set the current screen to 'HomeScreen' when this screen is focused
      return () => setCurrentScreen(''); // Reset the current screen when the screen is blurred
    }, []),
  );

  // console.log("Show date :: "+showDate)
  const {
    results,
    resultAccordingLocation,
    loadingForResultAccordingLocation,
    nextResult,
    loaderForNextResult,
  } = useSelector(state => state.result);

  const {loadingPromotion, promotions} = useSelector(state => state.promotion);
  const [filteredData, setFilteredData] = useState([]);

  const [initialResultIndex, setInitialResultIndex] = useState(0);

  // console.log(JSON.stringify(promotions))

  // For Big Result
  const [homeResult, setHomeResult] = useState([]);

  useEffect(() => {
    dispatch(getAllResult(accesstoken));
    dispatch(
      getAllResultAccordingToLocation(
        accesstoken,
        homeResult?.lotlocation?._id,
        selectedYear,
        selectedMonth.toLowerCase(),
      ),
    );
    dispatch(getNextResult(accesstoken, homeResult?.lotlocation?._id));
    setHomeResult(results[0]);
  }, [dispatch, focused]);

  // Commenting this for checking
  // useEffect(() => {
  //   const firstThreeElements = results;

  //   // const firstThreeElements = results.slice(0,20);

  //   if (firstTimeClick) {
  //     setHomeResult(firstThreeElements[0]);
  //   }
  //   setFilteredData(firstThreeElements); // Update filteredData whenever locations change
  //   // settingHomeResultUsingLocation(results[0])
  // }, [
  //   results,
  //   homeResult,
  //   loadingForResultAccordingLocation,
  //   nextResult,
  //   loaderForNextResult,
  //   filteredData,
  //   nextResultTime,
  //   timeDifference,
  // ]);

  useEffect(() => {
    const firstThreeElements = results.slice(0, 15);
    if (firstTimeClick) {
      setHomeResult(firstThreeElements[0]);
    }
    setFilteredData(firstThreeElements);
  }, [results, homeResult]);

  const toogleView = () => {
    setShowDate(false);
  };

  const afterTimerCompleted = () => {
    dispatch(getAllResult(accesstoken));
    dispatch(
      getAllResultAccordingToLocation(
        accesstoken,
        homeResult?.lotlocation?._id,
        selectedYear,
        selectedMonth.toLowerCase(),
      ),
    );
    setHomeResult(results[initialResultIndex]);
  };

  const settingHomeResultUsingLocation = (item, index) => {
    setHomeResult(item);
    setFirstTimeClick(false);
    setInitialResultIndex(index);
    console.log('Mine time');
    console.log(
      extractTime(
        getTimeAccordingToTimezone(
          item.nextresulttime,
          user?.country?.timezone,
        ),
      ),
    );

    const {hour, minute, period} = extractTime(
      getTimeAccordingToTimezone(item.nextresulttime, user?.country?.timezone),
    );
    console.log(hour);
    console.log(minute);
    console.log(period);
    // setNextResultTime(hour);
    const hour_time = hour + ' ' + period;
    console.log('Hour_time :: ' + hour_time);
    // settingTimerForNextResult(hour, minute, period);
    settingTimerForNextResult(item.nextresulttime, user?.country?.timezone);

    dispatch(
      getAllResultAccordingToLocation(
        accesstoken,
        item.lotlocation._id,
        selectedYear,
        selectedMonth.toLowerCase(),
      ),
    );
    // dispatch(getNextResult(accesstoken, item.lotlocation._id));
  };

  // For Promotion Image Slider
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef();

  // Commenting this for Testing next result
  useEffect(() => {
    const interval = setInterval(() => {
      // const nextPage = (currentPage + 1) % images.length;
      const nextPage = (currentPage + 1) % promotions.length;
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

  useEffect(() => {
    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [homeResult, currentTime, timeDifference]);

  // const settingTimerForNextResult = async (hour, minute, period) => {
  //   let hour24 = parseInt(hour);

  //   if (period.toLowerCase() === 'pm' && hour24 < 12) {
  //     hour24 += 12;
  //   } else if (period.toLowerCase() === 'am' && hour24 === 12) {
  //     hour24 = 0;
  //   }

  //   const lotTime = new Date();
  //   lotTime.setHours(hour24);
  //   lotTime.setMinutes(parseInt(minute));
  //   lotTime.setSeconds(0);

  //   setTimeDifference(lotTime.getTime() - currentTime.getTime());

  //   console.log('Setting timer');
  //   console.log('lottime :: ' + lotTime.getTime());
  //   console.log('currenttime :: ' + currentTime.getTime());
  //   console.log(
  //     'Both Difference :: ',
  //     lotTime.getTime() - currentTime.getTime(),
  //   );

  //   // Calculate time difference between current time and lot time
  //   setTimeDifference(lotTime.getTime() - currentTime.getTime());

  //   // Ensure that data is loaded before setting the timer
  //   await dispatch(getAllResult(accesstoken));
  //   await dispatch(
  //     getAllResultAccordingToLocation(
  //       accesstoken,
  //       homeResult?.lotlocation?._id,
  //     ),
  //   );
  //   await dispatch(getNextResult(accesstoken, homeResult?.lotlocation?._id));
  // };

  // Function to parse "11:00 AM" time string and set countdown based on user's timezone
  const settingTimerForNextResult = (timeString, timezone) => {
    console.log("User's Timezone: ", timezone);
    const [time, period] = timeString.split(' '); // Split time and period
    const [hour, minute] = time.split(':').map(Number);

    let hour24 = hour;
    if (period.toLowerCase() === 'pm' && hour24 < 12) {
      hour24 += 12;
    } else if (period.toLowerCase() === 'am' && hour24 === 12) {
      hour24 = 0;
    }

    // Get current time in user's timezone
    const currentTime = moment().tz(timezone);
    console.log('Current Time in User Timezone:', currentTime.format());

    // Get target time
    const targetTime = moment.tz(
      `${currentTime.format('YYYY-MM-DD')} ${hour24}:${minute}:00`,
      'YYYY-MM-DD HH:mm:ss',
      timezone,
    );
    console.log('Target Time:', targetTime.format());

    // If target time has passed, move to next day
    if (targetTime.isBefore(currentTime)) {
      targetTime.add(1, 'day');
      console.log('Target Time Updated for Next Day:', targetTime.format());
    }

    // Calculate difference in seconds
    const diff = targetTime.diff(currentTime, 'seconds');
    console.log('Time Difference in Seconds:', diff);

    if (diff > 0) {
      setTimeDifference(diff); // Only set if the difference is positive
    } else {
      console.log(
        'The target time is not in the future. Countdown cannot start.',
      );
    }
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
                  <td><span>${getDateTimeAccordingToUserTimezone(
                    item?.lottime?.lottime,
                    item?.lotdate?.lotdate,
                    user?.country?.timezone,
                  )}</span></td>
                  <td><span>${getTimeAccordingToTimezone(
                    item.lottime?.lottime,
                    user?.country?.timezone,
                  )}</span></td>
                  <td><span>${item.resultNumber}</span></td>
                </tr>
              `,
                  )
                  .join('')}
                </tbody>
              </table>
              
            </article>
            <aside>
              <h1><span>Since 2001</span></h1>
              <div>
                <p>Thank you for download</p>
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
    if (!homeResult) {
      Toast.show({
        type: 'info',
        text1: 'No data available',
      });
    } else {
      let options = {
        //Content to print
        html: htmlContent,
        //File Name
        fileName: `${homeResult.lotdate.lotdate}${getTimeAccordingToTimezone(
          homeResult.lottime.lottime,
          user?.country?.timezone,
        )}`,
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
    }
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

  const sliderData = promotions.map((promotion, index) => ({
    img: `${serverName}/uploads/promotion/${promotion.url}`,
  }));

  const shownotifee = () => {
    onDisplayNotification('Jammu Result', '11:00 AM Jammu Result Announced');
  };

  // Define state variables for error and retry
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      // Clear any previous error
      setError(null);
      // Set loading state
      setLoading(true);
      // Dispatch actions to fetch data
      await dispatch(loadAllPromotion(accesstoken));
      await dispatch(loadProfile(accesstoken));
      await dispatch(getAllResult(accesstoken));
      await dispatch(
        getAllResultAccordingToLocation(
          accesstoken,
          homeResult?.lotlocation?._id,
          selectedYear,
          selectedMonth.toLowerCase(),
        ),
      );
      await dispatch(getNextResult(accesstoken, homeResult?.lotlocation?._id));
      // Data fetched successfully, set loading state to false
      setLoading(false);
    } catch (error) {
      // Set error state if there is an issue with fetching data
      setError(error.message);
      // Data fetching failed, set loading state to false
      setLoading(false);
    }
  };

  // useEffect hook to fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle retry
  const handleRetry = () => {
    // Set retrying state to true
    setRetrying(true);
    // Call the fetchData function to retry fetching data
    fetchData();
    // Reset retrying state after retrying
    setRetrying(false);
  };

  // Function to clear AsyncStorage data when the user logs out
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage data cleared successfully.');
      navigation.reset({
        index: 0,
        routes: [{name: 'SplashScreen'}],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error,
      });
    }
  };

  const logoutHandler = () => {
    console.log('Logging Off...');

    Toast.show({
      type: 'success',
      text1: 'Logging Out ',
      text2: 'Please wait...',
    });

    setTimeout(() => {
      clearAsyncStorage();
    }, 1000);
  };

  // Auto Reload HomeScreen
  const [previousData, setPreviousData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log('Auto Reloading start');
        dispatch(getAllResult(accesstoken));
        const {results} = useSelector(state => state.result);

        if (!isEqual(previousData, results)) {
          setPreviousData(results);
          // Refresh your home screen here
          // For example, force a re-render of the home screen component
          // or use some state to trigger a re-render.
        }
      } catch (error) {
        // console.log('Auto Reloading error');
        // console.log(error);
      }
    };

    // Fetch data initially when component mounts
    fetchData();

    // Background fetch every 8 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 8000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch, accesstoken, previousData]);

  const isEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  const {notifications, loadingNotification} = useSelector(state => state.user);

  const [newNotification, setNewNotification] = useState(true);

  useEffect(() => {
    dispatch(loadAllNotification(accesstoken, user?._id));
  }, [dispatch, focused]);

  useEffect(() => {
    if ((!loadingNotification && notifications, user)) {
      checkingForNewNotification();
      setDefaultMonthAndYearForResult();
    }
  }, [loadingNotification, notifications, focused, user]);

  const checkingForNewNotification = () => {
    console.log('CHECKING FOR NEW NOTIFCATION');
    if (notifications) {
      const noti =
        notifications?.length === 0 ? true : notifications[0]?.seennow;
      console.log('seennow noti len :: ' + notifications?.length);
      console.log('seennow :: ' + noti);
      setNewNotification(noti);
    }
  };

  useEffect(() => {
    console.log('CHANGING MONTH OR YEAR');
    dispatch(
      getAllResultAccordingToLocation(
        accesstoken,
        homeResult?.lotlocation?._id,
        selectedYear,
        selectedMonth.toLowerCase(),
      ),
    );
  }, [dispatch, selectedYear, selectedMonth, showSelectMonth, showSelectYear]);

  const [partner, setPartner] = useState(false);
  useEffect(() => {
    if (user && user.partnerStatus) {
      setPartner(true);
    }
  }, [user]);
  return (
    <SafeAreaView className="flex-1">
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/image/tlwbg.jpg')}>
          {loading ? (
            <HomeLoading />
          ) : user ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/** TOP HEADER CONTAINER */}
              <View
                style={{
                  height: heightPercentageToDP(10),
                  flexDirection: 'row',
                  paddingHorizontal: heightPercentageToDP(2),
                  marginTop: heightPercentageToDP(2),
                }}>
                <View
                  style={{
                    width: widthPercentageToDP(56),
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: heightPercentageToDP(1),
                  }}>
                  {/** Profile Image Container */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('UserProfile')}
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
                  <View
                    style={{
                      width: widthPercentageToDP(34),
                    }}>
                    <GradientTextWhite
                      style={{
                        fontSize: heightPercentageToDP(2),
                        fontFamily: FONT.Montserrat_Bold,
                        color: COLORS.white_s,
                      }}>
                      User ID - {user ? user.userId : ''}
                    </GradientTextWhite>

                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        color: COLORS.white_s,
                      }}>
                      Hello
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: FONT.HELVETICA_BOLD,
                          color: COLORS.white_s,
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
                  }}>
                  <TouchableOpacity onPress={() => navigation.navigate('Play')}>
                    <Image
                      source={require('../../assets/image/playbtn.png')}
                      resizeMode="stretch"
                      style={{
                        height: heightPercentageToDP(4),
                        width: heightPercentageToDP(12),
                        marginBottom: heightPercentageToDP(1),

                        alignSelf: 'flex-start',
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      marginStart: 10,
                    }}
                    onPress={() => navigation.navigate('Notification')}>
                    {newNotification ? (
                      <Ionicons
                        name={'notifications'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.white_s}
                      />
                    ) : (
                      <MaterialIcons
                        name={'notification-add'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.lightyellow}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      marginStart: 10,
                    }}
                    onPress={() => navigation.navigate('Setting')}>
                    <Entypo
                      name={'menu'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.white_s}
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
                  marginHorizontal: heightPercentageToDP(2),
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

              {/** TO SHOW YEAR AND MONTH CONTAINER */}
              {showSelectYear && (
                <SelectYearAndMonth
                  onClose={() => setShowSelectYear(false)}
                  setSelectedMonth={setSelectedMonth}
                  setSelectedYear={setSelectedYear}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                />
              )}

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
                    marginHorizontal: heightPercentageToDP(2),
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

                          width: '100%',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(4),

                            color: COLORS.black,
                          }}
                          numberOfLines={1}>
                          {homeResult?.lotlocation?.lotlocation}
                        </Text>
                      </View>

                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.SF_PRO_REGULAR,
                            fontSize: heightPercentageToDP(14),
                            color: COLORS.black,
                            paddingStart: heightPercentageToDP(3),
                          }}
                          numberOfLines={1}>
                          {homeResult?.resultNumber}
                        </Text>
                      </View>
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
                          flex: 1.5,
                          justifyContent: 'center',
                          alignItems: 'center',
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
                              {getTimeAccordingToTimezone(
                                homeResult?.nextresulttime,
                                user?.country?.timezone,
                              )}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderRadius: heightPercentageToDP(2),
                          }}>
                          <Test
                            timeString={getTimeAccordingToTimezone(
                              homeResult?.nextresulttime,
                              user?.country?.timezone,
                            )}
                            timezone={user?.country?.timezone}
                          />

                          {/* <Countdown
                            until={timeDifference}
                            onFinish={() => afterTimerCompleted()}
                            size={12}
                            timeToShow={['H', 'M', 'S']}
                            digitStyle={{
                              backgroundColor: 'transparent', // Set background to transparent
                              borderWidth: 0, // Remove border
                              paddingHorizontal: 0, // Remove horizontal padding
                              paddingVertical: 0, // Remove vertical padding
                              margin: 0, // Remove margin
                            }}
                            digitTxtStyle={{color: COLORS.black}}
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
                              transform: [{rotate: '90deg'}],
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_SemiBold,
                              fontSize: heightPercentageToDP(3),
                              marginStart: heightPercentageToDP(-2),
                              marginBottom: heightPercentageToDP(9),
                            }}
                          /> */}
                        </View>
                      </View>
                    )}
                  </View>

                  {/** Big Result bottom container */}

                  {/**
   * 
   *  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'pink',
                      margin: heightPercentageToDP(1),
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: heightPercentageToDP(1),
                      zIndex: 2,
                      borderRadius: heightPercentageToDP(1),
                      
                    }}>
                    <TouchableOpacity
                      onPress={() => setShowSelectYear(true)}
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
                    </TouchableOpacity>

                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      {getDateTimeAccordingToUserTimezone(
                        homeResult?.lottime?.lottime,
                        homeResult?.lotdate?.lotdate,
                        user?.country?.timezone,
                      )}
                    </Text>

                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      {getTimeAccordingToTimezone(
                        homeResult?.lottime?.lottime,
                        user?.country?.timezone,
                      )}
                    </Text>

                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        color: COLORS.black,
                      }}>
                      {homeResult?.resultNumber}
                    </Text>

                    <TouchableOpacity
                      onPress={toogleView}
                      style={{
                        flex: 1,
                        paddingEnd: heightPercentageToDP(2),
                        backgroundColor: 'cyan'
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
                    </TouchableOpacity>
                  </View>
   */}

                  <View
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
                    <TouchableOpacity
                      onPress={() => setShowSelectYear(true)}
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
                    </TouchableOpacity>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                          marginRight: heightPercentageToDP(1),
                        }}>
                        {getDateTimeAccordingToUserTimezone(
                          homeResult?.lottime?.lottime,
                          homeResult?.lotdate?.lotdate,
                          user?.country?.timezone,
                        )}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                          marginRight: heightPercentageToDP(1),
                        }}>
                        {getTimeAccordingToTimezone(
                          homeResult?.lottime?.lottime,
                          user?.country?.timezone,
                        )}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                          marginRight: heightPercentageToDP(1),
                        }}>
                        {homeResult?.resultNumber}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={toogleView}
                      style={{
                        paddingEnd: heightPercentageToDP(2),
                      }}>
                      <View
                        style={{
                          backgroundColor: COLORS.grayHalfBg,
                          padding: heightPercentageToDP(0.5),
                          borderRadius: heightPercentageToDP(1),
                        }}>
                        <Ionicons
                          name={'caret-down-circle-sharp'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
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
                    marginHorizontal: heightPercentageToDP(2),
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

                      <ScrollView nestedScrollEnabled>
                        <LinearGradient
                          colors={[COLORS.white_s, COLORS.grayHalfBg]}
                          style={{
                            backgroundColor: COLORS.white,
                            height: heightPercentageToDP(27),
                            borderRadius: heightPercentageToDP(1),
                            paddingHorizontal: heightPercentageToDP(1),
                            paddingVertical: heightPercentageToDP(2),
                            marginHorizontal: heightPercentageToDP(3),
                            marginTop: heightPercentageToDP(2),
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
                            <ScrollView nestedScrollEnabled>
                              {resultAccordingLocation.map((item, index) => (
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
                                    gap: heightPercentageToDP(2),
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: FONT.HELVETICA_BOLD,
                                      fontSize: heightPercentageToDP(2),
                                      textAlign: 'left',
                                      color: COLORS.black,
                                    }}>
                                    {/* {item.lotdate.lotdate} */}
                                    {getDateTimeAccordingToUserTimezone(
                                      item?.lottime?.lottime,
                                      item?.lotdate?.lotdate,
                                      user?.country?.timezone,
                                    )}
                                  </Text>

                                  <Text
                                    style={{
                                      fontFamily: FONT.HELVETICA_BOLD,
                                      fontSize: heightPercentageToDP(2),
                                      color: COLORS.black,
                                    }}>
                                    {getTimeAccordingToTimezone(
                                      item.lottime.lottime,
                                      user?.country?.timezone,
                                    )}
                                  </Text>

                                  <Text
                                    style={{
                                      fontFamily: FONT.HELVETICA_BOLD,
                                      fontSize: heightPercentageToDP(2),
                                      textAlign: 'right',
                                      color: COLORS.black,
                                    }}>
                                    {item.resultNumber}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
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
                        <View
                          style={{position: 'absolute', top: 10, zIndex: 1}}>
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
                              {getTimeAccordingToTimezone(
                                homeResult?.nextresulttime,
                                user?.country?.timezone,
                              )}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            borderRadius: heightPercentageToDP(2),
                          }}>
                          {/* <Countdown
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
                            digitTxtStyle={{color: COLORS.black}}
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
                              transform: [{rotate: '90deg'}],
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_SemiBold,
                              fontSize: heightPercentageToDP(3),
                              marginStart: heightPercentageToDP(-4),
                              marginBottom: heightPercentageToDP(15),
                            }}
                          /> */}
                          <TimerTest
                            timeString={getTimeAccordingToTimezone(
                              homeResult?.nextresulttime,
                              user?.country?.timezone,
                            )}
                            timezone={user?.country?.timezone}
                          />
                        </View>
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
                    {/* <TouchableOpacity
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
                  </TouchableOpacity> */}

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
                  marginVertical: heightPercentageToDP(2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: heightPercentageToDP(2),
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
                <View
                  style={{
                    marginHorizontal: heightPercentageToDP(2),
                  }}>
                  <NoDataFound data={'No Result Available'} />
                </View>
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
                    marginHorizontal: heightPercentageToDP(2),
                  }}>
                  <ScrollView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    {filteredData.map((item, index) => (
                      <TouchableOpacity
                        onPress={() =>
                          settingHomeResultUsingLocation(item, index)
                        }
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
                            backgroundColor:
                              COLORS_LIST[index % COLORS_LIST.length],
                            borderTopRightRadius: heightPercentageToDP(1),
                            borderTopLeftRadius: heightPercentageToDP(1),
                            paddingTop: heightPercentageToDP(1),
                            height: heightPercentageToDP(6),
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_SemiBold,
                              fontSize: heightPercentageToDP(2),
                              textAlign: 'center',
                              color: COLORS.black,
                            }}
                            numberOfLines={2}
                            adjustsFontSizeToFit={true}>
                            {item?.lotlocation?.lotlocation}
                          </Text>
                        </View>

                        <View
                          style={{
                            backgroundColor: 'transparent',
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_SemiBold,
                              fontSize: heightPercentageToDP(6),
                              textAlign: 'center',
                              color: COLORS.black,
                            }}>
                            {item?.resultNumber}
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
                            }}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}>
                            {getTimeAccordingToTimezone(
                              item?.lottime?.lottime,
                              user?.country?.timezone,
                            )}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/** PLAY HISTORY AND HISTORY */}

              <View
                style={{
                  height: heightPercentageToDP(5),
                  position: 'relative',
                  marginVertical: heightPercentageToDP(2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginStart: heightPercentageToDP(3),
                  marginEnd: heightPercentageToDP(2),
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Payment')}>
                  <LinearGradient
                    colors={[COLORS.white, COLORS.white]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: heightPercentageToDP(2),
                      paddingHorizontal: heightPercentageToDP(2),
                      width: widthPercentageToDP(42),
                    }}>
                    <LinearGradient
                      colors={[COLORS.grayBg, COLORS.white_s]}
                      className="rounded-xl p-2"
                      style={{
                        position: 'absolute',
                        left: 0,
                        padding: heightPercentageToDP(1), // Keep the padding as is
                        borderRadius: heightPercentageToDP(2),
                        justifyContent: 'center', // Center vertically
                        alignItems: 'center', // Center horizontally
                      }}>
                      <Image
                        source={require('../../assets/image/deposit.png')}
                        resizeMode="cover"
                        style={{
                          height: heightPercentageToDP(3),
                          width: heightPercentageToDP(3),
                        }}
                      />
                    </LinearGradient>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: heightPercentageToDP(5),
                      }}>
                      <GradientText
                        style={{
                          fontSize: heightPercentageToDP(2),
                          fontFamily: FONT.Montserrat_Bold,
                          color: COLORS.black,
                        }}>
                        {`\u00A0 Deposit`}
                      </GradientText>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('PlayHistory')}>
                  <LinearGradient
                    colors={[COLORS.white, COLORS.white]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      borderRadius: heightPercentageToDP(2),
                      paddingHorizontal: heightPercentageToDP(2),
                      width: widthPercentageToDP(42),
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: heightPercentageToDP(5),
                      }}>
                      <GradientText
                        style={{
                          fontSize: heightPercentageToDP(2),
                          fontFamily: FONT.Montserrat_Bold,
                          color: COLORS.black,
                        }}>
                        Play history
                      </GradientText>
                    </View>

                    <LinearGradient
                      colors={[COLORS.grayBg, COLORS.white_s]}
                      style={{
                        position: 'absolute',
                        right: 0,
                        padding: heightPercentageToDP(1), // Keep the padding as is
                        borderRadius: heightPercentageToDP(2),
                        justifyContent: 'center', // Center vertically
                        alignItems: 'center', // Center horizontally
                      }}>
                      <MaterialCommunityIcons
                        name={'play-circle-outline'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                        style={{
                          height: heightPercentageToDP(3),
                          width: heightPercentageToDP(3),
                          textAlign: 'center', // Ensure text is centered within its container
                        }}
                      />
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>

                {/* <LinearGradient
                  colors={[COLORS.darkyellow, COLORS.orange]}
                  start={{x: 0, y: 0}} // start from left
                  end={{x: 1, y: 0}} // end at right
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: heightPercentageToDP(2),
                    paddingHorizontal: heightPercentageToDP(1),
                  }}>
                  <GradientText
                    onPress={() => navigation.navigate('PlayHistory')}
                    style={{
                      fontSize: heightPercentageToDP(2),
                      fontFamily: FONT.Montserrat_Bold,
                      color: COLORS.black,
                    }}>
                    Play history
                  </GradientText>
                </LinearGradient> */}
              </View>

              {/** PARTNER AND LIVE RESULT */}

              <View
                style={{
                  height: heightPercentageToDP(5),
                  position: 'relative',
                  marginVertical: heightPercentageToDP(2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginStart: heightPercentageToDP(3),
                  marginEnd: heightPercentageToDP(2),
                }}>
                {partner && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PartnerDashboard')}>
                    <LinearGradient
                      colors={[COLORS.white, COLORS.white]}
                      start={{x: 0, y: 0}} // start from left
                      end={{x: 1, y: 0}} // end at right
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: heightPercentageToDP(2),
                        paddingHorizontal: heightPercentageToDP(2),
                        width: widthPercentageToDP(42),
                      }}>
                      <LinearGradient
                        colors={[COLORS.grayBg, COLORS.white_s]}
                        className="rounded-xl p-2"
                        style={{
                          position: 'absolute',
                          left: 0,
                          padding: heightPercentageToDP(1), // Keep the padding as is
                          borderRadius: heightPercentageToDP(2),
                          justifyContent: 'center', // Center vertically
                          alignItems: 'center', // Center horizontally
                        }}>
                        <MaterialCommunityIcons
                          name={'account-group-outline'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </LinearGradient>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: heightPercentageToDP(5),
                        }}>
                        <GradientText
                          style={{
                            fontSize: heightPercentageToDP(2),
                            fontFamily: FONT.Montserrat_Bold,
                            color: COLORS.black,
                          }}>
                          {`\u00A0 Partner`}
                        </GradientText>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('LiveResult')}>
                  <LinearGradient
                    colors={[COLORS.white, COLORS.white]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      borderRadius: heightPercentageToDP(2),
                      paddingHorizontal: heightPercentageToDP(2),
                      width: partner
                        ? widthPercentageToDP(42)
                        : widthPercentageToDP(90),
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: heightPercentageToDP(5),
                      }}>
                      <GradientText
                        style={{
                          fontSize: heightPercentageToDP(2),
                          fontFamily: FONT.Montserrat_Bold,
                          color: COLORS.black,
                        }}>
                        Live Result
                      </GradientText>
                    </View>

                    <LinearGradient
                      colors={[COLORS.grayBg, COLORS.white_s]}
                      style={{
                        position: 'absolute',
                        right: 0,
                        padding: heightPercentageToDP(1), // Keep the padding as is
                        borderRadius: heightPercentageToDP(2),
                        justifyContent: 'center', // Center vertically
                        alignItems: 'center', // Center horizontally
                      }}>
                      <MaterialCommunityIcons
                        name={'trophy'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>

                {/* <LinearGradient
                  colors={[COLORS.darkyellow, COLORS.orange]}
                  start={{x: 0, y: 0}} // start from left
                  end={{x: 1, y: 0}} // end at right
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: heightPercentageToDP(2),
                    paddingHorizontal: heightPercentageToDP(1),
                  }}>
                  <GradientText
                    onPress={() => navigation.navigate('PlayHistory')}
                    style={{
                      fontSize: heightPercentageToDP(2),
                      fontFamily: FONT.Montserrat_Bold,
                      color: COLORS.black,
                    }}>
                    Play history
                  </GradientText>
                </LinearGradient> */}
              </View>
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
                <View
                  style={{
                    margin: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(2),
                    overflow: 'hidden',
                  }}>
                  <ImageSlider
                    data={sliderData}
                    preview={false}
                    autoPlay={true}
                    delay={8000}
                    closeIconColor="#fff"
                    caroselImageStyle={{resizeMode: 'cover'}}
                    indicatorMainContainerStyle={{
                      justifyContent: 'center',
                      borderRadius: heightPercentageToDP(2),
                    }}
                    caroselImageContainerStyle={{
                      height: heightPercentageToDP(20),
                      borderRadius: heightPercentageToDP(2),
                    }}
                    indicatorContainerStyle={{
                      position: 'absolute',
                      bottom: heightPercentageToDP(-2),
                    }}
                    activeIndicatorStyle={{
                      backgroundColor: COLORS.blue,
                    }}
                    inActiveIndicatorStyle={{
                      backgroundColor: COLORS.profileDarkGray,
                    }}
                  />
                </View>
              )}

              {/** WALLET CONTAINER */}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: heightPercentageToDP(2),
                  marginBottom: heightPercentageToDP(2),
                }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
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
                </ScrollView>
              </View>
            </ScrollView>
          ) : (
            <SafeAreaView
              style={{
                height: heightPercentageToDP(100),
                backgroundColor: COLORS.white,
              }}>
              {error && !retrying && (
                <View style={styles.retryContainer}>
                  <Text
                    style={{
                      ...styles.retryText,
                      fontFamily: FONT.Montserrat_Bold,
                    }}>
                    Session expired,
                  </Text>
                  <Text style={styles.retryText}>
                    To play continue, please login again
                  </Text>

                  <TouchableOpacity
                    onPress={logoutHandler}
                    style={{
                      height: heightPercentageToDP(7),
                      flexDirection: 'row',
                      backgroundColor: COLORS.grayBg,
                      alignItems: 'center',
                      paddingHorizontal: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      marginTop: heightPercentageToDP(2),
                      marginHorizontal: heightPercentageToDP(4),
                    }}>
                    <LinearGradient
                      colors={[COLORS.lightWhite, COLORS.white_s]}
                      className="rounded-xl p-1">
                      <AntDesign
                        name={'logout'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                      />
                    </LinearGradient>

                    <Text
                      style={{
                        marginStart: heightPercentageToDP(1),
                        flex: 1,
                        fontFamily: FONT.Montserrat_Regular,
                        color: COLORS.black,
                        fontSize: heightPercentageToDP(2),
                      }}>
                      Logout
                    </Text>

                    <Ionicons
                      name={'chevron-forward-outline'}
                      size={heightPercentageToDP(3)}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>

                  {/** Logout container */}
                </View>
              )}
            </SafeAreaView>
          )}
        </ImageBackground>
      </View>
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
  retryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    fontFamily: FONT.Montserrat_Regular,
    fontSize: heightPercentageToDP(2.5),
    marginBottom: heightPercentageToDP(2),
    color: COLORS.black,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(10),
    borderRadius: heightPercentageToDP(2),
  },
  retryButtonText: {
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(2.5),
    color: COLORS.white,
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
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: center; }
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
table.inventory td:nth-child(3) { text-align: center; width: 12%; }
table.inventory td:nth-child(4) { text-align: center; width: 12%; }
table.inventory td:nth-child(5) { text-align: center; width: 12%; }

/* table balance */

table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }

/* aside */

aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`;

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
// import moment from 'moment';
// const {height, width} = Dimensions.get('window');
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import FileViewer from 'react-native-file-viewer';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import {serverName} from '../redux/store';
// import LinearGradient from 'react-native-linear-gradient';
// import {ImageSlider} from '@pembajak/react-native-image-slider-banner';
// import { onDisplayNotification } from '../helper/NotificationServices';

// const images = [
//   'https://imgs.search.brave.com/PvhNVIxs9m8r1whelc9RPX2dMQ371Xcsk3Lf2dCiVHQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmlnLXNhbGUt/YmFubmVyLWRlc2ln/bi1zcGVjaWFsLW9m/ZmVyLXVwLTUwLW9m/Zi1yZWFkeS1wcm9t/b3Rpb24tdGVtcGxh/dGUtdXNlLXdlYi1w/cmludC1kZXNpZ25f/MTEwNDY0LTU3MC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw',
//   'https://imgs.search.brave.com/0_WERhkh6NjaGafm4qPeYRM1WbUdabgTpK7LCJ8EKFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaG90LXNhbGUt/aG9yaXpvbnRhbC1i/YW5uZXItd2l0aC1z/ZWFzb25hbC1vZmZl/cl80MTkzNDEtNjA1/LmpwZz9zaXplPTYy/NiZleHQ9anBn',
//   'https://imgs.search.brave.com/pBRUab3Kras4ziV_cQdR0AtRiSrOuJKwhMTmHY988d8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BlY2lhbC1v/ZmZlci1maW5hbC1z/YWxlLXRhZy1iYW5u/ZXItZGVzaWduLXRl/bXBsYXRlLW1hcmtl/dGluZy1zcGVjaWFs/LW9mZmVyLXByb21v/dGlvbl82ODA1OTgt/MTk1LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
// ];

// const Home = () => {
//   const {user, accesstoken, loading} = useSelector(state => state.user);

//   const [showDate, setShowDate] = useState(true);

//   const [nextResultTime, setNextResultTime] = useState(10);
//   const [timeDifference, setTimeDifference] = useState(3);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(loadAllPromotion(accesstoken));
//   }, [dispatch, focused]);

//   useEffect(() => {
//     dispatch(loadProfile(accesstoken));
//   }, [dispatch]);

//   const [currentScreen, setCurrentScreen] = useState('');
//   const [firstTimeClick, setFirstTimeClick] = useState(true);

//   useEffect(() => {
//     const backAction = () => {
//       if (currentScreen === 'Home') {
//         if (!showDate) {
//           setShowDate(true);
//           console.log('Backbutton pressed ');
//         } else {
//           Alert.alert('Hold on!', 'Are you sure you want to exit?', [
//             {
//               text: 'Cancel',
//               onPress: () => null,
//               style: 'cancel',
//             },
//             {text: 'YES', onPress: () => BackHandler.exitApp()},
//           ]);
//         }

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
//   }, [currentScreen, navigation, showDate]);

//   useFocusEffect(
//     React.useCallback(() => {
//       setCurrentScreen('Home'); // Set the current screen to 'HomeScreen' when this screen is focused
//       return () => setCurrentScreen(''); // Reset the current screen when the screen is blurred
//     }, []),
//   );

//   // console.log("Show date :: "+showDate)
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
//     if (firstTimeClick) {
//       setHomeResult(firstThreeElements[0]);
//     }

//     setFilteredData(firstThreeElements); // Update filteredData whenever locations change
//     // settingHomeResultUsingLocation(results[0])
//   }, [
//     results,
//     homeResult,
//     loadingForResultAccordingLocation,
//     nextResult,
//     loaderForNextResult,
//     filteredData,
//     nextResultTime,
//     timeDifference,
//   ]);

//   const toogleView = () => {
//     setShowDate(false);
//   };

//   const settingHomeResultUsingLocation = item => {
//     setHomeResult(item);
//     setFirstTimeClick(false);
//     console.log('Mine time');
//     console.log(extractTime(item.nextresulttime));

//     const {hour, minute, period} = extractTime(item.nextresulttime);
//     console.log(hour);
//     console.log(minute);
//     console.log(period);
//     // setNextResultTime(hour);
//     const hour_time = hour + ' ' + period;
//     console.log('Hour_time :: ' + hour_time);
//     settingTimerForNextResult(hour, minute, period);

//     dispatch(
//       getAllResultAccordingToLocation(accesstoken, item.lotlocation._id),
//     );
//     // dispatch(getNextResult(accesstoken, item.lotlocation._id));
//   };

//   // For Promotion Image Slider
//   const [currentPage, setCurrentPage] = useState(0);
//   const scrollViewRef = useRef();

//   // Commenting this for Testing next result
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // const nextPage = (currentPage + 1) % images.length;
//       const nextPage = (currentPage + 1) % promotions.length;
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

//   // console.log('Promotion :: ' + promotions.length);
//   // console.log('Next result  :: ' + nextResult.length);

//   // For Countdown Timer

//   // Function to determine if the given time has passed
//   function hasTimePassed(timeString) {
//     if (timeString) {
//       // Parse the given time string using moment.js
//       const timeFormat = timeString.includes('-') ? 'hh-mm A' : 'hh:mm A';
//       const givenTime = moment(timeString, timeFormat);

//       // Get the current device time
//       const currentTime = moment();

//       // Compare the given time with the current time
//       return givenTime.isBefore(currentTime);
//     }
//   }

//   function extractTime(timeString) {
//     // Remove whitespace from the time string and split it into time and period (AM/PM)
//     const [timePart, period] = timeString.trim().split(/\s+/);

//     // Determine the separator used in the time part (either "-" or ":")
//     const separator = timePart.includes('-') ? '-' : ':';

//     // Split the time part using the determined separator
//     const [hour, minute] = timePart.split(separator);

//     return {
//       hour,
//       minute,
//       period,
//     };
//   }

//   //

//   //   // Example usage:
//   // const timeString1 = "09-00 AM";
//   // const timeString2 = "09:00 AM";

//   //  console.log(extractTime(timeString1)); // { hour: "09", minute: "00", period: "AM" }
//   // console.log(extractTime(timeString2)); // { hour: "09", minute: "00", period: "AM" }

//   useEffect(() => {
//     // Update current time every second
//     const interval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     // Clear interval on component unmount
//     return () => clearInterval(interval);
//   }, [homeResult, currentTime, timeDifference]);

//   // Current time
//   // const [currentTime, setCurrentTime] = useState(new Date());
//   // // Lot time (time you want to count down to)
//   // const lotTime = new Date();
//   // lotTime.setHours(nextResultTime); // Set lot time hours (example: 8 AM)
//   // lotTime.setMinutes(0); // Set lot time minutes (example: 00)
//   // lotTime.setSeconds(0); // Set lot time seconds (example: 00)

//   // useEffect(() => {
//   //   // Update current time every second
//   //   const interval = setInterval(() => {
//   //     setCurrentTime(new Date());
//   //   }, 1000);

//   //   // Clear interval on component unmount
//   //   return () => clearInterval(interval);
//   // }, []);

//   // // Calculate time difference between current time and lot time
//   // const timeDifference = lotTime.getTime() - currentTime.getTime();

//   // const settingTimerForNextResult = (hour, minute,period) => {
//   //   const lotTime = new Date();

//   //   lotTime.setHours(hour); // Set lot time hours (example: 8 AM)
//   //   lotTime.setMinutes(minute); // Set lot time minutes (example: 00)
//   //   lotTime.setSeconds(0); // Set lot time seconds (example: 00)

//   //   console.log("Setting timer")
//   //   console.log("lottime :: "+lotTime.getTime())
//   //   console.log("currenttime :: "+currentTime.getTime())
//   //   console.log("Both Difference :: ",lotTime.getTime() - currentTime.getTime())

//   //   // Calculate time difference between current time and lot time
//   //   setTimeDifference(lotTime.getTime() - currentTime.getTime());
//   // };

//   const settingTimerForNextResult = async (hour, minute, period) => {
//     let hour24 = parseInt(hour);

//     if (period.toLowerCase() === 'pm' && hour24 < 12) {
//       hour24 += 12;
//     } else if (period.toLowerCase() === 'am' && hour24 === 12) {
//       hour24 = 0;
//     }

//     const lotTime = new Date();
//     lotTime.setHours(hour24);
//     lotTime.setMinutes(parseInt(minute));
//     lotTime.setSeconds(0);

//     setTimeDifference(lotTime.getTime() - currentTime.getTime());

//     // const lotTime = new Date();

//     // lotTime.setHours(hour); // Set lot time hours (example: 8 AM)
//     // lotTime.setMinutes(minute); // Set lot time minutes (example: 00)
//     // lotTime.setSeconds(0); // Set lot time seconds (example: 00)

//     console.log('Setting timer');
//     console.log('lottime :: ' + lotTime.getTime());
//     console.log('currenttime :: ' + currentTime.getTime());
//     console.log(
//       'Both Difference :: ',
//       lotTime.getTime() - currentTime.getTime(),
//     );

//     // Calculate time difference between current time and lot time
//     setTimeDifference(lotTime.getTime() - currentTime.getTime());

//     // Ensure that data is loaded before setting the timer
//     await dispatch(getAllResult(accesstoken));
//     await dispatch(
//       getAllResultAccordingToLocation(
//         accesstoken,
//         homeResult?.lotlocation?._id,
//       ),
//     );
//     await dispatch(getNextResult(accesstoken, homeResult?.lotlocation?._id));
//   };

//   // FOR DOWNLOAD PDF

//   const htmlContent = `
//         <html>
//           <head>
//             <meta charset="utf-8">
//             <title>Result</title>
//             <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
//             <style>
//               ${htmlStyles}
//             </style>
//           </head>
//           <body>
//             <header>
//               <h1>RESULT</h1>
//             </header>
//             <article>

//               <table class="inventory">
//                 <thead>
//                   <tr>
//                     <th><span>Location</span></th>
//                     <th><span>Date</span></th>
//                     <th><span>Time</span></th>
//                     <th><span>Result</span></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                 ${resultAccordingLocation
//                   ?.map(
//                     item => `
//                 <tr>
//                   <td><span>${item.lotlocation?.lotlocation}</span></td>
//                   <td><span>${item.lotdate?.lotdate}</span></td>
//                   <td><span>${item.lottime?.lottime}</span></td>
//                   <td><span>${item.resultNumber}</span></td>
//                 </tr>
//               `,
//                   )
//                   .join('')}
//                 </tbody>
//               </table>

//             </article>
//             <aside>
//               <h1><span>Since  2001</span></h1>
//               <div>
//                 <p>Thank you for download</p>
//               </div>
//             </aside>
//           </body>
//         </html>
//       `;

//   const checkAndRequestPermission = async () => {
//     const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

//     if (result === RESULTS.DENIED) {
//       if (Platform.OS === 'android' && Platform.Version <= 29) {
//         // Target Android 10 and above
//         const permissionResult = await request(
//           PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
//         );
//         if (permissionResult !== RESULTS.GRANTED) {
//           console.log('Permission not granted!');
//           Toast.show({
//             type: 'info',
//             text1: 'Permission not granted!',
//           });
//           return;
//         }
//       }
//     }

//     // Call your DocumentPicker.pick() function here

//     console.log('Permission status');
//     createPDF();
//   };

//   const createPDF = async () => {

//     if(!homeResult)
//     {
//       Toast.show({
//         type: 'info',
//         text1: "No data available"
//       })
//     }else{
//       let options = {
//         //Content to print
//         html: htmlContent,
//         //File Name
//         fileName: `${homeResult.lotdate.lotdate}${homeResult.lottime.lottime}`,
//         //File directory
//         directory: 'Download',

//         base64: true,
//       };

//       let file = await RNHTMLtoPDF.convert(options);
//       // console.log(file.filePath);
//       Alert.alert(
//         'Successfully Exported',
//         'Path:' + file.filePath,
//         [
//           {text: 'Cancel', style: 'cancel'},
//           {text: 'Open', onPress: () => openFile(file.filePath)},
//         ],
//         {cancelable: true},
//       );
//     }

//   };

//   const openFile = filepath => {
//     const path = filepath; // absolute-path-to-my-local-file.
//     FileViewer.open(path)
//       .then(() => {
//         // success
//         console.log('All Good no error found');
//       })
//       .catch(error => {
//         // error
//         console.log('Found error :: ' + error);
//       });
//   };

//   const sliderData = promotions.map((promotion, index) => ({
//     img: `${serverName}/uploads/promotion/${promotion.url}`,
//   }));

//   const shownotifee = () => {
//     onDisplayNotification('Jammu Result',"11:00 AM Jammu Result Announced");
//   }

//   return (
//     <SafeAreaView
//       className="flex-1"
//       style={{
//         backgroundColor: COLORS.white,
//         paddingVertical: heightPercentageToDP(2),
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
//                 paddingHorizontal: heightPercentageToDP(2),
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
//                   onPress={() => navigation.navigate('UpdateProfile')}
//                   style={{
//                     borderRadius: 100,
//                     overflow: 'hidden',
//                     width: 70,
//                     height: 70,
//                   }}>
//                   {user?.avatar?.url ? (
//                     <Image
//                       source={{
//                         uri: `${serverName}/uploads/${user?.avatar.url}`,
//                       }}
//                       resizeMode="cover"
//                       style={{
//                         height: 70,
//                         width: 70,
//                       }}
//                     />
//                   ) : (
//                     <Image
//                       source={require('../../assets/image/dark_user.png')}
//                       resizeMode="cover"
//                       style={{
//                         height: 70,
//                         width: 70,
//                       }}
//                     />
//                   )}
//                 </TouchableOpacity>

//                 {/** Profile name Container */}
//                 <View>
//                   <GradientText
//                     style={{
//                       fontSize: heightPercentageToDP(2),
//                       fontFamily: FONT.Montserrat_Bold,
//                       color: COLORS.darkGray,
//                     }}>
//                     User ID - {user ? user.userId : ''}
//                   </GradientText>

//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       color: COLORS.black,
//                     }}>
//                     Hello
//                     <Text
//                       style={{
//                         fontFamily: FONT.HELVETICA_BOLD,
//                         color: COLORS.black,
//                         fontSize: heightPercentageToDP(2),
//                       }}>
//                       , {user.name}
//                     </Text>
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
//                 marginHorizontal: heightPercentageToDP(2)
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

//             {/** BIG RESULT  homeResult && homeResult.length === 0 */}

//             {homeResult && homeResult.length === 0 ? (
//               <NoDataFound data={'No Result Available'} />
//             ) : showDate ? (
//               <View
//                 style={{
//                   height: heightPercentageToDP(40),
//                   backgroundColor: COLORS.grayHalfBg,
//                   marginTop: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(2),
//                   elevation: heightPercentageToDP(1),
//                   marginHorizontal: heightPercentageToDP(2),
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
//                     <View
//                       style={{
//                         alignSelf: 'flex-start',
//                         paddingStart: heightPercentageToDP(2),

//                         width: '100%',
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: FONT.Montserrat_SemiBold,
//                           fontSize: heightPercentageToDP(4),

//                           color: COLORS.black,
//                         }}
//                         numberOfLines={1}>
//                         {homeResult?.lotlocation?.lotlocation}
//                       </Text>
//                     </View>

//                     <View
//                       style={{
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: FONT.SF_PRO_REGULAR,
//                           fontSize: heightPercentageToDP(14),
//                           color: COLORS.black,
//                           paddingStart: heightPercentageToDP(3),
//                         }}
//                         numberOfLines={1}>
//                         {homeResult?.resultNumber}
//                       </Text>
//                     </View>
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
//                         flex: 1.5,
//                         justifyContent: 'center',

//                         alignItems: 'center',
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
//                             {hasTimePassed(homeResult?.nextresulttime)
//                               ? ''
//                               : 'Next'}
//                           </Text>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               fontFamily: FONT.Montserrat_Regular,
//                               color: COLORS.black,
//                             }}>
//                             {hasTimePassed(homeResult?.nextresulttime)
//                               ? ''
//                               : 'Result'}
//                           </Text>
//                           <Text
//                             style={{
//                               textAlign: 'center',
//                               color: COLORS.black,
//                               fontFamily: FONT.HELVETICA_BOLD,
//                             }}>
//                             {hasTimePassed(homeResult?.nextresulttime)
//                               ? ''
//                               : homeResult?.nextresulttime}
//                           </Text>
//                         </View>
//                       </View>

//                       {hasTimePassed(homeResult?.nextresulttime) ? null : (
//                         <View
//                           style={{
//                             flex: 1,
//                             justifyContent: 'flex-end',
//                             alignItems: 'center',
//                             borderRadius: heightPercentageToDP(2),
//                           }}>
//                           <Countdown
//                             until={timeDifference / 1000}
//                             onFinish={() => console.log('Timer Completed...')}
//                             size={12}
//                             timeToShow={['H', 'M', 'S']}
//                             digitStyle={{
//                               backgroundColor: 'transparent', // Set background to transparent
//                               borderWidth: 0, // Remove border
//                               paddingHorizontal: 0, // Remove horizontal padding
//                               paddingVertical: 0, // Remove vertical padding
//                               margin: 0, // Remove margin
//                             }}
//                             digitTxtStyle={{color: COLORS.black}}
//                             timeLabelStyle={{
//                               color: COLORS.grayHalfBg,
//                               fontWeight: 'bold',
//                             }}
//                             separatorStyle={{
//                               color: COLORS.black,
//                               marginTop: heightPercentageToDP(-2),
//                               marginHorizontal: heightPercentageToDP(-8),

//                               paddingHorizontal: 0, // Remove horizontal padding
//                             }}
//                             timeLabels={{
//                               h: 'Hours',
//                               m: 'Minutes',
//                               s: 'Seconds',
//                             }}
//                             showSeparator
//                             style={{
//                               flexDirection: 'row',
//                               alignItems: 'center', // Align items to center
//                               transform: [{rotate: '90deg'}],
//                               color: COLORS.black,
//                               fontFamily: FONT.Montserrat_SemiBold,
//                               fontSize: heightPercentageToDP(3),
//                               marginStart: heightPercentageToDP(-2),
//                               marginBottom: heightPercentageToDP(9),
//                             }}
//                           />

//                           {/* <Countdown
//                             until={timeDifference / 1000} // Pass time difference in seconds
//                             onFinish={() => console.log('Timer Completed...')} // Callback when countdown finishes
//                             size={12}
//                             timeToShow={['H', 'M', 'S']}
//                             digitStyle={{
//                               backgroundColor: COLORS.grayHalfBg,
//                               borderWidth: 1,
//                               borderColor: COLORS.grayHalfBg,
//                             }}
//                             digitTxtStyle={{color: COLORS.black}}
//                             timeLabelStyle={{
//                               color: COLORS.grayHalfBg,
//                               fontWeight: 'bold',
//                             }}
//                             separatorStyle={{
//                               color: COLORS.black,
//                               marginTop: heightPercentageToDP(-2),
//                             }}
//                             timeLabels={{
//                               h: 'Hours',
//                               m: 'Minutes',
//                               s: 'Seconds',
//                             }}
//                             showSeparator
//                             style={{
//                               flexDirection: 'row',
//                               transform: [{rotate: '90deg'}],
//                               color: COLORS.black,
//                               fontFamily: FONT.Montserrat_SemiBold,
//                               fontSize: heightPercentageToDP(3),

//                               marginStart: heightPercentageToDP(-4),
//                               marginBottom: heightPercentageToDP(8),
//                             }}
//                           /> */}
//                         </View>
//                       )}
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
//                       marginStart: heightPercentageToDP(2),
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
//                       color: COLORS.black,
//                     }}>
//                     {homeResult?.lotdate?.lotdate}
//                   </Text>

//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       fontSize: heightPercentageToDP(2),
//                       color: COLORS.black,
//                     }}>
//                     {homeResult?.lottime?.lottime}
//                   </Text>

//                   <Text
//                     style={{
//                       fontFamily: FONT.Montserrat_Regular,
//                       fontSize: heightPercentageToDP(2),
//                       color: COLORS.black,
//                     }}>
//                     {homeResult?.resultNumber}
//                   </Text>

//                   <View
//                     style={{
//                       flex: 1,
//                       paddingEnd: heightPercentageToDP(3.5),
//                     }}>
//                     <View
//                       style={{
//                         backgroundColor: COLORS.grayHalfBg,
//                         padding: heightPercentageToDP(0.5),
//                         borderRadius: heightPercentageToDP(1),
//                         alignSelf: 'flex-end',
//                       }}>
//                       <Ionicons
//                         name={'caret-down-circle-sharp'}
//                         size={heightPercentageToDP(3)}
//                         color={COLORS.darkGray}
//                       />
//                     </View>
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
//                   marginHorizontal: heightPercentageToDP(2),
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
//                           color: COLORS.black,
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
//                       <LinearGradient
//                         colors={[COLORS.white_s, COLORS.grayHalfBg]}
//                         style={{
//                           backgroundColor: COLORS.white,
//                           height: heightPercentageToDP(27),
//                           borderRadius: heightPercentageToDP(1),
//                           paddingHorizontal: heightPercentageToDP(1),
//                           paddingVertical: heightPercentageToDP(2),
//                           marginHorizontal: heightPercentageToDP(3),
//                           marginTop: heightPercentageToDP(2),
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
//                                 justifyContent: 'space-between',
//                                 alignItems: 'stretch',
//                                 gap: heightPercentageToDP(2.5),
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_SemiBold,
//                                   fontSize: heightPercentageToDP(2),
//                                   textAlign: 'left',
//                                   color: COLORS.black,
//                                 }}>
//                                 {item.lotdate.lotdate}
//                               </Text>

//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_SemiBold,
//                                   fontSize: heightPercentageToDP(2),
//                                   color: COLORS.black,
//                                 }}>
//                                 {item.lottime.lottime}
//                               </Text>

//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_SemiBold,
//                                   fontSize: heightPercentageToDP(2),
//                                   textAlign: 'right',
//                                   color: COLORS.black,
//                                 }}>
//                                 {item.resultNumber}
//                               </Text>
//                             </TouchableOpacity>
//                           ))
//                         )}
//                       </LinearGradient>
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
//                       {hasTimePassed(homeResult?.nextresulttime) ? null : (
//                         <View
//                           style={{position: 'absolute', top: 10, zIndex: 1}}>
//                           <View
//                             style={{
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                             }}>
//                             <Text
//                               style={{
//                                 textAlign: 'center',
//                                 fontFamily: FONT.Montserrat_Regular,
//                                 color: COLORS.black,
//                               }}>
//                               Next
//                             </Text>
//                             <Text
//                               style={{
//                                 textAlign: 'center',
//                                 fontFamily: FONT.Montserrat_Regular,
//                                 color: COLORS.black,
//                               }}>
//                               Result
//                             </Text>
//                             <Text
//                               style={{
//                                 textAlign: 'center',
//                                 color: COLORS.black,
//                                 fontFamily: FONT.HELVETICA_BOLD,
//                               }}>
//                               {homeResult?.nextresulttime}
//                             </Text>
//                           </View>
//                         </View>
//                       )}

//                       {hasTimePassed(homeResult?.nextresulttime) ? null : (
//                         <View
//                           style={{
//                             flex: 1,
//                             justifyContent: 'flex-end',
//                             borderRadius: heightPercentageToDP(2),
//                           }}>
//                           <Countdown
//                             until={timeDifference / 1000}
//                             onFinish={() => console.log('Timer Completed...')}
//                             size={12}
//                             timeToShow={['H', 'M', 'S']}
//                             digitStyle={{
//                               backgroundColor: 'transparent', // Set background to transparent
//                               borderWidth: 0, // Remove border
//                               paddingHorizontal: 0, // Remove horizontal padding
//                               paddingVertical: 0, // Remove vertical padding
//                               margin: 0, // Remove margin
//                             }}
//                             digitTxtStyle={{color: COLORS.black}}
//                             timeLabelStyle={{
//                               color: COLORS.grayHalfBg,
//                               fontWeight: 'bold',
//                             }}
//                             separatorStyle={{
//                               color: COLORS.black,
//                               marginTop: heightPercentageToDP(-2),
//                               marginHorizontal: heightPercentageToDP(-8),

//                               paddingHorizontal: 0, // Remove horizontal padding
//                             }}
//                             timeLabels={{
//                               h: 'Hours',
//                               m: 'Minutes',
//                               s: 'Seconds',
//                             }}
//                             showSeparator
//                             style={{
//                               flexDirection: 'row',
//                               alignItems: 'center', // Align items to center
//                               transform: [{rotate: '90deg'}],
//                               color: COLORS.black,
//                               fontFamily: FONT.Montserrat_SemiBold,
//                               fontSize: heightPercentageToDP(3),
//                               marginStart: heightPercentageToDP(-4),
//                               marginBottom: heightPercentageToDP(15),
//                             }}
//                           />

//                           {/* <Countdown
//                           until={timeDifference / 1000} // Pass time difference in seconds
//                           onFinish={() => console.log('Timer Completed...')} // Callback when countdown finishes
//                           size={14}
//                           timeToShow={['H', 'M', 'S']}
//                           digitStyle={{
//                             backgroundColor: COLORS.grayHalfBg,
//                             borderWidth: 1,
//                             borderColor: COLORS.grayHalfBg,
//                           }}
//                           digitTxtStyle={{color: COLORS.black}}
//                           timeLabelStyle={{
//                             color: COLORS.grayHalfBg,
//                             fontWeight: 'bold',
//                           }}
//                           separatorStyle={{
//                             color: COLORS.black,
//                             marginTop: heightPercentageToDP(-2),
//                           }}
//                           timeLabels={{
//                             h: 'Hours',
//                             m: 'Minutes',
//                             s: 'Seconds',
//                           }}
//                           showSeparator
//                           style={{
//                             flexDirection: 'row',
//                             transform: [{rotate: '90deg'}],
//                             color: COLORS.black,
//                             fontFamily: FONT.Montserrat_SemiBold,
//                             fontSize: heightPercentageToDP(4),

//                             marginStart: heightPercentageToDP(-4),
//                             marginBottom: heightPercentageToDP(10),
//                           }}
//                         /> */}
//                         </View>
//                       )}
//                     </View>
//                   )}
//                 </View>

//                 {/** Big Result bottom container */}

//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                   }}>
//                   {/* <TouchableOpacity
//                     onPress={() => setShowDate(true)}
//                     className="rounded-md p-2"
//                     style={{
//                       backgroundColor: COLORS.white_s,
//                       marginBottom: heightPercentageToDP(2),
//                       marginHorizontal: heightPercentageToDP(2),

//                     }}>
//                     <Ionicons
//                       name={'chevron-back'}
//                       size={heightPercentageToDP(3)}
//                       color={COLORS.black}
//                     />
//                   </TouchableOpacity> */}

//                   <TouchableOpacity
//                     onPress={checkAndRequestPermission}
//                     style={{
//                       backgroundColor: COLORS.blue,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       flexDirection: 'row',
//                       gap: heightPercentageToDP(1),
//                       zIndex: 2,
//                       borderRadius: heightPercentageToDP(1),
//                       height: heightPercentageToDP(5),
//                       marginBottom: heightPercentageToDP(2),
//                       marginHorizontal: heightPercentageToDP(2),
//                       flex: 1,
//                     }}>
//                     <Text
//                       style={{
//                         fontFamily: FONT.Montserrat_Regular,
//                         fontSize: heightPercentageToDP(2),
//                         color: COLORS.white_s,
//                       }}>
//                       Download
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 {/* <TouchableOpacity
//                     onPress={checkAndRequestPermission}
//                     style={{
//                       backgroundColor: COLORS.blue,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       flexDirection: 'row',
//                       gap: heightPercentageToDP(1),
//                       zIndex: 2,
//                       borderRadius: heightPercentageToDP(1),
//                       height: heightPercentageToDP(5),
//                       marginBottom: heightPercentageToDP(2),
//                       marginHorizontal: heightPercentageToDP(2),
//                     }}>
//                     <Text
//                       style={{
//                         fontFamily: FONT.Montserrat_Regular,
//                         fontSize: heightPercentageToDP(2),
//                         color: COLORS.white_s,
//                       }}>
//                       Download
//                     </Text>
//                   </TouchableOpacity> */}
//               </View>
//             )}

//             {/** BOTTOM RESULT CONTAINER */}

//             <View
//               style={{
//                 height: heightPercentageToDP(5),
//                 marginVertical: heightPercentageToDP(2),
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginHorizontal: heightPercentageToDP(2),
//               }}>
//               <GradientText
//                 style={{
//                   fontSize: heightPercentageToDP(4),
//                   fontFamily: FONT.Montserrat_Bold,
//                   color: COLORS.black,
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
//                   color: COLORS.black,
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
//                   marginBottom: heightPercentageToDP(2),
//                   marginHorizontal: heightPercentageToDP(2),
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
//                             color: COLORS.black,
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
//                             color: COLORS.black,
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
//                             color: COLORS.black,
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
//               <View
//               style={{
//                 margin: heightPercentageToDP(2),
//                 borderRadius: heightPercentageToDP(2),
//                 overflow: 'hidden',

//               }}
//                 >
//                 <ImageSlider
//                   data={sliderData}
//                   preview={false}
//                   autoPlay={true}
//                   closeIconColor="#fff"
//                   caroselImageStyle={{resizeMode: 'cover'}}
//                   indicatorMainContainerStyle={{
//                     justifyContent: 'center',
//                     borderRadius: heightPercentageToDP(2),
//                   }}
//                   caroselImageContainerStyle={{
//                     height: heightPercentageToDP(20),
//                     borderRadius: heightPercentageToDP(2),
//                   }}
//                   indicatorContainerStyle={{
//                     position: 'absolute',
//                     bottom: heightPercentageToDP(-2),
//                   }}
//                   activeIndicatorStyle={{
//                     backgroundColor: COLORS.blue,
//                   }}
//                   inActiveIndicatorStyle={{
//                     backgroundColor: COLORS.profileDarkGray,
//                   }}

//                 />
//               </View>
//             )}

//             {/** WALLET CONTAINER */}
//             <View style={{justifyContent: 'center', alignItems: 'center',marginHorizontal: heightPercentageToDP(2),}}>
//               <ScrollView
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}>
//                 {user.walletOne.visibility && (
//                   <TouchableOpacity
//                     onPress={() =>
//                       navigation.navigate('WalletBalance', {
//                         data: user.walletOne,
//                       })
//                     }>
//                     <Wallet wallet={user.walletOne} />
//                   </TouchableOpacity>
//                 )}

//                 {user.walletTwo.visibility && (
//                   <TouchableOpacity
//                     onPress={() =>
//                       navigation.navigate('WalletBalance', {
//                         data: user.walletTwo,
//                       })
//                     }>
//                     <Wallet wallet={user.walletTwo} />
//                   </TouchableOpacity>
//                 )}
//               </ScrollView>
//             </View>
//           </ScrollView>
//         )
//       )}
//     </SafeAreaView>
//   );
// };

// export default Home;

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

// const htmlStyles = `
// *{
//   border: 0;
//   box-sizing: content-box;
//   color: inherit;
//   font-family: inherit;
//   font-size: inherit;
//   font-style: inherit;
//   font-weight: inherit;
//   line-height: inherit;
//   list-style: none;
//   margin: 0;
//   padding: 0;
//   text-decoration: none;
//   vertical-align: top;
// }

// h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }

// /* table */

// table { font-size: 75%; table-layout: fixed; width: 100%; }
// table { border-collapse: separate; border-spacing: 2px; }
// th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: center; }
// th, td { border-radius: 0.25em; border-style: solid; }
// th { background: #EEE; border-color: #BBB; }
// td { border-color: #DDD; }

// /* page */

// html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
// html { background: #999; cursor: default; }

// body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
// body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

// /* header */

// header { margin: 0 0 3em; }
// header:after { clear: both; content: ""; display: table; }

// header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
// header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
// header address p { margin: 0 0 0.25em; }
// header span, header img { display: block; float: right; }
// header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
// header img { max-height: 100%; max-width: 100%; }

// /* article */

// article, article address, table.meta, table.inventory { margin: 0 0 3em; }
// article:after { clear: both; content: ""; display: table; }
// article h1 { clip: rect(0 0 0 0); position: absolute; }

// article address { float: left; font-size: 125%; font-weight: bold; }

// /* table meta & balance */

// table.meta, table.balance { float: right; width: 36%; }
// table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

// /* table meta */

// table.meta th { width: 40%; }
// table.meta td { width: 60%; }

// /* table items */

// table.inventory { clear: both; width: 100%; }
// table.inventory th { font-weight: bold; text-align: center; }

// table.inventory td:nth-child(1) { width: 26%; }
// table.inventory td:nth-child(2) { width: 38%; }
// table.inventory td:nth-child(3) { text-align: center; width: 12%; }
// table.inventory td:nth-child(4) { text-align: center; width: 12%; }
// table.inventory td:nth-child(5) { text-align: center; width: 12%; }

// /* table balance */

// table.balance th, table.balance td { width: 50%; }
// table.balance td { text-align: right; }

// /* aside */

// aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
// aside h1 { border-color: #999; border-bottom-style: solid; }
// `;
