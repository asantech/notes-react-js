import React, {useState} from 'react';

const NotableElementsContext = React.createContext({
    elementNoteName: undefined,
    setElementNoteName: () => {},
    elementNoteLocation: undefined,
    setElementNoteLocation: () => {},
    elementNoteModalDisplay: undefined,
    setElementNoteModalDisplay: () => {},
    NotableElementInfoIconOnClickHandler: () => {},
});

export const NotableElementsContextProvider = (props) => {

    const [elementNoteLocation, setElementNoteLocation] = useState();
    const [elementNoteName, setElementNoteName] = useState();
    const [elementNoteModalDisplay, setElementNoteModalDisplay] = useState(false);

    function NotableElementInfoIconOnClickHandler(props){
        setElementNoteLocation(props.elementLocation);
        setElementNoteName(props.elementName);
        setElementNoteModalDisplay(true);
    }

    return (
        <NotableElementsContext.Provider
            value={{
                elementNoteName,
                setElementNoteName,
                elementNoteLocation,
                setElementNoteLocation,
                elementNoteModalDisplay,
                setElementNoteModalDisplay,
                NotableElementInfoIconOnClickHandler
            }}
        >
            {props.children}
        </NotableElementsContext.Provider>
    );
}

export default NotableElementsContext;