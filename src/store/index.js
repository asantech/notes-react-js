import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialAuthState = {
    userIsSignedIn: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        signIn(state){
            localStorage['userIsSignedIn'] = '1';
            state.userIsSignedIn = true;
        },
        signOut(state){
            localStorage.removeItem('userIsSignedIn');
            state.userIsSignedIn = false;
        },
    },
});

const initialNotableElementState = {
    elementNoteName: undefined,
    elementNoteLocation: undefined,
    elementNoteModalDisplay: false,
};

const notableElementSlice = createSlice({
    name: 'notableElement',
    initialState: initialNotableElementState,
    reducers: {
        setElementNoteModalDisplay(state){
 
        },
        setNotableElementInfo(state){
 
        },
    },
});

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        notableElement: notableElementSlice.reducer,
    } 
});

export const authActions = authSlice.actions;
export const notableElementActions = notableElementSlice.actions;

export default store;