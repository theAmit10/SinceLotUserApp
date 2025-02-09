import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';
import Feather from 'react-native-vector-icons/Feather';

const SelectYearAndMonth = ({
  visible,
  onClose,
  setSelectedYear,
  setSelectedMonth,
  selectedMonth,
  selectedYear,
}) => {
  const years = Array.from({length: 101}, (_, i) => 2021 + i);
  const yearRows = years.reduce((acc, year, index) => {
    const rowIndex = Math.floor(index / 3); // Group years into rows of 3
    if (!acc[rowIndex]) acc[rowIndex] = [];
    acc[rowIndex].push(year);
    return acc;
  }, []);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthRows = months.reduce((acc, month, index) => {
    const rowIndex = Math.floor(index / 2); // Group months into rows of 2
    if (!acc[rowIndex]) acc[rowIndex] = [];
    acc[rowIndex].push(month);
    return acc;
  }, []);

  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.overlayContainer}>
          <ImageBackground
            source={require('../../../assets/image/tlwbg.jpg')}
            imageStyle={styles.imageStyle}
            style={styles.imageBackground}>
            <View style={styles.overlay} />

            {/** TOP BAR */}
            <View style={styles.topBar}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <View style={styles.iconContainer}>
                  <Feather
                    name={'arrow-left-circle'}
                    size={heightPercentageToDP(4)}
                    color={COLORS.darkGray}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.header}>
                <Text style={styles.headerText}>Result</Text>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.title}>Select Year</Text>
              <View style={styles.scrollContainer}>
                <ScrollView nestedScrollEnabled={true}>
                  {yearRows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.rowContainer}>
                      {row.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedYear(item)}
                          style={{
                            ...styles.itemButton,
                            backgroundColor:
                              selectedYear === item
                                ? COLORS.green
                                : COLORS.white_s,
                          }}>
                          <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.title}>Select Month</Text>
              <View style={styles.scrollContainer}>
                <ScrollView nestedScrollEnabled={true}>
                  {monthRows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.rowContainer}>
                      {row.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSelectedMonth(item);
                            onClose();
                          }}
                          style={{
                            ...styles.itemButton,
                            backgroundColor:
                              selectedMonth === item
                                ? COLORS.green
                                : COLORS.white_s,
                          }}>
                          <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SelectYearAndMonth;

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageStyle: {
    borderRadius: heightPercentageToDP(3),
  },
  imageBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(80),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: heightPercentageToDP(3),
  },
  topBar: {
    height: heightPercentageToDP(8),
    width: widthPercentageToDP(95),
    margin: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
    flexDirection: 'row',
  },
  closeButton: {
    paddingEnd: heightPercentageToDP(2),
  },
  iconContainer: {
    backgroundColor: COLORS.grayHalfBg,
    padding: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(1),
    alignSelf: 'flex-start',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.white_s,
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(2),
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    padding: heightPercentageToDP(2),
    gap: heightPercentageToDP(1),
  },
  scrollContainer: {
    height: heightPercentageToDP(30),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: heightPercentageToDP(2),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: heightPercentageToDP(1),
  },
  itemButton: {
    flex: 1,
    margin: heightPercentageToDP(1),
    padding: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: COLORS.black,
    fontFamily: FONT.Montserrat_SemiBold,
    fontSize: heightPercentageToDP(1.8),
  },
  title: {
    fontFamily: FONT.HELVETICA_BOLD,
    fontSize: heightPercentageToDP(2),
    color: COLORS.white_s,
  },
});

// import React from 'react';
// import {
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Modal,
// } from 'react-native';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../../assets/constants';
// import Feather from 'react-native-vector-icons/Feather';

// const SelectYearAndMonth = ({visible, onClose, setSelectedYear, setSelectedMonth,selectedMonth,selectedYear}) => {
//   const years = Array.from({length: 101}, (_, i) => 2000 + i);
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose} // Optional for Android back button handling
//     >
//       <View style={styles.overlayContainer}>
//         <ImageBackground
//           source={require('../../../assets/image/tlwbg.jpg')}
//           imageStyle={styles.imageStyle}
//           style={styles.imageBackground}>
//           {/* Transparent Black Overlay */}
//           <View style={styles.overlay} />

//           {/** TOP BAR */}
//           <View style={styles.topBar}>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <View style={styles.iconContainer}>
//                 <Feather
//                   name={'arrow-left-circle'}
//                   size={heightPercentageToDP(4)}
//                   color={COLORS.darkGray}
//                 />
//               </View>
//             </TouchableOpacity>
//             <View style={styles.header}>
//               <Text style={styles.headerText}>Result</Text>
//             </View>
//           </View>

//           <View style={styles.contentContainer}>
//             <Text style={styles.title}>Select Year</Text>
//             <View style={styles.scrollContainer}>
//               <ScrollView nestedScrollEnabled={true}>
//                 {years.map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     onPress={() => {
//                       setSelectedYear(item);
//                     }}
//                     style={{...styles.itemButton,
//                         backgroundColor: selectedYear === item ? COLORS.green : COLORS.white_s
//                         }}>
//                     <Text style={styles.itemText}>{item}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             <Text style={styles.title}>Select Month</Text>
//             <View style={styles.scrollContainer}>
//               <ScrollView nestedScrollEnabled={true}>
//                 {months.map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     onPress={() => {
//                       setSelectedMonth(item);
//                       onClose();
//                     }}
//                     style={{...styles.itemButton,
//                     backgroundColor: selectedMonth === item ? COLORS.green : COLORS.white_s
//                     }}>
//                     <Text style={styles.itemText}>{item}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </ImageBackground>
//       </View>
//     </Modal>
//   );
// };

// export default SelectYearAndMonth;

// const styles = StyleSheet.create({
//   overlayContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   imageStyle: {
//     borderRadius: heightPercentageToDP(3),
//   },
//   imageBackground: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: widthPercentageToDP(95),
//     height: heightPercentageToDP(95),
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: heightPercentageToDP(3),
//   },
//   topBar: {
//     height: heightPercentageToDP(8),
//     width: widthPercentageToDP(95),
//     margin: heightPercentageToDP(2),
//     padding: heightPercentageToDP(1),
//     flexDirection: 'row',
//   },
//   closeButton: {
//     paddingEnd: heightPercentageToDP(2),
//   },
//   iconContainer: {
//     backgroundColor: COLORS.grayHalfBg,
//     padding: heightPercentageToDP(0.5),
//     borderRadius: heightPercentageToDP(1),
//     alignSelf: 'flex-start',
//   },
//   header: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     color: COLORS.white_s,
//     fontFamily: FONT.Montserrat_Bold,
//     fontSize: heightPercentageToDP(2),
//   },
//   contentContainer: {
//     flex: 1,
//     width: '100%',
//     padding: heightPercentageToDP(2),
//     gap: heightPercentageToDP(1),
//   },
//   scrollContainer: {
//     height: heightPercentageToDP(30),
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: heightPercentageToDP(2),
//   },
//   itemButton: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.white_s,
//     margin: heightPercentageToDP(1),
//     padding: heightPercentageToDP(1),
//     borderRadius: heightPercentageToDP(1),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemText: {
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_SemiBold,
//     fontSize: heightPercentageToDP(1.8),
//   },
//   title: {
//     fontFamily: FONT.HELVETICA_BOLD,
//     fontSize: heightPercentageToDP(2),
//     color: COLORS.white_s,
//   },
// });
