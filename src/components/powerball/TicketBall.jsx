import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { COLORS, FONT } from '../../../assets/constants';

const TicketBall = ({
  num,
  isActive,
  isSelected,
  ticketIndex,
  ballIndex,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={[COLORS.green, COLORS.green]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.whiteBall,
          {
            width: heightPercentageToDP(5),
            height: heightPercentageToDP(5),
            borderRadius: heightPercentageToDP(5) / 2,
            borderWidth: 0.5,
            borderBottomColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          },
          isActive && styles.activeBall,
          isSelected && styles.selectedBall,
        ]}>
        <LinearGradient
          colors={[COLORS.green, COLORS.green]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            width: '100%',
            height: '98%',
            borderRadius: heightPercentageToDP(5) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.semibold}>{num}</Text>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  whiteBall: {
    marginHorizontal: heightPercentageToDP(0.5),
  },
  activeBall: {
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
  },
  selectedBall: {
    borderWidth: 1.5,
    borderColor: COLORS.blue,
  },
  semibold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.white_s,
    fontFamily: FONT.Montserrat_SemiBold,
  },
});

export default TicketBall;
