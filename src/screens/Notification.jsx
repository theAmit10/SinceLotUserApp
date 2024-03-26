import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

const Notification = () => {
 // Calculate the time difference between current time and 3:00 PM
 const currentTime = moment();

 console.log("Current Time :: "+currentTime)

 const targetTime = moment().set({ hour: 15, minute: 0, second: 0, millisecond: 0 });
 const duration = moment.duration(targetTime.diff(currentTime));
 const timeLeft = Math.max(0, duration.asSeconds());


  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>
        Time Left Until 3:00 PM
      </Text>
      <CountDown
        until={20}
        size={30}
        onFinish={() => alert('Countdown finished')}
        digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625' }}
        digitTxtStyle={{ color: '#1CC625' }}
        timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
        separatorStyle={{ color: '#1CC625' }}
        timeToShow={['H', 'M', 'S']}
        timeLabels={{ h: 'Hours', m: 'Minutes', s: 'Seconds' }}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({});
