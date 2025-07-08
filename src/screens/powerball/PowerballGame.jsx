import {
  ImageBackground,
  KeyboardAvoidingView,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientText from '../../components/helpercComponent/GradientText';
import Loading from '../../components/helpercComponent/Loading';
import GreenBall from '../../components/powerball/GreenBall';
import WhiteBall from '../../components/powerball/WhiteBall';
import SmallWhiteBall from '../../components/powerball/SmallWhiteBall';
import {
  useCreatePowerballBetMutation,
  useGetPowerballQuery,
  useGetPowerDatesByTimeQuery,
} from '../../helper/Networkcall';
import moment from 'moment-timezone';
import {
  getDateTimeAccordingToUserTimezone,
  getTimeAccordingToTimezone,
} from '../SearchTime';
import {
  addMultipleTicketsR,
  addTicketR,
  generateUniqueRandomNumbersR,
  handleMultiplierSelectR,
  handleNumberSelectR,
  removeTicketR,
  resetTickets,
  setYellowBall,
  setYellowBallClick,
} from '../../redux/ticketSlice';
import {loadProfile} from '../../redux/actions/userAction';

const getCurrentDateInTimezone = timezone => {
  return moment().tz(timezone).format('DD-MM-YYYY');
};

const getMatchingPowerDate = (currentDate, powerDates) => {
  return powerDates.find(entry => entry.powerdate === currentDate) || null;
};

const generateMultiplierObject = (number, multiplierArray = []) => {
  if (!Array.isArray(multiplierArray)) {
    console.error(
      'Invalid multiplier array. Expected an array but got:',
      multiplierArray,
    );
    return {};
  }

  const result = {};

  multiplierArray.forEach(item => {
    if (item.value) {
      const multiplierValue = parseInt(item.value); // Extract number from "2X", "3X", etc.
      if (!isNaN(multiplierValue)) {
        result[item.value] = number * multiplierValue;
      }
    }
  });

  // Add '7X' and 'NA' with default values
  // result['7X'] = number * 7;
  result['NA'] = 0;

  return result;
};

const getMultiplierValues = (multiplierArray = []) => {
  if (!Array.isArray(multiplierArray)) {
    console.error(
      'Invalid multiplier array. Expected an array but got:',
      multiplierArray,
    );
    return [];
  }

  // Extract values from the array
  const values = multiplierArray.map(item => item.value);

  // Append '7X' and 'NA'
  return [...values, 'NA'];
};

const processTicketData = (ticketArray, TICKET_COST) => {
  if (!Array.isArray(ticketArray) || typeof TICKET_COST !== 'number') {
    console.error('Invalid input. Expected an array and a number.');
    return [];
  }

  return ticketArray.map(({multiplier, selectedNumbers}) => {
    // Handle cases where multiplier is "NA" or null
    const multiplierValue =
      multiplier && multiplier !== 'NA'
        ? parseInt(multiplier.replace('X', ''), 10)
        : 1;

    return {
      amount: TICKET_COST * multiplierValue, // Multiply cost with multiplier
      convertedAmount: TICKET_COST * multiplierValue, // Generate a random converted amount
      multiplier: multiplierValue, // Store multiplier as a number
      usernumber: selectedNumbers, // Keep the selected numbers
    };
  });
};

function canPlaceBet(walletBalanceStr, bettingAmountStr) {
  const walletBalance = parseFloat(walletBalanceStr);
  const bettingAmount = parseFloat(bettingAmountStr);

  if (isNaN(walletBalance) || isNaN(bettingAmount)) {
    throw new Error('Invalid input: Both inputs must be valid numbers.');
  }

  return walletBalance >= bettingAmount;
}

const PowerballGame = ({route}) => {
  const {item: powertime} = route.params;

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const {accesstoken, user} = useSelector(state => state.user);
  const [todayPowerDate, setTodayPowerDate] = useState(null);
  const MAX_NUMBERS = 6; // Numbers per ticket
  const [TOTAL_BALLS, setTOTAL_BALLS] = useState(null);
  const [MULTIPLIERS, setMULTIPLIERS] = useState([]);
  const [TICKET_COST, setTICKET_COST] = useState(null);
  const [MULTIPLIER_COSTS, setMULTIPLIER_COSTS] = useState({});

  const [powerball, setPowerball] = useState(null);

  // Network call
  const {data: powerballData, isLoading: powerballIsLoading} =
    useGetPowerballQuery({accesstoken});

  useEffect(() => {
    if (!powerballIsLoading && powerballData) {
      setPowerball(powerballData.games[0]);
      setTOTAL_BALLS(powerballData.games[0].range.endRange);
      setTICKET_COST(user?.country?.ticketprice);

      const multiplierArray = generateMultiplierObject(
        user?.country?.multiplierprice,
        powerballData?.games[0].multiplier,
      );

      setMULTIPLIER_COSTS(multiplierArray);
      setMULTIPLIERS(getMultiplierValues(powerballData?.games[0].multiplier));
    }
  }, [powerballData, powerballIsLoading]);

  // [FOR GETTING POWERBALL GAME DATES]
  const {data: powerballDates, isLoading: powerballDatesIsLoading} =
    useGetPowerDatesByTimeQuery({
      accesstoken,
      id: powertime._id,
      page: 1,
      limit: 10,
    });

  const [showPlay, setShowPlay] = useState(false);

  // [FOR GETTING TODAY POWERBALL DATE]
  useEffect(() => {
    // if (!powerballDatesIsLoading && powerballDates) {
    //   const currentDate = getCurrentDateInTimezone(user?.country?.timezone);
    //   const matchingDate = getMatchingPowerDate(
    //     currentDate,
    //     powerballDates.powerDates,
    //   );
    //   setTodayPowerDate(matchingDate);
    //   console.log(matchingDate);
    // }
    if (!powerballDatesIsLoading && powerballDates) {
      setShowPlay(true);

      // Get current time in Asia/Kolkata timezone
      const now = moment.tz('Asia/Kolkata');
      console.log('Current Time (IST): ', now.format('hh:mm A'));
      console.log('Current Date (IST): ', now.format('DD-MM-YYYY'));

      // Get the selected lot time (ensure it's correctly formatted)
      const currentDateString = now.format('DD-MM-YYYY'); // Current date as string
      const lotTimeString = powertime?.powertime; // Lot time from selectedTime

      // Debugging: Log the selected time to ensure it's correct
      console.log('Selected Lot Time String: ', lotTimeString);

      // Parse the lot time with the current date
      const lotTimeMoment = moment.tz(
        `${currentDateString} ${lotTimeString}`, // Combine date and time
        'DD-MM-YYYY hh:mm A', // Date and time format
        'Asia/Kolkata', // Timezone
      );

      // Debugging: Log the parsed lot time
      console.log(
        `Parsed Lot Time for location: ${lotTimeMoment.format('hh:mm A')}`,
      );

      // Check if the current time is the same or after the lot time
      const isLotTimePassed = now.isSameOrAfter(lotTimeMoment);
      const nextDay = now.clone().add(1, 'day');

      console.log(`Is Lot Time Passed: ${isLotTimePassed}`);
      console.log('Next Day Date: ', nextDay.format('DD-MM-YYYY'));

      if (isLotTimePassed) {
        // If lot time has passed, move to the next day
        console.log('You are inside the IF block (Lot time has passed)');
        const currentDate = nextDay.format('DD-MM-YYYY');
        console.log('Next Date (IST): ' + currentDate);

        // setResult(currentDateObject);
        // setCurrentDate(currentDateObject);
        // setSelectedDate(currentDateObject);

        const currentDateObject = getMatchingPowerDate(
          currentDate,
          powerballDates.powerDates,
        );
        console.log('Next Day Play Data: ', JSON.stringify(currentDateObject));
        setTodayPowerDate(currentDateObject);
      } else {
        // If lot time hasn't passed, handle current day
        console.log('You are inside the ELSE block (Lot time has not passed)');
        const currentDate = getCurrentDateInTimezone();
        console.log('Current Date in Timezone: ' + currentDate);

        // const currentDateObject = findCurrentDateObject(dataDate, currentDate);
        // console.log("Today's Play Data: ", JSON.stringify(currentDateObject));

        // setResult(currentDateObject);
        // setCurrentDate(currentDateObject);
        // setSelectedDate(currentDateObject);

        const currentDateObject = getMatchingPowerDate(
          currentDate,
          powerballDates.powerDates,
        );
        console.log('Next Day Play Data: ', JSON.stringify(currentDateObject));
        setTodayPowerDate(currentDateObject);
      }
    }
  }, [powerballDatesIsLoading, powerballDates]);

  const [ticketValue, setTicketValue] = useState(1);

  // [FOR POWEBALL BET]

  const [createPowerballBet, {isLoading: createPowerballBetIsLoading}] =
    useCreatePowerballBetMutation();

  // Function to increment the ticket value
  const increment = () => {
    setTicketValue(ticketValue + 1);
  };

  // Function to decrement the ticket value
  const decrement = () => {
    if (ticketValue > 1) {
      setTicketValue(ticketValue - 1); // Prevent going below 1
    }
  };

  const createArray = number => {
    return Array.from({length: number}, (_, index) => index + 1);
  };

  // Example usage:
  const ballnumbers = createArray(70);

  // Start from here

  // const [tickets, setTickets] = useState([
  //   {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
  // ]);
  // const [activeTicketIndex, setActiveTicketIndex] = useState(0);
  // const [activeBallIndex, setActiveBallIndex] = useState(0);
  const [showMultipliers, setShowMultipliers] = useState(false);
  const [showAllSeclectedBalls, setShowAllSeclectedBalls] = useState(false);

  const ballNumbers = Array.from({length: TOTAL_BALLS}, (_, i) => i + 1);

  const {tickets, activeTicketIndex, activeBallIndex} = useSelector(
    state => state.tickets,
  );

  const addTicket = () => {
    // setTickets([
    //   ...tickets,
    //   {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
    // ]);
    // setActiveTicketIndex(tickets.length);
    // setActiveBallIndex(0);
    dispatch(addTicketR());
  };

  const addMultipleTickets = value => {
    dispatch(addMultipleTicketsR(value));
    // const numTickets = parseInt(value, 10);
    // if (!isNaN(numTickets) && numTickets > 0) {
    //   const newTickets = Array.from({length: numTickets}, () => ({
    //     selectedNumbers: Array(MAX_NUMBERS).fill(null),
    //     multiplier: null,
    //   }));
    //   setTickets([...tickets, ...newTickets]);
    // }
  };

  const removeTicket = () => {
    dispatch(removeTicketR());
    // if (tickets.length > 1) {
    //   setTickets(tickets.slice(0, -1));
    //   if (activeTicketIndex >= tickets.length - 1) {
    //     setActiveTicketIndex(tickets.length - 2);
    //   }
    // }
  };

  const handleNumberSelect = (number, ticketIndex) => {
    dispatch(
      handleNumberSelectR({
        number: number,
        ticketIndex: ticketIndex,
      }),
    );
    // const currentTicket = tickets[activeTicketIndex];
    // const updatedNumbers = [...currentTicket.selectedNumbers];

    // if (updatedNumbers.includes(number)) {
    //   const indexToRemove = updatedNumbers.indexOf(number);
    //   updatedNumbers[indexToRemove] = null;
    // } else {
    //   updatedNumbers[activeBallIndex] = number;
    // }

    // const updatedTickets = [...tickets];
    // updatedTickets[activeTicketIndex] = {
    //   ...currentTicket,
    //   selectedNumbers: updatedNumbers,
    // };
    // setTickets(updatedTickets);

    // const nextEmptyIndex = updatedNumbers.indexOf(null);
    // if (nextEmptyIndex !== -1) {
    //   setActiveBallIndex(nextEmptyIndex);
    // }
  };

  const handleMultiplierSelect = multiplier => {
    dispatch(handleMultiplierSelectR(multiplier));
    // const updatedTickets = [...tickets];
    // updatedTickets[activeTicketIndex].multiplier = multiplier;
    // setTickets(updatedTickets);
    setShowMultipliers(false); // Hide the multiplier selection after a choice is made
  };

  const isSubmitEnabled = tickets.every(ticket =>
    ticket.selectedNumbers.every(num => num !== null),
  );

  const generateUniqueRandomNumbers = () => {
    dispatch(generateUniqueRandomNumbersR());
    // let usedNumbers = [];

    // // Reset selected numbers to null first before generating new ones
    // const newTickets = tickets.map(ticket => {
    //   let ticketNumbers = Array(MAX_NUMBERS).fill(null); // Reset all numbers

    //   // Find empty slots in the current ticket (all should be empty now)
    //   const emptyIndexes = ticketNumbers
    //     .map((num, index) => (num === null ? index : -1))
    //     .filter(index => index !== -1);

    //   emptyIndexes.forEach(index => {
    //     let randomNum;
    //     do {
    //       // Generate a random number
    //       randomNum =
    //         ballNumbers[Math.floor(Math.random() * ballNumbers.length)];

    //       // Ensure that the number is unique across all tickets
    //     } while (
    //       usedNumbers.includes(randomNum) ||
    //       ticketNumbers.includes(randomNum)
    //     );

    //     ticketNumbers[index] = randomNum;
    //     usedNumbers.push(randomNum); // Mark this number as used
    //   });

    //   return {...ticket, selectedNumbers: ticketNumbers};
    // });

    // setTickets(newTickets);
  };

  // Function to calculate total cost of all tickets
  const calculateTotalCost = () => {
    return tickets.reduce((total, ticket) => {
      const multiplierCost = ticket.multiplier
        ? MULTIPLIER_COSTS[ticket.multiplier]
        : 0;
      return total + TICKET_COST + multiplierCost;
    }, 0);
  };

  // Function to calculate the price of each individual ticket
  const calculateTicketPrice = ticket => {
    const multiplierCost = ticket.multiplier
      ? MULTIPLIER_COSTS[ticket.multiplier]
      : 0;
    return TICKET_COST + multiplierCost;
  };

  const sebmittingNext = async () => {
    console.log('submitting now next stage to confirm ticket');
    console.log('submited ticket :: ', tickets);
    setShowAllSeclectedBalls(true);
  };

  const [submitLoader, setSubmitLoader] = useState(false);
  const submitHandler = async () => {
    // setSubmitLoader(true);
    console.log('submitting to next stage to confirm ticket');

    const now = moment.tz(user?.country?.timezone);
    console.log('Current Time: ', now.format('hh:mm A'));
    console.log('Current Date: ', now.format('DD-MM-YYYY'));

    const lotTimeMoment = moment.tz(
      getTimeAccordingToTimezone(powertime?.powertime, user?.country?.timezone),
      'hh:mm A',
      user?.country?.timezone,
    );
    console.log(`Lot Time for location : ${lotTimeMoment.format('hh:mm A')}`);

    // Subtract 15 minutes from the lotTimeMoment
    const lotTimeMinus15Minutes = lotTimeMoment.clone().subtract(30, 'minutes');

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
      return;
    }

    console.log('submited ticket :: ', tickets), setTicketValue(1);

    try {
      if (!canPlaceBet(user.walletTwo.balance, calculateTotalCost())) {
        Toast.show({
          type: 'error',
          text1: 'Insufficent Balance',
          text2: 'Add balance to play',
        });
        return;
      }
      const myticket = processTicketData(tickets, TICKET_COST);
      console.log('Mine ticket');
      console.log(myticket);
      const body = {
        powertime: powertime._id,
        powerdate: todayPowerDate._id,
        gameType: 'powerball',
        tickets: myticket,
      };

      const res = await createPowerballBet({
        accesstoken,
        body,
      }).unwrap();

      console.log(JSON.stringify(res));

      Toast.show({
        type: 'success',
        text1: res.message,
      });
      dispatch(resetTickets());
      // setActiveBallIndex(0);
      // setActiveTicketIndex(0);
      // setTickets([
      //   {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
      // ]);
      dispatch(loadProfile(accesstoken));
      setSubmitLoader(false);
      setShowAllSeclectedBalls(false);
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    }
  };

  const navigationBackHandler = () => {
    if (showAllSeclectedBalls === true) {
      setShowAllSeclectedBalls(false);
      console.log('working if');
    } else {
      navigation.goBack();
      console.log('working else');
    }
    // setShowAllSeclectedBalls(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="height"
        keyboardVerticalOffset={-130}>
        <Background
          fromScreen={'powerball'}
          backcase={'powerball'}
          navigationBackHandler={navigationBackHandler}
        />

        {/** Main Cointainer */}

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <GradientText
            style={{
              ...styles.textStyle,
              paddingLeft: heightPercentageToDP(2),
            }}>
            {powerball?.name}
          </GradientText>
          <ImageBackground
            source={require('../../../assets/image/tlwbg.jpg')}
            style={{
              width: '100%',
              height: heightPercentageToDP(85),
            }}
            imageStyle={{
              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
            }}>
            <View
              style={{
                height: heightPercentageToDP(85),
                width: widthPercentageToDP(100),
                borderTopLeftRadius: heightPercentageToDP(5),
                borderTopRightRadius: heightPercentageToDP(5),
              }}>
              {/** Top Style View */}
              <View
                style={{
                  height: heightPercentageToDP(5),
                  width: widthPercentageToDP(100),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: heightPercentageToDP(3),
                }}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_SemiBold,
                    color: COLORS.white_s,
                    fontSize: heightPercentageToDP(2),
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}>
                  {getDateTimeAccordingToUserTimezone(
                    powertime?.powertime,
                    todayPowerDate?.powerdate,
                    user?.country?.timezone,
                  )}
                </Text>
                <View
                  style={{
                    width: widthPercentageToDP(20),
                    height: heightPercentageToDP(0.8),
                    backgroundColor: COLORS.grayBg,
                    borderRadius: heightPercentageToDP(2),
                  }}></View>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_SemiBold,
                    color: COLORS.white_s,
                    fontSize: heightPercentageToDP(2),
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}>
                  {getTimeAccordingToTimezone(
                    powertime?.powertime,
                    user?.country?.timezone,
                  )}
                </Text>
              </View>

              {/** ALL TICKET BUYING Container */}

              {powerballIsLoading || powerballDatesIsLoading ? (
                <Loading />
              ) : (
                <>
                  {!showAllSeclectedBalls && (
                    <View
                      style={{
                        flex: 1,
                        padding: heightPercentageToDP(1),
                      }}>
                      {/* ADD TICKETS */}
                      <View
                        style={{
                          height: heightPercentageToDP(7),
                          flexDirection: 'row',
                        }}>
                        {/** MINUS BUTTON */}
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_Bold,
                              fontSize: heightPercentageToDP(2),
                              color: COLORS.white_s,
                            }}
                            numberOfLines={2}>
                            Add Ticket
                          </Text>
                        </View>
                        {/* TOTAL NUMBER OF TICKET INPUT */}
                        <View
                          style={{
                            flex: 2,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: heightPercentageToDP(1),
                          }}>
                          {/* Minus Button */}
                          <TouchableOpacity
                            onPress={removeTicket}
                            disabled={tickets.length === 1}>
                            <AntDesign
                              name={'minuscircleo'}
                              size={heightPercentageToDP(3)}
                              color={COLORS.white_s}
                              style={styles.icon}
                            />
                          </TouchableOpacity>

                          {/* TextInput to show the ticket value */}
                          <TextInput
                            // Convert to string for TextInput
                            style={styles.ticketInput}
                            keyboardType="numeric"
                            placeholderTextColor={COLORS.black}
                            placeholder={`${tickets.length}`}
                            onSubmitEditing={e =>
                              addMultipleTickets(e.nativeEvent.text)
                            }
                          />

                          {/* <Text style={styles.ticketCount}>{tickets.length}</Text> */}

                          {/* Plus Button */}
                          <TouchableOpacity onPress={addTicket}>
                            <AntDesign
                              name={'pluscircleo'}
                              size={heightPercentageToDP(3)}
                              color={COLORS.white_s}
                              style={styles.icon}
                            />
                          </TouchableOpacity>
                        </View>
                        {/** ADD BUTTON */}
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={generateUniqueRandomNumbers}>
                            <LinearGradient
                              colors={[COLORS.green, COLORS.blue]}
                              start={{x: 0, y: 0}} // start from left
                              end={{x: 3, y: 0}} // end at right
                              style={{
                                padding: heightPercentageToDP(1),
                                borderRadius: heightPercentageToDP(1),
                              }}>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_SemiBold,
                                  fontSize: heightPercentageToDP(1.4),
                                  color: COLORS.white_s,
                                  textAlign: 'center',
                                }}>
                                Auto Generate
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/** HORIZONTAL TICKETS DETAILS */}

                      {!showMultipliers && (
                        <View
                          style={{
                            paddingVertical: heightPercentageToDP(1),
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_Bold,
                              fontSize: heightPercentageToDP(2),
                              color: COLORS.white_s,
                              paddingBottom: heightPercentageToDP(1),
                            }}
                            numberOfLines={2}>
                            Choose 6 Unique Tickets
                          </Text>

                          {/* <LinearGradient
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                        start={{x: 0, y: 0}} // start from left
                        end={{x: 1, y: 0}} // end at right
                        style={styles.paymentOption}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{
                            gap: heightPercentageToDP(1),
                          }}>
                          {ballNumbers.map(num => {
                            return (
                              <GradientCircle
                                key={num}
                                value={num}
                                style={[
                                  styles.ball,
                                  tickets.some(ticket =>
                                    ticket.selectedNumbers.includes(num),
                                  ) && styles.selectedBallGlobal,
                                ]}
                                onPress={() => handleNumberSelect(num)}
                              />
                            );
                          })}
                        </ScrollView>
                      </LinearGradient> */}

                          <LinearGradient
                            colors={[
                              COLORS.time_firstblue,
                              COLORS.time_secondbluw,
                            ]}
                            start={{x: 0, y: 0}} // Start from left
                            end={{x: 1, y: 0}} // End at right
                            style={styles.paymentOption}>
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}>
                              {ballNumbers.map(num => {
                                // Check if the number is selected
                                // const isSelected = tickets.some(ticket =>
                                //   ticket.selectedNumbers.includes(num),
                                // );
                                const isSelected =
                                  tickets[
                                    activeTicketIndex
                                  ].selectedNumbers.includes(num);
                                return (
                                  <WhiteBall
                                    key={num}
                                    num={num}
                                    isSelected={isSelected}
                                    onPress={() => handleNumberSelect(num)}
                                  />
                                );
                              })}
                            </ScrollView>
                          </LinearGradient>
                        </View>
                      )}

                      {/* Multiplier Selector */}
                      {showMultipliers && (
                        <View
                          style={{
                            paddingVertical: heightPercentageToDP(1),
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_Bold,
                              fontSize: heightPercentageToDP(2),
                              color: COLORS.white_s,
                              paddingBottom: heightPercentageToDP(1),
                            }}
                            numberOfLines={2}>
                            Choose Multiplier
                          </Text>
                          <LinearGradient
                            colors={[
                              COLORS.time_firstblue,
                              COLORS.time_secondbluw,
                            ]}
                            start={{x: 0, y: 0}} // Start from left
                            end={{x: 1, y: 0}} // End at right
                            style={styles.paymentOption}>
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}>
                              {MULTIPLIERS.map(multiplier => (
                                <TouchableOpacity
                                  key={multiplier}
                                  style={[styles.ball, styles.multiplierBall]}
                                  onPress={() =>
                                    handleMultiplierSelect(multiplier)
                                  }>
                                  <GreenBall
                                    key={multiplier}
                                    value={multiplier || ''}
                                    firstcolor={COLORS.firstred}
                                    secondcolor={COLORS.secondred}
                                  />
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </LinearGradient>
                        </View>
                      )}

                      {/** SELECTED TICKETS */}

                      <LinearGradient
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                        start={{x: 0, y: 0}} // start from left
                        end={{x: 1, y: 0}} // end at right
                        style={styles.ticketOption}>
                        <View
                          style={{
                            height: heightPercentageToDP(5),
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_Bold,
                              fontSize: heightPercentageToDP(2),
                              color: COLORS.white_s,
                              paddingBottom: heightPercentageToDP(1),
                            }}
                            numberOfLines={2}>
                            Tickets
                          </Text>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_Bold,
                              fontSize: heightPercentageToDP(2),
                              color: COLORS.white_s,
                              paddingBottom: heightPercentageToDP(1),
                            }}
                            numberOfLines={2}>
                            Multiplier
                          </Text>
                        </View>
                        {/** Tickets container */}
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                          }}>
                          <ScrollView style={styles.scrollView}>
                            {tickets.map((ticket, ticketIndex) => (
                              <View
                                key={ticketIndex}
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  flexDirection: 'row',
                                  marginTop: heightPercentageToDP(1),
                                }}>
                                <View
                                  style={{
                                    flex: 4,
                                    flexDirection: 'row',
                                    gap: heightPercentageToDP(0.5),
                                    flexWrap: 'wrap',
                                    paddingBottom: heightPercentageToDP(1),
                                    borderBottomColor: COLORS.white_s,
                                    borderBottomWidth: 1,
                                  }}>
                                  {ticket.selectedNumbers.map((num, index) => (
                                    <TouchableOpacity
                                      key={index}
                                      onPress={() => {
                                        dispatch(
                                          setYellowBallClick({
                                            ticketIndex,
                                            ballIndex: index,
                                          }),
                                        );
                                        if (num !== null) {
                                          dispatch(
                                            handleNumberSelectR({
                                              number: num,
                                              ticketIndex: ticketIndex,
                                            }),
                                          );
                                        }
                                      }}>
                                      <LinearGradient
                                        colors={[COLORS.green, COLORS.green]}
                                        start={{x: 1, y: 0}}
                                        end={{x: 0, y: 1}}
                                        style={[
                                          styles.whiteBall,
                                          {
                                            width: heightPercentageToDP(5),
                                            height: heightPercentageToDP(5),
                                            borderRadius:
                                              heightPercentageToDP(5) / 2,
                                            borderWidth: 0.5, // Adjust the border thickness as needed
                                            borderBottomColor: 'transparent', // Remove border from other sides
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          },
                                          activeTicketIndex === ticketIndex &&
                                            index === activeBallIndex &&
                                            styles.activeBall,
                                          num !== null && styles.selectedBall,
                                        ]}>
                                        {/* Inner LinearGradient */}
                                        <LinearGradient
                                          colors={[COLORS.green, COLORS.green]}
                                          start={{x: 0.5, y: 0}} // Middle of the top
                                          end={{x: 0.5, y: 1}} // Middle of the bottom
                                          style={{
                                            width: '100%', // Slightly smaller than the wrapper to accommodate the border
                                            height: '98%',
                                            borderRadius:
                                              heightPercentageToDP(5) / 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          }}>
                                          <Text style={styles.semibold}>
                                            {num}
                                          </Text>
                                        </LinearGradient>
                                      </LinearGradient>
                                    </TouchableOpacity>
                                  ))}
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: heightPercentageToDP(1),
                                  }}>
                                  <TouchableOpacity
                                    style={[
                                      styles.ball,

                                      ticket.multiplier &&
                                        styles.selectedRedBall,
                                    ]}
                                    onPress={() => {
                                      dispatch(setYellowBall(ticketIndex));
                                      setShowMultipliers(true);
                                    }}>
                                    <GreenBall
                                      key={ticket.multiplier}
                                      value={ticket.multiplier || ''}
                                      firstcolor={COLORS.firstred}
                                      secondcolor={COLORS.secondred}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))}
                          </ScrollView>
                        </View>
                      </LinearGradient>

                      {/* Total Cost */}
                      <View style={styles.totalCostContainer}>
                        <Text style={styles.totalCostText}>Total Cost:</Text>
                        <Text style={styles.totalCostText}>
                          {calculateTotalCost()}
                        </Text>
                      </View>

                      {/* Submit Button */}
                      <TouchableOpacity
                        style={[
                          styles.submitButton,
                          isSubmitEnabled && styles.submitEnabled,
                        ]}
                        disabled={!isSubmitEnabled}
                        onPress={() => sebmittingNext()}>
                        <Text style={styles.submitText}>Next</Text>
                      </TouchableOpacity>

                      {/** end */}
                    </View>
                  )}
                </>
              )}

              {/** ALL SELECTED NUMBERS */}

              {showAllSeclectedBalls && (
                <View
                  style={{
                    flex: 1,
                    padding: heightPercentageToDP(1),
                  }}>
                  {/* TOTAL NUMBER OF TICKETS */}
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    {/** MINUS BUTTON */}
                    <View
                      style={{
                        flex: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingEnd: heightPercentageToDP(2),
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Bold,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.white_s,
                        }}
                        numberOfLines={1}>
                        Total Number of Tickets
                      </Text>
                      <Text style={styles.ticketCount}>{tickets.length}</Text>
                    </View>
                  </View>

                  {/** TICKETS CONTAINER */}
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <ScrollView style={styles.scrollView}>
                      {tickets.map((ticket, ticketIndex) => (
                        <LinearGradient
                          key={ticketIndex}
                          colors={[
                            COLORS.time_firstblue,
                            COLORS.time_secondbluw,
                          ]}
                          start={{x: 0, y: 0}} // start from left
                          end={{x: 1, y: 0}} // end at right
                          style={styles.confirmTicketContainer}>
                          <View
                            style={{
                              flex: 3.5,
                            }}>
                            <View
                              style={{
                                flex: 1,

                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: heightPercentageToDP(0.5),
                              }}>
                              {ticket.selectedNumbers.map((num, index) => (
                                <SmallWhiteBall index={index} value={num} />
                              ))}
                            </View>
                            <View
                              style={{
                                borderWidth: 0.8,
                                borderColor: COLORS.white_s,
                                borderStyle: 'dashed',
                                marginHorizontal: heightPercentageToDP(3),
                                marginTop: heightPercentageToDP(1),
                              }}
                            />
                            <View
                              style={{
                                flex: 1,

                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flexWrap: 'wrap',
                                  justifyContent: 'center', // Centers items horizontally within the row
                                  alignItems: 'center', // Aligns items vertically within the row
                                  gap: heightPercentageToDP(1),
                                }}>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: FONT.Montserrat_Bold,
                                    fontSize: heightPercentageToDP(2),
                                  }}
                                  adjustsFontSizeToFit={true}
                                  numberOfLines={1}>
                                  TICKET {ticketIndex + 1}
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: FONT.Montserrat_Regular,
                                    fontSize: heightPercentageToDP(2),
                                  }}>
                                  {getTimeAccordingToTimezone(
                                    powertime?.powertime,
                                    user?.country?.timezone,
                                  )}
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: FONT.Montserrat_Regular,
                                    fontSize: heightPercentageToDP(2),
                                  }}>
                                  {getDateTimeAccordingToUserTimezone(
                                    powertime?.powertime,
                                    todayPowerDate?.powerdate,
                                    user?.country?.timezone,
                                  )}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              borderWidth: 0.8,
                              borderColor: COLORS.white_s,
                              borderStyle: 'dashed',
                            }}
                          />

                          <View
                            style={{
                              flex: 1,
                            }}>
                            <View
                              style={{
                                flex: 1,

                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <GreenBall
                                key={ticket.multiplier}
                                value={ticket.multiplier || ''}
                                firstcolor={COLORS.firstred}
                                secondcolor={COLORS.secondred}
                              />
                            </View>
                            <View
                              style={{
                                flex: 1,

                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flexWrap: 'wrap',
                                  justifyContent: 'center', // Centers items horizontally within the row
                                  alignItems: 'center', // Aligns items vertically within the row
                                  gap: heightPercentageToDP(0.2),
                                }}>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: FONT.Montserrat_Bold,
                                    fontSize: heightPercentageToDP(2),
                                  }}
                                  adjustsFontSizeToFit={true}
                                  numberOfLines={1}>
                                  {calculateTicketPrice(ticket)}
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: FONT.Montserrat_Bold,
                                    fontSize: heightPercentageToDP(1),
                                    textAlignVertical: 'bottom',
                                  }}>
                                  {user.country.countrycurrencysymbol}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </LinearGradient>
                      ))}
                    </ScrollView>
                  </View>

                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={[styles.ticketOption, {display: 'none'}]}>
                    <View
                      style={{
                        height: heightPercentageToDP(5),
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Bold,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.white_s,
                          paddingBottom: heightPercentageToDP(1),
                        }}
                        numberOfLines={2}>
                        Tickets
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Bold,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.white_s,
                          paddingBottom: heightPercentageToDP(1),
                        }}
                        numberOfLines={2}>
                        Multiplier
                      </Text>
                    </View>
                    {/** Tickets container */}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                      }}>
                      <ScrollView style={styles.scrollView}>
                        {tickets.map((ticket, ticketIndex) => (
                          <View
                            key={ticketIndex}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              flexDirection: 'row',
                              marginTop: heightPercentageToDP(1),
                            }}>
                            <View
                              style={{
                                flex: 4,
                                flexDirection: 'row',
                                gap: heightPercentageToDP(0.5),
                                flexWrap: 'wrap',
                                paddingBottom: heightPercentageToDP(1),
                                borderBottomColor: COLORS.white_s,
                                borderBottomWidth: 1,
                              }}>
                              {ticket.selectedNumbers.map((num, index) => (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => {
                                    dispatch(
                                      setYellowBallClick({
                                        ticketIndex,
                                        ballIndex: index,
                                      }),
                                    );
                                    if (num !== null) {
                                      dispatch(
                                        handleNumberSelectR({
                                          number: num,
                                          ticketIndex: ticketIndex,
                                        }),
                                      );
                                    }
                                  }}>
                                  <LinearGradient
                                    colors={[COLORS.green, COLORS.green]}
                                    start={{x: 1, y: 0}}
                                    end={{x: 0, y: 1}}
                                    style={[
                                      styles.whiteBall,
                                      {
                                        width: heightPercentageToDP(5),
                                        height: heightPercentageToDP(5),
                                        borderRadius:
                                          heightPercentageToDP(5) / 2,
                                        borderWidth: 0.5, // Adjust the border thickness as needed
                                        borderBottomColor: 'transparent', // Remove border from other sides
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      },
                                      activeTicketIndex === ticketIndex &&
                                        index === activeBallIndex &&
                                        styles.activeBall,
                                      num !== null && styles.selectedBall,
                                    ]}>
                                    {/* Inner LinearGradient */}
                                    <LinearGradient
                                      colors={[COLORS.green, COLORS.green]}
                                      start={{x: 0.5, y: 0}} // Middle of the top
                                      end={{x: 0.5, y: 1}} // Middle of the bottom
                                      style={{
                                        width: '100%', // Slightly smaller than the wrapper to accommodate the border
                                        height: '98%',
                                        borderRadius:
                                          heightPercentageToDP(5) / 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text style={styles.semibold}>{num}</Text>
                                    </LinearGradient>
                                  </LinearGradient>
                                </TouchableOpacity>
                              ))}
                            </View>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingBottom: heightPercentageToDP(1),
                              }}>
                              <TouchableOpacity
                                style={[
                                  styles.ball,

                                  ticket.multiplier && styles.selectedRedBall,
                                ]}
                                onPress={() => {
                                  setActiveTicketIndex(ticketIndex);
                                  setShowMultipliers(true);
                                }}>
                                <GreenBall
                                  key={ticket.multiplier}
                                  value={ticket.multiplier || ''}
                                  firstcolor={COLORS.firstred}
                                  secondcolor={COLORS.secondred}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </LinearGradient>

                  {/* Total Cost */}
                  <View style={styles.totalCostContainer}>
                    <Text style={styles.totalCostText}>Total Cost:</Text>
                    <Text style={styles.totalCostText}>
                      {calculateTotalCost()}
                    </Text>
                  </View>

                  {/* Submit Button */}
                  {createPowerballBetIsLoading ? (
                    <View
                      style={{
                        height: heightPercentageToDP(7),
                      }}>
                      <Loading />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        isSubmitEnabled && styles.submitEnabled,
                      ]}
                      disabled={!isSubmitEnabled}
                      onPress={submitHandler}>
                      <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                  )}

                  {/** end */}
                </View>
              )}
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PowerballGame;

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
    height: heightPercentageToDP(10),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
    gap: heightPercentageToDP(1),
  },
  ticketOption: {
    flexDirection: 'column',
    height: heightPercentageToDP(40),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
    marginTop: heightPercentageToDP(2),
  },
  confirmTicketContainer: {
    flexDirection: 'row',
    height: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
    marginTop: heightPercentageToDP(2),
  },
  prizeOption: {
    flexDirection: 'column',
    height: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  iconContainer: {
    backgroundColor: COLORS.white_s,
    padding: heightPercentageToDP(1.5),
    borderRadius: heightPercentageToDP(1),
    height: heightPercentageToDP(6),
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
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  semibold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_SemiBold,
  },
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  ticketControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {fontSize: 24, paddingHorizontal: 15},
  ticketInput: {
    width: widthPercentageToDP(22),
    backgroundColor: COLORS.white_s,
    borderRadius: heightPercentageToDP(1),
    padding: heightPercentageToDP(0.5),
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Bold,
  },
  ticketCount: {
    color: COLORS.white_s,
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
  },
  ballContainer: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20},
  ball: {
    width: heightPercentageToDP(6),
    height: heightPercentageToDP(6),
    borderRadius: heightPercentageToDP(6) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballText: {fontSize: 16},
  whiteBall: {backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd'},
  selectedBallGlobal: {
    width: heightPercentageToDP(6),
    height: heightPercentageToDP(6),
    borderRadius: heightPercentageToDP(6) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBall: {
    backgroundColor: COLORS.white_s,
    borderWidth: 1,
    borderColor: COLORS.white_s,
  },
  activeBall: {borderWidth: 2, borderColor: COLORS.yellow},
  numbersContainer: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10},
  ticket: {marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd'},
  ticketTitle: {fontSize: 16, fontWeight: 'bold'},
  activeTicketTitle: {color: COLORS.white_s},
  multiplierContainer: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 10},
  multiplierBall: {margin: 5},
  redBall: {backgroundColor: 'red'},
  autoGenerateButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.blue,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: heightPercentageToDP(1),
  },
  submitEnabled: {
    backgroundColor: COLORS.green,
    borderRadius: heightPercentageToDP(1),
  },
  submitText: {color: '#fff', fontSize: 16},
  totalCostContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCostText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white_s,
    fontFamily: FONT.Montserrat_Bold,
  },

  ball: {
    marginHorizontal: heightPercentageToDP(0.5),
  },
  selectedBallGlobal: {
    borderWidth: 2,
    borderColor: COLORS.selectedBorder,
  },
});

