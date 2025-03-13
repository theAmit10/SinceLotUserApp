import {
  FlatList,
  Image,
  ImageBackground,
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
import Entypo from 'react-native-vector-icons/Entypo';
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
import {
  useGetPowerballQuery,
  useLatestPowerballResultQuery,
} from '../../helper/Networkcall';
import Loading from '../../components/helpercComponent/Loading';
import {
  getDateTimeAccordingToUserTimezone,
  getTimeAccordingToTimezone,
} from '../SearchTime';

const PowerballDashboard = () => {
  const navigation = useNavigation();

  const {user, accesstoken} = useSelector(state => state.user);

  const [powerball, setPowerball] = useState(null);
  // Network call
  const {data, error, isLoading} = useGetPowerballQuery({accesstoken});

  useEffect(() => {
    if (!isLoading && data) {
      setPowerball(data.games[0]);
      console.log(data?.games[0]);
    }

    if (error) {
      console.error('Error fetching powerball data:', error);
    }
  }, [data, isLoading, error]); // Correct dependencies

  const {
    isLoading: latestResultIsLoading,
    data: latestResultData,
    refetch: latesetResultRefetch,
  } = useLatestPowerballResultQuery({accesstoken});

  return (
    <View style={{flex: 1}}>
      <Background />

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(80),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(80),
              width: widthPercentageToDP(100),

              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
            }}>
            {/** Top Style View */}
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

            <GradientTextWhite
              style={{
                ...styles.textStyle,
                paddingLeft: heightPercentageToDP(2),
              }}>
              {powerball?.name}
            </GradientTextWhite>

            {/** Content Container */}

            <View
              style={{
                flex: 1,
                padding: heightPercentageToDP(1),
              }}>
              {isLoading || latestResultIsLoading ? (
                <Loading />
              ) : (
                <ScrollView
                  contentContainerStyle={{
                    paddingBottom: heightPercentageToDP(2),
                  }}
                  showsVerticalScrollIndicator={false}>
                  {/** BANNER DETAILS */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PowerballTimes')}>
                    <LinearGradient
                      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                      start={{x: 0, y: 0}} // start from left
                      end={{x: 1, y: 0}} // end at right
                      style={styles.paymentOption}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <GradientText style={styles.textStyleContent}>
                          LOTTERY JACKPOT
                        </GradientText>

                        <MaterialCommunityIcons
                          name={'trophy-award'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.white_s}
                          style={styles.icon}
                        />
                      </View>
                      <Text style={styles.subtitle}>
                        PLAY FOR JUST{' '}
                        <Text style={{fontFamily: FONT.Montserrat_Bold}}>
                          {user?.country?.ticketprice}{' '}
                          {user?.country?.countrycurrencysymbol}
                        </Text>
                      </Text>
                      <View
                        style={{
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          padding: heightPercentageToDP(1),
                        }}>
                        <LinearGradient
                          colors={[COLORS.green, COLORS.green]}
                          start={{x: 0, y: 0}} // start from left
                          end={{x: 10, y: 0}} // end at right
                          style={{
                            padding: heightPercentageToDP(1),
                            borderRadius: heightPercentageToDP(2),
                            paddingHorizontal: heightPercentageToDP(4),
                          }}>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_SemiBold,
                              fontSize: heightPercentageToDP(2),
                              color: COLORS.white_s,
                            }}>
                            BUY TICKETS
                          </Text>
                        </LinearGradient>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            flex: 2,
                          }}>
                          <Text style={styles.subtitle}>
                            WIN{' '}
                            <Text
                              style={{
                                fontFamily: FONT.Montserrat_Bold,
                                color: COLORS.white_s,
                              }}>
                              MEGA JACKPOT
                            </Text>
                          </Text>
                          <Text
                            style={{
                              fontFamily: FONT.Montserrat_Bold,
                              fontSize: heightPercentageToDP(3),
                              color: COLORS.black,
                            }}>
                            {latestResultData?.data?.prize?.firstprize?.amount}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,

                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                          }}>
                          <Image
                            source={require('../../../assets/image/cat.png')}
                            style={{width: 55, height: 55}}
                          />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/** LATEST RESULT DETAILS */}
                  <LinearGradient
                    colors={[COLORS.lightyellow, COLORS.darkyellow]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={styles.resultOption}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.semibold}>
                        {getTimeAccordingToTimezone(
                          latestResultData?.data?.powertime?.powertime,
                          user?.country?.timezone,
                        )}
                      </Text>
                      <Text style={styles.semibold}>
                        {getDateTimeAccordingToUserTimezone(
                          latestResultData?.data?.powertime?.powertime,
                          latestResultData?.data?.powerdate?.powerdate,
                          user?.country?.timezone,
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Bold,
                          fontSize: heightPercentageToDP(3),
                          color: COLORS.black,
                        }}>
                        JACKPOT WINNER
                      </Text>
                    </View>

                    <CircleContainer
                      jackpotnumber={
                        latestResultData?.data?.jackpotnumber || [
                          '*',
                          '*',
                          '*',
                          '*',
                          '*',
                          '*',
                        ]
                      }
                    />
                  </LinearGradient>

                  {/* PRIZE DISTRIBUTION */}

                  {/* {resultdata.prize.map((item, index) => {
                    return (
                      <PrizeComponent
                        key={index}
                        title={item.title}
                        description={item.description}
                        numberofwinner={item.numberofwinner}
                        amount={item.amount}
                      />
                    );
                  })} */}

                  {/** FIRST PRIZE */}
                  <PrizeComponent
                    key={1}
                    title={'1st Prize'}
                    description={'Match all 6 balls to win the 1st Prize'}
                    numberofwinner={
                      latestResultData?.data?.prize?.firstprize?.totaluser
                    }
                    amount={latestResultData?.data?.prize?.firstprize?.amount}
                  />

                  {/** SECOND PRIZE */}
                  <PrizeComponent
                    key={2}
                    title={'2nd Prize'}
                    description={'Match all 5 balls to win the 2nd Prize'}
                    numberofwinner={
                      latestResultData?.data?.prize?.secondprize?.totaluser
                    }
                    amount={latestResultData?.data?.prize?.secondprize?.amount}
                  />

                  {/** THIRD PRIZE */}

                  <PrizeComponent
                    key={3}
                    title={'3rd Prize'}
                    description={'Match all 4 balls to win the 3rd Prize'}
                    numberofwinner={
                      latestResultData?.data?.prize?.thirdprize?.totaluser
                    }
                    amount={latestResultData?.data?.prize?.thirdprize?.amount}
                  />

                  {/** FOURTH PRIZE */}

                  <PrizeComponent
                    key={4}
                    title={'4th Prize'}
                    description={'Match all 3 balls to win the 4th Prize'}
                    numberofwinner={
                      latestResultData?.data?.prize?.fourthprize?.totaluser
                    }
                    amount={
                      latestResultData?.data?.prize?.fourthprize?.totaluser
                    }
                  />
                  {/** FIFTH PRIZE */}
                  <PrizeComponent
                    key={5}
                    title={'5th Prize'}
                    description={'Match all 2 balls to win the 5th Prize'}
                    numberofwinner={
                      latestResultData?.data?.prize?.fifthprize?.totaluser
                    }
                    amount={
                      latestResultData?.data?.prize?.fifthprize?.amount + ' X'
                    }
                  />
                  {/** SIXTH PRIZE */}
                  <PrizeComponent
                    key={6}
                    title={'6th Prize'}
                    description={'Match all 1 ball to win the 6th Prize'}
                    numberofwinner={
                      latestResultData?.data?.prize?.sixthprize?.totaluser
                    }
                    amount={
                      latestResultData?.data?.prize?.sixthprize?.amount + ' X'
                    }
                  />
                </ScrollView>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default PowerballDashboard;

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
    flexDirection: 'column',
    height: heightPercentageToDP(25),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  resultOption: {
    flexDirection: 'column',
    height: heightPercentageToDP(18),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
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
});
