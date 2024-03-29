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
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

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
import {loadProfile} from '../redux/actions/userAction';
import HomeLoading from '../components/background/HomeLoading';
import NoDataFound from '../components/helpercComponent/NoDataFound';
import {
  getAllResult,
  getAllResultAccordingToLocation,
} from '../redux/actions/resultAction';
import BigResult from '../components/home/BigResult';
import {HOVER} from 'nativewind/dist/utils/selector';
import Loading from '../components/helpercComponent/Loading';
import {getAllPromotion} from '../redux/actions/promotionAction';
const {height, width} = Dimensions.get('window');

const images = [
  'https://imgs.search.brave.com/PvhNVIxs9m8r1whelc9RPX2dMQ371Xcsk3Lf2dCiVHQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmlnLXNhbGUt/YmFubmVyLWRlc2ln/bi1zcGVjaWFsLW9m/ZmVyLXVwLTUwLW9m/Zi1yZWFkeS1wcm9t/b3Rpb24tdGVtcGxh/dGUtdXNlLXdlYi1w/cmludC1kZXNpZ25f/MTEwNDY0LTU3MC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw',
  'https://imgs.search.brave.com/0_WERhkh6NjaGafm4qPeYRM1WbUdabgTpK7LCJ8EKFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaG90LXNhbGUt/aG9yaXpvbnRhbC1i/YW5uZXItd2l0aC1z/ZWFzb25hbC1vZmZl/cl80MTkzNDEtNjA1/LmpwZz9zaXplPTYy/NiZleHQ9anBn',
  'https://imgs.search.brave.com/pBRUab3Kras4ziV_cQdR0AtRiSrOuJKwhMTmHY988d8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BlY2lhbC1v/ZmZlci1maW5hbC1z/YWxlLXRhZy1iYW5u/ZXItZGVzaWduLXRl/bXBsYXRlLW1hcmtl/dGluZy1zcGVjaWFs/LW9mZmVyLXByb21v/dGlvbl82ODA1OTgt/MTk1LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
];

