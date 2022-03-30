import React , {useState, useEffect, useCallback} from 'react';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import {useHttpClient} from '../shared/hooks/http-hook';

function extractTextFromHTMLStr(htmlStr) {
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = htmlStr;
    return tmpDiv.textContent || tmpDiv.innerText;
};

function countWords(str) {
    return (
        str
            .replace(/(^\s*)|(\s*$)/gi,'')
            .replace(/[ ]{2,}/gi,' ')
            .replace(/\n /,'\n')
            .split(' ')
            .length
    );
};

function getWordsCount(str) {                            
    return (
        str
            .split(' ')
            .filter(n => n != '')
            .length
    );
}

function ElementNoteManagement(){

    const [elementsNotesDatas, setElementsNotesDatas] = useState([]);
    const [isLoadingMsg, setLoadingMsg] = useState(false);
    // const [err, setErr] = useState(null);

    const {isLoading, err, sendRequest, clearErr} = useHttpClient();
    // const fetchElementsNotesHandler = useCallback(async () => {

    //     setLoadingMsg(true);
    //     setErr(null);

    //     try{
    //         const response = await fetch('http://localhost:5000/api/elements-notes/',{
    //             method: 'GET',
    //             headers: {
    //                 'Content-type': 'application/json',
    //             },
    //         });

    //         const data = await response.json();
    //         if(!response.ok)
    //             throw new Error(data.message); // آیا throw بماند؟

    //         const elementsNotesDatasArray = [];

    //         for(const id in data)
    //             elementsNotesDatasArray.push(data[id]);

    //         setElementsNotesDatas(elementsNotesDatasArray);
    //         setLoadingMsg(false);
    //     }catch(err){
    //         setLoadingMsg(false);
    //         setErr(err.message);
    //     }
    // },[]);

    const fetchElementsNotesHandler = useCallback(async () => {

        try{
            const responseData = await sendRequest(
                'http://localhost:5000/api/elements-notes/',
                'GET',
                {
                    'Content-type': 'application/json',
                }
            );

            const elementsNotesDatasArray = [];

            for(const id in responseData)
                elementsNotesDatasArray.push(responseData[id]);

            setElementsNotesDatas(elementsNotesDatasArray);
        }catch(err){

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
                <th scope="row" className="text-center">{++i}</th>
                <td>
                    {elementNoteData.location}
                </td>
                <td>
                    {elementNoteData.name}
                </td>
                <td className="text-center">
                    {getWordsCount(extractTextFromHTMLStr(elementNoteData.note))}
                </td>
            </tr>
        ));

    if(err)
        content = (
            <tr>
                <td colSpan="4">{err}</td>
            </tr>
        );

    if(isLoading)
        content = (
            <tr>
                <td colSpan="4">Loading ...</td>
            </tr>
        );

    return (
        <div className="notable-elements-management-page p-3">
            <div className="page-title-box">
                <h4 className='inline page-title'>
                    Element Note Management
                </h4>
                <NotableElementInfoIcon 
                    elementLocation = 'element-note-management-page'
                    elementName = 'element-note-management-page'
                />
            </div>
            <div className="notable-elements-list-segment">
                <table className="table table-bordered table-striped table-hover table-non-fluid table-sm">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">R</th>
                            <th scope="col">Location</th>
                            <th scope="col">Name</th>
                            <th scope="col">Words Count</th>
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