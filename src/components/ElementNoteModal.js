import React, { useState, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { notableElementActions } from '../store/notableElement-slice';

import { Button, Modal } from 'react-bootstrap';

import { useHttpClient } from '../shared/hooks/http-hook';

import './ElementNoteModal.css';
 
function ElementNoteModal() {
    
    const notableElementLocation = useSelector(state => state.notableElement.location);
    const notableElementName = useSelector(state => state.notableElement.name);
    const notableElementModalDisplay = useSelector(state => state.notableElement.modalDisplay);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(notableElementActions.setElementNoteModalDisplay(false));
    };
    const [elementNote, setElementNote] = useState();

    const {isLoading, sendReq} = useHttpClient();

    const fetchElementDataHandler = useCallback(async () => {
 
        try{
            const resData = await sendReq(
                'http://localhost:5000/api/elements-notes/',
                'POST',
                undefined,
                JSON.stringify({
                    elementNoteLocation: notableElementLocation,
                    elementNoteName: notableElementName,
                }),
            );

            setElementNote(resData.note);
        }catch(err){
 
        }
    },[sendReq,notableElementLocation,notableElementName]); 

    function onEnterHandler(){
        fetchElementDataHandler();
    }

    function onExitedHandler(){
        setElementNote('');
        dispatch(notableElementActions.reset());
    }

    return (
        <Modal 
          bsPrefix="element-note-modal modal"
          show={notableElementModalDisplay} 
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