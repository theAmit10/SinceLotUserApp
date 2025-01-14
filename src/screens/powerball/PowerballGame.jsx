import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
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
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import GradientText from '../../components/helpercComponent/GradientText';
import CircleContainer from '../../components/powerball/CircleContainer';
import PrizeComponent from './PrizeComponent';
import TimesComp from './TimesComp';
import Loading from '../../components/helpercComponent/Loading';
import NoDataFound from '../../components/helpercComponent/NoDataFound';
import GradientCircle from '../../components/powerball/GradientCircle';
import GreenballContainer from '../../components/powerball/GreenballContainer';
import GreenBall from '../../components/powerball/GreenBall';
import WhiteBall from '../../components/powerball/WhiteBall';
import SmallWhiteBall from '../../components/powerball/SmallWhiteBall';

const TOTAL_BALLS = 70; // Total available numbers
const MAX_NUMBERS = 6; // Numbers per ticket
const MULTIPLIERS = ['2X', '3X', '4X', '5X', '6X', '7X', 'NA']; // Multiplier options
const TICKET_COST = 100; // Base price per ticket
const MULTIPLIER_COSTS = {
  '2X': 20,
  '3X': 30,
  '4X': 40,
  '5X': 50,
  '6X': 60,
  '7X': 70,
  NA: 0,
};

