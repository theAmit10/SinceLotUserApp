import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';

const AllPartnerComp = ({
  navigate,
  userid,
  name,
  profitpercentage,
  rechargepercentage,
  noofumser,
  walletbalance,
  item,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        console.log(item);
        navigation.navigate(navigate, {item});
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

            <View
              style={{
                flex: 1.5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.titleRegular} numberOfLines={1}>
                Game Balance
              </Text>
              <Text
                style={styles.titleBold}
                numberOfLines={1}
                adjustsFontSizeToFit={true}>
                {walletbalance}
              </Text>
            </View>
          </View>
          <View style={styles.centerLine}></View>
          <View style={styles.bottomContainer}>
            <View
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.titleRegular}>Profit</Text>
              <Text style={styles.titleBold}>{profitpercentage}</Text>
            </View>
            <View
              style={{
                flex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.titleRegular}>Recharge</Text>
              <Text style={styles.titleBold}>{rechargepercentage}</Text>
            </View>
            <View
              style={{
                flex: 1.5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.titleRegular}>Total no. of users</Text>
              <Text style={styles.titleBold} numberOfLines={1}>
                {noofumser}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              gap: heightPercentageToDP(1),
            }}>
            <View
              style={{
                height: 5,
                width: 5,
                borderRadius: 5 / 2,
                backgroundColor: item.partnerStatus ? 'green' : COLORS.red,
              }}
            />
            <Text
              style={[
                styles.titleRegular,
                {
                  color: item.partnerStatus ? 'green' : COLORS.red,
                },
              ]}
              numberOfLines={1}>
              {item.partnerStatus ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default AllPartnerComp;

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
    height: heightPercentageToDP(16),
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
