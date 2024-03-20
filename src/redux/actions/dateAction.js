import axios from "axios";
import UrlHelper from "../../helper/UrlHelper";

export const getAllDate = (accesstoken) => async dispatch => {
  try {
    dispatch({
      type: 'getAllDateRequest',
    });

    const {data} = await axios.get(UrlHelper.ALL_LOCATION_API, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });


    dispatch({
      type: 'getAllDateSuccess',
      payload: data.lotlocations,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);

    dispatch({
      type: 'getAllDateFail',
      payload: error.response.data.message,
    });
  }
};


// Gettting Single Locations
export const getDateDetails = (accesstoken,id) => async dispatch => {
    try {
      dispatch({
        type: 'getDateRequest',
      });
  
      const {data} = await axios.get(UrlHelper.ALL_LOCATION_API+`${id}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
  
      console.log('Data :: ' + data.lotlocations);
  
      dispatch({ 
        type: 'getDateSuccess',
        payload: data.lotlocations,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getDateFail',
        payload: error.response.data.message,
      });
    }
  };


  export const getDateAccordingToLocationAndTime = (accesstoken,lottimeId,lotlocationId) => async dispatch => {
    try {
      dispatch({
        type: 'getAllDateRequest',
      });

      const url = UrlHelper.DATE_API+"?lottimeId="+`${lottimeId}`+"&lotlocationId="+`${lotlocationId}`;

      console.log("URL :: "+url)
  
      const {data} = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
  
      dispatch({
        type: 'getAllDateSuccess',
        payload: data.lotdates,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getAllDateFail',
        payload: error.response.data.message,
      });
    }
  };
