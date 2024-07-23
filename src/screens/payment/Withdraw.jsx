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
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Toast from 'react-native-toast-message';
  import {useIsFocused, useNavigation} from '@react-navigation/native';
  import {useDispatch, useSelector} from 'react-redux';
  import LinearGradient from 'react-native-linear-gradient';
  import Background from '../../components/background/Background';
  import {COLORS, FONT} from '../../../assets/constants';
  import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
  
  const Withdraw = () => {
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
                height: heightPercentageToDP(85),
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
  
              {/** Content Container */}
  
              <ScrollView
              showsVerticalScrollIndicator={false}
              >
  
              <View
                style={{
                  margin: heightPercentageToDP(2),
                }}>
                <GradientTextWhite style={styles.textStyle}>
                Withdraw Deposit
                </GradientTextWhite>
  
                {/** UPI  */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UpiDeposit')
                  }>
                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      height: heightPercentageToDP(10),
                      borderRadius: heightPercentageToDP(2),
                      alignItems: 'center',
                      gap: heightPercentageToDP(3),
                      paddingStart: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(2),
                    }}>
                    <View
                      style={{
                        backgroundColor: COLORS.white_s,
                        padding: heightPercentageToDP(1.5),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                      <Image
                          source={require('../../../assets/image/upi.png')}
                          resizeMode="cover"
                          style={{
                            height: 25,
                            width: 25,
                          }}
                        />
                    </View>
  
                    <GradientTextWhite style={styles.textStyleContent}>
                      UPI
                    </GradientTextWhite>
                  </LinearGradient>
                </TouchableOpacity>
  
                {/** BANK  */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BankDeposit')
                  }>
                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      height: heightPercentageToDP(10),
                      borderRadius: heightPercentageToDP(2),
                      alignItems: 'center',
                      gap: heightPercentageToDP(3),
                      paddingStart: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(2),
                    }}>
                    <View
                      style={{
                        backgroundColor: COLORS.white_s,
                        padding: heightPercentageToDP(1.5),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                      <Image
                          source={require('../../../assets/image/bank.png')}
                          resizeMode="cover"
                          style={{
                            height: 25,
                            width: 25,
                          }}
                        />
                    </View>
  
                    <GradientTextWhite style={styles.textStyleContent}>
                      Bank
                    </GradientTextWhite>
                  </LinearGradient>
                </TouchableOpacity>
  
                {/** Paypal  */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Result', {
                      datedata: item,
                    })
                  }>
                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      height: heightPercentageToDP(10),
                      borderRadius: heightPercentageToDP(2),
                      alignItems: 'center',
                      gap: heightPercentageToDP(3),
                      paddingStart: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(2),
                    }}>
                    <View
                      style={{
                        backgroundColor: COLORS.white_s,
                        padding: heightPercentageToDP(1.5),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                      <Image
                          source={require('../../../assets/image/paypal.png')}
                          resizeMode="cover"
                          style={{
                            height: 25,
                            width: 25,
                          }}
                        />
                    </View>
  
                    <GradientTextWhite style={styles.textStyleContent}>
                      Paypal
                    </GradientTextWhite>
                  </LinearGradient>
                </TouchableOpacity>
                {/** Skrill  */}
  
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Result', {
                      datedata: item,
                    })
                  }>
                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      height: heightPercentageToDP(10),
                      borderRadius: heightPercentageToDP(2),
                      alignItems: 'center',
                      gap: heightPercentageToDP(3),
                      paddingStart: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(2),
                    }}>
                    <View
                      style={{
                        backgroundColor: COLORS.white_s,
                        padding: heightPercentageToDP(1.5),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                       <Image
                          source={require('../../../assets/image/skrill.png')}
                          resizeMode="cover"
                          style={{
                            height: 25,
                            width: 25,
                          }}
                        />
                    </View>
  
                    <GradientTextWhite style={styles.textStyleContent}>
                      Skrill
                    </GradientTextWhite>
                  </LinearGradient>
                </TouchableOpacity>
                {/** Crypto  */}
  
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Result', {
                      datedata: item,
                    })
                  }>
                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      height: heightPercentageToDP(10),
                      borderRadius: heightPercentageToDP(2),
                      alignItems: 'center',
                      gap: heightPercentageToDP(3),
                      paddingStart: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(2),
                    }}>
                    <View
                      style={{
                        backgroundColor: COLORS.white_s,
                        padding: heightPercentageToDP(1.5),
                        borderRadius: heightPercentageToDP(1),
                      }}>
                       <Image
                          source={require('../../../assets/image/crypto.png')}
                          resizeMode="cover"
                          style={{
                            height: 25,
                            width: 25,
                          }}
                        />
                    </View>
  
                    <GradientTextWhite style={styles.textStyleContent}>
                      Crypto
                    </GradientTextWhite>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
  
              </ScrollView>
  
              
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };
  
  export default Withdraw;
  
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
    title: {
      color: COLORS.white_s,
      fontFamily: FONT.SF_PRO_MEDIUM,
    },
    textStyleContent: {
      fontSize: heightPercentageToDP(3),
      fontFamily: FONT.Montserrat_Bold,
      color: COLORS.black,
    },
  });
  
  // Complete Blank Screen
  
  // import {
  //   FlatList,
  //   ImageBackground,
  //   StyleSheet,
  //   Text,
  //   TextInput,
  //   TouchableOpacity,
  //   View,
  // } from 'react-native';
  // import React, {useEffect, useState} from 'react';
  // import {
  //   heightPercentageToDP,
  //   widthPercentageToDP,
  // } from 'react-native-responsive-screen';
  // import Fontisto from 'react-native-vector-icons/Fontisto';
  // import Toast from 'react-native-toast-message';
  // import {useIsFocused, useNavigation} from '@react-navigation/native';
  // import {useDispatch, useSelector} from 'react-redux';
  // import LinearGradient from 'react-native-linear-gradient';
  // import Background from '../../components/background/Background';
  // import {COLORS, FONT} from '../../../assets/constants';
  // import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
  
  // const Payment = () => {
  //   const navigation = useNavigation();
  //   const dispatch = useDispatch();
  
  //   const {accesstoken} = useSelector(state => state.user);
  
  //   return (
  //     <View style={{flex: 1}}>
  //       <Background />
  
  //       {/** Main Cointainer */}
  
  //       <View style={{flex: 1, justifyContent: 'flex-end'}}>
  //         <ImageBackground
  //           source={require('../../../assets/image/tlwbg.jpg')}
  //           style={{
  //             width: '100%',
  //             height: heightPercentageToDP(85),
  //           }}
  //           imageStyle={{
  //             borderTopLeftRadius: heightPercentageToDP(5),
  //             borderTopRightRadius: heightPercentageToDP(5),
  //           }}>
  //           <View
  //             style={{
  //               height: heightPercentageToDP(85),
  //               width: widthPercentageToDP(100),
  
  //               borderTopLeftRadius: heightPercentageToDP(5),
  //               borderTopRightRadius: heightPercentageToDP(5),
  //             }}>
  //             {/** Top Style View */}
  //             <View
  //               style={{
  //                 height: heightPercentageToDP(5),
  //                 width: widthPercentageToDP(100),
  //                 justifyContent: 'center',
  //                 alignItems: 'center',
  //               }}>
  //               <View
  //                 style={{
  //                   width: widthPercentageToDP(20),
  //                   height: heightPercentageToDP(0.8),
  //                   backgroundColor: COLORS.grayBg,
  //                   borderRadius: heightPercentageToDP(2),
  //                 }}></View>
  //             </View>
  
  //             {/** Content Container */}
  
  //             <View
  //               style={{
  //                 height: heightPercentageToDP(21),
  //                 margin: heightPercentageToDP(2),
  //               }}>
  //               <GradientTextWhite style={styles.textStyle}>
  //                 Search
  //               </GradientTextWhite>
  //             </View>
  //           </View>
  //         </ImageBackground>
  //       </View>
  //     </View>
  //   );
  // };
  
  // export default Payment;
  
  // const styles = StyleSheet.create({
  //   textStyle: {
  //     fontSize: heightPercentageToDP(4),
  //     fontFamily: FONT.Montserrat_Bold,
  //     color: COLORS.black,
  //   },
  //   container: {
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     marginTop: 20,
  //     height: heightPercentageToDP(20),
  //   },
  //   item: {
  //     padding: heightPercentageToDP(2),
  //     marginVertical: heightPercentageToDP(1),
  //     marginHorizontal: heightPercentageToDP(2),
  //     borderRadius: heightPercentageToDP(1),
  //   },
  //   title: {
  //     color: COLORS.white_s,
  //     fontFamily: FONT.SF_PRO_MEDIUM,
  //   },
  // });
  