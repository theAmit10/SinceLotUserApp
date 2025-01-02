import {
  Alert,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginBackground from '../components/login/LoginBackground';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HOVER} from 'nativewind/dist/utils/selector';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Background from '../components/background/Background';
import {useDispatch, useSelector} from 'react-redux';
import {getResultAccordingToLocationTimeDate} from '../redux/actions/resultAction';
import Loading from '../components/helpercComponent/Loading';
import NoDataFound from '../components/helpercComponent/NoDataFound';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import { getDateTimeAccordingToUserTimezone, getTimeAccordingToTimezone } from './SearchTime';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import UrlHelper from '../helper/UrlHelper';
import axios from 'axios';

const Result = ({route}) => {
  const {datedata} = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const {accesstoken,user} = useSelector(state => state.user);
  // const {loadingResult, results} = useSelector(state => state.result);
  const [filteredData, setFilteredData] = useState([]);

  const focused = useIsFocused();

  const [loadingResult,setloadingResult] = useState(false);

  const getResultAccordingToLocationTimeDate = async (
    lotdateId,
    lottimeId,
    lotlocationId,
  ) => {
    try {
      const url = `${UrlHelper.RESULT_API}?lotdateId=${lotdateId}&lottimeId=${lottimeId}&lotlocationId=${lotlocationId}`;
      console.log('URL :: ' + url);
      setloadingResult(true)

      const {data} = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });

      console.log('ACTION result :: ' + JSON.stringify(data.results));
      setFilteredData(data.results)

      setloadingResult(false);
    } catch (error) {
      setloadingResult(false);
      console.log(error);
      console.log('Error message:', error.response?.data?.message);
    }
  };

  useEffect(() => {
    // dispatch(
    //   getResultAccordingToLocationTimeDate(
    //     accesstoken,
    //     datedata._id,
    //     datedata.lottime._id,
    //     datedata.lottime.lotlocation._id,
    //   ),
    // );

    getResultAccordingToLocationTimeDate(
      datedata._id,
      datedata.lottime._id,
      datedata.lottime.lotlocation._id,
    )

  }, [focused]);

  // useEffect(() => {
  //   if(!loadingResult && results){
  //     setFilteredData(results); // Update filteredData whenever locations change
  //   }

  // }, [results]);

  const submitHandler = () => {
    console.log('Working on login ');
    Toast.show({
      type: 'success',
      text1: 'Processing',
    });
  };

    // FOR DOWNLOAD PDF

    const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Result</title>
        <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
        <style>
          ${htmlStyles}
        </style>
      </head>
      <body>
        <header>
          <h1>RESULT</h1>
        </header>
        <article>
      
          <table class="inventory">
            <thead>
              <tr>
                <th><span>Location</span></th>
                <th><span>Date</span></th>
                <th><span>Time</span></th>
                <th><span>Result</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span>${filteredData[0]?.lotlocation?.lotlocation}</span></td>
                <td><span>${getDateTimeAccordingToUserTimezone(
                  filteredData[0]?.lottime?.lottime,
                  filteredData[0]?.lotdate?.lotdate,
                  user?.country?.timezone,
                )}</span></td>
                <td><span>${getTimeAccordingToTimezone(filteredData[0]?.lottime?.lottime, user?.country?.timezone)}</span></td>
                <td><span>${filteredData[0]?.resultNumber}</span></td>
              </tr>
            </tbody>
          </table>
          
        </article>
        <aside>
          <h1><span>Since 2001</span></h1>
          <div>
            <p>Thank you for download</p>
          </div>
        </aside>
      </body>
    </html>
  `;
  
    const checkAndRequestPermission = async () => {
      const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  
      if (result === RESULTS.DENIED) {
        if (Platform.OS === 'android' && Platform.Version <= 29) {
          // Target Android 10 and above
          const permissionResult = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          );
          if (permissionResult !== RESULTS.GRANTED) {
            console.log('Permission not granted!');
            Toast.show({
              type: 'info',
              text1: 'Permission not granted!',
            });
            return;
          }
        }
      }
  
      // Call your DocumentPicker.pick() function here
  
      console.log('Permission status');
      createPDF();
    };
  
    const createPDF = async () => {
      let options = {
        //Content to print
        html: htmlContent,
        //File Name
        fileName: `${filteredData[0]?.lotdate?.lotdate}${getTimeAccordingToTimezone(filteredData[0]?.lottime?.lottime, user?.country?.timezone)}`,
        //File directory
        directory: 'Download',
  
        base64: true,
      };
  
      let file = await RNHTMLtoPDF.convert(options);
      // console.log(file.filePath);
      Alert.alert(
        'Successfully Exported',
        'Path:' + file.filePath,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open', onPress: () => openFile(file.filePath)},
        ],
        {cancelable: true},
      );
    };
  
    const openFile = filepath => {
      const path = filepath; // absolute-path-to-my-local-file.
      FileViewer.open(path)
        .then(() => {
          // success
          console.log('All Good no error found');
        })
        .catch(error => {
          // error
          console.log('Found error :: ' + error);
        });
    };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />

      {/** Result Cointainer */}

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

            {/** Result Main Container */}

            <View
              style={{
                margin: heightPercentageToDP(2),
                backgroundColor: 'transparent',
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Result
              </GradientTextWhite>
              <GradientTextWhite style={styles.textStyle}>
                Details
              </GradientTextWhite>
            </View>

            {loadingResult ? (
              <Loading />
            ) : filteredData.length == 0 ? (
              <NoDataFound data={'No Result Found'} />
            ) : (
              <View
                style={{
                  flex: 1,
                  margin: heightPercentageToDP(2),
                }}>
                <View
                  style={{
                    marginTop: heightPercentageToDP(3),
                    paddingVertical: heightPercentageToDP(2),
                    gap: heightPercentageToDP(2),
                  }}>
                  <View
                    style={{
                      height: heightPercentageToDP(35),
                      backgroundColor: COLORS.grayHalfBg,
                      marginTop: heightPercentageToDP(-4),
                      borderRadius: heightPercentageToDP(1),
                    }}>
                    <View
                      style={{
                        height: heightPercentageToDP(25),
                        borderRadius: heightPercentageToDP(1),
                        flexDirection: 'row',
                      }}>
                      {/** Top view left container */}
                      <View
                        style={{
                          flex: 4,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_Regular,
                            fontSize: heightPercentageToDP(3),
                            marginTop: heightPercentageToDP(1),
                            color: COLORS.black,
                          }}>
                          {filteredData[0].lotlocation.lotlocation}
                        </Text>

                        <GradientText
                          style={{
                            fontSize: heightPercentageToDP(11),
                            color: COLORS.black,
                          }}>
                          {filteredData[0].resultNumber}
                        </GradientText>
                      </View>

                      {/** Top view right container */}
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.gray2,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            transform: [{rotate: '90deg'}],
                            color: COLORS.black,
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(2),
                          }}>
                          {getTimeAccordingToTimezone(filteredData[0].lottime.lottime, user?.country?.timezone)}
                        </Text>
                      </View>
                    </View>

                    {/** Big Result bottom container */}

                    <View
                      style={{
                        flex: 1,
                        backgroundColor: COLORS.white_s,
                        margin: heightPercentageToDP(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: heightPercentageToDP(1),
                      }}>
                      <View
                        style={{
                          backgroundColor: COLORS.grayHalfBg,
                          padding: heightPercentageToDP(1),
                          borderRadius: heightPercentageToDP(1),
                          marginStart: heightPercentageToDP(-3),
                        }}>
                        <Ionicons
                          name={'calendar'}
                          size={heightPercentageToDP(3)}
                          color={COLORS.darkGray}
                        />
                      </View>

                      <Text
                        style={{
                          fontFamily: FONT.Montserrat_Regular,
                          fontSize: heightPercentageToDP(2),
                          color: COLORS.black,
                        }}>
                        {/* {filteredData[0].lotdate.lotdate} */}
                        {
                          getDateTimeAccordingToUserTimezone(
                            filteredData[0].lottime.lottime,
                            filteredData[0].lotdate.lotdate,
                            user?.country?.timezone,
                          )
                        }
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={checkAndRequestPermission}
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
                      Download
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Result;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
});

const htmlStyles = `
*{
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}

h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }

/* table */

table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: center; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }

/* page */

html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
html { background: #999; cursor: default; }

body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

/* header */

header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }

header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }

/* article */

article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }

article address { float: left; font-size: 125%; font-weight: bold; }

/* table meta & balance */

table.meta, table.balance { float: right; width: 36%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

/* table meta */

table.meta th { width: 40%; }
table.meta td { width: 60%; }

/* table items */

table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }

table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: center; width: 12%; }
table.inventory td:nth-child(4) { text-align: center; width: 12%; }
table.inventory td:nth-child(5) { text-align: center; width: 12%; }

/* table balance */

table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }

/* aside */

aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`;