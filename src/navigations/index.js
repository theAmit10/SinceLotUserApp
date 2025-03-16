import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Toast from 'react-native-toast-message';
import OtpVerification from '../screens/OtpVerification';
import Search from '../screens/Search';
import Setting from '../screens/Setting';
import SearchTime from '../screens/SearchTime';
import SearchDate from '../screens/SearchDate';
import Result from '../screens/Result';
import ProfileBackground from '../components/background/ProfileBackground';
import Profile from '../screens/Profile';
import SplashScreen from '../screens/SplashScreen';
import UpdateProfile from '../screens/UpdateProfile';
import HomeLoading from '../components/background/HomeLoading';
import AllResult from '../screens/AllResult';
import ResultDetails from '../screens/ResultDetails';
import WalletBalance from '../screens/WalletBalance';
import Notification from '../screens/Notification';
import Test from '../screens/Test';
import ChangePassword from '../screens/ChangePassword';
import AboutUs from '../screens/AboutUs';
import GameDescription from '../screens/GameDescription';
import GameDescritptionDetails from '../screens/GameDescritptionDetails';
import UploadProfilePicture from '../screens/UploadProfilePicture';
import ForgotPassword from '../screens/ForgotPassword';
import ChangeEmail from '../screens/ChangeEmail';
import SignUp from '../screens/SignUp';
import ResetPassword from '../screens/ResetPassword';
import GoogleAuthPassword from '../screens/GoogleAuthPassword';
import AddContact from '../screens/AddContact';
import AboutUsCopying from '../screens/AboutUsCopying';
import PlayArena from '../screens/PlayArena';
import PlayArenaLocation from '../screens/PlayArenaLocation';
import Payment from '../screens/payment/Payment';
import UpiDeposit from '../screens/payment/UpiDeposit';
import BankDeposit from '../screens/payment/BankDeposit';
import PaypalDeposit from '../screens/payment/PaypalDeposit';
import Skrill from '../screens/payment/Skrill';
import CryptoDeposit from '../screens/payment/CryptoDeposit';
import Withdraw from '../screens/payment/Withdraw';
import History from '../screens/payment/History';
import PlayHistory from '../screens/payment/PlayHistory';
import Withdrawupi from '../screens/payment/Withdrawupi';
import Withdrawbank from '../screens/payment/Withdrawbank';
import Withdrawpaypal from '../screens/payment/Withdrawpaypal';
import Withdrawskrill from '../screens/payment/Withdrawskrill';
import Withdrawcrypto from '../screens/payment/Withdrawcrypto';
import SelectCountry from '../components/helpercComponent/SelectCountry';
import BalanceTransfer from '../screens/payment/BalanceTransfer';
import UserProfile from '../screens/UserProfile';
import ChangeName from '../screens/ChangeName';
import TimerTest from '../screens/TimerTest';
import PartnerDashboard from '../screens/partner/PartnerDashboard';
import AllPartner from '../screens/partner/AllPartner';
import AllPartnerUsers from '../screens/partner/AllPartnerUsers';
import AllProfitDecrease from '../screens/partner/AllProfitDecrease';
import AllRecharge from '../screens/partner/AllRecharge';
import ProfitDetails from '../screens/partner/ProfitDetails';
import RechargeMethod from '../screens/partner/RechargeMethod';
import PartnerDetails from '../screens/partner/PartnerDetails';
import LiveResult from '../screens/LiveResult';
import PowerballTimes from '../screens/powerball/PowerballTimes';
import PowerballGame from '../screens/powerball/PowerballGame';
import PowerballDashboard from '../screens/powerball/PowerballDashboard';
import ResultDashboard from '../screens/powerball/ResultDashboard';
import ResultPowerball from '../screens/powerball/ResultPowerball';
import CreateNotification from '../screens/partner/CreateNotification';
import UserPlayHistory from '../screens/partner/userdetails/UserPlayHistory';
import UserTransactionHistory from '../screens/partner/userdetails/UserTransactionHistory';
import UpdatePercentage from '../screens/partner/UpdatePercentage';
import DecresePercentage from '../screens/partner/DecresePercentage';
import AllUpiDepositPayment from '../screens/partner/recharge/AllUpiDepositPayment';
import CreateUpi from '../screens/partner/recharge/CreateUpi';
import CreateBank from '../screens/partner/recharge/CreateBank';
import CreatePaypal from '../screens/partner/recharge/CreatePaypal';
import CreateSkrill from '../screens/partner/recharge/CreateSkrill';
import CreateCrypto from '../screens/partner/recharge/CreateCrypto';
import AllBankDepositPayment from '../screens/partner/recharge/AllBankDepositPayment';
import AllPaypalDepositPayment from '../screens/partner/recharge/AllPaypalDepositPayment';
import AllSkrillPaymentPayment from '../screens/partner/recharge/AllSkrillPaymentPayment';
import AllCryptoDepositPayment from '../screens/partner/recharge/AllCryptoDepositPayment';
import Play from '../screens/Play';
import PartnerUserProfile from '../screens/partner/userdetails/PartnerUserProfile';
import TempScreen from '../screens/TempScreen';
import OtherDeposit from '../screens/payment/OtherDeposit';

