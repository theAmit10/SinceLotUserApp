import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import Loading from '../../components/helpercComponent/Loading';

const historyapidata = [
  {
    id: 1,
    amount: '638383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    status: 'success',
    paymentmethod: 'UPI',
    transactionid: '2938398398238',
    type: 'deposit',
  },
  {
    id: 2,
    amount: '8383',
    currency: 'INR',
    date: 'Apr 09, 2024 05:36 PM',
    status: 'pending',
    paymentmethod: 'Bank',
    transactionid: '2938398398238',
    type: 'withdraw',
  },
  {
    id: 3,
    amount: '9638383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    status: 'success',
    paymentmethod: 'UPI',
    transactionid: '2938398398238',
    type: 'deposit',
  },
  {
    id: 4,
    amount: '238383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    status: 'success',
    paymentmethod: 'UPI',
    transactionid: '2938398398238',
    type: 'deposit',
  },
  {
    id: 5,
    amount: '138383',
    currency: 'INR',
    date: 'Apr 19, 2024 05:36 PM',
    status: 'success',
    paymentmethod: 'UPI',
    transactionid: '2938398398238',
    type: 'deposit',
  },
];

const History = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {accesstoken} = useSelector(state => state.user);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={{flex: 1}}>
      <Background />

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(85),
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
                }}
              />
            </View>

            <View style={{margin: heightPercentageToDP(2)}}>
              <GradientTextWhite style={styles.textStyle}>
                History
              </GradientTextWhite>

              {false ? (
                <Loading />
              ) : (
                <FlatList
                  data={historyapidata}
                  renderItem={({item}) => (
                    <LinearGradient
                      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                      style={{
                        justifyContent: 'flex-start',
                        height: expandedItems[item.id]
                          ? heightPercentageToDP(20)
                          : heightPercentageToDP(10),
                        borderRadius: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                      }}>
                      <TouchableOpacity
                        onPress={() => toggleItem(item.id)}
                        style={{
                          flex: 1,
                          borderTopLeftRadius: heightPercentageToDP(2),
                          borderTopEndRadius: heightPercentageToDP(2),
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            width: widthPercentageToDP(68),
                            flexDirection: 'row',
                            borderTopLeftRadius: heightPercentageToDP(2),
                            borderTopEndRadius: heightPercentageToDP(2),
                          }}>
                          <View
                            style={{
                              backgroundColor: COLORS.white_s,
                              padding: heightPercentageToDP(1.5),
                              borderRadius: heightPercentageToDP(1),
                              marginVertical: heightPercentageToDP(2),
                              marginHorizontal: heightPercentageToDP(1),
                            }}>
                            <Image
                              source={item.type === 'deposit' ? require('../../../assets/image/deposit.png') :require('../../../assets/image/withdraw.png')}
                              resizeMode="cover"
                              style={{
                                height: 25,
                                width: 25,
                              }}
                            />
                          </View>

                          <View style={{flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(1.6),
                                  color: COLORS.black,
                                }}>
                                Amount
                              </Text>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Bold,
                                  fontSize: heightPercentageToDP(2),
                                  color: COLORS.black,
                                  width: '70%',
                                }}
                                numberOfLines={2}>
                                : {item.amount} {item.currency}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: FONT.Montserrat_Regular,
                                  fontSize: heightPercentageToDP(1.8),
                                  color: COLORS.black,
                                }}>
                                {item.date}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <View
                            style={{
                              width: '60%',
                              paddingHorizontal: 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <LinearGradient
                              colors={[COLORS.lightWhite, COLORS.white_s]}
                              style={styles.iconContainer}>
                              <AntDesign
                                name={
                                  item.status === 'success'
                                    ? 'check'
                                    : 'clockcircleo'
                                }
                                size={heightPercentageToDP(2)}
                                color={COLORS.darkGray}
                              />
                            </LinearGradient>
                            <Text
                              style={{
                                fontFamily: FONT.Montserrat_Regular,
                                color: COLORS.black,
                                fontSize: heightPercentageToDP(1.2),
                              }}>
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => toggleItem(item.id)}
                            style={{
                              width: '40%',
                              paddingHorizontal: 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <LinearGradient
                              colors={[COLORS.lightWhite, COLORS.white_s]}
                              style={styles.expandIconContainer}>
                              <Ionicons
                                name={
                                  expandedItems[item.id]
                                    ? 'remove-outline'
                                    : 'add-outline'
                                }
                                size={heightPercentageToDP(2)}
                                color={COLORS.darkGray}
                              />
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>

                      {expandedItems[item.id] && (
                        <>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: COLORS.white_s,
                              marginHorizontal: heightPercentageToDP(2),
                            }}
                          />
                          <View
                            style={{
                              flex: 1,
                              borderBottomLeftRadius: heightPercentageToDP(2),
                              borderBottomEndRadius: heightPercentageToDP(2),
                              flexDirection: 'row',
                              padding: heightPercentageToDP(1),
                            }}>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailLabel}>
                                Payment Method
                              </Text>
                              <Text style={styles.detailValue}>
                                {item.paymentmethod}
                              </Text>
                            </View>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailLabel}>
                                Transaction ID
                              </Text>
                              <Text style={styles.detailValue}>
                                {item.transactionid}
                              </Text>
                            </View>
                          </View>
                        </>
                      )}
                    </LinearGradient>
                  )}
                  keyExtractor={item => item.id.toString()}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                />
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  iconContainer: {
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
  },
  expandIconContainer: {
    borderRadius: heightPercentageToDP(2),
    padding: heightPercentageToDP(0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    width: '50%',
    justifyContent: 'space-evenly',
    paddingStart: heightPercentageToDP(2),
  },
  detailLabel: {
    fontFamily: FONT.Montserrat_Regular,
    color: COLORS.black,
    fontSize: heightPercentageToDP(2),
  },
  detailValue: {
    fontFamily: FONT.Montserrat_SemiBold,
    color: COLORS.black,
    fontSize: heightPercentageToDP(2),
  },
});

