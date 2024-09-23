// CustomAlert.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { serverName } from '../../redux/store';


const CustomReceiptViewer = ({visible, onClose, onYes, data,img}) => {
  console.log('Data Receipt :: ' + JSON.stringify(data));
  console.log('Data Rt :: ' + data.amount);
  console.log('Data Rt img :: ' + img);

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
                name={'receipt'}
                size={heightPercentageToDP(4)}
                color={COLORS.black}
              />
            </LinearGradient>
          </View>
          <Text style={styles.alertText}>Transaction Receipt</Text>

          <View
            style={{
              height: heightPercentageToDP(50),
              width: widthPercentageToDP(90),
            }}>
            <Image
              source={{
                uri: `${serverName}/uploads/deposit/${data.paymentupdatereceipt}`,
              }}
              resizeMode="cover"
              style={{
                height: heightPercentageToDP(50),
                width: widthPercentageToDP(90),
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <View
              style={{
                height: heightPercentageToDP(7),
                width: '100%',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: COLORS.red,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomRightRadius: heightPercentageToDP(2),
                  borderBottomLeftRadius: heightPercentageToDP(2),
                }}
                onPress={onClose}>
                <Text
                  style={{
                    fontFamily: FONT.Montserrat_Regular,
                    fontSize: heightPercentageToDP(2),
                    color: COLORS.white_s,
                  }}>
                  Close
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
    margin: heightPercentageToDP(1),
    height: heightPercentageToDP(70),
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

export default CustomReceiptViewer;
