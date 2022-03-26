import React , {useState, useEffect, useCallback} from 'react';

import { InfoCircle, Pencil,Trash } from 'react-bootstrap-icons';

function ElementNoteManagement(){

    const [elementsNotesDatas, setElementsNotesDatas] = useState([]);
    const [isLoadingMsg, setLoadingMsg] = useState(false);
    const [err, setErr] = useState(null);

    const fetchElementsNotesHandler = useCallback(async () => {

        setLoadingMsg(true);
        setErr(null);

        try{
            const response = await fetch('http://localhost:5000/api/elements-notes/',{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const data = await response.json();
            if(!response.ok)
                throw new Error(data.message); // آیا throw بماند؟

            const elementsNotesDatasArray = [];

            for(const id in data)
                elementsNotesDatasArray.push(data[id]);

            setElementsNotesDatas(elementsNotesDatasArray);
            setLoadingMsg(false);
        }catch(err){
            setLoadingMsg(false);
            setErr(err.message);
        }
    },[]);

    useEffect(() => {
        fetchElementsNotesHandler();
    },[fetchElementsNotesHandler]);

    let content;

    if(elementsNotesDatas.length === 0)
        content = (
            <tr>
                <td colSpan="4">
                    No subjects added
                </td>
            </tr>
        );

    if(elementsNotesDatas.length > 0)
        content = elementsNotesDatas.map((elementNoteData,i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td>
                    {elementNoteData.location}
                </td>
                <td>
                    {elementNoteData.element}
                </td>
                <td>
                    <div className="btn-group me-2" role="group" aria-label="First group">
                        <button type="button" className="btn btn-success btn-sm">
                            <i className="bi bi-trash-fill"></i>
                            <Pencil />
                        </button>
                    </div>
                    <div className="btn-group me-2" role="group" aria-label="Second group">
                        <button type="button" className="btn btn-danger btn-sm">
                            <Trash />
                        </button>
                    </div>
                </td>
            </tr>
        ));

    if(err)
        content = <tr>
            <td colSpan="4">{err}</td>
        </tr>;

    if(isLoadingMsg)
        content = <tr>
            <td colSpan="4">Loading ...</td>
        </tr>;

    return (
        <div className="element-note-management-page container-fluid p-3">
            <h4 className='inline page-title'>
              Element Note Management
            </h4>
            <InfoCircle/>
            <div className="element-note-list-segment">
                <table className="table table-bordered table-striped table-hover table-non-fluid table-sm">
                    <thead>
                        <tr>
                            <th scope="col">R</th>
                            <th scope="col">Name/Link</th>
                            <th scope="col">Notes Count</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </table>
            </div>
        </div>
    ); 
}

export default ElementNoteManagement;