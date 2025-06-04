import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Background from '../components/background/Background';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {loadProfile} from '../redux/actions/userAction';
import Loading from '../components/helpercComponent/Loading';

const WalletBalance = ({route}) => {
  const {data} = route.params;
  const {accesstoken, user, loading} = useSelector(state => state.user);

  console.log(JSON.stringify(data));
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const navigation = useNavigation();

  const [forWallet, setForWallet] = useState(data.walletName);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [previousBalance, setPreviousBalance] = useState(null);

  // Load profile when the component mounts and when it is focused
  useEffect(() => {
    const loadProfileData = () => {
      if (accesstoken) {
        dispatch(loadProfile(accesstoken));
      }
    };

    // Call loadProfileData initially
    loadProfileData();

    // Set interval to call loadProfileData every 6 seconds
    const intervalId = setInterval(() => {
      loadProfileData();
    }, 6000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch, accesstoken, focused]);

  // Update selected wallet and check for balance changes
  useEffect(() => {
    if (!loading && user) {
      const wallet =
        forWallet === user.walletOne.walletName
          ? user.walletOne
          : user.walletTwo;

      // Check if the balance has changed
      if (wallet.balance !== previousBalance) {
        setPreviousBalance(wallet.balance); // Update previous balance to the new one
        setSelectedWallet(wallet); // Update selected wallet with new balance
      }
    }
  }, [user, forWallet, loading, previousBalance]);

  const roundToInteger = input => {
    // Convert input to a float
    const floatValue = parseFloat(input);

    // Check if it's a valid number
    if (isNaN(floatValue)) {
      return 'Invalid number'; // Handle invalid input
    }

    // Check if the number is already an integer
    if (Number.isInteger(floatValue)) {
      return floatValue; // Return the number as it is
    }

    // Return the integer part (without rounding)
    return Math.floor(floatValue);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />

      {/** Wallet Container */}
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
              <GradientTextWhite style={styles.textStyle}>
                Wallet
              </GradientTextWhite>
              <GradientTextWhite style={styles.textStyle}>
                Balance
              </GradientTextWhite>
            </View>

            {/** Result Main Container */}
            {loading && !selectedWallet ? (
              <View
                style={{
                  height: heightPercentageToDP(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Loading />
              </View>
            ) : (
              selectedWallet && (
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    padding: heightPercentageToDP(2),
                  }}>
                  <GradientText
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(3),
                      color: COLORS.black,
                      marginBottom: heightPercentageToDP(1),
                    }}>
                    {selectedWallet.walletName}
                  </GradientText>
                  <GradientText style={styles.textStyle}>
                    {roundToInteger(selectedWallet.balance)}{' '}
                    {user.country.countrycurrencysymbol}
                  </GradientText>
                  <View
                    style={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      paddingBottom: heightPercentageToDP(2),
                      gap: heightPercentageToDP(2),
                    }}>
                    {forWallet === user.walletOne.walletName ? (
                      // If forWallet matches user.walletOne.walletName, show Transaction History

                      <>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('BalanceTransfer')}
                          style={{
                            borderRadius: heightPercentageToDP(2),
                            padding: heightPercentageToDP(2),
                            height: heightPercentageToDP(7),
                            backgroundColor: COLORS.white_s,
                            width: widthPercentageToDP(90),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_SemiBold,
                              textAlign: 'center',
                              fontSize: heightPercentageToDP(2),
                            }}>
                            Balance Transfer
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('WithdrawDashboard')
                          }
                          style={{
                            borderRadius: heightPercentageToDP(2),
                            padding: heightPercentageToDP(2),
                            height: heightPercentageToDP(7),
                            backgroundColor: COLORS.white_s,
                            width: widthPercentageToDP(90),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_SemiBold,
                              textAlign: 'center',
                              fontSize: heightPercentageToDP(2),
                            }}>
                            Withdraw Payment
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      // Otherwise, show Withdraw Payment
                      <TouchableOpacity
                        onPress={() => navigation.navigate('History')}
                        style={{
                          borderRadius: heightPercentageToDP(2),
                          padding: heightPercentageToDP(2),
                          height: heightPercentageToDP(7),
                          backgroundColor: COLORS.white_s,
                          width: widthPercentageToDP(90),
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: COLORS.black,
                            fontFamily: FONT.Montserrat_SemiBold,
                            textAlign: 'center',
                            fontSize: heightPercentageToDP(2),
                          }}>
                          Transaction History
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            )}
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default WalletBalance;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
});

// import {ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../assets/constants';
// import GradientText from '../components/helpercComponent/GradientText';
// import Background from '../components/background/Background';
// import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
// import {useDispatch, useSelector} from 'react-redux';
// import {useIsFocused} from '@react-navigation/native';
// import {loadProfile} from '../redux/actions/userAction';
// import Loading from '../components/helpercComponent/Loading';

// const WalletBalance = ({route}) => {
//   const {data} = route.params;
//   const {accesstoken, user, loading} = useSelector(state => state.user);

//   console.log(JSON.stringify(data));
//   const dispatch = useDispatch();
//   const focused = useIsFocused();

//   const [forWallet, setForWallet] = useState(data.walletName);
//   const [seletedWallet, setSelectedWallet] = useState(null);

//   useEffect(() => {
//     dispatch(loadProfile(accesstoken));
//   }, [dispatch, focused]);

//   useEffect(() => {
//     if (!loading && user) {
//       if (forWallet === user.walletOne.walletName) {
//         setSelectedWallet(user.walletOne);
//       } else {
//         setSelectedWallet(user.walletTwo);
//       }
//     }
//   }, [user, seletedWallet]);

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <Background />

//       {/** Login Cointainer */}

//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         <ImageBackground
//           source={require('../../assets/image/tlwbg.jpg')}
//           style={{
//             width: '100%',
//             height: heightPercentageToDP(75),
//           }}
//           imageStyle={{
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderTopRightRadius: heightPercentageToDP(5),
//           }}>
//           <View
//             style={{
//               height: heightPercentageToDP(75),
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

//             <View
//               style={{
//                 margin: heightPercentageToDP(2),
//                 backgroundColor: 'transparent',
//               }}>
//               <GradientTextWhite style={styles.textStyle}>
//                 Wallet
//               </GradientTextWhite>
//               <GradientTextWhite style={styles.textStyle}>
//                 Balance
//               </GradientTextWhite>
//             </View>

//             {/** Result Main Container */}

//             {loading && seletedWallet === null ? (
//               <View
//                 style={{
//                   height: heightPercentageToDP(10),
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <Loading />
//               </View>
//             ) : (
//               <>
//                 {seletedWallet && (
//                   <View style={{padding: heightPercentageToDP(2)}}>
//                     <GradientText
//                       style={{
//                         fontFamily: FONT.Montserrat_Regular,
//                         fontSize: heightPercentageToDP(3),
//                         color: COLORS.black,
//                         marginBottom: heightPercentageToDP(1),
//                       }}>
//                       {seletedWallet.walletName}
//                     </GradientText>
//                     <GradientText style={styles.textStyle}>
//                       {seletedWallet.balance}{' '}
//                       {user.country.countrycurrencysymbol}
//                     </GradientText>
//                   </View>
//                 )}
//               </>
//             )}
//           </View>
//         </ImageBackground>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default WalletBalance;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
// });
