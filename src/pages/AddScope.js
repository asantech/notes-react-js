import React , {useState, useEffect, useCallback} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { InfoCircle } from 'react-bootstrap-icons';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

function AddScope(){

    const [name, setName] = useState('');
    const [nameIsValid,setNameIsValid] = useState(true);

    const [ckEditorContent, setCKEditorContent] = useState('');
    const [isAddBtnSpinnerDisplayed, setAddBtnSpinnerDisplay] = useState(false);
    const [err, setErr] = useState(null);

    const nameInputChangeHandler = event => {
        setName(event.target.value);
    }

    const formSubmissionHandler = event => {
        event.preventDefault();

        if(name.trim() === ''){
            setNameIsValid(false);
            return;
        }
 
        setNameIsValid(true);
        setName('');
        setCKEditorContent('');
    }

    async function addScopeHandler(e){
 
        setAddBtnSpinnerDisplay(true);
 
        if(!name.trim()){
            setAddBtnSpinnerDisplay(false);
            return;
        }

        try{
            await fetch('http://localhost:5000/api/scopes',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(function(){
                    let body = {
                        name,
                    };
                    if(ckEditorContent)
                        body.desc = ckEditorContent;
                    return body;
                }()),
            });
        }catch(err){
            setErr(err.message);
        }

        setAddBtnSpinnerDisplay(false);
    }

    return (
        <div className="add-scope-page p-3">
            <div className="row">
                <form className="add-scope-segment needs-validation" onSubmit={formSubmissionHandler}>
                    <div className="p-2 col-md-6">
                        <h4 className='inline page-title'>
                            Add Scope
                        </h4>
                        <InfoCircle/>
                    </div>
                    <div className="p-2 col-md-6">
                        <label className="form-label" htmlFor="name">name</label>
                        <input id="name" name="name" type="text" className= {'form-control ' + (nameIsValid ? '' : 'is-invalid')} placeholder="name" onChange={nameInputChangeHandler} value={name} autoComplete='off'></input>
                        <div className="invalid-feedback">
                            Please enter scope's name
                        </div>
                    </div>
                    <div className="p-2 col-md-10">
                        <label className="form-label">Description</label>
                        <CKEditor
                            editor={ DecoupledEditor }
                            config={ {
                                height: '500px', // روی این کار شود
                            }}
                            onReady={ editor => {

                                editor.ui.getEditableElement().parentElement.insertBefore(
                                    editor.ui.view.toolbar.element,
                                    editor.ui.getEditableElement()
                                );
                                    
                                // this.editor = editor; // علت بررسی شود
                            }}
                            onError={({willEditorRestart}) => {
                                if (willEditorRestart)
                                    this.editor.ui.view.toolbar.element.remove();
                            }}
                            onBlur = {(evt,editor) => {
                                setCKEditorContent(editor.getData());   
                            }}
                        />
                    </div>
                    <div className="p-2 col-md-12">
                        <button type="submit" className="add-btn btn btn-primary" onClick={addScopeHandler}>
                            <span className={'spinner-border spinner-border-sm' + (isAddBtnSpinnerDisplayed ? '' : ' visually-hidden')} role="status" aria-hidden="true"></span>
                            Add
                        </button>
                    </div>
                </form>
            </div>
            <div className="toast-container">
                <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <img src="..." className="rounded me-2" alt="..."/>
                        <strong className="me-auto">Bootstrap</strong>
                        <small className="text-muted">just now</small>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        See? Just like this.
                    </div>
                </div>

                <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <img src="..." className="rounded me-2" alt="..."/>
                        <strong className="me-auto">Bootstrap</strong>
                        <small className="text-muted">2 seconds ago</small>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        Heads up, toasts will stack automatically
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default AddScope;