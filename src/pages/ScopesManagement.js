import React , { useState, useEffect, useCallback, Fragment } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { Pencil, Trash, ArrowRepeat } from 'react-bootstrap-icons';

import { confirmDel } from '../shared/funcs/ConfirmDel';

import { useHttpClient } from '../shared/hooks/http-hook';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function NoteListRow(props){

    const navigate = useNavigate();

    const {isLoading: scopeDelLoading, sendReq: sendScopeDelReq, err: scopeDelErr, clearErr: clearScopeDelErr} = useHttpClient();

    async function delBtnOnClickHandler(event){
        if(confirmDel()){
            clearScopeDelErr();
    
            const noteRowId = event.target.closest('.note-row').getAttribute('data-id');
            try{
                const resData = await sendScopeDelReq(
                    `http://localhost:5000/api/scopes/${noteRowId}`,
                    'DELETE'
                );
    
                props.setNotesDatas(resData);
            }catch(err){
        
            }
        };
    }

    function EditNoteBtnOnClickHandler(){
        navigate('../scope',{
            state: {
                ...props.scopeData,
            },
        });
    }
 
    return (
        <tr className='note-row' data-id={props.scopeData._id}>
            <td className="text-center">{props.i + 1}</td>
            <td>
                <a href={props.scopeData.name}>{props.scopeData.name}</a>
            </td>
            <td className="text-center">0</td>
            <td>
                <div className="btn-group me-2" role="group" aria-label="First group">
                    <button type="button" className="btn btn-success btn-sm" onClick={EditNoteBtnOnClickHandler}>
                        <i className="bi bi-trash-fill"></i>
                        <Pencil />
                    </button>
                </div>
                <div className="btn-group me-2" role="group" aria-label="Second group">
                    <button type="button" className="btn btn-danger btn-sm" onClick={delBtnOnClickHandler}>
                        <Trash />
                    </button>
                </div>
            </td>
            <td className={'note-row-spinner-container'+ (scopeDelLoading ? '' : ' visually-hidden')}>
                <div className='spinner-wrapper d-flex justify-content-center align-items-center'>
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div> 
            </td>
        </tr>
    );
}

function ScopesManagement(){

    const auth = useSelector(state => state.auth);

    const [scopeDatas, setScopeData] = useState([]);

    const { isLoading: scopesAreLoading, sendReq: sendLoadScopesReq, err: loadScopesErr, clearErr:  clearLoadScopesErr} = useHttpClient();

    let content;

    const fetchScopesHandler = useCallback(async () => {

        clearLoadScopesErr();

        try{
            const resData = await sendLoadScopesReq('http://localhost:5000/api/scopes');

            const scopesArray = [];

            for(const id in resData)
                scopesArray.push(resData[id]);

            setScopeData(scopesArray);

        }catch(err){

        }
    },[]);

    async function refreshScopesList(){
        fetchScopesHandler();
    }

    useEffect(() => {
        fetchScopesHandler();
    },[fetchScopesHandler]);

    if(scopeDatas.length === 0)
        content = (
            <tr>
                <td colSpan="4">
                    No subjects added
                </td>
            </tr>
        );

    if(scopeDatas.length > 0)
        content = scopeDatas.map((scopeData,i) => (
            <NoteListRow
                key = {scopeData._id}
                i = {i}
                scopeData = {scopeData}
                // setNotesDatas = {setNotesDatas}
            />
        ));

    if(loadScopesErr)
        content = <tr>
            <td colSpan="4">{loadScopesErr}</td>
        </tr>;

    if(scopesAreLoading)
        content = <tr>
            <td colSpan="4">Loading ...</td>
        </tr>;

    return (
        <div className='scopes-management-page p-3'>
            {
                !auth.userIsSignedIn ?
                <PageUnaccessibilityMsg />
                :
                <Fragment>
                    <div className='page-title-box'>
                        <h4 className='inline page-title'>
                            Scopes Management
                        </h4>
                        <NotableElementInfoIcon 
                            elementLocation = 'scopes-management-page'
                            elementName = 'scopes-management-page'
                        />
                        <ArrowRepeat className='m-2' onClick={refreshScopesList}/>
                    </div>
                    <div className="added-scopes-list-segment">
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
                </Fragment>
            }
        </div>
    ); 
}

export default ScopesManagement;