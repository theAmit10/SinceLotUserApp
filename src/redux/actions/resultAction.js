import axios from "axios";
import UrlHelper from "../../helper/UrlHelper";

export const getAllResult = (accesstoken) => async dispatch => {
  try {
    dispatch({
      type: 'getAllResultRequest',
    });

    const {data} = await axios.get(UrlHelper.ALL_RESULT_API, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    // console.log("ACTION result :: "+data.results)

    dispatch({
      type: 'getAllResultSuccess',
      payload: data.results,
    });

  } catch (error) {
    // console.log(error);
    // console.log(error.response.data.message);

    dispatch({
      type: 'getAllResultFail',
      payload: error.response.data.message,
    });
  } 
};


// Gettting Single Result
export const getResultDetails = (accesstoken,id) => async dispatch => {
    try {
      dispatch({
        type: 'getResultRequest',
      });
  
      const {data} = await axios.get(UrlHelper.ALL_LOCATION_API+`${id}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
  
      console.log('Data :: ' + data.lotlocations);
  
      dispatch({ 
        type: 'getResultSuccess',
        payload: data.lotlocations,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getResultFail',
        payload: error.response.data.message,
      });
    }
  };


  export const getResultAccordingToLocationTimeDate = (accesstoken,lotdateId,lottimeId,lotlocationId) => async dispatch => {
    try {
      dispatch({
        type: 'getAllResultRequest',
      });

      const url = UrlHelper.RESULT_API+"?lotdateId="+`${lotdateId}`+"&lottimeId="+`${lottimeId}`+"&lotlocationId="+`${lotlocationId}`;
  
      console.log("URL :: "+url)

      const {data} = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });

      console.log("ACTION result :: "+data.results)

      dispatch({
        type: 'getAllResultSuccess',
        payload: data.results,
      });

    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getAllResultFail',
        payload: error.response.data.message,
      });
    }
  };


  export const getAllResultAccordingToLocation = (accesstoken,locationid) => async dispatch => {
    try {
      dispatch({
        type: 'getAllResultAccordingLocationRequest',
      });
  
      const {data} = await axios.get(UrlHelper.RESULT_ACCORDING_TO_LOCATION_API+"?locationid="+`${locationid}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
  
      // console.log("ACTION result accoding to location :: "+data.results)
  
      dispatch({
        type: 'getAllResultAccordingLocationSuccess',
        payload: data.results,
      });
  
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getAllResultAccordingLocationFail',
        payload: error.response.data.message,
      });
    } 
  };


  export const getNextResult = (accesstoken,locationid) => async dispatch => {
    try {

      console.log("Starting Getting Next Result")
      console.log("Starting  Next Result :: "+locationid)
      console.log("Starting  Next Result url :: "+UrlHelper.NEXT_RESULT_API+"?locationid="+`${locationid}`)
      dispatch({
        type: 'getNextResultRequest',
      });
  
      const {data} = await axios.get(UrlHelper.NEXT_RESULT_API+"?locationid="+`${locationid}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });

      // console.log("Starting Next Result API :: "+data.results.length)
  
      dispatch({
        type: 'getNextResultSuccess',
        payload: data.results,
      });
  
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getNextResultFail',
        payload: error.response.data.message,
      });
    } 
  };
  
