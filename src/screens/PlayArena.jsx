// import React from 'react';
// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../assets/constants';
// import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
// import Background from '../components/background/Background';
// import {useNavigation} from '@react-navigation/native';

// const numberdata = [
//   {id: '1', number: '101'},
//   {id: '2', number: '102'},
//   {id: '3', number: '103'},
//   {id: '4', number: '104'},
//   {id: '5', number: '105'},
//   {id: '6', number: '106'},
//   {id: '7', number: '107'},
//   {id: '8', number: '108'},
//   {id: '9', number: '109'},
//   {id: '10', number: '110'},
//   {id: '11', number: '111'},
//   {id: '12', number: '112'},
// ];

// const PlayArena = () => {
//   const navigation = useNavigation();

//   // const renderItem = ({ item, index }) => (
//   //   <View style={[
//   //     styles.itemContainer,
//   //     { backgroundColor: index % 2 === 0 ? COLORS.white_s : COLORS.blue }
//   //   ]}>
//   //     <LinearGradient
//   //       colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//   //       style={styles.gradient}
//   //     >
//   //       <Text style={styles.itemText}>{item.number}</Text>
//   //       <Text style={styles.selectText}>Select</Text>
//   //     </LinearGradient>
//   //   </View>
//   // );

//   const renderItem = ({item, index}) => {
//     const groupedTimes = [];
//     for (let i = 0; i < item.length; i += 3) {
//       groupedTimes.push(item.slice(i, i + 3));
//     }

//     return (
//       <>
//         <TouchableOpacity>
//           <LinearGradient
//             colors={
//               index % 2 === 0
//                 ? [COLORS.lightblue, COLORS.midblue]
//                 : [COLORS.lightyellow, COLORS.darkyellow]
//             }
//             style={styles.item}>
//             <View style={{flex: 1, justifyContent: 'flex-end'}}>
//               <ImageBackground
//                 source={require('../../assets/image/tlwbg.jpg')}
//                 imageStyle={{
//                   borderRadius: heightPercentageToDP(5),
//                   margin: heightPercentageToDP(2),
//                 }}>
//                 <View
//                   style={{
//                     backgroundColor: COLORS.black,
//                     margin: heightPercentageToDP(2),
//                     borderRadius: heightPercentageToDP(5),
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     opacity: 0.8,
//                   }}>
//                   {groupedTimes.map((pair, idx) => (
//                     <View key={idx} style={[styles.timeRow]}>
//                       {pair.map(timeItem => (
//                         <View
//                           key={timeItem.id}
//                           style={{
//                             width: widthPercentageToDP(25),
//                             marginVertical: heightPercentageToDP(1),
//                             marginHorizontal: heightPercentageToDP(1),
//                             borderRadius: heightPercentageToDP(1),
//                             position: 'relative',
//                           }}>
//                           <LinearGradient
//                             colors={[COLORS.lightblue, COLORS.white_s]}
//                             style={{
//                               width: widthPercentageToDP(14),
//                               flex: 1,
//                             }}></LinearGradient>

//                           <LinearGradient
//                             colors={[COLORS.lightblue, COLORS.midblue]}
//                             style={{
//                               width: widthPercentageToDP(21),
//                               height: heightPercentageToDP(6.5),
//                               backgroundColor: 'cyan',
//                               position: 'absolute',
//                               top: heightPercentageToDP(1.5),
//                               left: heightPercentageToDP(2),
//                             }}>
//                             <View
//                               style={{
//                                 height: heightPercentageToDP(5),
//                                 width: widthPercentageToDP(10),
//                                 right: heightPercentageToDP(-0.5),
//                                 position: 'absolute',
//                                 borderStyle: 'solid',
//                                 borderLeftWidth: heightPercentageToDP(3),
//                                 borderRightWidth: heightPercentageToDP(3),
//                                 top: heightPercentageToDP(0.7),
//                                 borderBottomWidth: heightPercentageToDP(4.5),
//                                 borderLeftColor: 'transparent',
//                                 borderRightColor: 'transparent',
//                                 borderBottomColor: COLORS.white_s,
//                                 transform: [{rotate: '-90deg'}],
//                               }}></View>
//                             <View
//                               style={{
//                                 flex: 2,
//                                 paddingStart: heightPercentageToDP(1),
//                               }}>
//                               <Text
//                                 style={{
//                                   color: COLORS.black,
//                                   fontFamily: FONT.Montserrat_Bold,
//                                   fontSize: heightPercentageToDP(3),
//                                 }}>
//                                 {item.number}
//                               </Text>
//                             </View>
//                             <View
//                               style={{
//                                 flex: 1,
//                                 justifyContent: 'flex-end',
//                                 alignItems: 'flex-end',
//                                 marginEnd: heightPercentageToDP(4),
//                               }}>
//                               <Text
//                                 style={{
//                                   color: COLORS.black,
//                                   fontFamily: FONT.Montserrat_Regular,
//                                   fontSize: heightPercentageToDP(1.7),
//                                 }}>
//                                 Select
//                               </Text>
//                             </View>
//                           </LinearGradient>
//                         </View>
//                       ))}
//                     </View>
//                   ))}
//                 </View>
//               </ImageBackground>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>
//       </>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Background />
//       <View style={styles.innerContainer}>
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('UpdateProfile')}
//             style={styles.profileImageContainer}>
//             <Image
//               source={require('../../assets/image/dark_user.png')}
//               resizeMode="cover"
//               style={styles.profileImage}
//             />
//           </TouchableOpacity>

