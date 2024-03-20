import axios from "axios";
import UrlHelper from "../../helper/UrlHelper";

export const getAllTime = (accesstoken) => async dispatch => {
  try {
    dispatch({
      type: 'getAllTimeRequest',
    });

    const {data} = await axios.get(UrlHelper.ALL_LOCATION_API, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });


    dispatch({
      type: 'getAllTimeSuccess',
      payload: data.lotlocations,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);

    dispatch({
      type: 'getAllTimeFail',
      payload: error.response.data.message,
    });
  }
};


// Getting Single Time
export const getTimeDetails = (accesstoken,id) => async dispatch => {
    try {
      dispatch({
        type: 'getAllTimeRequest',
      });
  
      const {data} = await axios.get(UrlHelper.ALL_LOCATION_API+`${id}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
  
      console.log('Data :: ' + data.lotlocations);
  
      dispatch({ 
        type: 'getTimeSuccess',
        payload: data.lotlocations,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getTimeFail',
        payload: error.response.data.message,
      });
    }
  };


  export const getTimeAccordingLocation = (accesstoken,id) => async dispatch => {
    try {
      dispatch({
        type: 'getTimeRequest',
      });

      const url = UrlHelper.TIME_API+"?locationid="+`${id}`;

      console.log("URL :: "+url)
  
      const {data} = await axios.get(UrlHelper.TIME_API+"?locationid="+`${id}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
  
      console.log('Data :: ' + data.lottimes);
  
      dispatch({ 
        type: 'getAllTimeSuccess',
        payload: data.lottimes,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getAllTimeFail',
        payload: error.response.data.message,
      });
    }
  };