// import {
//   ImageBackground,
//   KeyboardAvoidingView,
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
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Toast from 'react-native-toast-message';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import Background from '../../components/background/Background';
// import {COLORS, FONT} from '../../../assets/constants';
// import GradientText from '../../components/helpercComponent/GradientText';
// import Loading from '../../components/helpercComponent/Loading';
// import GreenBall from '../../components/powerball/GreenBall';
// import WhiteBall from '../../components/powerball/WhiteBall';
// import SmallWhiteBall from '../../components/powerball/SmallWhiteBall';
// import {
//   useCreatePowerballBetMutation,
//   useGetPowerballQuery,
//   useGetPowerDatesByTimeQuery,
// } from '../../helper/Networkcall';
// import moment from 'moment-timezone';
// import {
//   getDateTimeAccordingToUserTimezone,
//   getTimeAccordingToTimezone,
// } from '../SearchTime';

// const getCurrentDateInTimezone = timezone => {
//   return moment().tz(timezone).format('DD-MM-YYYY');
// };

// const getMatchingPowerDate = (currentDate, powerDates) => {
//   return powerDates.find(entry => entry.powerdate === currentDate) || null;
// };

// const generateMultiplierObject = (number, multiplierArray = []) => {
//   if (!Array.isArray(multiplierArray)) {
//     console.error(
//       'Invalid multiplier array. Expected an array but got:',
//       multiplierArray,
//     );
//     return {};
//   }

