import React, { useContext, useState, useRef, useCallback, useEffect } from 'react';

import { Button, Modal } from 'react-bootstrap';

import NotableElementsContext from '../contexts/notable-elements-context';
 
function ElementNoteModal() {

    const notableElementsContext = useContext(NotableElementsContext);

    const handleClose = () => notableElementsContext.setElementNoteModalDisplay(false);
    const [elementNote, setElementNote] = useState();
    const [spinnerIsShown, setSpinnerIsShown] = useState(false);

    const activeHttpReqs = useRef([]);

    const fetchElementDataHandler  = useCallback(async ()=>{

        setSpinnerIsShown(true);
        try{
            const httpAbortCtrl = new AbortController;
            activeHttpReqs.current.push(httpAbortCtrl);
            const res = await fetch('http://localhost:5000/api/elements-notes/',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    elementNoteLocation: notableElementsContext.elementNoteLocation,
                    elementNoteName: notableElementsContext.elementNoteName,
                }),
                signal: activeHttpReqs.signal,
            });

            const data = await res.json();
            if(!res.ok)
                throw new Error(data.message);


            setElementNote(data.note);
            setSpinnerIsShown(false);
        }catch(err){
            console.log(err);
            setSpinnerIsShown(false);
            // ReactDOM.createPortal(
            //     <CreateToast/>,
            //     document.getElementById('toasts-container-root')
            // );
        }
    },[notableElementsContext]); 

    function onEnterHandler(){
        fetchElementDataHandler();
    }

    function onExitedHandler(){
        setElementNote('');
    }

    useEffect(()=>{
        return ()=>{
            activeHttpReqs.current.forEach(abortCtrl => abortCtrl.abort());
        }
    },[]);

    return (
        <Modal 
          show={notableElementsContext.elementNoteModalDisplay} 
          onHide={handleClose}
          onEnter={onEnterHandler}
          onExited={onExitedHandler}
          size="lg"
        >
          <div className={'modal-spinner-wrapper d-flex justify-content-center align-items-center' +(spinnerIsShown ? '' : ' visually-hidden')}>
              <div className="spinner-border text-info" role="status"></div>
              <span>Loading...</span>
          </div>
          <Modal.Header closeButton>
              <Modal.Title>Element Description Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div dangerouslySetInnerHTML={{__html: elementNote}} />
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                  Close
              </Button>
          </Modal.Footer>
        </Modal>
    );
}

export default ElementNoteModal;