const Home = () => {
  const {user, accesstoken, loading} = useSelector(state => state.user);

  // Currently working on the Withdraw through Upi Section of the Crypto Project

  const navigation = useNavigation();

  // const [data, setData] = useState([
  //   {id: '1', result: '7894', location: 'Pune', time: '01:00 PM'},
  //   {id: '2', result: '1839', location: 'Sikkim', time: '01:00 PM'},
  //   {id: '3', result: '7456', location: 'Bhopal', time: '01:00 PM'},
  // ]);

  // Getting User Profile

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [dispatch]);

  const [currentScreen, setCurrentScreen] = useState('');

  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'Home') {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);

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
  }, [currentScreen, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentScreen('Home'); // Set the current screen to 'HomeScreen' when this screen is focused
      return () => setCurrentScreen(''); // Reset the current screen when the screen is blurred
    }, []),
  );

  const {results, resultAccordingLocation, loadingForResultAccordingLocation} =
    useSelector(state => state.result);

  const {loadingPromotion, promotions} = useSelector(state => state.promotion);
  const [filteredData, setFilteredData] = useState([]);

  // For Big Result
  const [homeResult, setHomeResult] = useState(results[0]);

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(getAllResult(accesstoken));
    dispatch(
      getAllResultAccordingToLocation(
        accesstoken,
        homeResult?.lotlocation?._id,
      ),
    );
    
  }, [dispatch, focused]);

  useEffect(() => {
    dispatch(getAllPromotion(accesstoken));
  },[])

  useEffect(() => {
    const firstThreeElements = results;
    setFilteredData(firstThreeElements); // Update filteredData whenever locations change
  }, [results, homeResult, loadingForResultAccordingLocation]);

  // const settingHomeResultClick = () => {
  //   setHomeResult()
  // }

  console.log('filter data :: ' + filteredData.length);

  console.log('Welcome :: ' + JSON.stringify(user));
  console.log('Welcome Access token :: ' + accesstoken);

  const promotiondata = [1, 1, 1, 1, 1, 1, 1];
  const [data, SetData] = useState([1, 2, 3, 4, 5]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);

  // to Handel automatic scrolling of the Promotion container

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (currentIndex === data.length - 1) {
  //       setCurrentIndex(0);
  //     } else {
  //       if (currentIndex >= 0 && currentIndex < data.length) {
  //         setCurrentIndex(currentIndex + 1);
  //         ref.current?.scrollToIndex({
  //           animated: true,
  //           index: parseInt(currentIndex) + 1,
  //         });
  //       }
  //     }
  //   }, 2000);
  // }, [focused, currentIndex]);

  const [showDate, setShowDate] = useState(true);
  const toogleView = () => {
    setShowDate(false);
  };

  const dataa = [
    {date: '06-07-2018', time: '08-00 AM', result: '890'},
    {date: '06-07-2018', time: '09-00 PM', result: '899'},
    {date: '06-07-2018', time: '01-00 PM', result: '010'},
    {date: '06-07-2018', time: '03-00 PM', result: '900'},
    {date: '06-07-2018', time: '05-00 PM', result: '690'},
    {date: '06-07-2018', time: '07-00 PM', result: '090'},
    {date: '06-07-2018', time: '08-00 AM', result: '890'},
    {date: '06-07-2018', time: '09-00 PM', result: '899'},
    {date: '06-07-2018', time: '01-00 PM', result: '010'},
    {date: '06-07-2018', time: '03-00 PM', result: '900'},
    {date: '06-07-2018', time: '05-00 PM', result: '690'},
    {date: '06-07-2018', time: '07-00 PM', result: '090'},
    {date: '06-07-2018', time: '09-00 PM', result: '899'},
    {date: '06-07-2018', time: '01-00 PM', result: '010'},
    {date: '06-07-2018', time: '03-00 PM', result: '900'},
    {date: '06-07-2018', time: '05-00 PM', result: '690'},
    {date: '06-07-2018', time: '07-00 PM', result: '090'},
  ];

  const settingHomeResultUsingLocation = item => {
    setHomeResult(item);
    dispatch(
      getAllResultAccordingToLocation(accesstoken, item?.lotlocation?._id),
    );
  };

  // For Promotion Image Slider
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef();

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


  console.log("Promotion :: "+promotions.length)

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
                  onPress={() => navigation.navigate('Profile')}
                  style={{
                    borderRadius: 100,
                    overflow: 'hidden',
                    width: 70,
                    height: 70,
                  }}>
                  <Image
                    // source={{ uri: 'https://imgs.search.brave.com/bNjuaYsTPw2b4yerAkKyk82fwZ9sNFwkwb3JMnX7qBg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NDU5OTYxMjQtMDUw/MWViYWU4NGQwP3E9/ODAmdz0xMDAwJmF1/dG89Zm9ybWF0JmZp/dD1jcm9wJml4bGli/PXJiLTQuMC4zJml4/aWQ9TTN3eE1qQTNm/REI4TUh4elpXRnlZ/Mmg4TWpCOGZHWmhZ/MlY4Wlc1OE1IeDhN/SHg4ZkRBPQ.jpeg' }}
                    source={require('../../assets/image/dark_user.png')}
                    resizeMode="cover"
                    style={{
                      height: 70,
                      width: 70,
                    }}
                  />
                </TouchableOpacity>

                {/** Profile name Container */}
                <View>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      color: COLORS.black,
                    }}>
                    Hello
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT.HELVETICA_BOLD,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                    }}>
                    {user.name}
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
                color={COLORS.white}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                  fontSize: heightPercentageToDP(2),
                }}>
                Search for location
              </Text>
            </TouchableOpacity>

            {/** BIG RESULT  */}

            {results.length === 0 ? (
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
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_SemiBold,
                        fontSize: heightPercentageToDP(3),
                        marginTop: heightPercentageToDP(2),
                      }}
                      numberOfLines={1}>
                      {homeResult?.lotlocation?.lotlocation}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONT.SF_PRO_REGULAR,
                        fontSize: heightPercentageToDP(14),
                        color: COLORS.black,
                        marginTop: heightPercentageToDP(-2),
                      }}
                      numberOfLines={1}>
                      {homeResult?.resultNumber}
                    </Text>
                  </View>

                  {/** Top view right container */}
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
                          05:00 PM
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        borderRadius: heightPercentageToDP(2),
                      }}>
                      <Text
                        style={{
                          transform: [{rotate: '90deg'}],
                          color: COLORS.black,
                          fontFamily: FONT.Montserrat_SemiBold,
                          fontSize: heightPercentageToDP(2),
                          paddingHorizontal: heightPercentageToDP(1),
                          marginStart: heightPercentageToDP(-4),
                        }}>
                        03:20
                      </Text>
                    </View>
                  </View>
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
                      marginStart: heightPercentageToDP(-3),
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
                    }}>
                    {homeResult?.lotdate?.lotdate}
                  </Text>

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(2),
                    }}>
                    {homeResult?.lottime?.lottime}
                  </Text>

                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(2),
                    }}>
                    {homeResult?.resultNumber}
                  </Text>

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
                        }}>
                        {homeResult?.lotlocation?.lotlocation}
                      </GradientText>

                      <GradientText
                        style={{
                          fontSize: heightPercentageToDP(3),
                          fontFamily: FONT.Montserrat_Bold,

                          marginEnd: heightPercentageToDP(1),
                        }}>
                        {homeResult?.resultNumber}
                      </GradientText>
                    </View>

                    {/** List of result in flatlist */}

                    <ScrollView nestedScrollEnabled={true}>
                      <View
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
                                justifyContent: 'space-evenly',
                                alignItems: 'stretch',
                                gap: heightPercentageToDP(2.5),
                              }}>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(2),
                                  textAlign: 'left',
                                }}>
                                {item.lotdate.lotdate}
                              </Text>

                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(2),
                                }}>
                                {item.lottime.lottime}
                              </Text>

                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(2),
                                  textAlign: 'right',
                                }}>
                                {item.resultNumber}
                              </Text>
                            </TouchableOpacity>
                          ))
                        )}
                      </View>
                    </ScrollView>
                  </View>

                  {/** Top view right container */}
                  <View
                    style={{
                      flex: 1,
                      
                      justifyContent: 'center',
                    }}>
                    <View style={{position: 'absolute', top: 10, zIndex: 1}}>
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
                          05:00 PM
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          transform: [{rotate: '90deg'}],
                          color: COLORS.black,
                          fontFamily: FONT.Montserrat_SemiBold,
                          fontSize: heightPercentageToDP(2.5),
                          paddingHorizontal: heightPercentageToDP(1),

                          marginStart: heightPercentageToDP(-3),
                        }}>
                        03:20
                      </Text>
                    </View>
                  </View>
                </View>

                {/** Big Result bottom container */}

                <TouchableOpacity
                  onPress={() => setShowDate(true)}
                  style={{
                    backgroundColor: COLORS.white_s,

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
                      color: COLORS.black,
                    }}>
                    Download
                  </Text>
                </TouchableOpacity>
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

            <View style={styles.container}>
              <View>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handlePageChange}
                  scrollEventThrottle={16}>
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      source={{uri: image}}
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

            {/** WALLET CONTAINER */}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('WalletBalance', {data: user.walletOne})
                }>
                <Wallet wallet={user.walletOne} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('WalletBalance', {data: user.walletTwo})
                }>
                <Wallet wallet={user.walletTwo} />
              </TouchableOpacity>
            </ScrollView>
          </ScrollView>
        )
      )}
    </SafeAreaView>
  );
};