//   const result = {};

//   multiplierArray.forEach(item => {
//     if (item.value) {
//       const multiplierValue = parseInt(item.value); // Extract number from "2X", "3X", etc.
//       if (!isNaN(multiplierValue)) {
//         result[item.value] = number * multiplierValue;
//       }
//     }
//   });

//   // Add '7X' and 'NA' with default values
//   // result['7X'] = number * 7;
//   result['NA'] = 0;

//   return result;
// };

// const getMultiplierValues = (multiplierArray = []) => {
//   if (!Array.isArray(multiplierArray)) {
//     console.error(
//       'Invalid multiplier array. Expected an array but got:',
//       multiplierArray,
//     );
//     return [];
//   }

//   // Extract values from the array
//   const values = multiplierArray.map(item => item.value);

//   // Append '7X' and 'NA'
//   return [...values, 'NA'];
// };

// const processTicketData = (ticketArray, TICKET_COST) => {
//   if (!Array.isArray(ticketArray) || typeof TICKET_COST !== 'number') {
//     console.error('Invalid input. Expected an array and a number.');
//     return [];
//   }

//   return ticketArray.map(({multiplier, selectedNumbers}) => {
//     // Handle cases where multiplier is "NA" or null
//     const multiplierValue =
//       multiplier && multiplier !== 'NA'
//         ? parseInt(multiplier.replace('X', ''), 10)
//         : 1;

