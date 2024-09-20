import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
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
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Background from '../components/background/Background';
import Loading from '../components/helpercComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {getAllDate} from '../redux/actions/dateAction';
import {getTimeAccordingLocation} from '../redux/actions/timeAction';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment-timezone";

export function getTimeAccordingToTimezone(time, targetTimeZone) {
  // Get the current date in "DD-MM-YYYY" format
  const todayDate = moment().format("DD-MM-YYYY");
  
  // Combine the current date and time into a full datetime string
  const dateTimeIST = `${todayDate} ${time}`;

  // Convert the combined date and time to a moment object in the IST timezone
  const istTime = moment.tz(dateTimeIST, "DD-MM-YYYY hh:mm A", "Asia/Kolkata");

  // Convert the IST time to the target timezone
  const targetTime = istTime.clone().tz(targetTimeZone);

  // Return only the time in the target timezone
  return targetTime.format("hh:mm A");
}

const SearchTime = ({route}) => {
  const navigation = useNavigation();

  const {locationdata} = route.params;

  console.log(locationdata);

  const [searchData, setSearchData] = useState('');

  const [showLoading, setLoading] = useState(false);

  const [data, setData] = useState([
    {id: '1', title: '08 : 00 AM'},
    {id: '2', title: '10 : 00 AM'},
    {id: '3', title: '12 : 00 PM'},
    {id: '4', title: '02 : 00 PM'},
    {id: '5', title: '04 : 00 PM'},
    {id: '6', title: '06 : 00 PM'},
    {id: '7', title: '08 : 00 PM'},
    {id: '8', title: '10 : 00 PM'},
  ]);

  const dispatch = useDispatch();

  const {accesstoken,user} = useSelector(state => state.user);
  const {loading, times} = useSelector(state => state.time);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = text => {
    const filtered = times.filter(item =>
      item.lottime.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(getTimeAccordingLocation(accesstoken, locationdata._id));
  }, [dispatch, focused]);

  useEffect(() => {
    setFilteredData(times); // Update filteredData whenever locations change
  }, [times]);

  console.log('times :: ' + times);
  console.log('Filter length :: ' + filteredData.length);

  const submitHandler = () => {
    Toast.show({
      type: 'success',
      text1: 'Searching',
    });
  };

  // FOR TIMEZONE

 

  // JSON data of countries and their timezones
  const countryTimeZones = [
    { name: "India", timezone: "Asia/Kolkata" },
    { name: "United States", timezone: "America/New_York" },
    { name: "Germany", timezone: "Europe/Berlin" },
    { name: "Australia", timezone: "Australia/Sydney" },
    { name: "Japan", timezone: "Asia/Tokyo" },
    // Add all other countries and their timezones here
  ];

  // Function to convert IST to user’s timezone
  function convertISTToUserTime(adminTimeIST, userCountry) {
    // Convert admin's hardcoded IST time to a moment object
    const istTime = moment.tz(adminTimeIST, "Asia/Kolkata");

    // Find the user's timezone from the country
    const userCountryData = countryTimeZones.find(
      (country) => country.name === userCountry
    );

    if (userCountryData) {
      const userTimeZone = userCountryData.timezone;

      // Convert IST time to the user's timezone
      const userTime = istTime.clone().tz(userTimeZone);
      return userTime.format("YYYY-MM-DD hh:mm A");
    } else {
      // Handle the case where the user's country is not found
      return "Country not found!";
    }
  }

  // Example usage:
  const adminSetTimeIST = "2024-08-24 11:14"; // Admin set time in IST

  const users = [
    { name: "User A", country: "India" },
    { name: "User B", country: "United States" },
    { name: "User C", country: "Germany" },
  ];

  // Convert and display time for each user based on their country
  users.forEach((user) => {
    const userLocalTime = convertISTToUserTime(adminSetTimeIST, user.country);
    console.log(
      `${user.name} in ${user.country} sees the time: ${userLocalTime}`
    );
  });





  // Import moment-timezone if not already imported
// npm install moment-timezone


// function convertISTToSpecificTimeZone(todayDate, time, targetTimeZone) {
//   // Combine the date and time strings into a full datetime string
//   const dateTimeIST = `${todayDate} ${time}`;

//   // Convert the combined date and time to a moment object in the IST timezone
//   const istTime = moment.tz(dateTimeIST, "DD-MM-YYYY hh:mm A", "Asia/Kolkata");

//   // Convert the IST time to the target timezone
//   const targetTime = istTime.clone().tz(targetTimeZone);

//   // Return the formatted time in the target timezone
//   return targetTime.format("YYYY-MM-DD hh:mm A");
// }

// // Example usage:
// const todayDate = "29-08-2024";
// const time = "11:29 AM";
// const timezone = "Europe/Berlin";

// const convertedTime = convertISTToSpecificTimeZone(todayDate, time, timezone);
// console.log(`Converted time: ${convertedTime}`);



// Example usage:
const time = "11:32 AM";
const timezone = "America/New_York";

const convertedTime = getTimeAccordingToTimezone(time, user.country.timezone);
console.log(`Converted time: ${convertedTime}`);

console.log(user.country.timezone)

const navigationHandler = (locationdata, item) => {
  const now = moment.tz(user?.country?.timezone);
  console.log("Current Time: ", now.format("hh:mm A"));
  console.log("Current Date: ", now.format("DD-MM-YYYY"));

  const lotTimeMoment = moment.tz(
    item?.lottime,
    "hh:mm A",
    user?.country?.timezone
  );
  console.log(`Lot Time for location : ${lotTimeMoment.format("hh:mm A")}`);

  // Subtract 15 minutes from the lotTimeMoment
  const lotTimeMinus15Minutes = lotTimeMoment.clone().subtract(15, 'minutes');
  
  const isLotTimeClose = now.isSameOrAfter(lotTimeMinus15Minutes) && now.isBefore(lotTimeMoment);
  console.log(`Is it within 15 minutes of the lot time? ${isLotTimeClose}`);

  if (isLotTimeClose) {
      console.log("Navigating to PlayArena...");
      Toast.show({
        type: 'info',
        text1: 'Entry is close for this session',
        text2: 'Please choose next available time'
      })
     
  } else {
      console.log("It's too early or past the lot time.");
       navigation.navigate('PlayArena', {
        locationdata: locationdata,
        timedata: item,
      })
  }
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
                Search Time
              </GradientTextWhite>

              {/** Search container */}

              <View
                style={{
                  height: heightPercentageToDP(7),
                  flexDirection: 'row',
                  backgroundColor: COLORS.white_s,
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
                  placeholder="Search for time"
                  placeholderTextColor={COLORS.black}
                  label="Search"
                  onChangeText={handleSearch}
                />
              </View>
            </View>

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
                        navigation.navigate('SearchDate', {
                          timedata: item,
                          locationdata: locationdata,
                        })
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
                          {getTimeAccordingToTimezone(item.lottime, user?.country?.timezone)}
                        </Text>
                        <TouchableOpacity
                         onPress={() => navigationHandler(locationdata,item)}
                        >
                          <Text
                            style={{
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_Regular,
                              fontSize: heightPercentageToDP(2.5),
                            }}>
                            Play
                          </Text>
                        </TouchableOpacity>
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

export default SearchTime;

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
