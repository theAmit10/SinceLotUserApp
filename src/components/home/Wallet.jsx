import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';

import Ionicons from 'react-native-vector-icons/Ionicons';
import GradientText from '../helpercComponent/GradientText';

const Wallet = ({wallet}) => {
  return (
    <View
      style={{
        height: heightPercentageToDP(15),
        width: widthPercentageToDP(90),
        backgroundColor: COLORS.grayHalfBg,
        marginTop: heightPercentageToDP(2),
        borderRadius: heightPercentageToDP(1),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: heightPercentageToDP(2),
        marginEnd: heightPercentageToDP(2),
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text
          style={{
            transform: [{rotate: '90deg'}],
            color: COLORS.black,
            fontFamily: FONT.Montserrat_SemiBold,
            fontSize: heightPercentageToDP(2),
            
          }}>
          Balance
        </Text>
        <Text
          style={{
            transform: [{rotate: '90deg'}],
            color: COLORS.black,
            fontFamily: FONT.Montserrat_SemiBold,
            fontSize: heightPercentageToDP(2),
            marginStart: heightPercentageToDP(-5),
          }}>
          {wallet.walletName}
        </Text>
      </View>

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
      <GradientText
        style={{
          fontSize: heightPercentageToDP(3),
          fontFamily: FONT.Montserrat_Bold,
          paddingEnd: heightPercentageToDP(2),
          minWidth: heightPercentageToDP(15)
        }}>
        ₹ {wallet.balance}
      </GradientText>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