//     return {
//       amount: TICKET_COST * multiplierValue, // Multiply cost with multiplier
//       convertedAmount: TICKET_COST * multiplierValue, // Generate a random converted amount
//       multiplier: multiplierValue, // Store multiplier as a number
//       usernumber: selectedNumbers, // Keep the selected numbers
//     };
//   });
// };

// function canPlaceBet(walletBalanceStr, bettingAmountStr) {
//   const walletBalance = parseFloat(walletBalanceStr);
//   const bettingAmount = parseFloat(bettingAmountStr);

//   if (isNaN(walletBalance) || isNaN(bettingAmount)) {
//     throw new Error('Invalid input: Both inputs must be valid numbers.');
//   }

//   return walletBalance >= bettingAmount;
// }

// const PowerballGame = ({route}) => {
//   const {item: powertime} = route.params;

//   const navigation = useNavigation();
//   const {accesstoken, user} = useSelector(state => state.user);
//   const [todayPowerDate, setTodayPowerDate] = useState(null);
//   // const TOTAL_BALLS = 70; // Total available numbers
//   const MAX_NUMBERS = 6; // Numbers per ticket
//   // const MULTIPLIERS = ['2X', '3X', '4X', '5X', '6X', '7X', 'NA']; // Multiplier options
//   // const TICKET_COST = 100; // Base price per ticket
//   // const MULTIPLIER_COSTS = {
//   //   '2X': 20,
//   //   '3X': 30,
//   //   '4X': 40,
//   //   '5X': 50,
//   //   '6X': 60,
//   //   '7X': 70,
//   //   NA: 0,
//   // };
//   const [TOTAL_BALLS, setTOTAL_BALLS] = useState(null);
//   const [MULTIPLIERS, setMULTIPLIERS] = useState([]);
//   const [TICKET_COST, setTICKET_COST] = useState(null);
//   const [MULTIPLIER_COSTS, setMULTIPLIER_COSTS] = useState({});