// import {
//   FlatList,
//   Image,
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
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Toast from 'react-native-toast-message';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import Background from '../../components/background/Background';
// import {COLORS, FONT} from '../../../assets/constants';
// import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
// import Loading from '../../components/helpercComponent/Loading';

// const historyapidata = [
//   {
//     id: 1,
//     amount: '638383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05: 36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
//   {
//     id: 2,
//     amount: '8383',
//     currency: 'INR',
//     date: 'Apr 09, 2024 05: 36 PM',
//     status: 'pending',
//     paymentmethod: 'Bank',
//     transactionid: '2938398398238',
//     type: 'withdraw',
//   },
//   {
//     id: 3,
//     amount: '9638383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05: 36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
//   {
//     id: 4,
//     amount: '238383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05: 36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
//   {
//     id: 5,
//     amount: '138383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05: 36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
// ];

// const History = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const {accesstoken} = useSelector(state => state.user);
//   const [isHiddenBottomView, setIsHiddenBottomView] = useState(false);

//   const hideView = () => {
//     if (isHiddenBottomView) {
//       setIsHiddenBottomView(false);
//     } else {
//       setIsHiddenBottomView(true);
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Background />

//       {/** Main Cointainer */}

//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         <ImageBackground
//           source={require('../../../assets/image/tlwbg.jpg')}
//           style={{
//             width: '100%',
//             maxHeight: heightPercentageToDP(85),
//             minHeight: heightPercentageToDP(60),
//           }}
//           imageStyle={{
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderTopRightRadius: heightPercentageToDP(5),
//           }}>
//           <View
//             style={{
//               maxHeight: heightPercentageToDP(85),
//               minHeight: heightPercentageToDP(60),
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
//                 margin: heightPercentageToDP(2),
//               }}>
//               <GradientTextWhite style={styles.textStyle}>
//                 History
//               </GradientTextWhite>

//               {/** History Content */}

//                 {false ? (
//                   <Loading />
//                 ) : (
//                   <FlatList
//                     data={historyapidata}
//                     renderItem={({item, index}) => (
//                         <LinearGradient
//                         key={index}
//                         colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                         style={{
//                           justifyContent: 'flex-start',
//                           height: isHiddenBottomView
//                             ? heightPercentageToDP(20)
//                             : heightPercentageToDP(10),
//                           borderRadius: heightPercentageToDP(2),
//                           marginTop: heightPercentageToDP(2),
//                         }}>
//                         <TouchableOpacity
//                           onPress={hideView}
//                           style={{
//                             flex: 1,
//                             borderTopLeftRadius: heightPercentageToDP(2),
//                             borderTopEndRadius: heightPercentageToDP(2),
//                             flexDirection: 'row',
//                           }}>
//                           <View
//                             style={{
//                               width: widthPercentageToDP(68),
//                               flexDirection: 'row',
//                               borderTopLeftRadius: heightPercentageToDP(2),
//                               borderTopEndRadius: heightPercentageToDP(2),
//                             }}>
//                             <View
//                               style={{
//                                 backgroundColor: COLORS.white_s,
//                                 padding: heightPercentageToDP(1.5),
//                                 borderRadius: heightPercentageToDP(1),
//                                 marginVertical: heightPercentageToDP(2),
//                                 marginHorizontal: heightPercentageToDP(1),
//                               }}>
//                               <Image
//                                 source={require('../../../assets/image/deposit.png')}
//                                 resizeMode="cover"
//                                 style={{
//                                   height: 25,
//                                   width: 25,
//                                 }}
//                               />
//                             </View>

