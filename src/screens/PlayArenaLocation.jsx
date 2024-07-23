import {
  FlatList,
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
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Background from '../components/background/Background';
import Loading from '../components/helpercComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {getAllLocations} from '../redux/actions/locationAction';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import LinearGradient from 'react-native-linear-gradient';
import {getTimeAccordingLocation} from '../redux/actions/timeAction';

const datatypefilter = [
  {id: 'all', val: 'All'},
  {id: '2x', val: '2X'},
  {id: '5x', val: '5X'},
  {id: '10x', val: '10X'},
  {id: '50x', val: '50X'},
  {id: '100x', val: '100X'},
  {id: '200x', val: '200X'},
];

const locationdata = [
  {
    id: '1',
    name: 'Canada',
    limit: '200 - 200X',
    times: [
      {id: '11', time: '09:00 AM'},
      {id: '12', time: '10:00 AM'},
      {id: '13', time: '11:00 AM'},
      {id: '14', time: '12:00 PM'},
      {id: '15', time: '01:00 PM'},
      {id: '16', time: '02:00 PM'},
      {id: '17', time: '03:00 PM'},
    ],
  },
  {
    id: '2',
    name: 'Japan',
    limit: '200 - 200X',
    times: [
      {id: '11', time: '09:00 AM'},
      {id: '12', time: '10:00 AM'},
      {id: '13', time: '11:00 AM'},
      {id: '14', time: '12:00 PM'},
      {id: '15', time: '01:00 PM'},
      {id: '16', time: '02:00 PM'},
      {id: '17', time: '03:00 PM'},
    ],
  },
  {
    id: '3',
    name: 'Punjab',
    limit: '200 - 200X',
    times: [
      {id: '14', time: '12:00 PM'},
      {id: '15', time: '01:00 PM'},
      {id: '16', time: '02:00 PM'},
      {id: '17', time: '03:00 PM'},
    ],
  },
  {
    id: '4',
    name: 'Pune',
    limit: '200 - 200X',
    times: [
      {id: '13', time: '11:00 AM'},
      {id: '14', time: '12:00 PM'},
      {id: '15', time: '01:00 PM'},
      {id: '16', time: '02:00 PM'},
      {id: '17', time: '03:00 PM'},
    ],
  },
  {
    id: '5',
    name: 'China',
    limit: '100 - 100X',
    times: [
      {id: '11', time: '09:00 AM'},
      {id: '14', time: '12:00 PM'},
      {id: '15', time: '01:00 PM'},
      {id: '16', time: '02:00 PM'},
      {id: '17', time: '03:00 PM'},
    ],
  },
  {
    id: '6',
    name: 'India',
    limit: '200 - 200X',
    times: [
      {id: '11', time: '09:00 AM'},
      {id: '12', time: '10:00 AM'},
      {id: '13', time: '11:00 AM'},
      {id: '16', time: '02:00 PM'},
      {id: '17', time: '03:00 PM'},
    ],
  },
  {
    id: '7',
    name: 'USA',
    limit: '200 - 200X',
    times: [
      {id: '11', time: '09:00 AM'},
      {id: '12', time: '10:00 AM'},
      {id: '13', time: '11:00 AM'},
      {id: '14', time: '12:00 PM'},
    ],
  },
  {
    id: '8',
    name: 'Korea',
    limit: '200 - 200X',
    times: [
      {id: '11', time: '09:00 AM'},
      {id: '12', time: '10:00 AM'},
      {id: '13', time: '11:00 AM'},
      {id: '14', time: '12:00 PM'},
      {id: '15', time: '01:00 PM'},
      {id: '16', time: '02:00 PM'},
      {id: '17', time: '03:00 PM'},
    ],
  },
];

const PlayArenaLocation = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState(datatypefilter[0].id);

  const settingFilterData = item => {
    setSelectedFilter(item.id);
  };

  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({item, index}) => {
    const groupedTimes = [];
    for (let i = 0; i < item.times.length; i += 2) {
      groupedTimes.push(item.times.slice(i, i + 2));
    }

    return (
      <>
        <TouchableOpacity onPress={() => toggleItem(item.id)}>
          <LinearGradient
            colors={
              index % 2 === 0
                ? [COLORS.lightblue, COLORS.midblue]
                : [COLORS.lightyellow, COLORS.darkyellow]
            }
            style={styles.item}>
            <View style={{flex: 1.5}}>
              <Text
                style={{
                  color: COLORS.black,
                  fontFamily: FONT.Montserrat_SemiBold,
                  fontSize: heightPercentageToDP(2.5),
                }}>
                {item.name}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: COLORS.black,
                  fontFamily: FONT.Montserrat_Regular,
                  fontSize: heightPercentageToDP(2),
                  textAlignVertical: 'center',
                }}>
                Max {item.limit}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {expandedItems[item.id] && (
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ImageBackground
            source={require('../../assets/image/tlwbg.jpg')}
            
            imageStyle={{
              borderRadius: heightPercentageToDP(5),
              margin: heightPercentageToDP(2)
            }}>
              <View
            style={{
             backgroundColor: COLORS.black,
              margin: heightPercentageToDP(2),
              borderRadius: heightPercentageToDP(5),
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.8
            }}>

            {groupedTimes.map((pair, idx) => (
              <View key={idx} style={[styles.timeRow]}>
                {pair.map(timeItem => (
                  <TouchableOpacity
                  key={timeItem.id}
                  onPress={() => navigation.navigate("PlayArena")}
                  >
                     <LinearGradient
                   
                    colors={
                      idx % 2 === 0
                        ? [COLORS.lightblue, COLORS.midblue]
                        : [COLORS.lightyellow, COLORS.darkyellow]
                    }
                    style={{
                      ...styles.item,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: heightPercentageToDP(2),
                      opacity: 1
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(1.8),
                        textAlignVertical: 'center',
                        
                      }}>
                      {timeItem.time}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(1.8),
                        textAlignVertical: 'center',
                      }}>
                      Play
                    </Text>
                  </LinearGradient>

                  </TouchableOpacity>
                 
                ))}
              </View>
            ))}
          </View>

            </ImageBackground>
            </View>
          
        )}
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Background />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
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
                }}></View>
            </View>

            <View
              style={{
                height: heightPercentageToDP(21),
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Search
              </GradientTextWhite>

              <View
                style={{
                  height: heightPercentageToDP(7),
                  flexDirection: 'row',
                  backgroundColor: COLORS.white_s,
                  alignItems: 'center',
                  paddingHorizontal: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(1),
                  marginTop: heightPercentageToDP(1),
                }}>
                <Fontisto
                  name={'search'}
                  size={heightPercentageToDP(3)}
                  color={COLORS.darkGray}
                />
                <TextInput
                  style={{
                    marginStart: heightPercentageToDP(1),
                    flex: 1,
                    fontFamily: FONT.Montserrat_Regular,
                    fontSize: heightPercentageToDP(2.5),
                    color: COLORS.black,
                  }}
                  placeholder="Search for location"
                  placeholderTextColor={COLORS.black}
                  label="Search"
                />
              </View>

              <View
                style={{
                  height: heightPercentageToDP(7),
                  flexDirection: 'row',
                  backgroundColor: COLORS.white_s,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: heightPercentageToDP(3),
                  marginTop: heightPercentageToDP(2),
                }}>
                {datatypefilter.map(item => (
                  <TouchableOpacity
                    onPress={() => settingFilterData(item)}
                    key={item.id}
                    style={{
                      backgroundColor: COLORS.grayHalfBg,
                      padding: heightPercentageToDP(1),
                      margin: heightPercentageToDP(0.2),
                      borderRadius: heightPercentageToDP(1),
                      borderColor:
                        selectedFilter == item.id
                          ? COLORS.green
                          : COLORS.grayHalfBg,
                      borderWidth: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(1.5),
                        color: COLORS.black,
                        paddingHorizontal: heightPercentageToDP(0.5),
                      }}>
                      {item.val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{flex: 2}}>
              {false ? (
                <Loading />
              ) : (
                <FlatList
                  data={locationdata}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
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

export default PlayArenaLocation;

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
    flexDirection: 'row',
  },
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },
  timeRow: {
    flexDirection: 'row',
    marginBottom: 4,
    borderRadius: 4,
    padding: 4,
  },
  time: {
    fontSize: 14,
    marginRight: 8,
    padding: 4,
    backgroundColor: '#ccc',
    borderRadius: 4,
    flex: 1,
    textAlign: 'center',
  },
});

// import {
//   FlatList,
//   ImageBackground,
//   ScrollView,
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
// import {COLORS, FONT} from '../../assets/constants';
// import GradientText from '../components/helpercComponent/GradientText';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import Toast from 'react-native-toast-message';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import Background from '../components/background/Background';
// import Loading from '../components/helpercComponent/Loading';
// import {useDispatch, useSelector} from 'react-redux';
// import {getAllLocations} from '../redux/actions/locationAction';
// import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
// import LinearGradient from 'react-native-linear-gradient';
// import {getTimeAccordingLocation} from '../redux/actions/timeAction';

// const datatypefilter = [
//   {
//     id: 'all',
//     val: 'All',
//   },
//   {
//     id: '2x',
//     val: '2X',
//   },
//   {
//     id: '5x',
//     val: '5X',
//   },
//   {
//     id: '10x',
//     val: '10X',
//   },
//   {
//     id: '50x',
//     val: '50X',
//   },
//   {
//     id: '100x',
//     val: '100X',
//   },
//   {
//     id: '200x',
//     val: '200X',
//   },
// ];

// const locationdata = [
//   {
//     id: '1',
//     name: 'Canada',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '2',
//     name: 'Japan',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '3',
//     name: 'Punjab',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '4',
//     name: 'Pune',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '5',
//     name: 'China',
//     limit: '100 - 100X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },

//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '6',
//     name: 'India',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },

//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
//   {
//     id: '7',
//     name: 'USA',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//     ],
//   },
//   {
//     id: '8',
//     name: 'Korea',
//     limit: '200 - 200X',
//     times: [
//       {
//         id: '11',
//         time: '09:00 AM',
//       },
//       {
//         id: '12',
//         time: '10:00 AM',
//       },
//       {
//         id: '13',
//         time: '11:00 AM',
//       },
//       {
//         id: '14',
//         time: '12:00 PM',
//       },
//       {
//         id: '15',
//         time: '01:00 PM',
//       },
//       {
//         id: '16',
//         time: '02:00 PM',
//       },
//       {
//         id: '17',
//         time: '03:00 PM',
//       },
//     ],
//   },
// ];

// const PlayArenaLocation = () => {
//   const navigation = useNavigation();
//   const [selectedFilter, setSelectedFilter] = useState(datatypefilter[0].id);
//   // For Selecting filter based data
//   const settingFilterData = item => {
//     setSelectedFilter(item.id);
//   };

//   const [expandedItems, setExpandedItems] = useState({});

//   const toggleItem = id => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Background />

//       {/** Main Cointainer */}

//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         <ImageBackground
//           source={require('../../assets/image/tlwbg.jpg')}
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

//               <View
//                 style={{
//                   height: heightPercentageToDP(7),
//                   flexDirection: 'row',
//                   backgroundColor: COLORS.white_s,
//                   alignItems: 'center',
//                   paddingHorizontal: heightPercentageToDP(2),
//                   borderRadius: heightPercentageToDP(1),
//                   marginTop: heightPercentageToDP(1),
//                 }}>
//                 <Fontisto
//                   name={'search'}
//                   size={heightPercentageToDP(3)}
//                   color={COLORS.darkGray}
//                 />
//                 <TextInput
//                   style={{
//                     marginStart: heightPercentageToDP(1),
//                     flex: 1,
//                     fontFamily: FONT.Montserrat_Regular,
//                     fontSize: heightPercentageToDP(2.5),
//                     color: COLORS.black,
//                   }}
//                   placeholder="Search for location"
//                   placeholderTextColor={COLORS.black}
//                   label="Search"
//                 />
//               </View>

//               {/** Filter Data based upon power */}
//               <View
//                 style={{
//                   height: heightPercentageToDP(7),
//                   flexDirection: 'row',
//                   backgroundColor: COLORS.white_s,
//                   alignItems: 'center',
//                   justifyContent: 'center',

//                   borderRadius: heightPercentageToDP(3),
//                   marginTop: heightPercentageToDP(2),
//                 }}>
//                 {datatypefilter.map((item, index) => (
//                   <TouchableOpacity
//                     onPress={() => settingFilterData(item)}
//                     key={item.id}
//                     style={{
//                       backgroundColor: COLORS.grayHalfBg,
//                       padding: heightPercentageToDP(1),
//                       margin: heightPercentageToDP(0.2),
//                       borderRadius: heightPercentageToDP(1),
//                       borderColor:
//                         selectedFilter == item.id
//                           ? COLORS.green
//                           : COLORS.grayHalfBg,
//                       borderWidth: 1,
//                     }}>
//                     <Text
//                       style={{
//                         fontFamily: FONT.Montserrat_Regular,
//                         fontSize: heightPercentageToDP(1.5),
//                         color: COLORS.black,
//                         paddingHorizontal: heightPercentageToDP(0.5),
//                       }}>
//                       {item.val}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             <View
//               style={{
//                 flex: 2,
//               }}>
//               {false ? (
//                 <Loading />
//               ) : (
//                 <FlatList
//                   data={locationdata}
//                   renderItem={({item, index}) => (
//                     <>
//                       <TouchableOpacity onPress={() => toggleItem(item.id)}>
//                         <LinearGradient
//                           colors={
//                             index % 2 === 0
//                               ? [COLORS.lightblue, COLORS.midblue]
//                               : [COLORS.lightyellow, COLORS.darkyellow]
//                           }
//                           style={{
//                             ...styles.item,
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                           }}>
//                           <View
//                             style={{
//                               flex: 1.5,
//                             }}>
//                             <Text
//                               style={{
//                                 color: COLORS.black,
//                                 fontFamily: FONT.Montserrat_SemiBold,
//                                 fontSize: heightPercentageToDP(2.5),
//                               }}>
//                               {item.name}
//                             </Text>
//                           </View>

//                           <View
//                             style={{
//                               flex: 1,
//                             }}>
//                             <Text
//                               style={{
//                                 color: COLORS.black,
//                                 fontFamily: FONT.Montserrat_Regular,
//                                 fontSize: heightPercentageToDP(2),
//                               }}>
//                               Max {item.limit}
//                             </Text>
//                           </View>
//                         </LinearGradient>
//                       </TouchableOpacity>

//                       {expandedItems[item.id] && (
//                         <View
//                           style={{
//                             backgroundColor: 'cyan',
//                             margin: heightPercentageToDP(2),
//                             borderRadius: heightPercentageToDP(2),
//                           }}>
//                           {item.times.map((item, index) => (
//                             <LinearGradient
//                               colors={[COLORS.lightblue, COLORS.midblue]}
//                               style={{
//                                 ...styles.item,
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                               }}>
//                               <View
//                                 style={{
//                                   flex: 1.5,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_SemiBold,
//                                     fontSize: heightPercentageToDP(2.5),
//                                   }}>
//                                   {item.time}
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                                 </Text>
//                               </View>

