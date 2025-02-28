import React from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {heightPercentageToDP} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const PartnerUserListComp = ({navigate, userid, name, item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        console.log(item);
        navigation.navigate(navigate, {userdata: item});
      }}>
      <LinearGradient
        colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
        start={{x: 0, y: 0}} // start from left
        end={{x: 1, y: 0}} // end at right
        style={styles.paymentOption}>
        <View
          style={{
            flex: 1,
            height: '100%',
          }}>
          <View style={styles.topContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PartnerDetails', {data: item})
              }
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.titleRegular}>User ID</Text>
              <Text style={styles.titleBold}>{userid}</Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.titleRegular}>Name</Text>
              <Text style={styles.titleBold} numberOfLines={1}>
                {name}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PartnerUserListComp;

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
    backgroundColor: 'pink',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightPercentageToDP(10),
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
  topContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLine: {
    height: 1,
    backgroundColor: COLORS.white_s,
  },
  titleRegular: {
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  titleBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Bold,
  },
  titleSemiBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.white_s,
    fontFamily: FONT.Montserrat_Bold,
  },
  acceptBtn: {
    backgroundColor: COLORS.green,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(2),
  },
});
