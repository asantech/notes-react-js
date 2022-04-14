import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isSignedIn } from './store/auth-actions';

import { Routes, Route } from 'react-router-dom';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Scope from './pages/Scope';
import ScopesManagement from './pages/ScopesManagement';
import Note from './pages/Note';
import NotesManagement from './pages/NotesManagement';
import ElementNote from './pages/ElementNote';
import ElementNoteManagement from './pages/ElementNoteManagement';
import Sources from './pages/Sources';
import AppInfo from './pages/AppInfo';
import HelpCenter from './pages/HelpCenter';

import Nav from'./components/Nav';

import ElementNoteModal  from './components/ElementNoteModal';

import './App.css';

function App() {

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [selectedLang, setLang] = useState('en');

  useEffect(()=>{
      dispatch(isSignedIn());
  },[]);
  
  return (
    <div className='app-segment'>
        <ElementNoteModal/> 
        <Nav
          selectedLang = {selectedLang}
          setLang = {setLang}
        />
        <div className='pages-segment'>
          <Routes>
            <Route exact path='/' element={auth.userIsSignedIn ? <Home/> : <SignIn/>}/>
            <Route exact path='/sign-up' element={<SignUp/>}/>
            <Route exact path='/sign-in' element={<SignIn/>}/>
            <Route exact path='/home' element={<Home/>}/>
            <Route exact path='/scope' element={<Scope/>}/>
            <Route exact path='/scopes-management' element={<ScopesManagement/>}/>
            <Route exact path='/note' element={<Note/>}/>
            <Route exact path='/notes-management' element={<NotesManagement/>}/>
            <Route exact path='/add-element-note' element={<ElementNote/>}/>
            <Route exact path='/element-note-management' element={<ElementNoteManagement/>}/>
            <Route exact path='/sources' element={<Sources/>}/>
            <Route exact path='/app-info' element={<AppInfo/>}/>
            <Route exact path='/help-center' element={<HelpCenter/>}/>
          </Routes>
        </div>
    </div>
  );
}

export default App;