//                               <View
//                                 style={{
//                                   flex: 1,
//                                 }}>
//                                 <Text
//                                   style={{
//                                     color: COLORS.black,
//                                     fontFamily: FONT.Montserrat_Regular,
//                                     fontSize: heightPercentageToDP(2),
//                                   }}>
//                                   Play
//                                 </Text>
//                               </View>
//                             </LinearGradient>
//                           ))}
//                         </View>
//                       )}
//                     </>
//                   )}
//                   keyExtractor={item => item._id}
//                   initialNumToRender={10} // Render initial 10 items
//                   maxToRenderPerBatch={10} // Batch size to render
//                   windowSize={10} // Number of items kept in memory
//                 />
//               )}
//             </View>
//           </View>
//         </ImageBackground>
//       </View>
//     </View>
//   );
// };

// export default PlayArenaLocation;

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

// // import {
// //   FlatList,
// //   ImageBackground,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from 'react-native';
// // import React, {useEffect, useState} from 'react';
// // import {
// //   heightPercentageToDP,
// //   widthPercentageToDP,
// // } from 'react-native-responsive-screen';
// // import {COLORS, FONT} from '../../assets/constants';
// // import GradientText from '../components/helpercComponent/GradientText';
// // import Fontisto from 'react-native-vector-icons/Fontisto';
// // import Toast from 'react-native-toast-message';
// // import {useIsFocused, useNavigation} from '@react-navigation/native';
// // import Background from '../components/background/Background';
// // import Loading from '../components/helpercComponent/Loading';
// // import {useDispatch, useSelector} from 'react-redux';
// // import {getAllLocations} from '../redux/actions/locationAction';
// // import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { getTimeAccordingLocation } from '../redux/actions/timeAction';

