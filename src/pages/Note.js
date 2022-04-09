import React , { useState, useEffect, useCallback, useReducer , Fragment } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate, useLocation } from 'react-router-dom';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { useHttpClient } from '../shared/hooks/http-hook';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

const titleReducer = (state, action) => {
    if(action.type === 'INPUT_ON_CHANGE')
        return {
            value: action.val,
            isValid: action.val.trim() ? true : null,
        };
    else if(action.type === 'INPUT_ON_FOCUS') 
        return {
            value: state.value,
            isValid: null
        };
    else if(action.type === 'INPUT_ON_SUBMIT')
        return {
            value: state.value.trim(),
            isValid: state.value.trim() ? true : false
        };
    
    return {
        value: '',
        isValid: null,
    };
}; 

const srcReducer = (state,action) => {
    let changedStateProps;

    if(action.type === 'SRC_TYPE_DROPDOWN_ON_CHANGE')
        changedStateProps = {
            id: action.id,
            hasName: action.hasName,
            hasURL: action.hasURL,
            nameIsValid: null,
            urlIsValid: null,
        };
    else if(action.type === 'SRC_NAME_INPUT_ON_CHANGE')
        changedStateProps = {
            name: action.name,
            nameIsValid: action.name.trim() ? true : null,
            isValid: null,
        };
    else if(action.type === 'SRC_URL_INPUT_ON_CHANGE')
        changedStateProps = {
            url: action.url,
            urlIsValid: action.url.trim() ? true : null,
            isValid: null,
        };
    else if(action.type === 'SRC_NAME_INPUT_ON_FOCUS')
        changedStateProps = {
            nameIsValid: null,
        };
    else if(action.type === 'SRC_URL_INPUT_ON_FOCUS')
        changedStateProps = {
            urlIsValid: null,
        };
    else if(action.type === 'SRC_ON_SUBMIT')
        changedStateProps = function(){
            if(state.hasName === false && state.hasURL === false)
                return {
                    isValid: true,
                };
            else if(state.hasName === true && state.hasURL === false)
                return {
                    nameIsValid: state.name ? true : false,
                    isValid: state.name ? true : false,
                };
            else if(state.hasName === false && state.hasURL === true)
                return {
                    urlIsValid: state.url ? true : false,
                    isValid: state.url ? true : false,
                };
            else if(state.hasName === true  && state.hasURL === true)
                return {
                    nameIsValid: state.name ? true : false,
                    isValid: state.name && state.url ? true : false,
                };
        }();
    else if(action.type === 'SRC_RESET')
        changedStateProps = {
            url: '',
            name: '',
            urlIsValid: null,
            nameIsValid: null,
            isValid: null,
        };
    
    return {
        ...state,
        ...changedStateProps,
    };
}; 

