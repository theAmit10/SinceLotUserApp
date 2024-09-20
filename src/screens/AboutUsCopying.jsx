import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {
    heightPercentageToDP,
    widthPercentageToDP,
  } from 'react-native-responsive-screen';
  import {COLORS, FONT} from '../../assets/constants';
  import GradientText from '../components/helpercComponent/GradientText';
  import {useNavigation} from '@react-navigation/native';
  import {useDispatch, useSelector} from 'react-redux';
  import Background from '../components/background/Background';
  import Clipboard from '@react-native-clipboard/clipboard';
  import Toast from 'react-native-toast-message';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
  
  const AboutUsCopying = ({route}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
  
    const {aboutusdata} = route.params;
  
    console.log(aboutusdata);
  
    const navigation = useNavigation();
  
    const dispatch = useDispatch();
  
    // For Password Visibility
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
  
    // for Submitting Response
    const submitHandler = () => {
      console.log('Working on login ');
    };
  
    const loading = false;
  
    const [filteredData, setFilteredData] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const [editable, setEditable] = useState(null);
  
    useEffect(() => {
      console.log("Selected text :: " + selectedText);
    }, [selectedText]);
  
    const copyToClipboard = () => {
      if (selectedText) {
        Clipboard.setString(selectedText);
        Toast.show({
          type: 'success',
          text1: 'Text Copied',
          text2: 'The text has been copied to your clipboard!',
        });
        setEditable(null); // Reset editable state after copying
        navigation.goBack()
      } else {
        Toast.show({
          type: 'info',
          text1:'No Text Selected',
          text2:'Please select some text to copy.'
        })
       
      }
    };
  
    return (
      <SafeAreaView style={{flex: 1}}>
        <Background />

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

              {/** Login Container */}
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
  
          {/** Game Description Main Container */}
          <View
            style={{
              flex: 1,
              margin: heightPercentageToDP(2),
            }}>
            <GradientTextWhite style={styles.textStyle}>
              About Us
            </GradientTextWhite>
            <GradientTextWhite style={styles.textStyle}>Details</GradientTextWhite>
  
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: heightPercentageToDP(3),
                  paddingVertical: heightPercentageToDP(2),
                  gap: heightPercentageToDP(2),
                }}>
                {/** Title container */}
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.white_s,
                    alignItems: 'center',
                    paddingHorizontal: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(1),
                    padding: heightPercentageToDP(1),
                  }}>
                  {/* <Text
                    style={{
                      marginStart: heightPercentageToDP(1),
                      flex: 1,
                      fontFamily: FONT.Montserrat_SemiBold,
                      fontSize: heightPercentageToDP(2),
                      color: COLORS.black,
                    }}>
                    {aboutusdata?.aboutTitle}
                  </Text> */}

                  <TextInput
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(2),
                      color: COLORS.black,
                    }}
                    multiline
                    editable={true}
                    value={aboutusdata?.aboutTitle}
                    showSoftInputOnFocus={false} // Disable keyboard
                    onSelectionChange={event => {
                      const {start, end} = event.nativeEvent.selection;
                      setSelectedText(aboutusdata.aboutTitle.substring(start, end));
                    }}
                  />

                </View>
  
                {/** Description Container */}
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.white_s,
                    alignItems: 'center',
                    paddingHorizontal: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(1),
                    padding: heightPercentageToDP(2),
                  }}>
                  <TextInput
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      fontSize: heightPercentageToDP(2),
                      color: COLORS.black,
                    }}
                    multiline
                    editable={true}
                    value={aboutusdata.aboutDescription}
                    showSoftInputOnFocus={false} // Disable keyboard
                    onSelectionChange={event => {
                      const {start, end} = event.nativeEvent.selection;
                      setSelectedText(aboutusdata.aboutDescription.substring(start, end));
                    }}
                  />
                </View>
              </View>
            </ScrollView>
            <View style={{padding: 10}}>
             
              <TouchableOpacity
               onPress={copyToClipboard}
                style={{
                  backgroundColor: COLORS.blue,
                  padding: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(1),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONT.Montserrat_Regular,
                  }}>
                  Copy Text
                </Text>
              </TouchableOpacity>
             
            </View>
          </View>
        </View>
            </ImageBackground>
            </View>
  
      
      </SafeAreaView>
    );
  };
  
  export default AboutUsCopying;
  
  const styles = StyleSheet.create({
    textStyle: {
      fontSize: heightPercentageToDP(4),
      fontFamily: FONT.Montserrat_Bold,
      color: COLORS.black,
    },
  });
  

