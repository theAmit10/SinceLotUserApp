import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginBackground from '../components/login/LoginBackground';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Background from '../components/background/Background';
import Loading from '../components/helpercComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {getDateAccordingToLocationAndTime} from '../redux/actions/dateAction';
import LinearGradient from 'react-native-linear-gradient';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import {getDateTimeAccordingToUserTimezone, getTimeAccordingToTimezone} from './SearchTime';
import moment from 'moment-timezone';

const SearchDate = ({route}) => {
  const navigation = useNavigation();

  const {timedata, locationdata} = route.params;

  const [searchData, setSearchData] = useState('');
  const [showLoading, setLoading] = useState(false);
  const [data, setData] = useState([
    {id: '1', title: '22 jan 2024'},
    {id: '2', title: '23 jan 2024'},
    {id: '3', title: '24 jan 2024'},
    {id: '4', title: '25 jan 2024'},
    {id: '5', title: '26 jan 2024'},
    {id: '6', title: '27 jan 2024'},
    {id: '7', title: '28 jan 2024'},
    {id: '8', title: '29 jan 2024'},
  ]);

  const dispatch = useDispatch();

  const {accesstoken, user} = useSelector(state => state.user);
  const {loading, dates} = useSelector(state => state.date);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = text => {
    const filtered = dates.filter(item =>
      item.lotdate.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(
      getDateAccordingToLocationAndTime(
        accesstoken,
        timedata._id,
        timedata.lotlocation._id,
      ),
    );
  }, [dispatch, focused]);


function convertUTCToIST12Hour(utcTime) {
  // Create a moment object from the UTC time string
  const momentObj = moment.utc(utcTime);

  // Set the timezone to IST
  momentObj.tz('Asia/Kolkata');

  // Format the date and time in 12-hour format
  const istDateTime = momentObj.format('YYYY-MM-DD h:mm:ss A');

  return istDateTime;
}

  useEffect(() => {
    if(dates)
    {
      const modifiedData = convertToUserTimezone(dates, user?.country?.timezone);
      
      console.log("created at time gimini"); 
      dates.map((item) => {
        const istDateTime = convertUTCToIST12Hour(item.createdAt);
        console.log("Created At :: ",istDateTime); 
      })

      // Output: 2024-10-24 12:14:16 AM
      setFilteredData(modifiedData); // Update filteredData whenever locations change
    }
   
  }, [dates]);

  const navigationController = item => {
    // const lotTimeMoment = moment.tz(
    //   timedata.time ? timedata.time : timedata.lottime,
    //   'hh:mm A',
    //   'Asia/Kolkata',
    // );

    // console.log(`Lot Time for location : ${lotTimeMoment.format('hh:mm A')}`);
    // const isLotTimePassed = now.isSameOrAfter(lotTimeMoment);
    // const nextDay = now.clone().add(1, 'day');

    // console.log(`Checking times Lot Time Passed: ${isLotTimePassed}`);
    // console.log('Next Date: ', nextDay.format('DD-MM-YYYY'));

    // item._id,
    // item.lottime._id,
    // item.lottime.lotlocation._id,

     // if (isLotTimePassed) {
    //   console.log('YOU ARE INSIDE IF BLOCK');
    //   const currentDate = nextDay.format('DD-MM-YYYY');
    //   const currentDateObject = findCurrentDateObject(data, currentDate);

    //   console.log(
    //     'IF currentDateObject :: ',
    //     JSON.stringify(currentDateObject),
    //   );
    //   setResult(currentDateObject); // Set the result to the current date object
    //   setCurrentDate(currentDateObject);
    //   console.log('Today Play :: ' + JSON.stringify(currentDateObject));

    //   if (currentDateObject !== 'Current date not found') {
    //     console.log('result !== "Current date not found"');
    //     // Fetch results using the API function
    //     // getResultAccordingToLocationTimeDate(
    //     //   currentDateObject._id,
    //     //   timedata._id,
    //     //   locationdata._id,
    //     // );

    //     // Check if the results array is empty
    //     const maximumNumber = locationdata.maximumNumber; // Ensure `maximumNumber` exists in the data
    //     if (maximumNumber) {
    //       const generatedArray = createLocationDataArray(maximumNumber);
    //       setBetnumberdata(generatedArray);
    //     }
    //     setResult('yes'); // Set to the current date object if results are found
    //     setShowPlay(false);
    //   }
    // } else {
    //   console.log('YOU ARE INSIDE ELSE BLOCK');
    //   // const currentDate = getCurrentDate();
    //   const currentDate = getCurrentDateInTimezone();

    //   // const cISTDate = getCurrentDate();
    //   // const currentDate = getDateTimeAccordingToUserTimezone(
    //   //   timedata.time ? timedata.time : timedata.lottime,
    //   //   cISTDate,
    //   //   user?.country?.timezone,
    //   // );
    //   const currentDateObject = findCurrentDateObject(data, currentDate);

    //   console.log(
    //     'ELSE currentDateObject :: ',
    //     JSON.stringify(currentDateObject),
    //   );
    //   setResult(currentDateObject); // Set the result to the current date object
    //   setCurrentDate(currentDateObject);
    //   console.log('Today Play :: ' + JSON.stringify(currentDateObject));

    //   if (currentDateObject !== 'Current date not found') {
    //     console.log('result !== "Current date not found"');

    //     const maximumNumber = locationdata.maximumNumber; // Ensure `maximumNumber` exists in the data
    //     if (maximumNumber) {
    //       const generatedArray = createLocationDataArray(maximumNumber);
    //       setBetnumberdata(generatedArray);
    //     }
    //     setResult('yes'); // Set to the current date object if results are found
    //     setShowPlay(false);
    //   }
    // }

    const cISTDate = item.lotdate;
    const currentDate = getDateTimeAccordingToUserTimezone(
          item.lottime.lottime,
          cISTDate,
          user?.country?.timezone,
        );

    console.log("MINE DATE :: ",currentDate)
    console.log("MINE DATEE :: ",JSON.stringify(dates))
    const currentDateObject = findCurrentDateObject(dates, currentDate);
    console.log("MINE DATA :: ",JSON.stringify(currentDateObject))

   

    // navigation.navigate('Result', {
    //   datedata: currentDateObject,
    // });
    navigation.navigate('Result', {
      datedata: item,
    });
  };

  const findCurrentDateObject = (data, currentDate) => {
    console.log('Checking for the current date is availble in the database');
  
    console.log('current data : ' + currentDate);
    const lotdates = data || [];
  
    const found = lotdates.find(item => item.lotdate === currentDate);
  
    return found ? found : 'Current date not found';
  };

  const convertToUserTimezone = (dataArray, userTimezone) => {
    return dataArray.map(item => {
      // Combine the lotdate and lottime to form a complete datetime in IST
      const istDateTime = moment.tz(`${item.lotdate} ${item.lottime.lottime}`, 'DD-MM-YYYY hh:mm A', 'Asia/Kolkata');
      
      // Convert this IST datetime to the user's timezone
      const userDateTime = istDateTime.clone().tz(userTimezone);
  
      // Format the converted datetime into 'DD-MM-YYYY' format
      const convertedLotdate = userDateTime.format('DD-MM-YYYY');
  
      // Return the modified object with the new lotdate
      return {
        ...item,
        lotdate: convertedLotdate,  // Update the lotdate
      };
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
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

            {/** Content Container */}

            <View
              style={{
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                {locationdata.lotlocation}
              </GradientTextWhite>
              <GradientTextWhite style={styles.textStyle}>
                {getTimeAccordingToTimezone(
                  timedata.lottime,
                  user?.country?.timezone,
                )}
              </GradientTextWhite>

              <GradientTextWhite style={styles.textStyle}>
                Search Date
              </GradientTextWhite>

              {/** Search container */}

              <View
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
                <TextInput
                  style={{
                    marginStart: heightPercentageToDP(1),
                    flex: 1,
                    fontFamily: FONT.Montserrat_Regular,
                    fontSize: heightPercentageToDP(2.5),
                    color: COLORS.black,
                  }}
                  placeholder="Search for date"
                  placeholderTextColor={COLORS.black}
                  label="Search"
                  onChangeText={handleSearch}
                />
              </View>
            </View>

            {/* <View style={{margin: heightPercentageToDP(2)}}>
              <GradientText style={styles.textStyle}>
                {locationdata.lotlocation}
              </GradientText>
              <GradientText style={styles.textStyle}>
                {timedata.lottime}
              </GradientText>
            </View> */}

            <View
              style={{
                flex: 2,
              }}>
              {loading ? (
                <Loading />
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigationController(item)
                      }>
                      <LinearGradient
                        colors={
                          index % 2 === 0
                            ? [COLORS.time_firstblue, COLORS.time_secondbluw]
                            : [COLORS.time_firstgreen, COLORS.time_secondgreen]
                        }
                        start={{x: 0, y: 0}} // start from left
                        end={{x: 1, y: 0}} // end at right
                        style={{
                          ...styles.item,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            color: COLORS.black,
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(2.5),
                          }}>
                          {item.lotdate}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item._id}
                  initialNumToRender={10} // Render initial 10 items
                  maxToRenderPerBatch={10} // Batch size to render
                  windowSize={10} // Number of items kept in memory
                />
              )}
            </View>

            {/** Bottom Submit Container */}

            {/** end */}
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default SearchDate;

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
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },
});

// {/* <View
//           style={{
//             marginBottom: heightPercentageToDP(5),
//             marginHorizontal: heightPercentageToDP(2),
//             marginTop: heightPercentageToDP(2),
//           }}>
//           {/** Email container */}

//           <TouchableOpacity
//             onPress={submitHandler}
//             style={{
//               backgroundColor: COLORS.blue,
//               padding: heightPercentageToDP(2),
//               borderRadius: heightPercentageToDP(1),
//               alignItems: 'center',
//             }}>
//             <Text
//               style={{
//                 color: COLORS.white,
//                 fontFamily: FONT.Montserrat_Regular,
//               }}>
//               Submit
//             </Text>
//           </TouchableOpacity>
//         </View> */}