const PowerballGame = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);

  const timedata = [
    {
      id: 1,
      powertime: '10:00 PM',
    },
    {
      id: 2,
      powertime: '11:00 PM',
    },
  ];

  const loading = false;

  const [ticketValue, setTicketValue] = useState(1);

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

  const [tickets, setTickets] = useState([
    {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
  ]);
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);
  const [activeBallIndex, setActiveBallIndex] = useState(0);
  const [showMultipliers, setShowMultipliers] = useState(false);
  const [showAllSeclectedBalls, setShowAllSeclectedBalls] = useState(false);

  const ballNumbers = Array.from({length: TOTAL_BALLS}, (_, i) => i + 1);

  const addTicket = () => {
    setTickets([
      ...tickets,
      {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
    ]);
    setActiveTicketIndex(tickets.length);
    setActiveBallIndex(0);
  };

  const addMultipleTickets = value => {
    const numTickets = parseInt(value, 10);
    if (!isNaN(numTickets) && numTickets > 0) {
      const newTickets = Array.from({length: numTickets}, () => ({
        selectedNumbers: Array(MAX_NUMBERS).fill(null),
        multiplier: null,
      }));
      setTickets([...tickets, ...newTickets]);
    }
  };

  const removeTicket = () => {
    if (tickets.length > 1) {
      setTickets(tickets.slice(0, -1));
      if (activeTicketIndex >= tickets.length - 1) {
        setActiveTicketIndex(tickets.length - 2);
      }
    }
  };

  const handleNumberSelect = number => {
    const currentTicket = tickets[activeTicketIndex];
    const updatedNumbers = [...currentTicket.selectedNumbers];

    if (updatedNumbers.includes(number)) {
      const indexToRemove = updatedNumbers.indexOf(number);
      updatedNumbers[indexToRemove] = null;
    } else {
      updatedNumbers[activeBallIndex] = number;
    }

    const updatedTickets = [...tickets];
    updatedTickets[activeTicketIndex] = {
      ...currentTicket,
      selectedNumbers: updatedNumbers,
    };
    setTickets(updatedTickets);

    const nextEmptyIndex = updatedNumbers.indexOf(null);
    if (nextEmptyIndex !== -1) {
      setActiveBallIndex(nextEmptyIndex);
    }
  };

  const handleMultiplierSelect = multiplier => {
    const updatedTickets = [...tickets];
    updatedTickets[activeTicketIndex].multiplier = multiplier;
    setTickets(updatedTickets);
    setShowMultipliers(false); // Hide the multiplier selection after a choice is made
  };

  const isSubmitEnabled = tickets.every(ticket =>
    ticket.selectedNumbers.every(num => num !== null),
  );

  const generateUniqueRandomNumbers = () => {
    let usedNumbers = [];

    // Reset selected numbers to null first before generating new ones
    const newTickets = tickets.map(ticket => {
      let ticketNumbers = Array(MAX_NUMBERS).fill(null); // Reset all numbers

      // Find empty slots in the current ticket (all should be empty now)
      const emptyIndexes = ticketNumbers
        .map((num, index) => (num === null ? index : -1))
        .filter(index => index !== -1);

      emptyIndexes.forEach(index => {
        let randomNum;
        do {
          // Generate a random number
          randomNum =
            ballNumbers[Math.floor(Math.random() * ballNumbers.length)];

          // Ensure that the number is unique across all tickets
        } while (
          usedNumbers.includes(randomNum) ||
          ticketNumbers.includes(randomNum)
        );

        ticketNumbers[index] = randomNum;
        usedNumbers.push(randomNum); // Mark this number as used
      });

      return {...ticket, selectedNumbers: ticketNumbers};
    });

    setTickets(newTickets);
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

  const sebmittingNext = () => {
    console.log('submitting to next stage to confirm ticket');
    console.log('submited ticket :: ', tickets), setShowAllSeclectedBalls(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="height"
        keyboardVerticalOffset={-130}>
        <Background />

        {/** Main Cointainer */}

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <GradientText
            style={{
              ...styles.textStyle,
              paddingLeft: heightPercentageToDP(2),
            }}>
            Powerball
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
                  10-12-2024
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
                  09:00 PM
                </Text>
              </View>

              {/** ALL TICKET BUYING Container */}

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
                        placeholder="Ticket"
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
                      <TouchableOpacity onPress={generateUniqueRandomNumbers}>
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
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                        start={{x: 0, y: 0}} // Start from left
                        end={{x: 1, y: 0}} // End at right
                        style={styles.paymentOption}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          {ballNumbers.map(num => {
                            // Check if the number is selected
                            const isSelected = tickets.some(ticket =>
                              ticket.selectedNumbers.includes(num),
                            );
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
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
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
                                    if (num !== null) {
                                      handleNumberSelect(num);
                                    }
                                    setActiveTicketIndex(ticketIndex);
                                    setActiveBallIndex(index);
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
                                <SmallWhiteBall value={num} />
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
                                  09 : 00 PM
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: FONT.Montserrat_Regular,
                                    fontSize: heightPercentageToDP(2),
                                  }}>
                                  14-01-2025
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
                                  INR
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
                                    if (num !== null) {
                                      handleNumberSelect(num);
                                    }
                                    setActiveTicketIndex(ticketIndex);
                                    setActiveBallIndex(index);
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
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isSubmitEnabled && styles.submitEnabled,
                    ]}
                    disabled={!isSubmitEnabled}
                    onPress={() => console.log(tickets)}>
                    <Text style={styles.submitText}>Submit</Text>
                  </TouchableOpacity>

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
    placeholderTextColor: COLORS.black,
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

// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';

// const TOTAL_BALLS = 70; // Total available numbers
// const MAX_NUMBERS = 6; // Numbers per ticket
// const MULTIPLIERS = ["2X", "3X", "4X", "5X", "6X", "7X","NA"]; // Multiplier options
// const TICKET_COST = 100; // Base price per ticket
// const MULTIPLIER_COSTS = {
//   "2X": 20,
//   "3X": 30,
//   "4X": 40,
//   "5X": 50,
//   "6X": 60,
//   "7X": 70,
//   "NA": 0,
// };

// const PowerballGame = () => {
//   const [tickets, setTickets] = useState([
//     { selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null },
//   ]);
//   const [activeTicketIndex, setActiveTicketIndex] = useState(0);
//   const [activeBallIndex, setActiveBallIndex] = useState(0);
//   const [showMultipliers, setShowMultipliers] = useState(false);

//   const ballNumbers = Array.from({ length: TOTAL_BALLS }, (_, i) => i + 1);

//   const addTicket = () => {
//     setTickets([
//       ...tickets,
//       { selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null },
//     ]);
//     setActiveTicketIndex(tickets.length);
//     setActiveBallIndex(0);
//   };

//   const addMultipleTickets = (value) => {
//     const numTickets = parseInt(value, 10);
//     if (!isNaN(numTickets) && numTickets > 0) {
//       const newTickets = Array.from({ length: numTickets }, () => ({
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

//   const handleNumberSelect = (number) => {
//     const currentTicket = tickets[activeTicketIndex];
//     const updatedNumbers = [...currentTicket.selectedNumbers];

//     if (updatedNumbers.includes(number)) {
//       const indexToRemove = updatedNumbers.indexOf(number);
//       updatedNumbers[indexToRemove] = null;
//     } else {
//       updatedNumbers[activeBallIndex] = number;
//     }

//     const updatedTickets = [...tickets];
//     updatedTickets[activeTicketIndex] = { ...currentTicket, selectedNumbers: updatedNumbers };
//     setTickets(updatedTickets);

//     const nextEmptyIndex = updatedNumbers.indexOf(null);
//     if (nextEmptyIndex !== -1) {
//       setActiveBallIndex(nextEmptyIndex);
//     }
//   };

//   const handleMultiplierSelect = (multiplier) => {
//     const updatedTickets = [...tickets];
//     updatedTickets[activeTicketIndex].multiplier = multiplier;
//     setTickets(updatedTickets);
//     setShowMultipliers(false); // Hide the multiplier selection after a choice is made
//   };

//   const isSubmitEnabled = tickets.every(
//     (ticket) => ticket.selectedNumbers.every((num) => num !== null)
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
//           randomNum = ballNumbers[Math.floor(Math.random() * ballNumbers.length)];

//           // Ensure that the number is unique across all tickets
//         } while (usedNumbers.includes(randomNum) || ticketNumbers.includes(randomNum));

//         ticketNumbers[index] = randomNum;
//         usedNumbers.push(randomNum); // Mark this number as used
//       });

//       return { ...ticket, selectedNumbers: ticketNumbers };
//     });

//     setTickets(newTickets);
//   };

//   // Function to calculate total cost of all tickets
//   const calculateTotalCost = () => {
//     return tickets.reduce((total, ticket) => {
//       const multiplierCost = ticket.multiplier ? MULTIPLIER_COSTS[ticket.multiplier] : 0;
//       return total + TICKET_COST + multiplierCost;
//     }, 0);
//   };

//   // Function to calculate the price of each individual ticket
//   const calculateTicketPrice = (ticket) => {
//     const multiplierCost = ticket.multiplier ? MULTIPLIER_COSTS[ticket.multiplier] : 0;
//     return TICKET_COST + multiplierCost;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Powerball Ticket Selector</Text>

//       <View style={styles.ticketControls}>
//         <TouchableOpacity onPress={removeTicket} disabled={tickets.length === 1}>
//           <Text style={styles.controlButton}>-</Text>
//         </TouchableOpacity>

//         <TextInput
//           style={styles.ticketInput}
//           keyboardType="numeric"
//           placeholder="Enter tickets"
//           onSubmitEditing={(e) => addMultipleTickets(e.nativeEvent.text)}
//         />

//         <Text style={styles.ticketCount}>{tickets.length}</Text>

//         <TouchableOpacity onPress={addTicket}>
//           <Text style={styles.controlButton}>+</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView horizontal style={styles.ballContainer}>
//         {ballNumbers.map((num) => (
//           <TouchableOpacity
//             key={num}
//             style={[
//               styles.ball,
//               tickets.some((ticket) => ticket.selectedNumbers.includes(num)) &&
//                 styles.selectedBallGlobal,
//             ]}
//             onPress={() => handleNumberSelect(num)}
//           >
//             <Text style={styles.ballText}>{num}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

// <ScrollView style={styles.scrollView}>
//   {tickets.map((ticket, ticketIndex) => (
//     <View key={ticketIndex} style={styles.ticket}>
//       <Text
//         style={[
//           styles.ticketTitle,
//           activeTicketIndex === ticketIndex && styles.activeTicketTitle,
//         ]}
//       >
//         Ticket {ticketIndex + 1} - ₹{calculateTicketPrice(ticket)}
//       </Text>

//       <View style={styles.numbersContainer}>
//         {ticket.selectedNumbers.map((num, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.ball,
//               styles.whiteBall,
//               activeTicketIndex === ticketIndex &&
//                 index === activeBallIndex && styles.activeBall,
//               num !== null && styles.selectedBall,
//             ]}
//             onPress={() => {
//               if (num !== null) {
//                 handleNumberSelect(num);
//               }
//               setActiveTicketIndex(ticketIndex);
//               setActiveBallIndex(index);
//             }}
//           >
//             <Text style={styles.ballText}>{num || ''}</Text>
//           </TouchableOpacity>
//         ))}

//         {/* Red Ball for Multiplier */}
//         <TouchableOpacity
//           style={[
//             styles.ball,
//             styles.redBall,
//             ticket.multiplier && styles.selectedRedBall,
//           ]}
//           onPress={() => {
//             setActiveTicketIndex(ticketIndex);
//             setShowMultipliers(true);
//           }}
//         >
//           <Text style={styles.ballText}>{ticket.multiplier || ''}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   ))}
// </ScrollView>

// {/* Multiplier Selector */}
// {showMultipliers && (
//   <View style={styles.multiplierContainer}>
//     {MULTIPLIERS.map((multiplier) => (
//       <TouchableOpacity
//         key={multiplier}
//         style={[styles.ball, styles.multiplierBall]}
//         onPress={() => handleMultiplierSelect(multiplier)}
//       >
//         <Text style={styles.ballText}>{multiplier}</Text>
//       </TouchableOpacity>
//     ))}
//   </View>
// )}

//       {/* Auto Generate Button */}
//       <TouchableOpacity style={styles.autoGenerateButton} onPress={generateUniqueRandomNumbers}>
//         <Text style={styles.submitText}>Auto Generate</Text>
//       </TouchableOpacity>

// {/* Submit Button */}
// <TouchableOpacity
//   style={[styles.submitButton, isSubmitEnabled && styles.submitEnabled]}
//   disabled={!isSubmitEnabled}
//   onPress={() => console.log('Tickets Submitted:', tickets)}
// >
//   <Text style={styles.submitText}>Submit</Text>
// </TouchableOpacity>

// {/* Total Cost */}
// <View style={styles.totalCostContainer}>
//   <Text style={styles.totalCostText}>Total Cost: ₹{calculateTotalCost()}</Text>
// </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
// container: { flex: 1, padding: 20, backgroundColor: '#fff' },
// title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
// ticketControls: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
// controlButton: { fontSize: 24, paddingHorizontal: 15 },
// ticketInput: { borderWidth: 1, borderColor: '#ddd', padding: 5, flex: 1, textAlign: 'center' },
// ticketCount: { fontSize: 18, marginLeft: 10 },
// ballContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
// ball: { width: 40, height: 40, margin: 5, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
// ballText: { fontSize: 16 },
// whiteBall: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
// selectedBallGlobal: { backgroundColor: 'blue', color: '#fff' },
// selectedBall: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#00f' },
// activeBall: { borderWidth: 2, borderColor: 'red' },
// numbersContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
// ticket: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd' },
// ticketTitle: { fontSize: 16, fontWeight: 'bold' },
// activeTicketTitle: { color: 'blue' },
// multiplierContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
// multiplierBall: { backgroundColor: 'red', margin: 5 },
// redBall: { backgroundColor: 'red' },
// selectedRedBall: { backgroundColor: '#ff4d4d' },
// autoGenerateButton: { backgroundColor: '#28a745', padding: 10, marginTop: 20, alignItems: 'center' },
// submitButton: { backgroundColor: '#007bff', padding: 10, marginTop: 20, alignItems: 'center' },
// submitEnabled: { backgroundColor: '#0056b3' },
// submitText: { color: '#fff', fontSize: 16 },
// totalCostContainer: { marginTop: 20, alignItems: 'center' },
// totalCostText: { fontSize: 18, fontWeight: 'bold' },
// });

// export default PowerballGame;
