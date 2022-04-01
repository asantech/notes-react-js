import React, { useState } from 'react';

import { Toast } from 'react-bootstrap';

function ToastComponent(props) {

    const [show, setShow] = useState(true);
      
    const toggleShow = () => setShow(!show);
  
    return (
        <Toast 
            bsPrefix = "toast err-toast m-3"
            show = {show} 
            onClose = {toggleShow}
        >
            <Toast.Header>
                <strong className='m-auto'>{props.headerTxt ? props.headerTxt : 'error'}</strong>
            </Toast.Header>
            <Toast.Body>{props.errMsg}</Toast.Body>
        </Toast>
    );
}

export default ToastComponent;