import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import TicketBall from './TicketBall';
import GreenBall from './GreenBall'; // Assuming this is an existing component
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {COLORS} from '../../../assets/constants';

const TicketView = ({
  ticket,
  ticketIndex,
  activeTicketIndex,
  activeBallIndex,
  onBallPress,
  onMultiplierPress,
  selectedNumbers
}) => {
  return (
    <View key={ticketIndex} style={styles.ticketContainer}>
      <View style={styles.ballContainer}>
        {ticket.selectedNumbers.map((num, index) => (
          <TicketBall
            key={index}
            num={num}
            isActive={
              activeTicketIndex === ticketIndex && index === activeBallIndex
            }
            isSelected={num !== null}
            ticketIndex={ticketIndex}
            ballIndex={index}
            onPress={() => onBallPress(num, ticketIndex, index)}
          />
        ))}
      </View>
      <View style={styles.multiplierContainer}>
        <TouchableOpacity
          style={[
            styles.ball,
            styles.redBall,
            ticket.multiplier && styles.selectedRedBall,
          ]}
          onPress={() => onMultiplierPress(ticketIndex)}>
          <GreenBall
            key={ticket.multiplier}
            value={ticket.multiplier || ''}
            firstcolor={COLORS.firstred}
            secondcolor={COLORS.secondred}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketContainer: {
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  ballContainer: {
    flex: 4,
    backgroundColor: 'cyan',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: heightPercentageToDP(1),
    borderBottomColor: COLORS.white_s,
    borderBottomWidth: 1,
  },
  multiplierContainer: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: heightPercentageToDP(1),
  },
});

export default TicketView;
