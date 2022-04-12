import { createSlice } from '@reduxjs/toolkit';

const initialNotableElementState = {
    name: null,
    location: null,
    modalDisplay: false,
};

const notableElementSlice = createSlice({
    name: 'notableElement',
    initialState: initialNotableElementState,
    reducers: {
        setElementNoteModalDisplay(state,action){
            state.modalDisplay = action.payload;
        },
        setNotableElementInfo(state,action){
            state.name = action.payload.notableElementName;
            state.location = action.payload.notableElementLocation;
        },
        reset(state){
            state.name = null;
            state.location = null;
        },
    },
});

export const notableElementActions = notableElementSlice.actions;

export default notableElementSlice.reducer;