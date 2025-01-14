import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONT} from '../../../assets/constants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

const ProfitDetailContent = () => {
  return (
    <View>
      <Text style={styles.textTitleWhite}>Partner ID</Text>
      <LinearGradient
        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
        start={{x: 0, y: 0}} // start from left
        end={{x: 1, y: 0}} // end at right
        style={styles.paymentOption}>
        <View
          style={{
            flex: 1,
            gap: heightPercentageToDP(2),
          }}>
          <Text style={styles.textTitle}>1090</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ProfitDetailContent;

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
    paymentOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: heightPercentageToDP(7),
      borderRadius: heightPercentageToDP(1),
      alignItems: 'center',
      gap: heightPercentageToDP(3),
      paddingStart: heightPercentageToDP(2),
      marginTop: heightPercentageToDP(2),
    },
    iconContainer: {
      backgroundColor: COLORS.white_s,
      padding: heightPercentageToDP(1.5),
      borderRadius: heightPercentageToDP(1),
    },
    icon: {
      height: 20,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyleContent: {
      fontSize: heightPercentageToDP(3),
      fontFamily: FONT.Montserrat_Bold,
      color: COLORS.black,
    },
    subtitle: {
      fontSize: heightPercentageToDP(1.5),
      color: COLORS.black,
      fontFamily: FONT.Montserrat_Regular,
    },
    textTitle: {
      fontSize: heightPercentageToDP(2),
      color: COLORS.black,
      fontFamily: FONT.Montserrat_Bold,
    },
    textTitleWhite: {
      fontSize: heightPercentageToDP(2),
      color: COLORS.white_s,
      fontFamily: FONT.Montserrat_Bold,
      marginBottom: heightPercentageToDP(-1),
      marginTop: heightPercentageToDP(1),
    },
  });
  