// // const datatypefilter = [
// //   {
// //     id: 'all',
// //     val: 'All',
// //   },
// //   {
// //     id: '2x',
// //     val: '2X',
// //   },
// //   {
// //     id: '5x',
// //     val: '5X',
// //   },
// //   {
// //     id: '10x',
// //     val: '10X',
// //   },
// //   {
// //     id: '50x',
// //     val: '50X',
// //   },
// //   {
// //     id: '100x',
// //     val: '100X',
// //   },
// //   {
// //     id: '200x',
// //     val: '200X',
// //   },
// // ];

// // const PlayArenaLocation = () => {
// //   const navigation = useNavigation();
// //   const dispatch = useDispatch();

// //   const [selectedFilter, setSelectedFilter] = useState(datatypefilter[0].id);

// //   const {accesstoken} = useSelector(state => state.user);
// //   const {loading, locations} = useSelector(state => state.location);

// //   // const [filteredData, setFilteredData] = useState(locations);
// //   const [filteredData, setFilteredData] = useState([]);

// //   const handleSearch = text => {
// //     const filtered = locations.filter(item =>
// //       item.lotlocation.toLowerCase().includes(text.toLowerCase()),
// //     );
// //     setFilteredData(filtered);
// //   };

// //   const focused = useIsFocused();

