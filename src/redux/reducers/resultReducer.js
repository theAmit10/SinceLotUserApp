import { createReducer } from "@reduxjs/toolkit";


export const resultReducer = createReducer({
    loadingResult:false,
    results: [],
    result: {}
},(builder)=>{
    
    builder.addCase("getAllResultRequest",(state) => {
        state.loadingResult = true;
    })
    .addCase("getResultRequest",(state) => {
        state.loadingResult = true;
    })
    
    builder.addCase("getAllResultSuccess",(state,action) => {
        state.loadingResult = false;
        state.results = action.payload;
    })
    .addCase("getResultSuccess",(state,action) => {
        state.loadingResult = false;
        state.result = action.payload;
    })
    
    builder.addCase("getAllResultFail",(state,action) => {
        state.loadingResult = false;
        state.error = action.payload;
    })
    .addCase("getResultFail",(state,action) => {
        state.loadingResult = false;
        state.error = action.payload;
    })
   
    
    builder.addCase("clearError",(state) => { 
        state.error = null
    });
    builder.addCase("clearMessage",(state) => { 
        state.results = []
    });

})