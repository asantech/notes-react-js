import { createSlice } from '@reduxjs/toolkit';

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

export const notableElementActions = notableElementSlice.actions;

export default notableElementSlice.reducer;