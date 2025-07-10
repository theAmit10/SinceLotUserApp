// CustomAlert.js
import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';

const CustomAlertForDeposit = ({
  visible,
  onClose,
  onYes,
  defaultAmount,
  usercountry,
  paymentType,
}) => {
  const [paymentUpdateNote, setPaymentUpdateNote] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [amount, setAmount] = useState(defaultAmount);
  const [imageFileName, setImageFileName] = useState('Choose a file');
  const [mineImage, setMineImage] = useState(null);

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      if (doc) {
        console.log(doc);
        setMineImage(doc);
        setImageSource(doc);
        setImageFileName(doc[0].name);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log('User cancelled the upload', err);
      else console.log(err);
    }
  };

  const handleConfirm = () => {
    // Call the onConfirm callback with the paymentUpdateNote, imageSource, and amount
    onYes({paymentUpdateNote, imageSource, amount});
  };

  const handleReject = () => {
    onClose();
  };

  // Set default amount whenever the modal opens or defaultAmount changes
  useEffect(() => {
    // setAmount(defaultAmount);
    const defaultAt =
      Number.parseInt(defaultAmount) *
      Number.parseFloat(usercountry.countrycurrencyvaluecomparedtoinr);
    setAmount(defaultAt);
  }, [defaultAmount]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View
            style={{
              width: '40%',
              paddingHorizontal: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LinearGradient
              colors={[COLORS.lightWhite, COLORS.white_s]}
              style={{
                borderRadius: heightPercentageToDP(2),
                padding: heightPercentageToDP(1),
              }}>
              <MaterialCommunityIcons
                name={'security'}
                size={heightPercentageToDP(4)}
                color={COLORS.black}
              />
            </LinearGradient>
          </View>
          <Text style={{...styles.alertText, fontFamily: FONT.Montserrat_Bold}}>
            Are you sure?
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.black,
              backgroundColor: COLORS.grayHalfBg,
              padding: heightPercentageToDP(2),
              fontFamily: FONT.Montserrat_SemiBold,
              fontSize: heightPercentageToDP(2),
              borderRadius: heightPercentageToDP(2),
              width: widthPercentageToDP(90),
              textAlign: 'center',
              marginBottom: heightPercentageToDP(2),
            }}>
            Country : {usercountry.countryname}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.black,
              backgroundColor: COLORS.grayHalfBg,
              padding: heightPercentageToDP(2),
              fontFamily: FONT.Montserrat_SemiBold,
              fontSize: heightPercentageToDP(2),
              borderRadius: heightPercentageToDP(2),
              width: widthPercentageToDP(90),
              textAlign: 'center',
              marginBottom: heightPercentageToDP(2),
            }}>
            Currency : {usercountry.countrycurrencysymbol} {'     '} Value :{' '}
            {usercountry.countrycurrencyvaluecomparedtoinr}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              color: COLORS.black,
              backgroundColor: COLORS.grayHalfBg,
              padding: heightPercentageToDP(2),
              fontFamily: FONT.Montserrat_SemiBold,
              fontSize: heightPercentageToDP(2),
              borderRadius: heightPercentageToDP(2),
              width: widthPercentageToDP(90),
              textAlign: 'center',
              marginBottom: heightPercentageToDP(2),
            }}>
            Payment : {paymentType}
            {'  '}
            {'  '}Amt : {defaultAmount}
          </Text>
          {/** AMOUNT */}
          <View
            style={{
              borderRadius: heightPercentageToDP(2),
              padding: heightPercentageToDP(1),
            }}>
            <Text
              style={{
                fontFamily: FONT.Montserrat_SemiBold,
                color: COLORS.black,
                fontSize: heightPercentageToDP(2),
                paddingStart: heightPercentageToDP(1),
              }}>
              Amount
            </Text>

            <LinearGradient
              colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
              start={{x: 0, y: 0}} // start from left
              end={{x: 1, y: 0}} // end at right
              style={{
                borderRadius: heightPercentageToDP(2),
                width: widthPercentageToDP(90),
                minHeight: heightPercentageToDP(6),
                justifyContent: 'center',
              }}>
              <TextInput
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                cursorColor={COLORS.white}
                placeholderTextColor={COLORS.black}
                style={{
                  backgroundColor: 'transparent',
                  fontFamily: FONT.Montserrat_Bold,
                  color: COLORS.black,
                  textAlign: 'center',
                  fontSize: heightPercentageToDP(2.5),
                }}
                textColor={COLORS.black}
                fontFamily={FONT.Montserrat_Bold}
                value={amount?.toString()}
                onChangeText={text => setAmount(text)}
              />
            </LinearGradient>
          </View>
          {/** NOTE */}
          <View
            style={{
              borderRadius: heightPercentageToDP(2),
              padding: heightPercentageToDP(1),
            }}>
            <Text
              style={{
                fontFamily: FONT.Montserrat_SemiBold,
                color: COLORS.black,
                fontSize: heightPercentageToDP(2),
                paddingStart: heightPercentageToDP(1),
              }}>
              Note
            </Text>

            <LinearGradient
              colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
              start={{x: 0, y: 0}} // start from left
              end={{x: 1, y: 0}} // end at right
              style={{
                borderRadius: heightPercentageToDP(2),
                width: widthPercentageToDP(90),
                minHeight: heightPercentageToDP(6),
                justifyContent: 'center',
              }}>
              <TextInput
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                cursorColor={COLORS.white}
                placeholderTextColor={COLORS.black}
                style={{
                  backgroundColor: 'transparent',
                  fontFamily: FONT.Montserrat_Bold,
                  color: COLORS.black,
                  paddingStart: heightPercentageToDP(2),
                  paddingEnd: heightPercentageToDP(2),
                }}
                textColor={COLORS.black}
                fontFamily={FONT.Montserrat_Bold}
                value={paymentUpdateNote}
                onChangeText={text => setPaymentUpdateNote(text)}
              />
            </LinearGradient>
          </View>
          {/** RECEIPT */}
          <TouchableOpacity
            onPress={selectDoc}
            style={{
              borderRadius: heightPercentageToDP(2),

              padding: heightPercentageToDP(1),
            }}>
            <Text
              style={{
                fontFamily: FONT.Montserrat_SemiBold,
                color: COLORS.black,
                fontSize: heightPercentageToDP(2),
                paddingStart: heightPercentageToDP(1),
              }}>
              Receipt
            </Text>

            <LinearGradient
              colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
              start={{x: 0, y: 0}} // start from left
              end={{x: 1, y: 0}} // end at right
              style={{
                borderRadius: heightPercentageToDP(2),
                flexDirection: 'row',
                alignItems: 'center', // Ensures vertical alignment of items
                padding: heightPercentageToDP(0.5), // Adjust padding for spacing
                width: widthPercentageToDP(90),
              }}>
              <Text
                style={{
                  backgroundColor: 'transparent',
                  fontFamily: FONT.HELVETICA_REGULAR,
                  color: COLORS.black,
                  fontSize: heightPercentageToDP(2),
                  textAlign: 'left',
                  paddingStart: heightPercentageToDP(2), // Padding for spacing on the left
                  flex: 1, // Let the text take available space
                }}>
                {imageFileName}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingEnd: heightPercentageToDP(2),
                }}>
                <LinearGradient
                  colors={[COLORS.grayBg, COLORS.white_s]}
                  style={{borderRadius: 20, padding: 10}}>
                  <AntDesign
                    name={'upload'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.darkGray}
                  />
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <View
              style={{
                height: heightPercentageToDP(7),
                width: '100%',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.green,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomLeftRadius: heightPercentageToDP(2),
                }}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_Regular,
                    fontSize: heightPercentageToDP(2),
                    color: COLORS.white_s,
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  height: '100%',
                  width: 1,
                  backgroundColor: COLORS.white_s,
                }}></View>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: COLORS.red,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomRightRadius: heightPercentageToDP(2),
                }}
                onPress={handleReject}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_Regular,
                    fontSize: heightPercentageToDP(2),
                    color: COLORS.white_s,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: widthPercentageToDP(95),
    minHeight: heightPercentageToDP(80),
    backgroundColor: 'white',
    borderRadius: heightPercentageToDP(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    marginBottom: heightPercentageToDP(1),
    fontSize: heightPercentageToDP(3),
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONT.SF_PRO_REGULAR,
  },
  buttonContainer: {
    flex: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-end',
  },
});

export default CustomAlertForDeposit;
