import React , { useContext, useState , Fragment } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { useHttpClient } from '../shared/hooks/http-hook';

import AuthContext from '../contexts/auth-context';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function AddScope(){

    const [name, setName] = useState('');
    const [nameIsValid,setNameIsValid] = useState(true);

    const [ckEditorContent, setCKEditorContent] = useState('');

    const {isLoading, sendReq} = useHttpClient();

    const authContext = useContext(AuthContext);

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

    async function addScopeHandler(){
 
        if(!name.trim())
            return;

        try{
            await sendReq(
                'http://localhost:5000/api/scopes',
                'POST',
                undefined,
                JSON.stringify(function(){
                    let body = {
                        name,
                    };
                    if(ckEditorContent)
                        body.desc = ckEditorContent;
                    return body;
                }())
            );
        }catch(err){
 
        }
    }

    return (
        <div className="add-scope-page p-3">
            {
                !authContext.userIsSignedIn ?
                <PageUnaccessibilityMsg/>
                :
                <Fragment>
                    <div className={'spinner-wrapper d-flex justify-content-center align-items-center' + (isLoading ? '' : ' visually-hidden')}>
                        <div className="spinner-border text-primary" role="status"></div>
                    </div> 
                    <div className="row">
                        <form className="add-scope-segment needs-validation" onSubmit={formSubmissionHandler}>
                            <div className="p-2 col-md-6">
                                <h4 className='inline page-title'>
                                    Add Scope
                                </h4>
                                <NotableElementInfoIcon 
                                    elementLocation = 'add-scope-page'
                                    elementName = 'add-scope-page'
                                />
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
                                        height: '500px', // ?????? ?????? ?????? ??????
                                    }}
                                    onReady={ editor => {

                                        if(editor)
                                            editor.ui.getEditableElement().parentElement.insertBefore(
                                                editor.ui.view.toolbar.element,
                                                editor.ui.getEditableElement()
                                            );
                                            
                                        // this.editor = editor; // ?????? ?????????? ??????
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
                </Fragment>
            }
        </div>
    ); 
}

export default AddScope;