import React, {useState} from 'react';

const NotableElementsContext = React.createContext({
    elementNoteName: undefined,
    elementNoteLocation: undefined,
    elementNoteModalDisplay: undefined,
    setElementNoteModalDisplay: () => {},
    setNotableElementInfo: () => {},
});

export const NotableElementsContextProvider = (props) => {

    const [elementNoteLocation, setElementNoteLocation] = useState();
    const [elementNoteName, setElementNoteName] = useState();
    const [elementNoteModalDisplay, setElementNoteModalDisplay] = useState(false);

    function setNotableElementInfo(props){
        setElementNoteLocation(props.elementLocation);
        setElementNoteName(props.elementName);
        setElementNoteModalDisplay(true);
    }

    return (
        <NotableElementsContext.Provider
            value={{
                elementNoteName,
                elementNoteLocation,
                elementNoteModalDisplay,
                setElementNoteModalDisplay,
                setNotableElementInfo
            }}
        >
            {props.children}
        </NotableElementsContext.Provider>
    );
}

export default NotableElementsContext;