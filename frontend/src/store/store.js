import {configureStore} from "@reduxjs/toolkit"
import jobReducer from "../store/slices/jobSlice"
import userReducer from "../store/slices/userSlice"
import applicationReducer from "../store/slices/applicationSlice"
import updateProfileReducer from "../store/slices/updateProfileSlice"
const store = configureStore({
    reducer:{
        jobs:jobReducer,
        user: userReducer,
        applications: applicationReducer,
        updateProfile: updateProfileReducer
    }
})

export default store;