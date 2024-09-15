import { combineReducers } from '@reduxjs/toolkit'

import roomReducer from "./roomSlice"
import authReducer from "./authSlice";

const rootReducer = combineReducers({
    rooms:  roomReducer,
    auth: authReducer
})

export default rootReducer