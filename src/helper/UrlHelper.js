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
  RESULT_API
};
