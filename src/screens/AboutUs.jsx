import {
  FlatList,
  ImageBackground,
  SafeAreaView,
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
import {loadAllAboutUs} from '../redux/actions/userAction';

const AboutUs = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken, loadingAbout, abouts} = useSelector(state => state.user);

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = text => {
    const filtered = abouts.filter(item =>
      item.aboutTitle.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(loadAllAboutUs(accesstoken));
  }, [dispatch, focused]);

  useEffect(() => {
    if(abouts)
    {
      setFilteredData(abouts); // Update filteredData whenever locations change
    }
   
  }, [abouts]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />

      <View
        style={{
          margin: heightPercentageToDP(2),
          backgroundColor: 'transparent',
        }}>
        <GradientText style={styles.textStyle}>About</GradientText>
        <GradientText style={styles.textStyle}>Us</GradientText>
      </View>

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(70),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
             <View
        style={{
          height: heightPercentageToDP(70),
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

        <View
          style={{
            height: heightPercentageToDP(10),
            margin: heightPercentageToDP(2),
          }}>
          <View
            style={{
              height: heightPercentageToDP(7),
              flexDirection: 'row',
              backgroundColor: COLORS.white_s,
              alignItems: 'center',
              paddingHorizontal: heightPercentageToDP(2),
              borderRadius: heightPercentageToDP(1),
              marginTop: heightPercentageToDP(2),
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
              }}
              placeholder="Search"
              placeholderTextColor={COLORS.black}
              label="Search"
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <View
          style={{
            flex: 2,
          }}>
          {loadingAbout ? (
            <Loading />
          ) : (
            <ScrollView
            contentContainerStyle={{ paddingBottom: heightPercentageToDP(10) }}
            >
              {
                filteredData.map((item,index) => (
                  <View
                    style={{
                      ...styles.item,
                      backgroundColor: COLORS.white_s,
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <View
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? COLORS.lightDarkGray
                            : COLORS.grayBg,

                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: heightPercentageToDP(1),
                      }}>
                      <Text
                      selectable
                        style={{
                          fontFamily: FONT.Montserrat_Bold,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}>
                        {item.aboutTitle}
                      </Text>
                    </View>

                    <View
                      style={{
                        alignItems: 'center',
                        paddingHorizontal: heightPercentageToDP(1),
                        paddingVertical: heightPercentageToDP(2),
                      }}>
                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}
                        selectable={true}
                        >
                        {item.aboutDescription}
                      </Text>
                    </View>
                  </View>
                ))
              }
            </ScrollView>
          )}
        </View>

        {/** end */}
      </View>
            </ImageBackground>
            </View>

     
    </SafeAreaView>
  );
};

export default AboutUs;

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
    marginVertical: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
  },
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },

  textInput: {
    width: '100%',
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
  },
});


// import {
//   FlatList,
//   ImageBackground,
//   SafeAreaView,
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
// import {loadAllAboutUs} from '../redux/actions/userAction';

// const AboutUs = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const {accesstoken, loadingAbout, abouts} = useSelector(state => state.user);

//   const [filteredData, setFilteredData] = useState([]);

//   const handleSearch = text => {
//     const filtered = abouts.filter(item =>
//       item.aboutTitle.toLowerCase().includes(text.toLowerCase()),
//     );
//     setFilteredData(filtered);
//   };

//   const focused = useIsFocused();

//   useEffect(() => {
//     dispatch(loadAllAboutUs(accesstoken));
//   }, [dispatch, focused]);

//   useEffect(() => {
//     setFilteredData(abouts); // Update filteredData whenever locations change
//   }, [abouts]);

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <Background />

//       <View
//         style={{
//           margin: heightPercentageToDP(2),
//           backgroundColor: 'transparent',
//         }}>
//         <GradientText style={styles.textStyle}>About</GradientText>
//         <GradientText style={styles.textStyle}>Us</GradientText>
//       </View>

//       {/** Main Cointainer */}

//       <View style={{flex: 1, justifyContent: 'flex-end'}}>
//         <ImageBackground
//           source={require('../../assets/image/tlwbg.jpg')}
//           style={{
//             width: '100%',
//             height: heightPercentageToDP(70),
//           }}
//           imageStyle={{
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderTopRightRadius: heightPercentageToDP(5),
//           }}>
//              <View
//         style={{
//           height: heightPercentageToDP(70),
//           width: widthPercentageToDP(100),
      
