import {server} from '../redux/store';

const LOGIN_API = server + 'user/login';
const USER_PROFILE_API = server + 'user/profile';
const LOGOUT_API = server + 'user/logout';
const REGISTER_API = server + 'user/register';
const ALL_LOCATION_API = server + 'result/alllotlocation';
const ALL_TIME_API = server + 'result/alllottime';
const TIME_API = server + 'result/searchtime';
const ALL_DATE_API = server + 'result/alllotdate';
const DATE_API = server + 'result/searchdate';
const ALL_RESULT_API = server + 'result/allresult';
const RESULT_API = server + 'result/searchresult';
const RESULT_ACCORDING_TO_LOCATION_API = server + 'result/allresultlocation';
const NEXT_RESULT_API = server + 'result/nextresult';
const GET_ALL_PROMOTIONS = server + 'user/getallpromotion';



// For Updating User Profile
const UPDATE_USER_PROFILE_API = server + 'user/updateprofile';
const USER_PROFILE_PIC_API = server + 'user/updateprofilepic';

const CHANGE_PASSWORD_API = server + 'user/changepassword';

// For All Promtion 
const ALL_PROMOTIONS_API = server + 'user/getallpromotion';
const ALL_ABOUT_API = server + 'user/getallabout';

// For Reset and Forgot password
const FORGOT_PASSWORD_API = server + 'user/forgetpassword';
const NOTIFICATION_API = server + 'user/';
const NOTIFICATION_SEEN_API = server + 'user/';

// Payment Deposit
const ALL_UPI_API = server + 'result/allupipaymets';
const ALL_BANK_API = server + 'result/allbankpaymets';
const ALL_SKRILL_API = server + 'result/allskrillpaymets';
const ALL_PAYPAL_API = server + 'result/allpaypalpaymets';
const ALL_CRYPTO_API = server + 'result/allcryptopaymets';

// Depoit Payment
const DEPOSIT_API = server + 'user/createdeposit';
const DEPOSIT_UPI_API = server + 'result/addupipayment';
const DEPOSIT_BANK_API = server + 'result/addbankpayment';
const DEPOSIT_PAYPAL_API = server + 'result/addpaypalpayment';
const DEPOSIT_SKRILL_API = server + 'result/addskrillpayment';
const DEPOSIT_CRYPTO_API = server + 'result/addcryptopayment';

// FOR WITHDRAW
const WITHDRAW_PAYMENT_API = server + 'user/createwithdraw';

//   FOR PLAY REQUEST
const CREATE_PLAY_API = server + 'result/playbet/addplybet';

const BALANCE_TRANSFER_TO_WALLET_TWO_API = server + 'user/balancetransfer';




export default {
  LOGIN_API,
  USER_PROFILE_API,
  LOGOUT_API,
  REGISTER_API,
  ALL_LOCATION_API,
  ALL_TIME_API,
  ALL_DATE_API,
  ALL_RESULT_API,
  TIME_API,
  DATE_API,
  RESULT_API,
  UPDATE_USER_PROFILE_API,
  RESULT_ACCORDING_TO_LOCATION_API,
  GET_ALL_PROMOTIONS,
  NEXT_RESULT_API,
  ALL_PROMOTIONS_API,
  USER_PROFILE_PIC_API,
  CHANGE_PASSWORD_API,
  ALL_ABOUT_API,
  FORGOT_PASSWORD_API,
  NOTIFICATION_API,
  ALL_UPI_API,
  ALL_BANK_API,
  ALL_PAYPAL_API,
  ALL_SKRILL_API,
  ALL_CRYPTO_API,
  DEPOSIT_BANK_API,
  DEPOSIT_UPI_API,
  DEPOSIT_PAYPAL_API,
  DEPOSIT_SKRILL_API,
  DEPOSIT_CRYPTO_API,
  DEPOSIT_API,
  WITHDRAW_PAYMENT_API,
  CREATE_PLAY_API,
  BALANCE_TRANSFER_TO_WALLET_TWO_API,
  NOTIFICATION_SEEN_API
};
