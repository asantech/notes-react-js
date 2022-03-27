import React , {useState,useEffect,useCallback} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { InfoCircle } from 'react-bootstrap-icons';

function AddNote(){
    
    const [scopeDatas, setScopeData] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedScopeId, setSelectedScopeId] = useState(null);
    const [selectedSrcTypeIsURLType, setSelectedSrcTypeIsURLType] = useState('false');
    const [srcTypeIsBook, setSrcTypeIsBook] = useState('false');
    const [bookName, setBookName] = useState('');
    const [selectedSrcTypeId, setSelectedSrcTypeId] = useState(null);
    const [titleIsValid, setTitleIsValid] = useState(true);
    const [bookNameIsValid, setBookNameIsValid] = useState(true);
    const [srcURL, setSrcURL] = useState('');
    const [srcURLIsValid, setSRCURLIsValid] = useState(true);
    const [ckEditorContent, setCKEditorContent] = useState('');
    const [isAddBtnSpinnerDisplayed, setAddBtnSpinnerDisplay] = useState(false);
    const [err, setErr] = useState(null);

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

    async function addNoteHandler(e){
 
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

        if(srcTypeIsBook === 'true'){
            if(!bookName){
                validationErrs.push('bookName');
                setBookNameIsValid(false);
            }
        }

        if(validationErrs.length){
            setAddBtnSpinnerDisplay(false);
            return;
        }

        try{
            await fetch('http://localhost:5000/api/notes',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(function(){
                    let paramsObj = {
                        title,
                        scopeId: selectedScopeId,
                        sourceTypeId: selectedSrcTypeId,
                        desc: ckEditorContent,
                    };

                    if(srcURL)
                        paramsObj.srcURL = srcURL;

                    if(bookName)
                        paramsObj.bookName = bookName;

                    return paramsObj;
                }()),
            });

            setTitle('');
            setSrcURL('');
            setBookName('');
            setCKEditorContent('');
        }catch(err){
            setErr(err.message);
        }

        setAddBtnSpinnerDisplay(false);
    }

    function scopeOnChangeHandler(e){
        let selectedOptionDOM = e.target.selectedOptions[0];
        setSelectedScopeId(selectedOptionDOM.getAttribute('value'));
    }

    function sourceTypeOnChangeHandler(e){
        let selectedOptionDOM = e.target.selectedOptions[0];
        setSelectedSrcTypeIsURLType(selectedOptionDOM.getAttribute('data-has-url'));
        setSrcTypeIsBook(selectedOptionDOM.getAttribute('data-is-book-type'))
        setSelectedSrcTypeId(selectedOptionDOM.getAttribute('value'));
        setSRCURLIsValid(true);
        setBookNameIsValid(true);
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
        setBookName(event.target.value);
        if(bookName.trim())
            setBookNameIsValid(true);
    }

    function bookNameInputFocusHandler(){
        setBookNameIsValid(true);
    }

    function titleInputFocusHandler(){
        setTitleIsValid(true);
    }

    function srcURLInputFocusHandler(){
        setSRCURLIsValid(true);
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
                <InfoCircle/>
            </div>
            <div className="add-note-segment">
                <div className="mb-3 col-md-7">
                    <label className="form-label" htmlFor="title">Title</label>
                    <input id="title" name="title" type="text" className={'form-control ' + (titleIsValid ? '' : 'is-invalid')} placeholder="title" onChange={titleInputOnChangeHandler} onFocus={titleInputFocusHandler} value={title} autoComplete='off'></input>
                    <div className="invalid-feedback">
                        Please enter note's title
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-2">
                        <label className="form-label" htmlFor="Scope">Scope</label>
                        <select className="form-select" aria-label="Default select example" onChange={scopeOnChangeHandler}>
                            {
                                scopeDatas.map((scope,i) => (
                                    <option key={scope._id} value={scope._id}>{scope.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-3 col-md-2">
                        <label className="form-label" htmlFor="source-type">SourceType</label>
                        <select className="form-select" aria-label="Default select example" onChange={sourceTypeOnChangeHandler}>
                            <option value="user-note" data-has-url="false" data-is-book-type="false" defaultValue>User Note</option>
                            <option value="web-content" data-has-url="true" data-is-book-type="false">Web Content</option>
                            <option value="web-video" data-has-url="true" data-is-book-type="false">Web Video</option>
                            <option value="book" data-has-url="false" data-is-book-type="true">Book</option>
                            <option value="video-course" data-has-url="false" data-is-book-type="false">Video Course</option>
                        </select>
                    </div>
                </div>
                <div className={'mb-3 col-md-7' + (selectedSrcTypeIsURLType === 'false' ? ' visually-hidden' : '')}>
                    <label className="form-label" htmlFor="source-url">Source URL</label>
                    <input id="source-url" name="source-url" type="text" className={'form-control ' + (srcURLIsValid ? '' : 'is-invalid')} placeholder="source URL" onChange={srcURLInputOnChangeHandler} onFocus={srcURLInputFocusHandler} value={srcURL} autoComplete="off"></input>
                    <div className="invalid-feedback">
                        Please enter note's source URL
                    </div>
                </div>
                <div className={'mb-3 col-md-7' + (srcTypeIsBook === 'false' ? ' visually-hidden' : '')}>
                    <label className="form-label" htmlFor="source-url">Book Name</label>
                    <input id="book-name" name="book-name" type="text" className={'form-control ' + (bookNameIsValid ? '' : 'is-invalid')} placeholder="source URL" onChange={bookNameInputOnChangeHandler} onFocus={bookNameInputFocusHandler} value={bookName} autoComplete="off"></input>
                    <div className="invalid-feedback">
                        Please enter book's name
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <CKEditor
                        onReady={ editor => {

                            editor.ui.getEditableElement().parentElement.insertBefore(
                                editor.ui.view.toolbar.element,
                                editor.ui.getEditableElement()
                            );

                            // this.editor = editor;
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
                        config={ {
                            height: '500px',
                        } }
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