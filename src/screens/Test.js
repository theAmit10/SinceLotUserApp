import React, { useState, useEffect } from 'react';
import Countdown from 'react-native-countdown-component';
import moment from 'moment-timezone';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, FONT } from '../../assets/constants';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const Test = ({ timeString = '03:00 PM', timezone = 'Asia/Kolkata' }) => {
  const { user } = useSelector((state) => state.user);
  const [timeDifference, setTimeDifference] = useState(null);
  const [key, setKey] = useState(0); // Add a key to force re-render countdown component

  // Function to parse time string and set countdown based on user's timezone
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
      timezone
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
      setKey((prevKey) => prevKey + 1); // Force Countdown re-render with key change
      console.log('State Updated with Time Difference:', diff);
    } else {
      console.log('The target time is not in the future. Countdown cannot start.');
    }
  };

  useEffect(() => {
    // Start countdown based on passed props
    if (timezone) {
      settingTimerForNextResult(timeString, timezone);
    } else {
      console.log('Timezone not available');
    }
  }, [timeString, timezone]); // Recalculate on timeString or timezone change

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
      }}>
      {timeDifference !== null ? (
        <Countdown
          key={key} // Use a key to force re-render when the timeDifference changes
          until={timeDifference}
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
            marginStart: heightPercentageToDP(-2),
            marginBottom: heightPercentageToDP(9),
          }}
        />
      ) : (
        <Text>Loading timer...</Text>
      )}
    </View>
  );
};

export default Test;



// import React, {useState, useEffect} from 'react';
// import Countdown from 'react-native-countdown-component';
// import moment from 'moment-timezone';
// import {View, Text} from 'react-native';
// import {useSelector} from 'react-redux';
// import {COLORS, FONT} from '../../assets/constants';
// import {heightPercentageToDP} from 'react-native-responsive-screen';

// const Test = ({timeString = '03:00 PM', timezone = 'Asia/Kolkata'}) => {
//   const {user} = useSelector(state => state.user);
//   const [timeDifference, setTimeDifference] = useState(null);

//   // Function to parse time string and set countdown based on user's timezone
//   const settingTimerForNextResult = (timeString, timezone) => {
//     console.log("User's Timezone: ", timezone);
//     const [time, period] = timeString.split(' '); // Split time and period
//     const [hour, minute] = time.split(':').map(Number);

//     let hour24 = hour;
//     if (period.toLowerCase() === 'pm' && hour24 < 12) {
//       hour24 += 12;
//     } else if (period.toLowerCase() === 'am' && hour24 === 12) {
//       hour24 = 0;
//     }

//     // Get current time in user's timezone
//     const currentTime = moment().tz(timezone);
//     console.log('Current Time in User Timezone:', currentTime.format());

//     // Get target time
//     const targetTime = moment.tz(
//       `${currentTime.format('YYYY-MM-DD')} ${hour24}:${minute}:00`,
//       'YYYY-MM-DD HH:mm:ss',
//       timezone,
//     );
//     console.log('Target Time:', targetTime.format());

//     // If target time has passed, move to next day
//     if (targetTime.isBefore(currentTime)) {
//       targetTime.add(1, 'day');
//       console.log('Target Time Updated for Next Day:', targetTime.format());
//     }

//     // Calculate difference in seconds
//     const diff = targetTime.diff(currentTime, 'seconds');
//     console.log('Time Difference in Seconds:', diff);

//     if (diff > 0) {
//       setTimeDifference(diff); // Only set if the difference is positive
//     } else {
//       console.log(
//         'The target time is not in the future. Countdown cannot start.',
//       );
//     }
//   };

//   useEffect(() => {
//     // Start countdown based on passed props
//     if (timezone) {
//       settingTimerForNextResult(timeString, timezone);
//     } else {
//       console.log('Timezone not available');
//     }
//   }, [timeString, timezone]);

//   return (
//     <View
//       style={{
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         flex: 1,

//       }}>
//       {timeDifference !== null ? (
//         <Countdown
//           until={timeDifference}
//           size={12}
//           timeToShow={['H', 'M', 'S']}
//           digitStyle={{
//             backgroundColor: 'transparent', // Set background to transparent
//             borderWidth: 0, // Remove border
//             paddingHorizontal: 0, // Remove horizontal padding
//             paddingVertical: 0, // Remove vertical padding
//             margin: 0, // Remove margin
//           }}
//           digitTxtStyle={{color: COLORS.black}}
//           timeLabelStyle={{
//             color: COLORS.grayHalfBg,
//             fontWeight: 'bold',
//           }}
//           separatorStyle={{
//             color: COLORS.black,
//             marginTop: heightPercentageToDP(-2),
//             marginHorizontal: heightPercentageToDP(-8),

//             paddingHorizontal: 0, // Remove horizontal padding
//           }}
//           timeLabels={{
//             h: 'Hours',
//             m: 'Minutes',
//             s: 'Seconds',
//           }}
//           showSeparator
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center', // Align items to center
//             transform: [{rotate: '90deg'}],
//             color: COLORS.black,
//             fontFamily: FONT.Montserrat_SemiBold,
//             fontSize: heightPercentageToDP(3),
//             marginStart: heightPercentageToDP(-2),
//             marginBottom: heightPercentageToDP(9),
//           }}
//         />
//       ) : (
//         <Text>Loading timer...</Text>
//       )}
//     </View>
//   );
// };

// export default Test;