//   const [powerball, setPowerball] = useState(null);
//   // Network call
//   const {data: powerballData, isLoading: powerballIsLoading} =
//     useGetPowerballQuery({accesstoken});

//   useEffect(() => {
//     if (!powerballIsLoading && powerballData) {
//       setPowerball(powerballData.games[0]);
//       setTOTAL_BALLS(powerballData.games[0].range.endRange);
//       setTICKET_COST(user?.country?.ticketprice);

//       const multiplierArray = generateMultiplierObject(
//         user?.country?.multiplierprice,
//         powerballData?.games[0].multiplier,
//       );

//       setMULTIPLIER_COSTS(multiplierArray);
//       setMULTIPLIERS(getMultiplierValues(powerballData?.games[0].multiplier));
//     }
//   }, [powerballData, powerballIsLoading]);

//   // [FOR GETTING POWERBALL GAME DATES]
//   const {data: powerballDates, isLoading: powerballDatesIsLoading} =
//     useGetPowerDatesByTimeQuery({
//       accesstoken,
//       id: powertime._id,
//       page: 1,
//       limit: 10,
//     });

//   // [FOR GETTING TODAY POWERBALL DATE]
//   useEffect(() => {
//     if (!powerballDatesIsLoading && powerballDates) {
//       const currentDate = getCurrentDateInTimezone(user?.country?.timezone);
//       const matchingDate = getMatchingPowerDate(
//         currentDate,
//         powerballDates.powerDates,
//       );
//       setTodayPowerDate(matchingDate);
//       console.log(matchingDate);
//     }
//   }, [powerballDatesIsLoading, powerballDates]);

//   const [ticketValue, setTicketValue] = useState(1);

//   // [FOR POWEBALL BET]

//   const [createPowerballBet, {isLoading: createPowerballBetIsLoading}] =
//     useCreatePowerballBetMutation();

//   // Function to increment the ticket value
//   const increment = () => {
//     setTicketValue(ticketValue + 1);
//   };

//   // Function to decrement the ticket value
//   const decrement = () => {
//     if (ticketValue > 1) {
//       setTicketValue(ticketValue - 1); // Prevent going below 1
//     }
//   };

//   const createArray = number => {
//     return Array.from({length: number}, (_, index) => index + 1);
//   };

//   // Example usage:
//   const ballnumbers = createArray(70);

//   // Start from here

//   const [tickets, setTickets] = useState([
//     {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
//   ]);
//   const [activeTicketIndex, setActiveTicketIndex] = useState(0);
//   const [activeBallIndex, setActiveBallIndex] = useState(0);
//   const [showMultipliers, setShowMultipliers] = useState(false);
//   const [showAllSeclectedBalls, setShowAllSeclectedBalls] = useState(false);

//   const ballNumbers = Array.from({length: TOTAL_BALLS}, (_, i) => i + 1);

//   const addTicket = () => {
//     setTickets([
//       ...tickets,
//       {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
//     ]);
//     setActiveTicketIndex(tickets.length);
//     setActiveBallIndex(0);
//   };

//   const addMultipleTickets = value => {
//     const numTickets = parseInt(value, 10);
//     if (!isNaN(numTickets) && numTickets > 0) {
//       const newTickets = Array.from({length: numTickets}, () => ({
//         selectedNumbers: Array(MAX_NUMBERS).fill(null),
//         multiplier: null,
//       }));
//       setTickets([...tickets, ...newTickets]);
//     }
//   };

//   const removeTicket = () => {
//     if (tickets.length > 1) {
//       setTickets(tickets.slice(0, -1));
//       if (activeTicketIndex >= tickets.length - 1) {
//         setActiveTicketIndex(tickets.length - 2);
//       }
//     }
//   };

//   const handleNumberSelect = number => {
//     const currentTicket = tickets[activeTicketIndex];
//     const updatedNumbers = [...currentTicket.selectedNumbers];

//     if (updatedNumbers.includes(number)) {
//       const indexToRemove = updatedNumbers.indexOf(number);
//       updatedNumbers[indexToRemove] = null;
//     } else {
//       updatedNumbers[activeBallIndex] = number;
//     }

//     const updatedTickets = [...tickets];
//     updatedTickets[activeTicketIndex] = {
//       ...currentTicket,
//       selectedNumbers: updatedNumbers,
//     };
//     setTickets(updatedTickets);

//     const nextEmptyIndex = updatedNumbers.indexOf(null);
//     if (nextEmptyIndex !== -1) {
//       setActiveBallIndex(nextEmptyIndex);
//     }
//   };

//   const handleMultiplierSelect = multiplier => {
//     const updatedTickets = [...tickets];
//     updatedTickets[activeTicketIndex].multiplier = multiplier;
//     setTickets(updatedTickets);
//     setShowMultipliers(false); // Hide the multiplier selection after a choice is made
//   };

//   const isSubmitEnabled = tickets.every(ticket =>
//     ticket.selectedNumbers.every(num => num !== null),
//   );

//   const generateUniqueRandomNumbers = () => {
//     let usedNumbers = [];

//     // Reset selected numbers to null first before generating new ones
//     const newTickets = tickets.map(ticket => {
//       let ticketNumbers = Array(MAX_NUMBERS).fill(null); // Reset all numbers

//       // Find empty slots in the current ticket (all should be empty now)
//       const emptyIndexes = ticketNumbers
//         .map((num, index) => (num === null ? index : -1))
//         .filter(index => index !== -1);

//       emptyIndexes.forEach(index => {
//         let randomNum;
//         do {
//           // Generate a random number
//           randomNum =
//             ballNumbers[Math.floor(Math.random() * ballNumbers.length)];

//           // Ensure that the number is unique across all tickets
//         } while (
//           usedNumbers.includes(randomNum) ||
//           ticketNumbers.includes(randomNum)
//         );

//         ticketNumbers[index] = randomNum;
//         usedNumbers.push(randomNum); // Mark this number as used
//       });

//       return {...ticket, selectedNumbers: ticketNumbers};
//     });

//     setTickets(newTickets);
//   };

//   // Function to calculate total cost of all tickets
//   const calculateTotalCost = () => {
//     return tickets.reduce((total, ticket) => {
//       const multiplierCost = ticket.multiplier
//         ? MULTIPLIER_COSTS[ticket.multiplier]
//         : 0;
//       return total + TICKET_COST + multiplierCost;
//     }, 0);
//   };

