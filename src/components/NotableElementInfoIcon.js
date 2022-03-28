import React, {useContext} from 'react';

import { InfoCircle } from 'react-bootstrap-icons';

import NotableElementsContext from '../contexts/notable-elements-context';
 
function NotableElementInfoIcon(props) {

    const notableElementsContext = useContext(NotableElementsContext);

    function infoCircleOnClickHandler(){
        notableElementsContext.NotableElementInfoIconOnClickHandler(props);
    }

    return (
        <InfoCircle
            onClick = {infoCircleOnClickHandler}
        />    
    );
}

export default NotableElementInfoIcon;