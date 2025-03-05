import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONT} from '../../../assets/constants';
import GradientText from '../../components/helpercComponent/GradientText';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getTimeAccordingToTimezone} from '../SearchTime';
import {useSelector} from 'react-redux';

const TimesComp = ({
  powertime,
  subtitle = 'PLAY NOW',
  navigate = 'PowerballGame',
  item,
}) => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.user);
  return (
    <TouchableOpacity onPress={() => navigation.navigate(navigate, {item})}>
      <LinearGradient
        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
        start={{x: 0, y: 0}} // start from left
        end={{x: 1, y: 0}} // end at right
        style={styles.paymentOption}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 2,
              justifyContent: 'space-between',
            }}>
            <GradientText style={styles.textStyleContent}>
              {getTimeAccordingToTimezone(powertime, user?.country?.timezone)}
            </GradientText>
            <Text style={styles.semibold}>{subtitle}</Text>
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <MaterialCommunityIcons
                name={'trophy-award'}
                size={heightPercentageToDP(3)}
                color={COLORS.white_s}
                style={styles.icon}
              />
              <Image
                source={require('../../../assets/image/cat.png')}
                style={{width: 55, height: 55}}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default TimesComp;

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
    flexDirection: 'column',
    height: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  resultOption: {
    flexDirection: 'column',
    height: heightPercentageToDP(18),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  prizeOption: {
    flexDirection: 'column',
    height: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  iconContainer: {
    backgroundColor: COLORS.white_s,
    padding: heightPercentageToDP(1.5),
    borderRadius: heightPercentageToDP(1),
    height: heightPercentageToDP(6),
  },
  icon: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
