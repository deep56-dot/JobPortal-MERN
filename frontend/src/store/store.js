import {configureStore} from "@reduxjs/toolkit"
import jobReducer from "../store/slices/jobSlice"
import userReducer from "../store/slices/userSlice"
const store = configureStore({
    reducer:{
        jobs:jobReducer,
        user: userReducer
        
    }
})

export default store;