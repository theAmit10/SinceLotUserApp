import React from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {COLORS, FONT} from '../../../assets/constants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

const SortingPartner = ({setSortBy, setSortOrder, onClose}) => {
  return (
    <LinearGradient
      colors={[COLORS.lightyellow, COLORS.darkyellow]}
      start={{x: 0, y: 0}} // start from left
      end={{x: 1, y: 0}} // end at right
      style={[styles.container, {maxHeight: heightPercentageToDP(50)}]}>
      <Text style={styles.title}>Sort Data</Text>
      <ScrollView
        style={{flex: 1}} // Ensures it takes available space
        contentContainerStyle={{paddingBottom: heightPercentageToDP(5)}} // Adds extra space at bottom
        showsVerticalScrollIndicator={false}>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('profit');
            setSortOrder('asc');
            onClose();
          }}>
          Asc by Profit Percentage
        </Text>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('profit');
            setSortOrder('desc');
            onClose();
          }}>
          Desc by Profit Percentage
        </Text>
        {/* <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('recharge');
            setSortOrder('asc');
            onClose();
          }}>
          Asc by Recharge Percentage
        </Text>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('recharge');
            setSortOrder('desc');
            onClose();
          }}>
          Desc by Recharge Percentage
        </Text> */}
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('userCount');
            setSortOrder('asc');
            onClose();
          }}>
          Asc by no. of users
        </Text>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('userCount');
            setSortOrder('desc');
            onClose();
          }}>
          Desc by no. of users
        </Text>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('walletBalance');
            setSortOrder('asc');
            onClose();
          }}>
          Asc by Game Balance
        </Text>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('walletBalance');
            setSortOrder('desc');
            onClose();
          }}>
          Desc by Game balance
        </Text>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('partnerStatus');
            setSortOrder('desc');
            onClose();
          }}>
          Active Partner
        </Text>
        <Text
          style={styles.btn}
          onPress={() => {
            setSortBy('partnerStatus');
            setSortOrder('asc');
            onClose();
          }}>
          Inactive Partner
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 50, // Adjust as per requirement
    left: 20, // Adjust as per requirement
    right: 20, // Adjust as per requirement
    elevation: 5, // For shadow effect on Android
    zIndex: 10, // To bring it above other elements
  },
  btn: {
    backgroundColor: COLORS.green,
    padding: heightPercentageToDP(2),
    textAlign: 'center',
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(2),
    color: COLORS.white_s,
    borderRadius: heightPercentageToDP(1),
    marginBottom: heightPercentageToDP(2),
  },
  title: {
    padding: heightPercentageToDP(2),
    textAlign: 'center',
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
  },
});

export default SortingPartner;