//           <View style={styles.userInfo}>
//             <Text style={styles.userInfoText}>
//               User ID
//               <Text style={styles.userId}>: 1007</Text>
//             </Text>
//             <Text style={styles.userName}>Wasu</Text>
//           </View>

//           <View style={styles.userBalance}>
//             <Text style={styles.userBalanceText}>09:00 PM</Text>
//             <Text style={styles.userBalanceText}>17-05-2024</Text>
//             <Text style={styles.userBalanceText}>
//               Balance
//               <Text style={styles.userBalanceAmount}>: 19000</Text>
//             </Text>
//           </View>
//         </View>

//         <ImageBackground
//           source={require('../../assets/image/tlwbg.jpg')}
//           style={styles.imageBackground}
//           imageStyle={styles.imageBackgroundStyle}>
//           <View style={styles.topBar}>
//             <GradientTextWhite style={styles.locationText}>
//               Canada 🇨🇦
//             </GradientTextWhite>
//             <View style={styles.divider} />
//             <GradientTextWhite style={styles.timeText}>
//               09:00 AM
//             </GradientTextWhite>
//           </View>
//           <FlatList
//             data={numberdata}
//             renderItem={renderItem}
//             keyExtractor={item => item.id}
//             initialNumToRender={10}
//             maxToRenderPerBatch={10}
//             windowSize={10}
//           />
//         </ImageBackground>
//       </View>
//     </View>
//   );
// };

