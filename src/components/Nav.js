import React, { Component, Fragment, useState, useCallback} from 'react';

import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';

import { Button, Modal, Toast } from 'react-bootstrap';

import { HouseDoorFill, Plus, CardText, BoxArrowInRight, Gear ,InfoCircle ,JournalText, FolderPlus, Folder, Diagram3, PersonPlusFill, PersonCircle} from 'react-bootstrap-icons';

import './Nav.css';
 
function Nav(props){

    let
        selectedLang = props.selectedLang,
        setLang = props.setLang,
        userIsSignedIn = props.userIsSignedIn,
        settingsModal
    ;

    const [showSettingsModal, setSettingsModalDisplay] = useState(false);
    const [err, setErr] = useState(null);

    function changeLangHandler(){
        if(selectedLang === 'en')
            setLang('fa');
        else if(selectedLang === 'fa')
            setLang('en');
    }

    function CreateToast() {
        const [toastIsShown, setToastIsShown] = useState(false);
      
        function toastOnCloseHandler(){
            setToastIsShown(false);
        }
      
        return (
            <Toast show={toastIsShown} onClose={toastOnCloseHandler}>
                <Toast.Body>
                   This is an err
                </Toast.Body>
            </Toast>
        );
    }

    class SettingsModalClassComponent extends Component{

        constructor(){
            super();
            this.state = {
                isShown: false,
            };
        }

        handleModalDisplay() {
            this.setState({ isShown: !this.state.isShown });
        }

        render (){
            return (
                <Modal show={this.state.isShown} >
                    <Modal.Header closeButton>
                    <   Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Woohoo, you're reading this text in a modal!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalDisplay}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                // <div className="modal" show={true} tabindex="-1">
                //     <div className="modal-dialog">
                //         <div className="modal-content">
                //         <div className="modal-header">
                //             <h5 className="modal-title">Modal title</h5>
                //             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                //         </div>
                //         <div className="modal-body">
                //             <p>Modal body text goes here.</p>
                //         </div>
                //         <div className="modal-footer">
                //             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                //             <button type="button" className="btn btn-primary">Save changes</button>
                //         </div>
                //         </div>
                //     </div>
                // </div>
            );
        }
    }

    function SettingsModal(props) {

        const handleClose = () => setSettingsModalDisplay(false);
        const [serverCodeStructure, setServerCodeStructure] = useState();
        const [spinnerIsShown, setSpinnerIsShown] = useState(false);

        const fetchServerCodeTypeHandler = useCallback(async () => {

            setSpinnerIsShown(true);
            try{
                const response = await fetch('http://localhost:5000/api/server-code-structure',{
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                });
    
                const data = await response.json();
                if(!response.ok)
                    throw new Error(data.message);
                // throw new Error('this is an err just for testing.');
                setServerCodeStructure(data[0].structure);
                setSpinnerIsShown(false);
            }catch(err){
                setSpinnerIsShown(false);
                // ReactDOM.createPortal(
                //     <CreateToast/>,
                //     document.getElementById('toasts-container-root')
                // );
            }
        },[]);

        function onEnterHandler(){
            fetchServerCodeTypeHandler();
        }

        function serverCodeTypeRadioBtnOnClickHandler(e){
            setServerCodeStructure(e.target.getAttribute('data-val'));
        }

        async function saveSettingsHandler(e){
     
            try{
                await fetch('http://localhost:5000/api/server-code-structure',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        structure: serverCodeStructure,
                    }),
                });
    
                handleClose();
            }catch(err){
                setErr(err.message);
                handleClose();
            }
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
                onEnter={onEnterHandler}
            >
                <div className={'modal-spinner-wrapper d-flex justify-content-center align-items-center' +(spinnerIsShown ? '' : ' visually-hidden')}>
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
        setSettingsModalDisplay(true)
    }

    function exitBtnOnClickHandler(){
        localStorage.removeItem('userIsSignedIn');
        props.setUserIsSignedIn(false);
    }

    return (
        <Fragment>
            <nav>
                {
                    !userIsSignedIn && 
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
                    userIsSignedIn &&
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
                            <Link to="/add-scope" className="tooltip-box" exact="true" data-tip data-for="add-scope-tip">
                                <FolderPlus/>
                                <ReactTooltip id="add-scope-tip" place="bottom" effect="solid" arrow>
                                    Add Scope
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
                            <Link to="/add-note" className="tooltip-box" exact="true" data-tip data-for="add-note-tip">
                                <Plus/><CardText/>
                                <ReactTooltip id="add-note-tip" place="bottom" effect="solid" arrow>
                                    Add Note
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
                                    Add Element Note
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
                        {
                            selectedLang === 'fa' && 
                            <li className='small right-aligned bordered padded' onClick={changeLangHandler}>
                                <button>
                                    En
                                </button>
                            </li>
                        }
                        {
                            selectedLang === 'en' && 
                            <li className='small right-aligned bordered padded' onClick={changeLangHandler}>
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
                            <Link to="/" exact="true" onClick={exitBtnOnClickHandler}>
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