//           borderTopLeftRadius: heightPercentageToDP(5),
//           borderTopRightRadius: heightPercentageToDP(5),
//         }}>
//         {/** Top Style View */}
//         <View
//           style={{
//             height: heightPercentageToDP(5),
//             width: widthPercentageToDP(100),
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               width: widthPercentageToDP(20),
//               height: heightPercentageToDP(0.8),
//               backgroundColor: COLORS.grayBg,
//               borderRadius: heightPercentageToDP(2),
//             }}></View>
//         </View>

//         {/** Content Container */}

//         <View
//           style={{
//             height: heightPercentageToDP(10),
//             margin: heightPercentageToDP(2),
//           }}>
//           <View
//             style={{
//               height: heightPercentageToDP(7),
//               flexDirection: 'row',
//               backgroundColor: COLORS.white_s,
//               alignItems: 'center',
//               paddingHorizontal: heightPercentageToDP(2),
//               borderRadius: heightPercentageToDP(1),
//               marginTop: heightPercentageToDP(2),
//             }}>
//             <Fontisto
//               name={'search'}
//               size={heightPercentageToDP(3)}
//               color={COLORS.darkGray}
//             />
//             <TextInput
//               style={{
//                 marginStart: heightPercentageToDP(1),
//                 flex: 1,
//                 fontFamily: FONT.Montserrat_Regular,
//                 fontSize: heightPercentageToDP(2.5),
//               }}
//               placeholder="Search"
//               placeholderTextColor={COLORS.black}
//               label="Search"
//               onChangeText={handleSearch}
//             />
//           </View>
//         </View>

//         <View
//           style={{
//             flex: 2,
//           }}>
//           {loadingAbout ? (
//             <Loading />
//           ) : (
//             <FlatList
//               data={filteredData}
//               renderItem={({item, index}) => (
//                 <TouchableOpacity
//                   onPress={() =>
//                     Toast.show({
//                       type: 'info',
//                       text1: 'Long Press for Copy Option',
//                     })
//                   }
//                   onLongPress={() =>
//                     navigation.navigate('AboutUsCopying', {
//                       aboutusdata: item,
//                     })
//                   }
//                   style={{
//                     ...styles.item,
//                   }}>
//                   <View
//                     style={{
//                       backgroundColor: COLORS.white_s,
//                       borderRadius: heightPercentageToDP(2),
//                     }}>
//                     <View
//                       style={{
//                         backgroundColor:
//                           index % 2 === 0
//                             ? COLORS.lightDarkGray
//                             : COLORS.grayBg,

//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         padding: heightPercentageToDP(1),
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(2),
//                           color: COLORS.black,
//                         }}>
//                         {item.aboutTitle}
//                       </Text>
//                     </View>

//                     <View
//                       style={{
//                         alignItems: 'center',
//                         paddingHorizontal: heightPercentageToDP(1),
//                         paddingVertical: heightPercentageToDP(2),
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: FONT.Montserrat_Regular,
//                           fontSize: heightPercentageToDP(2),
//                           color: COLORS.black,
//                         }}
//                         selectable
//                         >
//                         {item.aboutDescription}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               )}
//               keyExtractor={item => item._id}
//               initialNumToRender={10} // Render initial 10 items
//               maxToRenderPerBatch={10} // Batch size to render
//               windowSize={10} // Number of items kept in memory
//             />
//           )}
//         </View>

//         {/** end */}
//       </View>
//             </ImageBackground>
//             </View>

     
//     </SafeAreaView>
//   );
// };

// export default AboutUs;

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
//     marginVertical: heightPercentageToDP(1),
//     marginHorizontal: heightPercentageToDP(2),
//     borderRadius: heightPercentageToDP(1),
//   },
//   title: {
//     color: COLORS.white_s,
//     fontFamily: FONT.SF_PRO_MEDIUM,
//   },

//   textInput: {
//     width: '100%',
//     height: 150,
//     borderColor: 'gray',
//     borderWidth: 1,
//     padding: 10,
//     textAlignVertical: 'top',
//   },
// });
