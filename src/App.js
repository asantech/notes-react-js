import React, {useState,useEffect,useCallback} from 'react';

import {Routes, Route} from 'react-router-dom';

import { Button, Modal } from 'react-bootstrap';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import AddScope from './pages/AddScope';
import ScopesManagement from './pages/ScopesManagement';
import AddNote from './pages/AddNote';
import NotesManagement from './pages/NotesManagement';
import AddElementNote from './pages/AddElementNote';
import ElementNoteManagement from './pages/ElementNoteManagement';
import Sources from './pages/Sources';
import AppInfo from './pages/AppInfo';

import Nav from'./components/Nav';

import './App.css';

function App() {

  const [selectedLang, setLang] = useState('en');
  const [userIsSignedIn, setUserIsSignedIn] = useState(false);
  const [elementNoteName, setElementNoteName] = useState();
  const [elementNoteLocation, setElementNoteLocation] = useState();
  const [elementNoteModalDisplay, setElementNoteModalDisplay] = useState(false);

  function ElementNoteModal() {

    const handleClose = () => setElementNoteModalDisplay(false);
    const [elementNote, setElementNote] = useState();
    const [spinnerIsShown, setSpinnerIsShown] = useState(false);

    const fetchElementDataHandler = useCallback(async () => {

        setSpinnerIsShown(true);
        try{
            const response = await fetch('http://localhost:5000/api/elements-notes/',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
				        body: JSON.stringify({
                    elementNoteLocation: elementNoteLocation,
                    elementNoteName: elementNoteName,
                }),
            });

            const data = await response.json();
            if(!response.ok)
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
    },[]);

    function onEnterHandler(){
        fetchElementDataHandler();
    }

    function onExitedHandler(){
      console.log('onExitedHandler');
    }

    return (
        <Modal 
          show={elementNoteModalDisplay} 
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

  function ElementDescInfoIconOnClickHandler(e){
    setElementNoteLocation(e.target.getAttribute('data-element-location'));
    setElementNoteName(e.target.getAttribute('data-element-name'));
    setElementNoteModalDisplay(true);
  }

  useEffect(()=>{
    if(localStorage.getItem('userIsSignedIn') === '1')
      setUserIsSignedIn(true);
  },[]);
  
  return (
    <div className='app-segment'>
      <ElementNoteModal/> 
      <Nav
        selectedLang = {selectedLang}
        setLang = {setLang}
        userIsSignedIn = {userIsSignedIn}
        setUserIsSignedIn={setUserIsSignedIn}
      />
      <div className='pages-segment'>
          <Routes>
            <Route path='/' element={
              userIsSignedIn ? 
              <Home/> 
              : 
              <SignUp
                ElementDescInfoIconOnClickHandler = {ElementDescInfoIconOnClickHandler}
              />
			      }/>
            <Route path='/sign-up' element={
              <SignUp
                ElementDescInfoIconOnClickHandler = {ElementDescInfoIconOnClickHandler}
              />
            }/>
            <Route exact path='/sign-in' element={
              <SignIn 
                setUserIsSignedIn={setUserIsSignedIn}
                ElementDescInfoIconOnClickHandler = {ElementDescInfoIconOnClickHandler}
              />
            }/>
            <Route exact path='/home' element={<Home/>}/>
            <Route exact path='/add-scope' element={<AddScope/>}/>
            <Route exact path='/scopes-management' element={<ScopesManagement/>}/>
            <Route exact path='/add-note' element={<AddNote/>}/>
            <Route exact path='/notes-management' element={<NotesManagement/>}/>
            <Route exact path='/add-element-note' element={
              <AddElementNote
                ElementDescInfoIconOnClickHandler = {ElementDescInfoIconOnClickHandler}
              />
            }/>
            <Route exact path='/element-note-management' element={
              <ElementNoteManagement
                ElementDescInfoIconOnClickHandler = {ElementDescInfoIconOnClickHandler}
              />
            }/>
            <Route exact path='/sources' element={<Sources/>}/>
            <Route exact path='/app-info' element={<AppInfo/>}/>
          </Routes>
      </div>
    </div>
  );
}

export default App;
