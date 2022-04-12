import React, { Fragment, useState, useCallback } from 'react';

import ReactDOM from 'react-dom';

import { useSelector, useDispatch } from 'react-redux';

import { signOut } from '../store/auth-actions';

import { Link } from 'react-router-dom';

import { useHttpClient } from '../shared/hooks/http-hook';
 
import ReactTooltip from 'react-tooltip';

import { Button, Modal } from 'react-bootstrap';

import { HouseDoorFill, Plus, CardText, BoxArrowInRight, Gear ,InfoCircle ,JournalText, FolderPlus, Folder, Diagram3, PersonPlusFill, PersonCircle, QuestionCircle} from 'react-bootstrap-icons';

import './Nav.css';
 
function Nav(props){

    let
        selectedLang = props.selectedLang,
        setLang = props.setLang
    ;

    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [showSettingsModal, setSettingsModalDisplay] = useState(false);

    function changeLangHandler(){
        if(selectedLang === 'en')
            setLang('fa');
        else if(selectedLang === 'fa')
            setLang('en');
    }

    function SettingsModal() {

        const {isLoading, sendRequest} = useHttpClient();

        const handleClose = () => setSettingsModalDisplay(false);
        const [serverCodeStructure, setServerCodeStructure] = useState();

        const fetchSettingsDataHandler = useCallback(async () => {

            try{
                const resData = await sendRequest('http://localhost:5000/api/server-code-structure'); // بعدا نامگذاری اصلاح شود
    
                setServerCodeStructure(resData[0].structure);
 
            }catch(err){
 
            }
        },[]);

        function onEnterHandler(){
            fetchSettingsDataHandler();
        }

        function serverCodeTypeRadioBtnOnClickHandler(e){
            setServerCodeStructure(e.target.getAttribute('data-val'));
        }

        async function saveSettingsHandler(){ // آیا از callback استفاده شود؟
     
            try{
                await sendRequest(
                    'http://localhost:5000/api/server-code-structure',
                    'POST',
                    undefined,
                    JSON.stringify({
                        structure: serverCodeStructure,
                    }),
                );
            }catch(err){

            }
            handleClose();
        }

        function saveBtnOnClickHandler(){
            saveSettingsHandler();
        }

        function themeOnChangeHandler(){

        }

        function languageOnChangeHandler(){

        }
 
        return (
            <Modal 
                show={showSettingsModal} 
                onHide={handleClose}
                onEntered={onEnterHandler}
            >
                <div className={'spinner-wrapper d-flex justify-content-center align-items-center' + ( isLoading ? '' : ' visually-hidden' )}>
                    <div className="spinner-border text-info" role="status"></div>
                    <span>Loading...</span>
                </div>
                <Modal.Header closeButton>
                    <Modal.Title>Settings Modal</Modal.Title>
                    <InfoCircle/>
                </Modal.Header>
                <Modal.Body>
                    <h5>Server Code Type</h5>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" data-val="mongo" name="server-code-type" id="server-code-type-mongo" checked={serverCodeStructure === 'mongo' ? 'checked' : ''} onChange={serverCodeTypeRadioBtnOnClickHandler}/>
                        <label className="form-check-label" htmlFor="server-code-type-mongo">
                            Mongo
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" data-val="mongoose" name="server-code-type" id="server-code-type-mongoose" checked={serverCodeStructure === 'mongoose' ? 'checked' : ''} onChange={serverCodeTypeRadioBtnOnClickHandler}/>
                        <label className="form-check-label" htmlFor="server-code-type-mongoose">
                            Mongoose
                        </label>
                    </div>
                    <hr></hr>
                    <h5>Themes</h5>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" data-val="light" name="theme" id="theme-light" defaultChecked onChange={themeOnChangeHandler}/>
                        <label className="form-check-label" htmlFor="theme-light">
                            Light
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" data-val="dark" name="theme" id="theme-dark" onChange={themeOnChangeHandler}/>
                        <label className="form-check-label" htmlFor="theme-dark">
                            Dark
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" data-val="aqua" name="theme" id="theme-aqua" onChange={themeOnChangeHandler}/>
                        <label className="form-check-label" htmlFor="theme-aqua">
                            Aqua
                        </label>
                    </div>
                    <hr></hr>
                    <h5>Language</h5>
                    <div className="form-check form-check-inline">
                        <input id="language-english" className="form-check-input" type="radio" data-val="en" name="language" defaultChecked onChange={languageOnChangeHandler}/>
                        <label className="form-check-label" htmlFor="language-english">
                            English
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input id="language-farsi" className="form-check-input" type="radio" data-val="fa" name="language" onChange={languageOnChangeHandler}/>
                        <label className="form-check-label" htmlFor="language-farsi">
                            Farsi
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveBtnOnClickHandler}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function settingsBtnOnClickHandler(){
        setSettingsModalDisplay(true);
    }

    function signOutBtnOnClickHandler(){
        dispatch(signOut());
    }
 
    return (
        <Fragment>
            <nav>
                {
                    !auth.userIsSignedIn && 
                    <>
                        <span className="log-in-page-welcome-msg">
                            You will get the best user experience by using Notes app :-)
                        </span>
                        <ul className='logged-out-nav-links-list nav-links-list'>
                            <li>
                                <Link to="/sign-in" className="tooltip-box" exact="true" data-tip data-for="sign-in-tip">
                                    <PersonCircle/>
                                    <ReactTooltip id="sign-in-tip" place="bottom" effect="solid">
                                        Sign In
                                    </ReactTooltip>
                                </Link>
                            </li>
                            <li>
                                <Link to="/sign-up" className="tooltip-box" exact="true" data-tip data-for="sign-up-tip">
                                    <PersonPlusFill/>
                                    <ReactTooltip id="sign-up-tip" place="bottom" effect="solid">
                                        Sign Up
                                    </ReactTooltip>
                                </Link>
                            </li>
                        </ul>
                    </>
                }
                {
                    auth.userIsSignedIn &&
                    <ul className='logged-in-nav-links-list nav-links-list'>
                        <li>
                            <Link to="/home" className="tooltip-box" exact="true" data-tip data-for="home-tip">
                                <HouseDoorFill/>
                                <ReactTooltip id="home-tip" place="bottom" effect="solid" arrow>
                                    Home
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li>
                            <Link to="/scope" className="tooltip-box" exact="true" data-tip data-for="scope-tip">
                                <FolderPlus/>
                                <ReactTooltip id="scope-tip" place="bottom" effect="solid" arrow>
                                    Scope
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li className='tooltip-box'>
                            <Link to="/scopes-management" exact="true" data-tip data-for="scopes-managment">
                                <Folder/>
                                <ReactTooltip id="scopes-managment" place="bottom" effect="solid">
                                    Scopes Managment
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li>
                            <Link to="/note" className="tooltip-box" exact="true" data-tip data-for="note-tip">
                                <Plus/><CardText/>
                                <ReactTooltip id="note-tip" place="bottom" effect="solid" arrow>
                                    Note
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li>
                            <Link to="/notes-management" className="tooltip-box" exact="true" data-tip data-for="notes-management-tip">
                                <CardText/>
                                <ReactTooltip id="notes-management-tip" place="bottom" effect="solid">
                                    Notes Management
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li>
                            <Link to="/add-element-note" className="tooltip-box" exact="true" data-tip data-for="add-element-note-tip">
                                <Plus/><JournalText/>
                                <ReactTooltip id="add-element-note-tip" place="bottom" effect="solid">
                                    Element Note
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li>
                            <Link to="/element-note-management" className="tooltip-box" exact="true" data-tip data-for="element-note-management-tip">
                                <JournalText/>
                                <ReactTooltip id="element-note-management-tip" place="bottom" effect="solid">
                                    Element Note Management
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li>
                            <Link to="/sources" className="tooltip-box" exact="true" data-tip data-for="sources-tip">
                                <Diagram3/>
                                <ReactTooltip id="sources-tip" place="bottom" effect="solid">
                                    Sources
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li>
                            <Link to="/app-info" className="tooltip-box" exact="true" data-tip data-for="app-info-tip">
                                <InfoCircle/>
                                <ReactTooltip id="app-info-tip" place="bottom" effect="solid">
                                    App Info
                                </ReactTooltip>
                            </Link>
                        </li>
                        <li className="right-aligned">
                            <Link to="/help-center" className="tooltip-box" exact="true" data-tip data-for="help-center-tip">
                                <QuestionCircle/>
                                <ReactTooltip id="help-center-tip" place="bottom" effect="solid">
                                    Help Center
                                </ReactTooltip>
                            </Link>
                        </li>
                        {
                            selectedLang === 'fa' && 
                            <li className='small bordered padded' onClick={changeLangHandler}>
                                <button>
                                    En
                                </button>
                            </li>
                        }
                        {
                            selectedLang === 'en' && 
                            <li className='small bordered padded' onClick={changeLangHandler}>
                                <button>
                                    Fa
                                </button>
                            </li>
                        }
                        <li>
                            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={settingsBtnOnClickHandler}>
                                <Gear/>
                            </button>
                        </li>
                        <li>
                            <Link to="/" exact="true" onClick={signOutBtnOnClickHandler}>
                                <BoxArrowInRight/>
                            </Link>
                        </li>
                    </ul>
                }
            </nav>
            {ReactDOM.createPortal(
                <SettingsModal/>,
                document.getElementById('overlay-root')
            )}
        </Fragment>
    );
}

export default Nav;