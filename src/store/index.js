import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/auth';
import notableElementReducer from '../store/notableElement';

const store = configureStore({
    reducer: {
        auth: authReducer,
        notableElement: notableElementReducer,
    } 
});

export default store;