import React, { useState } from 'react';

function Toast(props) {

    const [destroy, setDestroy] = useState(false);
      
    const closeBtnOnClickHandler = () => {
        setDestroy(true);
    };

    return (
        <>
            {
                destroy ?
                <></>
                :
                <div className={"toast err-toast m-3 show"} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="m-auto">{props.headerTxt ? props.headerTxt : 'error'}</strong>
                        <button type="button" className="btn-close" aria-label="Close" data-dismiss="toast" onClick={closeBtnOnClickHandler}></button>
                    </div>
                    <div className="toast-body">
                        {props.errMsg}
                    </div>
                </div>
            }
        </>
    );
}

export default Toast;