//   // Function to calculate the price of each individual ticket
//   const calculateTicketPrice = ticket => {
//     const multiplierCost = ticket.multiplier
//       ? MULTIPLIER_COSTS[ticket.multiplier]
//       : 0;
//     return TICKET_COST + multiplierCost;
//   };

//   const sebmittingNext = async () => {
//     console.log('submitting now next stage to confirm ticket');
//     console.log('submited ticket :: ', tickets);
//     setShowAllSeclectedBalls(true);
//   };

//   const [submitLoader, setSubmitLoader] = useState(false);
//   const submitHandler = async () => {
//     // setSubmitLoader(true);
//     console.log('submitting to next stage to confirm ticket');
//     console.log('submited ticket :: ', tickets), setTicketValue(1);

//     try {
//       if (!canPlaceBet(user.walletTwo.balance, calculateTotalCost())) {
//         Toast.show({
//           type: 'error',
//           text1: 'Insufficent Balance',
//           text2: 'Add balance to play',
//         });
//         return;
//       }
//       const myticket = processTicketData(tickets, TICKET_COST);
//       console.log('Mine ticket');
//       console.log(myticket);
//       const body = {
//         powertime: powertime._id,
//         powerdate: todayPowerDate._id,
//         gameType: 'powerball',
//         tickets: myticket,
//       };

//       const res = await createPowerballBet({
//         accesstoken,
//         body,
//       }).unwrap();

//       console.log(JSON.stringify(res));

//       Toast.show({
//         type: 'success',
//         text1: res.message,
//       });
//       setActiveBallIndex(0);
//       setActiveTicketIndex(0);
//       setTickets([
//         {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
//       ]);
//       setSubmitLoader(false);
//       setShowAllSeclectedBalls(false);
//     } catch (e) {
//       console.log(e);
//       Toast.show({
//         type: 'error',
//         text1: 'Something went wrong',
//       });
//     }
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <KeyboardAvoidingView
//         style={{flex: 1}}
//         behavior="height"
//         keyboardVerticalOffset={-130}>
//         <Background />

//         {/** Main Cointainer */}

//         <View style={{flex: 1, justifyContent: 'flex-end'}}>
//           <GradientText
//             style={{
//               ...styles.textStyle,
//               paddingLeft: heightPercentageToDP(2),
//             }}>
//             {powerball?.name}
//           </GradientText>
//           <ImageBackground
//             source={require('../../../assets/image/tlwbg.jpg')}
//             style={{
//               width: '100%',
//               height: heightPercentageToDP(85),
//             }}
//             imageStyle={{
//               borderTopLeftRadius: heightPercentageToDP(5),
//               borderTopRightRadius: heightPercentageToDP(5),
//             }}>
//             <View
//               style={{
//                 height: heightPercentageToDP(85),
//                 width: widthPercentageToDP(100),
//                 borderTopLeftRadius: heightPercentageToDP(5),
//                 borderTopRightRadius: heightPercentageToDP(5),
//               }}>
//               {/** Top Style View */}
//               <View
//                 style={{
//                   height: heightPercentageToDP(5),
//                   width: widthPercentageToDP(100),
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   paddingHorizontal: heightPercentageToDP(3),
//                 }}>
//                 <Text
//                   style={{
//                     fontFamily: FONT.Montserrat_SemiBold,
//                     color: COLORS.white_s,
//                     fontSize: heightPercentageToDP(2),
//                   }}
//                   numberOfLines={1}
//                   adjustsFontSizeToFit={true}>
//                   {getDateTimeAccordingToUserTimezone(
//                     powertime?.powertime,
//                     todayPowerDate?.powerdate,
//                     user?.country?.timezone,
//                   )}
//                 </Text>
//                 <View
//                   style={{
//                     width: widthPercentageToDP(20),
//                     height: heightPercentageToDP(0.8),
//                     backgroundColor: COLORS.grayBg,
//                     borderRadius: heightPercentageToDP(2),
//                   }}></View>
//                 <Text
//                   style={{
//                     fontFamily: FONT.Montserrat_SemiBold,
//                     color: COLORS.white_s,
//                     fontSize: heightPercentageToDP(2),
//                   }}
//                   numberOfLines={1}
//                   adjustsFontSizeToFit={true}>
//                   {getTimeAccordingToTimezone(
//                     powertime?.powertime,
//                     user?.country?.timezone,
//                   )}
//                 </Text>
//               </View>

//               {/** ALL TICKET BUYING Container */}

//               {powerballIsLoading || powerballDatesIsLoading ? (
//                 <Loading />
//               ) : (
//                 <>
//                   {!showAllSeclectedBalls && (
//                     <View
//                       style={{
//                         flex: 1,
//                         padding: heightPercentageToDP(1),
//                       }}>
//                       {/* ADD TICKETS */}
//                       <View
//                         style={{
//                           height: heightPercentageToDP(7),
//                           flexDirection: 'row',
//                         }}>
//                         {/** MINUS BUTTON */}
//                         <View
//                           style={{
//                             flex: 1,
//                             justifyContent: 'center',
//                           }}>
//                           <Text
//                             style={{
//                               fontFamily: FONT.Montserrat_Bold,
//                               fontSize: heightPercentageToDP(2),
//                               color: COLORS.white_s,
//                             }}
//                             numberOfLines={2}>
//                             Add Ticket
//                           </Text>
//                         </View>
//                         {/* TOTAL NUMBER OF TICKET INPUT */}
//                         <View
//                           style={{
//                             flex: 2,
//                             flexDirection: 'row',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             gap: heightPercentageToDP(1),
//                           }}>
//                           {/* Minus Button */}
//                           <TouchableOpacity
//                             onPress={removeTicket}
//                             disabled={tickets.length === 1}>
//                             <AntDesign
//                               name={'minuscircleo'}
//                               size={heightPercentageToDP(3)}
//                               color={COLORS.white_s}
//                               style={styles.icon}
//                             />
//                           </TouchableOpacity>

//                           {/* TextInput to show the ticket value */}
//                           <TextInput
//                             // Convert to string for TextInput
//                             style={styles.ticketInput}
//                             keyboardType="numeric"
//                             placeholder="Ticket"
//                             onSubmitEditing={e =>
//                               addMultipleTickets(e.nativeEvent.text)
//                             }
//                           />

//                           {/* <Text style={styles.ticketCount}>{tickets.length}</Text> */}

//                           {/* Plus Button */}
//                           <TouchableOpacity onPress={addTicket}>
//                             <AntDesign
//                               name={'pluscircleo'}
//                               size={heightPercentageToDP(3)}
//                               color={COLORS.white_s}
//                               style={styles.icon}
//                             />
//                           </TouchableOpacity>
//                         </View>
//                         {/** ADD BUTTON */}
//                         <View
//                           style={{
//                             flex: 1,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}>
//                           <TouchableOpacity
//                             onPress={generateUniqueRandomNumbers}>
//                             <LinearGradient
//                               colors={[COLORS.green, COLORS.blue]}
//                               start={{x: 0, y: 0}} // start from left
//                               end={{x: 3, y: 0}} // end at right
//                               style={{
//                                 padding: heightPercentageToDP(1),
//                                 borderRadius: heightPercentageToDP(1),
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_SemiBold,
//                                   fontSize: heightPercentageToDP(1.4),
//                                   color: COLORS.white_s,
//                                   textAlign: 'center',
//                                 }}>
//                                 Auto Generate
//                               </Text>
//                             </LinearGradient>
//                           </TouchableOpacity>
//                         </View>
//                       </View>

//                       {/** HORIZONTAL TICKETS DETAILS */}

//                       {!showMultipliers && (
//                         <View
//                           style={{
//                             paddingVertical: heightPercentageToDP(1),
//                           }}>
//                           <Text
//                             style={{
//                               fontFamily: FONT.Montserrat_Bold,
//                               fontSize: heightPercentageToDP(2),
//                               color: COLORS.white_s,
//                               paddingBottom: heightPercentageToDP(1),
//                             }}
//                             numberOfLines={2}>
//                             Choose 6 Unique Tickets
//                           </Text>

//                           {/* <LinearGradient
//                         colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                         start={{x: 0, y: 0}} // start from left
//                         end={{x: 1, y: 0}} // end at right
//                         style={styles.paymentOption}>
//                         <ScrollView
//                           horizontal={true}
//                           showsHorizontalScrollIndicator={false}
//                           contentContainerStyle={{
//                             gap: heightPercentageToDP(1),
//                           }}>
//                           {ballNumbers.map(num => {
//                             return (
//                               <GradientCircle
//                                 key={num}
//                                 value={num}
//                                 style={[
//                                   styles.ball,
//                                   tickets.some(ticket =>
//                                     ticket.selectedNumbers.includes(num),
//                                   ) && styles.selectedBallGlobal,
//                                 ]}
//                                 onPress={() => handleNumberSelect(num)}
//                               />
//                             );
//                           })}
//                         </ScrollView>
//                       </LinearGradient> */}

//                           <LinearGradient
//                             colors={[
//                               COLORS.time_firstblue,
//                               COLORS.time_secondbluw,
//                             ]}
//                             start={{x: 0, y: 0}} // Start from left
//                             end={{x: 1, y: 0}} // End at right
//                             style={styles.paymentOption}>
//                             <ScrollView
//                               horizontal={true}
//                               showsHorizontalScrollIndicator={false}>
//                               {ballNumbers.map(num => {
//                                 // Check if the number is selected
//                                 const isSelected = tickets.some(ticket =>
//                                   ticket.selectedNumbers.includes(num),
//                                 );
//                                 return (
//                                   <WhiteBall
//                                     key={num}
//                                     num={num}
//                                     isSelected={isSelected}
//                                     onPress={() => handleNumberSelect(num)}
//                                   />
//                                 );
//                               })}
//                             </ScrollView>
//                           </LinearGradient>
//                         </View>
//                       )}

