import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';

import Ionicons from 'react-native-vector-icons/Ionicons';
import GradientText from '../helpercComponent/GradientText';
import {useSelector} from 'react-redux';

const Wallet = ({wallet}) => {
  const {accesstoken, user} = useSelector(state => state.user);

  const roundToInteger = input => {
    const floatValue = parseFloat(input);
    if (isNaN(floatValue)) {
      return 'Invalid number';
    }
    if (Number.isInteger(floatValue)) {
      return floatValue;
    }
    return Math.floor(floatValue);
  };

  return (
    <View
      style={{
        height: heightPercentageToDP(15),
        width: widthPercentageToDP(82),
        backgroundColor: COLORS.grayHalfBg,
        marginTop: heightPercentageToDP(2),
        borderRadius: heightPercentageToDP(1),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: heightPercentageToDP(2),
        marginEnd: heightPercentageToDP(2),
      }}>
      {/* Rotated Text Container */}
      <View
        style={{
          transform: [{rotate: '90deg'}],
          flexDirection: 'column', // Stack texts vertically
          alignItems: 'center', // Center horizontally
        }}>
        {/* Wallet Name */}
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONT.Montserrat_SemiBold,
            fontSize: heightPercentageToDP(2),
            textAlign: 'center',
            marginBottom: heightPercentageToDP(1), // Space between texts
          }}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {wallet.walletName}
        </Text>

        {/* Balance */}
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONT.Montserrat_SemiBold,
            fontSize: heightPercentageToDP(2),
            textAlign: 'center',
          }}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          Balance
        </Text>
      </View>

      {/* Icon Container */}
      <View
        style={{
          backgroundColor: COLORS.white_s,
          padding: heightPercentageToDP(1.5),
          borderRadius: heightPercentageToDP(1),
          marginStart: heightPercentageToDP(-3),
        }}>
        <Ionicons
          name={'wallet'}
          size={heightPercentageToDP(3)}
          color={COLORS.darkGray}
        />
      </View>

      {/* Gradient Text */}
      <GradientText
        style={{
          fontSize: heightPercentageToDP(2.5),
          fontFamily: FONT.Montserrat_Bold,
          paddingEnd: heightPercentageToDP(2),
          minWidth: heightPercentageToDP(15),
        }}
        numberOfLines={1}
        adjustsFontSizeToFit={true}>
        {roundToInteger(wallet.balance)} {user?.country?.countrycurrencysymbol}
      </GradientText>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({});


// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../../assets/constants';

// import Ionicons from 'react-native-vector-icons/Ionicons';
// import GradientText from '../helpercComponent/GradientText';
// import {useSelector} from 'react-redux';

// const Wallet = ({wallet}) => {
//   const {accesstoken, user} = useSelector(state => state.user);
//   const roundToInteger = input => {
//     // Convert input to a float
//     const floatValue = parseFloat(input);

//     // Check if it's a valid number
//     if (isNaN(floatValue)) {
//       return 'Invalid number'; // Handle invalid input
//     }

//     // Check if the number is already an integer
//     if (Number.isInteger(floatValue)) {
//       return floatValue; // Return the number as it is
//     }

//     // Return the integer part (without rounding)
//     return Math.floor(floatValue);
//   };

//   return (
//     <View
//       style={{
//         height: heightPercentageToDP(15),
//         width: widthPercentageToDP(82),
//         backgroundColor: COLORS.grayHalfBg,
//         marginTop: heightPercentageToDP(2),
//         borderRadius: heightPercentageToDP(1),
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: heightPercentageToDP(2),
//         marginEnd: heightPercentageToDP(2),
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           backgroundColor: 'pink'
//         }}>
//         <Text
//           style={{
//             transform: [{rotate: '90deg'}],
//             color: COLORS.black,
//             fontFamily: FONT.Montserrat_SemiBold,
//             fontSize: heightPercentageToDP(2),
//           }}
//           numberOfLines={1}
//           adjustsFontSizeToFit={true}
//           >
//           Balance
//         </Text>
//         <Text
//           style={{
//             transform: [{rotate: '90deg'}],
//             color: COLORS.black,
//             fontFamily: FONT.Montserrat_SemiBold,
//             fontSize: heightPercentageToDP(2),
//             marginStart: heightPercentageToDP(-3),
//             maxWidth: heightPercentageToDP(14),
//             textAlign: 'center',
//           }}
//           numberOfLines={1}
//           adjustsFontSizeToFit={true}
//           >
//           {wallet.walletName}
//         </Text>
//       </View>

//       <View
//         style={{
//           backgroundColor: COLORS.white_s,
//           padding: heightPercentageToDP(1.5),
//           borderRadius: heightPercentageToDP(1),
//           marginStart: heightPercentageToDP(-3),
//         }}>
//         <Ionicons
//           name={'wallet'}
//           size={heightPercentageToDP(3)}
//           color={COLORS.darkGray}
//         />
//       </View>
//       <GradientText
//         style={{
//           fontSize: heightPercentageToDP(2.5),
//           fontFamily: FONT.Montserrat_Bold,
//           paddingEnd: heightPercentageToDP(2),
//           minWidth: heightPercentageToDP(15),
//         }}
//         numberOfLines={1}
//         adjustsFontSizeToFit={true}
//         >
//         {roundToInteger(wallet.balance)} {user?.country?.countrycurrencysymbol}
//       </GradientText>
//     </View>
//   );
// };

// export default Wallet;

// const styles = StyleSheet.create({});
