import React , { Suspense, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isSignedIn } from './store/auth-actions';

import { Routes, Route } from 'react-router-dom';

import './App.css';

const SignUp = React.lazy(() => import('./pages/SignUp'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const Home = React.lazy(() => import('./pages/Home'));
const Scope = React.lazy(() => import('./pages/Scope'));
const ScopesManagement = React.lazy(() => import('./pages/ScopesManagement'));
const Note = React.lazy(() => import('./pages/Note'));
const NotesManagement = React.lazy(() => import('./pages/NotesManagement'));
const ElementNote = React.lazy(() => import('./pages/ElementNote'));
const ElementNoteManagement = React.lazy(() => import('./pages/ElementNoteManagement'));
const Sources = React.lazy(() => import('./pages/Sources'));
const AppInfo = React.lazy(() => import('./pages/AppInfo'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const PageNotFound = React.lazy(() => import('./pages/PageNotFound'));

const Nav = React.lazy(() => import('./components/Nav'));

const ElementNoteModal = React.lazy(() => import('./components/ElementNoteModal'));

function App() {

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const DownloadingAssetsMsgSpinner = (
    <div className='fixed spinner-wrapper d-flex justify-content-center align-items-center'>
      <div className="spinner-grow text-primary m-1" role="status"></div>
      <div>Necessary assets are being downloaded</div>
    </div> 
  );

  const [selectedLang, setLang] = useState('en');

  useEffect(()=>{
      dispatch(isSignedIn());
  },[]);
  
  return (
    <Suspense fallback={DownloadingAssetsMsgSpinner}>
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
              <Route path='*' element={<PageNotFound/>}/>
            </Routes>
          </div>
      </div>
    </Suspense>
  );
}

export default App;
