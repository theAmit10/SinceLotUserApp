import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Slider,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const gray = '#91A1BD';

const NeuMorph = ({children, size, style}) => {
  return (
    <View
      style={[
        styles.neuMorphWrapper,
        {width: size, height: size, borderRadius: size / 2},
      ]}>
      {/* Light Shadow */}
      <View
        style={[
          styles.shadowLight,
          {width: size, height: size, borderRadius: size / 2},
        ]}
      />
      {/* Dark Shadow */}
      <View
        style={[
          styles.shadowDark,
          {width: size, height: size, borderRadius: size / 2},
        ]}
      />
      {/* Inner Content */}
      <View
        style={[
          styles.inner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}>
        {children}
      </View>
    </View>
  );
};

const TempScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{alignSelf: 'stretch'}}>
        <View style={{marginHorizontal: 32, marginTop: 32}}>
          <View style={styles.topContainer}>
            <NeuMorph size={48}>
              <AntDesign name="arrowleft" size={20} color={gray} />
            </NeuMorph>
            <View>
              <Text style={styles.playing}>PLAYING NOW</Text>
            </View>
            <NeuMorph size={48}>
              <Entypo name="menu" size={20} color={gray} />
            </NeuMorph>
          </View>

          <View style={styles.songArtContainer}>
            <NeuMorph size={300}>
              <Image
                style={styles.songArt}
                source={require('../../assets/image/dark_user.png')}
              />
            </NeuMorph>
          </View>

          <View style={styles.songContainer}>
            <Text style={styles.title}>Lost it</Text>
            <Text style={styles.artist}>Flume ft. Vic Mensa</Text>
          </View>

          <View style={styles.trackContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.time}>1:21</Text>
              <Text style={styles.time}>3:46</Text>
            </View>

            {/* <Slider
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#8AAAFF"
              maximumTrackTintColor="#DAE6F4"
              thumbTintColor="#7B9BFF"
            /> */}
          </View>

          <View style={styles.controlContainer}>
            <NeuMorph size={48}>
              <AntDesign name="banckward" size={20} color={gray} />
            </NeuMorph>
            <NeuMorph size={48}>
              <AntDesign name="pause" size={20} color={gray} />
            </NeuMorph>
            <NeuMorph size={48}>
              <AntDesign name="forward" size={20} color={gray} />
            </NeuMorph>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TempScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEE9FD',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  neuMorphWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  shadowLight: {
    position: 'absolute',
    top: -3,
    left: -3,
    backgroundColor: '#FBFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: {width: -6, height: -6},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  shadowDark: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#B7C4DD',
    shadowColor: '#B7C4DD',
    shadowOffset: {width: 6, height: 6},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  inner: {
    backgroundColor: '#DEE9F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E2ECFD',
    borderWidth: 1,
    elevation: 6, // Ensures Android doesn't make it look flat
  },
  playing: {
    color: gray,
    fontWeight: '800',
  },
  songArtContainer: {
    marginVertical: 32,
    alignItems: 'center',
  },
  songArt: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: '#D7E1F3',
    borderWidth: 10,
  },
  songContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '6C7A93',
    fontWeight: '600',
  },
  artist: {
    fontSize: 14,
    marginTop: 6,
    color: gray,
    fontWeight: '500',
  },
  trackContainer: {
    marginTop: 32,
    marginBottom: 64,
  },
  time: {
    fontSize: 10,
    color: gray,
    fontWeight: '700',
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   Platform,
//   Image,
//   Slider,
// } from 'react-native';
// import React from 'react';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Entypo from 'react-native-vector-icons/Entypo';

// const gray = '#91A1BD';

// const NeuMorph = ({children, size, style}) => {
//   return (
//     <View
//       style={[
//         styles.neuMorphWrapper,
//         {width: size, height: size, borderRadius: size / 2},
//       ]}>
//       {/* Light Shadow */}
//       <View
//         style={[
//           styles.shadowLight,
//           {width: size, height: size, borderRadius: size / 2},
//         ]}
//       />
//       {/* Dark Shadow */}
//       <View
//         style={[
//           styles.shadowDark,
//           {width: size, height: size, borderRadius: size / 2},
//         ]}
//       />
//       {/* Inner Content */}
//       <View
//         style={[
//           styles.inner,
//           {
//             width: size,
//             height: size,
//             borderRadius: size / 2,
//           },
//           style,
//         ]}>
//         {children}
//       </View>
//     </View>
//   );
// };

// const TempScreen = () => {
//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={{alignSelf: 'stretch'}}>
//         <View style={{marginHorizontal: 32, marginTop: 32}}>
//           <View style={styles.topContainer}>
//             <NeuMorph size={48}>
//               <AntDesign name="arrowleft" size={20} color={gray} />
//             </NeuMorph>
//             <View>
//               <Text style={styles.playing}>PLAYING NOW</Text>
//             </View>
//             <NeuMorph size={48}>
//               <Entypo name="menu" size={20} color={gray} />
//             </NeuMorph>
//           </View>

//           <View style={styles.songArtContainer}>
//             <NeuMorph size={300}>
//               <Image
//                 style={styles.songArt}
//                 source={require('../../assets/image/dark_user.png')}
//               />
//             </NeuMorph>
//           </View>

//           <View style={styles.songContainer}>
//             <Text style={styles.title}>Lost it</Text>
//             <Text style={styles.artist}>Flume ft. Vic Mensa</Text>
//           </View>

//           <View style={styles.trackContainer}>
//             <View
//               style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//               <Text style={styles.time}>1:21</Text>
//               <Text style={styles.time}>3:46</Text>
//             </View>

//             {/* <Slider
//               minimumValue={0}
//               maximumValue={1}
//               minimumTrackTintColor="#8AAAFF"
//               maximumTrackTintColor="#DAE6F4"
//               thumbTintColor="#7B9BFF"
//             /> */}
//           </View>

//           <View style={styles.controlContainer}>
//             <NeuMorph size={48}>
//               <AntDesign name="banckward" size={20} color={gray} />
//             </NeuMorph>
//             <NeuMorph size={48}>
//               <AntDesign name="pause" size={20} color={gray} />
//             </NeuMorph>
//             <NeuMorph size={48}>
//               <AntDesign name="forward" size={20} color={gray} />
//             </NeuMorph>
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default TempScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#DEE9FD',
//     alignItems: 'center',
//   },
//   topContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   neuMorphWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   shadowLight: {
//     position: 'absolute',
//     top: -3,
//     left: -3,
//     backgroundColor: '#FBFFFF',
//     shadowColor: '#FFFFFF',
//     shadowOffset: {width: -6, height: -6},
//     shadowOpacity: 1,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   shadowDark: {
//     position: 'absolute',
//     bottom: -3,
//     right: -3,
//     backgroundColor: '#B7C4DD',
//     shadowColor: '#B7C4DD',
//     shadowOffset: {width: 6, height: 6},
//     shadowOpacity: 1,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   inner: {
//     backgroundColor: '#DEE9F7',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor: '#E2ECFD',
//     borderWidth: 1,
//     elevation: 6, // Ensures Android doesn't make it look flat
//   },
//   playing: {
//     color: gray,
//     fontWeight: '800',
//   },
//   songArtContainer: {
//     marginVertical: 32,
//     alignItems: 'center',
//   },
//   songArt: {
//     width: 300,
//     height: 300,
//     borderRadius: 150,
//     borderColor: '#D7E1F3',
//     borderWidth: 10,
//   },
//   songContainer: {
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 30,
//     color: '6C7A93',
//     fontWeight: '600',
//   },
//   artist: {
//     fontSize: 14,
//     marginTop: 6,
//     color: gray,
//     fontWeight: '500',
//   },
//   trackContainer: {
//     marginTop: 32,
//     marginBottom: 64,
//   },
//   time: {
//     fontSize: 10,
//     color: gray,
//     fontWeight: '700',
//   },
//   controlContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
// });
