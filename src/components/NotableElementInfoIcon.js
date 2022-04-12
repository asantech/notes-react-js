import { useDispatch } from 'react-redux';

import { notableElementActions } from '../store/notableElement-slice';

import { InfoCircle } from 'react-bootstrap-icons';

function NotableElementInfoIcon(props) {

    const dispatch = useDispatch();

    function infoCircleOnClickHandler(){
        dispatch(notableElementActions.setNotableElementInfo(props));
        dispatch(notableElementActions.setElementNoteModalDisplay(true));
    }

    return (
        <InfoCircle
            onClick = {infoCircleOnClickHandler}
        />    
    );
}

export default NotableElementInfoIcon;