//                             <View
//                               style={{
//                                 flex: 1,
//                               }}>
//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   flex: 1,

//                                   justifyContent: 'flex-start',
//                                   alignItems: 'center',
//                                   gap: 2,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(1.6),
//                                     color: COLORS.black,
//                                   }}>
//                                   Amount
//                                 </Text>
//                                 <Text
//                                   style={{
//                                     fontFamily: FONT.Montserrat_Bold,
//                                     fontSize: heightPercentageToDP(2),
//                                     color: COLORS.black,
//                                     width: '70%',
//                                   }}
//                                   numberOfLines={2}>
//                                   : 50930 INR
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flexDirection: 'row',
//                                   flex: 1,
//                                   justifyContent: 'flex-start',
//                                   alignItems: 'center',
//                                 }}>
//                                 <Text
//                                   style={{
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(1.8),
//                                     color: COLORS.black,
//                                   }}>
//                                   Apr 19, 2024 05: 37 PM
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>

//                           <View
//                             style={{
//                               flex: 1,
//                               flexDirection: 'row',
//                             }}>
//                             <View
//                               style={{
//                                 width: '50%',

//                                 paddingHorizontal: 4,
//                                 justifyContent: 'center',
//                               }}>
//                               <LinearGradient
//                                 colors={[COLORS.lightWhite, COLORS.white_s]}
//                                 className="rounded-full p-3">
//                                 <AntDesign
//                                   name={'check'}
//                                   size={heightPercentageToDP(2)}
//                                   color={COLORS.darkGray}
//                                 />
//                               </LinearGradient>

//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   color: COLORS.black,
//                                   fontSize: heightPercentageToDP(1.2),
//                                 }}>
//                                 Success
//                               </Text>
//                             </View>

//                             <TouchableOpacity
//                               onPress={hideView}
//                               style={{
//                                 width: '50%',
//                                 paddingHorizontal: 4,
//                                 justifyContent: 'center',
//                               }}>
//                               <LinearGradient
//                                 colors={[COLORS.lightWhite, COLORS.white_s]}
//                                 className="rounded-md p-1"
//                                 style={{
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}>
//                                 <Ionicons
//                                   name={
//                                     isHiddenBottomView
//                                       ? 'remove-outline'
//                                       : 'add'
//                                   }
//                                   size={heightPercentageToDP(2)}
//                                   color={COLORS.darkGray}
//                                 />
//                               </LinearGradient>
//                             </TouchableOpacity>
//                           </View>
//                         </TouchableOpacity>

//                         {isHiddenBottomView && (
//                           <>
//                             <View
//                               style={{
//                                 height: 1,
//                                 backgroundColor: COLORS.white_s,
//                                 paddingHorizontal: heightPercentageToDP(2),
//                               }}
//                             />
//                             <View
//                               style={{
//                                 flex: 1,
//                                 borderBottomLeftRadius: heightPercentageToDP(2),
//                                 borderBottomEndRadius: heightPercentageToDP(2),
//                                 flexDirection: 'row',
//                               }}>
//                               <View
//                                 style={{
//                                   width: '50%',
//                                   height: '100%',
//                                   justifyContent: 'space-evenly',
//                                   paddingStart: heightPercentageToDP(2),
//                                 }}>
//                                 <Text
//                                   style={{
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     color: COLORS.black,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Payment Method
//                                 </Text>
//                                 <Text
//                                   style={{
//                                     fontFamily: FONT.Montserrat_SemiBold,
//                                     color: COLORS.black,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}
//                                   numberOfLines={2}>
//                                   UPI
//                                 </Text>
//                               </View>
//                               <View
//                                 style={{
//                                   width: '50%',

//                                   height: '100%',
//                                   justifyContent: 'space-evenly',
//                                   paddingStart: heightPercentageToDP(1),
//                                 }}>
//                                 <Text
//                                   style={{
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     color: COLORS.black,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Transaction ID
//                                 </Text>
//                                 <Text
//                                   style={{
//                                     fontFamily: FONT.Montserrat_SemiBold,
//                                     color: COLORS.black,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}
//                                   numberOfLines={2}>
//                                   783838je83d9849
//                                 </Text>
//                               </View>
//                             </View>
//                           </>
//                         )}
//                       </LinearGradient>
//                     )}
//                     keyExtractor={item => item._id}
//                     initialNumToRender={10} // Render initial 10 items
//                     maxToRenderPerBatch={10} // Batch size to render
//                     windowSize={10} // Number of items kept in memory
//                   />
//                 )}

//             </View>
//           </View>
//         </ImageBackground>
//       </View>
//     </View>
//   );
// };

// export default History;

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
//   textStyleContent: {
//     fontSize: heightPercentageToDP(3),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
// });
