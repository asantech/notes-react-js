import React , { useContext, useState, useEffect, useCallback, Fragment } from 'react';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { ArrowRepeat } from 'react-bootstrap-icons';

import { useHttpClient } from '../shared/hooks/http-hook';

import { extractTextFromHTMLStr } from '../shared/funcs/ExtractTxtFromHTML';

import { getWordsCount } from '../shared/funcs/GetWordsCount';

import AuthContext from '../contexts/auth-context';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function ElementNoteManagement(){

    const [elementsNotesDatas, setElementsNotesDatas] = useState([]);
    const {isLoading, err, sendReq, clearErr} = useHttpClient();

    const authContext = useContext(AuthContext);

    let content;

    const fetchElementsNotesHandler = useCallback(async () => {

        clearErr();
        try{
            const resData = await sendReq('http://localhost:5000/api/elements-notes/');

            const elementsNotesDatasArray = [];

            for(const id in resData)
                elementsNotesDatasArray.push(resData[id]);

            setElementsNotesDatas(elementsNotesDatasArray);
        }catch(err){

        }
    },[]);

    async function refreshElementsNotesList(){
        fetchElementsNotesHandler();
    } 

    useEffect(() => {
        fetchElementsNotesHandler();
    },[fetchElementsNotesHandler]);
 
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
            {
                !authContext.userIsSignedIn ?
                <PageUnaccessibilityMsg/>
                :
                <Fragment>
                    <div className="page-title-box">
                        <h4 className='inline page-title'>
                            Element Note Management
                        </h4>
                        <NotableElementInfoIcon 
                            elementLocation = 'element-note-management-page'
                            elementName = 'element-note-management-page'
                        />
                        <ArrowRepeat className='m-2' onClick={refreshElementsNotesList}/>
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
                </Fragment>
            }
        </div>
    ); 
}

export default ElementNoteManagement;