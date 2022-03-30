import React , {useState,useEffect,useCallback,useRef} from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import './AddElementNote.css';

function AddElementNote(){
    
    const pageSpinnerRef = useRef();
    const [notableElementsDatas, setNotableElementsDatas] = useState([]);
    const [selectedNotableElementData, setSelectedNotableElementData] = useState([]);
    const [selectedNotableElementsLocation, setSelectedNotableElementsLocation] = useState();
    const [ckEditorContent, setCKEditorContent] = useState('');
    const [err, setErr] = useState(null);

    const activeHttpReqs = useRef([]);

    function pageSpinnerDisplay(val){
        if(arguments.length){
            if(val === 'show')
                pageSpinnerRef.current.classList.remove('visually-hidden');
            else if(val === 'hide')
                pageSpinnerRef.current.classList.add('visually-hidden');
        }
    }

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

        const httpAbortCtrl = new AbortController;
        activeHttpReqs.current.push(httpAbortCtrl);
        try{
            const response = await fetch('http://localhost:5000/api/elements-notes/',{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
                signal: httpAbortCtrl.signal,
            });

            const data = await response.json();

            // activeHttpReqs.current = activeHttpReqs.current.filter(
            //     reqCtrl => reqCtrl !== httpAbortCtrl
            // );

            if(!response.ok)
                throw new Error(data.message);  
       
            if(data.length){
                let elementNoteLocationsMap = {};
                for(let i in data){
                    let location = data[i].location;
                    if(!(location in elementNoteLocationsMap))
                        elementNoteLocationsMap[location] = {};

                    elementNoteLocationsMap[location][data[i].name] = data[i];
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
            setErr(err.message);
        }
    },[]);

    const saveElementNoteHandler = useCallback(async () => {

        pageSpinnerDisplay('show');

        let validationErrs = [];

        if(!ckEditorContent)
            validationErrs.push('note');

        if(validationErrs.length){
            pageSpinnerDisplay('hide');
            return;
        }

        const httpAbortCtrl = new AbortController;
        activeHttpReqs.current.push(httpAbortCtrl);
        try{
            const res = await fetch('http://localhost:5000/api/elements-notes/',{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    elementNoteLocation: selectedNotableElementData.location,
                    elementNoteName: selectedNotableElementData.name,
                    note: ckEditorContent,
                }),
                signal: httpAbortCtrl.signal,
            });

            const data = await res.json();

            notableElementsDatas[selectedNotableElementData.location][selectedNotableElementData.name] = data; // تحقیق شود که آیا این کار صحیح است؟
        }catch(err){
            setErr(err.message);
        }

        pageSpinnerDisplay('hide');
    },[selectedNotableElementData,ckEditorContent]);

    useEffect(() => {
        fetchElementsSpecsHandler();
    },[fetchElementsSpecsHandler]);

    useEffect(() => {
        return () => {
            activeHttpReqs.current.forEach(abortCtrl => abortCtrl.abort());
        }
    },[]);

    return (
        <div className="add-element-note-page p-3">
            <div ref={pageSpinnerRef} className="modal-spinner-wrapper d-flex justify-content-center align-items-center visually-hidden">
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
        </div>
    ); 
}

export default AddElementNote;