// //   useEffect(() => {
// //     dispatch(getAllLocations(accesstoken));
// //   }, [dispatch, focused]);

// //   useEffect(() => {
// //     setFilteredData(locations); // Update filteredData whenever locations change
// //   }, [locations]);

// //   const submitHandler = () => {
// //     Toast.show({
// //       type: 'success',
// //       text1: 'Searching',
// //     });
// //   };

// // // For Selecting filter based data
// // const settingFilterData = item => {
// //   setSelectedFilter(item.id);
// // };

// //   useEffect(() => {
// //     console.log('useEffect Running');
// //   }, [selectedFilter]);

// //   const data = [
// //     'Item 1', 'Item 2', 'Item 3', 'Item 4',
// //     'Item 5', 'Item 6', 'Item 7', 'Item 8',
// //   ];

// //   const groupedData = [];
// //   for (let i = 0; i < data.length; i += 2) {
// //     groupedData.push(data.slice(i, i + 2));
// //   }

// //   useEffect(() => {

// //   }, [dispatch]);

// //   const getTimeOFLocation = () => {
// //     dispatch(getTimeAccordingLocation(accesstoken, locationdata._id));
// //   }

// //   return (
// //     <View style={{flex: 1}}>
// //       <Background />

// //       {/** Main Cointainer */}

