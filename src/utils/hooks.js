import {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import { updateProfile } from '../redux/actions/userAction.js';

// It is neccessary to add use keyword while creating a custom hooks
export const useMessageAndErrorUser = (
  navigation,
  dispatch,
  navigateTo = 'Login',
) => {
  const {loading, message, error} = useSelector(state => state.user);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
      });

      dispatch({
        type: 'clearError',
      });
    }

    if (message) {
      //   navigation.navigate(navigateTo)

      // We are using navigation reset so that all the navigation stack will get clear
      navigation.reset({
        index: 0,
        routes: [{name: navigateTo}],
      });
      Toast.show({
        type: 'success',
        text1: message,
      });

      dispatch({
        type: 'clearMessage',
      });
    }
  }, [error, message, dispatch]);

  return loading;
};

// for User Updating Profile

export const useUserProfileUpdate = (
  name,
  navigation,
  dispatch,
  navigateTo = 'Profile',
) => {
  const {loading, message, error,accesstoken} = useSelector(state => state.user);

  useEffect(() => {

    dispatch(updateProfile(name,accesstoken));

    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
      });

      dispatch({
        type: 'clearError',
      });
    }

    if (message) {
      // navigation.navigate(navigateTo)
      // We are using navigation reset so that all the navigation stack will get clear
      navigation.navigateTo(navigateTo)
      Toast.show({
        type: 'success',
        text1: message,
      });

      dispatch({
        type: 'clearMessage',
      });
    }
  }, [error, message, dispatch]);

  return loading;
};
