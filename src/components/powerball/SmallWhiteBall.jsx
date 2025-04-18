import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen'; // Assuming you're using this for responsiveness
import {COLORS, FONT} from '../../../assets/constants';
import LinearGradient from 'react-native-linear-gradient';

const SmallWhiteBall = ({value, index}) => {
  return (
    <LinearGradient
      key={index}
      colors={[COLORS.white_s, COLORS.ballGray]}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}
      style={{
        width: heightPercentageToDP(5),
        height: heightPercentageToDP(5),
        borderRadius: heightPercentageToDP(5) / 2,
        borderWidth: 0.5, // Adjust the border thickness as needed
        borderBottomColor: 'transparent', // Remove border from other sides
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* Inner LinearGradient */}
      <LinearGradient
        colors={[COLORS.white_s, COLORS.ballGray]}
        start={{x: 0.5, y: 0}} // Middle of the top
        end={{x: 0.5, y: 1}} // Middle of the bottom
        style={{
          width: '100%', // Slightly smaller than the wrapper to accommodate the border
          height: '98%',
          borderRadius: heightPercentageToDP(5) / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.semibold}>{value}</Text>
      </LinearGradient>
    </LinearGradient>
  );
};

export default SmallWhiteBall;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
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
