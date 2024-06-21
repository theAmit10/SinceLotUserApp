// import {
//   Alert,
//   FlatList,
//   StyleSheet,
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
// import Clipboard from '@react-native-clipboard/clipboard';

// const AboutUs = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const {accesstoken, loadingAbout, abouts} = useSelector(state => state.user);

  // const [filteredData, setFilteredData] = useState([]);
  // const [selectedText, setSelectedText] = useState('');
  // const [editable, setEditable] = useState(null);

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
//     setFilteredData(abouts); // Update filteredData whenever abouts change
//   }, [abouts]);

  // const copyToClipboard = () => {
  //   if (selectedText) {
  //     Clipboard.setString(selectedText);
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Text Copied',
  //       text2: 'The text has been copied to your clipboard!',
  //     });
  //     setEditable(null); // Reset editable state after copying
  //   } else {
  //     Alert.alert('No Text Selected', 'Please select some text to copy.');
  //   }
  // };

//   return (
//     <View style={{flex: 1}}>
//       <Background />

//       <View
//         style={{
//           margin: heightPercentageToDP(2),
//           backgroundColor: 'transparent',
//         }}>
//         <GradientText style={styles.textStyle}>About</GradientText>
//         <GradientText style={styles.textStyle}>Us</GradientText>
//       </View>

//       <View
//         style={{
//           height: heightPercentageToDP(70),
//           width: widthPercentageToDP(100),
//           backgroundColor: COLORS.white_s,
//           borderTopLeftRadius: heightPercentageToDP(5),
//           borderTopRightRadius: heightPercentageToDP(5),
//         }}>
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

//         <View
//           style={{
//             height: heightPercentageToDP(10),
//             margin: heightPercentageToDP(2),
//           }}>
//           <View
//             style={{
//               height: heightPercentageToDP(7),
//               flexDirection: 'row',
//               backgroundColor: COLORS.grayHalfBg,
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

//         <View style={{flex: 2}}>
//           {loadingAbout ? (
//             <Loading />
//           ) : (
//             <FlatList
//               data={filteredData}
//               renderItem={({item, index}) => (
//                 <View style={styles.item}>
//                   <View
//                     style={{
//                       backgroundColor: COLORS.grayHalfBg,
//                       borderRadius: heightPercentageToDP(2),
//                     }}>
//                     <TouchableOpacity
//                       onPress={() => setEditable(null)}
//                       onLongPress={() => setEditable(item._id)}
//                       style={{
//                         backgroundColor:
//                           index % 2 === 0
//                             ? COLORS.lightDarkGray
//                             : COLORS.grayBg,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         padding: heightPercentageToDP(1),
//                       }}>
//                       <TextInput
//                         style={{
//                           fontFamily: FONT.Montserrat_Bold,
//                           fontSize: heightPercentageToDP(2),
//                           color: COLORS.black,
//                         }}
//                         multiline
//                         editable={editable === item._id}
//                         value={item.aboutTitle}
//                         showSoftInputOnFocus={false} // Disable keyboard
//                         onSelectionChange={event => {
//                           const {start, end} = event.nativeEvent.selection;
//                           setSelectedText(item.aboutTitle.substring(start, end));
//                         }}
//                       />
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() => setEditable(null)}
//                       onLongPress={() => setEditable(item._id)}
//                       style={{
//                         alignItems: 'center',
//                         paddingHorizontal: heightPercentageToDP(1),
//                         paddingVertical: heightPercentageToDP(2),
//                       }}>
                      // <TextInput
                      //   style={{
                      //     fontFamily: FONT.Montserrat_Regular,
                      //     fontSize: heightPercentageToDP(2),
                      //     color: COLORS.black,
                      //   }}
                      //   multiline
                      //   editable={editable === item._id}
                      //   value={item.aboutDescription}
                      //   showSoftInputOnFocus={false} // Disable keyboard
                      //   onSelectionChange={event => {
                      //     const {start, end} = event.nativeEvent.selection;
                      //     setSelectedText(item.aboutDescription.substring(start, end));
                      //   }}
                      // />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//               keyExtractor={item => item._id}
//               initialNumToRender={10} // Render initial 10 items
//               maxToRenderPerBatch={10} // Batch size to render
//               windowSize={10} // Number of items kept in memory
//             />
//           )}
//         </View>
//       </View>
//     </View>
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

import {

  FlatList,
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
    setFilteredData(abouts); // Update filteredData whenever locations change
  }, [abouts]);


  return (
    <View style={{flex: 1}}>
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

      <View
        style={{
          height: heightPercentageToDP(70),
          width: widthPercentageToDP(100),
          backgroundColor: COLORS.white_s,
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
              backgroundColor: COLORS.grayHalfBg,
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
            <FlatList
              data={filteredData}
              renderItem={({item, index}) => (
                <TouchableOpacity
                onPress={() =>
                  Toast.show({
                    type: 'info',
                    text1: 'Long Press for Copy Option',
                  })
                }
                onLongPress={() => navigation.navigate("AboutUsCopying",{
                  aboutusdata:item
                })}
                  style={{
                    ...styles.item,
                  }}>
                  <View
                    style={{
                      backgroundColor: COLORS.grayHalfBg,
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
                        }}>
                        {item.aboutDescription}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id}
              initialNumToRender={10} // Render initial 10 items
              maxToRenderPerBatch={10} // Batch size to render
              windowSize={10} // Number of items kept in memory
            />
          )}
        </View>

        {/** end */}
      </View>
    </View>
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
