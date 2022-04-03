import { useContext, useState, useEffect, useCallback, Fragment } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { useHttpClient } from '../shared/hooks/http-hook';

import AuthContext from '../contexts/auth-context';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function AddElementNote(){
    // اجرا شدن کد جاوا اسکریپت را براساس ورود داشتن فرد شرطی شود
    const authContext = useContext(AuthContext);
  
    const {isLoading, sendRequest} = useHttpClient();
    
    const [notableElementsDatas, setNotableElementsDatas] = useState([]);
    const [selectedNotableElementData, setSelectedNotableElementData] = useState([]);
    const [selectedNotableElementsLocation, setSelectedNotableElementsLocation] = useState();
    const [ckEditorContent, setCKEditorContent] = useState('');

    function selectedElementLocationOnChangeHandler(e){
        let 
            selectedOptionDOM = e.target.selectedOptions[0],
            selectedNotableElementsLocation = selectedOptionDOM.getAttribute('value'),
            firstNotableElementData = Object.values(notableElementsDatas[selectedNotableElementsLocation])[0]
        ;

        setSelectedNotableElementsLocation(selectedNotableElementsLocation);
        setSelectedNotableElementData(firstNotableElementData);
        setCKEditorContent(firstNotableElementData.note);
    }
    
    function selectedElementNameOnChangeHandler(e){
        let 
            selectedOptionDOM = e.target.selectedOptions[0],
            selectedNotableElementData = notableElementsDatas[selectedOptionDOM.getAttribute('data-location')][selectedOptionDOM.getAttribute('value')]
        ;
        setSelectedNotableElementData(selectedNotableElementData);
        setCKEditorContent(selectedNotableElementData.note);
    }

    const fetchElementsSpecsHandler = useCallback(async () => {

        try{
            const resData = await sendRequest('http://localhost:5000/api/elements-notes/');

            if(resData.length){
                let elementNoteLocationsMap = {};
                for(let i in resData){
                    let location = resData[i].location;
                    if(!(location in elementNoteLocationsMap))
                        elementNoteLocationsMap[location] = {};

                    elementNoteLocationsMap[location][resData[i].name] = resData[i];
                } 

                let 
                    firstNotableElementsLocation = Object.keys(elementNoteLocationsMap)[0],
                    firstNotableElementData = Object.values(elementNoteLocationsMap[firstNotableElementsLocation])[0]
                ;
    
                setNotableElementsDatas(elementNoteLocationsMap);
                setSelectedNotableElementsLocation(firstNotableElementsLocation);
                setSelectedNotableElementData(firstNotableElementData);
                setCKEditorContent(firstNotableElementData.note);
            }
        }catch(err){
             
        }
    },[]);

    const saveElementNoteHandler = useCallback(async () => {

        let validationErrs = [];

        if(!ckEditorContent)
            validationErrs.push('note');

        if(validationErrs.length)
            return;

        try{
            const resData = await sendRequest(
                'http://localhost:5000/api/elements-notes/',
                'PATCH',
                undefined,
                JSON.stringify({
                    elementNoteLocation: selectedNotableElementData.location,
                    elementNoteName: selectedNotableElementData.name,
                    note: ckEditorContent,
                })
            );

            notableElementsDatas[selectedNotableElementData.location][selectedNotableElementData.name] = resData; // تحقیق شود که آیا این کار صحیح است؟
        }catch(err){
       
        }

    },[selectedNotableElementData.location,selectedNotableElementData.name,ckEditorContent]);

    useEffect(() => {
        fetchElementsSpecsHandler();
    },[fetchElementsSpecsHandler]);

    return (
        <div className="add-element-note-page p-3">
            {
                !authContext.userIsSignedIn ?
                <PageUnaccessibilityMsg/>
                :
                <Fragment>
                    <div className={'fixed spinner-wrapper d-flex justify-content-center align-items-center' + (isLoading ? '' : ' visually-hidden')}>
                        <div className="spinner-border text-primary" role="status"></div>
                    </div> 
                    <div className='page-title-box'>
                        <h4 className='inline page-title'>
                            Element Note
                        </h4>
                        <NotableElementInfoIcon 
                            elementLocation = 'add-element-note-page'
                            elementName = 'add-element-note-page'
                        />
                    </div>
                    <div className="add-element-note-segment">
                        <div className="row">
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Element Location</label>
                                <select className="form-select" aria-label="Default select example" onChange={selectedElementLocationOnChangeHandler}>
                                    {
                                        Object.keys(notableElementsDatas).map((notableElementLocation,i) => {
                                            return (
                                                <option key={i} value={notableElementLocation}>{notableElementLocation}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mb-3 col-md-3">
                                <label className="form-label">Element Name</label>
                                <select className="form-select" aria-label="Default select example" onChange={selectedElementNameOnChangeHandler}>
                                    {
                                        notableElementsDatas[selectedNotableElementsLocation] &&
                                        Object.values(notableElementsDatas[selectedNotableElementsLocation]).map((notableElement,i) => {
                                            return (
                                                <option key={notableElement._id} value={notableElement.name} data-location={selectedNotableElementsLocation}>{notableElement.name}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <CKEditor
                                onReady={ editor => {

                                    if(editor) // روش های دیگر هم بررسی شود
                                        editor.ui.getEditableElement().parentElement.insertBefore(
                                            editor.ui.view.toolbar.element,
                                            editor.ui.getEditableElement()
                                        );

                                    // this.editor = editor;
                                }}
                                onError={({willEditorRestart}) => {
                                    if (willEditorRestart)
                                        this.editor.ui.view.toolbar.element.remove(); // آیا نیازی به گذاشتن شرط وجود editor هست؟
                                }}
                                onBlur = {(evt,editor) => {
                                    setCKEditorContent(editor.getData());   
                                }}
                                data = {ckEditorContent}
                                editor={DecoupledEditor}
                            />
                        </div>
                        <button type="button" className='add-btn btn btn-success' onClick={saveElementNoteHandler}>
                            Save
                        </button>
                    </div>
                </Fragment>
            }
        </div>
    ); 
}

export default AddElementNote;