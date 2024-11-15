import {configureStore} from "@reduxjs/toolkit"
import jobReducer from "../store/slices/jobSlice"
import userReducer from "../store/slices/userSlice"
import applicationReducer from "../store/slices/applicationSlice"
const store = configureStore({
    reducer:{
        jobs:jobReducer,
        user: userReducer,
        applications: applicationReducer
    }
})

export default store;