// import {
//     Alert,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     View,
//   } from 'react-native';
//   import React, {useEffect, useState} from 'react';
//   import LoginBackground from '../components/login/LoginBackground';
//   import {
//     heightPercentageToDP,
//     widthPercentageToDP,
//   } from 'react-native-responsive-screen';
//   import {COLORS, FONT} from '../../assets/constants';
//   import GradientText from '../components/helpercComponent/GradientText';
//   import {useNavigation} from '@react-navigation/native';
//   import {useDispatch, useSelector} from 'react-redux';
//   import Background from '../components/background/Background';
// import Clipboard from '@react-native-clipboard/clipboard';
// import Toast from 'react-native-toast-message';
  
//   const AboutUsCopying = ({route}) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [passwordVisible, setPasswordVisible] = useState(false);
  
//     const {aboutusdata} = route.params;
  
//     console.log(aboutusdata);
  
//     const navigation = useNavigation();
  
//     const dispatch = useDispatch();
  
//     // For Password Visibility
//     const togglePasswordVisibility = () => {
//       setPasswordVisible(!passwordVisible);
//     };
  
//     // for Submitting Response
//     const submitHandler = () => {
//       console.log('Working on login ');
//     };
  
//     const loading = false;

//     const [filteredData, setFilteredData] = useState([]);
//     const [selectedText, setSelectedText] = useState('');
//     const [editable, setEditable] = useState(null);

//     useEffect(() => {
//         console.log("Seleted text :: "+selectedText)
//     },[selectedText])

//     const copyToClipboard = () => {
//         if (selectedText) {
//           Clipboard.setString(selectedText);
//           Toast.show({
//             type: 'success',
//             text1: 'Text Copied',
//             text2: 'The text has been copied to your clipboard!',
//           });
//           setEditable(null); // Reset editable state after copying
//         } else {
//           Alert.alert('No Text Selected', 'Please select some text to copy.');
//         }
//       };
  
//     return (
//       <View style={{flex: 1}}>
//         <Background />
  
//         {/** Login Cointainer */}
  
//         <View
//           style={{
//             height: heightPercentageToDP(75),
//             width: widthPercentageToDP(100),
//             backgroundColor: COLORS.white_s,
//             borderTopLeftRadius: heightPercentageToDP(5),
//             borderTopRightRadius: heightPercentageToDP(5),
//           }}>
//           {/** Top Style View */}
//           <View
//             style={{
//               height: heightPercentageToDP(5),
//               width: widthPercentageToDP(100),
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <View
//               style={{
//                 width: widthPercentageToDP(20),
//                 height: heightPercentageToDP(0.8),
//                 backgroundColor: COLORS.grayBg,
//                 borderRadius: heightPercentageToDP(2),
//               }}></View>
//           </View>
  
//           {/** Game Description Main Container */}
//           <View
//             style={{
//               flex: 1,
//               margin: heightPercentageToDP(2),
//             }}>
//             <GradientText style={styles.textStyle}>
//               About Us
//             </GradientText>
//             <GradientText style={styles.textStyle}>Details</GradientText>
  
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View
//                 style={{
//                   marginTop: heightPercentageToDP(3),
//                   paddingVertical: heightPercentageToDP(2),
//                   gap: heightPercentageToDP(2),
//                 }}>
//                 {/** Title container */}
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     backgroundColor: COLORS.grayBg,
//                     alignItems: 'center',
//                     paddingHorizontal: heightPercentageToDP(2),
//                     borderRadius: heightPercentageToDP(1),
//                     padding: heightPercentageToDP(2),
//                   }}>
//                   <Text
//                     style={{
//                       marginStart: heightPercentageToDP(1),
//                       flex: 1,
//                       fontFamily: FONT.Montserrat_SemiBold,
//                       fontSize: heightPercentageToDP(2),
//                       color: COLORS.black,
//                     }}>
//                     {aboutusdata?.aboutTitle}
//                   </Text>
//                 </View>
  
//                 {/** Description Containter */}
  
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     backgroundColor: COLORS.grayBg,
//                     alignItems: 'center',
//                     paddingHorizontal: heightPercentageToDP(2),
//                     borderRadius: heightPercentageToDP(1),
//                     padding: heightPercentageToDP(2),
//                   }}>
                  
//                   <TextInput
//                         style={{
//                           fontFamily: FONT.Montserrat_Regular,
//                           fontSize: heightPercentageToDP(2),
//                           color: COLORS.black,
//                         }}
//                         multiline
//                         editable={true}
//                         value={aboutusdata.aboutDescription}
//                         showSoftInputOnFocus={false} // Disable keyboard
//                         onSelectionChange={event => {
//                           const {start, end} = event.nativeEvent.selection;
//                           setSelectedText(aboutusdata.aboutDescription.substring(start, end));
//                         }}
//                       />
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </View>
//     );
//   };
  
//   export default AboutUsCopying;
  
//   const styles = StyleSheet.create({
//     textStyle: {
//       fontSize: heightPercentageToDP(4),
//       fontFamily: FONT.Montserrat_Bold,
//       color:COLORS.black,
//     },
//   });
  