import { createReducer } from "@reduxjs/toolkit";


export const timeReducer = createReducer({
    loading:false,
    times: [],
    time: {}
},(builder)=>{
    
    builder.addCase("getAllTimeRequest",(state) => {
        state.loading = true;
    })
    .addCase("getTimeRequest",(state) => {
        state.loading = true;
    })
    
    builder.addCase("getAllTimeSuccess",(state,action) => {
        state.loading = false;
        state.times = action.payload;
    })
    .addCase("getTimeSuccess",(state,action) => {
        state.loading = false;
        state.time = action.payload;
    })
    
    builder.addCase("getAllTimeFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("getTimeFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
   
    
    builder.addCase("clearError",(state) => { 
        state.error = null
    });
    builder.addCase("clearMessage",(state) => { 
        state.times = []
    });

})