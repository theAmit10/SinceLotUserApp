import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import GradientText from '../../components/helpercComponent/GradientText';
import ProfitDetailContent from '../../components/profitdetails/ProfitDetailContent';
import Clipboard from '@react-native-clipboard/clipboard';

const ProfitDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);

  const copyToClipboard = val => {
    Clipboard.setString(val);
    Toast.show({
      type: 'success',
      text1: 'Text Copied',
      text2: 'The text has been copied to your clipboard!',
    });
  };

  return (
    <View style={{flex: 1}}>
      <Background />

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(80),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(80),
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

            <GradientTextWhite
              style={{
                ...styles.textStyle,
                paddingLeft: heightPercentageToDP(1),
              }}>
              Profit Details
            </GradientTextWhite>

            {/** Content Container */}

            <View
              style={{
                flex: 1,
                padding: heightPercentageToDP(1),
              }}>
              <ScrollView
                contentContainerStyle={{paddingBottom: heightPercentageToDP(2)}}
                showsVerticalScrollIndicator={false}>
                {/** PARTNER ID */}
                <Text style={styles.textTitle}>Partner ID</Text>
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

                  <TouchableOpacity
                    onPress={() => copyToClipboard('user id')}
                    style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={'content-copy'}
                      size={heightPercentageToDP(2.5)}
                      color={COLORS.darkGray}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </LinearGradient>
                {/** PARTNER PROFIT PERCENTAGE */}
                <Text style={styles.textTitle}>Profit Percentage</Text>
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
                    <Text style={styles.textTitle}>10%</Text>
                  </View>
                </LinearGradient>

                {/** PARTNER  Recharge Percentage */}
                <Text style={styles.textTitle}>Recharge Percentage</Text>
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
                    <Text style={styles.textTitle}>10%</Text>
                  </View>
                </LinearGradient>

                {/** PARTNER  Total no. of User’s */}
                <Text style={styles.textTitle}>Total no. of User’s</Text>
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
                    <Text style={styles.textTitle}>10</Text>
                  </View>
                </LinearGradient>
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default ProfitDetails;

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
    marginBottom: heightPercentageToDP(2),
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
