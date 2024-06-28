import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Background from '../components/background/Background';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const WalletBalance = ({route}) => {
  const {data} = route.params;

  console.log(JSON.stringify(data));

  const submitHandler = () => {
    console.log('Working on login ');
    Toast.show({
      type: 'success',
      text1: 'Processing',
    });
  };

  return (
    <View style={{flex: 1}}>
      <Background />

      

      {/** Login Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(75),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>

<View
        style={{
          height: heightPercentageToDP(75),
          width: widthPercentageToDP(100),

          borderTopLeftRadius: heightPercentageToDP(5),
          borderTopRightRadius: heightPercentageToDP(5),
        }}>
        {/** Top Style View */}
        <View
          style={{
            height: heightPercentageToDP(5),
            width: widthPercentageToDP(100),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: widthPercentageToDP(20),
              height: heightPercentageToDP(0.8),
              backgroundColor: COLORS.grayBg,
              borderRadius: heightPercentageToDP(2),
            }}></View>
        </View>

        <View
        style={{
          margin: heightPercentageToDP(2),
          backgroundColor: 'transparent',
        }}>
        <GradientTextWhite style={styles.textStyle}>Wallet</GradientTextWhite>
        <GradientTextWhite style={styles.textStyle}>Balance</GradientTextWhite>
      </View>

        {/** Result Main Container */}

        <View style={{padding: heightPercentageToDP(2)}}>
          <GradientText style={{fontFamily: FONT.Montserrat_Regular, fontSize: heightPercentageToDP(3), color: COLORS.black, marginBottom: heightPercentageToDP(1)}}>{data.walletName}</GradientText>
          <GradientText style={styles.textStyle}>₹ {data.balance}</GradientText>
        </View>
      </View>
            </ImageBackground>
            </View>

  
    </View>
  );
};

export default WalletBalance;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black
  },
});
