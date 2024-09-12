import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import Loading from '../../components/helpercComponent/Loading';
import {useGetHistoryQuery} from '../../helper/Networkcall';
import NoDataFound from '../../components/helpercComponent/NoDataFound';
import moment from 'moment';

const History = () => {
  const {accesstoken, user} = useSelector(state => state.user);
  const [expandedItems, setExpandedItems] = useState({});

  console.log('Accesstoken :: ' + accesstoken);
  console.log('User ID :: ' + user.userId);

  const {
    data: historyapidatas,
    error,
    isLoading,
    refetch,
  } = useGetHistoryQuery({accesstoken : accesstoken, userId : user.userId })

  console.log('History isloading :: ' + isLoading);
  console.log('History :: ' + JSON.stringify(error));
  console.log('History data :: ' + JSON.stringify(historyapidatas));

  useFocusEffect(
    useCallback(() => {
      // Refetch the data when the screen is focused
      refetch();
    }, [refetch]),
  );

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDateTime = dateTimeString => {
    return moment(dateTimeString).format('MMMM DD, YYYY');
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

              {isLoading ? (
                <View
                  style={{
                    height: heightPercentageToDP(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Loading />
                </View>
              ) : historyapidatas?.transactions.length === 0 ? (
                <View>
                  <NoDataFound data={'No History Found'} />
                </View>
              ) : (
                <FlatList
                  data={historyapidatas?.transactions}
                  renderItem={({item}) => (
                    <LinearGradient
                      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                      start={{x: 0, y: 0}} // start from left
                      end={{x: 1, y: 0}} // end at right
                      style={{
                        justifyContent: 'flex-start',
                        height: expandedItems[item._id]
                          ? heightPercentageToDP(20)
                          : heightPercentageToDP(10),
                        borderRadius: heightPercentageToDP(2),
                        marginTop: heightPercentageToDP(2),
                      }}>
                      <TouchableOpacity
                        onPress={() => toggleItem(item._id)}
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
                              source={
                                item.transactionType === 'Deposit'
                                  ? require('../../../assets/image/deposit.png')
                                  : require('../../../assets/image/withdraw.png')
                              }
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
                                : {item.amount} {user.country.countrycurrencysymbol}
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
                                {formatDateTime(item.createdAt)}
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
                                  item.paymentStatus === 'Completed'
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
                                fontSize: heightPercentageToDP(1.1),
                              }}>
                              {item.paymentStatus}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => toggleItem(item._id)}
                            style={{
                              width: '40%',
                              paddingHorizontal: 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginEnd: heightPercentageToDP(2),
                            }}>
                            <LinearGradient
                              colors={[COLORS.lightWhite, COLORS.white_s]}
                              style={styles.expandIconContainer}>
                              <Ionicons
                                name={
                                  expandedItems[item._id]
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

                      {expandedItems[item._id] && (
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
                                {item.paymentType}
                              </Text>
                            </View>
                            <View style={styles.detailContainer}>
                              <Text style={styles.detailLabel}>
                                {item.transactionType === 'Deposit'
                                  ? 'Transaction ID'
                                  : ''}
                              </Text>
                              <Text style={styles.detailValue}>
                                {item.transactionId}
                              </Text>
                            </View>
                          </View>
                        </>
                      )}
                    </LinearGradient>
                  )}
                  keyExtractor={item => item._id.toString()}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  ListFooterComponent={() => (
                    <View
                      style={{
                        height: heightPercentageToDP(20),
                      }}></View>
                  )}
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
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useState} from 'react';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import Background from '../../components/background/Background';
// import {COLORS, FONT} from '../../../assets/constants';
// import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
// import Loading from '../../components/helpercComponent/Loading';
// import {useGetHistoryQuery} from '../../helper/Networkcall';
// import NoDataFound from '../../components/helpercComponent/NoDataFound';
// import moment from 'moment';

// const historyapidata = [
//   {
//     id: 1,
//     amount: '638383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
//   {
//     id: 2,
//     amount: '8383',
//     currency: 'INR',
//     date: 'Apr 09, 2024 05:36 PM',
//     status: 'pending',
//     paymentmethod: 'Bank',
//     transactionid: '2938398398238',
//     type: 'withdraw',
//   },
//   {
//     id: 3,
//     amount: '9638383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
//   {
//     id: 4,
//     amount: '238383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
//   {
//     id: 5,
//     amount: '138383',
//     currency: 'INR',
//     date: 'Apr 19, 2024 05:36 PM',
//     status: 'success',
//     paymentmethod: 'UPI',
//     transactionid: '2938398398238',
//     type: 'deposit',
//   },
// ];

// const History = () => {

//   const {accesstoken, user} = useSelector(state => state.user);
//   const [expandedItems, setExpandedItems] = useState({});

//   console.log("Accesstoken :: "+accesstoken)
//   console.log("User ID :: "+user.userId)

//   const {
//     data: historyapidatas,
//     error,
//     isLoading,
//   } = useGetHistoryQuery(accesstoken, user.userId);

//   console.log('History isloading :: ' + isLoading);
//   console.log('History :: ' + JSON.stringify(error));
//   console.log('History data :: ' + JSON.stringify(historyapidatas));

//   const toggleItem = id => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const formatDateTime = (dateTimeString) => {
//     return moment(dateTimeString).format('MMMM DD, YYYY hh:mm A');
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Background />

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
//                 }}
//               />
//             </View>

//             <View style={{margin: heightPercentageToDP(2)}}>
//               <GradientTextWhite style={styles.textStyle}>
//                 History
//               </GradientTextWhite>

//               {isLoading ? (
//                 <View
//                   style={{
//                     height: heightPercentageToDP(30),
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <Loading />
//                 </View>
//               ) : !historyapidatas && error?.data.message ===
//                 'No transactions found for this user' ? (
//                 <View>
//                   <NoDataFound data={'No History Found'} />
//                 </View>
//               ) : (
//                 <FlatList
//                   data={historyapidatas.transactions}
//                   renderItem={({item}) => (
//                     <LinearGradient
//                       colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                       start={{x: 0, y: 0}} // start from left
//                       end={{x: 1, y: 0}} // end at right
//                       style={{
//                         justifyContent: 'flex-start',
//                         height: expandedItems[item._id]
//                           ? heightPercentageToDP(20)
//                           : heightPercentageToDP(10),
//                         borderRadius: heightPercentageToDP(2),
//                         marginTop: heightPercentageToDP(2),
//                       }}>
//                       <TouchableOpacity
//                         onPress={() => toggleItem(item._id)}
//                         style={{
//                           flex: 1,
//                           borderTopLeftRadius: heightPercentageToDP(2),
//                           borderTopEndRadius: heightPercentageToDP(2),
//                           flexDirection: 'row',
//                         }}>
//                         <View
//                           style={{
//                             width: widthPercentageToDP(68),
//                             flexDirection: 'row',
//                             borderTopLeftRadius: heightPercentageToDP(2),
//                             borderTopEndRadius: heightPercentageToDP(2),
//                           }}>
//                           <View
//                             style={{
//                               backgroundColor: COLORS.white_s,
//                               padding: heightPercentageToDP(1.5),
//                               borderRadius: heightPercentageToDP(1),
//                               marginVertical: heightPercentageToDP(2),
//                               marginHorizontal: heightPercentageToDP(1),
//                             }}>
//                             <Image
//                               source={
//                                 item.transactionType === 'Deposit'
//                                   ? require('../../../assets/image/deposit.png')
//                                   : require('../../../assets/image/withdraw.png')
//                               }
//                               resizeMode="cover"
//                               style={{
//                                 height: 25,
//                                 width: 25,
//                               }}
//                             />
//                           </View>

//                           <View style={{flex: 1}}>
//                             <View
//                               style={{
//                                 flexDirection: 'row',
//                                 flex: 1,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'center',
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(1.6),
//                                   color: COLORS.black,
//                                 }}>
//                                 Amount
//                               </Text>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Bold,
//                                   fontSize: heightPercentageToDP(2),
//                                   color: COLORS.black,
//                                   width: '70%',
//                                 }}
//                                 numberOfLines={2}>
//                                 : {item.amount}
//                               </Text>
//                             </View>

//                             <View
//                               style={{
//                                 flexDirection: 'row',
//                                 flex: 1,
//                                 justifyContent: 'flex-start',
//                                 alignItems: 'center',
//                               }}>
//                               <Text
//                                 style={{
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(1.8),
//                                   color: COLORS.black,
//                                 }}>
//                                 {formatDateTime(item.createdAt)}
//                               </Text>
//                             </View>
//                           </View>
//                         </View>

//                         <View style={{flex: 1, flexDirection: 'row'}}>
//                           <View
//                             style={{
//                               width: '60%',
//                               paddingHorizontal: 4,
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                             }}>
//                             <LinearGradient
//                               colors={[COLORS.lightWhite, COLORS.white_s]}
//                               style={styles.iconContainer}>
//                               <AntDesign
//                                 name={
//                                   item.paymentStatus === 'Success'
//                                     ? 'check'
//                                     : 'clockcircleo'
//                                 }
//                                 size={heightPercentageToDP(2)}
//                                 color={COLORS.darkGray}
//                               />
//                             </LinearGradient>
//                             <Text
//                               style={{
//                                 fontFamily: FONT.Montserrat_Regular,
//                                 color: COLORS.black,
//                                 fontSize: heightPercentageToDP(1.2),
//                               }}>
//                               {item.paymentStatus}
//                             </Text>
//                           </View>

//                           <TouchableOpacity
//                             onPress={() => toggleItem(item._id)}
//                             style={{
//                               width: '40%',
//                               paddingHorizontal: 4,
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                               marginEnd: heightPercentageToDP(2)
//                             }}>
//                             <LinearGradient
//                               colors={[COLORS.lightWhite, COLORS.white_s]}
//                               style={styles.expandIconContainer}>
//                               <Ionicons
//                                 name={
//                                   expandedItems[item._id]
//                                     ? 'remove-outline'
//                                     : 'add-outline'
//                                 }
//                                 size={heightPercentageToDP(2)}
//                                 color={COLORS.darkGray}
//                               />
//                             </LinearGradient>
//                           </TouchableOpacity>
//                         </View>
//                       </TouchableOpacity>

//                       {expandedItems[item._id] && (
//                         <>
//                           <View
//                             style={{
//                               height: 1,
//                               backgroundColor: COLORS.white_s,
//                               marginHorizontal: heightPercentageToDP(2),
//                             }}
//                           />
//                           <View
//                             style={{
//                               flex: 1,
//                               borderBottomLeftRadius: heightPercentageToDP(2),
//                               borderBottomEndRadius: heightPercentageToDP(2),
//                               flexDirection: 'row',
//                               padding: heightPercentageToDP(1),
//                             }}>
//                             <View style={styles.detailContainer}>
//                               <Text style={styles.detailLabel}>
//                                 Payment Method
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                 {item.paymentType}
//                               </Text>
//                             </View>
//                             <View style={styles.detailContainer}>
//                               <Text style={styles.detailLabel}>
//                                 Transaction ID
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                 {item.transactionId}
//                               </Text>
//                             </View>
//                           </View>
//                         </>
//                       )}
//                     </LinearGradient>
//                   )}
//                   keyExtractor={item => item._id.toString()}
//                   initialNumToRender={10}
//                   maxToRenderPerBatch={10}
//                   windowSize={10}
//                   ListFooterComponent={() => (
//                     <View style={{
//                       height: heightPercentageToDP(20)
//                     }}></View>
//                   )}
//                 />
//               )}
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
//   iconContainer: {
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(1),
//   },
//   expandIconContainer: {
//     borderRadius: heightPercentageToDP(2),
//     padding: heightPercentageToDP(0.6),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   detailContainer: {
//     width: '50%',
//     justifyContent: 'space-evenly',
//     paddingStart: heightPercentageToDP(2),
//   },
//   detailLabel: {
//     fontFamily: FONT.Montserrat_Regular,
//     color: COLORS.black,
//     fontSize: heightPercentageToDP(2),
//   },
//   detailValue: {
//     fontFamily: FONT.Montserrat_SemiBold,
//     color: COLORS.black,
//     fontSize: heightPercentageToDP(2),
//   },
// });
