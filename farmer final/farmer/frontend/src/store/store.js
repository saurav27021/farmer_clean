import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import alertReducer from './alertSlice';
import reportReducer from './reportSlice';
import cropReducer from './cropSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        alerts: alertReducer,
        reports: reportReducer,
        crops: cropReducer,

    },
});
