import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MainBackgroundWithoutScrollview from '../../../components/background/MainBackgroundWithoutScrollview';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONT} from '../../../../assets/constants';
import GradientText from '../../../components/helpercComponent/GradientText';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PartnerUserProfile = ({route}) => {
  const {item} = route.params;

  console.log(item);
  const navigation = useNavigation();
  return (
    <MainBackgroundWithoutScrollview
      title={'User Profile'}
      righttext={item.name}
      lefttext={item.userId}>
      {/*  PLAY HISTORY*/}
      <TouchableOpacity
        onPress={() => navigation.navigate('UserPlayHistory', {item})}>
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
            <GradientText style={styles.textStyleContent}>
              Play History
            </GradientText>
            <Text style={styles.subtitle}>User’s Play History Details</Text>
          </View>

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={'history'}
              size={heightPercentageToDP(3)}
              color={COLORS.darkGray}
              style={styles.icon}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
      {/** ALL  TRANSACTION HISTORY*/}
      <TouchableOpacity
        onPress={() => navigation.navigate('UserTransactionHistory', {item})}>
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
            <GradientText style={styles.textStyleContent}>
              Transaction History
            </GradientText>
            <Text style={styles.subtitle}>User’s Transaction details</Text>
          </View>

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={'history'}
              size={heightPercentageToDP(3)}
              color={COLORS.darkGray}
              style={styles.icon}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MainBackgroundWithoutScrollview>
  );
};

export default PartnerUserProfile;

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
    height: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(2),
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
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
});