// //       <View style={{flex: 1, justifyContent: 'flex-end'}}>
// //         <ImageBackground
// //           source={require('../../assets/image/tlwbg.jpg')}
// //           style={{
// //             width: '100%',
// //             height: heightPercentageToDP(85),
// //           }}
// //           imageStyle={{
// //             borderTopLeftRadius: heightPercentageToDP(5),
// //             borderTopRightRadius: heightPercentageToDP(5),
// //           }}>
// //           <View
// //             style={{
// //               height: heightPercentageToDP(85),
// //               width: widthPercentageToDP(100),

// //               borderTopLeftRadius: heightPercentageToDP(5),
// //               borderTopRightRadius: heightPercentageToDP(5),
// //             }}>
// //             {/** Top Style View */}
// //             <View
// //               style={{
// //                 height: heightPercentageToDP(5),
// //                 width: widthPercentageToDP(100),
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //               }}>
// //               <View
// //                 style={{
// //                   width: widthPercentageToDP(20),
// //                   height: heightPercentageToDP(0.8),
// //                   backgroundColor: COLORS.grayBg,
// //                   borderRadius: heightPercentageToDP(2),
// //                 }}></View>
// //             </View>

// //             {/** Content Container */}

// //             <View
// //               style={{
// //                 height: heightPercentageToDP(21),
// //                 margin: heightPercentageToDP(2),
// //               }}>
// //               <GradientTextWhite style={styles.textStyle}>
// //                 Search
// //               </GradientTextWhite>

// //               <View
// //                 style={{
// //                   height: heightPercentageToDP(7),
// //                   flexDirection: 'row',
// //                   backgroundColor: COLORS.white_s,
// //                   alignItems: 'center',
// //                   paddingHorizontal: heightPercentageToDP(2),
// //                   borderRadius: heightPercentageToDP(1),
// //                   marginTop: heightPercentageToDP(1),
// //                 }}>
// //                 <Fontisto
// //                   name={'search'}
// //                   size={heightPercentageToDP(3)}
// //                   color={COLORS.darkGray}
// //                 />
// //                 <TextInput
// //                   style={{
// //                     marginStart: heightPercentageToDP(1),
// //                     flex: 1,
// //                     fontFamily: FONT.Montserrat_Regular,
// //                     fontSize: heightPercentageToDP(2.5),
// //                     color: COLORS.black,
// //                   }}
// //                   placeholder="Search for location"
// //                   placeholderTextColor={COLORS.black}
// //                   label="Search"
// //                   onChangeText={handleSearch}
// //                 />
// //               </View>

