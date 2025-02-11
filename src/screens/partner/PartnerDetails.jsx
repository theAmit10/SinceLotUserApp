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
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import {useGetAboutPartnerQuery} from '../../helper/Networkcall';
import Loading from '../../components/helpercComponent/Loading';

const PartnerDetails = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {item} = route.params;
  const {accesstoken, user} = useSelector(state => state.user);

  const userid = item.userId;

  const {isLoading, error, data, refetch} = useGetAboutPartnerQuery({
    accesstoken,
    userid,
  });
  const [partner, setpartner] = useState(null);

  useEffect(() => {
    if (!isLoading && data) {
      setpartner(data.partner);

      console.log('Hey data');
      console.log('Hey data', data);
    }
    if (error) {
      console.log(error);
    }
  }, [data, isLoading, error]);

  const isFocused = useIsFocused();
  useEffect(() => {
    refetch();
  }, [isFocused]);

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
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(3),
              }}>
              <Text
                style={{
                  fontFamily: FONT.Montserrat_SemiBold,
                  color: COLORS.white_s,
                  fontSize: heightPercentageToDP(2),
                }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}>
                {item.userId}
              </Text>
              <View
                style={{
                  width: widthPercentageToDP(20),
                  height: heightPercentageToDP(0.8),
                  backgroundColor: COLORS.grayBg,
                  borderRadius: heightPercentageToDP(2),
                }}></View>
              <Text
                style={{
                  fontFamily: FONT.Montserrat_SemiBold,
                  color: COLORS.white_s,
                  fontSize: heightPercentageToDP(2),
                }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}>
                {item.name}
              </Text>
            </View>

            <GradientTextWhite
              style={{
                ...styles.textStyle,
                paddingLeft: heightPercentageToDP(2),
              }}>
              Partner Details
            </GradientTextWhite>

            {/** Content Container */}

            {isLoading ? (
              <Loading />
            ) : (
              <View
                style={{
                  flex: 1,
                  padding: heightPercentageToDP(1),
                }}>
                <ScrollView
                  contentContainerStyle={{
                    paddingBottom: heightPercentageToDP(2),
                  }}
                  showsVerticalScrollIndicator={false}>
                  {/** USER PLAY HISTORY DETAILS */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UserPlayHistory', {item})
                    }>
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
                        <Text style={styles.subtitle}>
                          User’s Play History Details
                        </Text>
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

                  {/** ALL PARTNER */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UserTransactionHistory', {item})
                    }>
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
                        <Text style={styles.subtitle}>
                          User’s Transaction details
                        </Text>
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

                  {/** All Profit Decrease */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CreateNotification', {
                        userdata: item,
                      })
                    }>
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
                          Send Notification
                        </GradientText>
                        <Text style={styles.subtitle}>
                          Send Notification for User’s
                        </Text>
                      </View>

                      <View style={styles.iconContainer}>
                        <Ionicons
                          name={'notifications'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                          style={styles.icon}
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/** Increse Percentage */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UpdatePercentage', {item: partner})
                    }>
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
                          Increase Percentage
                        </GradientText>
                        <Text style={styles.subtitle}>
                          Update Partner Percentage
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

                  {/** Decrease Percentage */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DecresePercentage', {item: partner})
                    }>
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
                          Update Partner Percentage
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
                </ScrollView>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default PartnerDetails;

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
