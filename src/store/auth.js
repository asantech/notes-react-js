import { createSlice } from '@reduxjs/toolkit';

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

export const authActions = authSlice.actions;

export default authSlice.reducer;