// //               {/** Filter Data based upon power */}
// //               <View
// //                 style={{
// //                   height: heightPercentageToDP(7),
// //                   flexDirection: 'row',
// //                   backgroundColor: COLORS.white_s,
// //                   alignItems: 'center',
// //                   justifyContent: 'center',

// //                   borderRadius: heightPercentageToDP(3),
// //                   marginTop: heightPercentageToDP(2),
// //                 }}>
// //                 {datatypefilter.map((item, index) => (
// //                   <TouchableOpacity
// //                     onPress={() => settingFilterData(item)}
// //                     key={item.id}
// //                     style={{
// //                       backgroundColor: COLORS.grayHalfBg,
// //                       padding: heightPercentageToDP(1),
// //                       margin: heightPercentageToDP(0.2),
// //                       borderRadius: heightPercentageToDP(1),
// //                       borderColor:
// //                         selectedFilter == item.id
// //                           ? COLORS.green
// //                           : COLORS.grayHalfBg,
// //                       borderWidth: 1,
// //                     }}>
// //                     <Text
// //                       style={{
// //                         fontFamily: FONT.Montserrat_Regular,
// //                         fontSize: heightPercentageToDP(1.5),
// //                         color: COLORS.black,
// //                         paddingHorizontal: heightPercentageToDP(0.5),
// //                       }}>
// //                       {item.val}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //             </View>

// //             <View
// //               style={{
// //                 flex: 2,
// //               }}>
// //               {loading ? (
// //                 <Loading />
// //               ) : (
// //                 <FlatList
// //                   data={filteredData}
// //                   renderItem={({item, index}) => (
// //                     <>
// //                     <TouchableOpacity
// //                       onPress={() =>
// //                         navigation.navigate('SearchTime', {
// //                           locationdata: item,
// //                         })
// //                       }>
// //                       <LinearGradient
// //                         colors={
// //                           index % 2 === 0
// //                             ? [COLORS.lightblue, COLORS.midblue]
// //                             : [COLORS.lightyellow, COLORS.darkyellow]
// //                         }
// //                         style={{
// //                           ...styles.item,
// //                           flexDirection: 'row',
// //                           justifyContent: 'space-between',
// //                         }}>
// //                         <View
// //                           style={{
// //                             flex: 1.5,
// //                           }}>
// //                           <Text
// //                             style={{
// //                               color: COLORS.black,
// //                               fontFamily: FONT.Montserrat_SemiBold,
// //                               fontSize: heightPercentageToDP(2.5),
// //                             }}>
// //                             {item.lotlocation}
// //                           </Text>
// //                         </View>

// //                         <View
// //                           style={{
// //                             flex: 1,
// //                           }}>
// //                           <Text
// //                             style={{
// //                               color: COLORS.black,
// //                               fontFamily: FONT.Montserrat_Regular,
// //                               fontSize: heightPercentageToDP(2),
// //                             }}>
// //                             Max {item.maximumRange}
// //                           </Text>
// //                         </View>
// //                       </LinearGradient>
// //                     </TouchableOpacity>

// //                     <View
// //                     style={{height: heightPercentageToDP(20),
// //                     backgroundColor: 'cyan',
// //                   margin: heightPercentageToDP(2),
// //                 borderRadius: heightPercentageToDP(2)}}
// //                     >

// //                     </View>

// //                     </>
// //                   )}
// //                   keyExtractor={item => item._id}
// //                   initialNumToRender={10} // Render initial 10 items
// //                   maxToRenderPerBatch={10} // Batch size to render
// //                   windowSize={10} // Number of items kept in memory
// //                 />
// //               )}
// //             </View>
// //           </View>
// //         </ImageBackground>
// //       </View>
// //     </View>
// //   );
// // };

// // export default PlayArenaLocation;

// // const styles = StyleSheet.create({
// //   textStyle: {
// //     fontSize: heightPercentageToDP(4),
// //     fontFamily: FONT.Montserrat_Bold,
// //     color: COLORS.black,
// //   },
// //   container: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginTop: 20,
// //     height: heightPercentageToDP(20),
// //   },
// //   item: {
// //     padding: heightPercentageToDP(2),
// //     marginVertical: heightPercentageToDP(1),
// //     marginHorizontal: heightPercentageToDP(2),
// //     borderRadius: heightPercentageToDP(1),
// //   },
// //   title: {
// //     color: COLORS.white_s,
// //     fontFamily: FONT.SF_PRO_MEDIUM,
// //   },
// // });
