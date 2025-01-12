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

const PartnerDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);

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
                paddingLeft: heightPercentageToDP(2),
              }}>
              Partner
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
                {/** PROFIT DETAILS */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfitDetails')}>
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
                        Profit Details
                      </GradientText>
                      <Text style={styles.subtitle}>My Profit Details</Text>
                    </View>

                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name={'card-account-details-outline'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                        style={styles.icon}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/** ALL PARTNER */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('AllPartner')}>
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
                        All Partner
                      </GradientText>
                      <Text style={styles.subtitle}>
                        List of all Partner data
                      </Text>
                    </View>

                    <View style={styles.iconContainer}>
                      <FontAwesome6
                        name={'people-group'}
                        size={heightPercentageToDP(2.5)}
                        color={COLORS.darkGray}
                        style={styles.icon}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/** All Profit Decrease */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('AllProfitDecrease')}>
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
                        All Profit Decrease
                      </GradientText>
                      <Text style={styles.subtitle}>
                        List of Decrease Request{' '}
                      </Text>
                    </View>

                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name={'human-capacity-decrease'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                        style={styles.icon}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/** Decrease Percentage */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('CryptoDeposit')}>
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
                        Decrease Percentage
                      </GradientText>
                      <Text style={styles.subtitle}>
                        Decrease Partner Percentage
                      </Text>
                    </View>

                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name={'brightness-percent'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                        style={styles.icon}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/** All Users */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('AllPartnerUsers')}>
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
                        All Users
                      </GradientText>
                      <Text style={styles.subtitle}>
                        List of all users data
                      </Text>
                    </View>

                    <View style={styles.iconContainer}>
                      <FontAwesome6
                        name={'people-group'}
                        size={heightPercentageToDP(2.5)}
                        color={COLORS.darkGray}
                        style={styles.icon}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/** All Recharge */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('AllRecharge')}>
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
                        All Recharge
                      </GradientText>
                      <Text style={styles.subtitle}>Recharge Partner data</Text>
                    </View>

                    <View style={styles.iconContainer}>
                      <FontAwesome6
                        name={'money-bill-trend-up'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                        style={styles.icon}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/** Recharge Method */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('RechargeMethod')}>
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
                        Recharge Method
                      </GradientText>
                      <Text style={styles.subtitle}>
                        Recharge Payment Methods{' '}
                      </Text>
                    </View>

                    <View style={styles.iconContainer}>
                      <FontAwesome6
                        name={'money-check'}
                        size={heightPercentageToDP(3)}
                        color={COLORS.darkGray}
                        style={styles.icon}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default PartnerDashboard;

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