//                       {/* Multiplier Selector */}
//                       {showMultipliers && (
//                         <View
//                           style={{
//                             paddingVertical: heightPercentageToDP(1),
//                           }}>
//                           <Text
//                             style={{
//                               fontFamily: FONT.Montserrat_Bold,
//                               fontSize: heightPercentageToDP(2),
//                               color: COLORS.white_s,
//                               paddingBottom: heightPercentageToDP(1),
//                             }}
//                             numberOfLines={2}>
//                             Choose Multiplier
//                           </Text>
//                           <LinearGradient
//                             colors={[
//                               COLORS.time_firstblue,
//                               COLORS.time_secondbluw,
//                             ]}
//                             start={{x: 0, y: 0}} // Start from left
//                             end={{x: 1, y: 0}} // End at right
//                             style={styles.paymentOption}>
//                             <ScrollView
//                               horizontal={true}
//                               showsHorizontalScrollIndicator={false}>
//                               {MULTIPLIERS.map(multiplier => (
//                                 <TouchableOpacity
//                                   key={multiplier}
//                                   style={[styles.ball, styles.multiplierBall]}
//                                   onPress={() =>
//                                     handleMultiplierSelect(multiplier)
//                                   }>
//                                   <GreenBall
//                                     key={multiplier}
//                                     value={multiplier || ''}
//                                     firstcolor={COLORS.firstred}
//                                     secondcolor={COLORS.secondred}
//                                   />
//                                 </TouchableOpacity>
//                               ))}
//                             </ScrollView>
//                           </LinearGradient>
//                         </View>
//                       )}

//                       {/** SELECTED TICKETS */}

//                       <LinearGradient
//                         colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                         start={{x: 0, y: 0}} // start from left
//                         end={{x: 1, y: 0}} // end at right
//                         style={styles.ticketOption}>
//                         <View
//                           style={{
//                             height: heightPercentageToDP(5),
//                             width: '100%',
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                           }}>
//                           <Text
//                             style={{
//                               fontFamily: FONT.Montserrat_Bold,
//                               fontSize: heightPercentageToDP(2),
//                               color: COLORS.white_s,
//                               paddingBottom: heightPercentageToDP(1),
//                             }}
//                             numberOfLines={2}>
//                             Tickets
//                           </Text>
//                           <Text
//                             style={{
//                               fontFamily: FONT.Montserrat_Bold,
//                               fontSize: heightPercentageToDP(2),
//                               color: COLORS.white_s,
//                               paddingBottom: heightPercentageToDP(1),
//                             }}
//                             numberOfLines={2}>
//                             Multiplier
//                           </Text>
//                         </View>
//                         {/** Tickets container */}
//                         <View
//                           style={{
//                             flex: 1,
//                             flexDirection: 'column',
//                           }}>
//                           <ScrollView style={styles.scrollView}>
//                             {tickets.map((ticket, ticketIndex) => (
//                               <View
//                                 key={ticketIndex}
//                                 style={{
//                                   justifyContent: 'center',
//                                   alignItems: 'flex-start',
//                                   flexDirection: 'row',
//                                   marginTop: heightPercentageToDP(1),
//                                 }}>
//                                 <View
//                                   style={{
//                                     flex: 4,
//                                     flexDirection: 'row',
//                                     gap: heightPercentageToDP(0.5),
//                                     flexWrap: 'wrap',
//                                     paddingBottom: heightPercentageToDP(1),
//                                     borderBottomColor: COLORS.white_s,
//                                     borderBottomWidth: 1,
//                                   }}>
//                                   {ticket.selectedNumbers.map((num, index) => (
//                                     <TouchableOpacity
//                                       key={index}
//                                       onPress={() => {
//                                         if (num !== null) {
//                                           handleNumberSelect(num);
//                                         }
//                                         setActiveTicketIndex(ticketIndex);
//                                         setActiveBallIndex(index);
//                                       }}>
//                                       <LinearGradient
//                                         colors={[COLORS.green, COLORS.green]}
//                                         start={{x: 1, y: 0}}
//                                         end={{x: 0, y: 1}}
//                                         style={[
//                                           styles.whiteBall,
//                                           {
//                                             width: heightPercentageToDP(5),
//                                             height: heightPercentageToDP(5),
//                                             borderRadius:
//                                               heightPercentageToDP(5) / 2,
//                                             borderWidth: 0.5, // Adjust the border thickness as needed
//                                             borderBottomColor: 'transparent', // Remove border from other sides
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                           },
//                                           activeTicketIndex === ticketIndex &&
//                                             index === activeBallIndex &&
//                                             styles.activeBall,
//                                           num !== null && styles.selectedBall,
//                                         ]}>
//                                         {/* Inner LinearGradient */}
//                                         <LinearGradient
//                                           colors={[COLORS.green, COLORS.green]}
//                                           start={{x: 0.5, y: 0}} // Middle of the top
//                                           end={{x: 0.5, y: 1}} // Middle of the bottom
//                                           style={{
//                                             width: '100%', // Slightly smaller than the wrapper to accommodate the border
//                                             height: '98%',
//                                             borderRadius:
//                                               heightPercentageToDP(5) / 2,
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                           }}>
//                                           <Text style={styles.semibold}>
//                                             {num}
//                                           </Text>
//                                         </LinearGradient>
//                                       </LinearGradient>
//                                     </TouchableOpacity>
//                                   ))}
//                                 </View>
//                                 <View
//                                   style={{
//                                     flex: 1,
//                                     justifyContent: 'center',
//                                     alignItems: 'center',
//                                     paddingBottom: heightPercentageToDP(1),
//                                   }}>
//                                   <TouchableOpacity
//                                     style={[
//                                       styles.ball,

//                                       ticket.multiplier &&
//                                         styles.selectedRedBall,
//                                     ]}
//                                     onPress={() => {
//                                       setActiveTicketIndex(ticketIndex);
//                                       setShowMultipliers(true);
//                                     }}>
//                                     <GreenBall
//                                       key={ticket.multiplier}
//                                       value={ticket.multiplier || ''}
//                                       firstcolor={COLORS.firstred}
//                                       secondcolor={COLORS.secondred}
//                                     />
//                                   </TouchableOpacity>
//                                 </View>
//                               </View>
//                             ))}
//                           </ScrollView>
//                         </View>
//                       </LinearGradient>

//                       {/* Total Cost */}
//                       <View style={styles.totalCostContainer}>
//                         <Text style={styles.totalCostText}>Total Cost:</Text>
//                         <Text style={styles.totalCostText}>
//                           {calculateTotalCost()}
//                         </Text>
//                       </View>

//                       {/* Submit Button */}
//                       <TouchableOpacity
//                         style={[
//                           styles.submitButton,
//                           isSubmitEnabled && styles.submitEnabled,
//                         ]}
//                         disabled={!isSubmitEnabled}
//                         onPress={() => sebmittingNext()}>
//                         <Text style={styles.submitText}>Next</Text>
//                       </TouchableOpacity>

//                       {/** end */}
//                     </View>
//                   )}
//                 </>
//               )}

//               {/** ALL SELECTED NUMBERS */}

//               {showAllSeclectedBalls && (
//                 <View
//                   style={{
//                     flex: 1,
//                     padding: heightPercentageToDP(1),
//                   }}>
//                   {/* TOTAL NUMBER OF TICKETS */}
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                     }}>
//                     {/** MINUS BUTTON */}
//                     <View
//                       style={{
//                         flex: 2,
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         flexDirection: 'row',
//                         paddingEnd: heightPercentageToDP(2),
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(2),
//                           color: COLORS.white_s,
//                         }}
//                         numberOfLines={1}>
//                         Total Number of Tickets
//                       </Text>
//                       <Text style={styles.ticketCount}>{tickets.length}</Text>
//                     </View>
//                   </View>

//                   {/** TICKETS CONTAINER */}
//                   <View
//                     style={{
//                       flex: 1,
//                     }}>
//                     <ScrollView style={styles.scrollView}>
//                       {tickets.map((ticket, ticketIndex) => (
//                         <LinearGradient
//                           key={ticketIndex}
//                           colors={[
//                             COLORS.time_firstblue,
//                             COLORS.time_secondbluw,
//                           ]}
//                           start={{x: 0, y: 0}} // start from left
//                           end={{x: 1, y: 0}} // end at right
//                           style={styles.confirmTicketContainer}>
//                           <View
//                             style={{
//                               flex: 3.5,
//                             }}>
//                             <View
//                               style={{
//                                 flex: 1,

//                                 flexDirection: 'row',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 gap: heightPercentageToDP(0.5),
//                               }}>
//                               {ticket.selectedNumbers.map((num, index) => (
//                                 <SmallWhiteBall index={index} value={num} />
//                               ))}
//                             </View>
//                             <View
//                               style={{
//                                 borderWidth: 0.8,
//                                 borderColor: COLORS.white_s,
//                                 borderStyle: 'dashed',
//                                 marginHorizontal: heightPercentageToDP(3),
//                                 marginTop: heightPercentageToDP(1),
//                               }}
//                             />
//                             <View
//                               style={{
//                                 flex: 1,

//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                               }}>
//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   flexWrap: 'wrap',
//                                   justifyContent: 'center', // Centers items horizontally within the row
//                                   alignItems: 'center', // Aligns items vertically within the row
//                                   gap: heightPercentageToDP(1),
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Bold,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}
//                                   adjustsFontSizeToFit={true}
//                                   numberOfLines={1}>
//                                   TICKET {ticketIndex + 1}
//                                 </Text>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   {getTimeAccordingToTimezone(
//                                     powertime?.powertime,
//                                     user?.country?.timezone,
//                                   )}
//                                 </Text>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   {getDateTimeAccordingToUserTimezone(
//                                     powertime?.powertime,
//                                     todayPowerDate?.powerdate,
//                                     user?.country?.timezone,
//                                   )}
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>
//                           <View
//                             style={{
//                               borderWidth: 0.8,
//                               borderColor: COLORS.white_s,
//                               borderStyle: 'dashed',
//                             }}
//                           />

//                           <View
//                             style={{
//                               flex: 1,
//                             }}>
//                             <View
//                               style={{
//                                 flex: 1,

