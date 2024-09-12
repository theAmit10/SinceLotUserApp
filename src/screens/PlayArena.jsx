import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  useCreatePlayMutation,
  useGetDateAccToLocTimeQuery,
} from '../helper/Networkcall';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loading from '../components/helpercComponent/Loading';
import GradientText from '../components/helpercComponent/GradientText';
import NoDataFound from '../components/helpercComponent/NoDataFound';
import {serverName} from '../redux/store';
import Toast from 'react-native-toast-message';
import {loadProfile} from '../redux/actions/userAction';
import {getTimeAccordingToTimezone} from './SearchTime';
import PlayBackground from '../components/background/PlayBackground';
import UrlHelper from '../helper/UrlHelper';
import axios from 'axios';
import moment from "moment-timezone";

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

// Function to find the object with the current date
const findCurrentDateObject = (data,currentDate) => {
  console.log('Checking for the current date is availble in the database');


  console.log('current data : ' + currentDate);
  const lotdates = data.lotdates || [];

  const found = lotdates.find(item => item.lotdate === currentDate);

  return found ? found : 'Current date not found';
};

// Function to create an array from 1 to maximumNumber
const createLocationDataArray = maximumNumber => {
  return Array.from({length: maximumNumber}, (_, index) => ({
    id: index + 1,
    name: `${index + 1}`,
  }));
};