export default Home;

// <View>
// <ScrollView
//   horizontal={true}
//   showsHorizontalScrollIndicator={false}>
//   {promotiondata.map((item, index) => (
//     <TouchableOpacity
//       key={index}
//       style={{marginEnd: heightPercentageToDP(2)}}>
//       <View
//         style={{
//           height: heightPercentageToDP(25),
//           width: widthPercentageToDP(90),
//           backgroundColor: COLORS.grayHalfBg,
//           marginTop: heightPercentageToDP(2),
//           borderRadius: heightPercentageToDP(1),
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           gap: heightPercentageToDP(2),
//         }}>
//         <GradientText
//           style={{
//             fontSize: heightPercentageToDP(4),
//             fontFamily: FONT.Montserrat_Bold,
//           }}>
//           Promotions
//         </GradientText>
//       </View>
//     </TouchableOpacity>
//   ))}
// </ScrollView>
// </View>

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
    marginTop: 20,
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

{
  /* <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              transform: [{rotate: '90deg'}],
              color: COLORS.black,
              fontFamily: FONT.SF_PRO_MEDIUM,
              fontSize: heightPercentageToDP(2),
            }}>
            Balance
          </Text>
          <Text
            style={{
              transform: [{rotate: '90deg'}],
              color: COLORS.black,
              fontFamily: FONT.SF_PRO_MEDIUM,
              fontSize: heightPercentageToDP(2),
              marginStart: -20,
            }}>
            Total
          </Text>
        </View> */
}
