import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';

const WhiteBall = ({num, isSelected, onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={
          isSelected
            ? [COLORS.white_s, COLORS.yellow] // Change to yellow gradient if selected
            : [COLORS.white_s, COLORS.ballGray] // Default gradient
        }
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        style={[
          styles.ball,
          {
            width: heightPercentageToDP(6),
            height: heightPercentageToDP(6),
            borderRadius: heightPercentageToDP(6) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        {/* Inner LinearGradient */}
        <LinearGradient
          colors={
            isSelected
              ? [COLORS.white_s, COLORS.yellow]
              : [COLORS.white_s, COLORS.ballGray]
          }
          start={{x: 0.5, y: 0}} // Middle of the top
          end={{x: 0.5, y: 1}} // Middle of the bottom
          style={{
            width: '92%', // Slightly smaller to accommodate the border
            height: '92%',
            borderRadius: heightPercentageToDP(6) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.semibold}>{num}</Text>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
};

export default WhiteBall;

const styles = StyleSheet.create({
  ball: {
    marginHorizontal: heightPercentageToDP(0.5),
  },
  semibold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_SemiBold,
  },
});