const PlayArena = ({route}) => {
  const navigation = useNavigation();
  const {locationdata, timedata} = route.params;
  const {accesstoken, user} = useSelector(state => state.user);

  // console.log('location id :: ' + locationdata._id);
  // console.log('time id :: ' + timedata._id);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [isFocused]);

  // console.log('USERS :: ' + JSON.stringify(user));

  const [betnumberdata, setBetnumberdata] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState([]);
  const [showSelectedVisible, setshowSelectedVisible] = useState(false);
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (text, id) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [id]: text,
    }));
  };
  const addAmountForInput = id => {
    setInputValues(prevValues => {
      // Get the current amount, default to 0 if not present
      const currentAmount = parseInt(prevValues[id] || '0', 10);
      // Add 10 to the current amount and convert it back to a string
      return {
        ...prevValues,
        [id]: (currentAmount + 10).toString(),
      };
    });
  };
  const removeAmountForInput = id => {
    console.log('Removing :: ' + id);
    setInputValues(prevValues => {
      // Get the current amount, default to 0 if not present
      const currentAmount = parseInt(prevValues[id] || '0', 10);

      // If the current amount is 0 or less, return 0
      if (currentAmount <= 0) {
        return {
          ...prevValues,
          [id]: '0',
        };
      }

      // Subtract 10 from the current amount and convert it back to a string
      return {
        ...prevValues,
        [id]: (currentAmount - 10).toString(),
      };
    });
  };
  const handleAddClick = id => {
    addAmountForInput(id);
  };
  const handleRemoveClick = id => {
    removeAmountForInput(id);
  };
  const winningAmountPrice = (str1, str2) => {
    // Convert the first string to a number
    const number1 = parseFloat(str1);

    // Extract numeric part from the second string
    // Remove any whitespace and convert to lowercase for uniformity
    const cleanedStr2 = str2.trim().toLowerCase();

    // Find the position of 'x' or 'X' in the second string
    const xIndex = cleanedStr2.indexOf('x');

    // If 'x' or 'X' is found, extract the part before it and convert to a number
    const number2 =
      xIndex !== -1 ? parseFloat(cleanedStr2.substring(0, xIndex)) : 0;

    // Multiply the two numbers
    const result = number1 * number2;

    return result;
  };

  console.log('FROM PLAYARENA :: ' + JSON.stringify(inputValues));

  const {data, error, isLoading, refetch} = useGetDateAccToLocTimeQuery({
    accessToken: accesstoken,
    lottimeId: timedata._id,
    lotlocationId: locationdata._id,
  });
 
  useFocusEffect(
    useCallback(() => {
      // Refetch the data when the screen is focused
      refetch();
    }, [refetch]),
  );

  const [result, setResult] = useState(null);
  const [currentDate, setCurrentDate] = useState(null)
  const [showPlay, setShowPlay] = useState(false);

  // Function to call the API and fetch the results
  const getResultAccordingToLocationTimeDate = async (lotdateId, lottimeId, lotlocationId) => {
    try {
      const url = `${UrlHelper.RESULT_API}?lotdateId=${lotdateId}&lottimeId=${lottimeId}&lotlocationId=${lotlocationId}`;
      console.log("URL :: " + url);

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });

      console.log("ACTION result :: " + JSON.stringify(data.results));

      // Check if the results array is empty
      if (data.results.length !== 0) {
        setResult("Current date not found");
      }
       else {
        // setResult(currentDate); // Set to the current date object if results are found
        console.log("Setting to Result ELSE :: " + JSON.stringify(currentDate));
        console.log("Setting to Location ELSE :: " + JSON.stringify(locationdata.maximumNumber));
        const maximumNumber = locationdata.maximumNumber; // Ensure `maximumNumber` exists in the data
        if (maximumNumber) {
          const generatedArray = createLocationDataArray(maximumNumber);
          setBetnumberdata(generatedArray);
        }
        setResult("yes"); // Set to the current date object if results are found
      }
      setShowPlay(false);
    } catch (error) {
      setShowPlay(false);
      console.log(error)
      console.log("Error message:", error.response?.data?.message);
    }
  };

  // First useEffect to find the current date object and set betnumberdata
  useEffect(() => {
    if (!isLoading && data) {
      console.log('All Date length :: ' + data.lotdates.length);
      console.log('All Date :: ' + JSON.stringify(data));
      setShowPlay(true);

      const now = moment.tz(user?.country?.timezone);
      console.log("Current Time: ", now.format("hh:mm A"));
      console.log("Current Date: ", now.format("DD-MM-YYYY"));

      const lotTimeMoment = moment.tz(
        timedata?.time,
        "hh:mm A",
        user?.country?.timezone
      );
      console.log(`Lot Time for location : ${lotTimeMoment.format("hh:mm A")}`);
      const isLotTimePassed = now.isSameOrAfter(lotTimeMoment);
      const nextDay = now.clone().add(1, "day");

      console.log(`Checking times Lot Time Passed: ${isLotTimePassed}`);
      console.log("Next Date: ", nextDay.format("DD-MM-YYYY"));

      if (isLotTimePassed) {
        const currentDate = nextDay.format("DD-MM-YYYY");
        const currentDateObject = findCurrentDateObject(data,currentDate);
        setResult(currentDateObject); // Set the result to the current date object
        setCurrentDate(currentDateObject)
        console.log('Today Play :: ' + JSON.stringify(currentDateObject));
  
        if (currentDateObject !== 'Current date not found') {
          console.log('result !== "Current date not found"');
          // Fetch results using the API function
          getResultAccordingToLocationTimeDate(
            currentDateObject._id,
            timedata._id,
            locationdata._id
          );
        }

      }else{
        const currentDate = getCurrentDate();
        const currentDateObject = findCurrentDateObject(data,currentDate);
        setResult(currentDateObject); // Set the result to the current date object
        setCurrentDate(currentDateObject)
        console.log('Today Play :: ' + JSON.stringify(currentDateObject));
  
        if (currentDateObject !== 'Current date not found') {
          console.log('result !== "Current date not found"');
          // Fetch results using the API function
          getResultAccordingToLocationTimeDate(
            currentDateObject._id,
            timedata._id,
            locationdata._id
          );
        }
      }

     
    }
  }, [isLoading, data]);
  

  const addingNumberForBetting = number => {
    console.log('ADDING NUMBER TO LIST');

    setSelectedNumber(prevSelectedNumbers => {
      const updatedList = [...prevSelectedNumbers];

      const index = updatedList.indexOf(number);
      if (index > -1) {
        // Number is already present, remove it
        updatedList.splice(index, 1);
      } else {
        // Number is not present, add it
        updatedList.push(number);
      }

      console.log('SELECTED NUMBER :: ', updatedList);
      return updatedList;
    });
  };

  const showingSeletedContainer = () => {
    if (showSelectedVisible) {
      setshowSelectedVisible(false);
    } else {
      setshowSelectedVisible(true);
    }
  };

  const sumObjectValues = obj => {
    // Extract values, convert them to numbers, and sum them up
    return Object.values(obj)
      .map(value => parseFloat(value)) // Convert each value to a number
      .reduce((sum, value) => sum + value, 0); // Sum them up
  };

  function canPlaceBet(walletBalanceStr, bettingAmountStr) {
    const walletBalance = parseFloat(walletBalanceStr);
    const bettingAmount = parseFloat(bettingAmountStr);

    if (isNaN(walletBalance) || isNaN(bettingAmount)) {
      throw new Error('Invalid input: Both inputs must be valid numbers.');
    }

    return walletBalance >= bettingAmount;
  }

  // USED TO GET SELECTED NUMBER WITH AMOUNT INVESTED
  const transformData = (inputValues, multiplier) => {
    return Object.entries(inputValues).map(([playnumber, amount]) => ({
      playnumber: parseInt(playnumber, 10),
      amount: parseFloat(amount),
      winningamount: winningAmountPrice(amount, multiplier),
    }));
  };

  const [createPlay, {isLoading: isPlayLoading, error: playError}] =
    useCreatePlayMutation();
  // console.log('Is palyloading ' + isPlayLoading);

  // TO CHECK THE AMOUNT IN EACH OF THE SELECTED NUMBER IS VALID
  const checkAmounOfSelectedNumberIsValid = list => {
    // Check if the object is empty
    if (Object.keys(list).length === 0) {
      return false;
    }

    // Check if any value is an empty string "" or "0"
    for (const key in list) {
      if (list[key] === '' || list[key] === '0') {
        return false;
      }
    }

    return true;
  };

  function addLeadingZero(value) {
    // Convert the input to a string to handle both string and number inputs
    const stringValue = value.toString();

    // Check if the value is between 1 and 9 (inclusive) and add a leading zero
    if (
      stringValue.length === 1 &&
      parseInt(stringValue) >= 1 &&
      parseInt(stringValue) <= 9
    ) {
      return '0' + stringValue;
    }

    // If the value is 10 or more, return it as is
    return stringValue;
  }

  const submitHandler = async () => {
    if (sumObjectValues(inputValues) === 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid amount',
        text2: 'Add amount for bet',
      });
    } else if (
      !canPlaceBet(user.walletTwo.balance, sumObjectValues(inputValues))
    ) {
      Toast.show({
        type: 'error',
        text1: 'Insufficent Balance',
        text2: 'Add balance to play',
      });
    } else if (!checkAmounOfSelectedNumberIsValid(inputValues)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid amount',
        text2: 'Add betting amount for all numbers',
      });
    } else {
      try {
        const body = {
          playnumbers: transformData(inputValues, locationdata.maximumReturn),
          lotdate: currentDate._id,
          lottime: timedata._id,
          lotlocation: locationdata._id,
        };

        console.log('Request body :: ' + JSON.stringify(body));

        const res = await createPlay({
          accessToken: accesstoken,
          body,
        }).unwrap();
        console.log('Create Play res :: ' + JSON.stringify(res));

        if (res.message === 'Playbet entry added successfully') {
          Toast.show({
            type: 'success',
            text1: 'Order Placed Successfully',
            text2: res.message,
          });
        }

        // navigation.goBack();
        dispatch(loadProfile(accesstoken));
        setInputValues({});
        setSelectedNumber([])
        showingSeletedContainer()
      } catch (error) {
        console.log('Error during withdraw:', error);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
      }
    }
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => addingNumberForBetting(item)}
      style={styles.itemContainer}>
      <LinearGradient
        colors={
          selectedNumber.includes(item)
            ? [COLORS.result_lightblue, COLORS.time_secondbluw]
            : [COLORS.yellow, COLORS.darkyellow]
        }
        style={{
          paddingHorizontal: heightPercentageToDP(1),
          paddingVertical: heightPercentageToDP(0.8),
          borderRadius: heightPercentageToDP(2.5),
          shadowColor: COLORS.black,
          shadowOpacity: 0.8,
          shadowOffset: {width: 0, height: 2},
          shadowRadius: 3,
          elevation: 6, // Ensures shadow shows on Android
        }}>
        <LinearGradient
          colors={[COLORS.grayBg, COLORS.white_s]}
          style={{
            ...styles.gradient,
            shadowColor: COLORS.black,
            shadowOpacity: 0.8,
            shadowOffset: {width: 0, height: 2},
            shadowRadius: 3,
            elevation: 6, // Ensures shadow shows on Android
          }}>
          <Text
            style={{
              ...styles.itemText,
              color: selectedNumber.includes(item)
                ? COLORS.time_firstblue
                : COLORS.black,
            }}>
            {addLeadingZero(item.name)}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.grayBg,
              height: 1,
              width: '100%',
            }}></View>
          <Text
            style={{
              ...styles.selectText,
              color: selectedNumber.includes(item)
                ? COLORS.time_firstblue
                : COLORS.black,
            }}>
            {selectedNumber.includes(item) ? 'Selected' : 'Select'}
          </Text>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="height"
        keyboardVerticalOffset={-60}>
        <PlayBackground  showSelectedVisible={showSelectedVisible}
              showingSeletedContainer={showingSeletedContainer}/>
        <View style={styles.innerContainer}>
          {/** Top header wollet container */}

          {user && (
            <View
              style={{
                margin: heightPercentageToDP(2),
                backgroundColor: COLORS.grayHalfBg,
                height: heightPercentageToDP(12),
                borderRadius: heightPercentageToDP(2),
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  overflow: 'hidden',
                  width: 70,
                  height: 70,
                  marginTop: heightPercentageToDP(1),
                  marginStart: heightPercentageToDP(1),
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

              <View
                style={{
                  flex: 1,
                }}>
                <View
                  style={{
                    flex: 2,

                    justifyContent: 'center',
                    paddingStart: heightPercentageToDP(1),
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flex: 1,

                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        color: COLORS.black,
                      }}>
                      User ID
                      <Text
                        style={{
                          fontFamily: FONT.HELVETICA_BOLD,
                          color: COLORS.black,
                          fontSize: heightPercentageToDP(2),
                        }}>
                        : {user.userId}
                      </Text>
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

                  <View
                    style={{
                      flex: 1,

                      paddingEnd: heightPercentageToDP(1),
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        color: COLORS.black,
                      }}>
                      {getTimeAccordingToTimezone(
                         timedata.time ? timedata.time : timedata.lottime,
                        user?.country?.timezone,
                      )}
                    </Text>

                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        color: COLORS.black,
                      }}>
                      {currentDate?.lotdate}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,

                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingEnd: heightPercentageToDP(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      color: COLORS.black,
                    }}>
                    Balance
                    <Text
                      style={{
                        fontFamily: FONT.HELVETICA_BOLD,
                        color: COLORS.black,
                        fontSize: heightPercentageToDP(2),
                        paddingStart: heightPercentageToDP(1),
                      }}>
                      : {user.walletTwo.balance}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          <ImageBackground
            source={require('../../assets/image/tlwbg.jpg')}
            style={styles.imageBackground}
            imageStyle={styles.imageBackgroundStyle}>
            <View style={styles.topBar}>
              <GradientTextWhite style={styles.locationText}>
                {locationdata.name ? locationdata.name : locationdata.lotlocation}
              </GradientTextWhite>
              <View style={styles.divider} />
              <GradientTextWhite style={styles.timeText}>
                {getTimeAccordingToTimezone(
                  timedata.time ? timedata.time : timedata.lottime,
                  user?.country?.timezone,
                )}
              </GradientTextWhite>
            </View>

            {/** FOR PLAY NUMBER */}
            {result === 'Current date not found' ? (
              <View
                style={{
                  margin: heightPercentageToDP(2),
                }}>
                <NoDataFound data={'No Game Available today'} />
              </View>
            ) : (
              betnumberdata.length !== 0 &&
              !showSelectedVisible && (
                <FlatList
                  data={betnumberdata}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  contentContainerStyle={styles.flatListContent}
                />
              )
            )}

            {/** FOR SELECTED NUMBER  */}
            {selectedNumber.length !== 0 && showSelectedVisible && (
              <FlatList
                data={selectedNumber}
                renderItem={({item, index}) => (
                  <View
                    key={index.toString()}
                    style={{
                      height: heightPercentageToDP(12),
                      backgroundColor: COLORS.white_s,
                      marginHorizontal: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(2),
                      flexDirection: 'row',
                      marginBottom: heightPercentageToDP(1),
                    }}>
                    {/** SELECTED NUMBER */}
                    <TouchableOpacity
                      style={{
                        margin: heightPercentageToDP(1),
                        borderRadius: heightPercentageToDP(1),
                        overflow: 'hidden',
                        width: widthPercentageToDP(20),
                        height: heightPercentageToDP(9),
                      }}>
                      <LinearGradient
                        colors={[
                          COLORS.result_lightblue,
                          COLORS.time_secondbluw,
                        ]}
                        style={{
                          height: heightPercentageToDP(9),
                          paddingHorizontal: heightPercentageToDP(1),
                          paddingVertical: heightPercentageToDP(0.8),
                          borderRadius: heightPercentageToDP(2.5),
                          shadowColor: COLORS.black,
                          shadowOpacity: 0.8,
                          shadowOffset: {width: 0, height: 2},
                          shadowRadius: 3,
                          elevation: 6, // Ensures shadow shows on Android
                        }}>
                        <LinearGradient
                          colors={[COLORS.grayBg, COLORS.white_s]}
                          style={{
                            ...styles.gradient,
                            shadowColor: COLORS.black,
                            shadowOpacity: 0.8,
                            shadowOffset: {width: 0, height: 2},
                            shadowRadius: 3,
                            elevation: 6, // Ensures shadow shows on Android
                          }}>
                          <Text
                            style={{
                              ...styles.itemText,
                              color: COLORS.time_firstblue,
                            }}>
                            {item.name}
                          </Text>
                          <View
                            style={{
                              backgroundColor: COLORS.grayBg,
                              height: 1,
                              width: '100%',
                            }}></View>
                        </LinearGradient>
                      </LinearGradient>
                    </TouchableOpacity>

                    <View
                      style={{
                        flex: 1,
                        padding: heightPercentageToDP(1),
                      }}>
                      {/** AMOUNT NUMBER */}
                      <View
                        style={{
                          flex: 2,

                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        {/** Remove */}
                        <TouchableOpacity
                          onPress={() => handleRemoveClick(item.id)}>
                          <LinearGradient
                            colors={[
                              COLORS.time_firstgreen,
                              COLORS.time_secondgreen,
                            ]}
                            className="rounded-xl p-1">
                            <Ionicons
                              name={'remove-circle-outline'}
                              size={heightPercentageToDP(3)}
                              color={COLORS.darkGray}
                            />
                          </LinearGradient>
                        </TouchableOpacity>

                        {/** Amont */}

                        <LinearGradient
                          colors={[
                            COLORS.time_firstblue,
                            COLORS.time_secondbluw,
                          ]}
                          start={{x: 0, y: 0}} // start from left
                          end={{x: 1, y: 0}} // end at right
                          style={{
                            borderRadius: heightPercentageToDP(2),
                            width: widthPercentageToDP(30),
                          }}>
                          <TextInput
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            cursorColor={COLORS.white}
                            placeholderTextColor={COLORS.black}
                            style={{
                              backgroundColor: 'transparent',
                              fontFamily: FONT.Montserrat_Bold,
                              color: COLORS.black,
                              textAlign: 'center',
                            }}
                            placeholder={'Amount'}
                            placeholderTextColor={COLORS.darkGray}
                            value={inputValues[item.id]?.toString() || ''}
                            onChangeText={text =>
                              handleInputChange(text, item.id)
                            }
                            keyboardType="numeric"
                          />
                        </LinearGradient>

                        {/** Add */}
                        <TouchableOpacity
                          onPress={() => handleAddClick(item.id)}>
                          <LinearGradient
                            colors={[
                              COLORS.time_firstgreen,
                              COLORS.time_secondgreen,
                            ]}
                            className="rounded-xl p-1">
                            <Ionicons
                              name={'add-circle-outline'}
                              size={heightPercentageToDP(3)}
                              color={COLORS.darkGray}
                            />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>

                      {/** YOU WIN  */}
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: heightPercentageToDP(1),
                          flexDirection: 'row',
                          gap: heightPercentageToDP(1),
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_Regular,
                            color: COLORS.black,
                            fontSize: heightPercentageToDP(1.5),
                          }}>
                          Winning Amount
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_Bold,
                            color: COLORS.black,
                            fontSize: heightPercentageToDP(2),
                          }}>
                          {isNaN(
                            winningAmountPrice(
                              inputValues[item.id]?.toString(),
                              locationdata.maximumReturn,
                            ),
                          )
                            ? 0
                            : winningAmountPrice(
                                inputValues[item.id]?.toString(),
                                locationdata.maximumReturn,
                              )}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={() => (
                  <View>
                    <LinearGradient
                      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                      start={{x: 0, y: 0}} // start from left
                      end={{x: 1, y: 0}} // end at right
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: heightPercentageToDP(8),
                        borderRadius: heightPercentageToDP(2),
                        alignItems: 'center',
                        gap: heightPercentageToDP(3),
                        paddingStart: heightPercentageToDP(2),
                        margin: heightPercentageToDP(2),
                      }}>
                      <Text
                        style={{
                          fontSize: heightPercentageToDP(2),
                          fontFamily: FONT.Montserrat_SemiBold,
                          color: COLORS.black,
                        }}>
                        Total Amount
                      </Text>

                      <GradientText
                        style={{
                          fontSize: heightPercentageToDP(2),
                          fontFamily: FONT.Montserrat_Bold,
                          color: COLORS.black,
                        }}>
                        {sumObjectValues(inputValues)}
                      </GradientText>
                    </LinearGradient>

                    {isPlayLoading ? (
                      <View style={styles.loading}>
                        <Loading />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={submitHandler}
                        style={{
                          backgroundColor: COLORS.blue,
                          padding: heightPercentageToDP(2),
                          borderRadius: heightPercentageToDP(1),
                          alignItems: 'center',
                          marginHorizontal: heightPercentageToDP(2),
                          marginBottom: heightPercentageToDP(4),
                        }}>
                        <Text
                          style={{
                            color: COLORS.white,
                            fontFamily: FONT.Montserrat_Regular,
                            fontSize: heightPercentageToDP(2),
                          }}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
            )}

            {/** FOR SUBMIT BUTTON */}
            {selectedNumber.length !== 0 && !showSelectedVisible && (
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  padding: heightPercentageToDP(1),
                }}>
                <TouchableOpacity
                  onPress={showingSeletedContainer}
                  style={{
                    backgroundColor: COLORS.yellow,
                    padding: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(3),
                  }}>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontFamily: FONT.HELVETICA_BOLD,
                      fontSize: heightPercentageToDP(2),
                    }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PlayArena;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContainer: {
    margin: heightPercentageToDP(2),
    backgroundColor: COLORS.grayHalfBg,
    height: heightPercentageToDP(12),
    borderRadius: heightPercentageToDP(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: heightPercentageToDP(1),
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingStart: heightPercentageToDP(1),
  },
  userInfoText: {
    fontFamily: FONT.Montserrat_Regular,
    color: COLORS.black,
  },
  userId: {
    fontFamily: FONT.HELVETICA_BOLD,
    fontSize: heightPercentageToDP(2),
  },
  userName: {
    fontFamily: FONT.HELVETICA_BOLD,
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
  },
  userBalance: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingEnd: heightPercentageToDP(1),
  },
  userBalanceText: {
    fontFamily: FONT.Montserrat_Regular,
    color: COLORS.black,
  },
  userBalanceAmount: {
    fontFamily: FONT.HELVETICA_BOLD,
    fontSize: heightPercentageToDP(2),
  },
  imageBackground: {
    width: '100%',
    height: heightPercentageToDP(70),
  },
  imageBackgroundStyle: {
    borderTopLeftRadius: heightPercentageToDP(5),
    borderTopRightRadius: heightPercentageToDP(5),
  },
  topBar: {
    height: heightPercentageToDP(5),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  locationText: {
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  divider: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(0.8),
    backgroundColor: COLORS.grayBg,
    borderRadius: heightPercentageToDP(2),
  },
  timeText: {
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  flatListContent: {
    padding: heightPercentageToDP(2),
  },
  itemContainer: {
    flex: 1,
    margin: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(1),
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(3),
  },
  itemText: {
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(4),
  },
  selectText: {
    color: COLORS.black,
    fontFamily: FONT.Montserrat_SemiBold,
    fontSize: heightPercentageToDP(1.7),
    marginTop: heightPercentageToDP(0.5),
  },
});

