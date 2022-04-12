import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import notableElementReducer from './notableElement-slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        notableElement: notableElementReducer,
    } 
});

export default store;