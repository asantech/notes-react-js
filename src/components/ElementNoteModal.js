import React, { useContext, useState, useCallback } from 'react';

import { Button, Modal } from 'react-bootstrap';

import NotableElementsContext from '../contexts/notable-elements-context';

import { useHttpClient } from '../shared/hooks/http-hook';

import './ElementNoteModal.css';
 
function ElementNoteModal() {

    const notableElementsContext = useContext(NotableElementsContext);

    const handleClose = () => notableElementsContext.setElementNoteModalDisplay(false);
    const [elementNote, setElementNote] = useState();

    const {isLoading, sendRequest} = useHttpClient();

    const fetchElementDataHandler = useCallback(async () => {

        try{
            const resData = await sendRequest(
                'http://localhost:5000/api/elements-notes/',
                'POST',
                undefined,
                JSON.stringify({
                    elementNoteLocation: notableElementsContext.elementNoteLocation,
                    elementNoteName: notableElementsContext.elementNoteName,
                }),
            );

            setElementNote(resData.note);
        }catch(err){
 
        }
    },[sendRequest,notableElementsContext]); 

    function onEnterHandler(){
        fetchElementDataHandler();
    }

    function onExitedHandler(){
        setElementNote('');
    }

    return (
        <Modal 
          bsPrefix="element-note-modal modal"
          show={notableElementsContext.elementNoteModalDisplay} 
          onHide={handleClose}
          onEnter={onEnterHandler}
          onExited={onExitedHandler}
          size="lg"
        >
          <div className={'spinner-wrapper d-flex justify-content-center align-items-center' +(isLoading ? '' : ' visually-hidden')}>
              <div className="spinner-border text-info" role="status"></div>
              <span>Loading...</span>
          </div>
          <Modal.Header closeButton>
              <Modal.Title>Element Description Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='content-container' dangerouslySetInnerHTML={{__html: elementNote}} />
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