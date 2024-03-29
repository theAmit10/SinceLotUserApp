import { createReducer } from "@reduxjs/toolkit";


export const promotionReducer = createReducer({
    loadingPromotion:false,
    promotions: [],

},(builder)=>{
    
    builder.addCase("getAllPromotionRequest",(state) => {
        state.loadingPromotion = true;
    })
    builder.addCase("getAllPromotionSuccess",(state,action) => {
        state.loadingPromotion = false;
        state.promotions = action.payload;
    })
    builder.addCase("getAllPromotionFail",(state,action) => {
        state.loadingPromotion = false;
        state.error = action.payload;
    })
  
    builder.addCase("clearError",(state) => { 
        state.error = null
    });
    builder.addCase("clearMessage",(state) => { 
        state.promotions = []
    });

})