// export default PlayArena;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   headerContainer: {
//     margin: heightPercentageToDP(2),
//     backgroundColor: COLORS.grayHalfBg,
//     height: heightPercentageToDP(12),
//     borderRadius: heightPercentageToDP(2),
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImageContainer: {
//     borderRadius: 100,
//     overflow: 'hidden',
//     width: 70,
//     height: 70,
//     margin: heightPercentageToDP(1),
//   },
//   profileImage: {
//     height: 70,
//     width: 70,
//   },
//   userInfo: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingStart: heightPercentageToDP(1),
//   },
//   userInfoText: {
//     fontFamily: FONT.Montserrat_Regular,
//     color: COLORS.black,
//   },
//   userId: {
//     fontFamily: FONT.HELVETICA_BOLD,
//     fontSize: heightPercentageToDP(2),
//   },
//   userName: {
//     fontFamily: FONT.HELVETICA_BOLD,
//     fontSize: heightPercentageToDP(2),
//     color: COLORS.black,
//   },
//   userBalance: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     paddingEnd: heightPercentageToDP(1),
//   },
//   userBalanceText: {
//     fontFamily: FONT.Montserrat_Regular,
//     color: COLORS.black,
//   },
//   userBalanceAmount: {
//     fontFamily: FONT.HELVETICA_BOLD,
//     fontSize: heightPercentageToDP(2),
//   },
//   imageBackground: {
//     width: '100%',
//     height: heightPercentageToDP(65),
//   },
//   imageBackgroundStyle: {
//     borderTopLeftRadius: heightPercentageToDP(5),
//     borderTopRightRadius: heightPercentageToDP(5),
//   },
//   topBar: {
//     height: heightPercentageToDP(5),
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: heightPercentageToDP(2),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
//   divider: {
//     width: widthPercentageToDP(20),
//     height: heightPercentageToDP(0.8),
//     backgroundColor: COLORS.grayBg,
//     borderRadius: heightPercentageToDP(2),
//   },
//   timeText: {
//     fontSize: heightPercentageToDP(2),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
//   flatListContent: {
//     padding: heightPercentageToDP(2),
//   },
//   itemContainer: {
//     flex: 1,
//     margin: heightPercentageToDP(1),
//     borderRadius: heightPercentageToDP(1),
//     overflow: 'hidden',
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: heightPercentageToDP(2),
//   },
//   itemText: {
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_Bold,
//     fontSize: heightPercentageToDP(3),
//   },
//   selectText: {
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_Regular,
//     fontSize: heightPercentageToDP(1.7),
//     marginTop: heightPercentageToDP(0.5),
//   },
//   item: {
//     padding: heightPercentageToDP(2),
//     marginVertical: heightPercentageToDP(1),
//     marginHorizontal: heightPercentageToDP(2),
//     borderRadius: heightPercentageToDP(1),
//     flexDirection: 'row',
//   },
// });

import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import Background from '../components/background/Background';
import {useNavigation} from '@react-navigation/native';

const numberdata = [
  {id: '1', number: '101'},
  {id: '2', number: '102'},
  {id: '3', number: '103'},
  {id: '4', number: '104'},
  {id: '5', number: '105'},
  {id: '6', number: '106'},
  {id: '7', number: '107'},
  {id: '8', number: '108'},
  {id: '9', number: '109'},
  {id: '10', number: '110'},
  {id: '11', number: '111'},
  {id: '12', number: '112'},
];

const PlayArena = () => {
  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
    <LinearGradient
      colors={[COLORS.yellow, COLORS.darkyellow]}
      style={{
        paddingHorizontal: heightPercentageToDP(1),
        paddingVertical: heightPercentageToDP(0.8),
        borderRadius: heightPercentageToDP(2.5),
        shadowColor: COLORS.black,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 6, // Ensures shadow shows on Android
      }}
    >
      <LinearGradient
        colors={[COLORS.grayBg, COLORS.white_s]}
        style={{
          ...styles.gradient,
          shadowColor: COLORS.black,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 6, // Ensures shadow shows on Android
        }}
      >
        <Text style={styles.itemText}>{item.number}</Text>
        <View style={{ backgroundColor: COLORS.grayBg, height: 1, width: '100%' }}></View>
        <Text style={styles.selectText}>Select</Text>
      </LinearGradient>
    </LinearGradient>
  </View>
  );

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.innerContainer}>
        {/** Top header wollet container */}
        <View
          style={{
            margin: heightPercentageToDP(2),
            backgroundColor: COLORS.grayHalfBg,
            height: heightPercentageToDP(12),
            borderRadius: heightPercentageToDP(2),
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateProfile')}
            style={{
              borderRadius: 100,
              overflow: 'hidden',
              width: 70,
              height: 70,
              marginTop: heightPercentageToDP(1),
              marginStart: heightPercentageToDP(1),
            }}>
            <Image
              source={require('../../assets/image/dark_user.png')}
              resizeMode="cover"
              style={{
                height: 70,
                width: 70,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flex: 2,

                justifyContent: 'center',
                paddingStart: heightPercentageToDP(1),
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,

                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_Regular,
                    color: COLORS.black,
                  }}>
                  User ID
                  <Text
                    style={{
                      fontFamily: FONT.HELVETICA_BOLD,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                    }}>
                    : 1007
                  </Text>
                </Text>

                <Text
                  style={{
                    fontFamily: FONT.HELVETICA_BOLD,
                    color: COLORS.black,
                    fontSize: heightPercentageToDP(2),
                  }}>
                  Wasu
                </Text>
              </View>

              <View
                style={{
                  flex: 1,

                  paddingEnd: heightPercentageToDP(1),
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_Regular,
                    color: COLORS.black,
                  }}>
                  09:00 PM
                </Text>

                <Text
                  style={{
                    fontFamily: FONT.Montserrat_Regular,
                    color: COLORS.black,
                  }}>
                  17-05-2024
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,

                justifyContent: 'center',
                alignItems: 'flex-end',
                paddingEnd: heightPercentageToDP(1),
              }}>
              <Text
                style={{
                  fontFamily: FONT.Montserrat_Regular,
                  color: COLORS.black,
                }}>
                Balance
                <Text
                  style={{
                    fontFamily: FONT.HELVETICA_BOLD,
                    color: COLORS.black,
                    fontSize: heightPercentageToDP(2),
                    paddingStart: heightPercentageToDP(1),
                  }}>
                  : 19000
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={styles.imageBackground}
          imageStyle={styles.imageBackgroundStyle}>
          <View style={styles.topBar}>
            <GradientTextWhite style={styles.locationText}>
              Canada 🇨🇦
            </GradientTextWhite>
            <View style={styles.divider} />
            <GradientTextWhite style={styles.timeText}>
              09:00 AM
            </GradientTextWhite>
          </View>
          <FlatList
            data={numberdata}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={3}
            contentContainerStyle={styles.flatListContent}
          />
        </ImageBackground>
      </View>
    </View>
  );
};

