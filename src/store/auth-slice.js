import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
    userIsSignedIn: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        signIn(state){
            state.userIsSignedIn = true;
        },
        signOut(state){
            state.userIsSignedIn = false;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;