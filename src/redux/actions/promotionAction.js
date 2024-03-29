import axios from "axios";
import UrlHelper from "../../helper/UrlHelper";

export const getAllPromotion = (accesstoken) => async dispatch => {
  try {
    dispatch({
      type: 'getAllPromotionRequest',
    });

    const {data} = await axios.get(UrlHelper.GET_ALL_PROMOTIONS, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    dispatch({
      type: 'getAllPromotionSuccess',
      payload: data.promotions,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);

    dispatch({
      type: 'getAllPromotionFail',
      payload: error.response.data.message,
    });
  }
};