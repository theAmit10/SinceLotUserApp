import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientText from '../../components/helpercComponent/GradientText';
import Loading from '../../components/helpercComponent/Loading';
import SelectYearAndMonth from '../../components/helpercComponent/SelectYearAndMonth';
import {
  useGetPowerballResultQuery,
  useGetPowetTimesQuery,
} from '../../helper/Networkcall';
import ResultTimeComp from './ResultTimeComp';
import NoDataFound from '../../components/helpercComponent/NoDataFound';

const ResultPowerball = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);

  const [filteredData, setFilteredData] = useState([]);

  // Example usage:
  // This will return the date and time in 'America/New_York' timezone.
  // This will return the date and time in 'America/New_York' timezone.

  const handleSearch = text => {
    const filtered = times.filter(item =>
      item.lottime.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
  const [showTime, setshowTime] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [time, setTime] = useState(null);

  const [forcase, setforcase] = useState('time');

  // FOR TIME
  const {
    isLoading: timeLoading,
    data: timeData,
    error: timeError,
  } = useGetPowetTimesQuery({accesstoken});

  const {isLoading, data, error} = useGetPowerballResultQuery(
    {
      accesstoken,
      powertimeid: time?._id,
      year: selectedYear,
      month: selectedMonth,
    },
    {skip: time == null},
  );

  // FOR RESULT
  useEffect(() => {
    console.log('CHANGING MONTH OR YEAR');
    if (time && selectedMonth && selectedYear) {
      setshowTime(false);
      setShowResult(true);
      setforcase('result');
    }
  }, [selectedYear, selectedMonth, showSelectMonth, showSelectYear]);

  const [resultdata, setresultdata] = useState([]);

  console.log('DATA :: ' + JSON.stringify(data?.results[0]?.dates));
  useEffect(() => {
    if (data) {
      setresultdata(data?.results[0]?.dates);
    }
  }, [data]);

  return (
    <View style={{flex: 1}}>
      <Background
        fromScreen="powerballresult"
        setShowResult={setShowResult}
        setTime={setTime}
        setshowTime={setshowTime}
        backcase={forcase}
        setforcase={setforcase}
      />

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <GradientText
          style={{
            ...styles.textStyle,
            paddingLeft: heightPercentageToDP(2),
          }}>
          Powerball Result
        </GradientText>
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
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(3),
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_SemiBold,
                    color: COLORS.white_s,
                    fontSize: heightPercentageToDP(2),
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}>
                  {selectedMonth}
                </Text>
              </View>

              <View
                style={{
                  flex: 2,
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

              <View style={{flex: 0.5}}></View>
              <Text
                style={{
                  fontFamily: FONT.Montserrat_SemiBold,
                  color: COLORS.white_s,
                  fontSize: heightPercentageToDP(2),
                }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}>
                {time ? time.powertime : ''}
              </Text>
            </View>

            {/** Content Container */}

            <View
              style={{
                flex: 1,
                padding: heightPercentageToDP(1),
              }}>
              {/* SELECT TIME */}
              {showTime &&
                (timeLoading ? (
                  <Loading />
                ) : (
                  timeData &&
                  timeData?.powerTimes && (
                    <FlatList
                      data={timeData?.powerTimes}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={item => item._id}
                      renderItem={({item, index}) => (
                        <ResultTimeComp
                          key={item._id}
                          powertime={item.powertime}
                          subtitle="Results"
                          item={item}
                          setTime={setTime}
                          setShowSelectYear={setShowSelectYear}
                          setshowTime={setshowTime}
                        />
                      )}
                    />
                  )
                ))}
              {/* SHOW SELECT MONTH AND YEAR */}
              {showSelectYear && (
                <SelectYearAndMonth
                  onClose={() => {
                    setShowSelectYear(false);
                    setshowTime(true);
                  }}
                  setSelectedMonth={setSelectedMonth}
                  setSelectedYear={setSelectedYear}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                />
              )}
              {/* SHOW RESULT */}
              {showResult &&
                (isLoading ? (
                  <Loading />
                ) : resultdata?.length === 0 ? (
                  <NoDataFound data={'No Result Available'} />
                ) : (
                  <FlatList
                    data={resultdata}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item._id}
                    renderItem={({item, index}) => (
                      <LinearGradient
                        key={index}
                        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                        start={{x: 0, y: 0}} // start from left
                        end={{x: 1, y: 0}} // end at right
                        style={{
                          justifyContent: 'flex-start',
                          borderRadius: heightPercentageToDP(2),
                          marginTop: heightPercentageToDP(2),
                        }}>
                        <View
                          style={[
                            styles.paymentOption,
                            {
                              flex: 1,
                              height: '100%',
                            },
                          ]}>
                          <View style={styles.topContainer}>
                            <View
                              style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text style={styles.titleRegular}>Date</Text>
                              <Text style={styles.titleBold}>
                                {item?.powerdate?.powerdate}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1.5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text style={styles.titleRegular}>Jackpot</Text>
                              <Text style={styles.titleBold} numberOfLines={1}>
                                {item?.results[0]?.jackpotnumber
                                  .toString()
                                  .replaceAll(',', ' ')}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    )}
                  />
                ))}
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default ResultPowerball;

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
    justifyContent: 'space-between',
    minHeight: heightPercentageToDP(8),
    borderRadius: heightPercentageToDP(2),
    alignItems: 'center',
    gap: heightPercentageToDP(3),
    paddingStart: heightPercentageToDP(2),
  },
  iconContainer: {
    backgroundColor: COLORS.white_s,
    padding: heightPercentageToDP(1.5),
    borderRadius: heightPercentageToDP(1),
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
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  topContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLine: {
    height: 1,
    backgroundColor: COLORS.white_s,
    marginTop: heightPercentageToDP(-1),
    marginBottom: heightPercentageToDP(1),
  },
  titleRegular: {
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  titleBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Bold,
  },
  titleSemiBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.white_s,
    fontFamily: FONT.Montserrat_Bold,
  },
  acceptBtn: {
    backgroundColor: COLORS.green,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(2),
  },
});
