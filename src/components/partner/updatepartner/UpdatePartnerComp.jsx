import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {COLORS, FONT} from '../../../../assets/constants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

const UpdatePartnerComp = ({title, value}) => {
  return (
    <LinearGradient
      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
      start={{x: 0, y: 0}} // start from left
      end={{x: 1, y: 0}} // end at right
      style={styles.container}>
      <View
        style={{
          paddingStart: heightPercentageToDP(1),
        }}>
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONT.Montserrat_Regular,
            fontSize: heightPercentageToDP(1.8),
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: COLORS.white_s,
          paddingStart: heightPercentageToDP(1),
          borderBottomLeftRadius: heightPercentageToDP(1),
          borderBottomRightRadius: heightPercentageToDP(1),
        }}>
        <Text
          style={{
            fontFamily: FONT.Montserrat_Bold,
            fontSize: heightPercentageToDP(2.5),
            color: COLORS.black,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          >
          {value}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default UpdatePartnerComp;

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(9),
    borderRadius: heightPercentageToDP(1),

    marginTop: heightPercentageToDP(2),
  },
});
