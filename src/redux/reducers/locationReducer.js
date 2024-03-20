import { createReducer } from "@reduxjs/toolkit";


export const locationReducer = createReducer({
    loading:false,
    locations: [],
    location: {}
},(builder)=>{
    
    builder.addCase("getAllLocationRequest",(state) => {
        state.loading = true;
    })
    .addCase("getLocationRequest",(state) => {
        state.loading = true;
    })
    
    builder.addCase("getAllLocationSuccess",(state,action) => {
        state.loading = false;
        state.locations = action.payload;
    })
    .addCase("getLocationSuccess",(state,action) => {
        state.loading = false;
        state.location = action.payload;
    })
    
    builder.addCase("getAllLocationFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("getLocationFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
   
    
    builder.addCase("clearError",(state) => { 
        state.error = null
    });
    builder.addCase("clearMessage",(state) => { 
        state.locations = []
    });

})