//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                               }}>
//                               <GreenBall
//                                 key={ticket.multiplier}
//                                 value={ticket.multiplier || ''}
//                                 firstcolor={COLORS.firstred}
//                                 secondcolor={COLORS.secondred}
//                               />
//                             </View>
//                             <View
//                               style={{
//                                 flex: 1,

//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                               }}>
//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   flexWrap: 'wrap',
//                                   justifyContent: 'center', // Centers items horizontally within the row
//                                   alignItems: 'center', // Aligns items vertically within the row
//                                   gap: heightPercentageToDP(0.2),
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Bold,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}
//                                   adjustsFontSizeToFit={true}
//                                   numberOfLines={1}>
//                                   {calculateTicketPrice(ticket)}
//                                 </Text>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Bold,
//                                     fontSize: heightPercentageToDP(1),
//                                     textAlignVertical: 'bottom',
//                                   }}>
//                                   {user.country.countrycurrencysymbol}
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>
//                         </LinearGradient>
//                       ))}
//                     </ScrollView>
//                   </View>

//                   <LinearGradient
//                     colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                     start={{x: 0, y: 0}} // start from left
//                     end={{x: 1, y: 0}} // end at right
//                     style={[styles.ticketOption, {display: 'none'}]}>
//                     <View
//                       style={{
//                         height: heightPercentageToDP(5),
//                         width: '100%',
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(2),
//                           color: COLORS.white_s,
//                           paddingBottom: heightPercentageToDP(1),
//                         }}
//                         numberOfLines={2}>
//                         Tickets
//                       </Text>
//                       <Text
//                         style={{
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(2),
//                           color: COLORS.white_s,
//                           paddingBottom: heightPercentageToDP(1),
//                         }}
//                         numberOfLines={2}>
//                         Multiplier
//                       </Text>
//                     </View>
//                     {/** Tickets container */}
//                     <View
//                       style={{
//                         flex: 1,
//                         flexDirection: 'column',
//                       }}>
//                       <ScrollView style={styles.scrollView}>
//                         {tickets.map((ticket, ticketIndex) => (
//                           <View
//                             key={ticketIndex}
//                             style={{
//                               justifyContent: 'center',
//                               alignItems: 'flex-start',
//                               flexDirection: 'row',
//                               marginTop: heightPercentageToDP(1),
//                             }}>
//                             <View
//                               style={{
//                                 flex: 4,
//                                 flexDirection: 'row',
//                                 gap: heightPercentageToDP(0.5),
//                                 flexWrap: 'wrap',
//                                 paddingBottom: heightPercentageToDP(1),
//                                 borderBottomColor: COLORS.white_s,
//                                 borderBottomWidth: 1,
//                               }}>
//                               {ticket.selectedNumbers.map((num, index) => (
//                                 <TouchableOpacity
//                                   key={index}
//                                   onPress={() => {
//                                     if (num !== null) {
//                                       handleNumberSelect(num);
//                                     }
//                                     setActiveTicketIndex(ticketIndex);
//                                     setActiveBallIndex(index);
//                                   }}>
//                                   <LinearGradient
//                                     colors={[COLORS.green, COLORS.green]}
//                                     start={{x: 1, y: 0}}
//                                     end={{x: 0, y: 1}}
//                                     style={[
//                                       styles.whiteBall,
//                                       {
//                                         width: heightPercentageToDP(5),
//                                         height: heightPercentageToDP(5),
//                                         borderRadius:
//                                           heightPercentageToDP(5) / 2,
//                                         borderWidth: 0.5, // Adjust the border thickness as needed
//                                         borderBottomColor: 'transparent', // Remove border from other sides
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                       },
//                                       activeTicketIndex === ticketIndex &&
//                                         index === activeBallIndex &&
//                                         styles.activeBall,
//                                       num !== null && styles.selectedBall,
//                                     ]}>
//                                     {/* Inner LinearGradient */}
//                                     <LinearGradient
//                                       colors={[COLORS.green, COLORS.green]}
//                                       start={{x: 0.5, y: 0}} // Middle of the top
//                                       end={{x: 0.5, y: 1}} // Middle of the bottom
//                                       style={{
//                                         width: '100%', // Slightly smaller than the wrapper to accommodate the border
//                                         height: '98%',
//                                         borderRadius:
//                                           heightPercentageToDP(5) / 2,
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                       }}>
//                                       <Text style={styles.semibold}>{num}</Text>
//                                     </LinearGradient>
//                                   </LinearGradient>
//                                 </TouchableOpacity>
//                               ))}
//                             </View>
//                             <View
//                               style={{
//                                 flex: 1,
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 paddingBottom: heightPercentageToDP(1),
//                               }}>
//                               <TouchableOpacity
//                                 style={[
//                                   styles.ball,

//                                   ticket.multiplier && styles.selectedRedBall,
//                                 ]}
//                                 onPress={() => {
//                                   setActiveTicketIndex(ticketIndex);
//                                   setShowMultipliers(true);
//                                 }}>
//                                 <GreenBall
//                                   key={ticket.multiplier}
//                                   value={ticket.multiplier || ''}
//                                   firstcolor={COLORS.firstred}
//                                   secondcolor={COLORS.secondred}
//                                 />
//                               </TouchableOpacity>
//                             </View>
//                           </View>
//                         ))}
//                       </ScrollView>
//                     </View>
//                   </LinearGradient>

//                   {/* Total Cost */}
//                   <View style={styles.totalCostContainer}>
//                     <Text style={styles.totalCostText}>Total Cost:</Text>
//                     <Text style={styles.totalCostText}>
//                       {calculateTotalCost()}
//                     </Text>
//                   </View>

//                   {/* Submit Button */}
//                   {createPowerballBetIsLoading ? (
//                     <View
//                       style={{
//                         height: heightPercentageToDP(7),
//                       }}>
//                       <Loading />
//                     </View>
//                   ) : (
//                     <TouchableOpacity
//                       style={[
//                         styles.submitButton,
//                         isSubmitEnabled && styles.submitEnabled,
//                       ]}
//                       disabled={!isSubmitEnabled}
//                       onPress={submitHandler}>
//                       <Text style={styles.submitText}>Submit</Text>
//                     </TouchableOpacity>
//                   )}

//                   {/** end */}
//                 </View>
//               )}
//             </View>
//           </ImageBackground>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default PowerballGame;

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
//   paymentOption: {
//     flexDirection: 'row',
//     height: heightPercentageToDP(10),
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(2),
//     gap: heightPercentageToDP(1),
//   },
//   ticketOption: {
//     flexDirection: 'column',
//     height: heightPercentageToDP(40),
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(1),
//     marginTop: heightPercentageToDP(2),
//   },
//   confirmTicketContainer: {
//     flexDirection: 'row',
//     height: heightPercentageToDP(15),
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(1),
//     marginTop: heightPercentageToDP(2),
//   },
//   prizeOption: {
//     flexDirection: 'column',
//     height: heightPercentageToDP(15),
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(2),
//     marginTop: heightPercentageToDP(2),
//   },
//   iconContainer: {
//     backgroundColor: COLORS.white_s,
//     padding: heightPercentageToDP(1.5),
//     borderRadius: heightPercentageToDP(1),
//     height: heightPercentageToDP(6),
//   },
//   icon: {
//     height: 25,
//     width: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textStyleContent: {
//     fontSize: heightPercentageToDP(3),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
//   subtitle: {
//     fontSize: heightPercentageToDP(2),
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_Regular,
//   },
//   semibold: {
//     fontSize: heightPercentageToDP(2),
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_SemiBold,
//   },
//   container: {flex: 1, padding: 20, backgroundColor: '#fff'},
//   title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
//   ticketControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   controlButton: {fontSize: 24, paddingHorizontal: 15},
//   ticketInput: {
//     width: widthPercentageToDP(22),
//     backgroundColor: COLORS.white_s,
//     borderRadius: heightPercentageToDP(1),
//     padding: heightPercentageToDP(0.5),
//     textAlign: 'center',
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_Bold,
//   },
//   ticketCount: {
//     color: COLORS.white_s,
//     fontSize: heightPercentageToDP(2),
//     fontFamily: FONT.Montserrat_Bold,
//   },
//   ballContainer: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20},
//   ball: {
//     width: heightPercentageToDP(6),
//     height: heightPercentageToDP(6),
//     borderRadius: heightPercentageToDP(6) / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   ballText: {fontSize: 16},
//   whiteBall: {backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd'},
//   selectedBallGlobal: {
//     width: heightPercentageToDP(6),
//     height: heightPercentageToDP(6),
//     borderRadius: heightPercentageToDP(6) / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedBall: {
//     backgroundColor: COLORS.white_s,
//     borderWidth: 1,
//     borderColor: COLORS.white_s,
//   },
//   activeBall: {borderWidth: 2, borderColor: COLORS.yellow},
//   numbersContainer: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10},
//   ticket: {marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd'},
//   ticketTitle: {fontSize: 16, fontWeight: 'bold'},
//   activeTicketTitle: {color: COLORS.white_s},
//   multiplierContainer: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 10},
//   multiplierBall: {margin: 5},
//   redBall: {backgroundColor: 'red'},
//   autoGenerateButton: {
//     backgroundColor: '#28a745',
//     padding: 10,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   submitButton: {
//     backgroundColor: COLORS.blue,
//     padding: 10,
//     marginTop: 20,
//     alignItems: 'center',
//     borderRadius: heightPercentageToDP(1),
//   },
//   submitEnabled: {
//     backgroundColor: COLORS.green,
//     borderRadius: heightPercentageToDP(1),
//   },
//   submitText: {color: '#fff', fontSize: 16},
//   totalCostContainer: {
//     marginTop: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   totalCostText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.white_s,
//     fontFamily: FONT.Montserrat_Bold,
//   },

//   ball: {
//     marginHorizontal: heightPercentageToDP(0.5),
//   },
//   selectedBallGlobal: {
//     borderWidth: 2,
//     borderColor: COLORS.selectedBorder,
//   },
// });