const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="SplashScreen">
        <Stack.Group>
          <Stack.Screen
            name="UploadProfilePicture"
            component={UploadProfilePicture}
          />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="TempScreen" component={TempScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="SearchTime" component={SearchTime} />
          <Stack.Screen name="SearchDate" component={SearchDate} />
          <Stack.Screen name="Result" component={Result} />
          <Stack.Screen
            name="ProfileBackground"
            component={ProfileBackground}
          />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} />

          <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
          <Stack.Screen name="AllResult" component={AllResult} />
          <Stack.Screen name="ResultDetails" component={ResultDetails} />
          <Stack.Screen name="WalletBalance" component={WalletBalance} />
          <Stack.Screen name="HomeLoading" component={HomeLoading} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="GameDescription" component={GameDescription} />
          <Stack.Screen
            name="GameDescritptionDetails"
            component={GameDescritptionDetails}
          />
          <Stack.Screen name="Test" component={Test} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen
            name="GoogleAuthPassword"
            component={GoogleAuthPassword}
          />
          <Stack.Screen name="AddContact" component={AddContact} />
          <Stack.Screen name="AboutUsCopying" component={AboutUsCopying} />
          <Stack.Screen name="PlayArena" component={PlayArena} />
          <Stack.Screen
            name="PlayArenaLocation"
            component={PlayArenaLocation}
          />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="UpiDeposit" component={UpiDeposit} />
          <Stack.Screen name="BankDeposit" component={BankDeposit} />
          <Stack.Screen name="PaypalDeposit" component={PaypalDeposit} />
          <Stack.Screen name="Skrill" component={Skrill} />
          <Stack.Screen name="CryptoDeposit" component={CryptoDeposit} />
          <Stack.Screen name="Withdraw" component={Withdraw} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="PlayHistory" component={PlayHistory} />

          {/** FOR WITHDRAW */}
          <Stack.Screen name="Withdrawupi" component={Withdrawupi} />
          <Stack.Screen name="Withdrawbank" component={Withdrawbank} />
          <Stack.Screen name="Withdrawpaypal" component={Withdrawpaypal} />
          <Stack.Screen name="Withdrawskrill" component={Withdrawskrill} />
          <Stack.Screen name="Withdrawcrypto" component={Withdrawcrypto} />

          <Stack.Screen name="SelectCountry" component={SelectCountry} />
          <Stack.Screen name="BalanceTransfer" component={BalanceTransfer} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="ChangeName" component={ChangeName} />
          <Stack.Screen name="TimerTest" component={TimerTest} />

          {/** FOR PARTNER */}
          <Stack.Screen name="PartnerDashboard" component={PartnerDashboard} />
          <Stack.Screen name="AllPartner" component={AllPartner} />
          <Stack.Screen name="AllPartnerUsers" component={AllPartnerUsers} />
          <Stack.Screen
            name="AllProfitDecrease"
            component={AllProfitDecrease}
          />
          <Stack.Screen name="AllRecharge" component={AllRecharge} />
          <Stack.Screen name="ProfitDetails" component={ProfitDetails} />
          <Stack.Screen name="RechargeMethod" component={RechargeMethod} />
          <Stack.Screen name="PartnerDetails" component={PartnerDetails} />
          <Stack.Screen name="UpdatePercentage" component={UpdatePercentage} />
          <Stack.Screen
            name="DecresePercentage"
            component={DecresePercentage}
          />

          {/** LIVE RESULT */}
          <Stack.Screen name="LiveResult" component={LiveResult} />

          {/* PowerBall */}
          <Stack.Screen name="PowerballTimes" component={PowerballTimes} />
          <Stack.Screen name="PowerballGame" component={PowerballGame} />
          <Stack.Screen
            name="PowerballDashboard"
            component={PowerballDashboard}
          />
          <Stack.Screen name="ResultDashboard" component={ResultDashboard} />
          <Stack.Screen name="ResultPowerball" component={ResultPowerball} />

          {/** USER DETAILS */}
          <Stack.Screen
            name="CreateNotification"
            component={CreateNotification}
          />
          <Stack.Screen name="UserPlayHistory" component={UserPlayHistory} />
          <Stack.Screen
            name="UserTransactionHistory"
            component={UserTransactionHistory}
          />

          {/** RECHARGE MODULE */}
          <Stack.Screen
            name="AllUpiDepositPayment"
            component={AllUpiDepositPayment}
          />
          <Stack.Screen
            name="AllBankDepositPayment"
            component={AllBankDepositPayment}
          />
          <Stack.Screen
            name="AllPaypalDepositPayment"
            component={AllPaypalDepositPayment}
          />
          <Stack.Screen
            name="AllSkrillPaymentPayment"
            component={AllSkrillPaymentPayment}
          />
          <Stack.Screen
            name="AllCryptoDepositPayment"
            component={AllCryptoDepositPayment}
          />
          <Stack.Screen name="CreateUpi" component={CreateUpi} />
          <Stack.Screen name="CreateBank" component={CreateBank} />
          <Stack.Screen name="CreatePaypal" component={CreatePaypal} />
          <Stack.Screen name="CreateSkrill" component={CreateSkrill} />
          <Stack.Screen name="CreateCrypto" component={CreateCrypto} />
          <Stack.Screen name="OtherDeposit" component={OtherDeposit} />
          <Stack.Screen name="Play" component={Play} />
          <Stack.Screen
            name="PartnerUserProfile"
            component={PartnerUserProfile}
          />
        </Stack.Group>
      </Stack.Navigator>

      <Toast
        position="top"
        autoHide={true}
        visibilityTime={2000}
        onPress={() => Toast.hide()}
      />
    </NavigationContainer>
  );
};

export default Main;

const styles = StyleSheet.create({});