function Note(){

    const srcTypes = [
        {
            id: 'user-note',
            lbl: 'User Note',
            data: {
                hasName: false,
                hasURL: false,
            },
        },
        {
            id: 'web-content',
            lbl: 'Web Content',
            data: {
                hasName: false,
                hasURL: true,
            },
        },
        {
            id: 'web-video',
            lbl: 'Web Video',
            data: {
                hasName: false,
                hasURL: true,
            },
        },
        {
            id: 'book',
            lbl: 'Book',
            data: {
                hasName: true,
                hasURL: false,
            },
        },
        {
            id: 'video-course',
            lbl: 'Video Course',
            data: {
                hasName: true,
                hasURL: true,
            },
        },
    ];

    const auth = useSelector(state => state.auth);
    const location = useLocation();

    const [scopeDatas, setScopeData] = useState([]);
    const [type, setType] = useState(0);
    const [selectedScopeId, setSelectedScopeId] = useState('');
    const [ckEditorContent, setCKEditorContent] = useState('');

    const [pageMode, setPageMode] = useState(null);

    const [titleState, dispatchTitle] = useReducer(titleReducer, {
        value: '',
        isValid: null,  
    });
 
    const [srcState, dispatchSrc] = useReducer(srcReducer,{
        id: srcTypes[0].id,
        hasURL: srcTypes[0].data.hasURL,
        hasName: srcTypes[0].data.hasName,
        url: '',
        name: '',
        urlIsValid: null,
        nameIsValid: null,
        isValid: null,
    });

    const {isLoading, sendReq} = useHttpClient();
    const navigate = useNavigate();

    function noteTypeOnChangeHandler(e){
        setType(+e.target.getAttribute('data-val'));
    }

    function scopeOnChangeHandler(e){
        let selectedOptionDOM = e.target.selectedOptions[0];
        setSelectedScopeId(selectedOptionDOM.getAttribute('value'));
    }

    function srcTypeOnChangeHandler(e){
        let 
            selectedOptionDOM = e.target.selectedOptions[0],
            selectedOptionDOMData = JSON.parse(selectedOptionDOM.getAttribute('data-data')) 
        ;
        dispatchSrc({
            type: 'SRC_TYPE_DROPDOWN_ON_CHANGE',
            id: selectedOptionDOM.getAttribute('value'),
            hasName: selectedOptionDOMData.hasName,
            hasURL: selectedOptionDOMData.hasURL,
        });
    }

    function titleInputOnChangeHandler(event){
        dispatchTitle({
            type: 'INPUT_ON_CHANGE',
            val: event.target.value,
        });
    }

    function titleInputOnFocusHandler(){
        dispatchTitle({
            type: 'INPUT_ON_FOCUS'
        });
    }

    function srcNameInputOnChangeHandler(event){
        dispatchSrc({
            type: 'SRC_NAME_INPUT_ON_CHANGE',
            name: event.target.value,
        });
    }

    function srcURLInputOnChangeHandler(event){
        dispatchSrc({
            type: 'SRC_URL_INPUT_ON_CHANGE',
            url: event.target.value,
        });
    }

    function bookNameInputFocusHandler(){
        dispatchSrc({
            type: 'SRC_NAME_INPUT_ON_FOCUS',
        });
    }

    function srcURLInputFocusHandler(){
        dispatchSrc({
            type: 'SRC_URL_INPUT_ON_FOCUS',
        });
    }

    const fetchScopesHandler = useCallback(async () => {

        try{
            const resData = await sendReq('http://localhost:5000/api/scopes');

            setScopeData(resData);

            // console.log('pageMode',pageMode);

            // if( 
            //     pageMode === 'add' &&
            //     resData.length 
            // )
            //     setSelectedScopeId(resData[0]._id);
        }catch(err){

        }
    },[]);
    
    async function submitNoteHandler(){

        let validationErrsMsgs = [];
 
        dispatchTitle({
            type: 'INPUT_ON_SUBMIT',
        });

        dispatchSrc({
            type: 'SRC_ON_SUBMIT',
        })

        if(!titleState.isValid)  
            validationErrsMsgs.push('title is empty');
  
        if(!srcState.isValid){
            if(srcState.hasName){
                if(!srcState.nameIsValid)
                    validationErrsMsgs.push('src name is empty');
            }else{
                if(srcState.hasURL){
                    if(!srcState.urlIsValid)
                        validationErrsMsgs.push('src url is empty');
                }
            }
        }
 
        if(!ckEditorContent)
            validationErrsMsgs.push('note is empty');

        if(validationErrsMsgs.length)
            return;
 
        try{
            await sendReq(
                'http://localhost:5000/api/notes',
                pageMode === 'add' ? 'POST' : 'PATCH',
                undefined,
                JSON.stringify(function(){
                    let paramsObj = {
                        scopeId: selectedScopeId,
                        title: titleState.value,
                        type,
                        srcTypeId: srcState.id,
                        note: ckEditorContent,
                    };

                    if(pageMode === 'edit')
                        paramsObj._id = location.state._id;

                    if(srcState.hasName)
                        paramsObj.srcName = srcState.name;

                    if(srcState.hasURL && srcState.urlIsValid)
                        paramsObj.srcURL = srcState.url;
          
                    return paramsObj;
                }())
            );

            (function ResetAllELements(){
                if(pageMode === 'add'){
                    dispatchTitle({});
                    setType(0);
                    dispatchSrc({
                        type: 'SRC_RESET',
                    });
                    setCKEditorContent('');
                }else
                    navigate('/notes-management');
            })();
        }catch(err){
 
        }
    }

    useEffect(() => {

        let locationState = location.state;
        if(!locationState)
            setPageMode('add');
        if(
            locationState &&
            '_id' in locationState
        ){
            setPageMode('edit');
            dispatchTitle({
                type: 'INPUT_ON_CHANGE',
                val: locationState.title,
            });

            setType(locationState.type);

            setSelectedScopeId(locationState.scopeId);

            dispatchSrc({
                type: 'SRC_TYPE_DROPDOWN_ON_CHANGE',
                id: location.state.srcTypeId,
                hasName: 'srcName' in location.state,
                hasURL: 'srcURL' in location.state,
            });

            if('srcName' in location.state)
                dispatchSrc({
                    type: 'SRC_NAME_INPUT_ON_CHANGE',
                    name: location.state.srcName,
                });

            if('srcURL' in location.state)
                dispatchSrc({
                    type: 'SRC_URL_INPUT_ON_CHANGE',
                    url: location.state.srcURL,
                });

            setCKEditorContent(locationState.note);
        }
    },[]);

    useEffect(() => {
        fetchScopesHandler();
    },[fetchScopesHandler]);

    // console.log('add note component is rendered');
    return (
        <div className="add-note-page p-3">
            {
                !auth.userIsSignedIn ?
                <PageUnaccessibilityMsg/>
                :
                <Fragment>
                    <div className={'fixed spinner-wrapper d-flex justify-content-center align-items-center' + (isLoading ? '' : ' visually-hidden')}>
                        <div className="spinner-border text-primary" role="status"></div>
                    </div> 
                    <div className='page-title-box'>
                        <h4 className='inline page-title'>
                            {pageMode === 'add' ? 'Add' : 'Edit'} Note
                        </h4>
                        <NotableElementInfoIcon 
                            elementLocation = 'add-note-page'
                            elementName = 'add-note-page'
                        />
                    </div>
                    <div className="add-note-segment">
                        <div className="mb-3 col-md-7">
                            <label className="form-label" htmlFor="title">Title</label>
                            <input id="title" name="title" type="text" className={'form-control' + (titleState.isValid === false ? ' is-invalid' : '')} placeholder="title" onChange={titleInputOnChangeHandler} onFocus={titleInputOnFocusHandler} value={titleState.value} autoComplete='off'></input>
                            <div className="invalid-feedback">
                                Please enter note's title
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Type</label>
                            &nbsp;&nbsp;
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" data-val="0" name="note-type" id="note-type-public" checked={type === 0 ? 'checked' : ''} onChange={noteTypeOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="note-type-public">
                                    public
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" data-val="1" name="note-type" id="note-type-private" checked={type === 1 ? 'checked' : ''} onChange={noteTypeOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="note-type-private">
                                    private
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-2">
                                <label className="form-label" htmlFor="Scope">Scope</label>
                                <select className="form-select" aria-label="Default select example" value={selectedScopeId} onChange={scopeOnChangeHandler}>
                                    {
                                        scopeDatas.map((scope) => (
                                            <option key={scope._id} value={scope._id}>{scope.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="mb-3 col-md-2">
                                <label className="form-label" htmlFor="source-type">SourceType</label>
                                <select className="form-select" aria-label="Default select example" value={srcState.id} onChange={srcTypeOnChangeHandler}>
                                    {
                                        srcTypes.map((srcType) => {
                                            return <option key={srcType.id} value={srcType.id} data-data={JSON.stringify(srcType.data)}>{srcType.lbl}</option>;
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className={'mb-3 col-md-7' + (srcState.hasName === false ? ' visually-hidden' : '')}>
                            <label className="form-label" htmlFor="source-name">Source's Name</label>
                            <input id="source-name" name="source-name" type="text" className={'form-control' + (srcState.nameIsValid === false ? ' is-invalid' : '')} placeholder="source URL" onChange={srcNameInputOnChangeHandler} onFocus={bookNameInputFocusHandler} value={srcState.name} autoComplete="off"></input>
                            <div className="invalid-feedback">
                                Please enter source's name
                            </div>
                        </div>
                        <div className={'mb-3 col-md-7' + (srcState.hasURL === false ? ' visually-hidden' : '')}>
                            <label className="form-label" htmlFor="source-url">Source URL</label>
                            <input id="source-url" name="source-url" type="text" className={'form-control' + (srcState.urlIsValid === false ? ' is-invalid' : '')} placeholder="source URL" onChange={srcURLInputOnChangeHandler} onFocus={srcURLInputFocusHandler} value={srcState.url} autoComplete="off"></input>
                            <div className="invalid-feedback">
                                Please enter note's source URL
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <CKEditor
                                onReady={ editor => {

                                    if(editor)
                                        editor.ui.getEditableElement().parentElement.insertBefore(
                                            editor.ui.view.toolbar.element,
                                            editor.ui.getEditableElement()
                                        );

                                    // this.editor = editor; // علت خطا دادن بررسی شود
                                } }
                                onError={({willEditorRestart}) => {
                                    if (willEditorRestart)
                                        this.editor.ui.view.toolbar.element.remove();
                                }}
                                onBlur = {(evt,editor) => {
                                    setCKEditorContent(editor.getData());   
                                }}
                                data = {ckEditorContent}
                                editor={ DecoupledEditor }
                            />
                        </div>
                        {
                            pageMode === 'add' &&
                            <button type="button" className="add-btn btn btn-primary" onClick={submitNoteHandler}>
                                Add
                            </button>
                        }
                        {
                            pageMode === 'edit' &&
                            <button type="button" className="add-btn btn btn-success" onClick={submitNoteHandler}>
                                Edit
                            </button>
                        }
                    </div>
                </Fragment>
            }
        </div>
    ); 
}

export default Note;