export default PlayArena;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContainer: {
    margin: heightPercentageToDP(2),
    backgroundColor: COLORS.grayHalfBg,
    height: heightPercentageToDP(12),
    borderRadius: heightPercentageToDP(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: heightPercentageToDP(1),
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingStart: heightPercentageToDP(1),
  },
  userInfoText: {
    fontFamily: FONT.Montserrat_Regular,
    color: COLORS.black,
  },
  userId: {
    fontFamily: FONT.HELVETICA_BOLD,
    fontSize: heightPercentageToDP(2),
  },
  userName: {
    fontFamily: FONT.HELVETICA_BOLD,
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
  },
  userBalance: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingEnd: heightPercentageToDP(1),
  },
  userBalanceText: {
    fontFamily: FONT.Montserrat_Regular,
    color: COLORS.black,
  },
  userBalanceAmount: {
    fontFamily: FONT.HELVETICA_BOLD,
    fontSize: heightPercentageToDP(2),
  },
  imageBackground: {
    width: '100%',
    height: heightPercentageToDP(65),
  },
  imageBackgroundStyle: {
    borderTopLeftRadius: heightPercentageToDP(5),
    borderTopRightRadius: heightPercentageToDP(5),
  },
  topBar: {
    height: heightPercentageToDP(5),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  locationText: {
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  divider: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(0.8),
    backgroundColor: COLORS.grayBg,
    borderRadius: heightPercentageToDP(2),
  },
  timeText: {
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  flatListContent: {
    padding: heightPercentageToDP(2),
  },
  itemContainer: {
    flex: 1,
    margin: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(1),
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(3),
  },
  itemText: {
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(4),
  },
  selectText: {
    color: COLORS.black,
    fontFamily: FONT.Montserrat_SemiBold,
    fontSize: heightPercentageToDP(1.7),
    marginTop: heightPercentageToDP(0.5),
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
// import LoginBackground from '../components/login/LoginBackground';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../assets/constants';
// import GradientText from '../components/helpercComponent/GradientText';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import Entypo from 'react-native-vector-icons/Entypo';
// import Toast from 'react-native-toast-message';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import Background from '../components/background/Background';
// import Loading from '../components/helpercComponent/Loading';
// import {useDispatch, useSelector} from 'react-redux';
// import {getDateAccordingToLocationAndTime} from '../redux/actions/dateAction';
// import LinearGradient from 'react-native-linear-gradient';
// import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

// // const numberdata = [
// //   {
// //     id: '1',
// //     number: '101',
// //   },
// //   {
// //     id: '2',
// //     number: '108',
// //   },
// //   {
// //     id: '3',
// //     number: '109',
// //   },
// //   {
// //     id: '4',
// //     number: '11',
// //   },
// //   {
// //     id: '5',
// //     number: '10',
// //   },
// //   {
// //     id: '6',
// //     number: '109',
// //   },
// //   {
// //     id: '7',
// //     number: '101',
// //   },
// //   {
// //     id: '8',
// //     number: '108',
// //   },
// //   {
// //     id: '9',
// //     number: '104',
// //   },
// //   {
// //     id: '10',
// //     number: '101',
// //   },
// //   {
// //     id: '11',
// //     number: '108',
// //   },
// //   {
// //     id: '12',
// //     number: '109',
// //   },
// // ];

// const numberdataq = [
//   {
//     id: '1',
//     number: '101',
//   },
//   {
//     id: '2',
//     number: '102',
//   },
//   {
//     id: '3',
//     number: '103',
//   },
// ];

// const numberdataw = [
//   {
//     id: '1',
//     number: '104',
//   },
//   {
//     id: '2',
//     number: '105',
//   },
//   {
//     id: '3',
//     number: '106',
//   },
// ];

// const numberdatae = [
//   {
//     id: '1',
//     number: '107',
//   },
//   {
//     id: '2',
//     number: '108',
//   },
//   {
//     id: '3',
//     number: '109',
//   },
// ];

// const numberdatar = [
//   {
//     id: '1',
//     number: '110',
//   },
//   {
//     id: '2',
//     number: '111',
//   },
//   {
//     id: '3',
//     number: '112',
//   },
// ];

// const PlayArena = () => {
//   const navigation = useNavigation();

//   const timedata = {
//     _id: '66433dfce262898ccc7e8a94',
//     lottime: '09:00 AM',
//     lotlocation: {
//       _id: '663e8569b5f0696f5009b813',
//       lotlocation: 'Canada 🇨🇦',
//       locationTitle: 'Canada  ( CA )',
//       locationDescription:
//         'This location you can choose number 01 to 200 any number  if your selected number display as a winning number you receive 200X value \n\nExample  if you choose 130 number with minimum amount 10 and if 130 number comes on display as a winning number you will receive \n\n10×200  = 2000 in total\n\nUse Short Code  ( CA ) For this location',
//       maximumRange: '200 - 200X',
//       createdAt: '2024-05-10T15:47:57.411Z',
//       __v: 0,
//     },
//     createdAt: '2024-05-13T09:48:27.169Z',
//     __v: 0,
//   };
//   const locationdata = {
//     _id: '663e8569b5f0696f5009b813',
//     lotlocation: 'Canada 🇨🇦',
//     locationTitle: 'Canada  ( CA )',
//     locationDescription:
//       'This location you can choose number 01 to 200 any number  if your selected number display as a winning number you receive 200X value \n\nExample  if you choose 130 number with minimum amount 10 and if 130 number comes on display as a winning number you will receive \n\n10×200  = 2000 in total\n\nUse Short Code  ( CA ) For this location',
//     maximumRange: '200 - 200X',
//     createdAt: '2024-05-10T15:47:57.411Z',
//     __v: 0,
//   };

//   const renderItem = ({item, index}) => {
//     const groupedTimes = [];
//     for (let i = 0; i < item.length; i += 2) {
//       groupedTimes.push(item.slice(i, i + 2));
//     }

//     return (
//       <View>
//         {groupedTimes.map((pair, idx) => (
//           <View
//             key={idx}
//             style={{
//               margin: heightPercentageToDP(2),
//               height: heightPercentageToDP(10),
//               backgroundColor: COLORS.white_s,
//               borderRadius: heightPercentageToDP(2),
//               flexDirection: 'row',
//             }}>
//             {pair.map((timeItem, timeIdx) => (
//               <View
//                 key={timeIdx}
//                 style={{
//                   width: widthPercentageToDP(25),
//                   marginVertical: heightPercentageToDP(1),
//                   marginHorizontal: heightPercentageToDP(1),
//                   borderRadius: heightPercentageToDP(1),
//                   position: 'relative',
//                 }}>
//                 <LinearGradient
//                   colors={[COLORS.time_firstblue, COLORS.white_s]}
//                   style={{
//                     width: widthPercentageToDP(14),
//                     flex: 1,
//                   }}></LinearGradient>

//                 <LinearGradient
//                   colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                   style={{
//                     width: widthPercentageToDP(21),
//                     height: heightPercentageToDP(6.5),
//                     backgroundColor: 'cyan',
//                     position: 'absolute',
//                     top: heightPercentageToDP(1.5),
//                     left: heightPercentageToDP(2),
//                   }}>
//                   <View
//                     style={{
//                       height: heightPercentageToDP(5),
//                       width: widthPercentageToDP(10),
//                       right: heightPercentageToDP(-0.5),
//                       position: 'absolute',
//                       borderStyle: 'solid',
//                       borderLeftWidth: heightPercentageToDP(3),
//                       borderRightWidth: heightPercentageToDP(3),
//                       top: heightPercentageToDP(0.7),
//                       borderBottomWidth: heightPercentageToDP(4.5),
//                       borderLeftColor: 'transparent',
//                       borderRightColor: 'transparent',
//                       borderBottomColor: COLORS.white_s,
//                       transform: [{rotate: '-90deg'}],
//                     }}></View>
//                   <View
//                     style={{
//                       flex: 2,
//                       paddingStart: heightPercentageToDP(1),
//                     }}>
//                     <Text
//                       style={{
//                         color: COLORS.black,
//                         fontFamily: FONT.Montserrat_Bold,
//                         fontSize: heightPercentageToDP(3),
//                       }}>
//                       101
//                     </Text>
//                   </View>
//                   <View
//                     style={{
//                       flex: 1,
//                       justifyContent: 'flex-end',
//                       alignItems: 'flex-end',
//                       marginEnd: heightPercentageToDP(4),
//                     }}>
//                     <Text
//                       style={{
//                         color: COLORS.black,
//                         fontFamily: FONT.Montserrat_Regular,
//                         fontSize: heightPercentageToDP(1.7),
//                       }}>
//                       Select
//                     </Text>
//                   </View>
//                 </LinearGradient>
//               </View>
//             ))}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Background />

//       {/** Main Cointainer */}

//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         {/** Top Wallet Details continer */}
//         <View
//           style={{
//             margin: heightPercentageToDP(2),
//             backgroundColor: COLORS.grayHalfBg,
//             height: heightPercentageToDP(12),
//             borderRadius: heightPercentageToDP(2),
//             flexDirection: 'row',
//           }}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('UpdateProfile')}
//             style={{
//               borderRadius: 100,
//               overflow: 'hidden',
//               width: 70,
//               height: 70,
//               marginTop: heightPercentageToDP(1),
//               marginStart: heightPercentageToDP(1),
//             }}>
//             <Image
//               source={require('../../assets/image/dark_user.png')}
//               resizeMode="cover"
//               style={{
//                 height: 70,
//                 width: 70,
//               }}
//             />
//           </TouchableOpacity>

//           <View
//             style={{
//               flex: 1,
//             }}>
//             <View
//               style={{
//                 flex: 2,

//                 justifyContent: 'center',
//                 paddingStart: heightPercentageToDP(1),
//                 flexDirection: 'row',
//               }}>
//               <View
//                 style={{
//                   flex: 1,

//                   justifyContent: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     fontFamily: FONT.Montserrat_Regular,
//                     color: COLORS.black,
//                   }}>
//                   User ID
//                   <Text
//                     style={{
//                       fontFamily: FONT.HELVETICA_BOLD,
//                       color: COLORS.black,
//                       fontSize: heightPercentageToDP(2),
//                     }}>
//                     : 1007
//                   </Text>
//                 </Text>

//                 <Text
//                   style={{
//                     fontFamily: FONT.HELVETICA_BOLD,
//                     color: COLORS.black,
//                     fontSize: heightPercentageToDP(2),
//                   }}>
//                   Wasu
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   flex: 1,

//                   paddingEnd: heightPercentageToDP(1),
//                   alignItems: 'flex-end',
//                   justifyContent: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     fontFamily: FONT.Montserrat_Regular,
//                     color: COLORS.black,
//                   }}>
//                   09:00 PM
//                 </Text>

//                 <Text
//                   style={{
//                     fontFamily: FONT.Montserrat_Regular,
//                     color: COLORS.black,
//                   }}>
//                   17-05-2024
//                 </Text>
//               </View>
//             </View>
//             <View
//               style={{
//                 flex: 1,

//                 justifyContent: 'center',
//                 alignItems: 'flex-end',
//                 paddingEnd: heightPercentageToDP(1),
//               }}>
//               <Text
//                 style={{
//                   fontFamily: FONT.Montserrat_Regular,
//                   color: COLORS.black,
//                 }}>
//                 Balance
//                 <Text
//                   style={{
//                     fontFamily: FONT.HELVETICA_BOLD,
//                     color: COLORS.black,
//                     fontSize: heightPercentageToDP(2),
//                     paddingStart: heightPercentageToDP(1),
//                   }}>
//                   : 19000
//                 </Text>
//               </Text>
//             </View>
//           </View>
//         </View>

//         <ImageBackground
//           source={require('../../assets/image/tlwbg.jpg')}
//           style={{
//             width: '100%',
//             height: heightPercentageToDP(65),
//           }}
//           imageStyle={{
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderTopRightRadius: heightPercentageToDP(5),
//           }}>
//           <View
//             style={{
//               height: heightPercentageToDP(65),
//               width: widthPercentageToDP(100),

//               borderTopLeftRadius: heightPercentageToDP(5),
//               borderTopRightRadius: heightPercentageToDP(5),
//             }}>
//             {/** Top Style View */}
//             <View
//               style={{
//                 height: heightPercentageToDP(5),
//                 width: widthPercentageToDP(100),
//                 justifyContent: 'space-evenly',
//                 alignItems: 'center',
//                 flexDirection: 'row',
//               }}>
//               <GradientTextWhite
//                 style={{
//                   fontSize: heightPercentageToDP(2),
//                   fontFamily: FONT.Montserrat_Bold,
//                   color: COLORS.black,
//                 }}>
//                 {locationdata.lotlocation}
//               </GradientTextWhite>

//               <View
//                 style={{
//                   width: widthPercentageToDP(20),
//                   height: heightPercentageToDP(0.8),
//                   backgroundColor: COLORS.grayBg,
//                   borderRadius: heightPercentageToDP(2),
//                 }}></View>

//               <GradientTextWhite
//                 style={{
//                   fontSize: heightPercentageToDP(2),
//                   fontFamily: FONT.Montserrat_Bold,
//                   color: COLORS.black,
//                 }}>
//                 {timedata.lottime}
//               </GradientTextWhite>
//             </View>

//             {/** Content Container */}

//             <View
//               style={{
//                 margin: heightPercentageToDP(2),
//                 height: heightPercentageToDP(10),
//                 backgroundColor: COLORS.white_s,
//                 borderRadius: heightPercentageToDP(2),
//                 flexDirection: 'row',
//               }}>
//               {numberdataq.map((item, index) => (
// <View
//   key={index}
//   style={{
//     width: widthPercentageToDP(25),
//     marginVertical: heightPercentageToDP(1),
//     marginHorizontal: heightPercentageToDP(1),
//     borderRadius: heightPercentageToDP(1),
//     position: 'relative',
//   }}>
//   <LinearGradient
//     colors={[COLORS.lightblue, COLORS.white_s]}
//     style={{
//       width: widthPercentageToDP(14),
//       flex: 1,
//     }}></LinearGradient>

//   <LinearGradient
//     colors={[COLORS.lightblue, COLORS.midblue]}
//     style={{
//       width: widthPercentageToDP(21),
//       height: heightPercentageToDP(6.5),
//       backgroundColor: 'cyan',
//       position: 'absolute',
//       top: heightPercentageToDP(1.5),
//       left: heightPercentageToDP(2),
//     }}>
//     <View
//       style={{
//         height: heightPercentageToDP(5),
//         width: widthPercentageToDP(10),
//         right: heightPercentageToDP(-0.5),
//         position: 'absolute',
//         borderStyle: 'solid',
//         borderLeftWidth: heightPercentageToDP(3),
//         borderRightWidth: heightPercentageToDP(3),
//         top: heightPercentageToDP(0.7),
//         borderBottomWidth: heightPercentageToDP(4.5),
//         borderLeftColor: 'transparent',
//         borderRightColor: 'transparent',
//         borderBottomColor: COLORS.white_s,
//         transform: [{rotate: '-90deg'}],
//       }}></View>
//     <View
//       style={{
//         flex: 2,
//         paddingStart: heightPercentageToDP(1),
//       }}>
//       <Text
//         style={{
//           color: COLORS.black,
//           fontFamily: FONT.Montserrat_Bold,
//           fontSize: heightPercentageToDP(3),
//         }}>
//         {item.number}
//       </Text>
//     </View>
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'flex-end',
//         marginEnd: heightPercentageToDP(4),
//       }}>
//       <Text
//         style={{
//           color: COLORS.black,
//           fontFamily: FONT.Montserrat_Regular,
//           fontSize: heightPercentageToDP(1.7),
//         }}>
//         Select
//       </Text>
//     </View>
//   </LinearGradient>
// </View>
//               ))}
//             </View>

//             <View
//               style={{
//                 margin: heightPercentageToDP(2),
//                 height: heightPercentageToDP(10),
//                 backgroundColor: COLORS.white_s,
//                 borderRadius: heightPercentageToDP(2),
//                 flexDirection: 'row',
//               }}>
//               {numberdataw.map((item, index) => (
//                 <View
//                   key={index}
//                   style={{
//                     width: widthPercentageToDP(25),
//                     marginVertical: heightPercentageToDP(1),
//                     marginHorizontal: heightPercentageToDP(1),
//                     borderRadius: heightPercentageToDP(1),
//                     position: 'relative',
//                   }}>
//                   <LinearGradient
//                     colors={[COLORS.lightyellow, COLORS.white_s]}
//                     style={{
//                       width: widthPercentageToDP(14),
//                       flex: 1,
//                     }}></LinearGradient>

//                   <LinearGradient
//                     colors={[COLORS.lightyellow, COLORS.darkyellow]}
//                     style={{
//                       width: widthPercentageToDP(21),
//                       height: heightPercentageToDP(6.5),
//                       backgroundColor: 'cyan',
//                       position: 'absolute',
//                       top: heightPercentageToDP(1.5),
//                       left: heightPercentageToDP(2),
//                     }}>
//                     <View
//                       style={{
//                         height: heightPercentageToDP(5),
//                         width: widthPercentageToDP(10),
//                         right: heightPercentageToDP(-0.5),
//                         position: 'absolute',
//                         borderStyle: 'solid',
//                         borderLeftWidth: heightPercentageToDP(3),
//                         borderRightWidth: heightPercentageToDP(3),
//                         top: heightPercentageToDP(0.7),
//                         borderBottomWidth: heightPercentageToDP(4.5),
//                         borderLeftColor: 'transparent',
//                         borderRightColor: 'transparent',
//                         borderBottomColor: COLORS.white_s,
//                         transform: [{rotate: '-90deg'}],
//                       }}></View>
//                     <View
//                       style={{
//                         flex: 2,
//                         paddingStart: heightPercentageToDP(1),
//                       }}>
//                       <Text
//                         style={{
//                           color: COLORS.black,
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(3),
//                         }}>
//                         {item.number}
//                       </Text>
//                     </View>
//                     <View
//                       style={{
//                         flex: 1,
//                         justifyContent: 'flex-end',
//                         alignItems: 'flex-end',
//                         marginEnd: heightPercentageToDP(4),
//                       }}>
//                       <Text
//                         style={{
//                           color: COLORS.black,
//                           fontFamily: FONT.Montserrat_Regular,
//                           fontSize: heightPercentageToDP(1.7),
//                         }}>
//                         Select
//                       </Text>
//                     </View>
//                   </LinearGradient>
//                 </View>
//               ))}
//             </View>

//             <View
//               style={{
//                 margin: heightPercentageToDP(2),
//                 height: heightPercentageToDP(10),
//                 backgroundColor: COLORS.white_s,
//                 borderRadius: heightPercentageToDP(2),
//                 flexDirection: 'row',
//               }}>
//               {numberdatae.map((item, index) => (
//                 <View
//                   key={index}
//                   style={{
//                     width: widthPercentageToDP(25),
//                     marginVertical: heightPercentageToDP(1),
//                     marginHorizontal: heightPercentageToDP(1),
//                     borderRadius: heightPercentageToDP(1),
//                     position: 'relative',
//                   }}>
//                   <LinearGradient
//                     colors={[COLORS.lightblue, COLORS.white_s]}
//                     style={{
//                       width: widthPercentageToDP(14),
//                       flex: 1,
//                     }}></LinearGradient>

//                   <LinearGradient
//                     colors={[COLORS.lightblue, COLORS.midblue]}
//                     style={{
//                       width: widthPercentageToDP(21),
//                       height: heightPercentageToDP(6.5),
//                       backgroundColor: 'cyan',
//                       position: 'absolute',
//                       top: heightPercentageToDP(1.5),
//                       left: heightPercentageToDP(2),
//                     }}>
//                     <View
//                       style={{
//                         height: heightPercentageToDP(5),
//                         width: widthPercentageToDP(10),
//                         right: heightPercentageToDP(-0.5),
//                         position: 'absolute',
//                         borderStyle: 'solid',
//                         borderLeftWidth: heightPercentageToDP(3),
//                         borderRightWidth: heightPercentageToDP(3),
//                         top: heightPercentageToDP(0.7),
//                         borderBottomWidth: heightPercentageToDP(4.5),
//                         borderLeftColor: 'transparent',
//                         borderRightColor: 'transparent',
//                         borderBottomColor: COLORS.white_s,
//                         transform: [{rotate: '-90deg'}],
//                       }}></View>
//                     <View
//                       style={{
//                         flex: 2,
//                         paddingStart: heightPercentageToDP(1),
//                       }}>
//                       <Text
//                         style={{
//                           color: COLORS.black,
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(3),
//                         }}>
//                         {item.number}
//                       </Text>
//                     </View>
//                     <View
//                       style={{
//                         flex: 1,
//                         justifyContent: 'flex-end',
//                         alignItems: 'flex-end',
//                         marginEnd: heightPercentageToDP(4),
//                       }}>
//                       <Text
//                         style={{
//                           color: COLORS.black,
//                           fontFamily: FONT.Montserrat_Regular,
//                           fontSize: heightPercentageToDP(1.7),
//                         }}>
//                         Select
//                       </Text>
//                     </View>
//                   </LinearGradient>
//                 </View>
//               ))}
//             </View>

//             <View
//               style={{
//                 margin: heightPercentageToDP(2),
//                 height: heightPercentageToDP(10),
//                 backgroundColor: COLORS.white_s,
//                 borderRadius: heightPercentageToDP(2),
//                 flexDirection: 'row',
//               }}>
//               {numberdatar.map((item, index) => (
//                 <View
//                   key={index}
//                   style={{
//                     width: widthPercentageToDP(25),
//                     marginVertical: heightPercentageToDP(1),
//                     marginHorizontal: heightPercentageToDP(1),
//                     borderRadius: heightPercentageToDP(1),
//                     position: 'relative',
//                   }}>
//                   <LinearGradient
//                     colors={[COLORS.lightyellow, COLORS.white_s]}
//                     style={{
//                       width: widthPercentageToDP(14),
//                       flex: 1,
//                     }}></LinearGradient>

//                   <LinearGradient
//                     colors={[COLORS.lightyellow, COLORS.darkyellow]}
//                     style={{
//                       width: widthPercentageToDP(21),
//                       height: heightPercentageToDP(6.5),
//                       backgroundColor: 'cyan',
//                       position: 'absolute',
//                       top: heightPercentageToDP(1.5),
//                       left: heightPercentageToDP(2),
//                     }}>
//                     <View
//                       style={{
//                         height: heightPercentageToDP(5),
//                         width: widthPercentageToDP(10),
//                         right: heightPercentageToDP(-0.5),
//                         position: 'absolute',
//                         borderStyle: 'solid',
//                         borderLeftWidth: heightPercentageToDP(3),
//                         borderRightWidth: heightPercentageToDP(3),
//                         top: heightPercentageToDP(0.7),
//                         borderBottomWidth: heightPercentageToDP(4.5),
//                         borderLeftColor: 'transparent',
//                         borderRightColor: 'transparent',
//                         borderBottomColor: COLORS.white_s,
//                         transform: [{rotate: '-90deg'}],
//                       }}></View>
//                     <View
//                       style={{
//                         flex: 2,
//                         paddingStart: heightPercentageToDP(1),
//                       }}>
//                       <Text
//                         style={{
//                           color: COLORS.black,
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(3),
//                         }}>
//                         {item.number}
//                       </Text>
//                     </View>
//                     <View
//                       style={{
//                         flex: 1,
//                         justifyContent: 'flex-end',
//                         alignItems: 'flex-end',
//                         marginEnd: heightPercentageToDP(4),
//                       }}>
//                       <Text
//                         style={{
//                           color: COLORS.black,
//                           fontFamily: FONT.Montserrat_Regular,
//                           fontSize: heightPercentageToDP(1.7),
//                         }}>
//                         Select
//                       </Text>
//                     </View>
//                   </LinearGradient>
//                 </View>
//               ))}
//             </View>

//             <FlatList
//               data={numberdatar}
//               renderItem={renderItem}
//               keyExtractor={item => item.id}
//               initialNumToRender={10} // Render initial 10 items
//               maxToRenderPerBatch={10} // Batch size to render
//               windowSize={10} // Number of items kept in memory
//             />

//           </View>
//         </ImageBackground>
//       </View>
//     </View>
//   );
// };

// export default PlayArena;

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
