import axios from "axios";
import UrlHelper from "../../helper/UrlHelper";


// Gettting All Locations
export const getAllLocations = (accesstoken) => async dispatch => {
  try {
    dispatch({
      type: 'getAllLocationRequest',
    });

    const {data} = await axios.get(UrlHelper.ALL_LOCATION_API, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });




    // console.log('Data :: ' + data.lotlocations[0].lotlocation);
    

    dispatch({
      type: 'getAllLocationSuccess',
      payload: data.lotlocations,
    });


    console.log("Location data :: "+data.lotlocations )
    console.log("Location data length :: "+data.lotlocations.length )


  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);

    dispatch({
      type: 'getAllLocationFail',
      payload: error.response.data.message,
    });
  }
};


// Gettting Single Locations
export const getLocationDetails = (accesstoken,id) => async dispatch => {
    try {
      dispatch({
        type: 'getLocationRequest',
      });
  
      const {data} = await axios.get(URLHelper.ALL_LOCATION_API+`${id}`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
  
      console.log('Data :: ' + data.lotlocations);
  
      dispatch({ 
        type: 'getLocationSuccess',
        payload: data.lotlocations,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
  
      dispatch({
        type: 'getLocationFail',
        payload: error.response.data.message,
      });
    }
  };
