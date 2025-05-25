import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONT} from '../../../assets/constants';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import WhiteBall from '../../components/powerball/WhiteBall';
import PowerballWhite from '../../components/powerball/PowerballWhite';

/*************  ✨ Codeium Command ⭐  *************/
/**
 * PrizeComponent displays a stylized view for the 1st Prize in the powerball game.
 * It includes a gradient background, prize details, and winner information.
 * The component is structured with responsive text and uses LinearGradient
 * for visual enhancement.
 */

/******  5a6f2ca4-c42a-4123-8a18-aa7f65d55be4  *******/
const PrizeComponent = ({
  amount,
  title,
  description,
  numberofwinner,
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
}) => {
  return (
    <LinearGradient
      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
      start={{x: 0, y: 0}} // start from left
      end={{x: 1, y: 0}} // end at right
      style={styles.prizeOption}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <Text
            style={{
              fontFamily: FONT.Montserrat_Bold,
              fontSize: heightPercentageToDP(3),
              color: COLORS.black,
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontFamily: FONT.Montserrat_Regular,
              fontSize: heightPercentageToDP(2),
              color: COLORS.white_s,
            }}
            numberOfLines={2}
            adjustsFontSizeToFit={true}>
            {description}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: heightPercentageToDP(1),
          }}>
          <Text
            style={{
              fontFamily: FONT.Montserrat_Bold,
              fontSize: heightPercentageToDP(2),
              color: COLORS.black,
            }}>
            {numberofwinner} Winner
          </Text>
          <LinearGradient
            colors={[COLORS.green, COLORS.green]}
            start={{x: 0, y: 0}} // start from left
            end={{x: 10, y: 0}} // end at right
            style={{
              padding: heightPercentageToDP(1),
              borderRadius: heightPercentageToDP(2),
              paddingHorizontal: heightPercentageToDP(4),
              minWidth: widthPercentageToDP(35),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: FONT.Montserrat_SemiBold,
                fontSize: heightPercentageToDP(2),
                color: COLORS.white_s,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit={true}>
              {amount}
            </Text>
          </LinearGradient>
        </View>
      </View>
      <View
        style={{
          height: heightPercentageToDP(7),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: heightPercentageToDP(0.2),
        }}>
        <PowerballWhite value={first} />
        <PowerballWhite value={second} />
        <PowerballWhite value={third} />
        <PowerballWhite value={fourth} />
        <PowerballWhite value={fifth} />
        <PowerballWhite value={sixth} />
      </View>
    </LinearGradient>
  );
};

export default PrizeComponent;

const styles = StyleSheet.create({
  prizeOption: {
    flexDirection: 'column',
    minHeight: heightPercentageToDP(20),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
});
