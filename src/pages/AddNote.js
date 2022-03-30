import React , {useState,useEffect,useCallback,useRef} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

function AddNote(){
    
    const [scopeDatas, setScopeData] = useState([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState(0);
    const [selectedScopeId, setSelectedScopeId] = useState(null);
    const [selectedSrcTypeIsURLType, setSelectedSrcTypeIsURLType] = useState('false');
    const [srcHasName, setSrcHasName] = useState();
    const [sourceName, setSourceName] = useState('');
    const [selectedSrcTypeId, setSelectedSrcTypeId] = useState(null);
    const [titleIsValid, setTitleIsValid] = useState(true);
    const [sourceNameIsValid, setSourceNameIsValid] = useState(true);
    const [srcURL, setSrcURL] = useState('');
    const [srcURLIsValid, setSRCURLIsValid] = useState(true);
    const [ckEditorContent, setCKEditorContent] = useState('');
    const [isAddBtnSpinnerDisplayed, setAddBtnSpinnerDisplay] = useState(false);
    const [err, setErr] = useState(null);

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

    const activeHttpReqs = useRef([]);

    function noteTypeOnChangeHandler(e){
        setType(+e.target.getAttribute('data-val'));
    }

    function scopeOnChangeHandler(e){
        let selectedOptionDOM = e.target.selectedOptions[0];
        setSelectedScopeId(selectedOptionDOM.getAttribute('value'));
    }

    function sourceTypeOnChangeHandler(e){
        let 
            selectedOptionDOM = e.target.selectedOptions[0],
            selectedOptionDOMData = JSON.parse(selectedOptionDOM.getAttribute('data-data')) 
        ;
        setSelectedSrcTypeId(selectedOptionDOM.getAttribute('data-id'));
        setSelectedSrcTypeIsURLType(selectedOptionDOMData.hasURL);
        setSrcHasName(selectedOptionDOMData.hasName)
        setSRCURLIsValid(true);
        setSourceNameIsValid(true);
    }

    const titleInputOnChangeHandler = event => {
        setTitle(event.target.value);
        if(title.trim())
            setTitleIsValid(true);
    }

    function srcURLInputOnChangeHandler(event){
        setSrcURL(event.target.value);
        if(srcURL.trim())
            setSRCURLIsValid(true);
    }

    function bookNameInputOnChangeHandler(event){
        setSourceName(event.target.value);
        if(sourceName.trim())
            setSourceNameIsValid(true);
    }

    function bookNameInputFocusHandler(){
        setSourceNameIsValid(true);
    }

    function titleInputFocusHandler(){
        setTitleIsValid(true);
    }

    function srcURLInputFocusHandler(){
        setSRCURLIsValid(true);
    }

    const fetchScopesHandler = useCallback(async () => {

        try{
            const response = await fetch('http://localhost:5000/api/scopes',{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const data = await response.json();
            if(!response.ok)
                throw new Error(data.message);  

            setScopeData(data);
            if(data.length)
                setSelectedScopeId(data[0]._id);
        }catch(err){
            setErr(err.message);
        }
    },[]);

    async function addNoteHandler(){
 
        setAddBtnSpinnerDisplay(true);

        let validationErrs = [];
   
        if(!title.trim()){
            validationErrs.push('title');
            setTitleIsValid(false);
        }
 
        if(!ckEditorContent){
            validationErrs.push('note');
        }
 
        if(selectedSrcTypeIsURLType === 'true'){
            if(!srcURL){
                validationErrs.push('srcURL');
                setSRCURLIsValid(false);
            }
        }
 
        if(srcHasName === 'true'){
            if(!sourceName){
                validationErrs.push('sourceName');
                setSourceNameIsValid(false);
            }
        }
 
        if(validationErrs.length){
            setAddBtnSpinnerDisplay(false);
            return;
        }
 
        try{
            // const httpAbortCtrl = new AbortController;
            // httpAbortCtrl.current.push(httpAbortCtrl);
            await fetch('http://localhost:5000/api/notes',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(function(){
                    let paramsObj = {
                        scopeId: selectedScopeId,
                        sourceTypeId: selectedSrcTypeId,
                        title,
                        type,
                        note: ckEditorContent,
                    };

                    if(srcURL)
                        paramsObj.srcURL = srcURL;

                    if(sourceName)
                        paramsObj.sourceName = sourceName;

                    return paramsObj;
                }()),
                // signal: httpAbortCtrl.signal
            });

            (function ResetAllELements(){
                setTitle('');
                setType(0);
                setSrcURL('');
                setSourceName('');
                setCKEditorContent('');
            })();
        }catch(err){
            setErr(err.message);
        }

        setAddBtnSpinnerDisplay(false);
    }

    useEffect(() => {
        fetchScopesHandler();
        setSelectedSrcTypeId('user-note');
    },[fetchScopesHandler]);

    return (
        <div className="add-note-page p-3">
            <div className='page-title-box'>
                <h4 className='inline page-title'>
                    Add Note
                </h4>
                <NotableElementInfoIcon 
                    elementLocation = 'add-note-page'
                    elementName = 'add-note-page'
                />
            </div>
            <div className="add-note-segment">
                <div className="mb-3 col-md-7">
                    <label className="form-label" htmlFor="title">Title</label>
                    <input id="title" name="title" type="text" className={'form-control ' + (titleIsValid ? '' : 'is-invalid')} placeholder="title" onChange={titleInputOnChangeHandler} onFocus={titleInputFocusHandler} value={title} autoComplete='off'></input>
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
                        <select className="form-select" aria-label="Default select example" onChange={scopeOnChangeHandler}>
                            {
                                scopeDatas.map((scope) => (
                                    <option key={scope._id} value={scope._id}>{scope.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-3 col-md-2">
                        <label className="form-label" htmlFor="source-type">SourceType</label>
                        <select className="form-select" aria-label="Default select example" defaultValue={selectedSrcTypeId} onChange={sourceTypeOnChangeHandler}>
                            {
                                srcTypes.map((srcType) => (
                                    <option key={srcType.id} value={srcType.id} data-data={JSON.stringify(srcType.data)}>{srcType.lbl}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className={'mb-3 col-md-7' + (srcHasName === false ? ' visually-hidden' : '')}>
                    <label className="form-label" htmlFor="source-name">Source's Name</label>
                    <input id="source-name" name="source-name" type="text" className={'form-control ' + (sourceNameIsValid ? '' : 'is-invalid')} placeholder="source URL" onChange={bookNameInputOnChangeHandler} onFocus={bookNameInputFocusHandler} value={sourceName} autoComplete="off"></input>
                    <div className="invalid-feedback">
                        Please enter source's name
                    </div>
                </div>
                <div className={'mb-3 col-md-7' + (selectedSrcTypeIsURLType === false ? ' visually-hidden' : '')}>
                    <label className="form-label" htmlFor="source-url">Source URL</label>
                    <input id="source-url" name="source-url" type="text" className={'form-control ' + (srcURLIsValid ? '' : 'is-invalid')} placeholder="source URL" onChange={srcURLInputOnChangeHandler} onFocus={srcURLInputFocusHandler} value={srcURL} autoComplete="off"></input>
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
                <button type="button" className="add-btn btn btn-primary" onClick={addNoteHandler}>
                    <span className={'spinner-border spinner-border-sm' + (isAddBtnSpinnerDisplayed ? '' : ' visually-hidden')} role="status" aria-hidden="true"></span>
                    Add
                </button>
            </div>
        </div>
    ); 
}

export default AddNote;